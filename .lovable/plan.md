

# Fix: Stats Hero Cards Not Displaying Background Images

## Problem Diagnosis

The Stats page is displaying an **old version** of the RecordJacket component instead of the updated one with background images. 

### Evidence:
| What user sees | What code should render |
|----------------|-------------------------|
| Plain dark cards with text labels (GAMES, WIN RATE, etc.) | Atmospheric background images with labels baked in |
| Icons (Gamepad, Trophy, Heart, Skull) | No icons - just the value number |
| Uniform styling | Unique art per stat card |

### Current state of `RecordJacket.tsx`:
The code file actually looks **correct** - it imports the 4 background images and renders `StatCard` components using the `hero-stat-card-image` class with inline `backgroundImage` styles. No icons or text labels are present in the current code.

### Current state of images:
The images in `src/assets/stats/` are **correct** - they show the atmospheric backgrounds with labels baked into the artwork.

### Root Cause:
The browser is rendering a cached/stale version of the code. This could be caused by:
1. Hot Module Replacement (HMR) not picking up the changes
2. Browser caching the old bundle
3. The code changes not being properly saved/deployed

---

## Fix Implementation

### Step 1: Force a clean re-render of RecordJacket.tsx

Re-save the component with a minor structural adjustment to ensure the changes are picked up:

**File: `src/components/stats/RecordJacket.tsx`**
- Verify imports are correct for all 4 background images
- Ensure `StatCard` uses `backgroundImage` style prop
- Ensure no icons or text labels exist in the component
- Add a key prop to force React to re-render

```tsx
import { ComputedStats } from '@/hooks/useGameStats';
import gamesBg from '@/assets/stats/games-bg.png';
import winrateBg from '@/assets/stats/winrate-bg.png';
import savedBg from '@/assets/stats/saved-bg.png';
import killedBg from '@/assets/stats/killed-bg.png';

interface RecordJacketProps {
  stats: ComputedStats;
}

interface StatCardProps {
  value: string | number;
  backgroundImage: string;
}

const StatCard = ({ value, backgroundImage }: StatCardProps) => {
  return (
    <div 
      className="hero-stat-card-image"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="hero-stat-value">
        {value}
      </div>
    </div>
  );
};

export const RecordJacket = ({ stats }: RecordJacketProps) => {
  return (
    <div className="record-jacket">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          value={stats.gamesPlayed}
          backgroundImage={gamesBg}
        />
        <StatCard
          value={`${Math.round(stats.winRate)}%`}
          backgroundImage={winrateBg}
        />
        <StatCard
          value={stats.totalVictimsSaved}
          backgroundImage={savedBg}
        />
        <StatCard
          value={stats.totalVictimsKilled}
          backgroundImage={killedBg}
        />
      </div>
    </div>
  );
};
```

### Step 2: Verify CSS for hero-stat-card-image

**File: `src/index.css`** (lines ~1991-2049)

Ensure the styling is present:
```css
.hero-stat-card-image {
  @apply flex items-center justify-center rounded-lg transition-all duration-300;
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  border: 1px solid hsl(0 0% 20% / 0.5);
  box-shadow: 0 4px 20px hsl(0 0% 0% / 0.5), inset 0 0 40px hsl(0 0% 0% / 0.3);
}

.hero-stat-value {
  @apply font-display text-5xl sm:text-6xl font-bold text-white;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px hsl(0 0% 0% / 0.8), 0 0 30px hsl(0 0% 0% / 0.6);
}
```

### Step 3: Remove any old hero-stat-card classes

Search for and remove any leftover CSS that defines `hero-stat-card` (without `-image`) that might be conflicting. Look for classes like:
- `.hero-stat-card-blue`
- `.hero-stat-card-yellow`
- `.hero-stat-card-green`
- `.hero-stat-card-red`

These should be deleted if they still exist from the previous implementation.

---

## Files to Modify

| File | Action |
|------|--------|
| `src/components/stats/RecordJacket.tsx` | Re-save to trigger rebuild (code is correct) |
| `src/index.css` | Remove any old `hero-stat-card-*` variant classes if present |

---

## Expected Result

After the fix, the Stats page hero section should show:
- 4 atmospheric background images (fog scene, cabin, chapel, crime scene)
- Labels baked into the artwork (GAMES, Win Rate, Saved, Killed)
- Large white numerical values overlaid in the center of each card
- No Lucide icons
- No separate text labels

