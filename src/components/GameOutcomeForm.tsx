import { useState } from 'react';
import { Loader2, Sparkles, ImageIcon, Upload, X } from 'lucide-react';
import { GameResult } from '@/hooks/useGameHistory';
import { PosterPromptModal } from './PosterPromptModal';
import { ImageUploadSlot } from './ImageUploadSlot';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getKillerDescription } from '@/data/killerDescriptions';
import { getFinalGirlDescription } from '@/data/finalGirlDescriptions';
import { getLocationDescription } from '@/data/locationDescriptions';

interface GameOutcomeFormProps {
  result: GameResult;
  introStory?: string;
  onUpdate: (updates: Partial<GameResult>) => void;
  onSaveAndExit: () => void;
}

export const GameOutcomeForm = ({
  result,
  introStory,
  onUpdate,
  onSaveAndExit,
}: GameOutcomeFormProps) => {
  const isWin = result.outcome === 'won';
  
  // Local form state
  const [finalHorrorLevel, setFinalHorrorLevel] = useState(result.finalHorrorLevel ?? 4);
  const [finalGirlHealth, setFinalGirlHealth] = useState(result.finalGirlHealth ?? (isWin ? 5 : 0));
  const [killerHealth, setKillerHealth] = useState(result.killerHealth ?? (isWin ? 0 : 5));
  const [weaponUsed, setWeaponUsed] = useState(result.weaponUsed ?? '');
  const [victimsSaved, setVictimsSaved] = useState(result.victimsSaved ?? 0);
  const [victimsKilled, setVictimsKilled] = useState(result.victimsKilled ?? 0);
  const [endingSubLocation, setEndingSubLocation] = useState(result.endingSubLocation ?? '');
  const [gameHighlights, setGameHighlights] = useState(result.gameHighlights ?? '');
  const [endingNarration, setEndingNarration] = useState(result.endingNarration ?? '');
  const [posterImageUrl, setPosterImageUrl] = useState(result.posterImageUrl ?? '');
  const [isGeneratingEnding, setIsGeneratingEnding] = useState(false);

  const handleGenerateEnding = async () => {
    if (!introStory) {
      toast({
        title: "Missing intro story",
        description: "An intro story is required to generate the ending.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingEnding(true);

    try {
      // Look up character descriptions
      const killerDescription = getKillerDescription(result.killer);
      const finalGirlBackstory = getFinalGirlDescription(result.finalGirl);
      const locationDescription = getLocationDescription(result.location);

      const payload = {
        introStory,
        outcome: result.outcome,
        killer: {
          name: result.killer,
          description: killerDescription,
        },
        location: {
          name: result.location,
          description: locationDescription,
        },
        finalGirl: {
          name: result.finalGirl,
          backstory: finalGirlBackstory,
        },
        // Optional game stats
        ...(finalHorrorLevel && { finalHorrorLevel }),
        ...(weaponUsed && { weaponUsed }),
        ...(finalGirlHealth !== undefined && { finalGirlHealth }),
        ...(killerHealth !== undefined && { killerHealth }),
        ...(victimsSaved !== undefined && { victimsSaved }),
        ...(victimsKilled !== undefined && { victimsKilled }),
        ...(endingSubLocation && { endingSubLocation }),
        ...(gameHighlights && { gameHighlights }),
      };

      const { data, error } = await supabase.functions.invoke('generate-ending', {
        body: payload,
      });

      if (error) {
        console.error('Error generating ending:', error);
        toast({
          title: "Generation failed",
          description: error.message || "Failed to generate ending. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.ending) {
        setEndingNarration(data.ending);
        // Persist to game result
        onUpdate({ endingNarration: data.ending });
        toast({
          title: "Ending generated",
          description: "Your story's conclusion has been written.",
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingEnding(false);
    }
  };

  const handleSave = () => {
    onUpdate({
      finalHorrorLevel,
      finalGirlHealth,
      killerHealth,
      weaponUsed: weaponUsed || undefined,
      victimsSaved,
      victimsKilled,
      endingSubLocation: endingSubLocation || undefined,
      gameHighlights: gameHighlights || undefined,
      endingNarration: endingNarration || undefined,
      posterImageUrl: posterImageUrl || undefined,
    });
    onSaveAndExit();
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
              Final Girl Health
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={finalGirlHealth}
              onChange={(e) => setFinalGirlHealth(Math.max(0, Number(e.target.value)))}
              className="w-full h-11 px-3 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Killer Health */}
          <div className="space-y-1">
            <label className="font-vhs text-xs text-muted-foreground">
              Killer Health
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={killerHealth}
              onChange={(e) => setKillerHealth(Math.max(0, Number(e.target.value)))}
              className="w-full h-11 px-3 bg-muted/50 border border-border/50 rounded-sm font-vhs text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
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

      {/* Section: AI Generation & Poster */}
      <div className="space-y-3">
        <h3 className="font-display text-xs tracking-[0.15em] uppercase text-muted-foreground border-b border-border/50 pb-1.5">
          AI Generation
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGenerateEnding}
            disabled={isGeneratingEnding}
            className="vcr-tape-button flex items-center justify-center gap-2 px-4 py-3 font-display text-xs tracking-[0.1em] uppercase transition-all duration-300 disabled:opacity-50 min-h-[44px]"
          >
            {isGeneratingEnding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGeneratingEnding ? 'Generating...' : 'Generate Ending'}
          </button>
          
          <PosterPromptModal
            introStory={introStory}
            endingNarration={endingNarration}
            killer={result.killer}
            location={result.location}
            finalGirl={result.finalGirl}
            outcome={result.outcome}
          >
            <button className="vcr-tape-button flex items-center justify-center gap-2 px-4 py-3 font-display text-xs tracking-[0.1em] uppercase transition-all duration-300 min-h-[44px]">
              <ImageIcon className="w-4 h-4" />
              Poster Prompt
            </button>
          </PosterPromptModal>

          <ImageUploadSlot
            imageUrl={posterImageUrl}
            onImageChange={setPosterImageUrl}
            gameId={result.id}
          />
        </div>

        {/* Ending Narration Display */}
        {endingNarration && (
          <div className="scenario-description p-4 rounded-sm">
            <p className="font-vhs text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {endingNarration}
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4 border-t border-border/30">
        <button
          onClick={handleSave}
          className="outcome-btn outcome-btn-won group relative w-full max-w-xs h-12 overflow-hidden rounded-sm transition-all duration-200"
        >
          <span className="relative z-10 font-display text-base tracking-[0.15em] uppercase text-secondary drop-shadow-lg">
            Save & Exit
          </span>
        </button>
      </div>
    </div>
  );
};
