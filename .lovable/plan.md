

# Mobile Experience Overhaul

This plan addresses the four issues you reported, plus general mobile polish discovered during the audit.

---

## Issue 1: Scrapbook Entry Click Bug

**Problem:** On mobile, the scrapbook opens as a two-page side-by-side book (left page = poster, right page = grid/story). At 390px wide, each "page" is only ~185px wide -- too small to read or interact with. The 3D perspective transforms (`rotateY`) also cause touch target misalignment on mobile browsers, making taps register in the wrong place or cause visual glitches.

**Fix:** Switch to a single-page, vertically-scrollable layout on mobile (below 640px):
- Remove the side-by-side two-page split; show content in one full-width column
- Remove the 3D perspective transforms on mobile (they cause touch issues)
- Show the grid first; when a game is tapped, slide to the story view with a back button
- The poster display moves above the story text instead of on a separate "page"
- Make the scrapbook container `overflow-y: auto` on mobile so content scrolls naturally

---

## Issue 2: Screen Moving Around / Hard to Scroll

**Problem:** Several layout elements use `fixed` positioning and `100vh` heights which fight with mobile browser chrome (address bar appearing/disappearing causes the viewport to resize, making everything jump). The `overflow: hidden` on the scrapbook also traps scroll gestures.

**Fix:**
- Replace `height: 80vh` on `.scrapbook-container` mobile with `min-height: 80dvh` (using `dvh` dynamic viewport units where supported, with `vh` fallback)
- On the scrapbook mobile layout, switch from `fixed inset-0` to a scrollable full-screen overlay using `position: fixed; overflow-y: auto`
- Add `overscroll-behavior: contain` to modal overlays to prevent background scroll bleed
- Add `-webkit-overflow-scrolling: touch` for smooth momentum scrolling on iOS

---

## Issue 3: Dismiss Buttons Too Easy to Accidentally Press

**Problem:** On the "Now Playing" and "The End" screens, the DISCARD button sits right next to the SAVE/WON/LOST buttons in a vertical stack on mobile, with only 12px gap. It's too easy to accidentally hit DISCARD when reaching for the primary action.

**Fix:**
- Reverse the button order on mobile: put the primary action (WON/LOST or SAVE) at the top, DISCARD at the bottom
- Add more vertical spacing between them (gap from `gap-3` to `gap-5` on mobile)
- Make the DISCARD button visually smaller and less prominent on mobile (smaller height, more muted styling)
- Add a brief confirmation toast or 1-second undo window when DISCARD is tapped (lightweight safety net)

Applies to:
- `NowPlaying.tsx` -- WON/LOST buttons (lines 355-374)
- `TheEnd.tsx` -- SAVE/DISCARD buttons (lines 359-377)
- `GameOutcomeForm.tsx` -- Continue/Discard buttons (lines 175-195)

---

## Issue 4: Main Screen Image Not Scaled/Centered Well

**Problem:** The marquee background image (`marquee-bg.png`) uses `bg-[center_bottom]` on mobile, which pushes the projector screen area too high. The "START THE TAPE" button is at `top-[68%]` which doesn't align well with the projector screen in the image.

**Fix:**
- Change mobile background positioning to `bg-[center_60%]` to better center the projector screen in the visible area
- Adjust the "START THE TAPE" button position to align with the projector screen (`top-[62%]` instead of `top-[68%]`)
- Add `bg-contain` as a fallback for very small screens to prevent the image from being cropped too aggressively, with a dark background color behind it

---

## Technical Details

### Files to modify:

1. **`src/index.css`** (lines ~978-1100, scrapbook mobile styles)
   - Add `@media (max-width: 640px)` override for `.scrapbook-container` to use full-width single-column layout
   - Remove 3D transforms on `.scrapbook-page`, `.scrapbook-page-left`, `.scrapbook-page-right` on mobile
   - Make `.scrapbook-pages` a vertical flex column on mobile
   - Each `.scrapbook-page` becomes `width: 100%` on mobile
   - Hide the spine (`scrapbook-book::before`) on mobile
   - Add `overscroll-behavior: contain` to `.scrapbook-container` mobile

2. **`src/components/ScrapbookBook.tsx`**
   - Add mobile-aware layout: detect mobile via `useIsMobile()` hook
   - On mobile, render a single scrollable view instead of two-page spread
   - Show grid OR story (not side-by-side), with a clear back navigation

3. **`src/components/Marquee.tsx`**
   - Change `bg-[center_bottom]` to `bg-[center_60%]` for mobile
   - Adjust button position from `top-[68%]` to `top-[62%]`

4. **`src/pages/NowPlaying.tsx`** (lines 354-374)
   - Reverse button order on mobile: primary actions first, DISCARD last
   - Increase mobile gap to `gap-5`
   - Make DISCARD button smaller on mobile (`h-11` instead of `h-14`)

5. **`src/pages/TheEnd.tsx`** (lines 359-377)
   - Same button reordering and spacing as NowPlaying

6. **`src/components/GameOutcomeForm.tsx`** (lines 175-195)
   - Same pattern: Continue button first, Discard below with extra spacing

