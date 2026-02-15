

# Poster Prompt Overhaul

## What's Changing

The prompt in `PosterPromptModal.tsx` will be rewritten to directly generate an image (not a meta-prompt), reduce repetitive visual cues, and increase variety across runs.

---

## Key Improvements

### 1. Direct Image Generation
Remove the "YOUR TASK" and "OUTPUT" sections that tell the LLM to return a text prompt. Instead, the prompt will be a direct instruction to generate/paint a poster image. Users paste it into ChatGPT and get an image back immediately -- no extra step.

### 2. Remove Police Tape and Crime Scene Clichés
Replace the explicit "police tape in background" and "dropped weapon" cues with a broader palette of outcome signals. For wins: exhaustion, dawn light, a weapon held loosely, smoke clearing, the quiet after violence. For losses: the killer's silhouette filling the frame, an empty hallway, a flickering light with no one under it. The prompt will list 4-5 options and tell the AI to pick ONE, forcing variety.

### 3. Shorter, Less Constrained Prompt
Cut from ~800 words to ~400 words. Remove the multi-section structure (STORY CONTEXT / REQUIREMENTS / TASK / OUTPUT) and merge into a single flowing instruction. Fewer hard constraints means more creative latitude for the image model.

### 4. Randomized Composition Seed
Similar to the "Now Playing" image prompt's variety rule, add a random composition category that's selected each time the prompt is built. Categories like: "Close-up portrait," "Wide establishing shot," "Over-the-shoulder," "Extreme low angle," "Reflection/mirror." This prevents every poster from defaulting to the same "big figure center, threat looming behind" layout.

### 5. Flexible Palette
Instead of hardcoding amber/blue per outcome, tie the palette to the location atmosphere (which already has good suggestions in the current prompt) and let the outcome influence mood/tone rather than dictating a specific accent color.

---

## Technical Details

### File: `src/components/PosterPromptModal.tsx`

**Changes to `buildPrompt()` function (lines 36-108):**

- Rewrite the prompt text to be a direct "Generate this image" instruction
- Remove lines 99-108 (the "YOUR TASK" and "OUTPUT" sections that ask for a text prompt)
- Replace the `outcomeComposition` variable (lines 44-48) with broader, non-repetitive outcome descriptions that avoid "police tape," "dropped weapon," and other clichéd terms
- Add a randomized composition style picker (array of 6 styles, randomly selected via `Math.random()`) injected into the prompt
- Trim the POSTER REQUIREMENTS section to essentials: format, style, content rating, and typography -- remove the over-specific iconography and composition rules
- Keep the character descriptions and story context (these are valuable), but reduce their framing text

No other files need to change. The modal UI, copy button, and integration with TheEnd.tsx all stay the same.

