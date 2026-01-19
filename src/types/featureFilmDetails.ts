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
  },
  's1-maple-lane': {
    filmId: 's1-maple-lane',
    finalGirls: [
      {
        name: 'Sheila',
        backstory: `Sheila is a medium brown-skinned Asian girl with long, dark brown hair. She wears a purple collared shirt under a pink sweater. Over that is a blue-purple fur-trimmed jacket.

Sheila Smalley was adopted by Mike and Rhonda Smalley the year after the tragic death of their first daughter from (at least in their minds) the influence of Dr. Franklin Wright. Sheila was saved from the streets of India at a young age, though she was ripped away from her older brother who was taking care of her. She doesn't remember much from her years as a child in India. The Smalleys made every effort to shield Sheila from the events of the past and, namely, their murder of Dr. Wright. His transition into the dream world before death was unknown to them, but it would soon become known to Sheila.

Sheila was well-liked in school and had a lot of friends. She'd even recently gotten a boyfriend when a really smart kid, ok a nerd, named Tommy asked her to 'go steady.' Tommy really won her heart when he stood up to a group of jocks that were making racially insensitive comments to Sheila. He paid for it with a black eye and some bruises, but Sheila knew in that moment that she could trust Tommy to protect her no matter what.

When Sheila set her mind on something she could be very effective. She just had to overcome her fears first. She was a meticulous planner and strategist and as long as she didn't get paralyzed by fear and uncertainty, she was a force to be reckoned with.`
      },
      {
        name: 'Nancy',
        backstory: `Nancy is a Caucasian woman with short, wavy brown hair. She wears a teal top and tan pants, with brown shoes.

Nancy Lang was basically the All-American girl. An only child, she was constantly being doted on by her parents. In the rare instance where she did get into trouble, her father's position and influence as a ranking officer in law enforcement was usually enough to get her out of it.

Nancy suffered from night terrors, often thrashing violently in her sleep. Her parents were considering something for Nancy they'd recently heard about called "dream therapy" and apparently, there was a local doctor that does that sort of thing.

Nancy was a bright young woman. A senior in high school who was well liked. Her boyfriend lived just around the corner and, while he was a good guy, he wasn't someone Nancy saw herself with long term.

Nancy was always extremely resilient and persistent. She'd beat the odds even when they were heavily stacked against her.`
      }
    ],
    location: {
      name: 'Maple Lane',
      description: `Maple Lane runs through a typical American suburban neighborhood in the quaint town of Spring Hill. Maple Lane was a street like any other... at least until someone got murdered. Now the residents are fearful of outsiders and weary of each other, but that doesn't stop them from gathering for holidays and letting their children play in the streets. They may soon regret having such a false sense of security.`,
      setupCards: [
        {
          name: 'A Quiet Place',
          description: 'Victims are spread apart, with relatively low clustering, and the Killer starts offset rather than embedded in a dense group.'
        },
        {
          name: 'Block Party',
          description: 'A large cluster of victims in the central space (including a high-value victim), with the Killer starting nearby.'
        },
        {
          name: 'Maple Lane',
          description: 'A balanced distribution: moderate clustering, reasonable spacing, and neutral Killer positioning.'
        },
        {
          name: 'Revenge',
          description: 'The Final Girl begins closer to danger, while victims are positioned such that intervention often requires stepping into the Killer\'s path.'
        },
        {
          name: 'Playtime',
          description: 'Victims are clustered near the center, but not as tightly as Block Party, and the Killer starts close enough to threaten quickly without immediate overlap.'
        }
      ],
      events: [
        { name: 'Boyfriend', description: 'Place this Special Victim in the Boyfriend\'s House. This is your Boyfriend! If the Killer would target you, the Killer instead targets the Boyfriend.' },
        { name: 'Fire!', description: 'Roll a die and place the Fire token in: 1-3: The Boyfriend\'s House 4-6: The Smalley\'s House Any Victims in the House Space or that panic into the House Space are killed. You or Enemies in the House Space take 1 damage. The House Space may no longer be entered or searched.' },
        { name: 'Friendly Neighbors', description: 'Roll +1 Dice when resolving Convince Action cards.' },
        { name: 'It\'s Raining', description: 'Panic Victims in the Intersection. Then, move every Victim that is on a Street space to its adjacent House Space.' },
        { name: '"It\'s the 4th of July!"', description: 'Move all Victims inside a House Space to the adjacent Street space.' },
        { name: 'Officer Kopp', description: 'Place the Cop Car token on the Exit Space of your choice. Each Upkeep, move it one space towards the opposite exit. Victims in the space with the Cop Car will move with it and are considered saved when they reach the Exit Space.' },
        { name: 'Party in the Burbs!', description: 'Place 4 new Victims in any House Space that contains at least one Victim. If none do, place them in the Intersection.' },
        { name: 'The Smalleys', description: 'Place 2 Special Victims in the Smalley\'s House. Each time one of the Smalleys is killed, +1 Bloodlust.' },
        { name: 'Under Construction', description: 'Roll a die and place a Roadblock token on the following Exit Space: 1: West 2: East 3: North 4: South 5: East or West 6: North or South Victims may not be saved from that space.' },
        { name: '"What is going on over there?"', description: 'Place 1 new Victim on each Exit Space.' }
      ]
    },
    killer: {
      name: 'Dr. Fright',
      description: `I was in some sort of boiler room and a grotesque man with a pitchfork was chasing me! I was sure he was going to kill me… it felt so real! He had pock mark scars all over his skin and his eyes were milky white. A strange black… something, maybe a cloud but with eyes, swirled behind him. I was terrified, so I turned and ran. I rounded a corner and lost my footing. I staggered into some pipes and they burnt my skin so badly. That's when I woke up. I thought it was all in a dream, but I had a severe burn on my arm from the pipes!`
    }
  },
  's1-creech-manor': {
    filmId: 's1-creech-manor',
    finalGirls: [
      {
        name: 'Alice',
        backstory: `Alice is a Caucasian woman with wavy ginger hair and green eyes. She wears a green t-shirt, white skirt, brown bag, dark green leggings and shoes.

Alice Cranston was the definition of a fiery redhead. Her friends loved her boisterous personality and her take-no-shit demeanor. When she decided she wanted something, she never let anything get in her way.

She got bored of things quickly though, including her relationships. As such, she never really had any deep or meaningful relationships. To put it bluntly, there wasn't anyone who could handle her. At least no-one she'd found yet.

Alice had some growing up to do, but she loved the clubbing lifestyle and was out almost every night. She was in great shape and between her dancing and her workouts during the day, her cardio was top notch.

Don't bet against Alice, but dealing with a bloodthirsty murderer is a lot different than dealing with some mouthy club rat or handsy gentleman caller.`
      },
      {
        name: 'Selena',
        backstory: `Selena is a medium brown-skinned woman with textured, dark brown hair in a bob. She wears a yellow tank top and black athletic pants.

Selena Villanueva came from a big family. Having so many brothers and sisters was a blessing and a curse. On the one hand, they all got along and had each other's backs, but on the other hand, it made her thirst for the attention of her parents.

Selena's thirst for attention caused her to look elsewhere. She always ended up going for the bad boy type and as hard as she tried, the relationships never worked out. Eventually, she learned to observe little things and use a discerning eye to stay out of bad relationships.

By the time she went off to college, she knew she wanted to major in criminal justice. She could tell things about people and her surroundings using her keen observation skills, and she wanted to use it to solve crimes and mysteries.

Little did she know that she would have to survive Creech Manor first!`
      }
    ],
    location: {
      name: 'Creech Manor',
      description: `Creech Manor is over 100 years old with the kind of character and historic charm that people love. It is the kind of home where every step, every new room, can call to one's imagination a story from the past. But the stories of Creech Manor are filled with horrifying events, macabre happenings, and supernatural powers beyond human understanding. Go away, for evil reigns within...`,
      setupCards: [
        { name: 'Creepshow', description: 'A setup for The Haunting of Creech Manor featuring initial victim and token placement.' },
        { name: 'Dancing Queen', description: 'A setup for The Haunting of Creech Manor featuring initial victim and token placement.' },
        { name: 'Strange Trophies', description: 'A setup for The Haunting of Creech Manor featuring initial victim and token placement.' },
        { name: 'The Dead Zone', description: 'A setup for The Haunting of Creech Manor featuring initial victim and token placement.' },
        { name: 'The Ladder', description: 'A setup for The Haunting of Creech Manor featuring initial victim and token placement.' }
      ],
      events: [
        { name: 'Clingy Victims', description: 'You must have at least 1 Victim follow you if able.' },
        { name: 'Curiosity Killed the People', description: 'Place 3 new Victims in the Foyer and panic them immediately.' },
        { name: 'Frozen in Fear', description: 'Victims will no longer panic during the Panic phase.' },
        { name: 'Ghost Hunters', description: 'Replace the 3 Victims closest to you (or as many as able) with the Special Victim meeples. These Victims will not follow you until one of them has been killed. Each time one of these Victims is killed, increase Bloodlust by 1 more.' },
        { name: 'Helicopter Rescue', description: 'Place the Helicopter token on the roof of the house. Once during the game, you may move from the Attic to the Helicopter as though they are adjacent. Any Victims (or Carolyn) with you may be saved. Unless you have saved Carolyn, you must return to the Attic and the token must be removed. The Helicopter is not considered an exit space.' },
        { name: "I Ain't Afraid of No Ghost", description: 'Move each Victim 1 space towards the Attic.' },
        { name: "Light's Out", description: 'Roll 1 fewer dice (minimum of 1) when resolving an Action card that allows movement. Ignore this effect if you have a Flashlight or Candle.' },
        { name: 'Liquid Courage', description: "Victims will follow you into the Killer's space." },
        { name: 'No One Comes Back', description: 'Place the Skull token in the Attic. All Victims in the Attic are killed. Whenever a Victim enters the Attic, they are killed immediately.' },
        { name: 'Pushed to the Edge', description: 'Roll a die for each Victim in a Window Space. If the roll is a 1-4, that Victim jumps and is killed.' }
      ]
    },
    killer: {
      name: 'Poltergeist',
      description: `"How do you fight a poltergeist? Let me ask you something... how does one fight something one cannot see? It's simple, you don't. You get the hell out of there and you don't look back, you don't turn back, you don't do anything but run. If you do, it will ruin you. Mentally. Physically. And Emotionally. Then, it will kill you."`
    }
  },
  's1-sacred-groves': {
    filmId: 's1-sacred-groves',
    finalGirls: [
      {
        name: 'Adelaide',
        backstory: `Adelaide is a dark-skinned black woman with tied-back black hair. She wears a white tank top, tan trousers, and shoes.

Adelaide Jordan was good at everything she did, but never great. She was a straight B student, a green belt in taekwondo, and had more second and third place trophies than anyone she knew. This wasn't because she lacked intelligence or drive or even talent. If she'd wanted to, she'd have become the best at anything she put her mind to. And there was the catch. She quickly got bored and would move onto the next hobby or sport or interest before she'd had a chance to become proficient at the previous one. There was always something shinier around the corner.

As an adult, Adelaide quickly became the quintessential jack-of-all-trades, knowing a little about a lot but not a lot about anything in particular. And in all honesty, that suited her just fine. Life was always an adventure because she was always trying out something new, and there were plenty of situations where her grab-bag of skills would come in handy... perhaps even save her life.`
      },
      {
        name: 'Barbara',
        backstory: `Barbara is a Caucasian woman with curly ginger hair. She wears a grey striped top, grey 3/4th jeans, and black shoes.

When Barbara Romero was 9, the thing she wanted most in the whole wide world was a Miss Baby Face doll. It was the 'hot' gift that Christmas season and, try as hard as they could, her parents couldn't find one. They were all sold out. They got her a Little Susie Puffins instead, but that was not even close to being the same thing. She didn't even take it out of the box.

In fourth grade, if you had a Miss Baby Face you were the shit, but the only girl who managed to get one was Dolores Johnson. At recess everyone would crowd around Dolores and oooh and ahhh at the doll. Barbara was intensely jealous. She wanted to be the center of attention. She wanted Miss Baby Face.

So, she pulled Dolores aside one day and somehow, inexplicably, magically even, convinced her to hand over the precious doll. That was the day that Barbara learned she could convince anyone to do whatever she wanted them to. It was her super power, and she used it every chance she got. Why risk your own neck when you could just get someone else to risk theirs instead?`
      }
    ],
    location: {
      name: 'Sacred Groves',
      description: `The gods are furious over the desecration of their sacred places by idiotic obnoxious tourists! They've forged an unholy pact with the Killer, unleashing that wrath upon you and the oblivious victims in an attempt to cleanse the Groves with blood and fire. As you fight to survive against the Killer's onslaught, you'll need to simultaneously contend with the fury of the gods, represented by Divine Wrath.`,
      setupCards: [
        { name: 'Dueling Tour Guides', description: 'A setup for Slaughter in the Groves featuring initial victim and token placement.' },
        { name: 'Family Day', description: 'A setup for Slaughter in the Groves featuring initial victim and token placement.' },
        { name: 'Mob O\' Tourists', description: 'A setup for Slaughter in the Groves featuring initial victim and token placement.' },
        { name: 'Swamp Thing', description: 'A setup for Slaughter in the Groves featuring initial victim and token placement.' },
        { name: 'Worship Service', description: 'A setup for Slaughter in the Groves featuring initial victim and token placement.' }
      ],
      events: [
        { name: 'Closed for Maintenance', description: 'When this card is revealed, you may discard ALL Action cards except Atonement to close a Sacred space. If you do, place the CLOSED token on the Sacred space of your choice. Move any Victims there to adjacent spaces of your choice (evenly distributed) Victims may no longer move into the space for any reason, but you and all Enemies may continue to move to and from the space as normal.' },
        { name: 'Fire and Brimstone', description: 'Roll a die and place the Fire and Brimstone token on the: 1-2: Burial Grounds 3-4: Sacred Shrine 5-6: Holy Groves' },
        { name: 'Flash Photography', description: 'Whenever at least 1 Victim in your space panics, discard 1 random Action card.' },
        { name: 'Hallowed Ground', description: 'Roll a die and place the Hallowed Ground token on the: 1-2: Burial Grounds 3-4: Sacred Shrine 5-6: Holy Groves Anytime you end the Action phase on that space, gain 2 Time.' },
        { name: 'Loud and Obnoxious', description: 'Whenever Divine Wrath Increases, Increase it by an additional 1.' },
        { name: 'The Gods Hate Failure', description: 'Whenever you completely fail a Horror roll (after conversions and rerolls), Increase Divine Wrath by 1.' },
        { name: 'The Holy Man', description: 'The Victim farthest from the Killer is now the Holy Man. The Holy Man will not follow you. Every Upkeep phase, move the Holy Man one space towards the Killer. When the Holy Man is in the same space as the Killer, immediately remove him from the board. If you were in his space, Decrease Killer Wrath and Divine Wrath to 1. If you were not in his space, Increase Killer Wrath and Divine Wrath by a total of 10 (your choice).' },
        { name: 'The Tour Guide', description: 'The Victim closest to you is the Tour Guide. Once per turn, whenever you move at least 1 space, you may move an additional space as long as the Tour Guide remains with you for your entire movement. If the Tour Guide is killed, Increase Divine Wrath by 6.' },
        { name: 'The Uber Tourist', description: 'The Victim farthest from the Killer is now the Uber Tourist. Whenever the Killer must choose a Target, the Uber Tourist is chosen instead. If the Uber Tourist is saved, Decrease Divine Wrath or Killer Wrath by 4. If the Uber Tourist is killed, Increase Divine Wrath by 4.' },
        { name: 'Unholy Bloodshed', description: 'Anytime at least 1 Victim is killed at a Sacred space, Unleash Divine Wrath.' }
      ]
    },
    killer: {
      name: 'Inkanyamba',
      description: `Whoever Inkanyamba used to be (or where he came from) no longer matters. He has taken for himself the name of the legendary monster and has become a creature of pure wrath. His sole purpose is to exact vengeance on those around him, even if he long ago forgot the reasons for that vengeance. In order to overcome him, you will need to manage his ever rising anger, represented by Killer Wrath. If it boils over, you will never survive the ensuing onslaught!`
    }
  },
  's2-madness-in-dark': {
    filmId: 's2-madness-in-dark',
    finalGirls: [
      {
        name: 'Heather',
        backstory: `Heather worked as a nurse at Wolfe Asylum. She had a loving and giving heart and helped restore many of her patients to a state where they could leave the asylum and go back to their lives. That was the goal after all.

Of late though, Heather had seen and heard things she was not supposed to. While her unit and staff were on the up and up, others in the facility were participating in nefarious and even illegal activities. Because of what she'd learned it was with a heavy heart that she'd decided to turn in her resignation.`
      },
      {
        name: 'Veronica',
        backstory: `Veronica is a quiet person. She's very organized and extremely efficient with her time. She is rarely late and plans her days down to the minute.

Many would call her eccentric because of how obsessive she is over time, but her friends and coworkers know it to be a talent and something that gives her a real advantage in her work and life, despite sometimes coming across as rude or selfish for putting her time and commitments above everything else.`
      }
    ],
    location: {
      name: 'Wolfe Asylum',
      description: `Constructed in 1899 by the eccentric oil baron and philanthropist Jebediah Wolfe, Wolfe Asylum was built to hold 300 patients, but by the 1950's was home to over 2,500 souls. Overcrowding was the least of its problems, however, as 'difficult' patients were routinely locked in cages, while others went unattended for weeks or were left to wander the dank halls completely naked.

Before the reforms of the late '70s, Wolfe orderlies frequently performed lobotomies with ice picks, and electroshock treatment often resulted in death. Today, Wolfe Asylum claims to be a haven for the mentally ill, but some say it will never truly be free of its dark past.`,
      setupCards: [
        { name: 'A Solitary Life', description: 'A setup for Madness in the Dark featuring initial victim and token placement.' },
        { name: 'Bingo Night', description: 'A setup for Madness in the Dark featuring initial victim and token placement.' },
        { name: 'Madhouse Faceoff', description: 'A setup for Madness in the Dark featuring initial victim and token placement.' },
        { name: 'Padded Rooms', description: 'A setup for Madness in the Dark featuring initial victim and token placement.' },
        { name: 'The Dr. Is In', description: 'A setup for Madness in the Dark featuring initial victim and token placement.' }
      ],
      events: [
        { name: 'Dangerous Addiction', description: 'Choose up to 2 Victims that do not share a space with you or each other. Place a facedown Pill token with both, one, or neither of them. For each Pill token you place, 1 Bloodlust.' },
        { name: 'Dr. Death', description: 'Place Dr. Death in the Operating Theater. During the Upkeep phase, Dr. Death kills a Victim in his space. If there are none, move Dr. Death one space closer to the nearest Victim.' },
        { name: 'Dr. Sunshine', description: 'Place Dr. Sunshine in the Doctor\'s Office. While Dr. Sunshine is in your space, whenever you take a Pill you may choose what color it is. If Dr. Sunshine is killed in your space, 4 Horror.' },
        { name: 'Hannibal the Cannibal', description: 'Place Hannibal in Solitary Confinement along with 2 new Victims. During the Upkeep phase, Hannibal kills a Victim in his space. If there are none, panic Hannibal instead. If Hannibal is saved, 1 Horror. If Hannibal is killed, minus 1 Horror.' },
        { name: 'Hospital Gurney', description: 'Place the Hospital Gurney token in your space. It can move with you and you can place up to 2 Victims on it. You can discard the Gurney to ram it into an Enemy in your space or an adjacent space to inflict 1 Damage plus one additional Damage for each Victim currently on the Gurney. The Victims are then killed.' },
        { name: 'Medical Stockpile', description: 'The first time in a phase that you or an Enemy recover at least 1 Health, you or the Enemy recover an additional Health.' },
        { name: 'Powerful Meds', description: 'Whenever you consume a Pill or Pills, draw an additional Side Effects card.' },
        { name: 'Scratching And Biting', description: 'Whenever you save a Victim, make a Horror roll. If no stars, lose 1 Health.' },
        { name: '"The New Patients Are Here!"', description: 'New patients arrive at the asylum, adding more victims to save.' },
        { name: 'Welcome To The Madhouse', description: 'Place a Skull token in the Common Room. When you or an Enemy enters that space, you or it is dealt 1 Damage.' }
      ]
    },
    killer: {
      name: 'Ratchet Lady',
      description: `There once was a woman who loved helping people. Her greatest joy was to bandage a wound, offer a kind word, or hold a sickly hand. Then, one day, she witnessed something so horrible, so soul-shattering, that it changed her completely. Utterly. Irrevocably.

And now, kindness and joy have been replaced with cruelty and despair. There is still a smile, but it is a hateful smile, and may the God of Abraham have mercy on you if you see it.

The Ratchet Lady wears a torn white gown and has bandages wrapped around her head, covering her eyes. Her right hand is missing, with a metal frame around the forearm. She carries a knife.`
    }
  },
  's3-killer-from-tomorrow': {
    filmId: 's3-killer-from-tomorrow',
    finalGirls: [
      {
        name: 'Kat',
        backstory: `Kat grew up with an ex-military father who was convinced the world was out to get them both. His paranoia drove him to do everything in his power to prepare his little girl for the horrors that awaited beyond their front door. They lived off the grid and he taught her everything he knew: hand-to-hand combat; weapons handling; surviving off the land; battlefield tactics; hunting and tracking.

By the age of 13 she could hit a tin can at 50 yards with a pistol. By 16 she could survive for a month in the dead of winter with nothing but a bowie knife. By 18 she had had enough of her father's paranoia, and left him and his crazy rants behind.

It was only years later that she would fully appreciate what he had passed on to her when she came face to face with an unstoppable killing machine. The only thing standing between it and its helpless prey was Kat and her small arsenal of weaponry. Truth be told she kind of liked those odds.`
      },
      {
        name: 'Tali',
        backstory: `Tali grew up in an orphanage south of the border, one of the worst places a child could possibly be raised in. By the time she was 8 she had escaped and was living on the streets, a significant improvement over the conditions she'd endured at the orphanage.

Tali was smart and so it wasn't long before she'd carved out her niche among the roving gangs of street kids, quickly rising to the top of her own fiefdom. She understood that choosing when to fight and how to fight was often more important than winning a fight. She was cautious and chose defense rather than offense, and that wisdom kept her alive in an environment that chewed up lost children and spat them out like day-old bread.

Tali's nose for caution, combined with her street smarts, means that she's a formidable foe for any creature out for blood.`
      }
    ],
    location: {
      name: 'Sunnydaze Mall',
      description: `Welcome to the ultimate shopping experience! Step into the heart of fashion, excitement, and endless possibilities! Introducing Sunnydaze Mall, your premiere shopping destination!

Sunnydaze has the latest trends in fashion, state-of-the-art electronics, and a wide variety of culinary delights… all under one roof! Sunnydaze… where every day is filled with sunshine and joy!`,
      setupCards: [
        { name: 'Foodcourt Faceoff', description: 'A setup for The Killer from Tomorrow featuring initial victim and token placement in the food court area.' },
        { name: 'Special Delivery', description: 'A setup for The Killer from Tomorrow featuring initial victim and token placement.' },
        { name: 'High Score!', description: 'A setup for The Killer from Tomorrow featuring initial victim and token placement in the arcade area.' },
        { name: 'Family Dinner', description: 'A setup for The Killer from Tomorrow featuring initial victim and token placement.' },
        { name: 'Black Friday', description: 'A setup for The Killer from Tomorrow featuring chaotic initial victim and token placement throughout the mall.' }
      ],
      events: [
        { name: 'Food Fight!', description: 'If you are an ally, or an enemy enters the food court, they receive damage if there is at least 1 victim in either Food Court space.' },
        { name: 'Bart the Mall Cop', description: 'Place Bart the Mall Cop in Security. He will move around the spaces surrounding the food court.' },
        { name: 'Wet Floors', description: 'Whenever a victim in a railing space panics, roll twice and apply the lower result.' },
        { name: 'Lockdown!', description: 'Both door spaces are sealed off. You can remove this by going to Security.' },
        { name: 'Flash Mob!', description: 'Place 6 new victims in the food court, then panic all victims in the food court.' },
        { name: 'Rise of the Nerds!', description: 'Place a new Victim at both Boards \'n Bones and Joystick Heroes.' },
        { name: 'Fire Sale!', description: 'Move all victims that are adjacent to a store into the store.' },
        { name: 'Busted Escalators', description: 'Lose 2 time when moving through an escalator.' },
        { name: 'The Savior\'s Girl', description: 'The victim closest to the savior is now the savior\'s girl.' },
        { name: 'Renovations', description: 'Destroy a wall on one of the stores.' }
      ]
    },
    killer: {
      name: 'The Hunter',
      description: `"I knew the guy was bad news the moment I saw him. Over 6 feet tall, face hidden by that hoodie, big bulge underneath his jacket. I tried to stop him but he just shoved me aside like I was made of cotton. I took the hint and I was outta there! I'm just a mall cop for crying out loud. They don't pay me enough for this kind of shit!" - Bart, Mall Cop`
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
