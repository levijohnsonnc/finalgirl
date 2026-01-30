import { useMemo } from 'react';
import { GameResult } from './useGameHistory';
import { getFinalGirlMaxHealth } from '@/data/finalGirlHealth';

export interface FinalGirlStats {
  name: string;
  plays: number;
  wins: number;
  winRate: number;
  avgHorror: number | null;
  topWeapon: string | null;
  topLocation: string | null;
}

export interface KillerStats {
  name: string;
  plays: number;
  wins: number;
  winRate: number;
  avgVictimsSaved: number | null;
  avgVictimsKilled: number | null;
  isNemesis: boolean;
}

export interface LocationStats {
  name: string;
  plays: number;
  wins: number;
  winRate: number;
  avgHorror: number | null;
  isMostChaotic: boolean;
}

export interface HighlightGame {
  game: GameResult;
  label: string;
  value: string;
}

export type PlayerArchetype = 'protector' | 'duelist' | 'survivor' | 'gambler' | 'newcomer';

export interface ComputedStats {
  // Record Jacket
  gamesPlayed: number;
  winRate: number;
  totalVictimsSaved: number;
  totalVictimsKilled: number;
  avgHorrorLevel: number | null;
  closestCall: { health: number; gameId: string; finalGirl: string } | null;
  signatureWeapon: { weapon: string; count: number } | null;
  
  // Trends
  gamesByPeriod: { date: string; wins: number; losses: number }[];
  horrorTrend: { date: string; avgHorror: number }[];
  streaks: { current: number; best: number; worst: number; currentType: 'win' | 'loss' | null };
  
  // Breakdowns
  byFinalGirl: FinalGirlStats[];
  byKiller: KillerStats[];
  byLocation: LocationStats[];
  
  // Highlights
  mostHeroicWin: HighlightGame | null;
  mostBrutalLoss: HighlightGame | null;
  clutchWin: HighlightGame | null;
  cleanWin: HighlightGame | null;
  nemesis: { killer: string; losses: number } | null;
  favoriteMatchup: { combo: string; count: number; finalGirl: string; killer: string } | null;
  
  // Archetype
  playerArchetype: PlayerArchetype;
  archetypeReason: string;
}

// Normalize weapon names for grouping
function normalizeWeapon(weapon: string | undefined): string | null {
  if (!weapon) return null;
  return weapon.toLowerCase().trim();
}

// Get display name for weapon (capitalize first letter of each word)
function displayWeapon(weapon: string): string {
  return weapon.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Count occurrences in an array
function countOccurrences<T>(arr: T[]): Map<T, number> {
  const counts = new Map<T, number>();
  arr.forEach(item => {
    counts.set(item, (counts.get(item) || 0) + 1);
  });
  return counts;
}

// Get most common item from array
function getMostCommon<T>(arr: T[]): { item: T; count: number } | null {
  const counts = countOccurrences(arr);
  let maxItem: T | null = null;
  let maxCount = 0;
  counts.forEach((count, item) => {
    if (count > maxCount) {
      maxCount = count;
      maxItem = item;
    }
  });
  return maxItem !== null ? { item: maxItem, count: maxCount } : null;
}

// Format date for grouping
function formatDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export const useGameStats = (
  gameHistory: GameResult[],
  timeFilter: 'all' | '30' | '10' = 'all'
): ComputedStats => {
  return useMemo(() => {
    // Apply time filter
    let filteredGames = [...gameHistory];
    if (timeFilter === '30') {
      filteredGames = filteredGames.slice(0, 30);
    } else if (timeFilter === '10') {
      filteredGames = filteredGames.slice(0, 10);
    }

    const wins = filteredGames.filter(g => g.outcome === 'won');
    const losses = filteredGames.filter(g => g.outcome === 'lost');
    const gamesPlayed = filteredGames.length;
    const winRate = gamesPlayed > 0 ? (wins.length / gamesPlayed) * 100 : 0;

    // Victims
    const totalVictimsSaved = filteredGames.reduce((sum, g) => sum + (g.victimsSaved || 0), 0);
    const totalVictimsKilled = filteredGames.reduce((sum, g) => sum + (g.victimsKilled || 0), 0);

    // Average Horror Level
    const gamesWithHorror = filteredGames.filter(g => g.finalHorrorLevel != null);
    const avgHorrorLevel = gamesWithHorror.length > 0
      ? gamesWithHorror.reduce((sum, g) => sum + (g.finalHorrorLevel || 0), 0) / gamesWithHorror.length
      : null;

    // Closest Call (lowest FG health in a win)
    const winsWithHealth = wins.filter(g => g.finalGirlHealth != null && g.finalGirlHealth > 0);
    const closestCall = winsWithHealth.length > 0
      ? winsWithHealth.reduce((min, g) => 
          (g.finalGirlHealth! < min.health) 
            ? { health: g.finalGirlHealth!, gameId: g.id, finalGirl: g.finalGirl }
            : min,
          { health: Infinity, gameId: '', finalGirl: '' }
        )
      : null;

    // Signature Weapon
    const weapons = filteredGames
      .map(g => normalizeWeapon(g.weaponUsed))
      .filter((w): w is string => w !== null);
    const mostCommonWeapon = getMostCommon(weapons);
    const signatureWeapon = mostCommonWeapon 
      ? { weapon: displayWeapon(mostCommonWeapon.item), count: mostCommonWeapon.count }
      : null;

    // Games by Period (for trends)
    const gamesByMonth = new Map<string, { wins: number; losses: number }>();
    filteredGames.forEach(g => {
      const key = formatDateKey(g.timestamp);
      const existing = gamesByMonth.get(key) || { wins: 0, losses: 0 };
      if (g.outcome === 'won') {
        existing.wins++;
      } else {
        existing.losses++;
      }
      gamesByMonth.set(key, existing);
    });
    const gamesByPeriod = Array.from(gamesByMonth.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Horror Trend
    const horrorByMonth = new Map<string, { total: number; count: number }>();
    gamesWithHorror.forEach(g => {
      const key = formatDateKey(g.timestamp);
      const existing = horrorByMonth.get(key) || { total: 0, count: 0 };
      existing.total += g.finalHorrorLevel || 0;
      existing.count++;
      horrorByMonth.set(key, existing);
    });
    const horrorTrend = Array.from(horrorByMonth.entries())
      .map(([date, data]) => ({ date, avgHorror: data.total / data.count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Streaks
    let currentStreak = 0;
    let currentType: 'win' | 'loss' | null = null;
    let bestWinStreak = 0;
    let worstLossStreak = 0;
    let tempWinStreak = 0;
    let tempLossStreak = 0;

    // Process games in chronological order for streaks
    const chronologicalGames = [...filteredGames].reverse();
    chronologicalGames.forEach((g, i) => {
      if (g.outcome === 'won') {
        tempWinStreak++;
        tempLossStreak = 0;
        bestWinStreak = Math.max(bestWinStreak, tempWinStreak);
      } else {
        tempLossStreak++;
        tempWinStreak = 0;
        worstLossStreak = Math.max(worstLossStreak, tempLossStreak);
      }
    });

    // Current streak (from most recent)
    if (filteredGames.length > 0) {
      currentType = filteredGames[0].outcome === 'won' ? 'win' : 'loss';
      currentStreak = 1;
      for (let i = 1; i < filteredGames.length; i++) {
        if (filteredGames[i].outcome === filteredGames[0].outcome) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    const streaks = {
      current: currentStreak,
      best: bestWinStreak,
      worst: worstLossStreak,
      currentType
    };

    // By Final Girl
    const finalGirlMap = new Map<string, GameResult[]>();
    filteredGames.forEach(g => {
      const games = finalGirlMap.get(g.finalGirl) || [];
      games.push(g);
      finalGirlMap.set(g.finalGirl, games);
    });
    const byFinalGirl: FinalGirlStats[] = Array.from(finalGirlMap.entries()).map(([name, games]) => {
      const fgWins = games.filter(g => g.outcome === 'won');
      const gamesWithHorror = games.filter(g => g.finalHorrorLevel != null);
      const weapons = games.map(g => normalizeWeapon(g.weaponUsed)).filter((w): w is string => w !== null);
      const locations = games.map(g => g.location);
      
      return {
        name,
        plays: games.length,
        wins: fgWins.length,
        winRate: (fgWins.length / games.length) * 100,
        avgHorror: gamesWithHorror.length > 0
          ? gamesWithHorror.reduce((sum, g) => sum + (g.finalHorrorLevel || 0), 0) / gamesWithHorror.length
          : null,
        topWeapon: getMostCommon(weapons)?.item ? displayWeapon(getMostCommon(weapons)!.item) : null,
        topLocation: getMostCommon(locations)?.item || null
      };
    }).sort((a, b) => b.plays - a.plays);

    // By Killer
    const killerMap = new Map<string, GameResult[]>();
    filteredGames.forEach(g => {
      const games = killerMap.get(g.killer) || [];
      games.push(g);
      killerMap.set(g.killer, games);
    });
    
    // Find nemesis (most losses to)
    let nemesisKiller: string | null = null;
    let nemesisLosses = 0;
    killerMap.forEach((games, killer) => {
      const killerLosses = games.filter(g => g.outcome === 'lost').length;
      if (killerLosses > nemesisLosses) {
        nemesisLosses = killerLosses;
        nemesisKiller = killer;
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
        isNemesis: name === nemesisKiller
      };
    }).sort((a, b) => b.plays - a.plays);

    // By Location
    const locationMap = new Map<string, GameResult[]>();
    filteredGames.forEach(g => {
      const games = locationMap.get(g.location) || [];
      games.push(g);
      locationMap.set(g.location, games);
    });

    // Find most chaotic (highest avg horror)
    let mostChaoticLocation: string | null = null;
    let highestAvgHorror = 0;
    locationMap.forEach((games, location) => {
      const gamesWithHorror = games.filter(g => g.finalHorrorLevel != null);
      if (gamesWithHorror.length > 0) {
        const avgHorror = gamesWithHorror.reduce((sum, g) => sum + (g.finalHorrorLevel || 0), 0) / gamesWithHorror.length;
        if (avgHorror > highestAvgHorror) {
          highestAvgHorror = avgHorror;
          mostChaoticLocation = location;
        }
      }
    });

    const byLocation: LocationStats[] = Array.from(locationMap.entries()).map(([name, games]) => {
      const lWins = games.filter(g => g.outcome === 'won');
      const gamesWithHorror = games.filter(g => g.finalHorrorLevel != null);
      
      return {
        name,
        plays: games.length,
        wins: lWins.length,
        winRate: (lWins.length / games.length) * 100,
        avgHorror: gamesWithHorror.length > 0
          ? gamesWithHorror.reduce((sum, g) => sum + (g.finalHorrorLevel || 0), 0) / gamesWithHorror.length
          : null,
        isMostChaotic: name === mostChaoticLocation
      };
    }).sort((a, b) => b.plays - a.plays);

    // Highlights
    // Most Heroic Win (most victims saved in a win)
    const winsWithVictims = wins.filter(g => g.victimsSaved != null);
    const mostHeroicWin = winsWithVictims.length > 0
      ? winsWithVictims.reduce((best, g) => 
          (g.victimsSaved! > (best?.victimsSaved || 0)) ? g : best,
          null as GameResult | null
        )
      : null;

    // Most Brutal Loss (highest horror or most victims killed)
    const lossesWithData = losses.filter(g => g.victimsKilled != null || g.finalHorrorLevel != null);
    const mostBrutalLoss = lossesWithData.length > 0
      ? lossesWithData.reduce((worst, g) => {
          const gScore = (g.victimsKilled || 0) + (g.finalHorrorLevel || 0);
          const worstScore = (worst?.victimsKilled || 0) + (worst?.finalHorrorLevel || 0);
          return gScore > worstScore ? g : worst;
        }, null as GameResult | null)
      : null;

    // Clutch Win (won with 1 HP remaining or at max horror)
    // With 5-6 HP characters, 1 HP is truly clutch
    const clutchWinGame = wins.find(g => 
      (g.finalGirlHealth != null && g.finalGirlHealth <= 1) ||
      (g.finalHorrorLevel === 7)
    ) || null;

    // Clean Win (low horror + full or near-full health relative to character max)
    const cleanWinGame = wins.find(g => {
      if (g.finalHorrorLevel == null || g.finalHorrorLevel > 2) return false;
      if (g.finalGirlHealth == null) return false;
      const maxHealth = getFinalGirlMaxHealth(g.finalGirl);
      // Clean win = at least 80% health remaining (5+ for 6HP chars, 4+ for 5HP chars)
      return g.finalGirlHealth >= Math.ceil(maxHealth * 0.8);
    }) || null;

    // Favorite Matchup (most played combo)
    const matchups = filteredGames.map(g => `${g.finalGirl} vs ${g.killer}`);
    const mostPlayedMatchup = getMostCommon(matchups);
    const favoriteMatchup = mostPlayedMatchup && mostPlayedMatchup.count >= 2
      ? {
          combo: mostPlayedMatchup.item,
          count: mostPlayedMatchup.count,
          finalGirl: mostPlayedMatchup.item.split(' vs ')[0],
          killer: mostPlayedMatchup.item.split(' vs ')[1]
        }
      : null;

    // Player Archetype
    let playerArchetype: PlayerArchetype = 'newcomer';
    let archetypeReason = 'Play more games to discover your style';

    if (gamesPlayed >= 5) {
      const avgVictimsSavedPerGame = gamesPlayed > 0 ? totalVictimsSaved / gamesPlayed : 0;
      // Low health wins: 2 HP or less out of 5-6 max is critical
      const lowHealthWins = wins.filter(g => g.finalGirlHealth != null && g.finalGirlHealth <= 2).length;
      const highHorrorGames = filteredGames.filter(g => g.finalHorrorLevel != null && g.finalHorrorLevel >= 5).length;
      
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
      } else if (winRate >= 60 && avgHorrorLevel !== null && avgHorrorLevel <= 4) {
        playerArchetype = 'duelist';
        archetypeReason = 'You keep cool under pressure and dispatch killers efficiently';
      }
    }

    return {
      gamesPlayed,
      winRate,
      totalVictimsSaved,
      totalVictimsKilled,
      avgHorrorLevel,
      closestCall: closestCall?.health !== Infinity ? closestCall : null,
      signatureWeapon,
      gamesByPeriod,
      horrorTrend,
      streaks,
      byFinalGirl,
      byKiller,
      byLocation,
      mostHeroicWin: mostHeroicWin ? { 
        game: mostHeroicWin, 
        label: 'Most Heroic', 
        value: `${mostHeroicWin.victimsSaved} saved` 
      } : null,
      mostBrutalLoss: mostBrutalLoss ? { 
        game: mostBrutalLoss, 
        label: 'Most Brutal', 
        value: `Horror ${mostBrutalLoss.finalHorrorLevel || '?'}` 
      } : null,
      clutchWin: clutchWinGame ? { 
        game: clutchWinGame, 
        label: 'Clutch Win', 
        value: clutchWinGame.finalGirlHealth ? `${clutchWinGame.finalGirlHealth} HP` : 'Max Horror' 
      } : null,
      cleanWin: cleanWinGame ? { 
        game: cleanWinGame, 
        label: 'Clean Win', 
        value: `${cleanWinGame.finalGirlHealth} HP, Horror ${cleanWinGame.finalHorrorLevel}` 
      } : null,
      nemesis: nemesisKiller && nemesisLosses >= 2 ? { killer: nemesisKiller, losses: nemesisLosses } : null,
      favoriteMatchup,
      playerArchetype,
      archetypeReason
    };
  }, [gameHistory, timeFilter]);
};
