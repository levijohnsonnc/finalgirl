import { useState, useEffect, useRef, useCallback } from 'react';
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

/** Generate an ease-in-out delay curve: slow → fast → slow */
const buildDelays = (count: number): number[] => {
  const delays: number[] = [];
  for (let i = 0; i < count; i++) {
    // Normalize position to 0–1
    const t = count <= 1 ? 0.5 : i / (count - 1);
    // Sine-based ease-in-out: slow at edges, fast in middle
    // sin goes 0→1→0, we invert to get delay (high→low→high)
    const sinVal = Math.sin(t * Math.PI); // 0 at edges, 1 at center
    const minDelay = 55;
    const maxDelay = 280;
    const delay = maxDelay - sinVal * (maxDelay - minDelay);
    delays.push(Math.round(delay));
  }
  return delays;
};

const FRAME_COUNT = 20;

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
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const runFrameStepper = useCallback((sequence: string[], delays: number[], index: number) => {
    if (index >= sequence.length) {
      // Animation complete — land on final value
      setCurrentFrame(null);
      setDisplayValue(value);
      setIsAnimating(false);
      return;
    }
    setCurrentFrame(sequence[index]);
    timerRef.current = setTimeout(() => {
      runFrameStepper(sequence, delays, index + 1);
    }, delays[index]);
  }, [value]);

  // Start shuffle animation
  useEffect(() => {
    if (isShuffling && options.length > 0 && value) {
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Play shuffle sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(shuffleSound);
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});

      // Build sequence of random options ending with the selected value
      const sequence: string[] = [];
      for (let i = 0; i < FRAME_COUNT - 1; i++) {
        // Avoid showing the final value in the sequence (except at the end)
        const pool = options.length > 1 ? options.filter(o => o !== value) : options;
        sequence.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      sequence.push(value);

      const delays = buildDelays(sequence.length);

      setIsAnimating(true);
      setCurrentFrame(sequence[0]);

      // Start stepping from frame 1 after the first delay
      timerRef.current = setTimeout(() => {
        runFrameStepper(sequence, delays, 1);
      }, delays[0]);
    } else if (!isShuffling && !isAnimating) {
      setDisplayValue(value);
    }
  }, [isShuffling, shuffleKey, value, options]);

  const frameImage = currentFrame ? getImageForValue(type, currentFrame) : null;
  const finalImage = getImageForValue(type, isAnimating ? null : displayValue);
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
        {/* Static image — shown when NOT animating */}
        {!isAnimating && finalImage && (
          <img 
            src={finalImage} 
            alt={displayValue || ''} 
            className={`absolute inset-0 w-full h-full object-cover z-0 ${getObjectPosition(type, displayValue)}`}
          />
        )}

        {/* Frame stepper — single image swapped via JS timing */}
        {isAnimating && frameImage && (
          <img 
            key={currentFrame}
            src={frameImage} 
            alt={currentFrame || ''} 
            className={`absolute inset-0 w-full h-full object-cover z-10 ${getObjectPosition(type, currentFrame)}`}
            loading="eager"
          />
        )}

        {/* Fallback static/empty */}
        {!isAnimating && !finalImage && (
          <div className="absolute inset-0 mystery-static" />
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
