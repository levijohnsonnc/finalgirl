import { GlossaryTerm } from './types';

export const coreGlossary: GlossaryTerm[] = [
  { id: 'horror-roll', term: 'Horror Roll', sectionId: 'horror-rolls', short: 'Roll dice equal to the current Horror Level. 5–6 = success, 3–4 = partial (discard 2 Action cards to convert), 1–2 = nothing.' },
  { id: 'horror-level', term: 'Horror Level', sectionId: 'horror-level', short: 'Tracked on the Player board. Determines how many dice you roll for a Horror Roll.' },
  { id: 'bloodlust', term: 'Bloodlust', sectionId: 'bloodlust', short: 'The Killer\'s strength/speed track. Increases when Victims die or via game effects, making the Killer more powerful.' },
  { id: 'final-girl', term: 'Final Girl', sectionId: 'overview', short: 'The protagonist you control — your goal is to defeat the Killer.' },
  { id: 'killer', term: 'Killer', sectionId: 'overview', short: 'The antagonist you must defeat. Acts during the Killer phase.' },
  { id: 'minion', term: 'Minion', sectionId: 'minions', short: 'A lesser monster. May appear with or without a Killer. Tracked separately from the Killer for rules purposes.' },
  { id: 'enemy', term: 'Enemy', sectionId: 'enemies-killers-minions', short: 'Any rule referring to "Enemies" applies to both the Killer and Minions.' },
  { id: 'terror-card', term: 'Terror card', sectionId: 'killer-phase', short: 'Drawn each Killer phase (until the Finale is revealed). Resolves Killer Actions and other dark effects.' },
  { id: 'finale', term: 'Finale', sectionId: 'revealing-finale', short: 'Revealed when the Terror deck is empty. Replaces the initial Killer Action with a more dangerous one.' },
  { id: 'dark-power', term: 'Dark Power', sectionId: 'bloodlust', short: 'Special Killer ability revealed when Bloodlust reaches a marked space.' },
  { id: 'final-health-token', term: 'Final Health token', sectionId: 'final-health-token', short: 'Revealed when no normal Health markers remain. May bring the Final Girl or Killer back to life.' },
  { id: 'reaction-card', term: 'Reaction card', sectionId: 'defending-reaction', short: 'Blue-bordered Action card playable only in reaction to an attack.' },
  { id: 'action-tableau', term: 'Action Tableau', sectionId: 'planning-phase', short: 'The shared pool of available Action cards you can purchase during the Planning phase.' },
  { id: 'zero-cost', term: 'Zero Cost cards', sectionId: 'zero-cost', short: 'Action cards that cost 0 Time. Always purchasable (subject to hand limit), even when Time is at zero.' },
  { id: 'time', term: 'Time', sectionId: 'gaining-losing-time', short: 'A resource used to perform actions and buy Action cards. Resets to 6 each Planning phase.' },
];
