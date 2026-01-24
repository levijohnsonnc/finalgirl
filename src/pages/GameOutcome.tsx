import { GameResult } from '@/hooks/useGameHistory';

interface GameOutcomeProps {
  result: GameResult;
  onBack: () => void;
}

const GameOutcome = ({ result, onBack }: GameOutcomeProps) => {
  const isWin = result.outcome === 'won';

  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center py-8">
      {/* Content placeholder - to be filled in later */}
      <div className="text-center space-y-6">
        <h1 
          className={`font-display text-4xl sm:text-5xl md:text-6xl tracking-wider uppercase ${
            isWin ? 'text-secondary neon-text' : 'text-primary blood-glow'
          }`}
        >
          {isWin ? 'VICTORY' : 'DEFEAT'}
        </h1>
        
        <div className="space-y-2">
          <p className="font-vhs text-sm text-muted-foreground">
            {result.finalGirl} {isWin ? 'survived' : 'fell to'} {result.killer}
          </p>
          <p className="font-vhs text-xs text-muted-foreground/70">
            at {result.location}
          </p>
        </div>

        <div className="pt-8">
          <button
            onClick={onBack}
            className="vcr-tape-button px-6 py-3 font-display text-sm tracking-[0.15em] uppercase min-h-[44px]"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOutcome;
