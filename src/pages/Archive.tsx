import { ArrowLeft } from 'lucide-react';
import { FilmToggle } from '@/components/FilmToggle';
import { FEATURE_FILMS } from '@/types/gameData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ArchiveProps {
  onBack?: () => void;
}

const Archive = ({ onBack }: ArchiveProps) => {
  const [ownedFilms, setOwnedFilms] = useLocalStorage<string[]>('final-girl-owned-films', []);

  // Group films by season - no memoization needed, FEATURE_FILMS is static
  const filmsBySeason = FEATURE_FILMS.reduce((acc, film) => {
    if (!acc[film.season]) acc[film.season] = [];
    acc[film.season].push(film);
    return acc;
  }, {} as Record<number, typeof FEATURE_FILMS>);

  const handleToggleFilm = (filmId: string) => {
    setOwnedFilms(prev => 
      prev.includes(filmId)
        ? prev.filter(id => id !== filmId)
        : [...prev, filmId]
    );
  };

  // Seasons that are in development (show "In Development" badge)
  const inDevelopmentSeasons = [2, 3, 4];
  
  // Films that have been fully configured and are available despite being in development seasons
  const availableFilmIds = [
    // Season 1 - all available
    's1-camp-happy-trails', 's1-creech-manor', 's1-sacred-groves', 's1-carnival-of-blood', 's1-maple-lane',
    // Season 2 - Into the Void, Madness in the Dark
    's2-into-the-void',
    's2-madness-in-dark',
    // Season 3 - The Killer from Tomorrow
    's3-killer-from-tomorrow',
    // Season 4 - A Rotten Harvest
    's4-rotten-harvest',
  ];

  return (
    <div className="space-y-8">
      {/* Back Button - positioned to align with content */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-vhs text-sm text-primary hover:text-primary/80 transition-colors mt-4 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="underline underline-offset-2">Back</span>
        </button>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-5xl text-primary blood-glow tracking-wider">
          MY COLLECTION
        </h1>
        <p className="font-vhs text-muted-foreground">
          MANAGE YOUR COLLECTION • CONFIGURE SETTINGS
        </p>
      </div>


      {/* Feature Films by Season */}
      {Object.entries(filmsBySeason).map(([season, films]) => {
        const seasonNum = parseInt(season);
        const isInDevelopment = inDevelopmentSeasons.includes(seasonNum);
        
        return (
          <div key={season} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="flex items-center gap-3">
                <h2 className="font-title text-2xl text-foreground px-4">
                  SEASON {season}
                </h2>
                {isInDevelopment && (
                  <span className="font-vhs text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded uppercase tracking-wider">
                    In Development
                  </span>
                )}
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {films.map(film => {
                const isAvailable = availableFilmIds.includes(film.id);
                return (
                  <div 
                    key={film.id} 
                    className={!isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''}
                  >
                    <FilmToggle
                      film={film}
                      isOwned={ownedFilms.includes(film.id)}
                      onToggle={handleToggleFilm}
                      disabled={!isAvailable}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Archive;
