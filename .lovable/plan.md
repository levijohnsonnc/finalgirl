

## Plan: Fix poster image dimensions for ending scenes

### Root cause
All three provider functions (`generateWithOpenAI`, `generateWithGoogle`, `generateWithStability`) hardcode landscape dimensions. The poster prompt text says "Vertical 2:3" but the API ignores that — it produces whatever pixel dimensions you request.

### Fix

**File: `supabase/functions/generate-scene-image/index.ts`**

Pass `isPoster` (derived from `sceneType === 'ending'`) to each provider function so they can select the correct dimensions:

| Provider | Beginning (landscape) | Ending/Poster (portrait) |
|----------|----------------------|-------------------------|
| OpenAI | `1536x1024` | `1024x1536` |
| Google | No explicit size param (prompt-driven — already handled by "Vertical 2:3" text) | Same |
| Stability | Add `aspect_ratio: "2:3"` form field | Add `aspect_ratio: "2:3"` |

Changes:
1. Update each `generateWith*` function signature to accept `isPoster: boolean`
2. In `generateWithOpenAI`: switch size to `"1024x1536"` when `isPoster` is true
3. In `generateWithStability`: append `aspect_ratio` of `"2:3"` for posters, `"3:2"` for scenes
4. In `generateWithGoogle`: no API-level size control, but the prompt text already says "Vertical 2:3" which should guide Gemini
5. Pass `isPoster` through at the call sites (lines ~168-174)
6. Redeploy the edge function

### Files changed
| File | Change |
|------|--------|
| `supabase/functions/generate-scene-image/index.ts` | Add `isPoster` param to provider functions; swap dimensions for portrait posters |

