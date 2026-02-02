

# Fix Cloud Data Sync for Casting Room and Dashboard

## Problem Identified
Two pages are only reading from localStorage instead of the cloud database when a user is signed in:
1. **CastingRoom.tsx** - Shows "No Films in Collection" because it only reads from localStorage
2. **Dashboard.tsx** - Same issue for owned films (and session logs)

## Solution Approach
Create a dedicated hook `useOwnedFilms` that follows the same pattern used in `useGameHistory.ts` and `Archive.tsx`. This hook will:
- Check authentication state
- If signed in: fetch from `user_settings` table in the database
- If not signed in: use localStorage
- Handle migration of localStorage data on first sign-in (already handled by Archive.tsx)

This approach centralizes the owned films logic and ensures consistency across all pages.

---

## Files to Create

### 1. `src/hooks/useOwnedFilms.ts`
A new hook that encapsulates the dual-state logic for owned films:

**Logic:**
- Import `useAuth` to check authentication state
- Import `useLocalStorage` for non-authenticated users
- Use `useState` for database-fetched data
- Fetch from `user_settings` table when user is authenticated
- Return `{ ownedFilms, setOwnedFilms, isLoading }`
- Handle migration (move localStorage data to DB on first sign-in if DB is empty)

**Key functions:**
- `ownedFilms`: The current array of film IDs (from DB or localStorage depending on auth)
- `setOwnedFilms(updater)`: Update function that persists to the correct location
- `isLoading`: Boolean to show loading state while fetching from DB

---

## Files to Modify

### 2. `src/pages/CastingRoom.tsx`
**Current (broken):**
```typescript
const [ownedFilms] = useLocalStorage<string[]>('final-girl-owned-films', []);
```

**Updated:**
```typescript
import { useOwnedFilms } from '@/hooks/useOwnedFilms';
// ...
const { ownedFilms, isLoading } = useOwnedFilms();
```

- Remove `useLocalStorage` import (no longer needed here)
- Add loading state handling to show a loading indicator while fetching from DB
- The rest of the component logic remains unchanged since it just reads `ownedFilms`

### 3. `src/pages/Dashboard.tsx`
**Current (broken):**
```typescript
const [ownedFilms] = useLocalStorage<string[]>('final-girl-owned-films', []);
const [sessionLogs, setSessionLogs] = useLocalStorage<SessionLog[]>('final-girl-session-logs', []);
```

**Updated:**
```typescript
import { useOwnedFilms } from '@/hooks/useOwnedFilms';
// ...
const { ownedFilms, isLoading: filmsLoading } = useOwnedFilms();
```

- Add loading state handling
- Note: `sessionLogs` is only used for quick session logging during testing. Since this data is not critical for persistence and is a separate feature, it can remain in localStorage for now. The primary gameplay data is already persisted through `useGameHistory`.

### 4. `src/pages/Archive.tsx`
**Current:** Contains inline dual-state logic that duplicates the pattern

**Updated:** Refactor to use the new `useOwnedFilms` hook:
```typescript
import { useOwnedFilms } from '@/hooks/useOwnedFilms';
// ...
const { ownedFilms, setOwnedFilms, isLoading } = useOwnedFilms();
```

- Remove the inline state management for `dbOwnedFilms`, `localOwnedFilms`, etc.
- This simplifies Archive.tsx significantly and ensures consistency

---

## Implementation Details

### Hook Structure (`useOwnedFilms.ts`)
```text
1. Initialize state:
   - localOwnedFilms from useLocalStorage
   - dbOwnedFilms from useState
   - isDbLoading from useState
   - hasMigrated from useState

2. Fetch from DB when authenticated:
   - useEffect that runs when user/authLoading changes
   - Query user_settings table for owned_films
   - Set dbOwnedFilms with result

3. Migrate localStorage on first sign-in:
   - useEffect that checks:
     - User is authenticated
     - Not already migrated
     - LocalStorage has data
     - DB is empty
   - Upsert to user_settings
   - Clear localStorage
   - Update dbOwnedFilms

4. setOwnedFilms function:
   - If authenticated: update dbOwnedFilms + upsert to DB
   - If not authenticated: update localStorage

5. Return:
   - ownedFilms: user ? dbOwnedFilms : localOwnedFilms
   - setOwnedFilms
   - isLoading: authLoading || isDbLoading
```

---

## Data Safety
- No data will be lost because:
  - If user is not signed in: localStorage continues to work as before
  - If user is signed in with data in DB: reads from DB
  - If user signs in for first time with localStorage data: migrates to DB, then clears localStorage
  - The migration logic only runs when DB is empty, preventing accidental overwrites

---

## Technical Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `src/hooks/useOwnedFilms.ts` | Create | New hook with dual-state logic (localStorage/DB) |
| `src/pages/CastingRoom.tsx` | Modify | Use new hook, add loading state |
| `src/pages/Dashboard.tsx` | Modify | Use new hook for ownedFilms |
| `src/pages/Archive.tsx` | Modify | Refactor to use new hook (remove inline logic) |

