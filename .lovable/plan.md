

## Fix Casting Slot Shuffle Animation

### Root Cause

The black flashes come from two issues:

1. **Start flash**: The reel animation begins at `translateY(0)` showing the first item, but there's a multi-frame delay between React setting the shuffle sequence (`setShuffleSequence`) and enabling animation (`setIsAnimating`) via nested `requestAnimationFrame` calls. During these intermediate frames, the container briefly renders with no content or partially laid-out content → black flash.

2. **End flash**: When `handleAnimationEnd` fires, it simultaneously clears the sequence (`setShuffleSequence([])`) and sets `isAnimating = false`. React unmounts the reel div and must mount the static image in the same render — but the image may need a paint cycle to appear, causing a single black frame.

3. **Mid-animation gaps**: Each reel child is `height: 100%` of the parent, but during the CSS animation the flex column can have sub-pixel rounding that briefly shows the dark background between items.

### Fix Plan

**File: `src/components/CastingSlot.tsx`**

1. **Eliminate the double-rAF delay** — Build the sequence and set `isAnimating = true` in a single state update (or use `flushSync`). The nested rAF pattern causes 2-3 blank frames at the start.

2. **Keep the last image visible after animation ends** — Instead of immediately clearing `shuffleSequence` in `handleAnimationEnd`, first set `displayValue` to the final value, then clear animating state in the *next* frame. This ensures the static image is painted before the reel unmounts.

3. **Pre-render the final image underneath the reel** — Always render the static `<img>` for the current `value` behind the reel (using z-index layering). This way, when the reel unmounts, the image is already painted and visible — zero black frames.

**File: `src/index.css`**

4. **Add a tiny overlap between reel items** — Add `margin-bottom: -1px` on `.slot-reel > *` to eliminate sub-pixel gaps between frames during scroll.

5. **Set a background color on the reel container** — Match the first item's average tone (or just use `background: black` which is better than a flash) so any sub-pixel gap shows black intentionally rather than as a jarring flash.

6. **Add `animation-fill-mode: both`** to `.slot-reel` so the first frame is applied immediately before the animation starts (eliminates the "jump to start" flash).

### Summary of Changes

| File | Change |
|------|--------|
| `src/components/CastingSlot.tsx` | Remove double-rAF, pre-render final image underneath reel, defer reel unmount by one frame |
| `src/index.css` | Add `animation-fill-mode: both`, overlap reel items by 1px, background on reel container |

