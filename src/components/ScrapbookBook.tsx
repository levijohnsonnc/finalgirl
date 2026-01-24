import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GameResult } from '@/hooks/useGameHistory';
import { ScrapbookGrid } from './ScrapbookGrid';
import { ScrapbookStoryPage } from './ScrapbookStoryPage';
import finalGirlCover from '@/assets/scrapbooks/final-girl-cover.png';
import killerCover from '@/assets/scrapbooks/killer-cover.png';

interface ScrapbookBookProps {
  type: 'finalGirl' | 'killer';
  games: GameResult[];
  onClose: () => void;
}

export const ScrapbookBook = ({ type, games, onClose }: ScrapbookBookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameResult | null>(null);

  // Trigger open animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 800); // Wait for close animation
  };

  const coverImage = type === 'finalGirl' ? finalGirlCover : killerCover;
  const themeClass = type === 'finalGirl' ? 'scrapbook-theme-survivor' : 'scrapbook-theme-killer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Book Container - 3D perspective */}
      <div 
        className={`scrapbook-container ${themeClass} ${isOpen ? 'book-open' : ''}`}
        style={{ perspective: '2000px' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 sm:top-4 sm:-right-12 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Book */}
        <div className="scrapbook-book">
          {/* Front Cover (flips open) */}
          <div className={`scrapbook-cover ${isOpen ? 'cover-open' : ''}`}>
            <img
              src={coverImage}
              alt={type === 'finalGirl' ? 'Final Girl Scrapbook' : 'Killer Scrapbook'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Inside Pages (revealed when open) */}
          <div className={`scrapbook-pages ${isOpen ? 'pages-visible' : ''}`}>
            {/* Left Page - Poster Display */}
            <div className="scrapbook-page scrapbook-page-left">
              <div className="page-content">
                {selectedGame ? (
                  <div className="poster-display">
                    {selectedGame.posterImageUrl ? (
                      <img
                        src={selectedGame.posterImageUrl}
                        alt="Game Poster"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="no-poster">
                        <span className="font-horror text-2xl text-muted-foreground/50">
                          No Poster
                        </span>
                      </div>
                    )}
                    <div className="poster-info">
                      <p className="font-vhs text-xs">{selectedGame.finalGirl}</p>
                      <p className="font-vhs text-[10px] text-muted-foreground">
                        vs {selectedGame.killer}
                      </p>
                      <p className="font-vhs text-[10px] text-muted-foreground">
                        {selectedGame.location}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="empty-page">
                    <p className="font-vhs text-sm text-muted-foreground text-center px-4">
                      Select a story from the grid to view its poster
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Page - Grid or Story */}
            <div className="scrapbook-page scrapbook-page-right">
              <div className="page-content">
                {selectedGame ? (
                  <div className="story-display">
                    <button
                      onClick={() => setSelectedGame(null)}
                      className="back-to-grid"
                    >
                      ← Back to Grid
                    </button>
                    <ScrapbookStoryPage game={selectedGame} type={type} />
                  </div>
                ) : (
                  <ScrapbookGrid
                    games={games}
                    selectedGameId={null}
                    onSelectGame={setSelectedGame}
                    type={type}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Back Cover (static) */}
          <div className="scrapbook-back" />
        </div>
      </div>
    </div>
  );
};
