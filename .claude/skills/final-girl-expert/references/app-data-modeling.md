# App Data Modeling Guidance

This file helps translate Final Girl domain knowledge into app structures.

## Modeling Philosophy

Do not model the game as a flat pile of cards and products.
Use explicit entities with provenance.

### Core Principle

A product is not the same thing as a gameplay entity.

For example:
- a **Feature Film** is a product
- a **Killer** is a gameplay entity
- a **Location** is a gameplay entity
- a **Final Girl** is a gameplay entity
- a **card** is a content object that belongs to one or more game systems and originates from a specific product

## Recommended Entity Types

### Products

Use a first-class `product` model.

Suggested fields:
- `product_id`
- `name`
- `product_type`
  - core_box
  - feature_film
  - vignette
  - bonus_feature
  - promo
  - accessory
  - miniature_set
  - playmat
  - storage_box
  - ultimate_box
  - lore_book
  - mystery_box_item
  - kickstarter_extra
- `series`
- `release_status`
  - released
  - announced
  - unknown
- `official_url`
- `official_summary`
- `requires_core_box`
- `requires_feature_film`
- `contains_spoilers`
- `source_confidence`

### Gameplay Entities

Use separate tables/models for:
- `final_girl`
- `killer`
- `location`
- `scenario_module` if needed
- `special_rule`
- `item`
- `setup_card`
- `event_card`
- `terror_card`
- `dark_power`
- `finale`

Suggested common fields:
- `id`
- `name`
- `entity_type`
- `source_product_id`
- `official_text`
- `summary_text`
- `lore_text`
- `mechanics_tags`
- `difficulty_notes`
- `playstyle_notes`
- `verification_status`

### Card Objects

Cards should carry provenance.

Suggested fields:
- `card_id`
- `name`
- `card_type`
- `belongs_to_entity_type`
- `belongs_to_entity_id`
- `source_product_id`
- `official_text`
- `timing_tags`
- `keyword_tags`
- `rules_summary`
- `flavor_text`
- `verification_status`

## Relationships

Use explicit relationships:
- feature film -> includes -> killer
- feature film -> includes -> location
- feature film -> includes -> final girls
- killer -> has_many -> dark powers
- killer -> has_many -> finales
- location -> has_many -> items
- location -> has_many -> events
- location -> has_many -> setup cards
- product -> contains_many -> cards/components

Do not assume all products have the same internal structure.

## Provenance Matters

Every rules object should track:
- source product
- source document or page if possible
- verification status
- last verified date
- notes on ambiguity

This is essential for:
- rules trust
- debugging
- future catalog refreshes
- clean UI citations

## Rules Engine Guidance

Do not over-normalize exceptions.

Preferred approach:
- encode common systems where truly shared
- support per-entity overrides
- support card-specific exceptions
- support "unknown / not encoded" states rather than inventing behavior

## Search and Filter

Support filters for:
- product type
- series
- killer
- location
- final girl
- release status
- verified/unverified
- beginner-friendly
- challenge level
- theme tags
- mechanics tags

## Ownership Tracking

For an ownership feature, separate:
- `owned_products`
- `wishlist_products`
- `owned_cosmetic_items`
- `owned_gameplay_items`

This helps distinguish:
- gameplay availability
- collector completeness
- accessory ownership

## Spoiler Boundaries

Use optional spoiler flags:
- `spoiler_level`
  - none
  - light
  - rules_only
  - full

Useful for:
- hidden finales
- surprise thematic details
- app browsing without exposing late-game content unintentionally

## UI Guidance

For rules reference UI:
- show direct answer first
- show source/provenance nearby
- make non-rules commentary visually distinct
- make "not verified" impossible to miss

For product browsing:
- separate official facts from impressions
- show dependencies clearly
- show series and product type clearly
- avoid mixing accessories with gameplay products in the same primary grid unless filtered

## Minimum Data Standard

A record should not be treated as authoritative unless it has:
- official name
- product source
- product type
- verification status
- at least one official source reference

## Red Flags

Do not:
- collapse killer and product into one entity
- treat fan summaries as source text
- infer component counts from similar boxes
- assume every feature film has identical component categories
- store lore and rules in a single undifferentiated text field
