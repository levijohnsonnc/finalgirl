import { useLocalStorage } from './useLocalStorage';

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

export const useGameHistory = () => {
  const [gameHistory, setGameHistory] = useLocalStorage<GameResult[]>('final-girl-game-history', []);

  const recordGame = (result: Omit<GameResult, 'id' | 'timestamp'>): GameResult => {
    const newResult: GameResult = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    setGameHistory(prev => [newResult, ...prev]);
    return newResult;
  };

  const updateGame = (id: string, updates: Partial<GameResult>) => {
    setGameHistory(prev => 
      prev.map(game => 
        game.id === id ? { ...game, ...updates } : game
      )
    );
  };

  const getStats = (): GameStats => {
    const wins = gameHistory.filter(g => g.outcome === 'won').length;
    const losses = gameHistory.filter(g => g.outcome === 'lost').length;
    const totalGames = gameHistory.length;

    const byFinalGirl: Record<string, { wins: number; losses: number }> = {};
    const byKiller: Record<string, { wins: number; losses: number }> = {};
    const byLocation: Record<string, { wins: number; losses: number }> = {};

    gameHistory.forEach(game => {
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
        byLocation[game.killer].losses++;
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
  };

  const clearHistory = () => {
    setGameHistory([]);
  };

  return {
    gameHistory,
    recordGame,
    updateGame,
    getStats,
    clearHistory,
  };
};
