import { GameResult } from '@/hooks/useGameHistory';
import { GameOutcomeForm } from '@/components/GameOutcomeForm';

interface GameOutcomeProps {
  result: GameResult;
  introStory?: string;
  onUpdate: (updates: Partial<GameResult>) => void;
  onBack: () => void;
}

const GameOutcome = ({ result, introStory, onUpdate, onBack }: GameOutcomeProps) => {
  const isWin = result.outcome === 'won';

  return (
    <div className="relative min-h-[60vh] flex flex-col items-center py-8 px-3 sm:px-4">
      {/* Header */}
      <div className="text-center space-y-2 mb-8 sm:mb-10">
        <h1 
          className={`font-display text-3xl sm:text-4xl md:text-5xl tracking-wider uppercase ${
            isWin ? 'text-secondary neon-text' : 'text-primary blood-glow'
          }`}
        >
          {isWin ? 'VICTORY' : 'DEFEAT'}
        </h1>
        
        <div className="space-y-1">
          <p className="font-vhs text-sm text-muted-foreground">
            {result.finalGirl} {isWin ? 'survived' : 'fell to'} {result.killer}
          </p>
          <p className="font-vhs text-xs text-muted-foreground/70">
            at {result.location}
          </p>
        </div>
      </div>

      {/* Form */}
      <GameOutcomeForm
        result={result}
        introStory={introStory}
        onUpdate={onUpdate}
        onSaveAndExit={onBack}
        onPlayAgain={onBack}
      />
    </div>
  );
};

export default GameOutcome;
