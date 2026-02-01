import { ComputedStats } from '@/hooks/useGameStats';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { CHARACTER_IMAGES, LOCATION_IMAGES } from '@/types/gameData';

interface TrendsSectionProps {
  stats: ComputedStats;
}

interface NarrativeBadgeProps {
  label: string;
  value: string | null;
  subtext: string;
  image?: string;
  variant: 'warning' | 'success' | 'danger' | 'info';
}

const NarrativeBadge = ({ label, value, subtext, image, variant }: NarrativeBadgeProps) => {
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
      <div className="narrative-label">{label}</div>
      <div className="narrative-value">
        {image && (
          <img 
            src={image} 
            alt={value}
            className="w-8 h-8 rounded-full object-cover border border-border/50"
          />
        )}
        <span className="truncate">{value}</span>
      </div>
      <div className="narrative-subtext">{subtext}</div>
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

      {/* Win/Loss Horizontal Bar */}
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

      {/* Victims Over Time Chart */}
      {stats.victimsTrend.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">Victims Over Time</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.victimsTrend}>
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickFormatter={(value) => {
                    const [year, month, day] = value.split('-');
                    return `${month}/${day}`;
                  }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="saved" 
                  stroke="hsl(var(--neon-cyan))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--neon-cyan))', strokeWidth: 0 }}
                  name="Saved"
                />
                <Line 
                  type="monotone" 
                  dataKey="killed" 
                  stroke="hsl(var(--blood-red))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--blood-red))', strokeWidth: 0 }}
                  name="Killed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Narrative Badges */}
      <div className="narrative-grid">
        <NarrativeBadge
          label="Nemesis"
          value={stats.nemesis?.killer || null}
          subtext={stats.nemesis ? `${stats.nemesis.losses} defeats` : ''}
          image={stats.nemesis ? CHARACTER_IMAGES[stats.nemesis.killer] : undefined}
          variant="danger"
        />
        <NarrativeBadge
          label="The Usual Suspect"
          value={stats.usualSuspect?.killer || null}
          subtext={stats.usualSuspect ? `${stats.usualSuspect.wins} wins` : ''}
          image={stats.usualSuspect ? CHARACTER_IMAGES[stats.usualSuspect.killer] : undefined}
          variant="success"
        />
        <NarrativeBadge
          label="Cursed Site"
          value={stats.cursedSite?.location || null}
          subtext={stats.cursedSite ? `${stats.cursedSite.losses} losses` : ''}
          image={stats.cursedSite ? LOCATION_IMAGES[stats.cursedSite.location] : undefined}
          variant="warning"
        />
        <NarrativeBadge
          label="Home Turf"
          value={stats.homeTurf?.location || null}
          subtext={stats.homeTurf ? `${stats.homeTurf.wins} wins` : ''}
          image={stats.homeTurf ? LOCATION_IMAGES[stats.homeTurf.location] : undefined}
          variant="info"
        />
      </div>
    </div>
  );
};
