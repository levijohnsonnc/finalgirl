import { useState, useEffect, useRef } from 'react';
import { FEATURE_FILMS, CHARACTER_IMAGES, LOCATION_IMAGES } from '@/types/gameData';
import shuffleSound from '@/assets/sounds/card-shuffle.mp3';
import { LoreInfoModal } from './LoreInfoModal';
import shuffleButton from '@/assets/buttons/shuffle-button.png';
import chooseButton from '@/assets/buttons/choose-button.png';

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

const getImageForValue = (type: 'killer' | 'location' | 'finalGirl', value: string | null): string | null => {
  if (!value) return null;
  if (type === 'killer' && CHARACTER_IMAGES[value]) return CHARACTER_IMAGES[value];
  if (type === 'finalGirl' && CHARACTER_IMAGES[value]) return CHARACTER_IMAGES[value];
  if (type === 'location' && LOCATION_IMAGES[value]) return LOCATION_IMAGES[value];
  
  const film = FEATURE_FILMS.find(f => {
    if (type === 'killer') return f.killer === value;
    if (type === 'location') return f.location === value;
    if (type === 'finalGirl') return f.finalGirls.some(fg => fg === value);
    return false;
  });
  return film?.boxArt ?? null;
};

const getObjectPosition = (type: 'killer' | 'location' | 'finalGirl', value: string | null): string => {
  if (value === 'Dr. Fright') return 'object-center';
  if (value === 'Poltergeist') return 'object-center';
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
  const preloadedRef = useRef<boolean>(false);

  // Preload all option images on mount
  useEffect(() => {
    if (preloadedRef.current || options.length === 0) return;
    preloadedRef.current = true;
    options.forEach(option => {
      const imgSrc = getImageForValue(type, option);
      if (imgSrc) {
        const img = new Image();
        img.src = imgSrc;
      }
    });
  }, [options, type]);

  // Build shuffle sequence and start animation in one go (no double-rAF)
  useEffect(() => {
    if (isShuffling && options.length > 0 && value) {
      // Play shuffle sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(shuffleSound);
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});

      // Build sequence ending with the selected value
      const sequence: string[] = [];
      for (let i = 0; i < 12; i++) {
        sequence.push(options[Math.floor(Math.random() * options.length)]);
      }
      sequence.push(value);

      // Set both in one synchronous batch — no rAF delay
      setShuffleSequence(sequence);
      setIsAnimating(true);
    } else if (!isShuffling) {
      setDisplayValue(value);
    }
  }, [isShuffling, shuffleKey, value, options]);

  // Handle animation end — defer unmount by one frame
  const handleAnimationEnd = () => {
    setDisplayValue(value);
    // Defer clearing animation state so the static image paints first
    requestAnimationFrame(() => {
      setIsAnimating(false);
      setShuffleSequence([]);
    });
  };

  const cardImage = getImageForValue(type, displayValue);
  // Always have the final value's image ready underneath
  const finalImage = getImageForValue(type, value);
  const isEmpty = !displayValue && !isAnimating && !value;
  const isLocation = type === 'location';
  
  return (
    <div className={`casting-slot flex flex-col items-center gap-3 shrink min-w-0 max-w-full ${
      isLocation ? 'w-[28.5rem] md:w-[63rem]' : 'w-60 sm:w-72 md:w-[21rem]'
    }`}>
      {/* Label */}
      <span className="font-display text-xs text-muted-foreground tracking-[0.2em] uppercase">
        {SLOT_LABELS[type]}
      </span>

      {/* Poster Card */}
      <div 
        className={`
          poster-card relative rounded-sm overflow-hidden w-full
          ${isLocation ? 'aspect-[3/1]' : 'aspect-square'}
          ${isEmpty ? 'poster-card-empty cursor-pointer hover:border-primary/50' : 'poster-card-filled'}
          ${isAnimating ? 'poster-card-shuffling' : ''}
        `}
        onClick={isEmpty ? onChoose : undefined}
      >
        {/* Pre-rendered final image underneath the reel — always painted, zero flash on unmount */}
        {finalImage && (
          <img 
            src={finalImage} 
            alt={value || ''} 
            className={`absolute inset-0 w-full h-full object-cover z-0 ${getObjectPosition(type, value)}`}
          />
        )}

        {/* Scrolling reel during animation */}
        {isAnimating && shuffleSequence.length > 0 ? (
          <div 
            key={shuffleKey}
            className="slot-reel absolute inset-0 z-10"
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
                  loading="eager"
                />
              ) : (
                <div key={idx} className="w-full h-full mystery-static flex-shrink-0" />
              );
            })}
          </div>
        ) : (
          /* Static display (only when no final image pre-rendered, e.g. empty state) */
          !finalImage && (
            cardImage ? (
              <img 
                src={cardImage} 
                alt={displayValue || ''} 
                className={`absolute inset-0 w-full h-full object-cover ${getObjectPosition(type, displayValue)}`}
              />
            ) : (
              <div className="absolute inset-0 mystery-static" />
            )
          )
        )}

        {/* VHS softness overlay */}
        <div className="absolute inset-0 vhs-softness pointer-events-none z-20" />
        {/* Film grain */}
        <div className="absolute inset-0 film-grain pointer-events-none z-20" />
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
      <div className="flex gap-4 mt-2">
        <button
          onClick={onShuffle}
          disabled={isAnimating || options.length === 0}
          className="group min-h-[44px] disabled:opacity-50 transition-all duration-150 
            hover:translate-y-[-2px] hover:brightness-110 
            active:translate-y-[3px] active:brightness-90
            drop-shadow-[0_6px_0_rgba(0,0,0,0.5)] hover:drop-shadow-[0_8px_0_rgba(0,0,0,0.4)]
            active:drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]"
        >
          <img src={shuffleButton} alt="Shuffle" className="h-12 sm:h-14 w-auto object-contain" />
        </button>
        <button
          onClick={onChoose}
          disabled={options.length === 0}
          className="group min-h-[44px] disabled:opacity-50 transition-all duration-150 
            hover:translate-y-[-2px] hover:brightness-110 
            active:translate-y-[3px] active:brightness-90
            drop-shadow-[0_6px_0_rgba(0,0,0,0.5)] hover:drop-shadow-[0_8px_0_rgba(0,0,0,0.4)]
            active:drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]"
        >
          <img src={chooseButton} alt="Choose" className="h-12 sm:h-14 w-auto object-contain" />
        </button>
      </div>
    </div>
  );
};
