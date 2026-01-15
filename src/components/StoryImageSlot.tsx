import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StoryImageSlotProps {
  position: number;
  killer: string;
  location: string;
  finalGirl: string;
  storyLoaded: boolean;
  storySnippet?: string;
}

const StoryImageSlot = ({
  position,
  killer,
  location,
  finalGirl,
  storyLoaded,
  storySnippet,
}: StoryImageSlotProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storyLoaded) return;

    // Stagger the requests slightly based on position to avoid hammering the API
    const delay = (position - 1) * 500;
    const timer = setTimeout(() => {
      generateImage();
    }, delay);

    return () => clearTimeout(timer);
  }, [storyLoaded]);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-story-image', {
        body: {
          position,
          killer,
          location,
          finalGirl,
          storySnippet: storySnippet?.slice(0, 500),
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(`Failed to generate image for position ${position}:`, err);
      setError('Signal lost');
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionLabel = () => {
    switch (position) {
      case 1: return 'The Location';
      case 2: return 'The Killer';
      case 3: return 'The Final Girl';
      case 4: return 'The Confrontation';
      default: return 'Scene';
    }
  };

  return (
    <div className="story-image-slot">
      {isLoading ? (
        <div className="absolute inset-0 mystery-static flex items-center justify-center">
          <div className="text-center">
            <div className="font-vhs text-xs text-muted-foreground/60 animate-pulse">
              TRACKING...
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 bg-card flex items-center justify-center">
          <div className="text-center">
            <div className="font-vhs text-xs text-muted-foreground/40">
              [SIGNAL LOST]
            </div>
          </div>
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={getPositionLabel()}
          className="absolute inset-0 w-full h-full object-cover story-image-loaded"
        />
      ) : (
        <div className="absolute inset-0 mystery-static flex items-center justify-center">
          <div className="font-vhs text-xs text-muted-foreground/40">
            {getPositionLabel()}
          </div>
        </div>
      )}
      
      {/* VHS label overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
        <span className="font-vhs text-[10px] text-muted-foreground/60 uppercase tracking-wider">
          {getPositionLabel()}
        </span>
      </div>
    </div>
  );
};

export default StoryImageSlot;
