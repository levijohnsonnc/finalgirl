

## Diagnosis: Why scrapbooks take forever to become clickable

### Root cause
`useGameHistory()` is called independently in 6 components (Index, Scrapbooks, Stats, Archive, Marquee). Each call creates its own `useAuth()` instance and makes its own database fetch. When you navigate to Scrapbooks:

1. A fresh `useAuth()` starts with `isLoading: true`, calls `getSession()` (network round-trip)
2. Only after auth resolves does `useGameHistory` fire `SELECT * FROM game_history` (second network round-trip)
3. Until step 2 completes, `gameHistory` is an empty array, so `wonGames.length === 0` and both cover buttons are **disabled**

This waterfall repeats every time you navigate to Scrapbooks, Stats, or any page using the hook. With 46 games it's not the data size — it's the sequential auth + fetch delay happening redundantly.

### Fix: Shared GameHistory context provider

Create a React Context that calls `useGameHistory()` once at the app root, then all child components consume the already-loaded data instantly.

**1. Create `src/contexts/GameHistoryContext.tsx`**
- Define a context holding the full return value of `useGameHistory()`
- Create a `GameHistoryProvider` component that calls `useGameHistory()` once and provides the value
- Export a `useGameHistoryContext()` consumer hook

**2. Wrap the app in `GameHistoryProvider` (`src/pages/Index.tsx`)**
- Place the provider near the top of the Index component tree
- The provider fetches game history once on mount; all children share that single fetch

**3. Replace all `useGameHistory()` calls with `useGameHistoryContext()`**
- `src/pages/Scrapbooks.tsx` — no more independent fetch
- `src/pages/Stats.tsx` — no more independent fetch
- `src/pages/Archive.tsx` — no more independent fetch
- `src/components/Marquee.tsx` — no more independent fetch
- Keep the `useGameHistory()` call inside the provider itself (Index.tsx level)

### Result
- Auth resolves once, DB fetches once
- Navigating to Scrapbooks shows data instantly (already in memory)
- Cover buttons are enabled immediately without waiting for a redundant fetch cycle

### Files changed
| File | Change |
|------|--------|
| `src/contexts/GameHistoryContext.tsx` | New — context provider + consumer hook |
| `src/pages/Index.tsx` | Wrap children in `GameHistoryProvider` |
| `src/pages/Scrapbooks.tsx` | Switch to `useGameHistoryContext()` |
| `src/pages/Stats.tsx` | Switch to `useGameHistoryContext()` |
| `src/pages/Archive.tsx` | Switch to `useGameHistoryContext()` |
| `src/components/Marquee.tsx` | Switch to `useGameHistoryContext()` |

