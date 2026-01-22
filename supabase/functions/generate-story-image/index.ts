import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/auth.ts";
import { ImageRequestSchema, validateRequest } from "../_shared/validation.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {

    // Parse and validate request body
    const body = await req.json();
    const validation = validateRequest(ImageRequestSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const { 
      position, 
      fullStory, 
      killer, 
      killerDescription, 
      finalGirl, 
      finalGirlDescription, 
      location, 
      locationDescription 
    } = validation.data;

    console.log(`Generating image for position ${position}, story length: ${fullStory.length}`);
    console.log(`Context - Killer: ${killer}, Final Girl: ${finalGirl}, Location: ${location}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build character context for the extraction prompt
    const characterContext = [];
    if (finalGirl) {
      characterContext.push(`FINAL GIRL "${finalGirl}": ${finalGirlDescription || 'A determined survivor'}`);
    }
    if (killer) {
      characterContext.push(`KILLER "${killer}": ${killerDescription || 'A menacing antagonist'}`);
    }
    if (location) {
      characterContext.push(`LOCATION "${location}": ${locationDescription || 'An atmospheric setting'}`);
    }

    const positionLabel = position === 1 ? 'first' : position === 2 ? 'second' : position === 3 ? 'third' : 'fourth';

    // Dramatic cinematographer extraction prompt
    const extractionPrompt = `You are a horror film cinematographer selecting the ${positionLabel} most emotionally powerful shot from this story.

CRITICAL RULES:
- Focus on ONE dramatic moment of tension, fear, revelation, or confrontation
- You do NOT need to show all characters or the full location
- A tight close-up of terrified eyes can be more powerful than a wide shot showing everything
- IGNORE minor NPCs, background characters, or security guards mentioned in the story
- Choose the most cinematic framing: character close-up, killer reveal, atmospheric detail, or intense confrontation
- Describe camera angle, framing, lighting, and emotional focus
- Use ONLY the main characters listed below if they appear in your chosen moment

MAIN CHARACTERS (use visual details ONLY if they appear in your shot):
${characterContext.join('\n')}

STORY:
${fullStory}

OUTPUT: One vivid sentence describing a powerful cinematic shot. Focus on DRAMA and EMOTION, not completeness. Do NOT mention character names - describe them visually instead.`;

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
      console.error('Visual extraction failed:', extractResponse.status);
      throw new Error('Failed to process story content');
    }

    const extractData = await extractResponse.json();
    const visualDescription = extractData.choices?.[0]?.message?.content?.trim() || 
      'Atmospheric vintage scene with dramatic lighting';

    console.log(`Extracted visual for position ${position}:`, visualDescription);

    // Dramatic image prompt that avoids poster-style compositions
    const imagePrompt = `Ultra photorealistic 1980s horror film still. ${visualDescription}

Style: Practical on-set lighting, shallow depth of field, cinematic tension, 35mm film grain.
DO NOT create a movie poster, group portrait, or composite image.
Focus on this single dramatic moment with authentic vintage analog film quality.
Muted, desaturated color palette. Widescreen composition. No text or titles.`;

    console.log(`Image prompt for position ${position}:`, imagePrompt);

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('Image generation service not configured');
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
      console.error('Image generation API error:', response.status, errorText);
      throw new Error('Failed to generate image');
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
    console.error('Error generating story image:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate image. Please try again.' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
