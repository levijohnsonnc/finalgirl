import { ComputedStats } from '@/hooks/useGameStats';
import gamesBg from '@/assets/stats/games-bg.png';
import winrateBg from '@/assets/stats/winrate-bg.png';
import savedBg from '@/assets/stats/saved-bg.png';
import killedBg from '@/assets/stats/killed-bg.png';

interface RecordJacketProps {
  stats: ComputedStats;
}

interface StatCardProps {
  value: string | number;
  backgroundImage: string;
  backgroundPosition?: string;
}

const StatCard = ({ value, backgroundImage, backgroundPosition = 'center' }: StatCardProps) => (
  <div 
    className="hero-stat-card-image"
    style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition 
    }}
  >
    <div className="hero-stat-value">
      {value}
    </div>
  </div>
);

export const RecordJacket = ({ stats }: RecordJacketProps) => {
  return (
    <div className="record-jacket">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          value={stats.gamesPlayed}
          backgroundImage={gamesBg}
          backgroundPosition="center 38%"
        />
        <StatCard
          value={`${Math.round(stats.winRate)}%`}
          backgroundImage={winrateBg}
          backgroundPosition="center 30%"
        />
        <StatCard
          value={stats.totalVictimsSaved}
          backgroundImage={savedBg}
          backgroundPosition="center 25%"
        />
        <StatCard
          value={stats.totalVictimsKilled}
          backgroundImage={killedBg}
          backgroundPosition="center 25%"
        />
      </div>
    </div>
  );
};
