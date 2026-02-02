import { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { FilmToggle } from '@/components/FilmToggle';
import { FEATURE_FILMS } from '@/types/gameData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useGameHistory } from '@/hooks/useGameHistory';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Archive = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [localOwnedFilms, setLocalOwnedFilms] = useLocalStorage<string[]>('final-girl-owned-films', []);
  const [dbOwnedFilms, setDbOwnedFilms] = useState<string[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);
  const { clearHistory } = useGameHistory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Determine which films to use
  const ownedFilms = user ? dbOwnedFilms : localOwnedFilms;

  // Fetch from database when authenticated
  useEffect(() => {
    if (!user || authLoading) return;

    const fetchFromDb = async () => {
      setIsDbLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('owned_films')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user settings:', error);
          return;
        }

        if (data?.owned_films) {
          setDbOwnedFilms(data.owned_films as string[]);
        }
      } finally {
        setIsDbLoading(false);
      }
    };

    fetchFromDb();
  }, [user, authLoading]);

  // Migrate localStorage data on first sign-in
  useEffect(() => {
    if (!user || authLoading || hasMigrated || isDbLoading) return;
    if (localOwnedFilms.length === 0) return;
    if (dbOwnedFilms.length > 0) return; // Already has data in DB

    const migrateData = async () => {
      setHasMigrated(true);
      
      try {
        // Upsert user settings
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            owned_films: localOwnedFilms,
          }, {
            onConflict: 'user_id',
          });

        if (error) {
          console.error('Error migrating user settings:', error);
          return;
        }

        // Clear localStorage after successful migration
        setLocalOwnedFilms([]);
        setDbOwnedFilms(localOwnedFilms);
      } catch (err) {
        console.error('Migration error:', err);
      }
    };

    migrateData();
  }, [user, authLoading, localOwnedFilms, dbOwnedFilms, hasMigrated, isDbLoading, setLocalOwnedFilms]);

  // Group films by season - no memoization needed, FEATURE_FILMS is static
  const filmsBySeason = FEATURE_FILMS.reduce((acc, film) => {
    if (!acc[film.season]) acc[film.season] = [];
    acc[film.season].push(film);
    return acc;
  }, {} as Record<number, typeof FEATURE_FILMS>);

  const setOwnedFilms = useCallback((updater: (prev: string[]) => string[]) => {
    if (user) {
      setDbOwnedFilms(prev => {
        const newFilms = updater(prev);
        
        // Save to database in background
        supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            owned_films: newFilms,
          }, {
            onConflict: 'user_id',
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error saving user settings:', error);
            }
          });
        
        return newFilms;
      });
    } else {
      setLocalOwnedFilms(updater);
    }
  }, [user, setLocalOwnedFilms]);

  const handleToggleFilm = (filmId: string) => {
    setOwnedFilms(prev => 
      prev.includes(filmId)
        ? prev.filter(id => id !== filmId)
        : [...prev, filmId]
    );
  };

  const handleResetPlays = () => {
    clearHistory();
    setIsDialogOpen(false);
  };

  // Seasons that are in development (show "In Development" badge)
  const inDevelopmentSeasons = [4];
  
  // Films that have been fully configured and are available despite being in development seasons
  const availableFilmIds = [
    // Season 1 - all available (including vignette)
    's1-camp-happy-trails', 's1-creech-manor', 's1-sacred-groves', 's1-carnival-of-blood', 's1-maple-lane',
    's1-terror-from-above',
    // Season 2 - all available (including vignette)
    's2-into-the-void',
    's2-madness-in-dark',
    's2-panic-station-2891',
    's2-once-upon-full-moon',
    's2-knock-at-door',
    's2-terror-from-grave',
    // Season 3 - all available (including vignette)
    's3-killer-from-tomorrow',
    's3-falconwood-files',
    's3-hell-to-pay',
    's3-marrek-murders',
    's3-dont-make-sound',
    's3-terror-from-destiny',
    // Season 4 - A Rotten Harvest
    's4-rotten-harvest',
  ];

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="text-center space-y-1 sm:space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary blood-glow tracking-wider">
          MY COLLECTION
        </h1>
        <p className="font-vhs text-xs sm:text-sm text-muted-foreground px-2">
          MANAGE YOUR COLLECTION • CONFIGURE SETTINGS
        </p>
      </div>

      {/* Reset Plays Button - Right aligned */}
      <div className="flex justify-end px-2">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-1.5 font-vhs text-[10px] sm:text-xs text-muted-foreground hover:text-primary transition-colors border border-muted-foreground/30 hover:border-primary/50 px-2 sm:px-3 py-1.5 rounded bg-muted/20 hover:bg-primary/10">
              <Trash2 className="w-3 h-3" />
              <span>RESET MY PLAYS</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background border-primary/30 max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-xl text-primary">
                Reset All Gameplay Data?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-vhs text-sm text-muted-foreground">
                This will permanently erase all of your game history, including wins, losses, stories, and posters. Your collection settings will remain unchanged.
                <span className="block mt-2 text-primary/80 font-bold">
                  This action cannot be undone.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="font-vhs text-xs bg-muted/50 border-muted-foreground/30 hover:bg-muted hover:text-foreground">
                BACK OUT
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleResetPlays}
                className="font-vhs text-xs bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
              >
                CONFIRM RESET
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Feature Films by Season */}
      {Object.entries(filmsBySeason).map(([season, films]) => {
        const seasonNum = parseInt(season);
        const isInDevelopment = inDevelopmentSeasons.includes(seasonNum);
        
        return (
          <div key={season} className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                <h2 className="font-title text-xl sm:text-2xl text-foreground px-2 sm:px-4">
                  SEASON {season}
                </h2>
                {isInDevelopment && (
                  <span className="font-vhs text-[10px] sm:text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 sm:py-1 rounded uppercase tracking-wider">
                    In Development
                  </span>
                )}
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
