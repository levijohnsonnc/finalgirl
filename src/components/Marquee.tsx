import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import marqueeBg from '@/assets/marquee-bg.png';
import { AppHeader } from './AppHeader';

interface MarqueeProps {
  onStart: () => void;
  onArchive: () => void;
  onNavigateHome: () => void;
}

export const Marquee = ({ onStart, onArchive, onNavigateHome }: MarqueeProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [showFlicker, setShowFlicker] = useState(false);
  const [showFrameJump, setShowFrameJump] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Random analog imperfection effects
  useEffect(() => {
    // Flicker effect - random interval between 15-30 seconds
    const scheduleFlicker = () => {
      const delay = Math.random() * 15000 + 15000; // 15-30 seconds
      return setTimeout(() => {
        setShowFlicker(true);
        setTimeout(() => setShowFlicker(false), 150);
        scheduleFlicker();
      }, delay);
    };

    // Frame jump effect - random interval between 40-60 seconds
    const scheduleFrameJump = () => {
      const delay = Math.random() * 20000 + 40000; // 40-60 seconds
      return setTimeout(() => {
        setShowFrameJump(true);
        setTimeout(() => setShowFrameJump(false), 120);
        scheduleFrameJump();
      }, delay);
    };

    const flickerTimeout = scheduleFlicker();
    const frameJumpTimeout = scheduleFrameJump();

    return () => {
      clearTimeout(flickerTimeout);
      clearTimeout(frameJumpTimeout);
    };
  }, []);

  const handleStart = () => {
    setIsClicked(true);
    // Brief delay for static burst effect before transition
    setTimeout(() => {
      onStart();
    }, 600);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${isClicked ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Image with VHS Effects + Projector Pulse + Hover Response */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat projector-pulse ${showFrameJump ? 'frame-jump' : ''} ${isButtonHovered ? 'screen-hover-flicker' : ''}`}
        style={{ 
          backgroundImage: `url(${marqueeBg})`,
        }}
      />
      
      {/* Screen Flicker Overlay */}
      {showFlicker && (
        <div className="absolute inset-0 bg-white/10 screen-flicker pointer-events-none z-10" />
      )}
      
      {/* Film Grain Overlay */}
      <div className="film-grain absolute inset-0 pointer-events-none" />
      
      {/* Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines-overlay" />
      
      {/* Vignette */}
      <div className="vignette absolute inset-0 pointer-events-none" />
      
      {/* Static Burst on Click */}
      {isClicked && (
        <div className="static-burst absolute inset-0 z-40 pointer-events-none" />
      )}
      
      {/* App Header - clickable to return home */}
      <AppHeader onNavigateHome={onNavigateHome} />
      
      {/* Content - Button positioned relative to screen in background (screen is ~2% right of center) */}
      <div className="absolute top-[52%] left-[52%] -translate-x-1/2 z-10 flex flex-col items-center">
        {/* Main Button - The Ritual Action */}
        <button
          onClick={handleStart}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          disabled={isClicked}
          className="vcr-tape-button group relative px-8 py-3 md:px-10 md:py-4 text-lg md:text-xl tracking-[0.15em] uppercase transition-all duration-150 disabled:pointer-events-none"
          style={{ fontFamily: 'var(--font-vhs)' }}
        >
          {/* Button content */}
          <span className="relative flex items-center gap-2.5 text-foreground/80 group-hover:text-foreground">
            <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            START THE TAPE
          </span>
        </button>
      </div>
      
      {/* Archive Link - Bottom corner, subtle */}
      <button
        onClick={onArchive}
        className="absolute bottom-6 right-6 text-xs tracking-wider uppercase text-foreground/30 hover:text-foreground/60 transition-colors duration-300"
        style={{ fontFamily: 'var(--font-vhs)' }}
      >
        Archive
      </button>
    </div>
  );
};
