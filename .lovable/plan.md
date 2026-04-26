## Diagnosis

The Stats and Scrapbooks delays are related: both depend on the same shared `GameHistoryProvider` / `useGameHistory` data load.

### What is causing the hang/delay

1. **Duplicate auth + history loading paths**
   - `GameHistoryProvider`, `IndexContent`, `Marquee`, `ScrapbookBook`, `useImageGeneration`, and other children each call `useAuth()` independently.
   - Each `useAuth()` instance creates its own auth listener and `getSession()` call.
   - The game history fetch depends on one auth instance, while the UI depends on others, so page transitions can happen while auth/history state is still churned by repeated session restoration.

2. **The recent abort-based race fix is too aggressive**
   - Network logs show repeated `game_history` requests being aborted: `signal is aborted without reason`.
   - A later request eventually returns `200`, but if the active effect is replaced/aborted during auth churn, Stats can remain on `RETRIEVING SESSION DATA...` until another successful fetch settles the exact active request.

3. **The history query fetches full story bodies and image URLs for every page**
   - The main user has 42 game records with ~216k narrative characters and 40 poster URLs / 40 scene URLs.
   - Stats only needs compact numeric/categorical fields, but currently receives all intro stories, ending narrations, highlights, and image URLs.
   - Scrapbooks need the full records eventually, but not before showing the covers/counts.

4. **Scrapbooks eagerly render many poster thumbnails**
   - `ScrapbookGrid` renders all poster `<img>` elements immediately.
   - For 40+ cloud images, opening Scrapbooks can trigger a large burst of image downloads/decodes, explaining the 30+ second perceived load.

5. **Initial page load is also heavier than needed**
   - Performance snapshot shows ~250 script modules, ~10s full page load in the sandbox, and eager image glob imports in `gameData.ts`.
   - This is secondary to the Stats/Scrapbooks issue, but it amplifies the delay.

## Fix Plan

### 1. Centralize auth state once

Create an `AuthProvider` / `useAuthContext` and wrap the app once near the top level.

Then update existing consumers to read from this shared context instead of each component creating its own `useAuth()` listener.

This removes duplicated session restoration and makes history loading depend on one stable auth source.

### 2. Replace the fragile abort race logic in `useGameHistory`

Update `useGameHistory` to use a simpler, deterministic load state:

- Wait until shared auth is ready.
- If no user, immediately use local history and set loading false.
- If user exists, run one active database fetch for that user.
- Use a mounted/stale flag to ignore outdated results, but do not abort normal page-transition fetches in a way that can strand loading.
- Always clear `isDbLoading` in success and error paths for the current request.

### 3. Split game history into summary vs full detail payloads

Change the initial database query to fetch a compact field list needed for Stats, counts, and grids:

- id, timestamp, outcome
- killer, location, final_girl
- setup_scenario, starting_event
- final_horror_level, final_girl_health, killer_health
- weapon_used, ending_sub_location
- victims_saved, victims_killed
- poster_image_url, scene_image_url

Do **not** fetch `intro_story`, `ending_narration`, or `game_highlights` in the global load.

Then add a targeted detail fetch by game id when a scrapbook story is selected, loading only that one record’s long text before rendering the story page.

Result:

- Stats stops waiting on large narrative payloads it never uses.
- Scrapbook covers/counts can render quickly.
- Story text loads on demand only when the user opens a specific entry.

### 4. Optimize Scrapbook image loading

Update `ScrapbookGrid` and selected-image displays to:

- Add `loading="lazy"` and `decoding="async"` to poster/scene images.
- Limit initial grid thumbnails to a reasonable first batch, with a “Load more recovered photos” button if needed.
- Keep cover counts visible immediately even while thumbnails stream in.

This preserves the scrapbook feel while preventing dozens of poster downloads from blocking the page.

### 5. Add page-level fallback/error states

For Stats:

- If history fetch fails, show a VHS-style error state with a retry button instead of looping forever.
- If loading exceeds a short threshold, keep the skeleton but display “Still recovering cloud records...” so it is clear the app is not frozen.

For Scrapbooks:

- Show covers as soon as counts are available.
- Show lightweight placeholders for poster thumbnails while images load.

### 6. Verify with diagnostics

After implementation, validate:

- Open Stats from the marquee and footer; confirm it leaves `RETRIEVING SESSION DATA...`.
- Open Scrapbooks; confirm covers/counts appear quickly.
- Select a scrapbook entry; confirm long story text loads on demand.
- Check network panel: initial `game_history` response should be smaller and no repeated abort loop should occur.
- Check console for new errors.

## Files expected to change

- `src/hooks/useAuth.ts` or new auth context file
- `src/App.tsx`
- `src/hooks/useGameHistory.ts`
- `src/contexts/GameHistoryContext.tsx`
- `src/pages/Stats.tsx`
- `src/pages/Scrapbooks.tsx`
- `src/components/ScrapbookBook.tsx`
- `src/components/ScrapbookGrid.tsx`

## Optional follow-up after this fix

Further reduce initial app load by changing eager image globs in `src/types/gameData.ts` to lazy URL mapping or generated manifest entries. That is broader than the immediate Stats/Scrapbooks fix, so I would keep it separate unless the app still feels slow after the targeted changes above.