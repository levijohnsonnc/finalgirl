

# Add Setup Cards & Events for Storybook Woods and Wingard Cottage

## Summary
Populate the empty `setupCards` and `events` arrays for two films in `src/types/featureFilmDetails.ts`. This data is already wired into the ScenarioDropdowns component and the story generation edge function — no other files need changes.

## Change: `src/types/featureFilmDetails.ts`

**Storybook Woods** (`s2-once-upon-full-moon`, line 627-628) — replace empty arrays with:

- **setupCards** (5): Picnic, Forest Dwellers, Scatter!, Breadcrumb Trail, Family Visit
- **events** (10): Primrose Flowers, Harmless Old Woman, Hansel, Breadcrumb Path, Toll Bridge, Furry Friends, Fairy Ring, Travelers, The Woodsman, Pied Piper

**Wingard Cottage** (`s2-knock-at-door`, line 662-663) — replace empty arrays with:

- **setupCards** (5): Special Occasion, Couples Weekend, Grad Party, Fishing Trip, Dysfunctional Family
- **events** (8): Booby Traps, Battle Ready, Home Security, Marked for Death, Escape Attempt, Getting Resourceful, Another Way Out, Loser Boyfriend

Each entry includes the `name` and `description` text you provided. The descriptions are already passed to the `generate-story` edge function via `startingSetup` and `startingEvent` fields, so the LLM will automatically incorporate them into generated stories.

No other files require changes — the ScenarioDropdowns, CastingRoom, and NowPlaying components already read from `getSetupCardsForLocation()` and `getEventsForLocation()` which pull from this data.

