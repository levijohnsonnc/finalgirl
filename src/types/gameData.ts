// Box art imports - bundled by Vite for cache-busting and build-time validation
import happyTrailsArt from '@/assets/box-art/happy-trails-horror.png';
import creechManorArt from '@/assets/box-art/haunting-creech-manor.png';
import slaughterGrovesArt from '@/assets/box-art/slaughter-groves.png';
import carnageCarnivalArt from '@/assets/box-art/carnage-carnival.png';
import frightmareMapleArt from '@/assets/box-art/frightmare-maple-lane.png';
import madnessInDarkArt from '@/assets/box-art/madness-in-the-dark.png';
import killerFromTomorrowArt from '@/assets/box-art/killer-from-tomorrow.png';
import rottenHarvestArt from '@/assets/box-art/rotten-harvest.png';
import intoTheVoidArt from '@/assets/box-art/into-the-void.png';
import panicStation2891Art from '@/assets/box-art/panic-station-2891.png';
import knockAtTheDoorArt from '@/assets/box-art/knock-at-the-door.png';
import falconwoodFilesArt from '@/assets/box-art/the-falconwood-files.png';
import terrorFromAboveArt from '@/assets/box-art/terror-from-above.png';
import terrorFromGraveArt from '@/assets/box-art/terror-from-the-grave.png';
import terrorFromDestinyArt from '@/assets/box-art/terror-from-destiny.png';
import shriekArt from '@/assets/box-art/shriek.png';
// Character/location specific images
import hansImage from '@/assets/characters/hans.png';
import laurieImage from '@/assets/characters/laurie.png';
import reikoImage from '@/assets/characters/reiko.png';
import drFrightImage from '@/assets/characters/dr-fright.png';
import nancyImage from '@/assets/characters/nancy.png';
import sheilaImage from '@/assets/characters/sheila.png';
import geppettoImage from '@/assets/characters/geppetto.png';
import asamiImage from '@/assets/characters/asami.png';
import charlieImage from '@/assets/characters/charlie.png';
import aliceImage from '@/assets/characters/alice.png';
import selenaImage from '@/assets/characters/selena.png';
import adelaideImage from '@/assets/characters/adelaide.png';
import barbaraImage from '@/assets/characters/barbara.png';
import poltergeistImage from '@/assets/characters/poltergeist.png';
import inkanyambaImage from '@/assets/characters/inkanyamba.png';
import heatherImage from '@/assets/characters/heather.png';
import veronicaImage from '@/assets/characters/veronica.png';
import ratchetLadyImage from '@/assets/characters/ratchet-lady.png';
import katImage from '@/assets/characters/kat.png';
import taliImage from '@/assets/characters/tali.png';
import theHunterImage from '@/assets/characters/the-hunter.png';
import joyImage from '@/assets/characters/joy.png';
import vickyImage from '@/assets/characters/vicky.png';
import grimlashImage from '@/assets/characters/grimlash.png';
import ellenImage from '@/assets/characters/ellen.png';
import jenetteImage from '@/assets/characters/jenette.png';
import evomorphImage from '@/assets/characters/evomorph.png';
import kateImage from '@/assets/characters/kate.png';
import ukiImage from '@/assets/characters/uki.png';
import theOrganismImage from '@/assets/characters/the-organism.png';
import gretelImage from '@/assets/characters/gretel.png';
import redImage from '@/assets/characters/red.png';
import bigBadWolfImage from '@/assets/characters/big-bad-wolf.png';
import campHappyTrailsImage from '@/assets/locations/camp-happy-trails.png';
import sunnydazeMallImage from '@/assets/locations/sunnydaze-mall.png';
import mapleLaneImage from '@/assets/locations/maple-lane.png';
import carnivalOfBloodImage from '@/assets/locations/carnival-of-blood.png';
import creechManorImage from '@/assets/locations/creech-manor.png';
import sacredGrovesImage from '@/assets/locations/sacred-groves.png';
import wolfeAsylumImage from '@/assets/locations/wolfe-asylum.png';
import shadyAcresImage from '@/assets/locations/shady-acres.png';
import ussKonradImage from '@/assets/locations/uss-konrad.png';
import station2891Image from '@/assets/locations/station-2891.png';
import storybookWoodsImage from '@/assets/locations/storybook-woods.png';
import onceUponFullMoonArt from '@/assets/box-art/once-upon-full-moon.png';
import ginnyImage from '@/assets/characters/ginny.png';
import avaImage from '@/assets/characters/ava.png';
import theIntrudersImage from '@/assets/characters/the-intruders.png';
import wingardCottageImage from '@/assets/locations/wingard-cottage.png';
import octaviaImage from '@/assets/characters/octavia.png';
import janelleImage from '@/assets/characters/janelle.png';
import slayerImage from '@/assets/characters/slayer.png';
import falconwoodImage from '@/assets/locations/falconwood.png';
import kenzieImage from '@/assets/characters/kenzie.png';
import julieImage from '@/assets/characters/julie.png';
import razorfaceImage from '@/assets/characters/razorface.png';
import hellscapeImage from '@/assets/locations/hellscape.png';
import hellToPayArt from '@/assets/box-art/hell-to-pay.png';
import mandyImage from '@/assets/characters/mandy.png';
import cassieImage from '@/assets/characters/cassie.png';
import theTormentorImage from '@/assets/characters/the-tormentor.png';
import marrekWarehouseImage from '@/assets/locations/marrek-warehouse.png';
import marrekMurdersArt from '@/assets/box-art/the-marrek-murders.png';
import meghanImage from '@/assets/characters/meghan.png';
import rondaImage from '@/assets/characters/ronda.png';
import theEyelessImage from '@/assets/characters/the-eyeless.png';
import utopiaImage from '@/assets/locations/utopia.png';
import dontMakeASoundArt from '@/assets/box-art/dont-make-a-sound.png';
import melanieImage from '@/assets/characters/melanie.png';
import birdsImage from '@/assets/characters/birds.png';
import patsyImage from '@/assets/characters/patsy.png';
import zombiesImage from '@/assets/characters/zombies.png';
import gabrielleImage from '@/assets/characters/gabrielle.png';
import destinyImage from '@/assets/characters/destiny.png';
import adrianneImage from '@/assets/characters/adrianne.png';
import maureenImage from '@/assets/characters/maureen.png';
import mortImage from '@/assets/characters/mort-the-teenage-dirtbag.png';
import megabgconImage from '@/assets/locations/megabgcon.png';
export interface FeatureFilm {
  id: string;
  name: string;
  season: number;
  killer: string;
  location: string;
  finalGirls: [string, string] | [string]; // Vignettes have single final girl
  boxArt?: string;
  isVignette?: boolean; // Vignettes have no location
}

// Character-specific images (for casting room display)
export const CHARACTER_IMAGES: Record<string, string> = {
  'Hans': hansImage,
  'Laurie': laurieImage,
  'Reiko': reikoImage,
  'Dr. Fright': drFrightImage,
  'Nancy': nancyImage,
  'Sheila': sheilaImage,
  'Geppetto': geppettoImage,
  'Asami': asamiImage,
  'Charlie': charlieImage,
  'Alice': aliceImage,
  'Selena': selenaImage,
  'Adelaide': adelaideImage,
  'Barbara': barbaraImage,
  'Poltergeist': poltergeistImage,
  'Inkanyamba': inkanyambaImage,
  'Heather': heatherImage,
  'Veronica': veronicaImage,
  'Ratchet Lady': ratchetLadyImage,
  'Kat': katImage,
  'Tali': taliImage,
  'The Hunter': theHunterImage,
  'Joy': joyImage,
  'Vicky': vickyImage,
  'Grimlash': grimlashImage,
  'Ellen': ellenImage,
  'Jenette': jenetteImage,
  'Evomorph': evomorphImage,
  'Kate': kateImage,
  'Uki': ukiImage,
  'The Organism': theOrganismImage,
  'Gretel': gretelImage,
  'Red': redImage,
  'Big Bad Wolf': bigBadWolfImage,
  'Ginny': ginnyImage,
  'Ava': avaImage,
  'The Intruders': theIntrudersImage,
  'Octavia': octaviaImage,
  'Janelle': janelleImage,
  'Slayer': slayerImage,
  'Kenzie': kenzieImage,
  'Julie': julieImage,
  'Razorface': razorfaceImage,
  'Mandy': mandyImage,
  'Cassie': cassieImage,
  'The Tormentor': theTormentorImage,
  'Meghan': meghanImage,
  'Ronda': rondaImage,
  'The Eyeless': theEyelessImage,
  'Melanie': melanieImage,
  'Birds': birdsImage,
  'Patsy': patsyImage,
  'Zombies': zombiesImage,
  'Gabrielle': gabrielleImage,
  'Destiny': destinyImage,
  'Adrianne': adrianneImage,
  'Maureen': maureenImage,
  'Mort the Teenage Dirtbag': mortImage,
};

// Location-specific images (for casting room display)
export const LOCATION_IMAGES: Record<string, string> = {
  'Camp Happy Trails': campHappyTrailsImage,
  'Maple Lane': mapleLaneImage,
  'Carnival of Blood': carnivalOfBloodImage,
  'Creech Manor': creechManorImage,
  'Sacred Groves': sacredGrovesImage,
  'Wolfe Asylum': wolfeAsylumImage,
  'Sunnydaze Mall': sunnydazeMallImage,
  'Shady Acres': shadyAcresImage,
  'USS Konrad': ussKonradImage,
  'Station 2891': station2891Image,
  'Storybook Woods': storybookWoodsImage,
  'Wingard Cottage': wingardCottageImage,
  'Falconwood': falconwoodImage,
  'Hellscape': hellscapeImage,
  'Marrek Warehouse': marrekWarehouseImage,
  'Utopia': utopiaImage,
  'MegaBGCon': megabgconImage,
};

export interface SessionLog {
  id: string;
  date: string;
  killer: string;
  location: string;
  finalGirl: string;
  result: 'win' | 'loss';
}

export interface GameSelection {
  killer: string | null;
  location: string | null;
  finalGirl: string | null;
  startingEvent: string;
  initialSetupCard: string;
}

export const FEATURE_FILMS: FeatureFilm[] = [
  // Season 1
  { id: 's1-camp-happy-trails', name: 'The Happy Trails Horror', season: 1, killer: 'Hans', location: 'Camp Happy Trails', finalGirls: ['Laurie', 'Reiko'], boxArt: happyTrailsArt },
  { id: 's1-creech-manor', name: 'The Haunting of Creech Manor', season: 1, killer: 'Poltergeist', location: 'Creech Manor', finalGirls: ['Alice', 'Selena'], boxArt: creechManorArt },
  { id: 's1-sacred-groves', name: 'Slaughter in the Groves', season: 1, killer: 'Inkanyamba', location: 'Sacred Groves', finalGirls: ['Adelaide', 'Barbara'], boxArt: slaughterGrovesArt },
  { id: 's1-carnival-of-blood', name: 'Carnage at the Carnival', season: 1, killer: 'Geppetto', location: 'Carnival of Blood', finalGirls: ['Asami', 'Charlie'], boxArt: carnageCarnivalArt },
  { id: 's1-maple-lane', name: 'Frightmare on Maple Lane', season: 1, killer: 'Dr. Fright', location: 'Maple Lane', finalGirls: ['Sheila', 'Nancy'], boxArt: frightmareMapleArt },
  { id: 's1-terror-from-above', name: 'Terror From Above', season: 1, killer: 'Birds', location: '', finalGirls: ['Melanie'], boxArt: terrorFromAboveArt, isVignette: true },
  
  // Season 2
  { id: 's2-into-the-void', name: 'Into the Void', season: 2, killer: 'Evomorph', location: 'USS Konrad', finalGirls: ['Jenette', 'Ellen'], boxArt: intoTheVoidArt },
  { id: 's2-panic-station-2891', name: 'Panic at Station 2891', season: 2, killer: 'The Organism', location: 'Station 2891', finalGirls: ['Kate', 'Uki'], boxArt: panicStation2891Art },
  { id: 's2-madness-in-dark', name: 'Madness in the Dark', season: 2, killer: 'Ratchet Lady', location: 'Wolfe Asylum', finalGirls: ['Heather', 'Veronica'], boxArt: madnessInDarkArt },
  { id: 's2-once-upon-full-moon', name: 'Once Upon a Full Moon', season: 2, killer: 'Big Bad Wolf', location: 'Storybook Woods', finalGirls: ['Gretel', 'Red'], boxArt: onceUponFullMoonArt },
  { id: 's2-knock-at-door', name: 'A Knock at the Door', season: 2, killer: 'The Intruders', location: 'Wingard Cottage', finalGirls: ['Ginny', 'Ava'], boxArt: knockAtTheDoorArt },
  { id: 's2-terror-from-grave', name: 'Terror From the Grave', season: 2, killer: 'Zombies', location: '', finalGirls: ['Patsy'], boxArt: terrorFromGraveArt, isVignette: true },
  
  // Season 3
  { id: 's3-falconwood-files', name: 'The Falconwood Files', season: 3, killer: 'Slayer', location: 'Falconwood', finalGirls: ['Octavia', 'Janelle'], boxArt: falconwoodFilesArt },
  { id: 's3-killer-from-tomorrow', name: 'The Killer from Tomorrow', season: 3, killer: 'The Hunter', location: 'Sunnydaze Mall', finalGirls: ['Kat', 'Tali'], boxArt: killerFromTomorrowArt },
  { id: 's3-hell-to-pay', name: 'Hell to Pay', season: 3, killer: 'Razorface', location: 'Hellscape', finalGirls: ['Kenzie', 'Julie'], boxArt: hellToPayArt },
  { id: 's3-marrek-murders', name: 'The Marrek Murders', season: 3, killer: 'The Tormentor', location: 'Marrek Warehouse', finalGirls: ['Mandy', 'Cassie'], boxArt: marrekMurdersArt },
  { id: 's3-dont-make-sound', name: "Don't Make a Sound", season: 3, killer: 'The Eyeless', location: 'Utopia', finalGirls: ['Meghan', 'Ronda'], boxArt: dontMakeASoundArt },
  { id: 's3-terror-from-destiny', name: 'Terror From Destiny', season: 3, killer: 'Destiny', location: '', finalGirls: ['Gabrielle'], boxArt: terrorFromDestinyArt, isVignette: true },
  
  // Season 4
  { id: 's4-shriek', name: 'Shriek', season: 4, killer: 'Mort the Teenage Dirtbag', location: 'MegaBGCon', finalGirls: ['Adrianne', 'Maureen'], boxArt: shriekArt },
  { id: 's4-demon-shadows', name: 'A Demon in the Shadows', season: 4, killer: 'TBD', location: 'TBD', finalGirls: ['TBD', 'TBD'] },
  { id: 's4-buddyland', name: 'Bad Times at Buddyland', season: 4, killer: 'TBD', location: 'TBD', finalGirls: ['TBD', 'TBD'] },
  { id: 's4-rotten-harvest', name: 'A Rotten Harvest', season: 4, killer: 'Grimlash', location: 'Shady Acres', finalGirls: ['Joy', 'Vicky'], boxArt: rottenHarvestArt },
  { id: 's4-green-terror', name: 'The Green Terror', season: 4, killer: 'TBD', location: 'TBD', finalGirls: ['TBD', 'TBD'] },
];

export const getOwnedContent = (ownedFilms: string[]) => {
  const owned = FEATURE_FILMS.filter(film => ownedFilms.includes(film.id));
  
  return {
    killers: [...new Set(owned.map(f => f.killer))],
    locations: [...new Set(owned.map(f => f.location))],
    finalGirls: [...new Set(owned.flatMap(f => f.finalGirls))],
  };
};

// Helper to find film ID by location name
export const getFilmIdByLocation = (locationName: string): string | null => {
  const film = FEATURE_FILMS.find(f => f.location === locationName);
  return film?.id ?? null;
};

// Helper to find film ID by killer name
export const getFilmIdByKiller = (killerName: string): string | null => {
  const film = FEATURE_FILMS.find(f => f.killer === killerName);
  return film?.id ?? null;
};

// Helper to find film ID by final girl name
export const getFilmIdByFinalGirl = (finalGirlName: string): string | null => {
  const film = FEATURE_FILMS.find(f => f.finalGirls.includes(finalGirlName));
  return film?.id ?? null;
};
