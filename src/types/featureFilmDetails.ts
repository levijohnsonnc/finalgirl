// Detailed feature film data for story generation

export interface FinalGirlDetail {
  name: string;
  backstory: string;
}

export interface LocationDetail {
  name: string;
  description: string;
  setupCards: { name: string; description: string }[];
  events: { name: string; description: string }[];
}

export interface KillerDetail {
  name: string;
  description: string;
}

export interface FeatureFilmDetail {
  filmId: string;
  finalGirls: FinalGirlDetail[];
  location: LocationDetail;
  killer: KillerDetail;
}

export const FEATURE_FILM_DETAILS: Record<string, FeatureFilmDetail> = {
  's1-camp-happy-trails': {
    filmId: 's1-camp-happy-trails',
    finalGirls: [
      {
        name: 'Laurie',
        backstory: `Laurie Carpenter was born with a chip on her shoulder. Even from a young age, the fastest way to get her to do something was to tell her that she couldn't do it.

"No, you can't try out for football." "No, you can't learn how to play guitar." "No, you can't take martial arts." Whenever she heard the word 'no,' a switch flipped somewhere deep inside her and she would do everything within her power to accomplish the very thing she'd been told she couldn't do.

While this quality turned Laurie into an ambitious, focused, and tough-as-nails woman, it didn't exactly win her many friends. Most people were turned off by her intensity, and a lot of people who came into her orbit were a bit scared of her. Even at 5 foot 10, Laurie gave off the vibe that she could break you in two if she felt like it, no matter how much bigger or stronger you might be.

But those who stuck around discovered a fiercely loyal friend who would go to hell and back for them. One thing was for certain: you definitely wanted Laurie on your side, and you'd better run for your life if you were her enemy.`
      },
      {
        name: 'Reiko',
        backstory: `Reiko Rivers was quiet and shy. She was the kid who hated being called on in class, who sat alone at lunch, and who was always the last one picked for kickball. Her goal in life was to attract as little attention as possible to herself. At least, that was her goal until she discovered track.

Reiko didn't want to try out for track, but her parents, in a fit of frustration over her unwillingness to do anything outside of her comfort zone, forced her to. And she discovered she was not only fast, she was really damn fast. She handily left every other girl on the team in a cloud of dust, and went on to break every school record as well as win State.

Reiko was still quiet, but she was no longer as timid as she'd once been. Why would she need to be, when she was the fastest thing on two legs?`
      }
    ],
    location: {
      name: 'Camp Happy Trails',
      description: `Welcome to Camp Happy Trails, home to teenage love, unforgettable friendships and idyllic summer memories! Go fishing on the lake, get in some archery practice at the range, listen to ghost stories around firepit, or sneak off to makeout point! Life is always an adventure at Camp Happy Trails! Wait a second, is that screaming I hear in the distance? Oh fiddlesticks, those spooky stories must be getting to me, I'm sure it's just screams of joy from the other campers. Hot dawg, summers at Camp Happy Trails really are to die for!`,
      setupCards: [
        {
          name: 'Capture the Flag',
          description: 'This is a symmetrical setup that puts Hans and the Final Girl on opposite sides of the lake, with victims grouped at the "North" and "South" poles of the map.'
        },
        {
          name: 'Meditation Hour',
          description: 'This setup spreads victims thin across the perimeter, placing the Final Girl and Hans in a tense, close-proximity start at the bottom of the map.'
        },
        {
          name: 'Skinny Dipping',
          description: 'This setup places most victims near the water or the lower half of the map, with Hans starting right at the Campfire.'
        },
        {
          name: 'The Bonfire',
          description: 'As the name suggests, the majority of the victims are grouped together at the campfire, making them easy targets if Hans moves quickly toward the center.'
        },
        {
          name: 'Treasure Hunt!',
          description: 'Victims are scattered mostly in pairs, requiring the Final Girl to move around the map extensively to clear out the spaces.'
        }
      ],
      events: [
        { name: 'Boyfriend', description: 'The Victim closest to you is now your Boyfriend.' },
        { name: 'Clingy Campers', description: 'There is no penalty for the first Victim you save during the Action phase. For each additional Victim saved, lose 1 Health.' },
        { name: 'Dark Waters', description: 'All Victims at the Lake are killed. Whenever a Victim enters the Lake, they are killed immediately.' },
        { name: 'Deathwish', description: 'During the Upkeep phase, move the Victim closest to the Killer 1 Space towards it.' },
        { name: 'Fresh Meat', description: 'Place 2 new Victims at the Cabins, 2 new Victims at the Dock, and 2 new Victims at the Firepit.' },
        { name: 'Girlfriend', description: 'The Victim closest to you is now your Girlfriend. She will follow you into the Killer\'s space. While she is in your space, roll 1 extra die for each Horror roll. If the Girlfriend dies while in your space, increase Horror by 5.' },
        { name: 'Secret Tunnel', description: 'Choose two of the following spaces (Utility Shed, Cabins, or Docks) and place a Secret Tunnel token at each. You may move between these spaces as if they were adjacent.' },
        { name: 'Star Crossed Lovers', description: 'When exactly 2 Victims are in a space and one of them is killed, the other immediately dies as well.' },
        { name: 'Stubborn Kids', description: '1 less Victim will follow you.' },
        { name: 'Vengeance', description: 'The Victim farthest from the Killer is now The Damned. Whenever the Killer must choose a Target, The Damned is chosen instead. The Damned can only be saved if it is the last Victim alive. If The Damned dies, increase Bloodlust by 2.' }
      ]
    },
    killer: {
      name: 'Hans',
      description: `They say he wears a worn butcher's smock, stained dark with blood. His sledgehammer, which he drags behind him, supposedly weighs over 50 pounds and could crush an elephant's skull. He's over 7 feet tall and his eyes glow a bright scarlet. But the worst part is the iron mask he wears, fashioned to look like a pig, and the wet crunching sounds that can be heard from beneath it.

Hans is a very tall, muscular Caucasian man. He wears a red apron over a white shirt and brown pants. On his head is a metal pig mask, with glowing eyes and uneven 'tusks'. He is regularly shown wielding a sledgehammer.`
    }
  },
  's1-carnival-of-blood': {
    filmId: 's1-carnival-of-blood',
    finalGirls: [
      {
        name: 'Asami',
        backstory: `Asami is an Asian woman with long, tied-up, dark brown hair. She is wearing a red sweater, black skirt, and black boots. Asami has always been an artist through and through. She lives for her art. Eats, sleeps, and breathes creation.

Her all time favorite is junk art. She's always been one to find treasure in trash. People are all too quick to throw away something that can be the perfect piece for her expressions. Despite being Japanese, she couldn't have less in common with a popular lifestyle organization aficionado from her homeland.

She's had a dire hatred of clowns and a love of Nashville Hot Chicken, but has never been one for horror movies and scary stories. Ironic that she finds herself in exactly the kind of story she's avoided for so long.`
      },
      {
        name: 'Charlie',
        backstory: `Charlie is a Caucasian woman with short, fair hair. She wears a brown leather jacket over a tan crop top, dark jeans, and brown boots. Charlie Aja has lived by her own rules. The perpetual outsider, she had a certain magnetism that attracted plenty of others.

The French national loved traveling and enjoying the outdoors. She displayed a rugged durability that comes from enduring the hardship of the elements in all manner of circumstances, but she was truly at peace away from the din of civilization. Her survivalist skills and strict fitness regimen have been her salvation in more than one sticky situation.

Slow to let people in, but loyal to a fault, Charlie would fight tooth and nail for anyone she cared about. Literally. Her parents raised her to never give up and helped foster her fighting spirit. She lost them both at an early age, never really discussing how, but she never gave up on the lessons they imparted.`
      }
    ],
    location: {
      name: 'Carnival of Blood',
      description: `Of course the public doesn't know we call it the Carnival of Blood. We ARE still trying to sell tickets you know! There is a reason we roam the country finding new towns to set up in, and it ain't because we like to travel. The 'management' pays good and they leave the help like me alone, so that's good enough for me. Someone comes in and never makes it home? That's not my problem.`,
      setupCards: [
        {
          name: 'Ring Around the Rosie',
          description: 'This setup spreads victims in a loose ring around the board, with no strong central focus. The Killer and key threat markers are offset rather than centralized.'
        },
        {
          name: 'Center Stage',
          description: 'This setup clusters important elements toward the center of the map — including the Killer start and victim density.'
        },
        {
          name: 'Boxed In',
          description: 'Victims and key locations are pushed toward edges and corners, with the Killer positioned to limit escape routes.'
        },
        {
          name: 'No Laughing Matter',
          description: 'This setup places high-value victims closer to immediate danger, with fewer low-risk saves available early.'
        },
        {
          name: 'Late for the Show',
          description: 'The Killer begins well-positioned relative to victims, while the Final Girl starts farther from meaningful intervention points.'
        }
      ],
      events: [
        { name: 'Animal Panic!', description: 'Each time the Horror level increases, roll a number of dice equal to the new Horror level and do the following: For each Success you may move a Victim of your choice 1 space. For every two dice that are not a Success kill one Victim.' },
        { name: 'Clowns Everywhere', description: 'During the Upkeep phase, Victims in The Big Top and any adjacent spaces panic. If they panic into the space with an Enemy, they are killed immediately.' },
        { name: '"Did you follow me here?"', description: 'Place 4 new Victims at The Big Top. One of them is a Special Victim who is your plucky younger Sibling. While the Sibling is in your space, you may spend 2 Time to reroll one die. If the Sibling dies, increase Bloodlust by 1.' },
        { name: 'Employee Transport', description: 'Place the Golf Cart token in any of the 4 corner spaces. During Upkeep: You and/or up to 2 Victims in the space with the Golf Cart may drive it up to 2 spaces, but the Golf Cart must stay on the outer path. If the Golf Cart is driven into a space with an Enemy, you may discard it to do 3 Damage to that Enemy.' },
        { name: 'Full Moon', description: 'The Victim farthest from you is the world\'s hairiest man and is actually a Werewolf! The Werewolf will not follow you and cannot be targeted, saved, or killed. During Upkeep: panic the Werewolf. Then he does 2 Damage to one target in his space.' },
        { name: '"How dangerous can it be?"', description: 'During the Upkeep phase, each Victim moves 1 space towards the closest Trap token.' },
        { name: 'It\'s Not Real', description: 'Place 4 new Victims at the House of Mirrors. Place the Skull token at the Forest of Horrors. Any Victims at or moving into the Forest of Horrors are killed immediately.' },
        { name: 'Mirrors Everywhere', description: 'If you attack and there are one or more Victims in your space, a Victim dies for every 1 you roll.' },
        { name: '"Run! I\'ll hold them off!"', description: 'The Victim closest to you is your Fiancé. If an Enemy would move into your space while the Fiancé is there, instead kill the Fiancé and the Enemy stays where they are. If your Fiancé is killed by a trap, increase Horror by 5.' },
        { name: 'So Much Junk', description: 'When this card is revealed, find the Zappo Item card and put it in your backpack. Reset the Item deck(s) if necessary. If you lose Zappo, roll one fewer dice (minimum 1) when resolving Search Action cards for the remainder of the game. Zappo the Carnival Monkey is an Item that can be found in the Carnival of Blood.' }
      ]
    },
    killer: {
      name: 'Geppetto',
      description: `He travels from state to state and runs his operation for a few days just like any other freakshow would. When it grows in popularity… that's when he makes his move, adding as many of them to his family as he can. He keeps us around to keep up appearances, but I fear one day soon he will welcome me into the family too.`
    }
  }
};

// Helper to get details for a specific film
export const getFilmDetails = (filmId: string): FeatureFilmDetail | undefined => {
  return FEATURE_FILM_DETAILS[filmId];
};

// Helper to get setup cards for a location
export const getSetupCardsForLocation = (filmId: string): { name: string; description: string }[] => {
  return FEATURE_FILM_DETAILS[filmId]?.location.setupCards ?? [];
};

// Helper to get events for a location
export const getEventsForLocation = (filmId: string): { name: string; description: string }[] => {
  return FEATURE_FILM_DETAILS[filmId]?.location.events ?? [];
};
