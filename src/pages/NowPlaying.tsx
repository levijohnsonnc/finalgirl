import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ImageIcon, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getFilmDetails } from '@/types/featureFilmDetails';
import { getFilmIdByKiller, getFilmIdByLocation, getFilmIdByFinalGirl } from '@/types/gameData';
import { toast } from 'sonner';
import nowPlayingBg from '@/assets/now-playing-bg.png';
import projectorSound from '@/assets/sounds/projector-start.mp3';
import { ImagePromptModal } from '@/components/ImagePromptModal';

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

interface NowPlayingProps {
  killer: string;
  location: string;
  finalGirl: string;
  setupScenario: string | null;
  startingEvent: string | null;
  filmId: string | null;
  onBack: () => void;
  onGameEnd: (outcome: 'won' | 'lost', story?: string) => void;
}

const NowPlaying = ({
  killer,
  location,
  finalGirl,
  setupScenario,
  startingEvent,
  filmId,
  onBack,
  onGameEnd,
}: NowPlayingProps) => {
  const [story, setStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-generate story on mount
  useEffect(() => {
    generateStory();
  }, []);

  const generateStory = async () => {
    setIsGenerating(true);
    setError(null);

    // Play projector sound effect
    const projectorAudio = new Audio(projectorSound);
    projectorAudio.volume = 0.5;
    projectorAudio.play().catch(console.error);

    try {
      // Look up each entity from its OWN film (supports cross-film combinations)
      const killerFilmId = getFilmIdByKiller(killer);
      const locationFilmId = getFilmIdByLocation(location);
      const finalGirlFilmId = getFilmIdByFinalGirl(finalGirl);

      const killerFilmDetails = killerFilmId ? getFilmDetails(killerFilmId) : null;
      const locationFilmDetails = locationFilmId ? getFilmDetails(locationFilmId) : null;
      const finalGirlFilmDetails = finalGirlFilmId ? getFilmDetails(finalGirlFilmId) : null;

      const killerDetails = killerFilmDetails?.killer;
      const locationDetails = locationFilmDetails?.location;
      const finalGirlDetails = finalGirlFilmDetails?.finalGirls?.find(fg => fg.name === finalGirl);

      // Build payload with complete objects matching the edge function's StoryRequest interface
      const payload = {
        killer: {
          name: killer,
          description: killerDetails?.description || `A terrifying killer known as ${killer}.`
        },
        location: {
          name: location,
          description: locationDetails?.description || `A dangerous place called ${location}.`
        },
        finalGirl: {
          name: finalGirl,
          backstory: finalGirlDetails?.backstory || `A survivor named ${finalGirl}.`
        },
        startingEvent: startingEvent ? {
          name: startingEvent,
          description: locationDetails?.events?.find(e => e.name === startingEvent)?.description || startingEvent
        } : undefined,
        startingSetup: setupScenario ? {
          name: setupScenario,
          description: locationDetails?.setupCards?.find(s => s.name === setupScenario)?.description || setupScenario
        } : undefined
      };

      console.log('Generating story with payload:', payload);

      const { data, error: fnError } = await supabase.functions.invoke('generate-story', {
        body: payload,
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Failed to generate story');
      }

      if (data?.story) {
        setStory(data.story);
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No story returned from the generator');
      }
    } catch (err) {
      console.error('Story generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
      setError(errorMessage);
      toast.error('Story generation failed', {
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNarrate = async () => {
    if (!story) return;
    
    // If already playing, stop and reset
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

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
          body: JSON.stringify({ text: story }),
        }
      );

      if (!response.ok) {
        throw new Error(`Narration request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Use data URI for audio playback
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
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
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-2 left-2 sm:top-4 sm:left-4 flex items-center gap-2 font-vhs text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Casting</span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground tracking-[0.1em] sm:tracking-[0.15em] uppercase mb-1 sm:mb-2 text-center">
          Now Playing
        </h1>
        <p className="font-vhs text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 text-center px-2">
          {killer} vs {finalGirl} at {location}
        </p>

        {/* Story Container */}
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {/* Action Buttons - Above text, stack on mobile */}
          {story && (
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
              
              <ImagePromptModal
                story={story}
                killer={killer}
                location={location}
                finalGirl={finalGirl}
              >
                <button className="vcr-tape-button flex items-center justify-center gap-2 px-4 sm:px-6 py-3 font-display text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-300 min-h-[44px]">
                  <ImageIcon className="w-4 h-4" />
                  Image Prompt
                </button>
              </ImagePromptModal>
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
                    onClick={generateStory}
                    className="font-display text-xs sm:text-sm tracking-wider uppercase px-4 py-2 vcr-tape-button min-h-[44px]"
                  >
                    Try Again
                  </button>
                </div>
              ) : story ? (
                <p className="font-vhs text-sm sm:text-sm text-muted-foreground leading-relaxed sm:leading-relaxed whitespace-pre-wrap">
                  {renderFormattedText(story)}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="font-vhs text-sm text-muted-foreground">
                    Waiting for the story...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Won/Lost Buttons - Show when story is loaded */}
          {story && !isGenerating && !error && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6 sm:mt-8 px-2">
              <button
                onClick={() => onGameEnd('won', story || undefined)}
                className="outcome-btn outcome-btn-won group relative w-full sm:w-auto min-w-[200px] sm:min-w-[240px] h-14 sm:h-16 overflow-hidden rounded-sm transition-all duration-200"
              >
                <span className="relative z-10 font-display text-xl sm:text-2xl tracking-[0.2em] uppercase text-secondary drop-shadow-lg">
                  WON
                </span>
              </button>
              
              <button
                onClick={() => onGameEnd('lost', story || undefined)}
                className="outcome-btn outcome-btn-lost group relative w-full sm:w-auto min-w-[200px] sm:min-w-[240px] h-14 sm:h-16 overflow-hidden rounded-sm transition-all duration-200"
              >
                <span className="relative z-10 font-display text-xl sm:text-2xl tracking-[0.2em] uppercase text-primary drop-shadow-lg">
                  LOST
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
