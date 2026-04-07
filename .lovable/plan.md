

## Plan: Fix ending image saving and prompt usage

### Problem 1: Ending image saved to wrong field
In `handleSaveEnding` (Index.tsx line 124), the generated scene image from The End page is passed as `sceneImageUrl`, which maps to `scene_image_url` in the DB. But this is the same field used by the "Now Playing" beginning scene image. The beginning image gets set first via `handleGameEnd` (line 85-103), then the ending save overwrites it. Meanwhile, `posterImageUrl` — which is the correct field for the ending image — only gets set if the user manually uploads via `ImageUploadSlot`.

The fix: The generated scene image on The End page should be saved as `posterImageUrl` (the "movie poster" slot), not `sceneImageUrl`. In `TheEnd.tsx`, the `generatedSceneUrl` should feed into `posterImageUrl` when no manual upload has been provided.

### Problem 2: Ending image uses wrong prompt
The `SceneImageControls` on The End page passes `sceneType: 'ending'` to the edge function. Looking at the edge function, it does use a `sceneLabel` variable based on `sceneType` — but the prompt structure is generic ("selecting the most emotionally powerful opening/closing shot"). The real issue is that the edge function's `generate-scene-image` builds a generic "cinematic shot" prompt rather than a **movie poster** prompt. Since the ending image should serve as the movie poster, it should use a poster-style prompt (similar to what `PosterPromptModal` builds) rather than the scene-still prompt.

### Changes

**1. `src/pages/TheEnd.tsx`**
- When the user generates a scene image, treat it as the poster image: set `posterImageUrl` state instead of a separate `generatedSceneUrl`
- Remove the separate `generatedSceneUrl` state — the generated image and the uploaded image both feed into `posterImageUrl`
- Update `handleSave` to pass `posterImageUrl` correctly (it already does, but currently the generated image bypasses it)
- Keep the visual display of the image alongside the story text

**2. `src/pages/Index.tsx`**  
- In `handleSaveEnding`: the `posterImageUrl` parameter should map to `posterImageUrl` in the DB update (already does), and `sceneImageUrl` should NOT be overwritten by the ending image (remove it from the ending save if it comes from the generated ending image)

**3. `supabase/functions/generate-scene-image/index.ts`**
- When `sceneType === 'ending'`, use a **movie poster** style prompt instead of a "cinematic shot" prompt
- The poster prompt should describe a full movie poster composition: title treatment area, dramatic character positioning, tagline space, genre-appropriate color palette — similar to what `PosterPromptModal.buildPrompt()` generates
- Keep the existing "cinematic shot" prompt for `sceneType === 'beginning'`

### Summary of data flow after fix
- Beginning scene image → saved as `sceneImageUrl` (unchanged)
- Ending generated image → saved as `posterImageUrl` (fixed)
- Ending uploaded image → saved as `posterImageUrl` (unchanged)
- Ending prompt → uses poster-style composition (fixed)

