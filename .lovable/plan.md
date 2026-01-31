

# Plan: VHS Horror Aesthetic for Stats Page

Transform the Stats page from a clean analytics dashboard into recovered evidence from a cursed VHS tape.

---

## Summary of Changes

| Area | Current State | Target State |
|------|---------------|--------------|
| Background | Pure black void | Fog plate + CRT effects + vignette |
| Color palette | Saturated, celebratory | Desaturated, analog, dreadful |
| Card geometry | Perfect rectangles | Irregular glows, film burn, noise |
| Typography | Polite, legible | Spaced, haunted, occasional flicker |
| Charts | Clean digital | Faded, degraded, drawn-in |
| Framing | Dashboard | Archived footage / evidence |

---

## Implementation Details

### 1. Add Fog Background Plate

**New Asset**: Copy the provided fog image to `src/assets/stats-bg.png`

**Stats Page Container**: Apply background with same layering as Marquee:
- Fog background image (cover, centered)
- Film grain overlay (animated)
- Scanlines overlay (drifting)
- Vignette (asymmetric)
- Blue-black base color instead of pure black

**CSS Changes** (`src/index.css`):
```css
.stats-page {
  position: relative;
  min-height: 100vh;
}

.stats-page::before {
  content: '';
  position: fixed;
  inset: 0;
  background: 
    url('@/assets/stats-bg.png') center/cover no-repeat,
    hsl(220 15% 4%); /* Blue-black, not pure black */
  z-index: -3;
}
```

**Component Changes** (`Stats.tsx`):
- Add film grain, scanlines, and vignette overlays as child elements

---

### 2. Horror Color Logic (Desaturated + Analog)

**Update stat card color palette**:

| Stat | Current | New Meaning | New Color |
|------|---------|-------------|-----------|
| Games | Blue | Survival/Control | Keep, slight desaturation |
| Win Rate | Yellow | False Hope | Desaturated yellow, add slow flicker |
| Saved | Green | Sickly survival | Desaturated, murky green |
| Killed | Red | Blood Debt | Deep red, add slow pulse |

**CSS Changes**:
- Desaturate all hero stat colors by ~15-20%
- Add `@keyframes blood-pulse` for red values (slow, breathing glow)
- Add `@keyframes false-hope-flicker` for yellow values (rare, subtle)
- Change green to sickly tone: `hsl(145 40% 40%)` instead of `hsl(145 70% 55%)`

---

### 3. Break Perfect Geometry

**Irregular glow bleed**:
- Asymmetric box-shadows (offset to bottom-right)
- Subtle inner shadow suggesting film damage

**Film burn corners**:
- Add `::after` pseudo-element with radial gradients on corners
- Low opacity, warm/orange tint

**Per-card noise texture**:
- Each card gets its own subtle noise overlay via `::before`
- Slightly different opacity per variant

**CSS Example**:
```css
.hero-stat-card {
  /* Asymmetric glow - heavier on bottom-right */
  box-shadow: 
    3px 5px 25px hsl(200 70% 50% / 0.25),
    -1px -1px 10px hsl(200 70% 50% / 0.1),
    inset 0 0 20px rgba(0,0,0,0.4);
}

/* Film burn overlay */
.hero-stat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at top-right, hsl(30 60% 50% / 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at bottom-left, hsl(30 60% 30% / 0.04) 0%, transparent 40%);
  pointer-events: none;
  border-radius: inherit;
}
```

---

### 4. Archival Framing + REC Indicator

**Add persistent "REC ●" indicator**:
- Top-right of stats page
- Red dot with slow pulse animation
- VHS font, low opacity

**Add archival micro-copy**:
- Below "STATS" header: change "YOUR SURVIVAL RECORD" to `SESSION DATA LOGGED`
- Add timestamp that updates slowly (every second)
- Section subtitles: "Story of You" becomes `// RECOVERED FOOTAGE`

**Component Changes** (`Stats.tsx`):
```tsx
{/* REC Indicator */}
<div className="rec-indicator">
  <span className="rec-dot" />
  <span>REC</span>
</div>

{/* Header with archival framing */}
<p className="font-vhs text-xs text-muted-foreground tracking-[0.3em]">
  SESSION DATA LOGGED • {formattedTime}
</p>
```

---

### 5. Typography Adjustments

**Headers**:
- Increase letter-spacing on "STATS" and section titles
- Add `stats-title-flicker` animation (very slow, very rare)

**Numbers**:
- Add subtle text-shadow blur on stat numbers
- Slight tracking increase

**CSS**:
```css
.stats-header h1 {
  letter-spacing: 0.2em;
  animation: stats-title-flicker 12s ease-in-out infinite;
}

@keyframes stats-title-flicker {
  0%, 92%, 100% { opacity: 1; }
  93% { opacity: 0.85; }
  94% { opacity: 0.95; }
  95% { opacity: 0.8; }
  96% { opacity: 1; }
}
```

---

### 6. Chart Degradation

**Line chart adjustments**:
- Reduce grid line opacity to near-invisible
- Axis text: lower contrast, slightly blurred
- Add animation props to recharts for slower "draw-in" effect
- Subtle horizontal roll effect (optional, via container)

**CSS for chart container**:
```css
.chart-container {
  /* Aged film look */
  filter: contrast(0.95) saturate(0.85);
}

.chart-container .recharts-cartesian-grid line {
  opacity: 0.15;
}

.chart-container .recharts-text {
  opacity: 0.6;
  filter: blur(0.3px);
}
```

---

### 7. Container Sections (Trends, Breakdowns)

**Update all section containers**:
- Change from `bg-background/40` to use the blue-black tone
- Add subtle noise overlay
- Film burn on edges (same treatment as cards)

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/assets/stats-bg.png` | New file - copy from user upload |
| `src/pages/Stats.tsx` | Add overlays, REC indicator, archival copy, timestamp |
| `src/components/stats/RecordJacket.tsx` | Add relative positioning for overlay pseudo-elements |
| `src/components/stats/TrendsSection.tsx` | Update section title text, chart styling |
| `src/components/stats/BreakdownTabs.tsx` | Minor styling adjustments |
| `src/index.css` | Major additions for VHS effects, colors, animations |

---

## New CSS Classes to Add

```text
.stats-bg-layer          - Fog background positioning
.stats-grain-overlay     - Film grain for stats page
.stats-scanlines         - Scanlines overlay
.stats-vignette          - Vignette effect
.rec-indicator           - REC ● element styling
.rec-dot                 - Pulsing red dot
.blood-pulse             - Animation for red values
.false-hope-flicker      - Animation for yellow values
.film-burn-overlay       - Corner burn effect for cards
.card-noise              - Per-card noise texture
.stats-title-flicker     - Rare header flicker
.chart-degraded          - Aged chart styling
```

---

## Color Palette Changes

| Token | Current HSL | New HSL | Notes |
|-------|-------------|---------|-------|
| Blue (Games) | `200 100% 60%` | `200 70% 55%` | Slightly desaturated |
| Yellow (Win Rate) | `45 100% 60%` | `45 70% 50%` | Warmer, dimmer |
| Green (Saved) | `145 70% 55%` | `145 40% 40%` | Sickly, murky |
| Red (Killed) | `0 70% 60%` | `0 60% 45%` | Deeper, more ominous |
| Background | `0 0% 4%` | `220 15% 4%` | Blue-black tone |

---

## Animation Summary

| Animation | Target | Duration | Notes |
|-----------|--------|----------|-------|
| `blood-pulse` | Red stat values | 4s | Slow breathing glow |
| `false-hope-flicker` | Yellow stat values | 8s | Rare opacity dips |
| `stats-title-flicker` | Page header | 12s | Very subtle, rare |
| `grain-shift` | Film grain overlay | 0.5s | Existing animation |
| `scanline-drift` | Scanlines | 10s | Existing animation |

---

## The Guiding Principle

> "Would this exist on a cursed VHS menu screen?"

Every element should feel **recorded, not rendered**. The Stats page becomes evidence someone found after the fact—a diegetic artifact within the horror universe.

