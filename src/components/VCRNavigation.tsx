import { Film, Settings, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VCRNavigationProps {
  currentPage: 'dashboard' | 'archive';
  onNavigate: (page: 'dashboard' | 'archive') => void;
}

export const VCRNavigation = ({ currentPage, onNavigate }: VCRNavigationProps) => {
  return (
    <nav className="glass-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* VCR Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Tv className="w-8 h-8 text-secondary animate-neon-flicker" />
              <div className="absolute inset-0 blur-md bg-secondary/30" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl text-primary blood-glow tracking-wider">
                FINAL GIRL
              </span>
              <span className="font-vhs text-xs text-muted-foreground -mt-1">
                SLASHER COMPANION
              </span>
            </div>
          </div>

          {/* VCR Control Panel */}
          <div className="flex items-center gap-2 bg-vhs-midnight/50 p-2 rounded border border-border">
            {/* Recording Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 border-r border-border">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-vhs text-xs text-primary">REC</span>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => onNavigate('dashboard')}
              className={cn(
                "vcr-button px-4 py-2 font-vhs text-sm flex items-center gap-2 transition-all glitch-hover",
                currentPage === 'dashboard' 
                  ? "text-secondary border-secondary shadow-neon" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Film className="w-4 h-4" />
              PROJECTION ROOM
            </button>

            <button
              onClick={() => onNavigate('archive')}
              className={cn(
                "vcr-button px-4 py-2 font-vhs text-sm flex items-center gap-2 transition-all glitch-hover",
                currentPage === 'archive' 
                  ? "text-secondary border-secondary shadow-neon" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings className="w-4 h-4" />
              THE ARCHIVE
            </button>
          </div>

          {/* VCR Timer Display */}
          <div className="vhs-label flex items-center gap-2">
            <span className="text-secondary font-vhs text-lg tracking-widest neon-text">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
