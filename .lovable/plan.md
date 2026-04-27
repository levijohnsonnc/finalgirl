## Current diagnosis

This is not a data-loss or RLS problem.

- Your data is still in the backend: the signed-in user has **42 game records** and **1 user settings row with 14 owned films**.
- The published app is failing at the backend layer:
  - auth logs show repeated `POST /token` **504 timeouts** (`context deadline exceeded`)
  - app requests to `game_history` and `user_settings` return **503 `PGRST002`**
  - official PostgREST docs define `PGRST002` as: **could not connect to the database while building the schema cache**
- That means the backend was unhealthy/restarting after publish, so the app could not read history, collection, or reliably complete sign-in.

## Why the last fixes did not work

1. **The payload optimization fix was aimed at slow queries**, but the current failures happen **before a normal query can even run**. The backend is returning 503/504, so a lighter select alone cannot fix it.
2. **The auth hardening fix addressed loading deadlocks**, but the real live issue is now backend auth instability. Worse, the new 10-second session timeout clears stored auth and signs the user out on a slow backend, which makes a temporary outage look like a broken login.
3. **Collection still shows “No films in collection” because `useOwnedFilms` has no failure fallback**. When `user_settings` fails, `dbOwnedFilms` stays `[]`, and the app interprets that as “you own nothing,” even though your data exists.

## Best repair plan

### 1. Make auth failure-safe instead of destructive
Update `src/hooks/useAuth.ts` so temporary backend slowness does **not** erase a valid local session.

- stop clearing persisted auth tokens on timeout/network/backend-unavailable errors
- only clear the session for truly invalid/expired auth states
- distinguish these cases in state:
  - session unavailable because user is signed out
  - session temporarily unavailable because backend auth is unhealthy
  - session invalid and must be replaced
- keep the UI usable while auth recovery is pending or temporarily degraded

### 2. Add cached fallback for cloud-backed user data
Update `src/hooks/useOwnedFilms.ts` and `src/hooks/useGameHistory.ts` to preserve the last successful cloud snapshot locally.

- store last successful owned films and history summary in local storage
- when backend reads fail with 503/504/network errors, fall back to cached cloud data instead of empty arrays
- expose explicit `loadError` / `isDegraded` states
- add controlled retry behavior rather than indefinite loading or silent empty states

### 3. Fix the misleading empty-state UX
Update the pages/components that currently convert backend failure into “no data.”

Files to adjust:
- `src/pages/Auth.tsx`
- `src/pages/Archive.tsx`
- `src/pages/CastingRoom.tsx`
- `src/pages/Stats.tsx`
- `src/pages/Scrapbooks.tsx`
- `src/components/Marquee.tsx`

Behavior changes:
- if collection cannot load, show **“Collection unavailable”**, not **“No films in collection”**
- if auth backend is unavailable, show **“Sign-in temporarily unavailable”** with retry guidance
- if cached data exists, allow the user to keep browsing/playing from cached collection/history instead of blocking them
- keep Stats/Scrapbooks error states specific and actionable

### 4. Re-verify the live backend after publish
Once the code changes are in place, validate against the **published URL** and check backend health/logs during the test.

Validation goals:
- existing signed-in users are not forcibly logged out during temporary backend slowness
- collection loads from live data when backend is healthy
- collection falls back to cached data when backend is unhealthy
- Stats and Scrapbooks fail gracefully and recover with retry
- sign-in works again once the backend token endpoint is healthy

### 5. Keep the query optimizations already made, but don’t treat them as the root fix
The lighter history query is still a good optimization, so I would keep it. But the main repair is **resilience to backend unavailability**, not query trimming.

## Technical details

### Files I plan to change
- `src/hooks/useAuth.ts`
- `src/hooks/useOwnedFilms.ts`
- `src/hooks/useGameHistory.ts`
- `src/pages/Auth.tsx`
- `src/pages/Archive.tsx`
- `src/pages/CastingRoom.tsx`
- `src/pages/Stats.tsx`
- `src/pages/Scrapbooks.tsx`
- `src/components/Marquee.tsx`

### Concrete implementation approach
- introduce non-destructive auth recovery logic
- add cached cloud snapshot keys for:
  - owned films
  - game history summary
- treat `503`, `504`, `PGRST002`, and network fetch failures as **backend unavailable**, not **no data**
- thread an `isDegraded` / `backendUnavailable` state into the UI
- ensure the game-start flow depends on **resolved collection state**, not just `ownedFilms.length`

## Expected result

After this fix:
- you should stop seeing false “no films” states when the backend hiccups
- Stats and Scrapbooks should either load normally or show a correct degraded-state message with retry
- sign-in should stop being broken by the app clearing its own session during temporary backend slowness
- the app will behave much more safely around publish-time backend restarts