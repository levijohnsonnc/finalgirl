

## Why the Current Approach Doesn't Work

The animation uses a single CSS `translateY` scroll over 13 stacked full-height items with `cubic-bezier(0.12, 0.8, 0.3, 1)`. This is a heavy ease-out — it covers ~80% of the scroll distance in the first ~25% of the time. Result: items 1–10 fly by in ~400ms (invisible blur), then it slowly decelerates into the final pick. You never actually *see* the options. The pre-rendered final image at z-0 also means the first frame shows the target before the reel even paints.

CSS `translateY` over stacked items is fundamentally the wrong tool here — you can't control per-frame dwell time with a single scroll animation.

## New Approach: JavaScript-Driven Frame Stepper

Replace the CSS scroll reel with a **timed frame swap** — show one image at a time, swapping it on a schedule that follows a custom timing curve (slow → fast → slow).

### How it works

1. **Build a longer sequence** (~18–22 items) of random options, ending with the selected value.
2. **Compute per-frame delays** using an ease-in-out curve: first few frames ~250ms each (slow start, you see them), middle frames ~60ms (fast blur), last few frames ramp back up to ~300ms (dramatic slowdown before landing).
3. **Use `setTimeout` chain** (or `requestAnimationFrame` with accumulated time) to step through frames, updating a single `currentFrameIndex` state.
4. **Render only one image at a time** — no stacking, no translateY. Just swap `src` on a single `<img>` element (or crossfade between two layered images).
5. On the final frame, transition to the static display with no flash (image is already showing).

### Timing curve detail

```text
Frame:  1    2    3    4    5   ...  10   11  ...  18   19   20   21   22
Delay: 220  180  140  100   80  ...  60   60  ...  80  120  180  250  300  (ms)
       ─── slow start ───  ──── fast middle ────  ──── slow finish ────
```

Total duration: ~2.2s (tunable). Each frame is clearly visible at the start and end.

### Component changes (`CastingSlot.tsx`)

- Remove `shuffleSequence` array rendering (no more stacked children).
- Add `currentFrameIndex` ref and a `setTimeout` chain that increments it.
- Render a single image element that updates its `src` based on `sequence[currentFrameIndex]`.
- Add a brief CSS crossfade transition (`opacity` swap between two layered `<img>` tags, ~50ms) so frame swaps aren't hard cuts.
- Keep the pre-rendered final image at z-0 as a safety net, but hide it with `opacity-0` during animation so the old image doesn't linger.

### CSS changes (`index.css`)

- Remove the `slot-scroll` keyframe and `.slot-reel` styles entirely (no longer used).
- Add a simple `.slot-frame-enter` transition class: `transition: opacity 50ms ease`.
- Keep `.poster-card-shuffling` glow effect as-is.

### Files changed

| File | Change |
|------|--------|
| `src/components/CastingSlot.tsx` | Replace CSS reel with JS frame stepper |
| `src/index.css` | Remove slot-reel/slot-scroll, add slot-frame transition |

