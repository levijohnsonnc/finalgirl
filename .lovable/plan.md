

## Critique: why the "default to official art" change appears to do nothing

The refactor in `src/types/gameData.ts` is structurally sound but **functionally a no-op today** because the official art directories are empty.

### What the change actually did
- Split image globs into two sets: top-level (`src/assets/characters/*.png`) treated as "official", and `ai/` subfolder treated as legacy AI.
- Built two registries per category: `CHARACTER_IMAGES` / `CHARACTER_IMAGES_AI` (same for locations + box art).
- Added `useActiveImages` hook that picks the registry based on the user's `auto_generate_images` Supabase setting.
- Added a `FALLBACK_TO_AI_WHEN_MISSING = true` constant so any entity without an official PNG falls back to its AI counterpart.

### Why nothing visibly changed
Disk reality:

| Folder | Official files | AI files |
|---|---|---|
| `src/assets/characters/` | **0** | 57 |
| `src/assets/locations/` | **0** | 17 |
| `src/assets/box-art/` | **0** | 20 |

Because **zero official PNGs exist**, every lookup falls through to the AI fallback. Visually identical to before the refactor — the user sees the exact same AI art. The "default to official" only takes effect once real PNG files are dropped into the top-level folders matching the filenames in `CHARACTER_FILES` / `LOCATION_FILES` / `FILM_BOX_ART_FILES`.

### Second issue: the toggle's semantics are now wrong
`useActiveImages` is currently driven by `useImageGeneration().autoGenerate`, which is the **"auto-generate scene/poster images on story completion"** setting (used by `NowPlaying.tsx` / `TheEnd.tsx`). It was repurposed to also mean "show legacy AI character/location art." Two completely unrelated concerns now share one switch:

- A user who wants official portraits but still wants AI **scene generation** can't have both.
- A user who's never enabled auto-generate is stuck on AI portraits forever (because the setting defaults to `false` → AI registry off → but with no official files, fallback brings AI back anyway). Today it accidentally works, but the moment you ship some official files, users with `autoGenerate=true` will mysteriously keep seeing AI art for those entities.

### Third issue: no neutral placeholder
`getImageForValue` returns `null` when nothing is found. `getBoxArt` returns `undefined`. There is no "non-AI default" — components either render the AI fallback or render nothing. The user's stated goal ("non-AI image as a default if not [present]") is not met anywhere.

---

## Plan to actually default to official art

### 1. Make the image source explicit and decoupled from auto-generation
- Rename the resolved setting consumed by `useActiveImages` to `useOfficialArt` (boolean, default **`true`**).
- Add a new column `prefer_official_art boolean default true` to `user_image_settings` via a migration. Keep `auto_generate_images` strictly for scene/poster generation.
- Update `useImageGeneration` to expose `useOfficialArt` + `setUseOfficialArt` independently of `autoGenerate`.
- Default for unauthenticated / no-row-yet users: **official art on**.

### 2. Add an "Art Style" toggle in `ApiKeyManager.tsx`
A second switch above (or beside) the existing auto-generate switch:
> **Art style:** `Official Van Ryder` ⇄ `AI-generated (legacy)`

### 3. Fix the resolution order in `useActiveImages`
New cascade for every lookup (`getImageForValue`, `getBoxArt`, `characterImages[name]`):
1. If `useOfficialArt` → official PNG if present.
2. Else (or if missing) → AI PNG if present (only when `useOfficialArt=false` **or** when `FALLBACK_TO_AI_WHEN_MISSING=true` during the art-drop transition).
3. Else → **neutral placeholder** (see step 4) — never `null`.

### 4. Add a non-AI default placeholder per type
Add three small SVGs to `src/assets/placeholders/`:
- `character-placeholder.svg` — VHS-style silhouette + "?" in the project's blood-red on dark.
- `location-placeholder.svg` — empty grainy frame.
- `box-art-placeholder.svg` — VHS spine reading "VHS — ART PENDING".

`useActiveImages` returns one of these instead of `null`/`undefined` so the UI never falls back to AI when the user has explicitly opted out, and never shows a broken image.

### 5. Telemetry/visibility for missing official files
- In `gameData.ts`, after building `CHARACTER_IMAGES`, if `import.meta.env.DEV`, `console.warn` a single grouped list of entity names whose official PNG is missing. This makes it obvious to you what's still pending each time you reload.

### 6. Clean up the misnamed conditional in `LoreInfoModal.tsx`
That component reads `characterImages[name]` directly from the hook — already routed through the new resolver, so once step 3 lands it works correctly with placeholders too.

### 7. (Optional, recommended) Phase out `FALLBACK_TO_AI_WHEN_MISSING`
Once you've confirmed the toggle + placeholders work, flip it to `false` so users who choose "Official" actually see placeholders for missing entities, not silent AI fallbacks. Keep the constant as a single switch you can flip per-release.

### Files touched

| File | Change |
|---|---|
| `supabase/migrations/<new>.sql` | Add `prefer_official_art boolean not null default true` to `user_image_settings`. |
| `src/integrations/supabase/types.ts` | (Auto-regenerates after migration.) |
| `src/hooks/useImageGeneration.ts` | Track + persist `prefer_official_art`; expose `useOfficialArt`, `setUseOfficialArt`. Default `true` even when no row exists. |
| `src/hooks/useActiveImages.ts` | Switch source from `autoGenerate` → `useOfficialArt`. New 3-step cascade returning placeholders instead of null. |
| `src/types/gameData.ts` | Add dev warning for missing official files; expose placeholder constants. |
| `src/assets/placeholders/*.svg` | Three new placeholders. |
| `src/components/ApiKeyManager.tsx` | New "Art Style" switch row, separate from auto-generate. |
| `src/types/gameData.test.ts` | Update tests to no longer assume every `CHARACTER_IMAGES[x]` is truthy under "official only" mode (or assert placeholder). |

### What you still need to do **outside code**
This is the actual blocker: **drop the official PNG files into the top-level folders** with the exact filenames already mapped in `CHARACTER_FILES`, `LOCATION_FILES`, and `FILM_BOX_ART_FILES`. Until those files exist, even a perfect toggle will show placeholders (or AI fallbacks while `FALLBACK_TO_AI_WHEN_MISSING=true`). The `scripts/import-vr-art.mjs` script appears to exist for this — worth a follow-up to confirm it lands files in the right spots with the right names.

