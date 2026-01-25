import { useState } from 'react';
import { useGameHistory } from '@/hooks/useGameHistory';
import { useGameStats } from '@/hooks/useGameStats';
import { RecordJacket } from '@/components/stats/RecordJacket';
import { TrendsSection } from '@/components/stats/TrendsSection';
import { BreakdownTabs } from '@/components/stats/BreakdownTabs';
import { HighlightsReel } from '@/components/stats/HighlightsReel';
import { TrophyGrid } from '@/components/stats/TrophyGrid';
import { PlayerArchetypeBadge } from '@/components/stats/PlayerArchetype';
import { BarChart3, Film } from 'lucide-react';

interface StatsProps {
  onBack: () => void;
}

type TimeFilter = 'all' | '30' | '10';

const Stats = ({ onBack }: StatsProps) => {
  const { gameHistory } = useGameHistory();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const stats = useGameStats(gameHistory, timeFilter);

  return (
    <div className="stats-page">
      {/* Header */}
      <div className="stats-header">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-neon-cyan" />
          <h1 className="font-title text-2xl sm:text-3xl tracking-wider">STATS</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter */}
          <div className="time-filter">
            <button
              onClick={() => setTimeFilter('all')}
              className={`filter-chip ${timeFilter === 'all' ? 'filter-chip-active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setTimeFilter('30')}
              className={`filter-chip ${timeFilter === '30' ? 'filter-chip-active' : ''}`}
            >
              30
            </button>
            <button
              onClick={() => setTimeFilter('10')}
              className={`filter-chip ${timeFilter === '10' ? 'filter-chip-active' : ''}`}
            >
              10
            </button>
          </div>

          {/* Player Archetype (desktop) */}
          <div className="hidden lg:block">
            <PlayerArchetypeBadge 
              archetype={stats.playerArchetype} 
              reason={stats.archetypeReason}
            />
          </div>
        </div>
      </div>

      {/* Player Archetype (mobile) */}
      <div className="lg:hidden mb-6">
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
          <button
            onClick={onBack}
            className="vcr-button mt-6"
          >
            Start Playing
          </button>
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
          <TrophyGrid gameHistory={gameHistory} />
        </div>
      )}
    </div>
  );
};

export default Stats;
