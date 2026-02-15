import { useState, useEffect, useRef } from 'react';
import { ImageIcon, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createPrimedAudio, base64ToBlob } from '@/lib/audioUtils';
import nowPlayingBg from '@/assets/now-playing-bg.png';
import projectorSound from '@/assets/sounds/projector-start.mp3';
import { PosterPromptModal } from '@/components/PosterPromptModal';
import { ImageUploadSlot } from '@/components/ImageUploadSlot';
import { GameResult } from '@/hooks/useGameHistory';
import { getKillerDescription } from '@/data/killerDescriptions';
import { getFinalGirlDescription } from '@/data/finalGirlDescriptions';
import { getLocationDescription } from '@/data/locationDescriptions';

// Helper to render markdown-style text formatting
const renderFormattedText = (text: string) => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Match **bold** or *italic*
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/\*([^*]+?)\*/);

    // Find which comes first
    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const italicIndex = italicMatch ? remaining.indexOf(italicMatch[0]) : Infinity;

    if (boldIndex === Infinity && italicIndex === Infinity) {
      // No more formatting
      parts.push(remaining);
      break;
    }

    if (boldIndex <= italicIndex && boldMatch) {
      // Bold comes first
      if (boldIndex > 0) {
        parts.push(remaining.slice(0, boldIndex));
      }
      parts.push(<strong key={key++} className="font-bold text-foreground">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldIndex + boldMatch[0].length);
    } else if (italicMatch) {
      // Italic comes first
      if (italicIndex > 0) {
        parts.push(remaining.slice(0, italicIndex));
      }
      parts.push(<em key={key++} className="italic text-foreground/90">{italicMatch[1]}</em>);
      remaining = remaining.slice(italicIndex + italicMatch[0].length);
    }
  }

  return parts;
};

export interface EndingFormData {
  finalHorrorLevel: number;
  finalGirlHealth: number;
  killerHealth: number;
  weaponUsed: string;
  victimsSaved: number;
  victimsKilled: number;
  endingSubLocation: string;
  gameHighlights: string;
}

interface TheEndProps {
  result: GameResult;
  introStory?: string;
  formData: EndingFormData;
  onSave: (endingNarration: string, posterImageUrl?: string) => void;
  onDiscard: () => void;
}

const TheEnd = ({
  result,
  introStory,
  formData,
  onSave,
  onDiscard,
}: TheEndProps) => {
  const [endingStory, setEndingStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [posterImageUrl, setPosterImageUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const isWin = result.outcome === 'won';

  // Auto-generate ending story on mount
  useEffect(() => {
    generateEnding();
  }, []);

  const generateEnding = async () => {
    if (!introStory) {
      setError('Missing intro story. Cannot generate ending.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Play projector sound effect
    const projectorAudio = new Audio(projectorSound);
    projectorAudio.volume = 0.5;
    projectorAudio.play().catch(console.error);

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
        // Game stats from form
        ...(formData.finalHorrorLevel && { finalHorrorLevel: formData.finalHorrorLevel }),
        ...(formData.weaponUsed && { weaponUsed: formData.weaponUsed }),
        ...(formData.finalGirlHealth !== undefined && { finalGirlHealth: formData.finalGirlHealth }),
        ...(formData.killerHealth !== undefined && { killerHealth: formData.killerHealth }),
        ...(formData.victimsSaved !== undefined && { victimsSaved: formData.victimsSaved }),
        ...(formData.victimsKilled !== undefined && { victimsKilled: formData.victimsKilled }),
        ...(formData.endingSubLocation && { endingSubLocation: formData.endingSubLocation }),
        ...(formData.gameHighlights && { gameHighlights: formData.gameHighlights }),
      };

      console.log('Generating ending with payload:', payload);

      const { data, error: fnError } = await supabase.functions.invoke('generate-ending', {
        body: payload,
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Failed to generate ending');
      }

      if (data?.ending) {
        setEndingStory(data.ending);
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No ending returned from the generator');
      }
    } catch (err) {
      console.error('Ending generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate ending';
      setError(errorMessage);
      toast.error('Ending generation failed', {
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNarrate = async () => {
    if (!endingStory) return;
    
    // If already playing, stop and reset
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    // Prime an Audio element immediately (synchronously in the tap handler)
    // so iOS Safari marks it as user-gesture-activated.
    const audio = createPrimedAudio();
    audioRef.current = audio;

    setIsNarrating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/narrate-story`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: endingStory }),
        }
      );

      if (!response.ok) {
        throw new Error(`Narration request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Convert base64 to a Blob URL (avoids iOS data-URI size limits)
      const blob = base64ToBlob(data.audioContent, 'audio/mpeg');
      const blobUrl = URL.createObjectURL(blob);
      audio.src = blobUrl;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(blobUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(blobUrl);
        toast.error('Audio playback failed');
      };

      await audio.play();
      setIsPlaying(true);
      
    } catch (err) {
      console.error('Narration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate narration';
      toast.error('Narration failed', { description: errorMessage });
    } finally {
      setIsNarrating(false);
    }
  };

  const handleSave = () => {
    if (endingStory) {
      onSave(endingStory, posterImageUrl || undefined);
    }
  };

  return (
    <div className="relative min-h-[80vh]">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ 
          backgroundImage: `url(${nowPlayingBg})`,
          opacity: 0.4,
        }}
      />
      
      {/* Film Grain Overlay */}
      <div className="film-grain fixed inset-0 pointer-events-none opacity-[0.07]" />
      
      {/* Vignette */}
      <div className="vignette fixed inset-0 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-6 sm:py-8 pt-16 sm:pt-24 px-3 sm:px-4">

        {/* Title */}
        <h1 
          className={`font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.1em] sm:tracking-[0.15em] uppercase mb-1 sm:mb-2 text-center ${
            isWin ? 'text-secondary neon-text' : 'text-primary blood-glow'
          }`}
        >
          The End
        </h1>
        <p className="font-vhs text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 text-center px-2">
          {result.finalGirl} {isWin ? 'survived' : 'fell to'} {result.killer} at {result.location}
        </p>

        {/* Story Container */}
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {/* Action Buttons - Above text, stack on mobile */}
          {endingStory && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-2">
              <button
                onClick={handleNarrate}
                disabled={isNarrating}
                className="vcr-tape-button flex items-center justify-center gap-2 px-4 sm:px-6 py-3 font-display text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-300 disabled:opacity-50 min-h-[44px]"
              >
                {isNarrating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPlaying ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                {isNarrating ? 'Generating...' : isPlaying ? 'Stop' : 'Narrate'}
              </button>
              
              <PosterPromptModal
                introStory={introStory}
                endingNarration={endingStory}
                killer={result.killer}
                location={result.location}
                finalGirl={result.finalGirl}
                outcome={result.outcome}
              >
                <button className="vcr-tape-button flex items-center justify-center gap-2 px-4 sm:px-6 py-3 font-display text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-300 min-h-[44px]">
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
          )}
          
          {/* Story Text */}
          <div className="w-full px-1 sm:px-0">
            <div className="scenario-description p-4 sm:p-6 rounded-sm">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="font-vhs text-xs sm:text-sm text-muted-foreground animate-pulse">
                    The projector is warming up...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-4">
                  <p className="font-vhs text-xs sm:text-sm text-destructive text-center px-2">
                    {error}
                  </p>
                  <button
                    onClick={generateEnding}
                    className="font-display text-xs sm:text-sm tracking-wider uppercase px-4 py-2 vcr-tape-button min-h-[44px]"
                  >
                    Try Again
                  </button>
                </div>
              ) : endingStory ? (
                <p className="font-vhs text-sm sm:text-sm text-muted-foreground leading-relaxed sm:leading-relaxed whitespace-pre-wrap">
                  {renderFormattedText(endingStory)}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="font-vhs text-sm text-muted-foreground">
                    Waiting for the ending...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Show when story is loaded */}
          {endingStory && !isGenerating && !error && (
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-4 justify-center items-center mt-6 sm:mt-8 px-2">
              <button
                onClick={handleSave}
                className={`outcome-btn ${isWin ? 'outcome-btn-won' : 'outcome-btn-lost'} group relative w-full sm:w-auto min-w-[200px] sm:min-w-[240px] h-14 sm:h-16 overflow-hidden rounded-sm transition-all duration-200 order-first`}
              >
                <span className={`relative z-10 font-display text-xl sm:text-2xl tracking-[0.2em] uppercase ${isWin ? 'text-secondary' : 'text-primary'} drop-shadow-lg`}>
                  SAVE
                </span>
              </button>
              <button
                onClick={onDiscard}
                className={`outcome-btn ${isWin ? 'outcome-btn-won' : 'outcome-btn-lost'} group relative w-full sm:w-auto min-w-[200px] sm:min-w-[240px] h-11 sm:h-16 overflow-hidden rounded-sm transition-all duration-200 order-last`}
              >
                <span className={`relative z-10 font-display text-base sm:text-2xl tracking-[0.2em] uppercase text-muted-foreground drop-shadow-lg`}>
                  DISCARD
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheEnd;
