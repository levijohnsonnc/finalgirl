

## Plan: Integrate Final Girl Health Values

This plan adds character-specific health values for each Final Girl based on the official game data you provided. Currently, the app assumes all characters have the same health (max 20), but Final Girls actually have 5 or 6 HP depending on the character.

---

### Overview

We'll create a central data file mapping each Final Girl to her starting health, then update all components that reference health to use these accurate values.

---

### Changes

#### 1. Create Final Girl Health Data File

**New file:** `src/data/finalGirlHealth.ts`

Creates a lookup table mapping each Final Girl name to her starting health value:
- Characters with 5 HP: Reiko, Alice, Barbara, Asami, Nancy, Jeanette, Uki, Ava, Red, Veronica, Octavia, Riley, Kirsty, Nora, Cindy, Rena, Vicky, Rita, Alois
- Characters with 6 HP: Laurie, Selena, Adelaide, Charlie, Sheila, Ellen, Kate, Ginny, Gretel, Heather, Janelle, Mia, Heather, Julia, Noel, Gwynn, Joy, Lindi, Dakota

Also includes:
- `getFinalGirlHealth(name)` helper function that returns the health value (defaults to 5 if unknown)
- `getFinalGirlMaxHealth(name)` alias for clarity in UI contexts

#### 2. Update Game Outcome Form

**File:** `src/components/GameOutcomeForm.tsx`

Changes:
- Import the health lookup function
- Set the default health value based on the selected Final Girl's actual max HP
- Set the max attribute on the health input to match the character's max HP
- Update the label to show the character-specific max (e.g., "Final Girl Health (0-6)")

#### 3. Update LLM Ending Generation Prompts

**File:** `supabase/functions/generate-ending/index.ts`

Changes:
- Update the system prompt to explain health is on a 5-6 HP scale (not 0-20)
- Pass the max health value in the optional stats section for accurate context
- Example: `Final Girl Health: 2/6` instead of `2/20`

#### 4. Update Stats Calculations

**File:** `src/hooks/useGameStats.ts`

Changes to threshold calculations that currently assume 20 HP max:
- **Clutch Win**: Change from `≤2 HP` to `≤1 HP` (surviving with 1 HP out of 5-6 is clutch)
- **Clean Win**: Change from `≥8 HP` to checking if health equals max health (won without taking damage)
- **Low Health Wins**: Change from `≤3 HP` to `≤2 HP` for archetype calculations

Also add the health lookup import to show percentage-based context where relevant.

#### 5. Update Validation Schemas

**File:** `supabase/functions/_shared/validation.ts`

Changes:
- Update `finalGirlHealth` max from 20 to 10 (allows some buffer for edge cases or custom games)

---

### Technical Details

```text
src/
├── data/
│   └── finalGirlHealth.ts (NEW)  ── Health lookup table
├── components/
│   └── GameOutcomeForm.tsx       ── Dynamic max health per character
├── hooks/
│   └── useGameStats.ts           ── Adjusted thresholds
supabase/
└── functions/
    ├── _shared/
    │   └── validation.ts         ── Updated max validation
    └── generate-ending/
        └── index.ts              ── Accurate health context for LLM
```

---

### Data Mapping

Based on your provided table, here's the mapping that will be created:

| Health | Final Girls |
|--------|-------------|
| 5 HP | Reiko, Alice, Barbara, Asami, Nancy, Jeanette, Uki, Ava, Red, Veronica, Traci, Riley, Kirsty, Nora, Cindy, Rena, Vicky, Rita, Alois, Meghan, Cassie |
| 6 HP | Laurie, Selena, Adelaide, Charlie, Sheila, Ellen, Kate, Ginny, Gretel, Heather, Danielle, Mia, Heather, Julia, Noel, Gwynn, Joy, Lindi, Dakota, Ronda, Mandy |

Note: Some names from your table have slight spelling variations from what's in the codebase (e.g., "Jeanette" vs "Jenette"). I'll align with the existing codebase spellings.

---

### Impact

- **Forms**: Health input will show correct max and default for each character
- **Stats**: Thresholds will accurately reflect close calls and clean wins
- **LLM Generation**: Story endings will understand the true stakes (2 HP remaining out of 5 is dire, not minor)
- **Backwards Compatibility**: Existing game records with health values will still work; stats calculations will be more meaningful

