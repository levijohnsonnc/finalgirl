import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import marqueeBg from '@/assets/marquee-bg.png';

interface MarqueeProps {
  onStart: () => void;
  onArchive: () => void;
}

export const Marquee = ({ onStart, onArchive }: MarqueeProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [showFlicker, setShowFlicker] = useState(false);
  const [showFrameJump, setShowFrameJump] = useState(false);

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
      {/* Background Image with VHS Effects + Projector Pulse */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat projector-pulse ${showFrameJump ? 'frame-jump' : ''}`}
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
      
      {/* Title - Upper left corner, breathing into the scene */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
        <h1 
          className="text-3xl md:text-4xl lg:text-5xl tracking-wider text-foreground/65 mb-1 drop-shadow-lg"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500, textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
        >
          FINAL GIRL
        </h1>
        <p 
          className="text-base md:text-lg tracking-[0.3em] uppercase text-foreground/50 drop-shadow-md"
          style={{ fontFamily: 'var(--font-vhs)', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
        >
          Slasher Companion
        </p>
      </div>
      
      {/* Content - Centered button area */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-32 md:mt-40">
        {/* Subtitle - Diegetic, feels projected not overlaid */}
        <p 
          className="text-sm md:text-base text-foreground/25 mb-8 tracking-wide italic drop-shadow-md projector-text-flicker"
          style={{ 
            fontFamily: 'var(--font-vhs)', 
            textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
            filter: 'blur(0.3px)'
          }}
        >
          Insert tape. Turn off the lights.
        </p>
        
        {/* Main Button - The Ritual Action */}
        <button
          onClick={handleStart}
          disabled={isClicked}
          className="vcr-tape-button group relative px-10 py-4 md:px-14 md:py-5 text-xl md:text-2xl tracking-[0.2em] uppercase transition-all duration-150 disabled:pointer-events-none"
          style={{ fontFamily: 'var(--font-vhs)' }}
        >
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Button content */}
          <span className="relative flex items-center gap-3 text-foreground group-hover:text-primary-foreground">
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
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
