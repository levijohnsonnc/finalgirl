import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { supabase } from '@/integrations/supabase/client';

interface UseOwnedFilmsReturn {
  ownedFilms: string[];
  setOwnedFilms: (updater: (prev: string[]) => string[]) => void;
  isLoading: boolean;
}

export const useOwnedFilms = (): UseOwnedFilmsReturn => {
  const { user, isLoading: authLoading } = useAuth();
  const [localOwnedFilms, setLocalOwnedFilms] = useLocalStorage<string[]>('final-girl-owned-films', []);
  const [dbOwnedFilms, setDbOwnedFilms] = useState<string[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);

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

  // Return appropriate data based on auth state
  const ownedFilms = user ? dbOwnedFilms : localOwnedFilms;
  const isLoading = authLoading || (user ? isDbLoading : false);

  return {
    ownedFilms,
    setOwnedFilms,
    isLoading,
  };
};
