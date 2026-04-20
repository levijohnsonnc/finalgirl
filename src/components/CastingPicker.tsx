import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useActiveImages } from '@/hooks/useActiveImages';

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

export const CastingPicker = ({ type, options, onSelect, onClose }: CastingPickerProps) => {
  const { getImageForValue } = useActiveImages();

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
      <div className="relative z-10 h-full flex flex-col overflow-y-auto pt-16 sm:pt-28 lg:pt-32">
        {/* Sticky Header - positioned below app header */}
        <div className="sticky top-0 z-20 bg-background/60 backdrop-blur-md border-b border-primary/20 px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-muted-foreground tracking-wider">
              {PICKER_TITLES[type]}
            </h2>
            {/* Close button */}
            <button
              onClick={onClose}
              className="vcr-button p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid of options - different layout for locations */}
        {/* Extra bottom padding to account for ticker (bottom-16) + nav footer */}
        <div className="flex-1 px-3 sm:px-4 py-6 sm:py-8 pb-32 sm:pb-28">
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
