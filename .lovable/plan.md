

## Plan: Add Big Bad Wolf (Killer) + new Location rules from screenshots

### Blocker: HEIC files can't be read in plan mode
The 5 uploaded screenshots are `.HEIC`, which neither `code--view` nor `document--parse_document` can open. I need to convert them to PNG before I can transcribe the rules verbatim. That requires shell access (ImageMagick / `heif-convert`), which is only available once you approve this plan and I switch to default mode.

### Steps after approval

1. **Convert HEICs → PNG** in `/tmp/` using `nix run nixpkgs#libheif -- heif-convert` (or ImageMagick fallback), then `code--view` each PNG to read the printed text.

2. **Identify which sheet is which.** Expected: 2–3 sheets for Big Bad Wolf (killer board has multiple ability tracks, often 2-page), and 1–2 sheets for the new Location. I'll confirm the Location's name from the sheet header before adding it (you mentioned "the location I've provided" but Storybook Woods is already in. If the new sheet is also Storybook Woods I'll skip; otherwise I'll add the new one as a fresh module).

3. **Add new entries to `src/data/rules/moduleRules.ts`** following the exact same `EntityRuleModule` shape as Grimlash / Storybook Woods:
   - `bigBadWolf`: `kind: 'killer'`, `filmId: 's2-once-upon-full-moon'`, `entity: 'Big Bad Wolf'`, with `setup` + `rules` blocks transcribed verbatim (special abilities, Huff & Puff / howl / scent mechanics — whatever the sheet actually prints).
   - `<newLocation>`: `kind: 'location'`, `filmId` matched from `FEATURE_FILMS`, transcribed verbatim.
   - Append both to the existing `ENTITY_RULE_MODULES` array — no other code changes needed; `Rules.tsx` already iterates this list and gates by ownership.

4. **Verify in preview**: with Once Upon a Full Moon owned, the LOCATIONS group now shows two location chapters, and KILLERS gains a Big Bad Wolf chapter, each with SETUP / RULES sub-tabs, matching Grimlash's styling exactly.

### One thing I need from you
Either:
- (a) Approve the plan as-is — I'll convert the HEICs after switching to default mode and read the location's name straight off the sheet header, **or**
- (b) Tell me the location name now (and ideally re-upload as JPG/PNG so the conversion step isn't needed), which is faster and avoids any OCR ambiguity.

No other files change. No schema/UI changes. Pure data addition.

