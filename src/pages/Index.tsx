import { useState, useEffect } from 'react';
import { Marquee } from '@/components/Marquee';
import { AppHeader } from '@/components/AppHeader';
import CastingRoom from './CastingRoom';
import Archive from './Archive';
import NowPlaying from './NowPlaying';
import GameOutcome from './GameOutcome';
import Scrapbooks from './Scrapbooks';
import Stats from './Stats';
import { Library, BookOpen, BarChart3 } from 'lucide-react';
import { getFilmIdByLocation } from '@/types/gameData';
import { useGameHistory, GameResult } from '@/hooks/useGameHistory';
import { NewsTicker } from '@/components/NewsTicker';

interface GameSelection {
  killer: string;
  location: string;
  finalGirl: string;
  setupScenario: string | null;
  startingEvent: string | null;
  filmId: string | null;
  introStory?: string;
}

const Index = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'archive' | 'nowPlaying' | 'outcome' | 'scrapbooks' | 'stats'>('dashboard');
  const [gameSelection, setGameSelection] = useState<GameSelection | null>(null);
  const [lastGameResult, setLastGameResult] = useState<GameResult | null>(null);
  const [introStory, setIntroStory] = useState<string | undefined>(undefined);
  const [time, setTime] = useState(new Date());
  const { recordGame, updateGame } = useGameHistory();

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
    setGameSelection(null);
    setLastGameResult(null);
    setCurrentPage('dashboard');
  };

  const handleStartGame = (selection: {
    killer: string;
    location: string;
    finalGirl: string;
    setupScenario: string | null;
    startingEvent: string | null;
  }) => {
    const filmId = getFilmIdByLocation(selection.location);
    setGameSelection({
      ...selection,
      filmId,
    });
    setCurrentPage('nowPlaying');
  };

  const handleBackFromNowPlaying = () => {
    setGameSelection(null);
    setLastGameResult(null);
    setIntroStory(undefined);
    setCurrentPage('dashboard');
  };

  const handleGameEnd = (outcome: 'won' | 'lost', story?: string) => {
    if (!gameSelection) return;
    
    setIntroStory(story);
    
    const result = recordGame({
      outcome,
      killer: gameSelection.killer,
      location: gameSelection.location,
      finalGirl: gameSelection.finalGirl,
      setupScenario: gameSelection.setupScenario,
      startingEvent: gameSelection.startingEvent,
      introStory: story,
    });
    
    setLastGameResult(result);
    setCurrentPage('outcome');
  };

  const handleUpdateGame = (updates: Partial<GameResult>) => {
    if (lastGameResult) {
      updateGame(lastGameResult.id, updates);
    }
  };

  const handlePlayAgain = () => {
    setGameSelection(null);
    setLastGameResult(null);
    setIntroStory(undefined);
    setCurrentPage('dashboard');
  };

  // Show Marquee until user starts
  if (!hasStarted) {
    return (
      <Marquee 
        onStart={handleStart} 
        onArchive={handleArchive} 
        onNavigateHome={handleNavigateHome}
        onScrapbooks={() => { setHasStarted(true); setCurrentPage('scrapbooks'); }}
        onStats={() => { setHasStarted(true); setCurrentPage('stats'); }}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'nowPlaying':
        if (gameSelection) {
          return (
            <NowPlaying
              killer={gameSelection.killer}
              location={gameSelection.location}
              finalGirl={gameSelection.finalGirl}
              setupScenario={gameSelection.setupScenario}
              startingEvent={gameSelection.startingEvent}
              filmId={gameSelection.filmId}
              onBack={handleBackFromNowPlaying}
              onGameEnd={handleGameEnd}
            />
          );
        }
        return <CastingRoom onStartGame={handleStartGame} onGoToArchive={() => setCurrentPage('archive')} />;
      case 'outcome':
        if (lastGameResult) {
          return (
            <GameOutcome
              result={lastGameResult}
              introStory={introStory}
              onUpdate={handleUpdateGame}
              onBack={handlePlayAgain}
            />
          );
        }
        return <CastingRoom onStartGame={handleStartGame} onGoToArchive={() => setCurrentPage('archive')} />;
      case 'archive':
        return <Archive onBack={() => setCurrentPage('dashboard')} />;
      case 'scrapbooks':
        return <Scrapbooks onBack={() => setCurrentPage('dashboard')} />;
      case 'stats':
        return <Stats onBack={() => setCurrentPage('dashboard')} />;
      default:
        return <CastingRoom onStartGame={handleStartGame} onGoToArchive={() => setCurrentPage('archive')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Shared App Header */}
      <AppHeader onNavigateHome={handleNavigateHome} />
      
      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 pt-24 sm:pt-32 pb-28 relative z-10">
        {renderPage()}
      </main>

      {/* News Ticker - above footer */}
      <NewsTicker />

      {/* VHS Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur border-t border-border py-2 z-50 safe-area-bottom">
        <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between">
          {/* Left: Play indicator - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-vhs text-xs text-muted-foreground">PLAY ▶</span>
          </div>
          
          {/* Center: Title - simplified on mobile */}
          <div className="font-vhs text-[10px] sm:text-xs text-muted-foreground truncate">
            <span className="sm:hidden">FINAL GIRL™</span>
            <span className="hidden sm:inline">FINAL GIRL™ SLASHER COMPANION • {time.toLocaleDateString()}</span>
          </div>
          
          {/* Right: Collection + Stats + Scrapbooks + Time */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setCurrentPage('archive')}
              className="font-vhs text-[10px] sm:text-xs text-muted-foreground hover:text-secondary transition-colors flex items-center gap-1 sm:gap-1.5 min-h-[44px] px-1 sm:px-2"
            >
              <Library className="w-3 h-3" />
              <span className="hidden sm:inline">COLLECTION</span>
            </button>
            <button
              onClick={() => setCurrentPage('stats')}
              className="font-vhs text-[10px] sm:text-xs text-muted-foreground hover:text-green-400 transition-colors flex items-center gap-1 sm:gap-1.5 min-h-[44px] px-1 sm:px-2"
            >
              <BarChart3 className="w-3 h-3" />
              <span className="hidden sm:inline">STATS</span>
            </button>
            <button
              onClick={() => setCurrentPage('scrapbooks')}
              className="font-vhs text-[10px] sm:text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 sm:gap-1.5 min-h-[44px] px-1 sm:px-2"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">SCRAPBOOKS</span>
            </button>
            <span className="font-vhs text-[10px] sm:text-xs text-secondary neon-text">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span className="hidden sm:inline font-vhs text-xs text-primary">SP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
