<final-text>
## What’s actually going on

The strongest signal is that this is now failing before the stats query even really gets a chance to run.

I found three important clues:

1. The browser is repeatedly failing the auth refresh request:
   - `POST /auth/v1/token?grant_type=refresh_token` → `Failed to fetch`
   - This repeats over and over.

2. `useGameHistory()` still reports loading while auth is loading:
   - `isLoading: authLoading || isDbLoading`
   - So if auth never settles, both Stats and Scrapbooks stay in the spinner forever.

3. The network snapshot shows only the `OPTIONS` preflight for the `game_history` request, not a successful data `GET`.
   - That means the app is getting stuck in auth/session recovery first, before the history fetch becomes reliable.

So the most likely primary root cause is:

- the persisted session refresh is failing,
- `useAuth()` is not handling that failure defensively enough,
- and the history views are blocked behind `authLoading`, so they never recover.

The earlier payload/performance issue may still exist as a secondary problem, but right now the first blocker is auth/session readiness.

## Best fix plan

### 1. Make auth initialization always resolve
Update `src/hooks/useAuth.ts` so auth startup cannot hang forever.

Changes:
- wrap `supabase.auth.getSession()` in `try/catch/finally`
- always set `isLoading` to `false` in the failure path
- keep `onAuthStateChange` only for later auth changes, not as the sole thing the app waits on
- add an explicit `isAuthReady` concept so the app knows when session restoration is finished, even if it failed

Result:
- the app will stop spinning forever when refresh fails
- it will move to either “signed in”, “signed out”, or “auth recovery failed”

### 2. Clear bad/stale persisted sessions when refresh recovery fails
If session refresh throws `Failed to fetch` / retryable auth recovery errors during initialization:
- clear the broken local auth state
- treat the user as signed out
- surface a clear message like “Your saved session couldn’t be restored. Please sign in again.”

Result:
- users won’t get trapped in a permanent loading state because of a poisoned saved session

### 3. Stop gating Stats/Scrapbooks behind ambiguous auth loading
Update `src/hooks/useGameHistory.ts` so it only waits for auth initialization to finish, not for indefinite auth recovery.

Changes:
- fetch history only when `isAuthReady && user`
- if `isAuthReady && !user`, stop loading and show the signed-out/empty-state path
- separate auth failure from history failure in error messaging

Result:
- Stats and Scrapbooks will either load data, show a retryable history error, or prompt sign-in
- they will not sit on “Retrieving session data...” forever

### 4. Add explicit UI states for auth failure
Update Stats and Scrapbooks UI to distinguish:
- loading records
- failed to restore session
- signed out
- history fetch failed

Result:
- users get a clear next action instead of a spinner

### 5. Re-check database performance after auth is fixed
Once auth is no longer blocking the page:
- verify whether `game_history` summary loads normally
- if it is still slow, add the pending index on `(user_id, timestamp desc)`
- keep the slim summary select and on-demand detail fetch pattern already started

Result:
- we solve both the immediate blocker and any remaining performance drag

## Files to update

- `src/hooks/useAuth.ts`
- `src/hooks/useGameHistory.ts`
- `src/pages/Stats.tsx`
- `src/pages/Scrapbooks.tsx`
- possibly a migration for `game_history (user_id, timestamp desc)` if performance still needs it after auth is fixed

## Technical notes

Proposed auth flow:

```text
App start
  -> getSession()
     -> success: set user/session, authReady=true
     -> failure: clear invalid persisted auth, authReady=true, user=null
  -> onAuthStateChange()
     -> handle later sign-in / sign-out / token refresh events

History loading
  -> if !authReady: loading
  -> if authReady && !user: not loading, show signed-out state
  -> if authReady && user: fetch game_history summary
```

## Why this is the best next step

Because right now the app appears to be stuck before the history views can recover at all. Fixing auth readiness is the fastest way to unblock both Stats and Scrapbooks together. After that, if query speed is still an issue, I can finish the database/index side cleanly.
</final-text>