import { useState, useEffect } from 'react';
import { Trophy, Skull, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getFilmDetails } from '@/types/featureFilmDetails';
import { getFilmIdByKiller, getFilmIdByLocation, getFilmIdByFinalGirl } from '@/types/gameData';
import { toast } from 'sonner';
import nowPlayingBg from '@/assets/now-playing-bg.png';
import StoryImageSlot from '@/components/StoryImageSlot';

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

  const handleWon = () => {
    console.log('Game Won!', { killer, location, finalGirl, setupScenario, startingEvent });
    toast.success('Victory! The Final Girl survived!');
    // TODO: Save result to database
  };

  const handleLost = () => {
    console.log('Game Lost!', { killer, location, finalGirl, setupScenario, startingEvent });
    toast.error('Defeat... The killer claims another victim.');
    // TODO: Save result to database
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

        {/* Story Container with Side Images */}
        <div className="w-full flex gap-6 items-start justify-center">
          {/* Left Images - Desktop only */}
          <div className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">
            <StoryImageSlot
              position={1}
              fullStory={story || ''}
              storyLoaded={!!story}
            />
            <StoryImageSlot
              position={2}
              fullStory={story || ''}
              storyLoaded={!!story}
            />
          </div>

          {/* Story Content */}
          <div className="flex-1 max-w-3xl">
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

          {/* Right Images - Desktop only */}
          <div className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">
            <StoryImageSlot
              position={3}
              fullStory={story || ''}
              storyLoaded={!!story}
            />
            <StoryImageSlot
              position={4}
              fullStory={story || ''}
              storyLoaded={!!story}
            />
          </div>
        </div>

        {/* Outcome Buttons */}
        <div className="flex gap-6 mt-10">
          <button
            onClick={handleWon}
            disabled={isGenerating}
            className="outcome-btn outcome-btn-won flex items-center gap-3 px-8 py-4 font-display text-lg tracking-[0.15em] uppercase transition-all duration-300"
          >
            <Trophy className="w-5 h-5" />
            Won
          </button>
          <button
            onClick={handleLost}
            disabled={isGenerating}
            className="outcome-btn outcome-btn-lost flex items-center gap-3 px-8 py-4 font-display text-lg tracking-[0.15em] uppercase transition-all duration-300"
          >
            <Skull className="w-5 h-5" />
            Lost
          </button>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
