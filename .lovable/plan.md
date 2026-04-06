

## Plan: Fix button layout & rename toggle

### Changes

**1. Remove AUTO toggle from SceneImageControls (`src/components/SceneImageControls.tsx`)**
- Remove the `Switch` import, `autoGenerate`, and `setAutoGenerate` from the hook destructure
- Remove the `<label>` block with the AUTO toggle (lines 68-78)
- The component now only renders the Generate Scene button
- Since it's just one element, return the button directly instead of a fragment

**2. Fix Generate Scene button height (`src/components/SceneImageControls.tsx`)**
- The other buttons use `py-3` and `min-h-[44px]` — the Generate Scene button already has these, but verify the classes match exactly. Ensure consistent `px-4 sm:px-6 py-3 font-display text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] min-h-[44px]` across all buttons.

**3. Fix mobile layout in NowPlaying.tsx and TheEnd.tsx**
- Replace the current `flex-wrap` approach with explicit rows on mobile:
  - **Row 1**: Narrate — full width (`w-full sm:w-auto`)
  - **Row 2**: Image Prompt + Upload Movie Still — each `flex-1` within a `flex` wrapper that's `w-full sm:w-auto sm:contents`
  - **Row 3**: Generate Scene — full width (`w-full sm:w-auto`)
  - On desktop (`sm:`), all four flow on one line via `sm:contents` or `sm:flex-row`
- Remove `truncate` from button text spans so text doesn't get cut off
- Remove `min-w-0` that enables truncation

**4. Rename "Reconstruct Scenes" → "Auto Generate Scenes" (`src/components/ApiKeyManager.tsx`)**
- Line 264: change text from "Reconstruct Scenes" to "Auto Generate Scenes"

### Files changed
| File | Change |
|------|--------|
| `src/components/SceneImageControls.tsx` | Remove AUTO toggle, keep only button |
| `src/pages/NowPlaying.tsx` | Fix mobile layout to 3 explicit rows |
| `src/pages/TheEnd.tsx` | Same mobile layout fix |
| `src/components/ApiKeyManager.tsx` | Rename toggle label |

