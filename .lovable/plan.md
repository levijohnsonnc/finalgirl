
# Blood Tube Win/Loss Bar Enhancement

## Overview

Transform the current flat Win/Loss horizontal bar into a realistic, horror-themed blood specimen tube that feels like a physical prop from a VHS-era slasher film.

---

## Current State

The existing implementation uses simple CSS:
- Flat color fills (`hsl(var(--neon-cyan))` for wins, `hsl(var(--blood-red))` for losses)
- Basic border and rounded corners
- No depth, texture, or physical presence

---

## Implementation Plan

### 1. Glass Tube Container

Create a realistic tube shell that suggests glass or plastic:

**CSS changes to `.winloss-bar`:**
- Add **inset shadows** for inner glass edges (top highlight, bottom shadow)
- Add **outer glow/shadow** for ambient depth
- Increase height slightly for more presence
- Use a subtle **translucent gradient** for the empty tube portion

```css
.winloss-bar {
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(
    to bottom,
    hsl(220 15% 12% / 0.4) 0%,
    hsl(220 15% 6% / 0.6) 50%,
    hsl(220 15% 4% / 0.8) 100%
  );
  box-shadow:
    /* Inner glass highlight (top) */
    inset 0 1px 2px rgba(255, 255, 255, 0.12),
    /* Inner shadow (bottom) */
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    /* Outer ambient shadow */
    0 4px 12px rgba(0, 0, 0, 0.4),
    /* Subtle rim glow */
    0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid hsl(0 0% 25% / 0.4);
}
```

---

### 2. Blood Fill (Losses) - Rich, Heavy, Organic

The blood side needs to feel thick, heavy, and slightly unsettling:

**CSS changes to `.winloss-losses`:**
- **Multi-layer gradient**: darker at bottom (pooling), richer crimson in middle, slightly darker at top
- **Noise/grain texture overlay** using SVG filter
- **Internal shadow** at the fill edge for meniscus effect
- Rounded edge more aggressive than container

```css
.winloss-losses {
  background: linear-gradient(
    to bottom,
    hsl(0 60% 20%) 0%,        /* Top: darker, oxidized */
    hsl(0 70% 35%) 40%,       /* Mid: rich arterial crimson */
    hsl(0 65% 25%) 80%,       /* Lower: deeper, heavier */
    hsl(0 50% 12%) 100%       /* Bottom: black-red pooling */
  );
  border-radius: 999px;
  position: relative;
  box-shadow:
    /* Left edge meniscus/shadow */
    inset 3px 0 6px rgba(0, 0, 0, 0.5),
    /* Top internal shadow */
    inset 0 2px 3px rgba(0, 0, 0, 0.3);
}

/* Grain/noise overlay pseudo-element */
.winloss-losses::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("noise-svg");
  opacity: 0.08;
  mix-blend-mode: overlay;
  border-radius: inherit;
}

/* Micro-imperfections: subtle streaks */
.winloss-losses::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 20%,
    transparent 25%,
    rgba(60, 0, 0, 0.08) 60%,
    transparent 65%
  );
  border-radius: inherit;
}
```

---

### 3. Serum Fill (Wins) - Cleaner, Thinner, Medical

The wins side should feel like clean serum - thinner, lighter, almost clinical:

**CSS changes to `.winloss-wins`:**
- **Lighter gradient**: translucent cyan with internal depth
- **Glass-like internal reflections**
- Slightly more transparency than blood

```css
.winloss-wins {
  background: linear-gradient(
    to bottom,
    hsl(var(--neon-cyan) / 0.5) 0%,
    hsl(var(--neon-cyan) / 0.7) 50%,
    hsl(var(--neon-cyan) / 0.6) 100%
  );
  border-radius: 999px;
  position: relative;
  box-shadow:
    /* Right edge internal shadow */
    inset -2px 0 4px rgba(0, 0, 0, 0.3),
    /* Top highlight */
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
}
```

---

### 4. Contamination Zone (Where They Meet)

Add a dirty, murky transition where wins and losses meet:

**Implementation approach:**
Add a pseudo-element on `.winloss-losses` that creates a blended overlap zone on the left edge:

```css
/* Dirty transition zone */
.winloss-losses::before {
  /* Already used for noise, combine with this: */
  background: 
    linear-gradient(90deg, 
      rgba(0, 80, 80, 0.3) 0%, 
      transparent 20px
    ),
    url("noise-svg");
}
```

This creates a slight desaturation/murkiness at the boundary where the two fluids meet.

---

### 5. Tube End Caps

Add visual end caps to make the tube feel complete:

**New pseudo-elements on `.winloss-bar`:**
```css
.winloss-bar::before,
.winloss-bar::after {
  content: '';
  position: absolute;
  top: 2px;
  bottom: 2px;
  width: 8px;
  border-radius: 999px;
  background: linear-gradient(
    to bottom,
    hsl(0 0% 30% / 0.6),
    hsl(0 0% 15% / 0.8)
  );
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.winloss-bar::before { left: 2px; }
.winloss-bar::after { right: 2px; }
```

---

### 6. Optional: Subtle Animation

Add an almost imperceptible internal drift:

```css
@keyframes blood-drift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.winloss-losses {
  animation: blood-drift 30s ease-in-out infinite;
  background-size: 200% 100%;
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Complete restyle of `.winloss-bar`, `.winloss-wins`, `.winloss-losses` classes (~lines 2110-2128) |
| `src/components/stats/TrendsSection.tsx` | Minor: add `position: relative` wrapper if needed for pseudo-elements |

---

## Expected Result

A blood specimen tube that:
- Has visible "glass walls" with light catching the edges
- Contains thick, heavy blood on the losses side with internal gradients and grain
- Contains thinner, cleaner serum on the wins side
- Shows a dirty transition zone where they meet
- Feels like it belongs on a VHS-era horror movie prop table
- Passes the test: "If this were printed on a VHS-era horror prop, would it pass?"
