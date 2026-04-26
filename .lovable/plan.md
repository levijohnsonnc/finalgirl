## Plan: Add Shriek rules + make them drive narration, images, and ending tracking

Use the uploaded Shriek screenshots to make the app smarter in three places: the rulebook / in-session rules modal, AI story + image generation context, and the end-of-game tracker.

### 1. Transcribe Shriek killer + location rules

The new uploads are `.HEIC`, so after approval I’ll convert them to viewable images, read the sheets, and transcribe them into the existing module rules system.

Add two new `EntityRuleModule` entries in `src/data/rules/moduleRules.ts`:

- Killer: `Mort the Teenage Dirtbag`
  - `kind: 'killer'`
  - `filmId: 's4-shriek'`
  - `source: 'Shriek — Killer Sheet'`
  - split into `setup` and `rules`
- Location: `MegaBGCon`
  - `kind: 'location'`
  - `filmId: 's4-shriek'`
  - `source: 'Shriek — Location Sheet'`
  - split into `setup` and `rules`

These will automatically appear:
- on the Rules page under KILLERS / LOCATIONS when Shriek is owned
- on the first narration page through the existing Special Rules modal when the session includes Mort or MegaBGCon

If the sheets reveal that Shriek’s killer identity is mechanically hidden / determined during play, I’ll preserve that exactly in the rule text and add the necessary tracker fields below.

### 2. Add reusable “module prompt context” instead of duplicating rule logic

Right now story/ending prompts only use `killerSpecialRules.ts`, and the newly added `EntityRuleModule` rulebook text is not automatically passed into narration or image prompts.

I’ll add a helper near the module rules data that can return concise guidance for the active killer/location:

```ts
getModulePromptContext(killer, location) => {
  narrativeGuidance: string;
  visualGuidance: string;
  rulesSummary: string;
}
```

This avoids sending long verbatim rulebook text to the AI, while still making generated content respect the actual mechanics.

For Shriek, that guidance will be based on the screenshots after transcription, but the intent is:
- narrative should reflect the real Shriek mechanism, especially any hidden/final killer identity logic
- MegaBGCon should feel like the specific convention location rather than a generic building
- generated scenes should use the location’s concrete visual vocabulary from the rules/sheets
- image prompts should not accidentally depict the wrong killer identity if the final identity is known

### 3. Update the first narration / cold open prompt

Update `NowPlaying.tsx` and `supabase/functions/generate-story/index.ts` so the cold open receives both:
- killer-specific module context
- location-specific module context

This means a Shriek session can mention the convention environment, suspicion, misdirection, crowd chaos, or whatever the sheet’s mechanics require, without spoiling or contradicting the rules.

Technical changes:
- extend the story payload so `location.specialRules` is allowed, not just `killer.specialRules`
- increase validation limits as needed in `supabase/functions/_shared/validation.ts`
- include module context alongside existing `killerSpecialRules.ts` notes

### 4. Update ending generation so Shriek outcomes make sense

Update `TheEnd.tsx` and `supabase/functions/generate-ending/index.ts` so the ending prompt receives:
- the active module context
- any Shriek-specific tracker fields from the outcome form
- especially the final killer identity, if the rules require it

The ending should be able to say the right thing based on the actual final game state, rather than writing a generic “Mort was defeated” ending when the rules say something more specific happened.

### 5. Update image generation prompts

Update `useImageGeneration.ts` and `supabase/functions/generate-scene-image/index.ts` so generated beginning/ending images receive module-aware visual guidance.

For Shriek, the image prompt should be able to use:
- Mort / killer visual details from the screenshots or existing art references
- MegaBGCon convention-specific imagery
- final killer identity context for ending posters/stills, if known

This will keep both visual and narrative generation aligned with the actual module mechanics.

### 6. Add Shriek-specific fields to the ending tracker

Update `src/components/GameOutcomeForm.tsx` with a Shriek-specific section shown when:

```ts
result.killer === 'Mort the Teenage Dirtbag' || result.location === 'MegaBGCon'
```

Expected fields, subject to what the sheets say:
- Final Killer Identity — radio/select options based on the printed rules
- optional additional state if the rules make it important, such as whether the killer was revealed, escaped, or another Shriek-specific end condition

These details will be appended into `gameHighlights`, which is already persisted in saved game history and passed to the ending generator.

I will not add database columns unless the screenshots reveal a Shriek value that should be queried statistically later. For now this follows the app’s existing pattern for killer-specific ending details: capture it in the form, append it to the persisted highlights, and feed it to the ending narration.

### Files likely to change

| File | Change |
|---|---|
| `src/data/rules/moduleRules.ts` | Add Mort + MegaBGCon rules and prompt guidance helpers. |
| `src/components/SpecialRulesModal.tsx` | Likely no change unless Shriek needs special display handling. |
| `src/pages/NowPlaying.tsx` | Pass module context into cold open and beginning image generation. |
| `src/pages/TheEnd.tsx` | Pass module context + Shriek tracker details into ending and poster generation. |
| `src/components/GameOutcomeForm.tsx` | Add Shriek-specific ending tracker fields. |
| `src/hooks/useImageGeneration.ts` | Add optional module visual/narrative context to image request payload. |
| `supabase/functions/_shared/validation.ts` | Allow location/module context in validated story/ending requests. |
| `supabase/functions/generate-story/index.ts` | Use module context in cold open prompt. |
| `supabase/functions/generate-ending/index.ts` | Use module context and final killer identity in ending prompt. |
| `supabase/functions/generate-scene-image/index.ts` | Use visual guidance for Shriek-aware stills/posters. |

### Result

Shriek will become a full first-class module in the app:

- rules visible in the Rules page and in-session modal
- cold opens understand the actual Shriek setup/rules
- scene and poster images use the correct Shriek visual logic
- the ending tracker records the Shriek-specific final killer identity and feeds it into the ending narration