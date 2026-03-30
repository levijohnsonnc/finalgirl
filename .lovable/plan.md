

# Fix: Precise Projector Screen Alignment

## Root Cause

The math for mapping coordinates is correct — it properly replicates `background-size: cover` scaling. The problem is the **input constants are wrong**. The `MARQUEE_SCREEN_RECT` values `(324, 231, 804, 400)` don't match the actual screen boundaries in `marquee-bg.png`. They're too wide and too tall, which is why the image bleeds past the screen frame.

Additionally, `mix-blend-mode: normal` with `z-index: 2` makes the image look *pasted on top* rather than *projected onto* the screen.

## Fix

### 1. Measure exact screen pixel coordinates from `marquee-bg.png`

I'll open the 1536×1024 source image and measure the precise pixel bounds of the white/gray screen area (inside the frame, not including the frame border). Based on the screenshot showing the image extending ~20-30px beyond the screen on all sides, the rect needs to be inset. Estimated corrected values:

```
x: 350, y: 248, width: 752, height: 365
```

These will be validated by inspecting the actual asset.

### 2. Change blend mode to look projected

- Switch from `mix-blend-mode: normal` to `mix-blend-mode: lighten` — this makes the image only brighten pixels lighter than it, so the dark screen frame naturally masks the edges
- Lower z-index back to `1` so it sits between the background and the VHS overlays
- Reduce opacity slightly (~85%) so it blends with the screen surface

### 3. Add subtle inner shadow/mask

Apply a CSS `mask-image` with a radial or linear gradient that feathers the edges slightly, simulating light falloff at the screen borders — this sells the "projected" look even if coordinates are off by a pixel.

## Files changed

- **`src/components/Marquee.tsx`** — update `MARQUEE_SCREEN_RECT` constants to corrected pixel values
- **`src/index.css`** — change blend mode to `lighten`, add edge-feather mask, adjust opacity

