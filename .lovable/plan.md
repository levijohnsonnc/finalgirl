

# Make Narrative Badge Images Cinematic

## Overview
Replace the tiny 32px circle images in the Nemesis / Usual Suspect / Cursed Site / Home Turf badges with **large, atmospheric background images** that fill the entire badge card. The character or location art becomes the badge itself, with text overlaid on a darkened gradient -- similar to the cinematic treatment already used for locations in the breakdown table.

## What Changes

### 1. Badge layout becomes image-backed
When a badge has data (not locked), the character or location image fills the entire card as an absolute-positioned background. A gradient overlay darkens it enough for the label, name, and subtext to remain legible. The result: each badge feels like a "wanted poster" or "crime scene photo" rather than a card with a small thumbnail.

### 2. Different image treatments for Killers vs Locations
- **Killer badges** (Nemesis, Usual Suspect): Portrait character art fills the card. Uses `object-top` positioning so the face/head is visible. Gradient goes from bottom-to-top (dark at the bottom where the text sits).
- **Location badges** (Cursed Site, Home Turf): Landscape location art fills the card. Uses `object-center` for scenic framing. Gradient goes from bottom-to-top with a slightly stronger opacity since location images tend to be busier.

### 3. Increased card height
The `min-h-[100px]` increases to `min-h-[140px]` (or similar) to give the images room to breathe. Text is anchored to the bottom of the card over the gradient.

### 4. Locked badges stay as-is
Badges that show "Play more to unlock" keep their current minimal dark-card appearance -- no image to show anyway.

## Visual Result
Each unlocked badge becomes a mini movie poster: atmospheric art filling the card, with the label (e.g., "NEMESIS") at the top in small VHS-style text, the name in bold over a gradient, and the stat count below. The colored border glow (red for Nemesis, cyan for Usual Suspect, amber for Cursed Site) remains and now tints the edge of the image card for extra atmosphere.

## Technical Details

### File: `src/components/stats/TrendsSection.tsx`
Restructure the `NarrativeBadge` component:

- When `value` is present and `image` exists:
  - Render the image as `absolute inset-0 w-full h-full object-cover` inside the badge container
  - Add a gradient overlay div: `absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30`
  - Position all text as `relative z-10` so it sits above the image
  - Move label to the top, name + subtext to the bottom using `justify-between`
  - Use `object-top` for killer images, `object-center` for location images (differentiated via a new `type` prop: `'killer' | 'location'`)

- When `value` is present but no `image`:
  - Fall back to the current dark card with just text (no image)

- When locked:
  - No change from current behavior

### New prop on NarrativeBadge
Add `type?: 'killer' | 'location'` to control image positioning. Passed from the four badge instances in `TrendsSection`.

### File: `src/index.css`
- Update `.narrative-badge` min-height from `100px` to `140px`
- Add `overflow: hidden` to `.narrative-badge` so the absolute image doesn't bleed out of the rounded corners
- Adjust `.narrative-value` to remove the `gap-2` and `flex items-center` layout that was designed for the inline circle thumbnail -- now it's just the name text

### No changes to
- `useGameStats.ts` -- data layer stays the same
- `Stats.tsx` -- parent page stays the same
- Any other components

