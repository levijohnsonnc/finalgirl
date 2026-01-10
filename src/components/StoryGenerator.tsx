import { useState } from 'react';
import { Film, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoryGeneratorProps {
  killer: string | null;
  location: string | null;
  finalGirl: string | null;
}

export const StoryGenerator = ({ killer, location, finalGirl }: StoryGeneratorProps) => {
  const [story, setStory] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = killer && location && finalGirl;

  const generateStory = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);

    try {
      // TODO: API integration will be added later
      // For now, show a placeholder message
      setError('API integration coming soon');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-title text-xl text-foreground tracking-wide flex items-center gap-2">
          <Film className="w-5 h-5 text-primary" />
          MOVIE SYNOPSIS
        </h3>
        <Button
          onClick={generateStory}
          disabled={!canGenerate || isGenerating}
          className={cn(
            "vcr-button font-vhs glitch-hover",
            canGenerate && !isGenerating && "bg-primary hover:bg-primary/90"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              GENERATING...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              START MOVIE
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="font-vhs text-sm text-primary">
          ✕ {error}
        </p>
      )}

      {(story || posterUrl) && (
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {posterUrl && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
              <img
                src={posterUrl}
                alt="Generated movie poster"
                className="w-full rounded border-2 border-primary/50 shadow-blood"
              />
              <div className="absolute bottom-2 left-2 right-2 z-20">
                <div className="vhs-label text-center">
                  <span className="font-vhs text-xs text-secondary">VHS ORIGINAL</span>
                </div>
              </div>
            </div>
          )}
          
          {story && (
            <div className="space-y-4">
              <div className="vhs-label border-l-4 border-primary p-4">
                <p className="font-vhs text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {story}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {!story && !posterUrl && !isGenerating && canGenerate && (
        <p className="font-vhs text-sm text-muted-foreground text-center py-8">
          [ PRESS "START MOVIE" TO GENERATE YOUR VHS SYNOPSIS ]
        </p>
      )}
    </div>
  );
};
