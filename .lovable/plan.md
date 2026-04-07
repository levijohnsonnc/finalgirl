

## Plan: Include killer visual description in scene image generation

### Confirmed
The `generate-scene-image` edge function receives `killer` as a plain name string. No visual description of the killer is included in either the extraction prompt or the final image prompt. The detailed descriptions exist in `src/data/killerDescriptions.ts` but are never sent to the function.

### Approach
Pass the killer description from the client to the edge function, then inject it into both the extraction prompt (so the AI knows what the killer looks like when picking a shot) and the final image prompt (so the image generator renders the killer accurately).

### Changes

**1. Client side — pass killer description (`src/hooks/useImageGeneration.ts`)**
- Add `killerDescription?: string` to the `GenerateImageContext` interface
- No other client changes needed — it's just a new optional field in the JSON body

**2. Callers — include killer description when invoking `generateImage`**
- `src/pages/NowPlaying.tsx`, `src/pages/TheEnd.tsx`, `src/components/SceneImageControls.tsx`: import `getKillerDescription` from `src/data/killerDescriptions.ts` and pass it as `killerDescription` in the context object

**3. Edge function — use the description (`supabase/functions/generate-scene-image/index.ts`)**
- Parse optional `killerDescription` from the request body
- In the **extraction prompt**, add a short block: `KILLER APPEARANCE: <description>` so the AI can reference the killer's look when selecting the cinematic shot
- In the **final image prompt**, append a line like: `The antagonist: <description>` so the image model renders the killer accurately
- No changes to prompt structure, style instructions, or anything else

### Files changed
| File | Change |
|------|--------|
| `src/hooks/useImageGeneration.ts` | Add `killerDescription` to `GenerateImageContext` |
| `src/pages/NowPlaying.tsx` | Pass killer description to `generateImage` |
| `src/pages/TheEnd.tsx` | Pass killer description to `generateImage` |
| `src/components/SceneImageControls.tsx` | Pass killer description to `generateImage` |
| `supabase/functions/generate-scene-image/index.ts` | Inject killer description into extraction + image prompts |

