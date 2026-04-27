## Diagnosis

The Stats page is not hanging because of the visual Stats components. It is hanging before Stats gets data, inside the shared `GameHistoryProvider` / `useGameHistory` load.

The evidence points to a database read problem:

- The published app requests `game_history` with the optimized summary field list.
- That request sometimes returns `500` with database error `57014`: `canceling statement due to statement timeout`.
- When it does return, the payload includes at least one `poster_image_url` that is not a normal short storage URL. It is a huge `data:image/png;base64,...` string embedded directly in the row.
- Because the initial summary query still selects `poster_image_url` and `scene_image_url`, Stats is forced to load huge image blobs even though it does not need images.
- Scrapbooks are related: they use the same history load, and then render poster thumbnails. So one or more oversized embedded image strings can make both Stats and Scrapbooks feel frozen.
- The database metadata/read tools are also timing out, which suggests the backend is currently under strain. But the app is still making this worse by selecting large text/image fields in the global load.

The previous optimization removed long story fields from the initial query, but it did not remove the worst offender: embedded base64 poster/scene image data stored in URL columns.

## Best Fix

### 1. Make the global game history load truly lightweight

Update the initial `HISTORY_SUMMARY_SELECT` in `src/hooks/useGameHistory.ts` to remove:

- `poster_image_url`
- `scene_image_url`

Stats does not need either field. Scrapbook cover counts do not need them either.

The initial query should only fetch small stats/count fields:

- id, timestamp, outcome
- killer, location, final_girl
- setup_scenario, starting_event
- final_horror_level, final_girl_health, killer_health
- weapon_used, ending_sub_location
- victims_saved, victims_killed

This should stop Stats from being blocked by huge image data.

### 2. Load Scrapbook thumbnails separately and safely

For Scrapbooks, add a lightweight, on-demand thumbnail fetch that runs only when Scrapbooks opens.

Important: it should not blindly pull giant base64 image data into the main history load.

Options I will implement:

- Fetch image URLs only for the currently displayed first batch of scrapbook entries.
- Reject/ignore embedded `data:` image values when rendering thumbnails, showing `NO IMAGE` instead.
- Keep full story/image detail loading on demand when a specific scrapbook entry is selected.

This means:

- Stats loads from small rows only.
- Scrapbook covers/counts appear quickly.
- Thumbnail loading cannot block the whole app.
- Bad historical rows with embedded base64 data no longer poison the page.

### 3. Add defensive cleanup in the app layer

Update `fromDbRow` / image handling so that any image field beginning with `data:` is treated as unsafe/oversized for list rendering.

For selected story details, if the row contains a base64 image instead of a cloud URL, the app should avoid rendering it as a giant inline image source. It can show the placeholder instead.

This prevents the browser from trying to decode megabytes of inline image text from the database.

### 4. Add database performance migration

Create a migration to add a compound index for the exact query pattern used by the app:

```sql
create index if not exists idx_game_history_user_timestamp_desc
on public.game_history (user_id, timestamp desc);
```

The current migrations have separate indexes on `user_id` and `timestamp`, but the app query filters by `user_id` and orders by `timestamp desc`. A combined index is better for this access pattern.

I will also include a safe helper view or generated query path if useful, but the main fix is not to query heavy columns globally.

### 5. Add a Stats failure state instead of infinite loading

Stats currently ignores `loadError`, so if the database times out, the page can look like it is loading forever.

Update `Stats.tsx` to use `loadError` from `GameHistoryContext` and show an in-world VHS error panel with:

- the failed archive retrieval message
- a clear note that the app could not retrieve cloud records
- a retry action if feasible, or instructions to navigate away/back

This does not replace the database fix, but it prevents silent infinite spinners.

### 6. Optional data repair follow-up

There appear to be existing rows where `poster_image_url` stores a full `data:image/...base64` payload instead of a normal cloud storage URL.

In implementation mode I will first add code that avoids reading/rendering those values. If database access is healthy enough afterward, I can also inspect and propose a cleanup migration/script to null out or migrate oversized `data:` image fields. I will not delete user records; at most, I would remove invalid embedded image strings from image URL columns after confirming the exact rows.

## Files expected to change

- `src/hooks/useGameHistory.ts`
  - remove image fields from initial summary query
  - sanitize `data:` image fields
  - add targeted thumbnail/detail loading behavior
- `src/contexts/GameHistoryContext.tsx`
  - expose any needed retry/thumbnail-loading function
- `src/pages/Stats.tsx`
  - show `loadError` instead of an endless spinner
- `src/pages/Scrapbooks.tsx`
  - trigger thumbnail/detail loading only when needed
- `src/components/ScrapbookGrid.tsx`
  - keep lazy rendering and placeholders for oversized/invalid images
- `supabase/migrations/...sql`
  - add compound `(user_id, timestamp desc)` index

## Verification plan

After implementation:

1. Build/typecheck the app.
2. Open the published/preview Stats flow while signed in.
3. Confirm the initial `game_history` request no longer includes `poster_image_url` or `scene_image_url`.
4. Confirm Stats renders even if thumbnails are unavailable.
5. Open Scrapbooks and confirm covers/counts appear quickly.
6. Confirm selecting a scrapbook entry still loads full details on demand.
7. Check console/network logs for remaining `57014` timeouts.

## Note on Lovable Cloud instance size

The backend is also showing timeout symptoms while reading metadata. The code fix above reduces unnecessary load and should be done first. If timeouts continue after the query is made small and indexed, the next best operational step is increasing the Lovable Cloud instance size under Backend → Advanced settings → Upgrade instance.