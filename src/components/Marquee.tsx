import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import marqueeBg from '@/assets/marquee-bg.png';
import { AppHeader } from './AppHeader';
import { useAuth } from '@/hooks/useAuth';
import { useScreenEffects } from '@/hooks/useScreenEffects';
import { useGameHistory } from '@/hooks/useGameHistory';
import { ProjectorSlideshow } from './ProjectorSlideshow';

interface MarqueeProps {
  onStart: () => void;
  onArchive: () => void;
  onNavigateHome: () => void;
  onScrapbooks?: () => void;
  onStats?: () => void;
}

const MARQUEE_IMAGE_SIZE = {
  width: 1536,
  height: 1024,
} as const;

const MARQUEE_SCREEN_RECT = {
  x: 530,
  y: 238,
  width: 590,
  height: 252,
} as const;

export const Marquee = ({ onStart, onArchive, onNavigateHome, onScrapbooks, onStats }: MarqueeProps) => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { gameHistory } = useGameHistory();
  const [isClicked, setIsClicked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [viewportSize, setViewportSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  const { showFlicker, showFrameJump } = useScreenEffects();

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract all available images from game history
  const projectorImages = useMemo(() =>
    gameHistory
      .map(g => g.sceneImageUrl)
      .filter((url): url is string => !!url),
    [gameHistory]
  );

  const projectorStyle = useMemo(() => {
    const { width: viewportWidth, height: viewportHeight } = viewportSize;
    const isMobile = viewportWidth < 640;
    const bgPositionY = isMobile ? 0.6 : 0.5;

    const scale = Math.max(
      viewportWidth / MARQUEE_IMAGE_SIZE.width,
      viewportHeight / MARQUEE_IMAGE_SIZE.height,
    );

    const renderedWidth = MARQUEE_IMAGE_SIZE.width * scale;
    const renderedHeight = MARQUEE_IMAGE_SIZE.height * scale;

    const offsetX = (viewportWidth - renderedWidth) * 0.5;
    const offsetY = (viewportHeight - renderedHeight) * bgPositionY;

    return {
      left: `${offsetX + MARQUEE_SCREEN_RECT.x * scale}px`,
      top: `${offsetY + MARQUEE_SCREEN_RECT.y * scale}px`,
      width: `${MARQUEE_SCREEN_RECT.width * scale}px`,
      height: `${MARQUEE_SCREEN_RECT.height * scale}px`,
      transform: 'rotate(0.5deg)',
      transformOrigin: 'center center',
    };
  }, [viewportSize]);

  const handleStart = () => {
    setIsClicked(true);
    // Brief delay for static burst effect before transition
    setTimeout(() => {
      onStart();
    }, 600);
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${isClicked ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Image with VHS Effects + Projector Pulse + Hover Response */}
      <div 
        className={`absolute inset-0 bg-cover bg-[center_60%] sm:bg-center bg-no-repeat projector-pulse ${showFrameJump ? 'frame-jump' : ''} ${isButtonHovered ? 'screen-hover-flicker' : ''}`}
        style={{ 
          backgroundImage: `url(${marqueeBg})`,
        }}
      />
      
      {/* Projector Slideshow — projected onto the outdoor screen */}
      {projectorImages.length > 0 && (
        <ProjectorSlideshow images={projectorImages} style={projectorStyle} />
      )}

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
      
      {/* Content - Button positioned below projector screen on mobile, centered on desktop */}
      <div className="absolute top-[62%] left-1/2 sm:top-[52%] sm:left-[52%] -translate-x-1/2 z-10 flex flex-col items-center">
        {/* Main Button - The Ritual Action */}
        <button
          onClick={handleStart}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          disabled={isClicked}
          className="vcr-tape-button group relative px-6 py-3 sm:px-8 md:px-10 md:py-4 text-base sm:text-lg md:text-xl tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-150 disabled:pointer-events-none min-h-[48px] backdrop-blur-sm bg-black/30 sm:bg-transparent sm:backdrop-blur-none rounded-sm"
          style={{ fontFamily: 'var(--font-vhs)' }}
        >
          {/* Button content */}
          <span className="relative flex items-center gap-2 sm:gap-2.5 text-foreground/80 group-hover:text-foreground">
            <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            START THE TAPE
          </span>
        </button>
      </div>
      
      {/* Bottom Navigation - Centered on mobile, spread on desktop */}
      <div className="absolute bottom-5 left-0 right-0 px-4 sm:px-6 flex justify-center sm:justify-between items-center safe-area-bottom">
        {/* Left group: Scrapbooks + Stats + Auth */}
        <div className="flex items-center gap-3 sm:gap-6">
          {onScrapbooks && (
            <button
              onClick={onScrapbooks}
              className="text-xs tracking-wider uppercase text-foreground/30 hover:text-primary/60 transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center px-2"
              style={{ fontFamily: 'var(--font-vhs)' }}
            >
              Scrapbooks
            </button>
          )}
          {onStats && (
            <button
              onClick={onStats}
              className="text-xs tracking-wider uppercase text-foreground/30 hover:text-green-400/60 transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center px-2"
              style={{ fontFamily: 'var(--font-vhs)' }}
            >
              Stats
            </button>
          )}
          {/* Auth link - subtle */}
          {!authLoading && (
            <button
              onClick={handleAuthClick}
              className="text-xs tracking-wider uppercase text-foreground/20 hover:text-foreground/50 transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center px-2"
              style={{ fontFamily: 'var(--font-vhs)' }}
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          )}
        </div>
        
        {/* Right: My Collection */}
        <button
          onClick={onArchive}
          className="text-xs tracking-wider uppercase text-foreground/30 hover:text-secondary/60 transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center px-2 sm:px-3"
          style={{ fontFamily: 'var(--font-vhs)' }}
        >
          My Collection
        </button>
      </div>

      {/* Trademark Disclaimer */}
      <div className="absolute bottom-1.5 left-0 right-0 px-2 text-center safe-area-bottom">
        <p 
          className="text-[6px] sm:text-[7px] text-foreground/15 leading-none whitespace-nowrap"
          style={{ fontFamily: 'var(--font-vhs)' }}
        >
          Unofficial fan-made app — not endorsed by or affiliated with Van Ryder Games, registered trademark owner of Final Girl and all associated intellectual property rights.
        </p>
      </div>
    </div>
  );
};
