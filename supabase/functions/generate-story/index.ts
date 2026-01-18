import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StoryRequest {
  killer: { name: string; description?: string };
  location: { name: string; description?: string };
  finalGirl: { name: string; backstory?: string };
  startingEvent: { name: string; description?: string } | null;
  startingSetup: { name: string; description?: string } | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { killer, location, finalGirl, startingEvent, startingSetup } = await req.json() as StoryRequest;

    console.log('Generating story for:', { 
      killer: killer.name, 
      location: location.name, 
      finalGirl: finalGirl.name,
      startingEvent: startingEvent?.name,
      startingSetup: startingSetup?.name
    });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("Story generation service not configured");
    }

    // Build the scenario context
    const killerInfo = killer.description 
      ? `${killer.name}: ${killer.description}`
      : `A mysterious killer known as ${killer.name}`;
    
    const locationInfo = location.description
      ? `${location.name}: ${location.description}`
      : `A location called ${location.name}`;
    
    const finalGirlInfo = finalGirl.backstory
      ? `${finalGirl.name}: ${finalGirl.backstory}`
      : `A survivor named ${finalGirl.name}`;
    
    const startingEventInfo = startingEvent
      ? `${startingEvent.name}: ${startingEvent.description || 'An event that sets the stage for terror.'}`
      : 'The calm before the storm...';
    
    const startingSetupInfo = startingSetup
      ? `${startingSetup.name}: ${startingSetup.description || 'The board is set for survival.'}`
      : 'Victims are scattered across the location...';

    const systemPrompt = `You are a skilled horror storyteller writing a cold open for Final Girl, a solo board game where one lone survivor must save victims from a relentless slasher killer.

The player is about to begin play as the Final Girl at a specific location against a specific killer.

Write a gripping, cinematic opening in 3–4 paragraphs.

Vibe: classic 1980s paperback horror (slow dread, sharp sensory details, uneasy normality turning wrong).

Tone: tense and ominous, with occasional dark wit if it fits.

Do not imitate or reference any real author.

Keep it PG-13: no explicit gore or sexual content; imply danger rather than describing it graphically.

Keep it reasonably short (aim ~250–450 words).

Stay consistent with the provided scenario facts. You may invent small details (minor NPCs, ambient moments, brief memories) as long as they don't contradict the inputs.

Avoid clichés ("dark and stormy night", "it was quiet… too quiet", etc.).

End with an immediate hook: a discovery, a scream, a missing person, a power outage, a chilling announcement—something that makes the player feel "okay, we're live."

Output Rules:
Return only the story text. No headings, bullet points, or meta commentary.`;

    const userPrompt = `Scenario Inputs (use these explicitly):

Killer Info:
${killerInfo}

Final Girl Info:
${finalGirlInfo}

Location Info:
${locationInfo}

Starting Event Info:
${startingEventInfo}

Starting Setup Info:
${startingSetupInfo}`;

    console.log('Calling Lovable AI Gateway...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate story. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const story = data.choices?.[0]?.message?.content;

    if (!story) {
      console.error("No story content in response:", data);
      return new Response(
        JSON.stringify({ error: "No story was generated. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Story generated successfully, length:', story.length);

    return new Response(
      JSON.stringify({ story }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-story error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate story. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
