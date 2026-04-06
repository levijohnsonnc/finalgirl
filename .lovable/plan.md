

## Critique of Your Plan

**What's strong:**
- The concept reframe ("IMAGE ENGINE", "Access Code", "Activate Engine") is excellent and matches the VHS horror tone.
- Collapsed/expanded pattern is the right UX — minimal footprint by default.
- Moving it below all collection content is correct hierarchy.
- Removing the dropdown in favor of selectable buttons fits the aesthetic.
- The copy changes are spot-on for immersion.

**What needs adjustment:**
- "Stability AI" is missing from your source buttons — the current implementation supports three providers (Google Gemini, OpenAI, Stability AI). I'll include all three as selectable buttons.
- The active/compact state showing "Provider: Gemini / Auto-generation: ON" with CHANGE and DISABLE buttons adds complexity. Simpler: just show ONLINE status + MANAGE button that re-expands, keeping the same pattern as OFFLINE → ACTIVATE.
- "DISABLE" is ambiguous (disable auto-gen? remove key?). I'll use "REMOVE" for key deletion and keep the auto-generate toggle inside the expanded state only.
- The 60-70% height reduction is achievable in collapsed state but the expanded setup flow needs enough room for the two steps — I'll keep it tight but won't sacrifice usability.

---

## Build Plan

### 1. Move ApiKeyManager below all seasons in Archive.tsx
- Remove the current `<ApiKeyManager />` from its position (between header and seasons).
- Add it after the last season block with a spacer div (`mt-12 sm:mt-16`).

### 2. Rewrite ApiKeyManager.tsx as "IMAGE ENGINE"
Complete rewrite of the component with two visual states:

**Collapsed state (default):**
- Slim horizontal card matching collection card width.
- Left: film-reel icon (use `Film` from lucide).
- Center: "IMAGE ENGINE" title + status badge (OFFLINE in muted / ONLINE in red glow).
- Right: button — "ACTIVATE" if no key, "MANAGE" if key exists.
- Scanline overlay, subtle red border on hover, same dark card bg as collection.
- Click expands inline (no navigation).

**Expanded state — Setup flow (no key):**
- **Step 1: SELECT SOURCE** — Three selectable button cards: `[ GEMINI ]  [ OPENAI ]  [ STABILITY ]`. Selected gets `ring-2 ring-primary/50` + brightness boost (matching collection card style). Hover brightens.
- **Step 2: ENTER ACCESS CODE** — Masked input with eye toggle. "ACTIVATE ENGINE" button (disabled until input present). Small inline text below: "🔒 Stored securely. Never shared." with optional tooltip for details.

**Expanded state — Active/manage (has key):**
- Shows current source with option to change or remove.
- Auto-generate toggle: "RECONSTRUCT SCENES FROM YOUR SESSIONS" with red-styled switch.
- "REMOVE" button to delete the key (with confirmation).
- Collapse back via "DONE" or clicking the header bar.

### 3. Visual/theme details
- Add scanline texture overlay to the card (reuse existing `.scanlines` CSS class).
- Subtle flicker animation on the ONLINE badge (reuse `.crt-flicker` or similar).
- Red glow consistent with selected collection cards (`shadow-[0_0_15px_rgba(var(--blood-red),0.3)]`).
- No flat UI — dark glass-card feel with border effects.

### 4. Copy changes
| Current | New |
|---------|-----|
| Image Generation | IMAGE ENGINE |
| API Key | Access Code |
| Save Key | Activate Engine |
| Auto-generate scene images | Reconstruct scenes from your sessions |
| Provider dropdown | Source selector buttons |

### Files changed
| File | Change |
|------|--------|
| `src/components/ApiKeyManager.tsx` | Full rewrite |
| `src/pages/Archive.tsx` | Move `<ApiKeyManager />` to bottom of page |

No database, hook, or edge function changes needed — only the UI component and its placement.

