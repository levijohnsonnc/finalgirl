

# Fix Blend Zone Positioning Issue

## Problem Identified

The lighter blue section in the middle of the cyan is caused by how `.winloss-wins::after` is currently implemented:

1. The blend SVG (`blood-blend.svg`) is applied to the wins side with `scaleX(-1)` to flip it
2. However, the `transform: scaleX(-1)` flips the ENTIRE pseudo-element, including the top highlight gradient
3. The `background-position: right center` gets flipped too, causing the blend to appear in the wrong location
4. The blend SVG has cyan colors that end up appearing in the middle of the serum instead of only at the edge

## Solution

Separate the concerns:
1. Keep the top highlight reflection on `.winloss-wins::after` WITHOUT the blend overlay
2. Move the blood-to-serum blend effect to the LEFT edge of `.winloss-losses::after` instead (where it already exists but may need adjustment)
3. Remove the duplicate/conflicting blend from the wins side entirely

## Changes to Make

### Update `.winloss-wins::after` (lines 2171-2192)

Remove the blend SVG and the scaleX transform. Keep only the top highlight:

```css
.winloss-wins::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 35%
  );
  border-radius: inherit;
  pointer-events: none;
  /* Remove the transform and blood-blend.svg */
}
```

### Verify `.winloss-losses::after` already handles the blend

Check if the blood side's left edge already has the blend zone applied correctly. If not, ensure it's applied there instead.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Simplify `.winloss-wins::after` to only have top highlight, remove blend SVG and transform |

---

## Expected Result

- No strange lighter blue section in the middle of the cyan
- The blend zone only appears at the boundary between cyan and red
- Both fluids look consistent within their respective areas

