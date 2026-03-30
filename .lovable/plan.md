

# Softer Projector Edge Blending

## What's happening now
The `mask-image` radial gradient goes from solid black at 60% to transparent at 100%. This creates a noticeable hard-ish edge. The `mix-blend-mode: normal` also makes it look overlaid rather than projected.

## Changes (CSS only — no size/position changes)

**`src/index.css` — `.projector-slideshow`:**
1. **Softer mask gradient** — expand the fade zone so it starts earlier and is more gradual: `radial-gradient(ellipse 96% 94% at center, black 40%, transparent 95%)`. This makes the edges dissolve much more gently into the white screen.
2. **Switch to `mix-blend-mode: multiply`** — on a white/light screen surface, `multiply` darkens the image naturally onto the background, making it look like light is being absorbed by the screen rather than floating on top. (`lighten` was tried before but `normal` ended up in the final code.)
3. **Slightly reduce opacity** on `.projector-slide` to ~90% so the screen texture bleeds through faintly, reinforcing the "projected onto" look.
4. **Add a subtle box-shadow inset** on `.projector-slideshow`: `box-shadow: inset 0 0 30px 15px rgba(0,0,0,0.15)` to simulate natural light falloff at the edges of a real projection.

These are purely visual tweaks — no changes to positioning, sizing, or the Marquee component.

