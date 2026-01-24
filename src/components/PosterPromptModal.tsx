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

    // Build outcome-specific composition guidance
    const outcomeComposition = isVictory
      ? `OUTCOME: SURVIVED
The Final Girl defeated ${killer} and lived. Show survival with a cost—exhaustion, injury, smoke, emergency lights, a dawn that doesn't feel safe. The Killer is stopped implicitly (discarded mask, dropped weapon, police tape in background, looming silhouette fading). Relief should taste temporary. Use a sickly dawn/amber accent to signal hard-won survival.`
      : `OUTCOME: FALLEN
${killer} prevailed. The Final Girl's fate is implied, never shown explicitly. Center the dread and aftermath—absence, a dropped weapon, a final flashlight beam, a reflection, a witness seeing too late, an empty space where she stood. Use cool pallor/blue accent to signal loss. The Killer should dominate the composition, victorious but still threatening.`;

    return `You are an award-winning horror key art designer creating a print-ready movie poster for a fictional 1980s-style slasher film based on a completed game.

=== STORY CONTEXT (CANON) ===

OPENING STORY:
${introStory || '[Opening story not available]'}

ENDING STORY:
${endingNarration || '[Ending story not generated yet - generate it first for best results]'}

=== CHARACTER & LOCATION REFERENCES ===

FINAL GIRL — ${finalGirl}:
${finalGirlDesc || `A survivor named ${finalGirl}. Use contextual details from the stories above.`}

KILLER — ${killer}:
${killerDesc || `A terrifying killer known as ${killer}. Use contextual details from the stories above.`}

LOCATION — ${location}:
${locationDesc || `A dangerous place called ${location}. Use contextual details from the stories above.`}

=== ${outcomeComposition} ===

=== POSTER REQUIREMENTS ===

FORMAT: Vertical one-sheet, 2:3 aspect ratio, high resolution print-ready.

STYLE: Classic 1980s paperback/VHS horror key art. Painted or painterly realism with dramatic lighting, subtle film grain, and paper texture. NOT photorealistic, NOT cartoony, NOT glossy modern superhero style.

CONTENT RATING: PG-13. No explicit gore, dismemberment, or sexual content. Imply threat and aftermath through shadows, posture, stains, torn fabric, broken props, smoke, rain, warning lights.

VISUAL FOCUS: Extract ONE powerful moment from the ending story. Do NOT create a mash-up of everything. A single striking image is more powerful than a cluttered collage.

ICONOGRAPHY: Include 2–4 symbolic elements tied to the run (the weapon used, a specific prop or location detail, a saved victim token like a bracelet or ID badge, a distinctive killer signature). Don't overstuff.

COMPOSITION: Big central subject + secondary ominous shape. Clear focal point with strong silhouette readability from across a room. The Final Girl must feel like a person the viewer worries about.

LIGHTING & PALETTE: Match lighting to the location atmosphere. Limited palette with one accent color that signals the outcome. Examples:
- Mall: neon glow, flickering store signs
- Streets: sodium streetlights, wet asphalt reflections  
- Woods: moonlight through branches, campfire embers
- Asylum: harsh fluorescent, clinical green tint
- Carnival: spinning ride lights, red/yellow strobes

TYPOGRAPHY (integrated into the poster, not floating):
- TITLE: Invent a punchy 1–3 word horror movie title inspired by the location and story (don't just use the raw location name)
- TAGLINE: Invent ONE line (max 10 words) that reflects the outcome and ending story
- BILLING BLOCK: Small generic text at bottom (unreadable fine print is fine)

=== YOUR TASK ===

1. Extract the single most poster-worthy moment from the ending story
2. Identify the key threat established in the opening story
3. Design the poster around that moment using cinematic composition and 80s horror key art visual language
4. Output a single cohesive image generation prompt

=== OUTPUT ===

Return ONLY the final image prompt as one cohesive paragraph. No headings, no bullet points, no analysis. End with: "Vertical 2:3 aspect ratio, high resolution, 1980s painted horror poster style with film grain texture."`;
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
