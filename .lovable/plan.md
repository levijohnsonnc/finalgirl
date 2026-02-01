

# Blood Tube Improvements

## Overview

Three fixes to match the reference image:

1. Remove grey end cap lines at both ends of the tube
2. Add serum texture to the cyan side (bubbles and organic flow)
3. Enhance blood texture to be more visceral and flowing like the reference

---

## Issue 1: Remove Grey End Cap Lines

**Problem:** Lines 2140-2156 create grey "end caps" using `.winloss-bar::before` and `::after`.

**Solution:** Either remove these pseudo-elements entirely, or change them to match the fluid colors (cyan on left, red on right).

**Implementation:**
```css
/* Option A: Remove entirely - delete lines 2140-2156 */

/* Option B: Make them match the fluid colors */
.winloss-bar::before { 
  left: 3px;
  background: linear-gradient(to bottom, 
    hsl(180 80% 45% / 0.4), 
    hsl(180 70% 35% / 0.5)
  ); 
}
.winloss-bar::after { 
  right: 3px;
  background: linear-gradient(to bottom, 
    hsl(0 60% 35% / 0.4), 
    hsl(0 50% 25% / 0.5)
  ); 
}
```

---

## Issue 2: Add Texture to Cyan Serum

**Problem:** The cyan side only has a solid gradient and reflection - no organic texture.

**Solution:** Create a new `serum-texture.svg` with bubbles and subtle flow patterns in cyan tones, then apply it to `.winloss-wins::before`.

**New File:** `src/assets/serum-texture.svg`

Content will include:
- Subtle wavy flow lines in lighter/darker cyan
- Small floating bubbles with highlights
- Organic blob shapes for depth
- Designed to tile horizontally

**CSS Changes:**
```css
/* Add before pseudo-element for serum texture */
.winloss-wins::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/src/assets/serum-texture.svg');
  background-repeat: repeat-x;
  background-size: 150px 100%;
  opacity: 0.6;
  border-radius: inherit;
  pointer-events: none;
}
```

---

## Issue 3: Enhanced Blood Texture

**Problem:** Current blood texture has bubbles and wavy lines, but lacks the visceral, flowing quality of the reference. The reference shows:
- Large, prominent flowing "veins" or thick wave patterns
- Bubbles that feel embedded in thick fluid
- More depth and dimension

**Solution:** Create an enhanced `blood-texture.svg` with:
- Thicker, more prominent flowing wave patterns (like veins)
- Better bubble integration with surrounding liquid
- More visible depth variation
- Higher contrast between light and dark areas

**Updated SVG will include:**
- 2-3 thick, prominent wavy "vein" paths that flow horizontally
- Larger bubbles with stronger gradients (highlight at top, dark shadow at bottom)
- Subtle darker patches suggesting depth/clots
- Better color matching to the crimson base

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/assets/serum-texture.svg` | New texture for the cyan serum side |

## Files to Modify

| File | Changes |
|------|---------|
| `src/assets/blood-texture.svg` | Enhanced with more visceral, flowing patterns |
| `src/index.css` | Remove grey end caps, add serum texture layer |

---

## Technical Details

### Serum Texture SVG (new)
```xml
<svg viewBox="0 0 150 40" preserveAspectRatio="none">
  <!-- Subtle wavy flow lines in cyan tones -->
  <path d="M0 10 Q20 6 40 12 T80 8 T120 14 T150 10" 
        stroke="#0cc" stroke-width="1.5" stroke-opacity="0.25"/>
  <!-- Small bubbles with highlights -->
  <circle cx="25" cy="15" r="4" fill="radial-gradient(...)"/>
  <!-- etc -->
</svg>
```

### Enhanced Blood Texture SVG
- Increase stroke-width on flow lines from 2-2.5 to 4-6
- Add additional flowing "vein" paths
- Increase bubble sizes and opacity
- Add darker shadow patches for depth

---

## Expected Result

A blood tube where:
- No grey lines visible at either end
- Cyan serum has organic bubbles and flow patterns
- Blood side has thick, visceral flowing textures matching the reference
- Both sides feel like physical fluids in a glass tube

