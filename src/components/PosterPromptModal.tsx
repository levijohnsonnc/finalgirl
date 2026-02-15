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

    // Randomized composition seed for variety
    const compositions = [
      'Close-up portrait: the Final Girl\'s face fills the frame, the killer\'s presence suggested only by a shadow or reflection.',
      'Wide establishing shot: the location dominates, with small figures dwarfed by the environment. The horror is in the scale.',
      'Over-the-shoulder: we see what the Final Girl sees—or what\'s behind her. One figure in focus, threat in bokeh.',
      'Extreme low angle: looking up at the dominant figure (winner of the encounter), architecture or trees looming overhead.',
      'Reflection or mirror: the scene is shown through a reflective surface—a window, puddle, broken mirror, TV screen, knife blade.',
      'Split composition: the poster is divided diagonally or vertically, one half showing the killer\'s world, the other the Final Girl\'s.',
    ];
    const compositionSeed = compositions[Math.floor(Math.random() * compositions.length)];

    // Outcome mood (no clichés, multiple options so the AI picks one)
    const outcomeMood = isVictory
      ? `${finalGirl} survived. Convey this through ONE of these (pick the most cinematic for the story): exhaustion in her posture, a weapon held loosely at her side, smoke or dust still settling, the quiet stillness after violence ends, a first hint of dawn light that feels more eerie than hopeful. The killer's defeat should be implied—never show police tape, chalk outlines, or explicit crime scene imagery.`
      : `${killer} prevailed. Convey this through ONE of these (pick the most cinematic for the story): the killer's silhouette filling the frame with nothing left to oppose them, an empty space where someone used to stand, a flickering light illuminating absence, a personal item left behind on the ground, a door hanging open to darkness. The Final Girl's fate is implied, never shown.`;

    return `Generate a painted 1980s horror movie poster image. Vertical 2:3 aspect ratio, high resolution.

SCENE — based on this story:
${introStory || '[No opening story available]'}

${endingNarration || '[No ending story — use the opening story and characters to infer a dramatic conclusion]'}

CHARACTERS:
• ${finalGirl}: ${finalGirlDesc || 'A resourceful survivor. Use story context for appearance.'}
• ${killer}: ${killerDesc || 'A terrifying antagonist. Use story context for appearance.'}

LOCATION: ${location} — ${locationDesc || 'Use story context for setting details.'}

OUTCOME: ${outcomeMood}

COMPOSITION: ${compositionSeed}

STYLE: Painterly realism in the tradition of 1980s VHS box art and horror paperback covers. Dramatic chiaroscuro lighting, visible brushwork, subtle film grain and paper texture. NOT photorealistic, NOT digital/glossy, NOT cartoonish. PG-13: imply threat through atmosphere, posture, and shadow — no explicit gore.

PALETTE: Draw colors from the location's natural atmosphere (neon for malls, moonlight for woods, sodium lamps for streets, fluorescent for institutions). Let the mood shift based on outcome — warmer if survived, cooler if fallen — but don't force a single accent color.

TYPOGRAPHY (painted into the image, not floating): Invent a punchy 1–3 word horror movie title inspired by the story. Add one tagline (max 10 words) reflecting the outcome. Small billing block at the bottom.

Extract the single most powerful visual moment from the ending story and build the entire poster around that one image. Less is more.`;
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

  const hasEndingStory = !!endingNarration;

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
          {!hasEndingStory && (
            <div className="p-3 rounded-sm bg-destructive/10 border border-destructive/30">
              <p className="font-vhs text-xs text-destructive">
                ⚠ Ending story not generated yet. Generate the ending first for best poster results.
              </p>
            </div>
          )}
          
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
