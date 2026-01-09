import { useState } from 'react';
import { Film, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoryGeneratorProps {
  killer: string | null;
  location: string | null;
  finalGirl: string | null;
  apiKey: string;
}

export const StoryGenerator = ({ killer, location, finalGirl, apiKey }: StoryGeneratorProps) => {
  const [story, setStory] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = killer && location && finalGirl && apiKey;

  const generateStory = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Generate story using OpenAI
      const storyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a horror movie copywriter from the 1980s writing VHS back-of-box descriptions. Write in a dramatic, pulpy style with short punchy sentences. Always build tension and end with a cliffhanger question.`
            },
            {
              role: 'user',
              content: `Write a 3-paragraph VHS back-of-box synopsis for a slasher movie featuring:
              - Killer: ${killer}
              - Location: ${location}  
              - Final Girl: ${finalGirl}
              
              Make it dramatic, scary, and authentic to 80s horror marketing. Include the character names naturally.`
            }
          ],
          max_tokens: 500,
          temperature: 0.8,
        }),
      });

      if (!storyResponse.ok) {
        throw new Error('Failed to generate story');
      }

      const storyData = await storyResponse.json();
      setStory(storyData.choices[0].message.content);

      // Generate poster using DALL-E
      const posterResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `80s hand-painted horror movie VHS cover art. A dramatic slasher movie poster featuring ${killer} as the villain lurking in ${location}, with ${finalGirl} as the terrified heroine. Style: Drew Struzan, painted, dramatic lighting, neon colors, grain texture, vintage horror aesthetic. Include fake wear marks and VHS rental sticker aesthetic.`,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        }),
      });

      if (!posterResponse.ok) {
        console.warn('Failed to generate poster, continuing without it');
      } else {
        const posterData = await posterResponse.json();
        setPosterUrl(posterData.data[0].url);
      }

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

      {!apiKey && (
        <p className="font-vhs text-sm text-accent">
          ⚠ Add your OpenAI API key in The Archive to enable story generation
        </p>
      )}

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
