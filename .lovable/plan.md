

# Upgrade Archetype Readout to Rich Player Profile

## What changes

Replace the single-sentence archetype reason with a multi-paragraph, data-driven player profile that weaves together the archetype identity with the player's actual stats — nemesis, comfort zone, victim ratios, horror trends, and more.

## Approach

Generate the extended profile **client-side** in `useArchetypeScoring.ts` — no AI call needed. The scoring functions already have access to all the raw data; we just need to compose a richer narrative from it.

### 1. Expand `computeArchetype` return value

**File: `src/hooks/useArchetypeScoring.ts`**

- Add a new `profile` string field to the return type (alongside existing `reason`)
- After determining the winning archetype, build a 2-3 paragraph profile by combining:
  - **Paragraph 1 — Archetype identity**: The core playstyle description, expanded from the current one-liner. Each archetype gets a thematic opening that references specific numbers (win rate, save ratio, clutch wins, horror variance)
  - **Paragraph 2 — Cross-archetype color**: Reference the runner-up archetype score to add nuance (e.g., "You're a Gambler at heart, but your 68% save ratio hints at a Protector's instinct"). Pull in secondary stats like most-played final girl, nemesis killer, or game count for texture
  - **Paragraph 3 (conditional)**: Only if there's a strong secondary trait (runner-up score within 15 points), add a sentence about the tension between the two styles

- Pass additional context into the function: the full `ComputedStats` narrative fields (nemesis, comfort zone, grinder, etc.) so the profile can reference them by name

### 2. Wire the profile through `useGameStats`

**File: `src/hooks/useGameStats.ts`**

- Add `archetypeProfile: string` to `ComputedStats`
- Pass narrative stats into `computeArchetype` so the profile text can mention specific killers/girls/locations by name
- Store the returned `profile` as `archetypeProfile`

### 3. Update the badge component

**File: `src/components/stats/PlayerArchetype.tsx`**

- Accept new `profile` prop alongside existing `reason`
- Keep the archetype name as the title
- Replace the single `reason` line with the multi-paragraph `profile` text
- Style each paragraph with the existing `archetype-reason` class but add spacing between paragraphs
- The tone follows the lore style notes: pulp VHS horror, lean, atmospheric, data-grounded — no invented lore

### 4. Pass it from the Stats page

**File: `src/pages/Stats.tsx`**

- Pass `stats.archetypeProfile` to `PlayerArchetypeBadge`

## Example output (The Gambler)

> **The Gambler**
>
> Your games are a study in chaos. Horror levels swing from 1 to 7 across your 12 sessions — calm, controlled outings one night, full-blown carnage the next. With a standard deviation of 2.4, no two games feel the same. You don't play for consistency; you play to see what happens.
>
> That said, your 58% save ratio suggests the chaos isn't entirely reckless. When the dust settles, more victims walk out alive than don't. Your 5 losses to Hans have made him your nemesis, but you keep coming back — a Gambler through and through.

## What stays the same
- Archetype scoring logic unchanged
- No AI/edge function calls — purely deterministic text
- Existing tests remain valid (they check `archetype` and `reason`, both still returned)

