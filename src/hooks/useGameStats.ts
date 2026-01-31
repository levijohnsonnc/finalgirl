import { useMemo } from 'react';
import { GameResult } from './useGameHistory';

export interface FinalGirlStats {
  name: string;
  plays: number;
  wins: number;
  winRate: number;
  totalSaved: number;
  totalKilled: number;
}

export interface KillerStats {
  name: string;
  plays: number;
  wins: number;
  winRate: number;
  avgVictimsSaved: number | null;
  avgVictimsKilled: number | null;
}

export interface LocationStats {
  name: string;
  plays: number;
  wins: number;
  winRate: number;
  totalSaved: number;
  totalKilled: number;
}

export type PlayerArchetype = 'protector' | 'duelist' | 'survivor' | 'gambler' | 'newcomer';

export interface ComputedStats {
  // Record Jacket
  gamesPlayed: number;
  winRate: number;
  totalVictimsSaved: number;
  totalVictimsKilled: number;
  
  // Trends
  totalWins: number;
  totalLosses: number;
  victimsTrend: { date: string; saved: number; killed: number }[];
  
  // Narrative Stats
  nemesis: { killer: string; losses: number } | null;
  usualSuspect: { killer: string; wins: number } | null;
  cursedSite: { location: string; losses: number } | null;
  homeTurf: { location: string; wins: number } | null;
  
  // Breakdowns
  byFinalGirl: FinalGirlStats[];
  byKiller: KillerStats[];
  byLocation: LocationStats[];
  
  // Archetype
  playerArchetype: PlayerArchetype;
  archetypeReason: string;
}

// Format date for grouping
function formatDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export const useGameStats = (gameHistory: GameResult[]): ComputedStats => {
  return useMemo(() => {
    const filteredGames = [...gameHistory];

    const wins = filteredGames.filter(g => g.outcome === 'won');
    const losses = filteredGames.filter(g => g.outcome === 'lost');
    const gamesPlayed = filteredGames.length;
    const winRate = gamesPlayed > 0 ? (wins.length / gamesPlayed) * 100 : 0;

    // Victims
    const totalVictimsSaved = filteredGames.reduce((sum, g) => sum + (g.victimsSaved || 0), 0);
    const totalVictimsKilled = filteredGames.reduce((sum, g) => sum + (g.victimsKilled || 0), 0);

    // Victims Trend (by month)
    const victimsByMonth = new Map<string, { saved: number; killed: number }>();
    filteredGames.forEach(g => {
      const key = formatDateKey(g.timestamp);
      const existing = victimsByMonth.get(key) || { saved: 0, killed: 0 };
      existing.saved += g.victimsSaved || 0;
      existing.killed += g.victimsKilled || 0;
      victimsByMonth.set(key, existing);
    });
    const victimsTrend = Array.from(victimsByMonth.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // By Killer - for nemesis and usual suspect
    const killerMap = new Map<string, GameResult[]>();
    filteredGames.forEach(g => {
      const games = killerMap.get(g.killer) || [];
      games.push(g);
      killerMap.set(g.killer, games);
    });
    
    // Find nemesis (killer with most wins against you - most losses)
    let nemesisKiller: string | null = null;
    let nemesisLosses = 0;
    // Find usual suspect (killer you've beaten most)
    let usualSuspectKiller: string | null = null;
    let usualSuspectWins = 0;
    
    killerMap.forEach((games, killer) => {
      const killerLosses = games.filter(g => g.outcome === 'lost').length;
      const killerWins = games.filter(g => g.outcome === 'won').length;
      if (killerLosses > nemesisLosses) {
        nemesisLosses = killerLosses;
        nemesisKiller = killer;
      }
      if (killerWins > usualSuspectWins) {
        usualSuspectWins = killerWins;
        usualSuspectKiller = killer;
      }
    });

    const byKiller: KillerStats[] = Array.from(killerMap.entries()).map(([name, games]) => {
      const kWins = games.filter(g => g.outcome === 'won');
      const gamesWithVictims = games.filter(g => g.victimsSaved != null || g.victimsKilled != null);
      
      return {
        name,
        plays: games.length,
        wins: kWins.length,
        winRate: (kWins.length / games.length) * 100,
        avgVictimsSaved: gamesWithVictims.length > 0
          ? gamesWithVictims.reduce((sum, g) => sum + (g.victimsSaved || 0), 0) / gamesWithVictims.length
          : null,
        avgVictimsKilled: gamesWithVictims.length > 0
          ? gamesWithVictims.reduce((sum, g) => sum + (g.victimsKilled || 0), 0) / gamesWithVictims.length
          : null,
      };
    }).sort((a, b) => b.plays - a.plays);

    // By Location - for cursed site and home turf
    const locationMap = new Map<string, GameResult[]>();
    filteredGames.forEach(g => {
      const games = locationMap.get(g.location) || [];
      games.push(g);
      locationMap.set(g.location, games);
    });

    // Find cursed site (location with most losses)
    let cursedSiteLocation: string | null = null;
    let cursedSiteLosses = 0;
    // Find home turf (location with most wins)
    let homeTurfLocation: string | null = null;
    let homeTurfWins = 0;

    locationMap.forEach((games, location) => {
      const locationLosses = games.filter(g => g.outcome === 'lost').length;
      const locationWins = games.filter(g => g.outcome === 'won').length;
      if (locationLosses > cursedSiteLosses) {
        cursedSiteLosses = locationLosses;
        cursedSiteLocation = location;
      }
      if (locationWins > homeTurfWins) {
        homeTurfWins = locationWins;
        homeTurfLocation = location;
      }
    });

    const byLocation: LocationStats[] = Array.from(locationMap.entries()).map(([name, games]) => {
      const lWins = games.filter(g => g.outcome === 'won');
      
      return {
        name,
        plays: games.length,
        wins: lWins.length,
        winRate: (lWins.length / games.length) * 100,
        totalSaved: games.reduce((sum, g) => sum + (g.victimsSaved || 0), 0),
        totalKilled: games.reduce((sum, g) => sum + (g.victimsKilled || 0), 0),
      };
    }).sort((a, b) => b.plays - a.plays);

    // By Final Girl
    const finalGirlMap = new Map<string, GameResult[]>();
    filteredGames.forEach(g => {
      const games = finalGirlMap.get(g.finalGirl) || [];
      games.push(g);
      finalGirlMap.set(g.finalGirl, games);
    });
    const byFinalGirl: FinalGirlStats[] = Array.from(finalGirlMap.entries()).map(([name, games]) => {
      const fgWins = games.filter(g => g.outcome === 'won');
      
      return {
        name,
        plays: games.length,
        wins: fgWins.length,
        winRate: (fgWins.length / games.length) * 100,
        totalSaved: games.reduce((sum, g) => sum + (g.victimsSaved || 0), 0),
        totalKilled: games.reduce((sum, g) => sum + (g.victimsKilled || 0), 0),
      };
    }).sort((a, b) => b.plays - a.plays);

    // Player Archetype
    let playerArchetype: PlayerArchetype = 'newcomer';
    let archetypeReason = 'Play more games to discover your style';

    if (gamesPlayed >= 5) {
      const avgVictimsSavedPerGame = gamesPlayed > 0 ? totalVictimsSaved / gamesPlayed : 0;
      const gamesWithHorror = filteredGames.filter(g => g.finalHorrorLevel != null);
      // Low health wins: 2 HP or less out of 5-6 max is critical
      const lowHealthWins = wins.filter(g => g.finalGirlHealth != null && g.finalGirlHealth <= 2).length;
      
      // Calculate variance in horror levels
      const horrorLevels = gamesWithHorror.map(g => g.finalHorrorLevel || 0);
      const avgHorror = horrorLevels.length > 0 ? horrorLevels.reduce((a, b) => a + b, 0) / horrorLevels.length : 0;
      const variance = horrorLevels.length > 0
        ? horrorLevels.reduce((sum, h) => sum + Math.pow(h - avgHorror, 2), 0) / horrorLevels.length
        : 0;

      if (avgVictimsSavedPerGame >= 3) {
        playerArchetype = 'protector';
        archetypeReason = 'You prioritize saving victims above all else';
      } else if (lowHealthWins >= wins.length * 0.4 && wins.length >= 2) {
        playerArchetype = 'survivor';
        archetypeReason = 'You win against all odds, often by the skin of your teeth';
      } else if (variance >= 3) {
        playerArchetype = 'gambler';
        archetypeReason = 'Your games are unpredictable, swinging between calm and chaos';
      } else if (winRate >= 60 && avgHorror <= 4) {
        playerArchetype = 'duelist';
        archetypeReason = 'You keep cool under pressure and dispatch killers efficiently';
      }
    }

    return {
      gamesPlayed,
      winRate,
      totalVictimsSaved,
      totalVictimsKilled,
      totalWins: wins.length,
      totalLosses: losses.length,
      victimsTrend,
      nemesis: nemesisKiller && nemesisLosses >= 2 ? { killer: nemesisKiller, losses: nemesisLosses } : null,
      usualSuspect: usualSuspectKiller && usualSuspectWins >= 2 ? { killer: usualSuspectKiller, wins: usualSuspectWins } : null,
      cursedSite: cursedSiteLocation && cursedSiteLosses >= 2 ? { location: cursedSiteLocation, losses: cursedSiteLosses } : null,
      homeTurf: homeTurfLocation && homeTurfWins >= 2 ? { location: homeTurfLocation, wins: homeTurfWins } : null,
      byFinalGirl,
      byKiller,
      byLocation,
      playerArchetype,
      archetypeReason
    };
  }, [gameHistory]);
};
