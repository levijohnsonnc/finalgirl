import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import diceIcon from '@/assets/icons/dice-icon.png';
import { FEATURE_FILMS, CHARACTER_IMAGES, LOCATION_IMAGES } from '@/types/gameData';
import shuffleSound from '@/assets/sounds/card-shuffle.mp3';
import { LoreInfoModal } from './LoreInfoModal';

interface CastingSlotProps {
  type: 'killer' | 'location' | 'finalGirl';
  value: string | null;
  options: string[];
  onShuffle: () => void;
  onChoose: () => void;
  isShuffling?: boolean;
  shuffleKey?: number;
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

// Get object position for specific characters (some need different cropping)
const getObjectPosition = (type: 'killer' | 'location' | 'finalGirl', value: string | null): string => {
  // Dr. Fright should use center positioning, not top
  if (value === 'Dr. Fright') return 'object-center';
  // Poltergeist needs center positioning to show the ghost figure
  if (value === 'Poltergeist') return 'object-center';
  // Other killers use top positioning
  if (type === 'killer') return 'object-top';
  return '';
};

export const CastingSlot = ({ 
  type, 
  value, 
  options, 
  onShuffle, 
  onChoose,
  isShuffling = false,
  shuffleKey = 0
}: CastingSlotProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shuffleSequence, setShuffleSequence] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Build shuffle sequence when shuffling starts
  useEffect(() => {
    if (isShuffling && options.length > 0 && value) {
      setIsAnimating(true);
      
      // Play shuffle sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(shuffleSound);
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});

      // Build sequence: 12 random options ending with the selected value
      const sequence: string[] = [];
      for (let i = 0; i < 12; i++) {
        const randomIdx = Math.floor(Math.random() * options.length);
        sequence.push(options[randomIdx]);
      }
      sequence.push(value); // Final item is the selected value
      setShuffleSequence(sequence);
    } else if (!isShuffling) {
      setDisplayValue(value);
    }
  }, [isShuffling, shuffleKey, value, options]);

  // Handle animation end
  const handleAnimationEnd = () => {
    setIsAnimating(false);
    setShuffleSequence([]);
    setDisplayValue(value);
  };

  const cardImage = getImageForValue(type, displayValue);
  const isEmpty = !displayValue && !isAnimating;

  // Location cards are landscape (16:10), character cards are square (1:1)
  const isLocation = type === 'location';
  
  return (
    <div className={`casting-slot flex flex-col items-center gap-3 shrink min-w-0 max-w-full ${
      isLocation ? 'w-[28.5rem] md:w-[63rem]' : 'w-60 sm:w-72 md:w-[21rem]'
    }`}>
      {/* Label */}
      <span className="font-display text-xs text-muted-foreground tracking-[0.2em] uppercase">
        {SLOT_LABELS[type]}
      </span>

      {/* Poster Card - different dimensions for location vs characters */}
      <div 
        className={`
          poster-card relative rounded-sm overflow-hidden w-full
          ${isLocation ? 'aspect-[3/1]' : 'aspect-square'}
          ${isEmpty ? 'poster-card-empty cursor-pointer hover:border-primary/50' : 'poster-card-filled'}
          ${isAnimating ? 'poster-card-shuffling' : ''}
        `}
        onClick={isEmpty ? onChoose : undefined}
      >
        {/* Scrolling reel during animation */}
        {isAnimating && shuffleSequence.length > 0 ? (
          <div 
            className="slot-reel absolute inset-0"
            style={{ '--item-count': shuffleSequence.length } as React.CSSProperties}
            onAnimationEnd={handleAnimationEnd}
          >
            {shuffleSequence.map((option, idx) => {
              const img = getImageForValue(type, option);
              const positionClass = getObjectPosition(type, option);
              return img ? (
                <img 
                  key={idx}
                  src={img}
                  alt={option}
                  className={`w-full h-full object-cover flex-shrink-0 ${positionClass}`}
                />
              ) : (
                <div key={idx} className="w-full h-full mystery-static flex-shrink-0" />
              );
            })}
          </div>
        ) : (
          /* Static display */
          cardImage ? (
            <img 
              src={cardImage} 
              alt={displayValue || ''} 
              className={`absolute inset-0 w-full h-full object-cover ${getObjectPosition(type, displayValue)}`}
            />
          ) : (
            <div className="absolute inset-0 mystery-static" />
          )
        )}

        {/* VHS softness overlay */}
        <div className="absolute inset-0 vhs-softness pointer-events-none" />
        
        {/* Film grain */}
        <div className="absolute inset-0 film-grain pointer-events-none" />
      </div>

      {/* Name with Info Icon */}
      <div className="h-6 flex items-center justify-center gap-1.5">
        {isAnimating ? (
          <span className="font-vhs text-sm text-muted-foreground/50 animate-pulse">...</span>
        ) : displayValue ? (
          <>
            <span className="font-display text-lg text-foreground tracking-wide text-center">
              {displayValue}
            </span>
            <LoreInfoModal type={type} name={displayValue} />
          </>
        ) : (
          <span className="font-vhs text-sm text-muted-foreground/50">???</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={onShuffle}
          disabled={isAnimating || options.length === 0}
          className="slot-action-btn group pl-1 pr-3 sm:pr-4 py-2 min-h-[44px] flex items-center gap-1 font-display text-xs sm:text-sm uppercase tracking-wider text-foreground disabled:opacity-50"
        >
          <img src={diceIcon} alt="Shuffle" className="w-10 h-10 sm:w-12 sm:h-12 -my-3 object-contain" />
          Shuffle
        </button>
        <button
          onClick={onChoose}
          disabled={options.length === 0}
          className="slot-action-btn group px-3 sm:px-4 py-2 min-h-[44px] flex items-center gap-2 font-display text-xs sm:text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <ChevronDown className="w-3.5 h-3.5 transition-colors group-hover:text-primary" />
          Choose
        </button>
      </div>
    </div>
  );
};
