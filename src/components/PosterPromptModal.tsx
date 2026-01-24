import React, { ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getFinalGirlDescription } from '@/data/finalGirlDescriptions';
import { getKillerDescription } from '@/data/killerDescriptions';
import { getLocationDescription } from '@/data/locationDescriptions';

interface PosterPromptModalProps {
  introStory?: string;
  endingNarration?: string;
  killer: string;
  location: string;
  finalGirl: string;
  outcome: 'won' | 'lost';
  children: ReactNode;
}

export const PosterPromptModal: React.FC<PosterPromptModalProps> = ({
  introStory,
  endingNarration,
  killer,
  location,
  finalGirl,
  outcome,
  children,
}) => {
  const [copied, setCopied] = React.useState(false);

  const buildPrompt = (): string => {
    const killerDesc = getKillerDescription(killer);
    const locationDesc = getLocationDescription(location);
    const finalGirlDesc = getFinalGirlDescription(finalGirl);

    const isVictory = outcome === 'won';
    const outcomeText = isVictory 
      ? `The Final Girl, ${finalGirl}, SURVIVED. She defeated ${killer}. Show her triumphant but battle-worn.`
      : `The Final Girl, ${finalGirl}, FELL to ${killer}. The killer stands victorious. Show the tragedy of her defeat.`;

    return `Create a vintage 1980s VHS horror movie poster for this story.

=== OUTCOME ===
${outcomeText}

${introStory ? `=== THE STORY ===
${introStory}

` : ''}${endingNarration ? `=== THE ENDING ===
${endingNarration}

` : ''}=== CHARACTERS ===
FINAL GIRL - ${finalGirl}:
${finalGirlDesc || `A survivor named ${finalGirl}.`}

KILLER - ${killer}:
${killerDesc || `A terrifying killer known as ${killer}.`}

=== LOCATION ===
${location}:
${locationDesc || `A dangerous place called ${location}.`}

=== STYLE REQUIREMENTS ===
- Painted illustration style, NOT photorealistic
- Classic VHS box art / video store rental aesthetic
- Bold, dramatic title treatment at top
- Tagline at bottom in italics
- Rich, saturated colors with heavy shadows
- 2:3 aspect ratio (portrait orientation)
- Weathered texture overlay, slight wear on edges
- ${isVictory ? 'Triumphant, heroic composition with survivor prominent' : 'Ominous, threatening composition with killer dominant'}
- 35mm film grain effect
- Hand-painted look similar to Drew Struzan or Graham Humphreys style`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPrompt());
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-lg tracking-[0.1em] uppercase text-foreground">
            Movie Poster Prompt
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="scenario-description p-4 rounded-sm max-h-[50vh] overflow-y-auto">
            <pre className="font-vhs text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {buildPrompt()}
            </pre>
          </div>
          
          <button
            onClick={handleCopy}
            className="vcr-tape-button w-full flex items-center justify-center gap-2 px-4 py-3 font-display text-sm tracking-[0.15em] uppercase transition-all duration-300 min-h-[44px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Prompt
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
