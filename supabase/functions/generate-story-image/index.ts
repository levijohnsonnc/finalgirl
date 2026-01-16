import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImageRequest {
  position: number;
  fullStory: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { position, fullStory } = await req.json() as ImageRequest;

    console.log(`Generating image for position ${position}, story length: ${fullStory?.length || 0}`);

    if (!fullStory || fullStory.length < 50) {
      throw new Error('Story text is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // First, use a text model to extract the most powerful visual from the story
    const extractionPrompt = `Read this story excerpt and identify the ${position === 1 ? 'first' : position === 2 ? 'second' : position === 3 ? 'third' : 'fourth'} most visually striking moment or scene. Describe it in ONE sentence as a cinematic shot description (no character names, just descriptions like "a tall figure in shadows", "an abandoned carnival at night", etc.). Focus on atmosphere, lighting, and composition. Keep it safe for image generation - no graphic content.

Story:
${fullStory}

Reply with ONLY the one-sentence visual description, nothing else.`;

    // Extract the visual description using text model
    const extractResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: extractionPrompt }],
      })
    });

    if (!extractResponse.ok) {
      throw new Error(`Failed to extract visual: ${extractResponse.status}`);
    }

    const extractData = await extractResponse.json();
    const visualDescription = extractData.choices?.[0]?.message?.content?.trim() || 
      'Atmospheric vintage scene with dramatic lighting';

    console.log(`Extracted visual for position ${position}:`, visualDescription);

    // Now generate the image with the extracted description using Google's native API
    const imagePrompt = `Vintage 1980s movie still, grainy film quality, muted desaturated colors, analog VHS aesthetic. ${visualDescription}. Style: retro indie film, atmospheric, practical lighting, moody and cinematic, widescreen composition.`;

    console.log(`Image prompt for position ${position}:`, imagePrompt);

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: imagePrompt }] }],
          generationConfig: { 
            responseModalities: ["image", "text"]
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API error:', response.status, errorText);
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google image response received for position', position);

    // Extract the base64 image from Google's response format
    const candidates = data.candidates;
    const parts = candidates?.[0]?.content?.parts;
    const imagePart = parts?.find((part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData);
    
    if (!imagePart?.inlineData) {
      console.error('No image in response:', JSON.stringify(data, null, 2));
      throw new Error('No image generated');
    }

    const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    return new Response(
      JSON.stringify({ imageUrl, position, visualDescription }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    console.error('Error generating story image:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
