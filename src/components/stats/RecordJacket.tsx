import { ComputedStats } from '@/hooks/useGameStats';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Gamepad2, Trophy, Users, Skull, Heart, Sword } from 'lucide-react';

interface RecordJacketProps {
  stats: ComputedStats;
}

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
  accent?: 'cyan' | 'blood' | 'yellow' | 'default';
}

const StatCard = ({ value, label, icon, tooltip, accent = 'default' }: StatCardProps) => {
  const accentClasses = {
    cyan: 'text-neon-cyan shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]',
    blood: 'text-blood-red shadow-[0_0_20px_hsl(var(--blood-red)/0.3)]',
    yellow: 'text-vhs-yellow shadow-[0_0_20px_hsl(var(--vhs-yellow)/0.3)]',
    default: 'text-foreground'
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="stat-card group cursor-help">
          <div className="flex items-center justify-center gap-2 mb-1 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
            {icon}
          </div>
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
          icon={<Gamepad2 className="w-4 h-4" />}
          tooltip="Total number of games played"
          accent="default"
        />
        <StatCard
          value={`${Math.round(stats.winRate)}%`}
          label="Win Rate"
          icon={<Trophy className="w-4 h-4" />}
          tooltip="Percentage of games won"
          accent={stats.winRate >= 50 ? 'cyan' : 'blood'}
        />
        <StatCard
          value={stats.totalVictimsSaved}
          label="Saved"
          icon={<Users className="w-4 h-4" />}
          tooltip="Total victims rescued across all games"
          accent="cyan"
        />
        <StatCard
          value={stats.avgHorrorLevel !== null ? stats.avgHorrorLevel.toFixed(1) : '—'}
          label="Avg Horror"
          icon={<Skull className="w-4 h-4" />}
          tooltip="Average final horror level (1-7 scale)"
          accent="blood"
        />
        <StatCard
          value={stats.closestCall ? stats.closestCall.health : '—'}
          label="Closest Call"
          icon={<Heart className="w-4 h-4" />}
          tooltip={stats.closestCall 
            ? `Lowest health in a win (${stats.closestCall.finalGirl})` 
            : "Win a game to see your closest call"}
          accent="yellow"
        />
        <StatCard
          value={stats.signatureWeapon?.weapon || '—'}
          label="Signature"
          icon={<Sword className="w-4 h-4" />}
          tooltip={stats.signatureWeapon 
            ? `Most used weapon (${stats.signatureWeapon.count} times)` 
            : "Record weapons to see your signature"}
          accent="default"
        />
      </div>
    </div>
  );
};
