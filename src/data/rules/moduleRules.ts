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

// ─── Big Bad Wolf (Killer) — Once Upon a Full Moon ────────────────────────
const bigBadWolf: EntityRuleModule = {
  entity: 'Big Bad Wolf',
  kind: 'killer',
  filmId: 's2-once-upon-full-moon',
  source: 'Once Upon a Full Moon — Killer Sheet',
  credits: { design: 'Julie Ahern', art: 'Tyler Johnson' },
  tags: ['big bad wolf', 'wolf', 'track', 'slay', 'killer'],
  setup: [
    {
      type: 'paragraph',
      text: 'Setup the game as normal — there are no special setup rules for this Killer.',
    },
  ],
  rules: [
    { type: 'heading', level: 3, text: 'Hunt & Slay Modes' },
    {
      type: 'paragraph',
      text: 'Most of the Terror cards for the Big Bad Wolf have different effects based on what MODE the killer is in. There are two modes, TRACK and SLAY, each denoted by a different icon.',
    },
    {
      type: 'list',
      items: [
        'The Wolf begins the game in TRACK mode. If the Wolf is in this mode at the beginning of the Killer phase, you will apply these effects (and NOT the effects for SLAY mode).',
        'When the Dark Power is revealed, the Wolf goes into SLAY mode. If the Wolf is in this mode at the beginning of the Killer phase, you will apply these effects (and NOT the effects for TRACK mode).',
      ],
    },
    {
      type: 'paragraph',
      text: 'If the Wolf goes into SLAY mode during the Killer phase but started out in TRACK mode, you will not start applying the SLAY effects until the next Killer phase.',
    },
    {
      type: 'paragraph',
      text: 'The Wolf will always be in one mode or the other. The only exception is the Killing Machine Epic Dark Power card which has you apply both the TRACK and SLAY effects.',
    },
    {
      type: 'paragraph',
      text: "Many Terror card effects are not subject to the Wolf's mode and should be applied regardless of which mode the Wolf is in.",
    },
    {
      type: 'example',
      title: 'Example — The Claws That Scratch',
      text: "The Big Bad Wolf is in TRACK mode. When resolving the Terror card to the left, the Wolf will first target the closest Victim (or you, if closer) and move toward it. Then, resolve the TRACK effect which is to increase Bloodlust for you and every Victim in its space. Because the Wolf is not in SLAY mode, those effects are ignored.\n\nNote, if the Wolf was in SLAY mode, it would still go after the closest Target, but then it would attack, dealing its damage one at a time to as many Victims as it can. If you were in the space you'd take any leftover damage.",
    },
  ],
};

// ─── Shady Acres (Location) — A Rotten Harvest ────────────────────────────
const shadyAcres: EntityRuleModule = {
  entity: 'Shady Acres',
  kind: 'location',
  filmId: 's4-rotten-harvest',
  source: 'A Rotten Harvest — Location Sheet',
  credits: { design: 'Ryan Jorjorian', art: 'Ondine Champetier de Ribes' },
  tags: ['shady acres', 'children', 'ancient curse', 'field', 'location'],
  setup: [
    {
      type: 'list',
      items: [
        'Shuffle the Ancient Curse cards and make a facedown Ancient Curse deck.',
        'Place the Children card near the play area and place a Child meeple on the Altar of the Old Gods space. Place the other Children on the Children card.',
        'Place the Children Action token above any Minion or Killer Actions on the Finale card, indicating that the Children will act before any other Enemies.',
      ],
    },
  ],
  rules: [
    { type: 'heading', level: 3, text: 'Children' },
    {
      type: 'paragraph',
      text: "Children at Shady Acres have gone missing… it has been rumored that they've been doing some despicable things. The Children card has the Children's health, Attack Value, and Movement Value.",
    },
    {
      type: 'list',
      items: [
        'The Children are not Minions but are considered Enemies.',
        'Children have their own Action line on the Children Action token. The Children Action is performed at the beginning of the Killer phase, before the Minion Action (if applicable) and the Killer Action.',
        'Children DO NOT resolve Killer or Minion actions on Terror cards or anywhere else unless the card specifically states that the action is to be performed by the Children.',
        'Children are activated one at a time starting with the Child closest to the Altar of the Old Gods space and ending with the Child farthest from that space.',
        'During the Upkeep phase, spawn a Child by placing its meeple on the Altar of the Old Gods space. If all Children are already on the board OR if there are no Victims on the board, the spawn is ignored.',
        'Children may be attacked and killed. If a Child is killed, their meeple goes back onto the Children card, available to be spawned in the future.',
        'If you choose to attack the Children and there are more than one of them in the same space, you are attacking ALL of them and you may divide damage among the Children in the target space as you wish. Any leftover damage is lost.',
        'Victims will follow you into a space that contains Children unless that space also contains the Killer.',
        'During the Panic phase, Victims on a space with a Child will panic if at least one Victim was killed that turn.',
      ],
    },
    { type: 'heading', level: 3, text: 'Abducted Victims' },
    {
      type: 'paragraph',
      text: 'The Children appear to be under the control of ancient gods and abduct people to offer them as sacrifices. When the Children resolve the Abduction icon while on a space with a Victim, roll a die:',
    },
    {
      type: 'list',
      items: [
        'On a 1-2 the Victim has been abducted to the altar of the Old Gods and sacrificed (killed). Return the Child to the Altar of the Old Gods space. Then, increase Terror as normal and place the Victim on the back of the top card of the Ancient Curse deck.',
        'On a 3-6 the Child failed to abduct the Victim and nothing happens.',
      ],
    },
    {
      type: 'paragraph',
      text: "If there are no Victims in a Child's space when trying to resolve the Abduction icon, treat Abduction as an Attack instead.",
    },
    { type: 'heading', level: 3, text: 'Ancient Curses' },
    {
      type: 'paragraph',
      text: "As soon as there are 3 sacrificed Victims on the back of the top card of the Ancient Curse deck, the Old Gods have been fed and they unleash a curse upon the children's enemies. Remove the Victims from the card and reveal the Ancient Curse card, putting it into play. There may be multiple Ancient Curse cards in play at the same time.",
    },
    { type: 'heading', level: 3, text: 'Field Spaces' },
    {
      type: 'paragraph',
      text: 'Bad things always seem to happen in the fields. Spaces with the Field icon are considered Field spaces. Several cards have effects that involve Field spaces.',
    },
  ],
};

export const ENTITY_RULE_MODULES: EntityRuleModule[] = [grimlash, storybookWoods, bigBadWolf, shadyAcres];

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
