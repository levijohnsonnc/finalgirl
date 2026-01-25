import { ComputedStats } from '@/hooks/useGameStats';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { TrendingUp, Flame, Skull } from 'lucide-react';

interface TrendsSectionProps {
  stats: ComputedStats;
}

export const TrendsSection = ({ stats }: TrendsSectionProps) => {
  const hasEnoughData = stats.gamesPlayed >= 3;

  if (!hasEnoughData) {
    return (
      <div className="trends-section">
        <h3 className="section-title flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-neon-cyan" />
          Story of You
        </h3>
        <div className="trends-empty">
          <p className="text-muted-foreground text-center py-8">
            Play 3+ games to unlock your personal trends
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="trends-section">
      <h3 className="section-title flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-neon-cyan" />
        Story of You
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Chart */}
        {stats.gamesByPeriod.length > 0 && (
          <div className="chart-container">
            <h4 className="chart-title">Wins & Losses Over Time</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.gamesByPeriod}>
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
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
                  <Bar dataKey="wins" fill="hsl(var(--neon-cyan))" name="Wins" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="losses" fill="hsl(var(--blood-red))" name="Losses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Horror Trend */}
        {stats.horrorTrend.length > 0 && (
          <div className="chart-container">
            <h4 className="chart-title">Tension Trend</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.horrorTrend}>
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    domain={[1, 7]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [value.toFixed(1), 'Avg Horror']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgHorror" 
                    stroke="hsl(var(--blood-red))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--blood-red))', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Streaks */}
      <div className="streaks-row">
        <div className="streak-badge">
          <Flame className={`w-4 h-4 ${stats.streaks.currentType === 'win' ? 'text-neon-cyan' : 'text-blood-red'}`} />
          <span className="streak-value">{stats.streaks.current}</span>
          <span className="streak-label">
            {stats.streaks.currentType === 'win' ? 'Win Streak' : stats.streaks.currentType === 'loss' ? 'Loss Streak' : 'Current'}
          </span>
        </div>
        <div className="streak-badge">
          <TrendingUp className="w-4 h-4 text-neon-cyan" />
          <span className="streak-value">{stats.streaks.best}</span>
          <span className="streak-label">Best Wins</span>
        </div>
        <div className="streak-badge">
          <Skull className="w-4 h-4 text-blood-red" />
          <span className="streak-value">{stats.streaks.worst}</span>
          <span className="streak-label">Worst Losses</span>
        </div>
      </div>
    </div>
  );
};
