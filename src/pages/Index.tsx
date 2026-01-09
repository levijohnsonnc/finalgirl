import { useState, useEffect } from 'react';
import { VCRNavigation } from '@/components/VCRNavigation';
import Dashboard from './Dashboard';
import Archive from './Archive';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'archive'>('dashboard');
  const [time, setTime] = useState(new Date());

  // Update time every second for VCR display
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background scanlines crt-flicker">
      {/* Static noise background layer */}
      <div className="fixed inset-0 static-bg pointer-events-none" />
      
      {/* VCR Navigation */}
      <VCRNavigation currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {currentPage === 'dashboard' ? <Dashboard /> : <Archive />}
      </main>

      {/* VHS Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur border-t border-border py-2 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-vhs text-xs text-muted-foreground">PLAY ▶</span>
          </div>
          <div className="font-vhs text-xs text-muted-foreground">
            FINAL GIRL™ VHS COMPANION • {time.toLocaleDateString()}
          </div>
          <div className="flex items-center gap-4">
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
