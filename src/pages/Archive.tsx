import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FilmToggle } from '@/components/FilmToggle';
import { FEATURE_FILMS } from '@/types/gameData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Archive = () => {
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate(-1);
  };

  // Seasons that are in development
  const inDevelopmentSeasons = [2, 3, 4];

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 font-vhs text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

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
          <div key={season} className={`space-y-4 ${isInDevelopment ? 'opacity-50' : ''}`}>
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
            
            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${isInDevelopment ? 'pointer-events-none grayscale' : ''}`}>
              {films.map(film => (
                <FilmToggle
                  key={film.id}
                  film={film}
                  isOwned={ownedFilms.includes(film.id)}
                  onToggle={handleToggleFilm}
                  disabled={isInDevelopment}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Archive;
