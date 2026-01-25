import { useMemo } from 'react';
import { GameResult } from '@/hooks/useGameHistory';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skull, Users, Crown, Heart, RefreshCw, Lock } from 'lucide-react';

interface TrophyGridProps {
  gameHistory: GameResult[];
}

interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedCount: number;
  unlockHint: string;
}

export const TrophyGrid = ({ gameHistory }: TrophyGridProps) => {
  const trophies = useMemo((): Trophy[] => {
    const wins = gameHistory.filter(g => g.outcome === 'won');
    
    // Final Frame: Win at max horror (7)
    const finalFrameGames = wins.filter(g => g.finalHorrorLevel === 7);
    
    // No One Left Behind: Save 5+ victims in one game
    const noOneBehindGames = gameHistory.filter(g => (g.victimsSaved || 0) >= 5);
    
    // Scream Queen: Win with 3 different Final Girls
    const winningFinalGirls = new Set(wins.map(g => g.finalGirl));
    
    // On the Ropes: Win with 1-2 health
    const onTheRopesGames = wins.filter(g => g.finalGirlHealth != null && g.finalGirlHealth <= 2);
    
    // Repeat Offender: Face same killer 5+ times
    const killerCounts = new Map<string, number>();
    gameHistory.forEach(g => {
      killerCounts.set(g.killer, (killerCounts.get(g.killer) || 0) + 1);
    });
    const repeatOffenderCount = Array.from(killerCounts.values()).filter(c => c >= 5).length;

    return [
      {
        id: 'final-frame',
        name: 'Final Frame',
        description: 'Win at maximum horror level',
        icon: <Skull className="w-6 h-6" />,
        earned: finalFrameGames.length > 0,
        earnedCount: finalFrameGames.length,
        unlockHint: 'Win a game at Horror Level 7'
      },
      {
        id: 'no-one-behind',
        name: 'No One Left Behind',
        description: 'Save 5+ victims in a single game',
        icon: <Users className="w-6 h-6" />,
        earned: noOneBehindGames.length > 0,
        earnedCount: noOneBehindGames.length,
        unlockHint: 'Rescue 5 or more victims in one game'
      },
      {
        id: 'scream-queen',
        name: 'Scream Queen',
        description: 'Win with 3 different Final Girls',
        icon: <Crown className="w-6 h-6" />,
        earned: winningFinalGirls.size >= 3,
        earnedCount: winningFinalGirls.size >= 3 ? 1 : 0,
        unlockHint: `Win with ${3 - winningFinalGirls.size} more Final Girl${3 - winningFinalGirls.size !== 1 ? 's' : ''}`
      },
      {
        id: 'on-the-ropes',
        name: 'On the Ropes',
        description: 'Win with 1-2 health remaining',
        icon: <Heart className="w-6 h-6" />,
        earned: onTheRopesGames.length > 0,
        earnedCount: onTheRopesGames.length,
        unlockHint: 'Barely survive with ≤2 HP'
      },
      {
        id: 'repeat-offender',
        name: 'Repeat Offender',
        description: 'Face the same killer 5+ times',
        icon: <RefreshCw className="w-6 h-6" />,
        earned: repeatOffenderCount > 0,
        earnedCount: repeatOffenderCount,
        unlockHint: 'Play against one killer 5 times'
      }
    ];
  }, [gameHistory]);

  const earnedCount = trophies.filter(t => t.earned).length;

  return (
    <div className="trophy-section">
      <h3 className="section-title flex items-center gap-2">
        <Crown className="w-5 h-5 text-vhs-yellow" />
        Trophies
        <span className="text-sm text-muted-foreground font-normal">
          ({earnedCount}/{trophies.length})
        </span>
      </h3>

      <div className="trophy-grid">
        {trophies.map((trophy) => (
          <Tooltip key={trophy.id}>
            <TooltipTrigger asChild>
              <div className={`trophy-badge ${trophy.earned ? 'trophy-earned' : 'trophy-locked'}`}>
                <div className="trophy-icon">
                  {trophy.earned ? trophy.icon : <Lock className="w-5 h-5" />}
                </div>
                <div className="trophy-name">{trophy.name}</div>
                {trophy.earned && trophy.earnedCount > 1 && (
                  <div className="trophy-count">×{trophy.earnedCount}</div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-background/95 border-border max-w-[200px]">
              <div className="text-center">
                <p className="font-semibold mb-1">{trophy.name}</p>
                <p className="text-sm text-muted-foreground">{trophy.description}</p>
                {!trophy.earned && (
                  <p className="text-xs text-vhs-yellow mt-2">{trophy.unlockHint}</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
