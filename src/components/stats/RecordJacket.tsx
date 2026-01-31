import { ComputedStats } from '@/hooks/useGameStats';
import { Gamepad2, Trophy, HeartHandshake, Skull } from 'lucide-react';

interface RecordJacketProps {
  stats: ComputedStats;
}

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  variant: 'blue' | 'yellow' | 'green' | 'red';
}

const StatCard = ({ value, label, icon, variant }: StatCardProps) => {
  return (
    <div className={`hero-stat-card hero-stat-${variant}`}>
      <div className="hero-stat-label">{label}</div>
      <div className={`hero-stat-number hero-stat-number-${variant}`}>
        {value}
      </div>
      <div className={`hero-stat-icon hero-stat-icon-${variant}`}>
        {icon}
      </div>
    </div>
  );
};

export const RecordJacket = ({ stats }: RecordJacketProps) => {
  return (
    <div className="record-jacket">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          value={stats.gamesPlayed}
          label="GAMES"
          icon={<Gamepad2 className="w-6 h-6" />}
          variant="blue"
        />
        <StatCard
          value={`${Math.round(stats.winRate)}%`}
          label="WIN RATE"
          icon={<Trophy className="w-6 h-6" />}
          variant="yellow"
        />
        <StatCard
          value={stats.totalVictimsSaved}
          label="SAVED"
          icon={<HeartHandshake className="w-6 h-6" />}
          variant="green"
        />
        <StatCard
          value={stats.totalVictimsKilled}
          label="KILLED"
          icon={<Skull className="w-6 h-6" />}
          variant="red"
        />
      </div>
    </div>
  );
};
