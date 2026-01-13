import { useEffect, useCallback } from 'react';
import { X, Shuffle } from 'lucide-react';
import { FEATURE_FILMS } from '@/types/gameData';

interface CastingPickerProps {
  type: 'killer' | 'location' | 'finalGirl';
  options: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

const PICKER_TITLES = {
  killer: 'CHOOSE YOUR KILLER',
  location: 'CHOOSE YOUR LOCATION',
  finalGirl: 'CHOOSE YOUR FINAL GIRL',
};

// Get box art for a value by finding the film it belongs to
const getBoxArtForValue = (type: 'killer' | 'location' | 'finalGirl', value: string): string | null => {
  const film = FEATURE_FILMS.find(f => {
    if (type === 'killer') return f.killer === value;
    if (type === 'location') return f.location === value;
    if (type === 'finalGirl') return f.finalGirls.includes(value as any);
    return false;
  });
  
  return film?.boxArt ?? null;
};

export const CastingPicker = ({ type, options, onSelect, onClose }: CastingPickerProps) => {
  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleRandomPick = () => {
    const randomIdx = Math.floor(Math.random() * options.length);
    onSelect(options[randomIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 picker-overlay">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines-overlay pointer-events-none opacity-30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center py-8 px-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between w-full max-w-4xl mb-8">
          <h2 className="font-title text-2xl md:text-3xl text-foreground tracking-wider">
            {PICKER_TITLES[type]}
          </h2>
          <div className="flex items-center gap-4">
            {/* Random pick button */}
            <button
              onClick={handleRandomPick}
              className="vcr-button px-4 py-2 flex items-center gap-2 font-vhs text-sm uppercase text-accent hover:text-accent/80"
            >
              <Shuffle className="w-4 h-4" />
              Random
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              className="vcr-button p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid of options */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl">
          {options.map((option) => {
            const boxArt = getBoxArtForValue(type, option);
            
            return (
              <button
                key={option}
                onClick={() => onSelect(option)}
                className="picker-card group flex flex-col items-center gap-2 p-2 rounded-sm transition-all duration-200"
              >
                {/* Poster */}
                <div className="poster-card poster-card-filled relative w-full aspect-[3/4] rounded-sm overflow-hidden">
                  {boxArt ? (
                    <img 
                      src={boxArt} 
                      alt={option} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 mystery-static" />
                  )}
                  
                  {/* VHS softness */}
                  <div className="absolute inset-0 vhs-softness" />
                  
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-primary/30 to-transparent" />
                </div>

                {/* Name */}
                <span className="font-title text-sm md:text-base text-foreground/70 group-hover:text-foreground transition-colors text-center">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
