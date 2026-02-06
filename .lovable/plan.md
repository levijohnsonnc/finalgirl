

# Improve Player Archetype System

## Overview
Replace the current "first match wins" cascade with a **scoring-based system** where each archetype gets a score from 0-100 based on how strongly the player's data matches that playstyle. The highest score wins. This prevents one archetype (like Protector) from always dominating, and lets the system reflect what truly defines a player's style.

## What Changes

### 1. Lower the game gate from 5 to 3
Players will see a real archetype sooner instead of "Newcomer" for their first 4 games.

### 2. Use HP-relative thresholds for Survivor
Instead of a flat "2 HP or less" check, the system will use each Final Girl's actual max HP (from the existing health data file) to determine what counts as a "clutch win." A win at 1/6 HP is more dramatic than 2/5 HP -- the system will reflect that by calculating health as a percentage of max.

### 3. Replace cascade with independent scoring

Each archetype gets a score (0-100) computed independently:

- **Protector** -- How much does the player prioritize rescuing victims?
  - Based on the *save ratio*: victims saved / total victims (saved + killed)
  - A 60%+ save ratio scores high; below 30% scores near zero
  - Also weighted by raw avg victims saved per game

- **Survivor** -- Does the player win by the skin of their teeth?
  - Based on percentage of wins where Final Girl health ended at 33% or less of her character-specific max HP
  - A player where 50%+ of wins are "clutch" scores high

- **Duelist** -- Is the player efficient and controlled?
  - Based on high win rate combined with consistently low horror levels on wins
  - A 70%+ win rate with average horror under 3 on wins scores highest

- **Gambler** -- Are the player's games wildly unpredictable?
  - Based on variance/standard deviation of horror levels across all games
  - Also factors in mix of blowout wins and devastating losses

The highest scoring archetype wins. Ties go to the more "dramatic" archetype.

### 4. More flavorful reason text
The reason text will incorporate actual numbers from the player's data, e.g., "You've clawed your way to victory at 1 HP twice" instead of generic descriptions.

## Technical Details

### File: `src/hooks/useGameStats.ts`
- Import `getFinalGirlHealth` from `@/data/finalGirlHealth`
- Replace the archetype cascade block (lines 200-230) with a scoring function
- Each archetype gets a `computeScore(games, wins, ...)` helper that returns 0-100
- Add a `generateReason(archetype, games)` helper for data-driven reason text
- No changes to the `ComputedStats` interface or `PlayerArchetype` type -- the rest of the app remains untouched

### Scoring logic (pseudocode):

```text
protectorScore:
  saveRatio = totalSaved / (totalSaved + totalKilled)
  avgSaved = totalSaved / gamesPlayed
  score = (saveRatio * 60) + min(avgSaved / 8, 1) * 40

survivorScore:
  clutchWins = wins where (health / maxHP) <= 0.33
  clutchRatio = clutchWins / totalWins
  score = clutchRatio * 100

duelistScore:
  winFactor = min(winRate / 80, 1) * 50
  horrorOnWins = avg horror level across wins only
  controlFactor = max(0, 1 - horrorOnWins / 7) * 50
  score = winFactor + controlFactor

gamblerScore:
  stdDev of horror levels across all games
  score = min(stdDev / 2.5, 1) * 70
  + (has both a game at horror 1-2 AND a game at horror 6-7 ? 30 : 0)
```

### File: `src/components/stats/PlayerArchetype.tsx`
- No structural changes needed -- it already receives `archetype` and `reason` as props

### Calibration against real data
The user's 9 games produce:
- Save ratio: 39/93 = 42% with avg 4.33/game --> moderate Protector score (~55)
- Clutch wins: 2 of 6 wins at <=33% max HP --> moderate Survivor score (~33)
- Win rate 67%, avg horror on wins 1.67 --> strong Duelist score (~75)
- Horror std dev ~2.13, has games at horror 1 and 7 --> moderate Gambler score (~60)

Result: **Duelist** wins -- which better reflects a player with a 67% win rate who keeps horror consistently low on wins. This is a much more accurate and meaningful classification than the current "Protector" label that triggers just because the save count is above 3.

