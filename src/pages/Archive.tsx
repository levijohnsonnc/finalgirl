
import { FilmToggle } from '@/components/FilmToggle';
import { FEATURE_FILMS } from '@/types/gameData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Archive = () => {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-horror text-5xl text-primary blood-glow tracking-wider">
          THE ARCHIVE
        </h1>
        <p className="font-vhs text-muted-foreground">
          MANAGE YOUR COLLECTION • CONFIGURE SETTINGS
        </p>
      </div>


      {/* Feature Films by Season */}
      {Object.entries(filmsBySeason).map(([season, films]) => (
        <div key={season} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <h2 className="font-title text-2xl text-foreground px-4">
              SEASON {season}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {films.map(film => (
              <FilmToggle
                key={film.id}
                film={film}
                isOwned={ownedFilms.includes(film.id)}
                onToggle={handleToggleFilm}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Archive;
