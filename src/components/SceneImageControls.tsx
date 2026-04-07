import { ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { getKillerDescription } from '@/data/killerDescriptions';

interface SceneImageControlsProps {
  story: string;
  killer: string;
  finalGirl: string;
  location: string;
  sceneType: 'beginning' | 'ending';
  generatedImageUrl: string | null;
  onImageGenerated: (url: string) => void;
}

const SceneImageControls = ({
  story,
  killer,
  finalGirl,
  location,
  sceneType,
  generatedImageUrl,
  onImageGenerated,
}: SceneImageControlsProps) => {
  const {
    isAuthenticated,
    hasApiKey,
    isGeneratingImage,
    generateImage,
  } = useImageGeneration();

  const handleGenerate = async () => {
    const url = await generateImage({ story, killer, killerDescription: getKillerDescription(killer), finalGirl, location, sceneType });
    if (url) onImageGenerated(url);
  };

  // Not signed in or no key — show hint
  if (!isAuthenticated || !hasApiKey) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 border border-muted-foreground/10 rounded-sm w-full sm:w-auto">
        <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/50" />
        <p className="font-vhs text-[10px] text-muted-foreground/60">
          Add an image API key in My Collection to generate scene images.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={isGeneratingImage}
      className="vcr-tape-button flex items-center justify-center gap-2 px-4 sm:px-6 py-3 font-display text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-300 disabled:opacity-50 min-h-[44px] w-full sm:w-auto"
    >
      {isGeneratingImage ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : generatedImageUrl ? (
        <RefreshCw className="w-4 h-4" />
      ) : (
        <ImageIcon className="w-4 h-4" />
      )}
      {isGeneratingImage ? 'Generating...' : generatedImageUrl ? 'Regenerate Scene' : 'Generate Scene'}
    </button>
  );
};

export default SceneImageControls;
