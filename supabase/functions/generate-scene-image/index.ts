import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders } from "../_shared/auth.ts";

serve(async (req) => {
  const cors = getCorsHeaders(req.headers.get('origin'));

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }

  try {
    // --- Auth: extract user from JWT ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify user via anon client
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // --- Parse request body ---
    const { story, killer, killerDescription, finalGirl, location, sceneType } = await req.json();
    if (!story || !killer || !finalGirl || !location) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // --- Look up user's API key + preferred provider using service role ---
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Get preferred provider from settings
    const { data: settingsRow } = await adminClient
      .from('user_image_settings')
      .select('preferred_provider')
      .eq('user_id', user.id)
      .maybeSingle();

    const preferredProvider = settingsRow?.preferred_provider;

    // Get user's API keys
    const { data: keys } = await adminClient
      .from('user_api_keys')
      .select('provider, api_key_encrypted')
      .eq('user_id', user.id);

    if (!keys || keys.length === 0) {
      return new Response(JSON.stringify({ error: 'No API key configured. Add one in My Collection.' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Pick the key: preferred provider first, then first available
    const chosenKey = keys.find(k => k.provider === preferredProvider) ?? keys[0];
    const provider = chosenKey.provider;
    const apiKey = chosenKey.api_key_encrypted;

    // --- Step 1: Extract visual description via Lovable AI ---
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const sceneLabel = sceneType === 'beginning' ? 'opening' : 'closing';

    const killerAppearanceBlock = killerDescription
      ? `\nKILLER APPEARANCE: ${killerDescription}\n`
      : '';

    const extractionPrompt = `You are a horror film cinematographer selecting the most emotionally powerful ${sceneLabel} shot from this story.

CRITICAL RULES:
- Focus on ONE dramatic moment of tension, fear, revelation, or confrontation
- Describe camera angle, framing, lighting, and emotional focus
- Do NOT mention character names - describe them visually instead
- Output ONE vivid sentence describing a powerful cinematic shot
${killerAppearanceBlock}
STORY:
${story}

OUTPUT: One vivid sentence describing a powerful cinematic shot.`;

    const extractResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: extractionPrompt }],
      }),
    });

    if (!extractResponse.ok) {
      console.error('Visual extraction failed:', extractResponse.status);
      throw new Error('Failed to process story content');
    }

    const extractData = await extractResponse.json();
    const visualDescription = extractData.choices?.[0]?.message?.content?.trim() ||
      'Atmospheric vintage scene with dramatic lighting';

    const imagePrompt = `Ultra photorealistic 1980s horror film still. ${visualDescription}

Style: Practical on-set lighting, shallow depth of field, cinematic tension, 35mm film grain.
DO NOT create a movie poster, group portrait, or composite image.
Focus on this single dramatic moment with authentic vintage analog film quality.
Muted, desaturated color palette. Widescreen composition. No text or titles.`;

    // --- Step 2: Generate image using user's chosen provider ---
    let imageUrl: string;

    if (provider === 'google') {
      imageUrl = await generateWithGoogle(apiKey, imagePrompt);
    } else if (provider === 'openai') {
      imageUrl = await generateWithOpenAI(apiKey, imagePrompt);
    } else if (provider === 'stability') {
      imageUrl = await generateWithStability(apiKey, imagePrompt);
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return new Response(
      JSON.stringify({ imageUrl, visualDescription }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-scene-image:', error);
    const msg = error instanceof Error ? error.message : 'Image generation failed';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }
});

// ---- Provider implementations ----

async function generateWithGoogle(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["image", "text"] },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Google API error:', response.status, errText);
    throw new Error('Google image generation failed. Check your API key and quota.');
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find((p: any) => p.inlineData);

  if (!imagePart?.inlineData) {
    throw new Error('No image returned from Google');
  }

  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

async function generateWithOpenAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      moderation: "low",
      n: 1,
      size: "1536x1024",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('OpenAI API error:', response.status, errText);
    try {
      const errJson = JSON.parse(errText);
      const code = errJson?.error?.code;
      if (code === 'content_policy_violation') {
        throw new Error('OpenAI rejected this prompt due to content policy. Try switching to Google Gemini which handles horror themes better.');
      }
      if (code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key. Please check your key in My Collection.');
      }
      if (code === 'insufficient_quota') {
        throw new Error('OpenAI quota exceeded. Please check your billing at platform.openai.com.');
      }
    } catch (e) {
      if (e instanceof Error && e.message.startsWith('OpenAI')) throw e;
    }
    throw new Error('OpenAI image generation failed. Check your API key and quota.');
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error('No image returned from OpenAI');
  }

  return `data:image/png;base64,${b64}`;
}

async function generateWithStability(apiKey: string, prompt: string): Promise<string> {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('output_format', 'png');

  const response = await fetch(
    "https://api.stability.ai/v2beta/stable-image/generate/core",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Stability API error:', response.status, errText);
    throw new Error('Stability AI image generation failed. Check your API key and quota.');
  }

  const data = await response.json();
  const b64 = data.image;
  if (!b64) {
    throw new Error('No image returned from Stability AI');
  }

  return `data:image/png;base64,${b64}`;
}
