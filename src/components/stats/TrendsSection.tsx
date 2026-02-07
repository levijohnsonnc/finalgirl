import { useState } from 'react';
import { ComputedStats } from '@/hooks/useGameStats';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { CHARACTER_IMAGES, LOCATION_IMAGES } from '@/types/gameData';

type ChartView = 'victims' | 'games' | 'winloss';

interface TrendsSectionProps {
  stats: ComputedStats;
}

interface NarrativeBadgeProps {
  label: string;
  value: string | null;
  subtext: string;
  image?: string;
  type?: 'killer' | 'location';
  variant: 'warning' | 'success' | 'danger' | 'info';
}

const NarrativeBadge = ({ label, value, subtext, image, type = 'killer', variant }: NarrativeBadgeProps) => {
  const variantClasses = {
    warning: 'narrative-badge-warning',
    success: 'narrative-badge-success',
    danger: 'narrative-badge-danger',
    info: 'narrative-badge-info'
  };

  if (!value) {
    return (
      <div className={`narrative-badge narrative-badge-locked`}>
        <div className="narrative-label">{label}</div>
        <div className="narrative-unlock">Play more to unlock</div>
      </div>
    );
  }

  return (
    <div className={`narrative-badge ${variantClasses[variant]}`}>
      {image && (
        <>
          <img 
            src={image} 
            alt={value}
            className={`absolute inset-0 w-full h-full object-cover ${type === 'killer' ? 'object-top' : 'object-center'}`}
          />
          <div className={`absolute inset-0 ${type === 'location' ? 'bg-gradient-to-t from-black/95 via-black/60 to-black/20' : 'bg-gradient-to-t from-black/90 via-black/40 to-black/15'}`} />
        </>
      )}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        <div className="narrative-label">{label}</div>
        <div className="mt-auto">
          <div className="narrative-value">{value}</div>
          <div className="narrative-subtext">{subtext}</div>
        </div>
      </div>
    </div>
  );
};

const CHART_OPTIONS: { key: ChartView; label: string }[] = [
  { key: 'victims', label: 'Victims' },
  { key: 'games', label: 'Games' },
  { key: 'winloss', label: 'W / L' },
];

const formatTick = (value: string) => {
  const [, month, day] = value.split('-');
  return `${month}/${day}`;
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px'
};

const ChartWithToggle = ({ stats }: { stats: ComputedStats }) => {
  const [activeChart, setActiveChart] = useState<ChartView>('victims');

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="chart-title">
          {activeChart === 'victims' && 'Victims Over Time'}
          {activeChart === 'games' && 'Games Played Over Time'}
          {activeChart === 'winloss' && 'Wins / Losses Over Time'}
        </h4>
        <div className="chart-toggle">
          {CHART_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`chart-toggle-btn ${activeChart === opt.key ? 'chart-toggle-btn-active' : ''}`}
              onClick={() => setActiveChart(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'victims' ? (
            <LineChart data={stats.victimsTrend}>
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={formatTick} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="saved" stroke="hsl(var(--neon-cyan))" strokeWidth={2} dot={{ fill: 'hsl(var(--neon-cyan))', strokeWidth: 0 }} name="Saved" />
              <Line type="monotone" dataKey="killed" stroke="hsl(var(--blood-red))" strokeWidth={2} dot={{ fill: 'hsl(var(--blood-red))', strokeWidth: 0 }} name="Killed" />
            </LineChart>
          ) : activeChart === 'games' ? (
            <LineChart data={stats.gamesTrend}>
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={formatTick} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="games" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0 }} name="Games" />
            </LineChart>
          ) : (
            <LineChart data={stats.winLossTrend}>
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={formatTick} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="wins" stroke="hsl(var(--neon-cyan))" strokeWidth={2} dot={{ fill: 'hsl(var(--neon-cyan))', strokeWidth: 0 }} name="Wins" />
              <Line type="monotone" dataKey="losses" stroke="hsl(var(--blood-red))" strokeWidth={2} dot={{ fill: 'hsl(var(--blood-red))', strokeWidth: 0 }} name="Losses" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TrendsSection = ({ stats }: TrendsSectionProps) => {
  const hasEnoughData = stats.gamesPlayed >= 3;

  if (!hasEnoughData) {
    return (
      <div className="trends-section">
        <h3 className="section-title">// RECOVERED FOOTAGE</h3>
        <div className="trends-empty">
          <p className="text-muted-foreground text-center py-8 opacity-60">
            Play 3+ games to unlock your personal story
          </p>
        </div>
      </div>
    );
  }

  const totalGames = stats.totalWins + stats.totalLosses;
  const winPercentage = totalGames > 0 ? (stats.totalWins / totalGames) * 100 : 0;

  return (
    <div className="trends-section">
      <h3 className="section-title">// RECOVERED FOOTAGE</h3>

      {/* Win/Loss Bar - Clean and Simple */}
      <div className="winloss-bar-container">
        <div className="winloss-bar">
          <div 
            className="winloss-wins" 
            style={{ width: `${winPercentage}%` }}
          />
          <div 
            className="winloss-losses" 
            style={{ width: `${100 - winPercentage}%` }}
          />
        </div>
        <div className="winloss-labels">
          <span className="text-neon-cyan">Wins {stats.totalWins}</span>
          <span className="text-blood-red">Losses {stats.totalLosses}</span>
        </div>
      </div>

      {/* Chart Section with Toggle */}
      {stats.victimsTrend.length > 0 && (
        <ChartWithToggle stats={stats} />
      )}

      {/* Narrative Badges */}
      <div className="narrative-grid">
        <NarrativeBadge
          label="Nemesis"
          value={stats.nemesis?.killer || null}
          subtext={stats.nemesis ? `${stats.nemesis.losses} defeats` : ''}
          image={stats.nemesis ? CHARACTER_IMAGES[stats.nemesis.killer] : undefined}
          type="killer"
          variant="danger"
        />
        <NarrativeBadge
          label="The Usual Suspect"
          value={stats.usualSuspect?.killer || null}
          subtext={stats.usualSuspect ? `${stats.usualSuspect.wins} wins` : ''}
          image={stats.usualSuspect ? CHARACTER_IMAGES[stats.usualSuspect.killer] : undefined}
          type="killer"
          variant="success"
        />
        <NarrativeBadge
          label="Cursed Site"
          value={stats.cursedSite?.location || null}
          subtext={stats.cursedSite ? `${stats.cursedSite.losses} losses` : ''}
          image={stats.cursedSite ? LOCATION_IMAGES[stats.cursedSite.location] : undefined}
          type="location"
          variant="warning"
        />
        <NarrativeBadge
          label="Home Turf"
          value={stats.homeTurf?.location || null}
          subtext={stats.homeTurf ? `${stats.homeTurf.wins} wins` : ''}
          image={stats.homeTurf ? LOCATION_IMAGES[stats.homeTurf.location] : undefined}
          type="location"
          variant="info"
        />
      </div>
    </div>
  );
};
