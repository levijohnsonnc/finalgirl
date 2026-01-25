import { useState } from 'react';
import { useGameHistory } from '@/hooks/useGameHistory';
import { useGameStats } from '@/hooks/useGameStats';
import { RecordJacket } from '@/components/stats/RecordJacket';
import { TrendsSection } from '@/components/stats/TrendsSection';
import { BreakdownTabs } from '@/components/stats/BreakdownTabs';
import { HighlightsReel } from '@/components/stats/HighlightsReel';
import { TrophyGrid } from '@/components/stats/TrophyGrid';
import { PlayerArchetypeBadge } from '@/components/stats/PlayerArchetype';
import { Film } from 'lucide-react';

type TimeFilter = 'all' | '30' | '10';

const Stats = () => {
  const { gameHistory } = useGameHistory();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const stats = useGameStats(gameHistory, timeFilter);

  return (
    <div className="stats-page">

      {/* Header */}
      <div className="stats-header">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl sm:text-5xl text-primary blood-glow tracking-wider">
            STATS
          </h1>
          <p className="font-vhs text-xs text-muted-foreground tracking-wider">
            YOUR SURVIVAL RECORD
          </p>
        </div>

        {/* Time Filter */}
        <div className="time-filter">
          <button
            onClick={() => setTimeFilter('all')}
            className={`filter-chip ${timeFilter === 'all' ? 'filter-chip-active' : ''}`}
          >
            ALL
          </button>
          <button
            onClick={() => setTimeFilter('30')}
            className={`filter-chip ${timeFilter === '30' ? 'filter-chip-active' : ''}`}
          >
            LAST 30
          </button>
          <button
            onClick={() => setTimeFilter('10')}
            className={`filter-chip ${timeFilter === '10' ? 'filter-chip-active' : ''}`}
          >
            LAST 10
          </button>
        </div>
      </div>

      {/* Player Archetype - Full Width */}
      <div className="mb-8">
        <PlayerArchetypeBadge 
          archetype={stats.playerArchetype} 
          reason={stats.archetypeReason}
        />
      </div>

      {/* Empty State */}
      {stats.gamesPlayed === 0 ? (
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

          {/* Trends */}
          <TrendsSection stats={stats} />

          {/* Breakdowns */}
          <BreakdownTabs stats={stats} />

          {/* Highlights */}
          <HighlightsReel stats={stats} />

          {/* Trophies */}
          <TrophyGrid />
        </div>
      )}
    </div>
  );
};

export default Stats;
