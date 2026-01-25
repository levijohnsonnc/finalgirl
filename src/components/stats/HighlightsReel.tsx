import { ComputedStats, HighlightGame } from '@/hooks/useGameStats';
import { CHARACTER_IMAGES } from '@/types/gameData';
import { Award, Skull, Heart, Sparkles, Zap, Users } from 'lucide-react';
import { format } from 'date-fns';

interface HighlightsReelProps {
  stats: ComputedStats;
}

interface HighlightCardProps {
  highlight: HighlightGame | null;
  title: string;
  icon: React.ReactNode;
  unlockText: string;
  variant: 'heroic' | 'brutal' | 'clutch' | 'clean';
}

const HighlightCard = ({ highlight, title, icon, unlockText, variant }: HighlightCardProps) => {
  const variantClasses = {
    heroic: 'highlight-card-heroic',
    brutal: 'highlight-card-brutal',
    clutch: 'highlight-card-clutch',
    clean: 'highlight-card-clean'
  };

  if (!highlight) {
    return (
      <div className={`highlight-card highlight-card-locked`}>
        <div className="highlight-icon opacity-30">{icon}</div>
        <div className="highlight-title opacity-50">{title}</div>
        <div className="highlight-unlock">{unlockText}</div>
      </div>
    );
  }

  return (
    <div className={`highlight-card ${variantClasses[variant]}`}>
      <div className="highlight-icon">{icon}</div>
      <div className="highlight-title">{title}</div>
      <div className="highlight-value">{highlight.value}</div>
      <div className="highlight-details">
        <div className="flex items-center gap-2">
          {CHARACTER_IMAGES[highlight.game.finalGirl] && (
            <img 
              src={CHARACTER_IMAGES[highlight.game.finalGirl]} 
              alt={highlight.game.finalGirl}
              className="w-6 h-6 rounded-full object-cover border border-border/50"
            />
          )}
          <span className="text-xs truncate">{highlight.game.finalGirl}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          vs {highlight.game.killer}
        </div>
        <div className="text-xs text-muted-foreground/60">
          {format(new Date(highlight.game.timestamp), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

export const HighlightsReel = ({ stats }: HighlightsReelProps) => {
  return (
    <div className="highlights-section">
      <h3 className="section-title flex items-center gap-2">
        <Award className="w-5 h-5 text-vhs-yellow" />
        Highlights Reel
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <HighlightCard
          highlight={stats.mostHeroicWin}
          title="Most Heroic"
          icon={<Users className="w-6 h-6" />}
          unlockText="Save 3+ victims in a win"
          variant="heroic"
        />
        <HighlightCard
          highlight={stats.mostBrutalLoss}
          title="Most Brutal"
          icon={<Skull className="w-6 h-6" />}
          unlockText="Experience a devastating loss"
          variant="brutal"
        />
        <HighlightCard
          highlight={stats.clutchWin}
          title="Clutch Win"
          icon={<Heart className="w-6 h-6" />}
          unlockText="Win with ≤2 HP or max horror"
          variant="clutch"
        />
        <HighlightCard
          highlight={stats.cleanWin}
          title="Clean Win"
          icon={<Sparkles className="w-6 h-6" />}
          unlockText="Win with ≤2 horror & 8+ HP"
          variant="clean"
        />
      </div>

      {/* Nemesis & Favorite Matchup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
        {stats.nemesis ? (
          <div className="special-card nemesis-card">
            <Zap className="w-5 h-5 text-vhs-yellow" />
            <div>
              <div className="special-label">Your Nemesis</div>
              <div className="special-value flex items-center gap-2">
                {CHARACTER_IMAGES[stats.nemesis.killer] && (
                  <img 
                    src={CHARACTER_IMAGES[stats.nemesis.killer]} 
                    alt={stats.nemesis.killer}
                    className="w-8 h-8 rounded-full object-cover border border-vhs-yellow/30"
                  />
                )}
                <span>{stats.nemesis.killer}</span>
              </div>
              <div className="special-detail">{stats.nemesis.losses} defeats</div>
            </div>
          </div>
        ) : (
          <div className="special-card special-card-locked">
            <Zap className="w-5 h-5 opacity-30" />
            <div>
              <div className="special-label opacity-50">Your Nemesis</div>
              <div className="special-unlock">Lose 2+ times to the same killer</div>
            </div>
          </div>
        )}

        {stats.favoriteMatchup ? (
          <div className="special-card favorite-card">
            <Award className="w-5 h-5 text-neon-cyan" />
            <div>
              <div className="special-label">Favorite Matchup</div>
              <div className="special-value flex items-center gap-2">
                <div className="flex -space-x-2">
                  {CHARACTER_IMAGES[stats.favoriteMatchup.finalGirl] && (
                    <img 
                      src={CHARACTER_IMAGES[stats.favoriteMatchup.finalGirl]} 
                      alt={stats.favoriteMatchup.finalGirl}
                      className="w-8 h-8 rounded-full object-cover border-2 border-background"
                    />
                  )}
                  {CHARACTER_IMAGES[stats.favoriteMatchup.killer] && (
                    <img 
                      src={CHARACTER_IMAGES[stats.favoriteMatchup.killer]} 
                      alt={stats.favoriteMatchup.killer}
                      className="w-8 h-8 rounded-full object-cover border-2 border-background"
                    />
                  )}
                </div>
                <span className="text-sm truncate">{stats.favoriteMatchup.combo}</span>
              </div>
              <div className="special-detail">{stats.favoriteMatchup.count} games</div>
            </div>
          </div>
        ) : (
          <div className="special-card special-card-locked">
            <Award className="w-5 h-5 opacity-30" />
            <div>
              <div className="special-label opacity-50">Favorite Matchup</div>
              <div className="special-unlock">Play the same matchup 2+ times</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
