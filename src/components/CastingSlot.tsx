import { useState, useEffect, useRef } from 'react';
import { Shuffle, ChevronDown } from 'lucide-react';
import { FEATURE_FILMS } from '@/types/gameData';

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

// Get box art for a value by finding the film it belongs to
const getBoxArtForValue = (type: 'killer' | 'location' | 'finalGirl', value: string | null): string | null => {
  if (!value) return null;
  
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

  const boxArt = getBoxArtForValue(type, displayValue);
  const isEmpty = !displayValue;

  return (
    <div className="casting-slot flex flex-col items-center gap-3">
      {/* Label */}
      <span className="font-vhs text-xs text-muted-foreground tracking-widest uppercase">
        {SLOT_LABELS[type]}
      </span>

      {/* Poster Card */}
      <div 
        className={`
          poster-card relative w-40 h-56 md:w-48 md:h-64 rounded-sm overflow-hidden
          ${isEmpty ? 'poster-card-empty' : 'poster-card-filled'}
          ${isAnimating ? 'shuffle-flicker' : ''}
        `}
      >
        {/* Background - either box art or mystery static */}
        {boxArt ? (
          <img 
            src={boxArt} 
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
          <span 
            className={`
              font-title text-lg text-foreground tracking-wide text-center
              ${isAnimating ? 'typewriter-fade' : ''}
            `}
          >
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
          className="slot-shuffle-btn vcr-button px-4 py-2 flex items-center gap-2 font-vhs text-sm uppercase tracking-wider text-foreground disabled:opacity-50"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Shuffle
        </button>
        <button
          onClick={onChoose}
          disabled={options.length === 0}
          className="slot-choose-btn vcr-button px-4 py-2 flex items-center gap-2 font-vhs text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          Choose
        </button>
      </div>
    </div>
  );
};
