import { useEffect, useCallback } from 'react';
import { X, Shuffle } from 'lucide-react';
import { FEATURE_FILMS, CHARACTER_IMAGES, LOCATION_IMAGES } from '@/types/gameData';

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

// Get image for a value - prioritize character/location specific images, fall back to box art
const getImageForValue = (type: 'killer' | 'location' | 'finalGirl', value: string): string | null => {
  // Check for character/location specific images first
  if (type === 'killer' && CHARACTER_IMAGES[value]) {
    return CHARACTER_IMAGES[value];
  }
  if (type === 'finalGirl' && CHARACTER_IMAGES[value]) {
    return CHARACTER_IMAGES[value];
  }
  if (type === 'location' && LOCATION_IMAGES[value]) {
    return LOCATION_IMAGES[value];
  }
  
  // Fall back to box art
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
      <div className="relative z-10 h-full flex flex-col overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-primary/20 px-4 py-3 sm:py-4 safe-area-top">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-5xl mx-auto">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-muted-foreground tracking-wider text-center sm:text-left">
              {PICKER_TITLES[type]}
            </h2>
            <div className="flex items-center justify-center sm:justify-end gap-3">
              {/* Random pick button */}
              <button
                onClick={handleRandomPick}
                className="vcr-button px-4 py-2 min-h-[44px] flex items-center gap-2 font-display text-sm uppercase text-muted-foreground hover:text-foreground"
              >
                <Shuffle className="w-4 h-4" />
                Random
              </button>
              {/* Close button */}
              <button
                onClick={onClose}
                className="vcr-button p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid of options - different layout for locations */}
        <div className="flex-1 px-3 sm:px-4 py-6 sm:py-8">
          <div className={`grid gap-3 sm:gap-4 md:gap-6 w-full max-w-5xl mx-auto ${
            type === 'location' 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}>
            {options.map((option) => {
              const cardImage = getImageForValue(type, option);
              const isLocation = type === 'location';
              
              return (
                <button
                  key={option}
                  onClick={() => onSelect(option)}
                  className="picker-card group flex flex-col items-center gap-2 p-2 rounded-sm transition-all duration-200"
                >
                  {/* Poster - landscape for locations, portrait for characters */}
                  <div className={`poster-card poster-card-filled relative w-full rounded-sm overflow-hidden ${
                    isLocation ? 'aspect-[16/10]' : 'aspect-[3/4]'
                  }`}>
                    {cardImage ? (
                      <img 
                        src={cardImage} 
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
                  <span className="font-display text-sm md:text-base text-muted-foreground group-hover:text-foreground transition-colors text-center">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
