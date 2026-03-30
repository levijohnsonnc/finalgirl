import { useState, useMemo } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { GameResult } from '@/hooks/useGameHistory';
import { EndingFormData } from '@/pages/TheEnd';
import { getFinalGirlMaxHealth } from '@/data/finalGirlHealth';
import { getKillerMaxHealth, isKillerUnkillable } from '@/data/killerHealth';

interface GameOutcomeFormProps {
  result: GameResult;
  introStory?: string;
  onContinue: (formData: EndingFormData) => void;
  onDiscard: () => void;
}

export const GameOutcomeForm = ({
  result,
  introStory,
  onContinue,
  onDiscard,
}: GameOutcomeFormProps) => {
  const isWin = result.outcome === 'won';
  
  // Get the Final Girl's max health based on character data
  const maxFinalGirlHealth = useMemo(() => getFinalGirlMaxHealth(result.finalGirl), [result.finalGirl]);
  // Get killer-specific HP and flags
  const maxKillerHealth = useMemo(() => getKillerMaxHealth(result.killer), [result.killer]);
  const killerIsUnkillable = useMemo(() => isKillerUnkillable(result.killer), [result.killer]);
  const isPoltergeist = result.killer === 'Poltergeist';
  const isOrganism = result.killer === 'The Organism';
  
  // Local form state - use character-specific max health for defaults
  const [finalHorrorLevel, setFinalHorrorLevel] = useState(result.finalHorrorLevel ?? 4);
  const [finalGirlHealth, setFinalGirlHealth] = useState(result.finalGirlHealth ?? (isWin ? maxFinalGirlHealth : 0));
  const [killerHealth, setKillerHealth] = useState(result.killerHealth ?? (isWin ? 0 : Math.ceil(maxKillerHealth / 2)));
  const [weaponUsed, setWeaponUsed] = useState(result.weaponUsed ?? '');
  const [victimsSaved, setVictimsSaved] = useState(result.victimsSaved ?? 0);
  const [victimsKilled, setVictimsKilled] = useState(result.victimsKilled ?? 0);
  const [endingSubLocation, setEndingSubLocation] = useState(result.endingSubLocation ?? '');
  const [gameHighlights, setGameHighlights] = useState(result.gameHighlights ?? '');
  // Poltergeist-specific win condition fields
  const [foundCarolyn, setFoundCarolyn] = useState(false);
  const [foundMrFloppy, setFoundMrFloppy] = useState(false);
  // Organism-specific loss type
  const [organismLossType, setOrganismLossType] = useState<'caught' | 'assimilated'>('caught');

  const handleContinue = () => {
    // Augment gameHighlights with killer-specific conditions so the LLM gets full context
    let highlights = gameHighlights || '';
    if (isPoltergeist && isWin) {
      const parts = [];
      if (foundCarolyn) parts.push('Found Carolyn');
      if (foundMrFloppy) parts.push('Recovered Mr. Floppy');
      if (parts.length > 0) {
        highlights = highlights ? `${highlights}. Win condition: ${parts.join(', ')}` : `Win condition: ${parts.join(', ')}`;
      }
    }
    if (isOrganism && !isWin && organismLossType === 'assimilated') {
      highlights = highlights
        ? `${highlights}. Loss type: Assimilation (Horror Track exceeded 6 — Final Girl was absorbed into the Organism)`
        : 'Loss type: Assimilation (Horror Track exceeded 6 — Final Girl was absorbed into the Organism)';
    }

    const formData: EndingFormData = {
      finalHorrorLevel,
      finalGirlHealth,
      killerHealth: killerIsUnkillable ? 0 : killerHealth,
      weaponUsed: weaponUsed || '',
      victimsSaved,
      victimsKilled,
      endingSubLocation: endingSubLocation || '',
      gameHighlights: highlights,
    };
    onContinue(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-5">
      {/* Section: Combat Stats */}
      <div className="space-y-3">
        <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border/50 pb-1.5">
          Combat Stats
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Final Horror Level */}
          <div className="space-y-1">
            <label className="font-vhs text-xs text-muted-foreground">
              Final Horror Level (1-7)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="7"
                value={finalHorrorLevel}
                onChange={(e) => setFinalHorrorLevel(Number(e.target.value))}
                className="flex-1 h-2 bg-muted rounded-sm appearance-none cursor-pointer accent-primary"
              />
              <span className="font-display text-lg text-primary w-6 text-center">
                {finalHorrorLevel}
              </span>
            </div>
          </div>

          {/* Weapon Used */}
          <div className="space-y-1">
            <label className="font-vhs text-xs text-muted-foreground">
              Weapon Used
            </label>
            <input
              type="text"
              value={weaponUsed}
              onChange={(e) => setWeaponUsed(e.target.value)}
              placeholder="Machete, Axe, Fire..."
              className="w-full h-11 px-3 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Final Girl Health */}
          <div className="space-y-1">
            <label className="font-vhs text-xs text-muted-foreground">
              Final Girl Health (0-{maxFinalGirlHealth})
            </label>
            <input
              type="number"
              min="0"
              max={maxFinalGirlHealth}
              value={finalGirlHealth}
              onChange={(e) => setFinalGirlHealth(Math.min(maxFinalGirlHealth, Math.max(0, Number(e.target.value))))}
              className="w-full h-11 px-3 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Killer Health — hidden for unkillable killers */}
          {!killerIsUnkillable && (
            <div className="space-y-1">
              <label className="font-vhs text-xs text-muted-foreground">
                Killer Health (0-{maxKillerHealth})
              </label>
              <input
                type="number"
                min="0"
                max={maxKillerHealth}
                value={killerHealth}
                onChange={(e) => setKillerHealth(Math.min(maxKillerHealth, Math.max(0, Number(e.target.value))))}
                className="w-full h-11 px-3 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      {/* Section: Rescue Stats */}
      <div className="space-y-3">
        <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border/50 pb-1.5">
          Rescue Stats
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Victims Saved */}
          <div className="space-y-1">
            <label className="font-vhs text-xs text-muted-foreground">
              Victims Saved
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={victimsSaved}
              onChange={(e) => setVictimsSaved(Math.max(0, Number(e.target.value)))}
              className="w-full h-11 px-3 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground focus:outline-none focus:border-secondary/50 transition-colors"
            />
          </div>

          {/* Victims Killed */}
          <div className="space-y-1">
            <label className="font-vhs text-xs text-muted-foreground">
              Victims Killed
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={victimsKilled}
              onChange={(e) => setVictimsKilled(Math.max(0, Number(e.target.value)))}
              className="w-full h-11 px-3 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section: Poltergeist win conditions */}
      {isPoltergeist && isWin && (
        <div className="space-y-3">
          <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border/50 pb-1.5">
            Poltergeist Win Condition
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={foundCarolyn}
                onChange={(e) => setFoundCarolyn(e.target.checked)}
                className="w-4 h-4 accent-secondary"
              />
              <span className="font-vhs text-sm text-foreground">Found Carolyn</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={foundMrFloppy}
                onChange={(e) => setFoundMrFloppy(e.target.checked)}
                className="w-4 h-4 accent-secondary"
              />
              <span className="font-vhs text-sm text-foreground">Found Mr. Floppy</span>
            </label>
          </div>
        </div>
      )}

      {/* Section: Organism loss type */}
      {isOrganism && !isWin && (
        <div className="space-y-3">
          <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border/50 pb-1.5">
            How Did You Lose?
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="organismLoss"
                value="caught"
                checked={organismLossType === 'caught'}
                onChange={() => setOrganismLossType('caught')}
                className="accent-primary"
              />
              <span className="font-vhs text-sm text-foreground">Caught by the Organism</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="organismLoss"
                value="assimilated"
                checked={organismLossType === 'assimilated'}
                onChange={() => setOrganismLossType('assimilated')}
                className="accent-primary"
              />
              <span className="font-vhs text-sm text-foreground">Assimilated (Horror &gt; 6)</span>
            </label>
          </div>
        </div>
      )}

      {/* Section: Narrative */}
      <div className="space-y-3">
        <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border/50 pb-1.5">
          Narrative
        </h3>
        
        {/* Ending Location */}
        <div className="space-y-1">
          <label className="font-vhs text-xs text-muted-foreground">
            Ending Location
          </label>
          <input
            type="text"
            value={endingSubLocation}
            onChange={(e) => setEndingSubLocation(e.target.value)}
            placeholder="Kitchen, Basement, Rooftop..."
            className="w-full h-11 px-3 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Game Highlights */}
        <div className="space-y-1">
          <label className="font-vhs text-xs text-muted-foreground">
            Game Highlights
          </label>
          <textarea
            value={gameHighlights}
            onChange={(e) => setGameHighlights(e.target.value)}
            placeholder="Memorable moments, close calls, dramatic kills..."
            rows={3}
            className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 justify-center pt-4 border-t border-border/30">
        <button
          onClick={handleContinue}
          className={`outcome-btn ${isWin ? 'outcome-btn-won' : 'outcome-btn-lost'} group relative w-full sm:w-auto min-w-[200px] h-12 overflow-hidden rounded-sm transition-all duration-200 flex items-center justify-center gap-2 order-first`}
        >
          <span className={`relative z-10 font-display text-base tracking-[0.15em] uppercase ${isWin ? 'text-secondary' : 'text-primary'} drop-shadow-lg`}>
            Continue
          </span>
          <ArrowRight className={`relative z-10 w-4 h-4 ${isWin ? 'text-secondary' : 'text-primary'}`} />
        </button>
        
        <button
          onClick={onDiscard}
          className="outcome-btn outcome-btn-lost group relative w-full sm:w-auto min-w-[200px] h-10 sm:h-12 overflow-hidden rounded-sm transition-all duration-200 flex items-center justify-center gap-2 order-last"
        >
          <X className="relative z-10 w-4 h-4 text-muted-foreground" />
          <span className="relative z-10 font-display text-sm sm:text-base tracking-[0.15em] uppercase text-muted-foreground drop-shadow-lg">
            Discard
          </span>
        </button>
      </div>
    </div>
  );
};
