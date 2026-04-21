import { RuleBlock, RuleSection, RuleChapter } from './types';

export interface EntityRuleModule {
  /** Entity name as it appears in FEATURE_FILMS (e.g. 'Grimlash', 'Storybook Woods') */
  entity: string;
  kind: 'killer' | 'location';
  /** Film ID that grants ownership of this module */
  filmId: string;
  /** Human-readable source attribution */
  source: string;
  /** Designer / artist credits printed on the official sheet */
  credits?: { design?: string; art?: string };
  /** Body of the SETUP sub-tab */
  setup: RuleBlock[];
  /** Body of the RULES sub-tab */
  rules: RuleBlock[];
  tags?: string[];
}

// ─── Grimlash (Killer) — A Rotten Harvest ──────────────────────────────────
const grimlash: EntityRuleModule = {
  entity: 'Grimlash',
  kind: 'killer',
  filmId: 's4-rotten-harvest',
  source: 'A Rotten Harvest — Killer Sheet',
  credits: { design: 'Ryan Jorjorian', art: 'Ondine Champetier de Ribes' },
  tags: ['grimlash', 'harvest madness', 'killer'],
  setup: [
    {
      type: 'list',
      items: [
        'Separate the Harvest Madness cards by level and shuffle each to create 3 separate decks.',
        'Place the Harvest Madness marker on the starting space on the Harvest Madness track (outlined in orange), located near the top of the Killer board.',
      ],
    },
  ],
  rules: [
    { type: 'heading', level: 3, text: 'Harvest Madness' },
    {
      type: 'paragraph',
      text: 'Increasing your Harvest Madness will give you additional abilities, but it may come at a price, possibly death!',
    },
    {
      type: 'paragraph',
      text: 'Whenever you see the Harvest Madness icon, move the Harvest Madness marker one space to the right on the track. When your Harvest Madness marker reaches a space corresponding to a new level, draw 2 cards from the Harvest Madness deck for that level and choose 1 to keep, discarding the other. The Harvest Madness card abilities remain in effect as long as your Harvest Madness remains at that level or above.',
    },
    {
      type: 'callout',
      variant: 'critical',
      title: 'Important!',
      text: 'If your Harvest Madness increases beyond Level 3 (indicated by the space with a skull), you immediately lose the game!',
    },
    {
      type: 'paragraph',
      text: 'When resolving a Heart, you may recover health as normal or reduce your Harvest Madness. If you choose to reduce your Harvest Madness, move the Harvest Madness marker 1 space to the left for each Heart. You must choose to either recover health or lower your Harvest Madness — you cannot do both.',
    },
    {
      type: 'paragraph',
      text: 'If your Harvest Madness drops to a lower level, you must discard the corresponding Harvest Madness card for the level you just left. If your Harvest Madness later returns to that level, you once again draw 2 cards from the appropriate Harvest Madness deck, choosing 1 to keep and discarding the other. When drawing Harvest Madness cards, if there are not enough in the deck, reshuffle the discard pile for that level and form a new deck.',
    },
    {
      type: 'paragraph',
      text: 'Some Harvest Madness once-per-turn effects require you to flip the Harvest Madness card facedown. During the Upkeep phase, flip them faceup. Their effects can be used again.',
    },
  ],
};

// ─── Storybook Woods (Location) — Once Upon a Full Moon ───────────────────
const storybookWoods: EntityRuleModule = {
  entity: 'Storybook Woods',
  kind: 'location',
  filmId: 's2-once-upon-full-moon',
  source: 'Once Upon a Full Moon — Location Sheet',
  credits: { design: 'Julie Ahern', art: 'Tyler Johnson' },
  tags: ['storybook woods', 'bridges', 'raft', 'location'],
  setup: [
    {
      type: 'paragraph',
      text: 'Setup the game as normal — there are no special setup rules for this Location.',
    },
  ],
  rules: [
    { type: 'heading', level: 3, text: 'Fewer Spaces' },
    {
      type: 'paragraph',
      text: 'Storybook Woods has fewer spaces than most locations! Be careful, as this can make it seem easy, but the woods can become very dangerous, very quickly.',
    },
    { type: 'heading', level: 3, text: 'Bridges' },
    {
      type: 'paragraph',
      text: 'There are three bridges on the board that cross the River (circled in red on the board). They are built very poorly and could collapse with too much weight! Therefore, only 1 Victim will follow you when crossing a bridge.',
    },
    {
      type: 'paragraph',
      text: 'Additionally, the Toll Bridge Event card may have you placing a Toll Bridge token on the board. Just like the other three bridges, only 1 Victim will follow you across the Toll Bridge.',
    },
    { type: 'heading', level: 3, text: 'The Raft' },
    {
      type: 'paragraph',
      text: 'One of the items you may find is a Raft. When you find the Raft, you will need to choose 4 spaces where the Raft can go ashore (these spaces are clearly marked on the board). You must place the Raft tokens such that they are touching both the river and one non-exit space. With the Raft you will be able to move to and from these spaces along the river as indicated on the Raft Item card.',
    },
  ],
};

export const ENTITY_RULE_MODULES: EntityRuleModule[] = [grimlash, storybookWoods];

/**
 * Build synthetic RuleSections + a RuleChapter from an EntityRuleModule so it
 * can be rendered through the same RuleChapter / RuleSubTabs pipeline as core
 * rules. Returns the chapter plus the two sections it references.
 */
export function buildEntityChapter(
  mod: EntityRuleModule,
  number: string
): { chapter: RuleChapter; sections: RuleSection[] } {
  const baseId = `${mod.kind}-${mod.entity.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const setupId = `${baseId}-setup`;
  const rulesId = `${baseId}-rules`;

  const sections: RuleSection[] = [
    {
      id: setupId,
      title: 'Special Setup',
      order: 10,
      tags: mod.tags,
      source: mod.source,
      body: mod.setup,
    },
    {
      id: rulesId,
      title: 'Special Rules',
      order: 20,
      tags: mod.tags,
      source: mod.source,
      body: mod.rules,
    },
  ];

  const chapter: RuleChapter = {
    id: `ch-${baseId}`,
    number,
    title: mod.entity,
    subtitle: mod.kind === 'killer' ? 'Killer · Special Rules' : 'Location · Special Rules',
    sectionIds: [setupId, rulesId],
    tags: mod.tags,
  };

  return { chapter, sections };
}
