

## Plan: Restyle Rules as a VHS Binder with Collapsed Sections

### What's wrong today

**Look & feel — off-brand:**
- Plain neutral cards/borders, generic dropdown, generic search input. Nothing reads as "VHS horror" the way Casting Room, Scrapbook, or Stats do (no film grain, no scanlines, no neon glow, no tape labels, no aged paper, no blood-red accents).
- Typography hierarchy is flat — section headings look like a docs site, not a slasher-era rulebook.
- Glossary popovers, callouts, and tables use default shadcn styling instead of the project's `glass-card` / `vhs-label` / `neon-text` vocabulary.

**Usability — wall of text:**
- Every section of the entire rulebook renders fully expanded at once. Scrolling past Overview → Boards → Game Turn → 5 phases → Attacking → Bloodlust → Tokens → Minions → Weapons → End is exhausting on mobile and the ToC's "scroll-spy" can't compensate.
- Sub-sections (e.g. the 5 turn phases under "Game Turn") aren't grouped under their parent — they're siblings in the long scroll, so the structure the ToC implies doesn't exist visually on the page.
- The sticky search/module bar plus the sticky app header eat ~25% of mobile viewport.
- No "back to top" or breadcrumb when deep in a section.

### New design: **The Rulebook Binder**

Treat the rules like a battered VHS-era spiral-bound rulebook / case-file binder. **Only one chapter is open at a time.** Everything else stays as labeled tape spines / index tabs.

#### Information architecture (collapsed by default)

```text
┌─────────────────────────────────────────────────┐
│  📼 RULEBOOK — CORE RULES               [search]│
│  Unofficial fan reference                       │
├─────────────────────────────────────────────────┤
│ [▸ 01  GAME OVERVIEW & OBJECTIVE          ›]   │
│ [▸ 02  THE BOARDS                         ›]   │  ← groups player/killer/location
│ [▾ 03  THE GAME TURN                      ›]   │  ← only this one is open
│      ┌──────────────────────────────────┐       │
│      │ Sub-tabs:                        │       │
│      │ [Action][Planning][Killer][Panic][Cleanup]
│      │ ─────────────────────────────────│       │
│      │  ## Action Phase                 │       │
│      │  body content for the active tab │       │
│      │                                  │       │
│      │  See also: Attacking, Horror Roll│       │
│      └──────────────────────────────────┘       │
│ [▸ 04  ATTACKING THE KILLER               ›]   │
│ [▸ 05  BLOODLUST                          ›]   │
│ [▸ 06  TOKENS                             ›]   │
│ [▸ 07  MINIONS                            ›]   │
│ [▸ 08  WEAPONS                            ›]   │
│ [▸ 09  ENDING THE GAME                    ›]   │
│ [▸ 10  GLOSSARY                           ›]   │
└─────────────────────────────────────────────────┘
```

- **Chapters** are accordion rows styled as VHS tape spines (or rulebook index tabs): numbered, uppercase title font, blood-red number chip, faint scanline texture, neon hover glow.
- **One chapter open at a time** (single-open accordion). Opening another auto-closes the previous — no infinite scroll.
- **Sub-sections become tabs inside the open chapter** (e.g. the 5 turn phases under "Game Turn"; the 3 boards under "The Boards"). This matches how the rulebook actually groups material and keeps page length bounded.
- **Glossary becomes its own chapter** at the end with an A–Z jumpbar instead of being inline-only.

#### Visual restyle (match the app)

- **Page chrome:** wrap the whole page in `static-bg` / `film-grain` / `vignette` overlays already used by Stats. Add the project's CRT scanline overlay.
- **Header:** title in `font-title` with `neon-text text-secondary`, plus a small `vhs-label` chip reading "CORE RULES VHS-001 / FAN REFERENCE". Animated REC dot like the Stats page.
- **Module picker:** restyle as a `vcr-tape-button` instead of a generic dropdown — looks like swapping VHS tapes (future-proof for Killer/Location modules).
- **Search:** restyle the input as a worn label-maker strip with a magnifier icon; on focus, neon cyan glow; show match-count chips inline on chapter headers (`03 · 4 hits`).
- **Chapter rows:** `glass-card` base with a left blood-red ribbon, large numbered chip (`01`–`10`), uppercase title in `font-title`, tag chips on the right, chevron rotates on open. Subtle tape-tracking glitch on hover.
- **Open chapter body:** styled like an aged-paper rulebook page (cream/off-white tinted, dotted-rule top/bottom, slight paper-grain) — borrowing from the Scrapbook page treatment so it feels of-a-piece.
- **Sub-tabs inside a chapter:** styled like binder index tabs (small angled labels) rather than generic shadcn tabs.
- **Callouts:** restyle the four variants in the project's vocabulary — `note` = neon cyan label tape, `critical` = blood-red stamped warning, `designer` = handwritten margin note (italic, slightly rotated), `tip` = highlighter strikethrough green.
- **Tables:** monospaced VHS data-readout look (thin scanlines on rows, secondary-color header row).
- **Examples:** stamped "EXAMPLE" header in `font-vhs`, dashed border becomes torn-paper edge.
- **Glossary terms inline:** keep the dotted underline but tint it blood-red; popover gets the `glass-card` treatment with a small VHS label header.
- **See-also chips:** restyle as VHS tape labels ("→ ATTACKING") instead of generic pill buttons.

#### Behavior changes

1. **Single-open accordion** for chapters. Default state: all closed, hero chapter list visible. Persist last-opened chapter in `localStorage` so returning users land where they left off.
2. **Sub-section tabs** replace today's flat sub-section scroll. Active tab persists in URL hash (`#rules/game-turn/killer`).
3. **Search behavior changes:** when the user types, auto-expand chapters that have matches (and auto-switch the sub-tab to the first matching one). Non-matching chapters dim and show "no hits". Match counts on each chapter row.
4. **Mobile:** chapter rows become full-width cards with bigger tap targets; sub-tabs become a horizontal swipeable scroller; remove the desktop sticky ToC entirely (it's redundant with the accordion). Floating "↑ Top" button stays.
5. **Drop the desktop left ToC.** The accordion list IS the ToC — much cleaner, no duplication, no scroll-spy needed.
6. **"Back to chapter list"** link at the bottom of every open chapter (smooth-scrolls and closes the chapter).
7. **Deep links still work:** `/#rules/killer-phase` opens the right chapter and selects the right sub-tab.

#### Files changed

| File | Change |
|------|--------|
| `src/pages/Rules.tsx` | Rebuild as accordion-of-chapters with VHS chrome (grain/vignette/scanlines, neon header, restyled search + module picker). Drop the desktop ToC sidebar. Single-open behavior, search-auto-expand, deep-link routing to chapter+subtab. |
| `src/components/rules/RuleChapter.tsx` (new) | Collapsible chapter row: numbered tape-spine header, sub-section tabs inside, see-also footer, "back to chapters" link. |
| `src/components/rules/RuleSubTabs.tsx` (new) | Binder-tab styled tab strip for sub-sections within a chapter. |
| `src/components/rules/RuleSection.tsx` | Simplified — no longer renders its own H2 framing (the chapter does that). Just renders blocks + see-also for one sub-section. |
| `src/components/rules/RuleBlock.tsx` | Restyle callouts (4 variants), examples, tables in the VHS vocabulary. |
| `src/components/rules/GlossaryTerm.tsx` | Blood-red dotted underline + `glass-card` popover with VHS label header. |
| `src/components/rules/RulesTOC.tsx` | **Deleted** (accordion replaces it). |
| `src/hooks/useScrollSpy.ts` | **Deleted** (no longer needed). |
| `src/data/rules/coreRules.ts` | Add a top-level `chapters` grouping (chapter id → child section ids) so 5 turn phases nest under "Game Turn" and 3 boards nest under "The Boards". No rule-text changes. |
| `src/data/rules/types.ts` | Add `RuleChapter { id, number, title, sectionIds[] }`; module gets `chapters: RuleChapter[]`. |
| `src/index.css` | New styles: `.rules-page`, `.chapter-row`, `.chapter-number-chip`, `.binder-tab`, `.rule-paper`, restyled callout variants, `.glossary-popover`. Reuses existing `glass-card`, `neon-text`, `film-grain`, `vignette`, `scanlines`, `vcr-tape-button`. |

#### Out of scope (keep for later)
- Bookmarks (stars), print view, per-Killer/Location modules — the new structure makes all of these easier to add next.

