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

// Slot machine speed curve: ms per tick (slow → fast → slow)
const TICK_DELAYS = [
  320, 240, 175, 125, 90, 68, 52, 43, 40,  // slow → fast
  40, 40, 40,                                // fast plateau
  50, 70, 100, 155, 220, 310, 430,           // fast → slow (landing)
];

// Get image for a value - prioritize character/location specific images, fall back to box art
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

// Get object position for specific characters (some need different cropping)
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
  const [tickValue, setTickValue] = useState<string | null>(null);
  const [tickKey, setTickKey] = useState(0);
  const [tickDuration, setTickDuration] = useState(300);
  const [isLanding, setIsLanding] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedRef = useRef<boolean>(false);
  const tickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload all option images on mount for smooth animation
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

  // Slot machine ticker animation
  useEffect(() => {
    if (!isShuffling || !value || options.length === 0) {
      if (!isShuffling) setDisplayValue(value);
      return;
    }

    // Play shuffle sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(shuffleSound);
    audioRef.current.volume = 0.4;
    audioRef.current.play().catch(() => {});

    setIsAnimating(true);
    setIsLanding(false);
    let tickIdx = 0;

    const runTick = () => {
      if (tickIdx < TICK_DELAYS.length - 1) {
        // Intermediate tick — random option
        const randomOpt = options[Math.floor(Math.random() * options.length)];
        setTickValue(randomOpt);
        setTickKey(k => k + 1);
        setTickDuration(TICK_DELAYS[tickIdx]);
        tickIdx++;
        tickTimeoutRef.current = setTimeout(runTick, TICK_DELAYS[tickIdx]);
      } else {
        // Final tick — land on the selected value
        setTickValue(value);
        setTickKey(k => k + 1);
        setIsLanding(true);
        setTickDuration(500);
        tickTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setIsLanding(false);
          setDisplayValue(value);
        }, 550);
      }
    };

    runTick();

    return () => {
      if (tickTimeoutRef.current) clearTimeout(tickTimeoutRef.current);
    };
  }, [isShuffling, shuffleKey, value, options]);

  const cardImage = getImageForValue(type, displayValue);
  const isEmpty = !displayValue && !isAnimating;
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
        onClick={!isAnimating && isEmpty ? onChoose : undefined}
        style={{ cursor: isAnimating ? 'default' : 'pointer' }}
      >
        {/* Ticker frame during animation */}
        {isAnimating && tickValue ? (() => {
          const img = getImageForValue(type, tickValue);
          const animDuration = Math.min(Math.round(tickDuration * 0.72), 280);
          const posClass = getObjectPosition(type, tickValue);
          return img ? (
            <img
              key={tickKey}
              src={img}
              alt={tickValue}
              className={`absolute inset-0 w-full h-full object-cover ${posClass} ${isLanding ? 'slot-land' : 'slot-tick-in'}`}
              style={{ animationDuration: `${animDuration}ms` }}
            />
          ) : (
            <div
              key={tickKey}
              className={`absolute inset-0 mystery-static ${isLanding ? 'slot-land' : 'slot-tick-in'}`}
              style={{ animationDuration: `${animDuration}ms` }}
            />
          );
        })() : (
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
          <span key={tickKey} className="font-display text-lg text-foreground/50 tracking-wide text-center typewriter-fade truncate max-w-full">
            {tickValue ?? '...'}
          </span>
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

      {/* Action Buttons - 3D Pressable Style */}
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
