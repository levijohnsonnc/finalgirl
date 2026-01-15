import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImageRequest {
  position: number; // 1-4: determines the scene type
  killer: string;
  location: string;
  finalGirl: string;
  storySnippet?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { position, killer, location, finalGirl, storySnippet } = await req.json() as ImageRequest;

    console.log(`Generating image for position ${position}:`, { killer, location, finalGirl });

    // Build scene-specific prompts based on position - using safe language to avoid content filters
    let sceneDescription: string;
    
    switch (position) {
      case 1:
        sceneDescription = `Establishing shot of ${location}, atmospheric vintage setting, mysterious and moody, nighttime with fog, cinematic composition`;
        break;
      case 2:
        sceneDescription = `Mysterious figure named ${killer} in shadows, dramatic lighting, noir style, silhouette against dark background, suspenseful mood`;
        break;
      case 3:
        sceneDescription = `Young woman named ${finalGirl}, looking cautiously over her shoulder, determined expression, dramatic lighting, vintage film look`;
        break;
      case 4:
        sceneDescription = `Dramatic scene at ${location}, two figures in tense standoff, cinematic framing, suspenseful atmosphere, vintage movie still`;
        break;
      default:
        sceneDescription = `Atmospheric scene at ${location}, mysterious mood, vintage cinematic style`;
    }

    const prompt = `Vintage 1980s movie still, grainy film quality, muted desaturated colors, analog aesthetic. ${sceneDescription}. Style: retro indie film, atmospheric, practical lighting, 4:3 aspect ratio, moody and cinematic.`;

    console.log(`Generated prompt for position ${position}:`, prompt);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received for position', position);

    // Extract the base64 image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data, null, 2));
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ imageUrl, position }),
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
