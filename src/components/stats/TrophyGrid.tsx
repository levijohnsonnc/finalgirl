import { Crown } from 'lucide-react';

export const TrophyGrid = () => {
  return (
    <div className="trophy-section">
      <h3 className="section-title">Trophies</h3>
      
      <div className="trophy-coming-soon">
        <Crown className="w-8 h-8 text-muted-foreground/40 mb-3" />
        <span className="font-vhs text-xs text-muted-foreground tracking-widest">
          COMING SOON
        </span>
      </div>
    </div>
  );
};
