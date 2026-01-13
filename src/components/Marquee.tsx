import { useState } from 'react';
import { Play } from 'lucide-react';
import marqueeBg from '@/assets/marquee-bg.png';

interface MarqueeProps {
  onStart: () => void;
  onArchive: () => void;
}

export const Marquee = ({ onStart, onArchive }: MarqueeProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleStart = () => {
    setIsClicked(true);
    // Brief delay for static burst effect before transition
    setTimeout(() => {
      onStart();
    }, 600);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${isClicked ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Image with VHS Effects */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${marqueeBg})`,
          filter: 'blur(0.3px) saturate(0.9) contrast(1.05)',
        }}
      />
      
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
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Title - Restrained, top area */}
        <div className="mb-8 md:mb-12">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl tracking-wider text-foreground/90 mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            FINAL GIRL
          </h1>
          <p 
            className="text-lg md:text-xl tracking-[0.3em] uppercase text-foreground/70"
            style={{ fontFamily: 'var(--font-vhs)' }}
          >
            Slasher Companion
          </p>
        </div>
        
        {/* Spacer to push button lower */}
        <div className="h-24 md:h-32" />
        
        {/* Subtitle - Very subtle */}
        <p 
          className="text-sm md:text-base text-foreground/40 mb-8 tracking-wide italic"
          style={{ fontFamily: 'var(--font-vhs)' }}
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
