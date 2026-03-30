

# Project Images onto the Marquee Screen

## Concept

Overlay a slow-crossfading slideshow of the user's game images (scene stills and poster art) onto the blank projector screen in the marquee background. The images cycle with a dreamy, projector-like crossfade — giving the outdoor theater screen life. When no images exist (new user), the screen stays blank as it does now.

## How it works

1. **Fetch images from game history** — Pull `sceneImageUrl` and `posterImageUrl` from all game records. Filter to only entries that have at least one image. Shuffle them for variety.

2. **New component: `ProjectorSlideshow`** — A self-contained component that:
   - Accepts an array of image URLs
   - Cycles through them every ~5 seconds with a slow crossfade (CSS opacity transition, ~1.5s)
   - Uses two stacked `<img>` elements — one fading out, one fading in — to create seamless dissolves
   - Applies a slight projector grain/glow effect (reduced opacity, slight blur, warm color tint) so it looks like light hitting a screen, not a crisp digital overlay
   - Positioned absolutely to align with the screen area in the marquee background image

3. **Integration in `Marquee.tsx`**:
   - Import `useGameHistory` to get images
   - Render `<ProjectorSlideshow>` behind the VHS overlays but above the background image
   - Position it with percentage-based coordinates to sit on the screen area (will need to eyeball the marquee-bg.png screen bounds)
   - On mobile, adjust positioning since the background uses `bg-[center_60%]`

4. **Styling details**:
   - `mix-blend-mode: screen` or `lighten` to make images blend naturally with the background like projected light
   - Slightly reduced opacity (~0.7) so it looks projected, not pasted
   - Subtle warm color overlay to simulate projector warmth
   - `object-fit: cover` to fill the screen area regardless of image aspect ratio

## Files changed

- **New**: `src/components/ProjectorSlideshow.tsx` — slideshow component with crossfade logic
- **Edit**: `src/components/Marquee.tsx` — add game history hook, extract image URLs, render slideshow layer
- **Edit**: `src/index.css` — add projector blend/glow styles if needed

