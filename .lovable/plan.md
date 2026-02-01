
# Blood Tube Enhancement & Text Removal

## Overview

Two changes:
1. Remove "STORY OF YOU" subtitle from the TrendsSection
2. Enhance the blood tube to match the reference image with brighter colors and more organic blood texture

---

## Changes

### 1. Remove "STORY OF YOU" Text

**File:** `src/components/stats/TrendsSection.tsx`

Remove lines 59 and 75 that contain:
```tsx
<p className="section-subtitle">STORY OF YOU</p>
```

---

### 2. Enhanced Blood Tube Styling

**File:** `src/index.css`

#### Serum (Wins) Side - Brighter Cyan
- Increase saturation and brightness to match the reference
- More vivid, glowing cyan color
- Add stronger internal glow

#### Blood (Losses) Side - Richer, Organic
- Brighter, more saturated crimson (less dark/muddy)
- Enhanced organic textures with visible "clots"
- More pronounced internal depth variations
- Stronger noise/grain texture for visceral appearance

#### Glass Tube Container
- Slightly stronger highlights for more glass-like appearance
- Darker inner shadows for depth

---

## Technical Details

### Serum Side Updates
```css
.winloss-wins {
  background: linear-gradient(
    to bottom,
    hsl(180 85% 55% / 0.6) 0%,
    hsl(180 90% 50% / 0.85) 50%,
    hsl(180 85% 45% / 0.7) 100%
  );
  /* Add subtle glow */
  box-shadow:
    inset -2px 0 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.25),
    0 0 8px rgba(0, 200, 200, 0.2);
}
```

### Blood Side Updates
```css
.winloss-losses {
  background: linear-gradient(
    to bottom,
    hsl(0 70% 35%) 0%,
    hsl(0 80% 45%) 30%,
    hsl(0 75% 38%) 60%,
    hsl(0 65% 25%) 100%
  );
}
```

### Enhanced Organic Textures
- Increase noise opacity from 0.1 to 0.15
- Add more pronounced streak patterns for clot-like appearance
- Darker contamination zone at boundary

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/stats/TrendsSection.tsx` | Remove 2 lines with "STORY OF YOU" |
| `src/index.css` | Update winloss-bar styles for brighter colors and enhanced textures |

---

## Expected Result

A blood specimen tube that:
- Has bright, glowing cyan serum on the wins side
- Has rich, vibrant crimson blood on the losses side
- Shows visible organic textures and "clots" in the blood
- Matches the reference image aesthetic
- No longer displays "STORY OF YOU" text
