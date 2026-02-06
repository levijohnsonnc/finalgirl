import { GameResult } from './useGameHistory';
import { getFinalGirlHealth } from '@/data/finalGirlHealth';
import { PlayerArchetype } from './useGameStats';

interface ArchetypeScore {
  archetype: PlayerArchetype;
  score: number;
  reason: string;
}

// --- Individual scoring functions (0–100) ---

function scoreProtector(
  totalSaved: number,
  totalKilled: number,
  gamesPlayed: number,
): ArchetypeScore {
  const totalVictims = totalSaved + totalKilled;
  const saveRatio = totalVictims > 0 ? totalSaved / totalVictims : 0;
  const avgSaved = gamesPlayed > 0 ? totalSaved / gamesPlayed : 0;

  // 60% weight on save ratio, 40% on raw volume (capped at 8 avg)
  const ratioComponent = saveRatio * 60;
  const volumeComponent = Math.min(avgSaved / 8, 1) * 40;
  const score = ratioComponent + volumeComponent;

  const pct = Math.round(saveRatio * 100);
  const reason =
    avgSaved >= 5
      ? `You average ${avgSaved.toFixed(1)} rescues per game — ${pct}% of all victims walk away alive.`
      : `${pct}% of victims survive your games, with ${avgSaved.toFixed(1)} saved per outing.`;

  return { archetype: 'protector', score, reason };
}

function scoreSurvivor(wins: GameResult[]): ArchetypeScore {
  if (wins.length === 0) {
    return { archetype: 'survivor', score: 0, reason: '' };
  }

  const clutchWins = wins.filter((g) => {
    if (g.finalGirlHealth == null) return false;
    const maxHP = getFinalGirlHealth(g.finalGirl);
    return g.finalGirlHealth / maxHP <= 0.33;
  });

  const clutchRatio = clutchWins.length / wins.length;
  const score = clutchRatio * 100;

  // Build flavorful reason
  const oneHPWins = clutchWins.filter((g) => g.finalGirlHealth === 1).length;
  let reason: string;
  if (oneHPWins >= 2) {
    reason = `You've clawed your way to victory at 1 HP ${oneHPWins} times — death can't keep up with you.`;
  } else if (clutchWins.length >= 2) {
    reason = `${clutchWins.length} of your ${wins.length} wins came at a sliver of health. You live on the edge.`;
  } else if (clutchWins.length === 1) {
    const g = clutchWins[0];
    reason = `${g.finalGirl} limped away with just ${g.finalGirlHealth} HP against ${g.killer}. A true survivor moment.`;
  } else {
    reason = 'You tend to finish fights with health to spare — not quite the near-death type.';
  }

  return { archetype: 'survivor', score, reason };
}

function scoreDuelist(
  winRate: number,
  wins: GameResult[],
): ArchetypeScore {
  // Win-rate component: maxes out at 80% win rate
  const winFactor = Math.min(winRate / 80, 1) * 50;

  // Control component: low horror on wins means tight play
  const winsWithHorror = wins.filter((g) => g.finalHorrorLevel != null);
  const avgHorrorOnWins =
    winsWithHorror.length > 0
      ? winsWithHorror.reduce((s, g) => s + (g.finalHorrorLevel || 0), 0) / winsWithHorror.length
      : 4; // neutral default
  const controlFactor = Math.max(0, 1 - avgHorrorOnWins / 7) * 50;

  const score = winFactor + controlFactor;

  const wrPct = Math.round(winRate);
  let reason: string;
  if (wrPct >= 70 && avgHorrorOnWins <= 2) {
    reason = `A ${wrPct}% win rate with an average horror of just ${avgHorrorOnWins.toFixed(1)} on wins. Clinical precision.`;
  } else if (wrPct >= 60) {
    reason = `${wrPct}% win rate while keeping horror at ${avgHorrorOnWins.toFixed(1)} — controlled and efficient.`;
  } else {
    reason = `You fight smart, maintaining horror at ${avgHorrorOnWins.toFixed(1)} when you win.`;
  }

  return { archetype: 'duelist', score, reason };
}

function scoreGambler(games: GameResult[]): ArchetypeScore {
  const gamesWithHorror = games.filter((g) => g.finalHorrorLevel != null);
  if (gamesWithHorror.length < 2) {
    return { archetype: 'gambler', score: 0, reason: '' };
  }

  const horrorLevels = gamesWithHorror.map((g) => g.finalHorrorLevel!);
  const mean = horrorLevels.reduce((a, b) => a + b, 0) / horrorLevels.length;
  const stdDev = Math.sqrt(
    horrorLevels.reduce((sum, h) => sum + (h - mean) ** 2, 0) / horrorLevels.length,
  );

  // Variance component (capped at stdDev 3.0 — requires truly wild swings)
  const varianceScore = Math.min(stdDev / 3, 1) * 80;

  // Extremes bonus: has both a calm game (1-2) and a chaotic game (6-7)
  const hasCalm = horrorLevels.some((h) => h <= 2);
  const hasChaos = horrorLevels.some((h) => h >= 6);
  const extremesBonus = hasCalm && hasChaos ? 20 : 0;

  const score = varianceScore + extremesBonus;

  const minH = Math.min(...horrorLevels);
  const maxH = Math.max(...horrorLevels);
  let reason: string;
  if (hasCalm && hasChaos) {
    reason = `Your horror levels swing from ${minH} to ${maxH} — every game is a coin flip between calm and carnage.`;
  } else {
    reason = `With a horror spread of ${minH}–${maxH}, your games are anything but predictable.`;
  }

  return { archetype: 'gambler', score, reason };
}

// --- Tie-breaking order (most "dramatic" wins ties) ---
const TIEBREAK_ORDER: PlayerArchetype[] = ['survivor', 'gambler', 'duelist', 'protector'];

/**
 * Compute the player's archetype using independent scoring.
 * Returns the archetype with the highest score (ties broken by drama).
 */
export function computeArchetype(
  games: GameResult[],
  wins: GameResult[],
  winRate: number,
  totalSaved: number,
  totalKilled: number,
): { archetype: PlayerArchetype; reason: string } {
  if (games.length < 3) {
    return { archetype: 'newcomer', reason: 'Play more games to discover your style' };
  }

  const scores: ArchetypeScore[] = [
    scoreProtector(totalSaved, totalKilled, games.length),
    scoreSurvivor(wins),
    scoreDuelist(winRate, wins),
    scoreGambler(games),
  ];

  // Sort by score descending, then by tiebreak order
  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return TIEBREAK_ORDER.indexOf(a.archetype) - TIEBREAK_ORDER.indexOf(b.archetype);
  });

  const winner = scores[0];
  return { archetype: winner.archetype, reason: winner.reason };
}
