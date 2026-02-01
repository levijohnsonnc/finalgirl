

# Blood Tube Visual Enhancements

## Overview

Three targeted changes to make the blood tube look more organic and match the reference images:

1. **Soft blend at the red/blue boundary** - Replace hard edge with organic fluid mixing
2. **Remove dark streak bars** - Delete the imperfection overlay causing visible dark bands
3. **Add organic blood texture** - Use a blood texture image for realistic bubbles and waves

---

## Changes

### 1. Soft Blend Between Serum and Blood

**Problem:** Currently the cyan and red meet at a sharp edge with only a small teal tint overlay.

**Solution:** Create an organic mixing zone where the two fluids visually blend together using gradients and overlays.

**Implementation:**

Add an extended blend zone on the left edge of `.winloss-losses`:
```css
/* Extended organic blend zone on blood side */
.winloss-losses::before {
  background: 
    /* Organic blend - larger, softer transition */
    radial-gradient(
      ellipse 40px 100% at 0% 50%,
      rgba(0, 180, 180, 0.4) 0%,
      rgba(0, 120, 120, 0.25) 30%,
      rgba(80, 40, 40, 0.15) 60%,
      transparent 100%
    ),
    /* Additional mixing blobs */
    radial-gradient(
      circle at 15px 30%,
      rgba(0, 150, 150, 0.3) 0%,
      transparent 12px
    ),
    radial-gradient(
      circle at 8px 70%,
      rgba(0, 140, 140, 0.25) 0%,
      transparent 8px
    );
}
```

Add matching blend on the right edge of `.winloss-wins`:
```css
/* Blood bleeding into serum */
.winloss-wins::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(
      ellipse 30px 100% at 100% 50%,
      rgba(140, 40, 40, 0.3) 0%,
      rgba(100, 30, 30, 0.15) 40%,
      transparent 100%
    ),
    radial-gradient(
      circle at calc(100% - 10px) 40%,
      rgba(120, 30, 30, 0.2) 0%,
      transparent 10px
    );
  border-radius: inherit;
  pointer-events: none;
}
```

---

### 2. Remove Dark Streak Bars

**Problem:** The `.winloss-losses::after` pseudo-element creates visible dark vertical bands.

**Solution:** Remove or significantly reduce the streak gradient.

**Implementation:**

Either remove the `::after` pseudo-element entirely, or replace it with very subtle variation:

```css
/* Remove entirely - delete this block */
.winloss-losses::after {
  /* REMOVED */
}
```

Or keep extremely subtle:
```css
.winloss-losses::after {
  content: '';
  position: absolute;
  inset: 0;
  /* Much more subtle - barely visible */
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(40, 0, 0, 0.05) 30%,
    transparent 35%,
    rgba(60, 10, 10, 0.04) 65%,
    transparent 70%
  );
  border-radius: inherit;
  pointer-events: none;
}
```

---

### 3. Add Organic Blood Texture

**Problem:** Current fractal noise is too uniform - needs the wavy, bubble-filled look from the reference.

**Solution:** Use an SVG-based texture that creates organic waves and bubble shapes.

**Implementation:**

Create a more organic texture using layered radial gradients and turbulence:

```css
.winloss-losses::before {
  background: 
    /* Organic blend zone (from step 1) */
    radial-gradient(...),
    /* Bubble/clot effect - multiple circles */
    radial-gradient(circle at 25% 30%, rgba(60, 0, 0, 0.15) 0%, transparent 6px),
    radial-gradient(circle at 45% 60%, rgba(80, 10, 10, 0.12) 0%, transparent 8px),
    radial-gradient(circle at 70% 25%, rgba(50, 0, 0, 0.1) 0%, transparent 5px),
    radial-gradient(circle at 85% 70%, rgba(70, 5, 5, 0.14) 0%, transparent 7px),
    radial-gradient(circle at 55% 80%, rgba(40, 0, 0, 0.08) 0%, transparent 4px),
    /* Wave pattern using repeating gradients */
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 16 Q25 8 50 16 T100 16 V32 H0 Z' fill='rgba(0,0,0,0.08)'/%3E%3C/svg%3E"),
    /* Subtle noise for depth */
    url("data:image/svg+xml,...noise...");
  background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 80px 32px, 200px 200px;
  opacity: 0.2;
}
```

Alternative: Add a wavy highlight along the top edge for the "surface tension" look:

```css
/* Surface tension / meniscus effect */
.winloss-losses::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(
    to bottom,
    rgba(255, 200, 200, 0.15) 0%,
    transparent 100%
  );
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4 Q10 2 20 4 T40 4 T60 4 T80 4 T100 4 V8 H0 Z' fill='white'/%3E%3C/svg%3E");
  mask-size: 50px 8px;
  border-radius: inherit;
  pointer-events: none;
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Lines 2178-2247: Rewrite `.winloss-wins::after`, `.winloss-losses::before`, and `.winloss-losses::after` |

---

## Summary of Visual Effect

After these changes, the blood tube will have:
- Organic mixing where cyan serum meets crimson blood (like fluids actually blending)
- No more visible dark vertical bands
- Subtle bubble/clot shapes floating in the blood
- A more natural, wavy surface appearance
- Overall effect: realistic blood specimen rather than flat UI element

