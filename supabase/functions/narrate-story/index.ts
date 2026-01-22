import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { corsHeaders } from "../_shared/auth.ts";
import { NarrationRequestSchema, validateRequest } from "../_shared/validation.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const validation = validateRequest(NarrationRequestSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const { text } = validation.data;

    const INWORLD_API_KEY = Deno.env.get('INWORLD_API_KEY');
    if (!INWORLD_API_KEY) {
      console.error('INWORLD_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Narration service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Base64 encode the API key for Basic Auth
    const authHeader = btoa(INWORLD_API_KEY);

    console.log(`Generating narration for ${text.length} characters using Inworld voice Blake`);

    const response = await fetch(
      'https://api.inworld.ai/tts/v1/voice',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: 'Blake',
          modelId: 'inworld-tts-1.5-max'
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Inworld API error:', response.status, errorText);
      
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

    // Inworld returns JSON with audioContent as base64
    const data = await response.json();
    
    console.log('Narration generated successfully via Inworld');

    return new Response(
      JSON.stringify({ audioContent: data.audioContent }),
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
