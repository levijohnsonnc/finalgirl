import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StoryImageSlotProps {
  position: number;
  fullStory: string;
  storyLoaded: boolean;
}

const StoryImageSlot = ({
  position,
  fullStory,
  storyLoaded,
}: StoryImageSlotProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sceneLabel, setSceneLabel] = useState<string>(`Scene ${position}`);

  useEffect(() => {
    if (!storyLoaded || !fullStory) return;

    // Stagger the requests based on position to avoid hammering the API
    const delay = (position - 1) * 1500;
    const timer = setTimeout(() => {
      generateImage();
    }, delay);

    return () => clearTimeout(timer);
  }, [storyLoaded, fullStory]);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-story-image', {
        body: {
          position,
          fullStory,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        // Use the extracted visual description as the scene label
        if (data.visualDescription) {
          // Truncate to first 30 chars for label
          const shortLabel = data.visualDescription.length > 35 
            ? data.visualDescription.slice(0, 32) + '...'
            : data.visualDescription;
          setSceneLabel(shortLabel);
        }
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
          alt={sceneLabel}
          className="absolute inset-0 w-full h-full object-cover story-image-loaded"
        />
      ) : (
        <div className="absolute inset-0 mystery-static flex items-center justify-center">
          <div className="font-vhs text-xs text-muted-foreground/40">
            Scene {position}
          </div>
        </div>
      )}
      
      {/* VHS label overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2">
        <span className="font-vhs text-[10px] text-muted-foreground/70 uppercase tracking-wider line-clamp-2">
          {sceneLabel}
        </span>
      </div>
    </div>
  );
};

export default StoryImageSlot;
