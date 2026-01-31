

## Plan: Streamline Stats Dashboard

A comprehensive overhaul of the Stats page to focus on meaningful gameplay metrics, adding narrative elements like Nemesis and Home Turf, while removing clutter.

---

### Summary of Changes

| Section | Changes |
|---------|---------|
| Header | Remove time filter chips |
| Hero Box | Keep: Games, Win Rate, Saved, Killed. Remove: Avg Horror, Closest Call, Signature |
| Story of You | Replace charts, add Nemesis/Usual Suspect/Cursed Site/Home Turf, remove streaks |
| Breakdown Tables | Remove icons from tab labels. Update columns for Final Girls and Locations |
| Removed Sections | HighlightsReel and TrophyGrid components |

---

### Changes by File

#### 1. Stats Page (`src/pages/Stats.tsx`)

- Remove `useState` for timeFilter
- Remove timeFilter prop from `useGameStats` call
- Remove time filter button group from header
- Remove `HighlightsReel` and `TrophyGrid` imports and usage
- Keep PlayerArchetypeBadge (personality feature)

#### 2. RecordJacket (`src/components/stats/RecordJacket.tsx`)

Simplify to 4 stat cards:
- **Games** - Total games played
- **Win Rate** - Percentage (color-coded: cyan if ≥50%, red otherwise)
- **Saved** - Total victims saved (cyan accent)
- **Killed** - Total victims killed (red accent)

Remove: Avg Horror, Closest Call, Signature Weapon

#### 3. TrendsSection (`src/components/stats/TrendsSection.tsx`)

Major redesign:

**Charts:**
- **Win/Loss Bar** - Single horizontal stacked bar showing total wins (green/cyan) vs losses (red)
- **Victims Over Time** - Line chart with two lines: Saved (cyan) and Killed (red) by month

**Narrative Stats (new row of badges):**
- **Nemesis** - Killer with most wins against you (you lost to them most)
- **The Usual Suspect** - Killer you've beaten most often
- **Cursed Site** - Location with most losses
- **Home Turf** - Location with most wins

**Remove:**
- Streaks row (current, best, worst)
- Icon from section title

#### 4. BreakdownTabs (`src/components/stats/BreakdownTabs.tsx`)

**Tab labels:**
- Remove Crown, Skull, MapPin icons from TabsTrigger components

**Final Girls table:**
- Keep: Name, Plays, Wins, Win %
- Add: Victims Saved (total), Victims Killed (total)
- Remove: Avg Horror, Top Weapon

**Killers table:**
- Keep as-is (already has Faced, Escaped, Escape %, Avg Saved, Avg Killed)
- Remove Nemesis lightning bolt icon (nemesis moved to Story of You)

**Locations table:**
- Keep: Name, Plays, Wins, Win %
- Add: Victims Saved (total), Victims Killed (total)
- Remove: Avg Horror, "Most Chaotic" skull icon

#### 5. useGameStats Hook (`src/hooks/useGameStats.ts`)

**Add new computed values:**
- `usualSuspect` - Killer with most losses (you won against them most)
- `homeTurf` - Location with most wins
- `cursedSite` - Location with most losses
- `victimsTrend` - Monthly saved/killed for new line chart

**Update FinalGirlStats interface:**
- Add `totalSaved` and `totalKilled`
- Remove `avgHorror` and `topWeapon`

**Update LocationStats interface:**
- Add `totalSaved` and `totalKilled`
- Remove `avgHorror` and `isMostChaotic`

**Remove unused:**
- `horrorTrend` calculation
- Streak calculations
- Highlight game calculations (mostHeroicWin, mostBrutalLoss, clutchWin, cleanWin)
- `favoriteMatchup` calculation
- `signatureWeapon` calculation
- `closestCall` calculation
- `avgHorrorLevel` calculation

**Remove timeFilter parameter** - always use all games

#### 6. Delete Components

- `src/components/stats/HighlightsReel.tsx` - Delete file
- `src/components/stats/TrophyGrid.tsx` - Delete file

---

### New Data Structures

```text
ComputedStats (updated):
├── gamesPlayed
├── winRate
├── totalVictimsSaved
├── totalVictimsKilled
├── nemesis: { killer, losses }
├── usualSuspect: { killer, wins } (NEW)
├── homeTurf: { location, wins } (NEW)
├── cursedSite: { location, losses } (NEW)
├── gamesByPeriod (for win/loss bar)
├── victimsTrend (NEW - for line chart)
├── byFinalGirl (updated columns)
├── byKiller (unchanged)
├── byLocation (updated columns)
├── playerArchetype
└── archetypeReason
```

---

### Visual Layout After Changes

```text
┌──────────────────────────────────────────────────────────────┐
│ STATS                                                        │
│ YOUR SURVIVAL RECORD                                         │
├──────────────────────────────────────────────────────────────┤
│ [Player Archetype Badge - The Survivor]                      │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────┬──────────┬──────────┬──────────┐               │
│ │  Games   │ Win Rate │  Saved   │  Killed  │               │
│ │    24    │   62%    │    47    │    31    │               │
│ └──────────┴──────────┴──────────┴──────────┘               │
├──────────────────────────────────────────────────────────────┤
│ Story of You                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [█████████████░░░░░░] Wins 15 | Losses 9                │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Victims Over Time (line chart - saved/killed)           │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌──────────┬──────────┬──────────┬──────────┐               │
│ │ Nemesis  │ Usual    │ Cursed   │ Home     │               │
│ │ Dr Fright│ Suspect  │ Site     │ Turf     │               │
│ │          │ Hans     │ Asylum   │ Camp     │               │
│ └──────────┴──────────┴──────────┴──────────┘               │
├──────────────────────────────────────────────────────────────┤
│ [Final Girls] [Killers] [Locations]                          │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Name    │ Plays │ Wins │ Win% │ Saved │ Killed │       │  │
│ │ Laurie  │   5   │  3   │ 60%  │  12   │   4    │       │  │
│ │ Reiko   │   4   │  2   │ 50%  │   8   │   6    │       │  │
│ └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### Files Modified

| File | Action |
|------|--------|
| `src/pages/Stats.tsx` | Edit - remove filter, remove HighlightsReel/TrophyGrid |
| `src/components/stats/RecordJacket.tsx` | Edit - reduce to 4 cards |
| `src/components/stats/TrendsSection.tsx` | Edit - new charts, narrative badges |
| `src/components/stats/BreakdownTabs.tsx` | Edit - update columns, remove icons |
| `src/hooks/useGameStats.ts` | Edit - new stats, remove unused |
| `src/components/stats/HighlightsReel.tsx` | Delete |
| `src/components/stats/TrophyGrid.tsx` | Delete |

---

### Notes

- **PlayerArchetype** is preserved as it adds personality without clutter
- The horizontal win/loss bar is a single aggregate bar (not time-series) for quick visual understanding
- Victims Over Time line chart replaces the Horror Trend chart
- Narrative badges (Nemesis, Usual Suspect, etc.) provide storytelling without complex unlock mechanics

