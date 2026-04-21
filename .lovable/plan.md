

## Plan: Per-Killer & Per-Location rules in the Rulebook

Add **owned-only** module rule sections for individual Killers and Locations. Start with **Grimlash** (killer) and **Storybook Woods** (location), transcribed verbatim from the uploaded sheets. Each rules entry is split into **Special Setup** and **Special Rules**, matching the printed sheets.

### Where it appears
- Same `/rules` page, rendered **below** the Core Rulebook chapters in two new chapter groups:
  - `KILLERS` — one chapter per owned killer
  - `LOCATIONS` — one chapter per owned location
- Each chapter has two sub-tabs: `SETUP` and `RULES` (reusing the existing `RuleSubTabs` component).
- Chapters only render if the user owns at least one Feature Film containing that killer/location. If the user owns nothing in a group, the entire `KILLERS` / `LOCATIONS` group is hidden.
- Search bar already in the page indexes these new sections automatically.

### Ownership gating
Reuse `useOwnedFilms()` plus `FEATURE_FILMS` to compute the owned killer + location name sets:
- A killer module is shown if any owned film's `killer` matches.
- A location module is shown if any owned film's `location` matches.
- For unauthenticated/empty collections, neither group renders (matches the rest of the app's collection-gated pattern).

### Data model (additive, no breaking changes)

New file `src/data/rules/moduleRules.ts` exports:

```ts
interface EntityRuleModule {
  entity: string;          // e.g. 'Grimlash' (matches FEATURE_FILMS killer/location names)
  kind: 'killer' | 'location';
  filmId: string;          // e.g. 's4-rotten-harvest' — used for ownership check
  source: string;          // e.g. 'A Rotten Harvest — Killer Sheet'
  setup: RuleBlock[];      // body for SETUP sub-tab
  rules: RuleBlock[];      // body for RULES sub-tab
  tags?: string[];
}
```

Two seed entries transcribed verbatim from the uploaded photos:

1. **Grimlash** (`kind: 'killer'`, `filmId: 's4-rotten-harvest'`)
   - SETUP: split Harvest Madness cards by level into 3 decks; place Harvest Madness marker on the orange starting space at the top of the Killer board.
   - RULES: full **Harvest Madness** explanation — pumpkin-icon trigger, draw 2 / keep 1 per new level, effects persist while at-or-above that level, Level 3 → skull = lose, heart-recovery may instead reduce Madness (one or the other, not both), discarding cards on level-down, redraw on re-entering a level, face-down once-per-turn flips reset in Upkeep.

2. **Storybook Woods** (`kind: 'location'`, `filmId: 's2-once-upon-full-moon'`)
   - SETUP: "Setup the game as normal — there are no special setup rules for this Location."
   - RULES: **Fewer Spaces** note · **Bridges** (3 bridges + Toll Bridge token: only 1 Victim follows across) · **The Raft** (choose 4 marked ashore-spaces touching river + non-exit, move along river per Raft Item card).

All text is a direct transcription from the printed sheets. Each module carries a `source` field for clear attribution. No inference, no merging with Core rules.

### Rendering
- New component `src/components/rules/EntityRuleChapter.tsx` — thin wrapper that builds a `RuleChapter` with two synthetic sections (`{id}-setup`, `{id}-rules`) and feeds them to existing `RuleSubTabs` so the look matches Core chapters exactly.
- `src/pages/Rules.tsx` updates:
  - Compute `ownedKillerModules` and `ownedLocationModules` from `useOwnedFilms` + `moduleRules`.
  - Render two group headers (`KILLERS`, `LOCATIONS`) styled as the existing chapter dividers, each followed by their owned chapters.
  - Search match counts include these new sections (reuse existing `sectionMatches` over the synthetic SETUP+RULES bodies).

### Files

| File | Change |
|---|---|
| `src/data/rules/moduleRules.ts` | **New.** `EntityRuleModule` type + Grimlash + Storybook Woods entries (verbatim from photos). |
| `src/components/rules/EntityRuleChapter.tsx` | **New.** Wraps a module as a chapter with SETUP / RULES sub-tabs. |
| `src/pages/Rules.tsx` | Filter modules by owned films, render KILLERS + LOCATIONS groups, include in search index. |
| `src/data/rules/types.ts` | Export `EntityRuleModule` type alongside existing types. |

### Out of scope (easy follow-ups later)
- Final Girl per-character rules (no per-girl sheets transcribed yet).
- Vignette rules (different structure).
- Cross-links from Core rules (e.g. Bloodlust) into specific killer overrides.
- Empty-state copy explaining "Own a Feature Film to unlock its killer/location rules" — happy to add if you want, just say so.

