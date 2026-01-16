import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getFilmDetails } from '@/types/featureFilmDetails';
import { getFilmIdByKiller, getFilmIdByLocation, getFilmIdByFinalGirl } from '@/types/gameData';
import { toast } from 'sonner';
import nowPlayingBg from '@/assets/now-playing-bg.png';

interface NowPlayingProps {
  killer: string;
  location: string;
  finalGirl: string;
  setupScenario: string | null;
  startingEvent: string | null;
  filmId: string | null;
  onBack: () => void;
}

const NowPlaying = ({
  killer,
  location,
  finalGirl,
  setupScenario,
  startingEvent,
  filmId,
  onBack,
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
      <div className="relative z-10 flex flex-col items-center py-8 pt-24 px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-2 font-vhs text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Casting
        </button>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl text-foreground tracking-[0.15em] uppercase mb-2">
          Now Playing
        </h1>
        <p className="font-vhs text-sm text-muted-foreground mb-8">
          {killer} vs {finalGirl} at {location}
        </p>

        {/* Story Container with Narrate Button */}
        <div className="w-full max-w-3xl flex items-start gap-6">
          {/* Narrate Button - Left of text */}
          <div className="flex-shrink-0 pt-6">
            {story && (
              <button
                onClick={handleNarrate}
                disabled={isNarrating}
                className="vcr-tape-button px-6 py-3 font-display text-sm tracking-[0.15em] uppercase transition-all duration-300"
              >
                {isNarrating ? 'Generating...' : isPlaying ? 'Stop' : 'Narrate'}
              </button>
            )}
          </div>
          
          {/* Story Text */}
          <div className="flex-1">
            <div className="scenario-description p-6 rounded-sm">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="font-vhs text-sm text-muted-foreground animate-pulse">
                    The projector is warming up...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <p className="font-vhs text-sm text-destructive">
                    {error}
                  </p>
                  <button
                    onClick={generateStory}
                    className="font-display text-sm tracking-wider uppercase px-4 py-2 vcr-tape-button"
                  >
                    Try Again
                  </button>
                </div>
              ) : story ? (
                <p className="font-vhs text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {story}
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
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
