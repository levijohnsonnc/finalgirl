import { ComputedStats } from '@/hooks/useGameStats';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RecordJacketProps {
  stats: ComputedStats;
}

interface StatCardProps {
  value: string | number;
  label: string;
  tooltip: string;
  accent?: 'cyan' | 'blood' | 'yellow' | 'default';
}

const StatCard = ({ value, label, tooltip, accent = 'default' }: StatCardProps) => {
  const accentClasses = {
    cyan: 'text-neon-cyan',
    blood: 'text-blood-red',
    yellow: 'text-vhs-yellow',
    default: 'text-foreground'
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="stat-card cursor-help">
          <div className={`stat-number ${accentClasses[accent]}`}>
            {value}
          </div>
          <div className="stat-label">{label}</div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-background/95 border-border max-w-[200px] text-center">
        <p className="text-sm">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const RecordJacket = ({ stats }: RecordJacketProps) => {
  return (
    <div className="record-jacket">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          value={stats.gamesPlayed}
          label="Games"
          tooltip="Total number of games played"
          accent="default"
        />
        <StatCard
          value={`${Math.round(stats.winRate)}%`}
          label="Win Rate"
          tooltip="Percentage of games won"
          accent={stats.winRate >= 50 ? 'cyan' : 'blood'}
        />
        <StatCard
          value={stats.totalVictimsSaved}
          label="Saved"
          tooltip="Total victims rescued across all games"
          accent="cyan"
        />
        <StatCard
          value={stats.avgHorrorLevel !== null ? stats.avgHorrorLevel.toFixed(1) : '—'}
          label="Avg Horror"
          tooltip="Average final horror level (1-7 scale)"
          accent="blood"
        />
        <StatCard
          value={stats.closestCall ? stats.closestCall.health : '—'}
          label="Closest Call"
          tooltip={stats.closestCall 
            ? `Lowest health in a win (${stats.closestCall.finalGirl})` 
            : "Win a game to see your closest call"}
          accent="yellow"
        />
        <StatCard
          value={stats.signatureWeapon?.weapon || '—'}
          label="Signature"
          tooltip={stats.signatureWeapon 
            ? `Most used weapon (${stats.signatureWeapon.count} times)` 
            : "Record weapons to see your signature"}
          accent="default"
        />
      </div>
    </div>
  );
};
