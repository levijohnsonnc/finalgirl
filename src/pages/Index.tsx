import { useState, useEffect } from 'react';
import { Marquee } from '@/components/Marquee';
import { AppHeader } from '@/components/AppHeader';
import CastingRoom from './CastingRoom';
import Archive from './Archive';
import { Library } from 'lucide-react';

const Index = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'archive'>('dashboard');
  const [time, setTime] = useState(new Date());

  // Update time every second for VCR display
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    setCurrentPage('dashboard');
  };

  const handleArchive = () => {
    setHasStarted(true);
    setCurrentPage('archive');
  };

  const handleNavigateHome = () => {
    setHasStarted(false);
  };

  // Show Marquee until user starts
  if (!hasStarted) {
    return <Marquee onStart={handleStart} onArchive={handleArchive} onNavigateHome={handleNavigateHome} />;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Shared App Header */}
      <AppHeader onNavigateHome={handleNavigateHome} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        {currentPage === 'dashboard' ? <CastingRoom /> : <Archive />}
      </main>

      {/* VHS Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur border-t border-border py-2 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-vhs text-xs text-muted-foreground">PLAY ▶</span>
          </div>
          <div className="font-vhs text-xs text-muted-foreground">
            FINAL GIRL™ SLASHER COMPANION • {time.toLocaleDateString()}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('archive')}
              className="font-vhs text-xs text-muted-foreground hover:text-secondary transition-colors flex items-center gap-1.5"
            >
              <Library className="w-3 h-3" />
              MY COLLECTION
            </button>
            <span className="font-vhs text-xs text-secondary neon-text">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className="font-vhs text-xs text-primary">SP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
