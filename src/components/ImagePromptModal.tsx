import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
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
import { toast } from 'sonner';

interface ImagePromptModalProps {
  story: string;
  killer: string;
  location: string;
  finalGirl: string;
  children: React.ReactNode;
}

// Simple markdown-like renderer for **bold** and *italic* text
const renderFormattedText = (text: string) => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for **bold** first
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
    if (boldMatch) {
      if (boldMatch[1]) {
        parts.push(<span key={key++}>{boldMatch[1]}</span>);
      }
      parts.push(<strong key={key++} className="font-bold text-foreground">{boldMatch[2]}</strong>);
      remaining = boldMatch[3];
      continue;
    }

    // Check for *italic*
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*(.*)/s);
    if (italicMatch) {
      if (italicMatch[1]) {
        parts.push(<span key={key++}>{italicMatch[1]}</span>);
      }
      parts.push(<em key={key++} className="italic">{italicMatch[2]}</em>);
      remaining = italicMatch[3];
      continue;
    }

    // No more formatting, add remaining text
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }

  return parts;
};

export const ImagePromptModal = ({
  story,
  killer,
  location,
  finalGirl,
  children,
}: ImagePromptModalProps) => {
  const [copied, setCopied] = useState(false);

  const killerDescription = getKillerDescription(killer);
  const finalGirlDescription = getFinalGirlDescription(finalGirl);
  const locationDescription = getLocationDescription(location);

  const hasAnyDescriptions = killerDescription || finalGirlDescription || locationDescription;

  const buildPrompt = () => {
    // Build character context section
    const characterContext: string[] = [];
    if (finalGirlDescription) {
      characterContext.push(`FINAL GIRL - ${finalGirl}: ${finalGirlDescription}`);
    }
    if (killerDescription) {
      characterContext.push(`KILLER - ${killer}: ${killerDescription}`);
    }
    if (locationDescription) {
      characterContext.push(`LOCATION - ${location}: ${locationDescription}`);
    }

    const characterSection = characterContext.length > 0 
      ? characterContext.join('\n\n')
      : 'No detailed visual descriptions available.';

    return `You are a horror film cinematographer. Based on this story, describe and then generate the SINGLE most dramatic, emotionally powerful image for this scene.

**CRITICAL RULES:**
- Focus on ONE moment of tension, fear, or confrontation
- You do NOT need to show all characters or the full location
- A tight close-up of terrified eyes can be more powerful than a wide establishing shot
- IGNORE minor NPCs or background characters mentioned in the story
- Choose: character close-up, killer reveal, atmospheric location detail, or intense confrontation
- Describe camera angle, framing, and emotional focus

**MAIN CHARACTERS** (use ONLY if they appear in your chosen moment):
${characterSection}

**STORY:**
${story}

---

Generate an ultra photorealistic 1980s horror film still based on your chosen moment.
Style: Practical lighting, shallow depth of field, cinematic tension, 35mm film grain.
DO NOT create a movie poster or group portrait.
Muted, desaturated color palette. Widescreen composition. No text or titles.`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPrompt());
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-background/95 backdrop-blur-sm border-primary/30">
        {/* Film Grain Overlay */}
        <div className="film-grain absolute inset-0 pointer-events-none opacity-[0.05] rounded-lg" />
        
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-[0.15em] uppercase text-foreground">
            Image Generation Prompt
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex flex-col gap-4">
          <p className="font-vhs text-xs text-muted-foreground">
            Copy this prompt and paste it into your favorite image generation LLM (ChatGPT, Gemini, etc.)
          </p>

          <div className="relative overflow-y-auto max-h-[50vh] p-4 bg-black/40 border border-primary/20 rounded-sm">
            <div className="font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {renderFormattedText(buildPrompt())}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="vcr-tape-button flex items-center justify-center gap-2 px-6 py-3 font-display text-sm tracking-[0.15em] uppercase transition-all duration-300"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
