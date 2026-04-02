

# Tilt Projector Slideshow to Match Screen Border

## The Problem

The white screen border in the background image (`marquee-bg.png`) isn't perfectly rectangular — the screen in the photo is slightly tilted/skewed (the upper-right corner clips). Since we can't modify the background image, the projected slideshow overlay doesn't align evenly with the white border on all sides.

## The Fix

Yes, this is absolutely doable. We can apply a small CSS `transform: rotate()` to the `.projector-slideshow` element to tilt the projected image to match the screen's natural angle. The `projectorStyle` already sets `left`, `top`, `width`, and `height` dynamically — adding a rotation won't affect the positioning math.

### Changes

**`src/components/Marquee.tsx`** — Add a slight rotation to the computed `projectorStyle` object:
- Add `transform: 'rotate(-0.5deg)'` (or similar small value, will need fine-tuning) to match the screen's tilt
- Add `transformOrigin: 'center center'` so the rotation pivots from the middle

**Optionally adjust `MARQUEE_SCREEN_RECT`** — If the rotation shifts the image slightly, we may need to nudge `x`/`y` by 1-2px to re-center.

The exact rotation angle will need visual tuning — starting at around **-0.3deg to -0.8deg** based on the screenshot. This is a pure CSS transform, no structural changes needed.

### Files changed
- **`src/components/Marquee.tsx`** — add `transform` and `transformOrigin` to projectorStyle

