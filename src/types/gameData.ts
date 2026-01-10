export interface FeatureFilm {
  id: string;
  name: string;
  season: number;
  killer: string;
  location: string;
  finalGirls: [string, string];
  boxArt?: string;
}

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
  { id: 's1-camp-happy-trails', name: 'The Happy Trails Horror', season: 1, killer: 'Hans', location: 'Camp Happy Trails', finalGirls: ['Laurie', 'Reiko'], boxArt: '/box-art/happy-trails-horror.png' },
  { id: 's1-creech-manor', name: 'The Haunting of Creech Manor', season: 1, killer: 'Poltergeist', location: 'Creech Manor', finalGirls: ['Alice', 'Selena'], boxArt: '/box-art/haunting-creech-manor.png' },
  { id: 's1-sacred-groves', name: 'Slaughter in the Groves', season: 1, killer: 'Inkanyamba', location: 'Sacred Groves', finalGirls: ['Barbara', 'Sheila'], boxArt: '/box-art/slaughter-groves.png' },
  { id: 's1-carnival-of-blood', name: 'Carnage at the Carnival', season: 1, killer: 'Geppetto', location: 'Carnival of Blood', finalGirls: ['Asami', 'Charlie'], boxArt: '/box-art/carnage-carnival.png' },
  { id: 's1-maple-lane', name: 'Frightmare on Maple Lane', season: 1, killer: 'Dr. Fright', location: 'Maple Lane', finalGirls: ['Nancy', 'Diana'], boxArt: '/box-art/frightmare-maple-lane.png' },
  
  // Season 2
  { id: 's2-uss-konrad', name: 'USS Konrad', season: 2, killer: 'Evomorph', location: 'USS Konrad', finalGirls: ['Jenette', 'Ellen'] },
  { id: 's2-station-2891', name: 'Station 2891', season: 2, killer: 'Organism', location: 'Station 2891', finalGirls: ['Kate', 'Umi'] },
  { id: 's2-wolfe-asylum', name: 'Wolfe Asylum', season: 2, killer: 'Ratchet Lady', location: 'Wolfe Asylum', finalGirls: ['Heather', 'Veronica'] },
  { id: 's2-storybook-woods', name: 'Storybook Woods', season: 2, killer: 'Big Bad Wolf', location: 'Storybook Woods', finalGirls: ['Gretel', 'Red'] },
  { id: 's2-wingard-cottage', name: 'Wingard Cottage', season: 2, killer: 'Intruders', location: 'Wingard Cottage', finalGirls: ['Ginny', 'Ava'] },
  
  // Season 3
  { id: 's3-falconwood', name: 'Falconwood', season: 3, killer: 'Butcher', location: 'Falconwood', finalGirls: ['Sookie', 'Tanya'] },
  { id: 's3-sunnydaze-mall', name: 'Sunnydaze Mall', season: 3, killer: 'Toymaker', location: 'Sunnydaze Mall', finalGirls: ['Trish', 'Clementine'] },
  { id: 's3-hellscape', name: 'Hellscape', season: 3, killer: 'Hellview Killers', location: 'Hellscape', finalGirls: ['Kenzie', 'Julie'] },
  { id: 's3-marrek-warehouse', name: 'Marrek Warehouse', season: 3, killer: 'Terminus', location: 'Marrek Warehouse', finalGirls: ['Jada', 'Gia'] },
  { id: 's3-utopia', name: 'Utopia', season: 3, killer: 'Ancient', location: 'Utopia', finalGirls: ['Agnes', 'Constance'] },
  
  // Season 4
  { id: 's4-the-last-stop', name: 'The Last Stop', season: 4, killer: 'The Hitchhiker', location: 'The Last Stop', finalGirls: ['Sasha', 'Mindy'] },
  { id: 's4-dead-by-dawn', name: 'Dead by Dawn', season: 4, killer: 'The Deadite', location: 'Dead by Dawn', finalGirls: ['Ashlee', 'Linda'] },
  { id: 's4-north-pole-nightmare', name: 'North Pole Nightmare', season: 4, killer: 'Krampus', location: 'North Pole', finalGirls: ['Cindy', 'Holly'] },
  { id: 's4-blood-moon-bay', name: 'Blood Moon Bay', season: 4, killer: 'The Siren', location: 'Blood Moon Bay', finalGirls: ['Marina', 'Coral'] },
  { id: 's4-haunted-heights', name: 'Haunted Heights', season: 4, killer: 'The Specter', location: 'Haunted Heights', finalGirls: ['Victoria', 'Madeline'] },
];

export const getOwnedContent = (ownedFilms: string[]) => {
  const owned = FEATURE_FILMS.filter(film => ownedFilms.includes(film.id));
  
  return {
    killers: [...new Set(owned.map(f => f.killer))],
    locations: [...new Set(owned.map(f => f.location))],
    finalGirls: [...new Set(owned.flatMap(f => f.finalGirls))],
  };
};
