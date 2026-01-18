import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { corsHeaders, verifyAuth } from "../_shared/auth.ts";
import { NarrationRequestSchema, validateRequest } from "../_shared/validation.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(req);
    if (authError) {
      return authError;
    }

    console.log('Authenticated user:', user?.id);

    // Parse and validate request body
    const body = await req.json();
    const validation = validateRequest(NarrationRequestSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const { text } = validation.data;

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Narration service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Using "Brian" - a deep male voice (nPczCjzI2devNBz1zQrb)
    const voiceId = 'nPczCjzI2devNBz1zQrb';

    console.log(`Generating narration for ${text.length} characters using voice ${voiceId}`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Narration API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate narration. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = base64Encode(audioBuffer);

    console.log('Narration generated successfully, audio size:', audioBuffer.byteLength);

    return new Response(
      JSON.stringify({ audioContent: audioBase64 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error generating narration:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate narration. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
