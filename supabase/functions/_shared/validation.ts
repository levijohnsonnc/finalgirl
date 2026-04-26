import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { corsHeaders } from './auth.ts';

// Schema for generate-story endpoint
export const StoryRequestSchema = z.object({
  killer: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(5000).optional(),
    specialRules: z.string().max(3000).optional()
  }),
  location: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(5000).optional(),
    specialRules: z.string().max(3000).optional()
  }),
  finalGirl: z.object({
    name: z.string().min(1).max(100),
    backstory: z.string().max(5000).optional()
  }),
  startingEvent: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(5000).optional()
  }).optional().nullable(),
  startingSetup: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(5000).optional()
  }).optional().nullable()
});

// Schema for generate-story-image endpoint
export const ImageRequestSchema = z.object({
  position: z.number().min(1).max(4),
  fullStory: z.string().min(50).max(10000),
  // Character and location context for dramatic image generation
  killer: z.string().max(100).optional(),
  killerDescription: z.string().max(3000).optional(),
  finalGirl: z.string().max(100).optional(),
  finalGirlDescription: z.string().max(3000).optional(),
  location: z.string().max(100).optional(),
  locationDescription: z.string().max(3000).optional(),
  moduleVisualGuidance: z.string().max(3000).optional()
});

// Schema for narrate-story endpoint
export const NarrationRequestSchema = z.object({
  text: z.string().min(10).max(10000)
});

// Schema for generate-ending endpoint
export const EndingRequestSchema = z.object({
  // Required fields
  introStory: z.string().min(50).max(10000),
  outcome: z.enum(['won', 'lost']),
  killer: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(3000).optional(),
    specialRules: z.string().max(3000).optional()
  }),
  location: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(3000).optional(),
    specialRules: z.string().max(3000).optional()
  }),
  finalGirl: z.object({
    name: z.string().min(1).max(100),
    backstory: z.string().max(3000).optional()
  }),
  // Optional game stats
  finalHorrorLevel: z.number().min(1).max(7).optional(),
  weaponUsed: z.string().max(100).optional(),
  finalGirlHealth: z.number().min(0).max(10).optional(),  // Max 6 in official game, buffer for custom
  killerHealth: z.number().min(0).max(20).optional(),
  finalGirlMaxHealth: z.number().min(5).max(6).optional(),  // Character-specific max health
  victimsSaved: z.number().min(0).max(50).optional(),
  victimsKilled: z.number().min(0).max(50).optional(),
  endingSubLocation: z.string().max(200).optional(),
  gameHighlights: z.string().max(2000).optional()
});

export type StoryRequest = z.infer<typeof StoryRequestSchema>;
export type ImageRequest = z.infer<typeof ImageRequestSchema>;
export type NarrationRequest = z.infer<typeof NarrationRequestSchema>;
export type EndingRequest = z.infer<typeof EndingRequestSchema>;

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: Response } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('Validation error:', err.errors);
      return {
        success: false,
        error: new Response(
          JSON.stringify({ error: 'Invalid request format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      };
    }
    return {
      success: false,
      error: new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }
}
