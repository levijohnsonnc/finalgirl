

## Plan: Interactive Rulebook section

### Goal
Add a new **RULES** section to the app that presents the Final Girl Core Rules in an interactive, searchable, easy-to-look-up format — designed to scale later to per-module rules (Killers, Locations, Vignettes).

### Where it lives
- New page `Rules` reachable from the VHS footer in `Index.tsx` (alongside COLLECTION / STATS / SCRAPBOOKS), and from the Marquee bottom nav.
- Footer chip uses a `BookMarked` (lucide) icon, themed in the existing VHS palette (e.g. amber/yellow accent so it doesn't clash with the existing colors).
- Added as a `currentPage: 'rules'` in the existing `IndexContent` switch — same pattern as `scrapbooks`/`stats`. Scroll-to-top already handled.

### Layout (desktop)

```text
┌────────────────────────────────────────────────────────┐
│  RULEBOOK              [ Core Rules ▾ ] [🔍 search... ]│
├──────────────┬─────────────────────────────────────────┤
│ TABLE OF     │  ## The Game Turn                        │
│ CONTENTS     │                                          │
│              │  A turn has 5 phases:                    │
│ ▸ Overview   │   1. Action Phase                        │
│ ▾ Game Turn  │   2. Planning Phase                      │
│   • Action   │   3. Killer Phase                        │
│   • Planning │   4. Panic Phase                         │
│   • Killer   │   5. Cleanup Phase                       │
│   • Panic    │                                          │
│   • Cleanup  │  [Quick ref: Turn Summary card ▸]        │
│ ▸ Attacking  │                                          │
│ ▸ Bloodlust  │  See also: Attacking, Horror Roll        │
│ ▸ Tokens     │                                          │
│ ▸ Minions    │                                          │
│ ▸ Weapons    │                                          │
│ ▸ Glossary   │                                          │
└──────────────┴─────────────────────────────────────────┘
```

Sticky left ToC, scroll-spy highlights the active section as you scroll. On mobile the ToC collapses into a top dropdown ("Jump to…") and a floating "↑ Top" button appears.

### Interactive features

1. **Search** — fuzzy search across all rule sections + glossary terms. Live-filters the visible content and dims non-matches; ToC shows match counts per section. (Simple in-memory filter, no library needed; or `fuse.js` if we want fuzziness.)
2. **Scroll-spy ToC** — `IntersectionObserver` highlights the section currently in view; clicking ToC entries smooth-scrolls and updates the URL hash (`/#rules/killer-phase`) so sections are linkable/shareable.
3. **Glossary tooltips** — terms like *Horror Roll*, *Bloodlust*, *Terror card*, *Minion* get a dotted underline; hover/tap shows a short definition popover (reusing existing shadcn `Popover`/`Tooltip`). Powered by a small glossary map.
4. **Cross-references** — each section ends with a "See also:" row of chips that jump to related sections.
5. **Quick-reference cards** — collapsible callouts for things players look up mid-game: Turn Summary, Horror Roll dice table, Attack steps, Panic direction lookup. Default-collapsed on mobile.
6. **"Card examples"** — render the rulebook's example callouts (e.g. Weak Attack, Short Rest, Terror card) as styled "card" components rather than inline images, so they look native to the app's VHS aesthetic.
7. **Bookmarks** — a star icon per section saves to `localStorage` so returning users see their pinned sections at the top of the ToC.
8. **Print-friendly view** — a "Print / Save as PDF" button that switches to a single-page stacked layout.
9. **"Modules" picker (future-proof)** — the top-right dropdown shows `Core Rules` now, but is structured to later list `Hans the Butcher`, `Camp Happy Trails`, etc. Each module is just another rules dataset loaded into the same UI.

### Content model

A single typed dataset, easy to extend per-module later:

```ts
// src/data/rules/coreRules.ts
export interface RuleSection {
  id: string;           // 'killer-phase'
  title: string;        // 'The Killer Phase'
  parentId?: string;    // for nested ToC
  order: number;
  body: RuleBlock[];    // structured blocks (paragraph, list, callout, table, example-card)
  seeAlso?: string[];   // ids of related sections
  tags?: string[];      // for search/filter
}

export interface RuleModule {
  id: 'core' | string;       // future: 's1-hans', 's1-camp-happy-trails'
  title: string;
  sections: RuleSection[];
  glossary: GlossaryTerm[];
}
```

Storing rules as **structured blocks** (not raw markdown) means the same data can power search, glossary linking, ToC, cross-refs, and future per-module rules without re-parsing.

### Source content
- Hand-transcribed from the official Core Rulebook PDF you linked, faithful to the wording, broken into the natural sections already in the book (Overview, Game Boards, Setup, Game Turn → 5 phases, Attacking, Bloodlust, Tokens, Minions, Weapons, Game End, Glossary/Index).
- A small disclaimer footer notes this is an unofficial reference and links to the official rulebook PDF.

### Files to add / change

| File | Change |
|------|--------|
| `src/pages/Rules.tsx` | New page — layout, search, scroll-spy, ToC, module picker |
| `src/components/rules/RulesTOC.tsx` | Sticky/collapsible table of contents with scroll-spy + bookmark stars |
| `src/components/rules/RuleSection.tsx` | Renders a section: heading, blocks, see-also chips |
| `src/components/rules/RuleBlock.tsx` | Renders a single block (paragraph / list / callout / table / example-card) |
| `src/components/rules/GlossaryTerm.tsx` | Inline term with popover definition |
| `src/components/rules/QuickRefCard.tsx` | Collapsible quick-reference callout |
| `src/components/rules/RulesSearch.tsx` | Search input + result count badges |
| `src/data/rules/types.ts` | `RuleModule`, `RuleSection`, `RuleBlock`, `GlossaryTerm` types |
| `src/data/rules/coreRules.ts` | Core Rulebook content as structured data |
| `src/data/rules/glossary.ts` | Shared glossary terms (Horror Roll, Bloodlust, etc.) |
| `src/hooks/useScrollSpy.ts` | IntersectionObserver hook for active-section highlighting |
| `src/hooks/useRulesBookmarks.ts` | localStorage-backed bookmarked sections |
| `src/pages/Index.tsx` | Add `'rules'` to `currentPage` union; add footer button + render switch case |
| `src/components/Marquee.tsx` | Add a "Rules" entry to the bottom nav |
| `src/index.css` | Styling for ToC, search highlight, glossary underline, quick-ref cards (VHS aesthetic) |

### Phasing (ship in two passes)

**Phase 1 — Core experience (this implementation):**
- Page, ToC with scroll-spy, all Core Rulebook sections as structured content, search, glossary tooltips, see-also chips, quick-ref cards, mobile dropdown ToC, footer/Marquee entry points.

**Phase 2 — Future (not built now, but the data model supports it):**
- Per-module rules (each Killer / Location / Vignette as its own `RuleModule`).
- "Rules for my current game" — auto-shows just the relevant Killer + Location rules from the Casting Room.
- Bookmarks, print view, and cross-module links between core rules and module overrides.

### Strict-accuracy guardrails (Final Girl skill)
- All rule text is transcribed from the official Core Rulebook only; no inference, no merging of Feature Film rules into core.
- Each section carries a `source: 'Core Rulebook'` field so future per-module sections can be clearly attributed.
- A visible "Unofficial fan reference — see official rulebook for authoritative text" disclaimer at the top of the page.

