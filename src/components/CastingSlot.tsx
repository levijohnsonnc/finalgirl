import { useState, useEffect, useRef } from 'react';
import { Shuffle, ChevronDown } from 'lucide-react';
import { FEATURE_FILMS, CHARACTER_IMAGES, LOCATION_IMAGES } from '@/types/gameData';

interface CastingSlotProps {
  type: 'killer' | 'location' | 'finalGirl';
  value: string | null;
  options: string[];
  onShuffle: () => void;
  onChoose: () => void;
  isShuffling?: boolean;
}

const SLOT_LABELS = {
  killer: 'KILLER',
  location: 'LOCATION',
  finalGirl: 'FINAL GIRL',
};

// Get image for a value - prioritize character/location specific images, fall back to box art
const getImageForValue = (type: 'killer' | 'location' | 'finalGirl', value: string | null): string | null => {
  if (!value) return null;
  
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

export const CastingSlot = ({ 
  type, 
  value, 
  options, 
  onShuffle, 
  onChoose,
  isShuffling = false 
}: CastingSlotProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Handle shuffle animation
  useEffect(() => {
    if (isShuffling && options.length > 0) {
      setIsAnimating(true);
      let count = 0;
      const maxIterations = 8;
      
      animationRef.current = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * options.length);
        setDisplayValue(options[randomIdx]);
        count++;
        
        if (count >= maxIterations) {
          if (animationRef.current) clearInterval(animationRef.current);
          setDisplayValue(value);
          setIsAnimating(false);
        }
      }, 80);

      return () => {
        if (animationRef.current) clearInterval(animationRef.current);
      };
    } else {
      setDisplayValue(value);
    }
  }, [isShuffling, value, options]);

  const cardImage = getImageForValue(type, displayValue);
  const isEmpty = !displayValue;

  // Location cards are landscape (16:10), character cards are square (1:1)
  const isLocation = type === 'location';
  
  return (
    <div className="casting-slot flex flex-col items-center gap-3">
      {/* Label */}
      <span className="font-display text-xs text-muted-foreground tracking-[0.2em] uppercase">
        {SLOT_LABELS[type]}
      </span>

      {/* Poster Card - different dimensions for location vs characters */}
      {/* Location: landscape ~16:10 ratio, same height as character cards */}
      {/* Characters: square 1:1 ratio */}
      <div 
        className={`
          poster-card relative rounded-sm overflow-hidden
          ${isLocation 
            ? 'w-[19rem] h-48 md:w-[22.5rem] md:h-56' 
            : 'w-48 h-48 md:w-56 md:h-56'
          }
          ${isEmpty ? 'poster-card-empty' : 'poster-card-filled'}
        `}
      >
        {/* Background - either character/location image or mystery static */}
        {cardImage ? (
          <img 
            src={cardImage} 
            alt={displayValue || ''} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 mystery-static" />
        )}

        {/* VHS softness overlay */}
        <div className="absolute inset-0 vhs-softness" />
        
        {/* Film grain */}
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      {/* Name */}
      <div className="h-6 flex items-center justify-center">
        {displayValue ? (
          <span className="font-display text-lg text-foreground tracking-wide text-center">
            {displayValue}
          </span>
        ) : (
          <span className="font-vhs text-sm text-muted-foreground/50">???</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={onShuffle}
          disabled={isAnimating || options.length === 0}
          className="slot-action-btn group px-4 py-2 flex items-center gap-2 font-display text-sm uppercase tracking-wider text-foreground disabled:opacity-50"
        >
          <Shuffle className="w-3.5 h-3.5 transition-colors group-hover:text-primary" />
          Shuffle
        </button>
        <button
          onClick={onChoose}
          disabled={options.length === 0}
          className="slot-action-btn group px-4 py-2 flex items-center gap-2 font-display text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <ChevronDown className="w-3.5 h-3.5 transition-colors group-hover:text-primary" />
          Choose
        </button>
      </div>
    </div>
  );
};
