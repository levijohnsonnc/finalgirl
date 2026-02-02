import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface GameResult {
  id: string;
  timestamp: number;
  outcome: 'won' | 'lost';
  killer: string;
  location: string;
  finalGirl: string;
  setupScenario?: string | null;
  startingEvent?: string | null;
  // Extended fields for game details
  introStory?: string;
  endingNarration?: string;
  gameHighlights?: string;
  finalHorrorLevel?: number; // 1-7
  finalGirlHealth?: number;
  killerHealth?: number;
  weaponUsed?: string;
  endingSubLocation?: string;
  victimsSaved?: number;
  victimsKilled?: number;
  posterImageUrl?: string;
  sceneImageUrl?: string;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  byFinalGirl: Record<string, { wins: number; losses: number }>;
  byKiller: Record<string, { wins: number; losses: number }>;
  byLocation: Record<string, { wins: number; losses: number }>;
}

// Convert GameResult to database row format
const toDbRow = (result: GameResult, userId: string) => ({
  id: result.id,
  user_id: userId,
  timestamp: result.timestamp,
  outcome: result.outcome,
  killer: result.killer,
  location: result.location,
  final_girl: result.finalGirl,
  setup_scenario: result.setupScenario ?? null,
  starting_event: result.startingEvent ?? null,
  intro_story: result.introStory ?? null,
  ending_narration: result.endingNarration ?? null,
  game_highlights: result.gameHighlights ?? null,
  final_horror_level: result.finalHorrorLevel ?? null,
  final_girl_health: result.finalGirlHealth ?? null,
  killer_health: result.killerHealth ?? null,
  weapon_used: result.weaponUsed ?? null,
  ending_sub_location: result.endingSubLocation ?? null,
  victims_saved: result.victimsSaved ?? null,
  victims_killed: result.victimsKilled ?? null,
  poster_image_url: result.posterImageUrl ?? null,
  scene_image_url: result.sceneImageUrl ?? null,
});

// Convert snake_case from database to camelCase
const fromDbRow = (row: Record<string, unknown>): GameResult => ({
  id: row.id as string,
  timestamp: row.timestamp as number,
  outcome: row.outcome as 'won' | 'lost',
  killer: row.killer as string,
  location: row.location as string,
  finalGirl: row.final_girl as string,
  setupScenario: row.setup_scenario as string | null,
  startingEvent: row.starting_event as string | null,
  introStory: (row.intro_story as string) || undefined,
  endingNarration: (row.ending_narration as string) || undefined,
  gameHighlights: (row.game_highlights as string) || undefined,
  finalHorrorLevel: (row.final_horror_level as number) || undefined,
  finalGirlHealth: (row.final_girl_health as number) || undefined,
  killerHealth: (row.killer_health as number) || undefined,
  weaponUsed: (row.weapon_used as string) || undefined,
  endingSubLocation: (row.ending_sub_location as string) || undefined,
  victimsSaved: (row.victims_saved as number) || undefined,
  victimsKilled: (row.victims_killed as number) || undefined,
  posterImageUrl: (row.poster_image_url as string) || undefined,
  sceneImageUrl: (row.scene_image_url as string) || undefined,
});

export const useGameHistory = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [localGameHistory, setLocalGameHistory] = useLocalStorage<GameResult[]>('final-girl-game-history', []);
  const [dbGameHistory, setDbGameHistory] = useState<GameResult[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);

  // Determine which history to use
  const gameHistory = user ? dbGameHistory : localGameHistory;

  // Fetch from database when authenticated
  useEffect(() => {
    if (!user || authLoading) return;

    const fetchFromDb = async () => {
      setIsDbLoading(true);
      try {
        const { data, error } = await supabase
          .from('game_history')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Error fetching game history:', error);
          return;
        }

        if (data) {
          setDbGameHistory(data.map(row => fromDbRow(row as Record<string, unknown>)));
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
    if (localGameHistory.length === 0) return;
    if (dbGameHistory.length > 0) return; // Already has data in DB

    const migrateData = async () => {
      setHasMigrated(true);
      
      try {
        // Upload all local games to database
        const records = localGameHistory.map(game => toDbRow(game, user.id));

        const { error } = await supabase
          .from('game_history')
          .insert(records);

        if (error) {
          console.error('Error migrating game history:', error);
          return;
        }

        // Clear localStorage after successful migration
        setLocalGameHistory([]);
        
        // Refresh from database
        const { data } = await supabase
          .from('game_history')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });

        if (data) {
          setDbGameHistory(data.map(row => fromDbRow(row as Record<string, unknown>)));
        }
      } catch (err) {
        console.error('Migration error:', err);
      }
    };

    migrateData();
  }, [user, authLoading, localGameHistory, dbGameHistory, hasMigrated, isDbLoading, setLocalGameHistory]);

  // recordGame returns synchronously but may do async work in background
  const recordGame = useCallback((result: Omit<GameResult, 'id' | 'timestamp'>): GameResult => {
    const newResult: GameResult = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    if (user) {
      // Optimistically update local state
      setDbGameHistory(prev => [newResult, ...prev]);
      
      // Save to database in background
      supabase
        .from('game_history')
        .insert(toDbRow(newResult, user.id))
        .then(({ error }) => {
          if (error) {
            console.error('Error recording game:', error);
            // Rollback on error
            setDbGameHistory(prev => prev.filter(g => g.id !== newResult.id));
          }
        });
    } else {
      // Save to localStorage
      setLocalGameHistory(prev => [newResult, ...prev]);
    }
    
    return newResult;
  }, [user, setLocalGameHistory]);

  const updateGame = useCallback((id: string, updates: Partial<GameResult>) => {
    if (user) {
      // Optimistically update local state
      setDbGameHistory(prev => 
        prev.map(game => 
          game.id === id ? { ...game, ...updates } : game
        )
      );
      
      // Build update object for database
      const dbUpdates: Record<string, unknown> = {};
      if (updates.introStory !== undefined) dbUpdates.intro_story = updates.introStory;
      if (updates.endingNarration !== undefined) dbUpdates.ending_narration = updates.endingNarration;
      if (updates.gameHighlights !== undefined) dbUpdates.game_highlights = updates.gameHighlights;
      if (updates.finalHorrorLevel !== undefined) dbUpdates.final_horror_level = updates.finalHorrorLevel;
      if (updates.finalGirlHealth !== undefined) dbUpdates.final_girl_health = updates.finalGirlHealth;
      if (updates.killerHealth !== undefined) dbUpdates.killer_health = updates.killerHealth;
      if (updates.weaponUsed !== undefined) dbUpdates.weapon_used = updates.weaponUsed;
      if (updates.endingSubLocation !== undefined) dbUpdates.ending_sub_location = updates.endingSubLocation;
      if (updates.victimsSaved !== undefined) dbUpdates.victims_saved = updates.victimsSaved;
      if (updates.victimsKilled !== undefined) dbUpdates.victims_killed = updates.victimsKilled;
      if (updates.posterImageUrl !== undefined) dbUpdates.poster_image_url = updates.posterImageUrl;
      if (updates.sceneImageUrl !== undefined) dbUpdates.scene_image_url = updates.sceneImageUrl;

      // Update database in background
      supabase
        .from('game_history')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating game:', error);
          }
        });
    } else {
      setLocalGameHistory(prev => 
        prev.map(game => 
          game.id === id ? { ...game, ...updates } : game
        )
      );
    }
  }, [user, setLocalGameHistory]);

  const getStats = useCallback((): GameStats => {
    const history = gameHistory;
    const wins = history.filter(g => g.outcome === 'won').length;
    const losses = history.filter(g => g.outcome === 'lost').length;
    const totalGames = history.length;

    const byFinalGirl: Record<string, { wins: number; losses: number }> = {};
    const byKiller: Record<string, { wins: number; losses: number }> = {};
    const byLocation: Record<string, { wins: number; losses: number }> = {};

    history.forEach(game => {
      // Final Girl stats
      if (!byFinalGirl[game.finalGirl]) {
        byFinalGirl[game.finalGirl] = { wins: 0, losses: 0 };
      }
      if (game.outcome === 'won') {
        byFinalGirl[game.finalGirl].wins++;
      } else {
        byFinalGirl[game.finalGirl].losses++;
      }

      // Killer stats
      if (!byKiller[game.killer]) {
        byKiller[game.killer] = { wins: 0, losses: 0 };
      }
      if (game.outcome === 'won') {
        byKiller[game.killer].wins++;
      } else {
        byKiller[game.killer].losses++;
      }

      // Location stats
      if (!byLocation[game.location]) {
        byLocation[game.location] = { wins: 0, losses: 0 };
      }
      if (game.outcome === 'won') {
        byLocation[game.location].wins++;
      } else {
        byLocation[game.location].losses++;
      }
    });

    return {
      totalGames,
      wins,
      losses,
      winRate: totalGames > 0 ? (wins / totalGames) * 100 : 0,
      byFinalGirl,
      byKiller,
      byLocation,
    };
  }, [gameHistory]);

  const deleteGame = useCallback((id: string) => {
    if (user) {
      // Optimistically update
      setDbGameHistory(prev => prev.filter(game => game.id !== id));
      
      // Delete from database in background
      supabase
        .from('game_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error deleting game:', error);
          }
        });
    } else {
      setLocalGameHistory(prev => prev.filter(game => game.id !== id));
    }
  }, [user, setLocalGameHistory]);

  const clearHistory = useCallback(() => {
    if (user) {
      // Optimistically clear
      setDbGameHistory([]);
      
      // Delete all from database in background
      supabase
        .from('game_history')
        .delete()
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error clearing history:', error);
          }
        });
    } else {
      setLocalGameHistory([]);
    }
  }, [user, setLocalGameHistory]);

  return {
    gameHistory,
    recordGame,
    updateGame,
    deleteGame,
    getStats,
    clearHistory,
    isLoading: authLoading || isDbLoading,
  };
};
