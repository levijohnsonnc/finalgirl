import { useMemo } from 'react';
import { Film, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilmToggle } from '@/components/FilmToggle';
import { FEATURE_FILMS, getOwnedContent } from '@/types/gameData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Archive = () => {
  const [ownedFilms, setOwnedFilms] = useLocalStorage<string[]>('final-girl-owned-films', []);

  const filmsBySeason = useMemo(() => {
    return FEATURE_FILMS.reduce((acc, film) => {
      if (!acc[film.season]) acc[film.season] = [];
      acc[film.season].push(film);
      return acc;
    }, {} as Record<number, typeof FEATURE_FILMS>);
  }, []);

  const handleToggleFilm = (filmId: string) => {
    setOwnedFilms(prev => 
      prev.includes(filmId)
        ? prev.filter(id => id !== filmId)
        : [...prev, filmId]
    );
  };

  const handleSelectAll = () => {
    setOwnedFilms(FEATURE_FILMS.map(f => f.id));
  };

  const handleDeselectAll = () => {
    setOwnedFilms([]);
  };

  const ownedContent = getOwnedContent(ownedFilms);

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

      {/* Collection Stats */}
      <div className="glass-card p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <h2 className="font-title text-xl text-foreground">COLLECTION STATUS</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="vcr-button font-vhs text-xs"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              ALL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              className="vcr-button font-vhs text-xs"
            >
              NONE
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="vhs-label p-3 rounded">
            <div className="font-horror text-2xl text-primary">{ownedFilms.length}</div>
            <div className="font-vhs text-xs text-muted-foreground">FILMS</div>
          </div>
          <div className="vhs-label p-3 rounded">
            <div className="font-horror text-2xl text-primary">{ownedContent.killers.length}</div>
            <div className="font-vhs text-xs text-muted-foreground">KILLERS</div>
          </div>
          <div className="vhs-label p-3 rounded">
            <div className="font-horror text-2xl text-secondary">{ownedContent.locations.length}</div>
            <div className="font-vhs text-xs text-muted-foreground">LOCATIONS</div>
          </div>
          <div className="vhs-label p-3 rounded">
            <div className="font-horror text-2xl text-accent">{ownedContent.finalGirls.length}</div>
            <div className="font-vhs text-xs text-muted-foreground">FINAL GIRLS</div>
          </div>
        </div>
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
