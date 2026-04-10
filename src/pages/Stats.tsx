import { useEffect, useState } from 'react';
import { useGameHistoryContext } from '@/contexts/GameHistoryContext';
import { useGameStats } from '@/hooks/useGameStats';
import { RecordJacket } from '@/components/stats/RecordJacket';
import { TrendsSection } from '@/components/stats/TrendsSection';
import { BreakdownTabs } from '@/components/stats/BreakdownTabs';
import { PlayerArchetypeBadge } from '@/components/stats/PlayerArchetype';
import { Film } from 'lucide-react';

const Stats = () => {
  const { gameHistory, isLoading } = useGameHistoryContext();
  const stats = useGameStats(gameHistory);
  const [timestamp, setTimestamp] = useState('');

  // Update timestamp every second for archival feel
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTimestamp(`${hours}:${minutes}:${seconds}`);
    };
    
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stats-page">
      {/* VHS Background Layers */}
      <div className="stats-bg-plate" />
      <div className="stats-grain-overlay" />
      <div className="stats-scanlines" />
      <div className="stats-vignette" />

      {/* REC Indicator */}
      <div className="rec-indicator">
        <span className="rec-dot" />
        <span>REC</span>
      </div>

      {/* Header with Archival Framing */}
      <div className="stats-header">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl sm:text-5xl text-primary blood-glow tracking-wider">
            STATS
          </h1>
          <p className="stats-subheader">
            SESSION DATA LOGGED • {timestamp}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="stats-content">
          <p className="text-muted-foreground font-vhs text-sm tracking-widest animate-pulse text-center mb-6">
            RETRIEVING SESSION DATA...
          </p>
          {/* Skeleton Record Jacket */}
          <div className="record-jacket">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="hero-stat-card-image animate-pulse bg-muted/20" style={{ minHeight: '140px' }} />
              ))}
            </div>
          </div>
          {/* Skeleton Trends */}
          <div className="mt-8 space-y-4">
            <div className="h-5 w-48 bg-muted/20 rounded animate-pulse" />
            <div className="h-32 bg-muted/10 rounded animate-pulse" />
          </div>
          {/* Skeleton Breakdowns */}
          <div className="mt-8 space-y-3">
            <div className="h-5 w-36 bg-muted/20 rounded animate-pulse" />
            <div className="h-24 bg-muted/10 rounded animate-pulse" />
          </div>
        </div>
      ) : stats.gamesPlayed === 0 ? (
        <div className="stats-empty">
          <Film className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h2 className="font-title text-xl mb-2">No Games Recorded</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Play your first game and record the outcome to start tracking your stats. 
            Your journey as a Final Girl awaits!
          </p>
        </div>
      ) : (
        <div className="stats-content">
          {/* Record Jacket */}
          <RecordJacket stats={stats} />

          {/* Trends - with archival subtitle */}
          <TrendsSection stats={stats} />

          {/* Breakdowns */}
          <BreakdownTabs stats={stats} />

          {/* Player Archetype - Bottom */}
          <div className="mt-8">
            <PlayerArchetypeBadge 
              archetype={stats.playerArchetype} 
              reason={stats.archetypeReason}
              profile={stats.archetypeProfile}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
