import { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useGameHistory, GameResult } from '@/hooks/useGameHistory';
import { ScrapbookBook } from '@/components/ScrapbookBook';
import finalGirlCover from '@/assets/scrapbooks/final-girl-cover.png';
import killerCover from '@/assets/scrapbooks/killer-cover.png';

interface ScrapbooksProps {
  onBack: () => void;
}

const Scrapbooks = ({ onBack }: ScrapbooksProps) => {
  const { gameHistory } = useGameHistory();
  const [openBook, setOpenBook] = useState<'finalGirl' | 'killer' | null>(null);

  const wonGames = gameHistory.filter(g => g.outcome === 'won');
  const lostGames = gameHistory.filter(g => g.outcome === 'lost');

  const handleOpenBook = (type: 'finalGirl' | 'killer') => {
    setOpenBook(type);
  };

  const handleCloseBook = () => {
    setOpenBook(null);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8 group min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-vhs text-sm">BACK TO DASHBOARD</span>
      </button>

      {/* Page Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="font-display text-3xl sm:text-5xl text-foreground tracking-wide">
            SCRAPBOOKS
          </h1>
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <p className="font-vhs text-xs sm:text-sm text-muted-foreground mt-2">
          YOUR HORROR STORY COLLECTIONS
        </p>
      </div>

      {/* Scrapbook Covers */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 px-4">
        {/* Final Girl Scrapbook */}
        <button
          onClick={() => handleOpenBook('finalGirl')}
          disabled={wonGames.length === 0}
          className={`scrapbook-cover-button group relative transition-all duration-300 ${
            wonGames.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 hover:-rotate-1'
          }`}
        >
          <div className="relative">
            <img
              src={finalGirlCover}
              alt="Final Girl Scrapbook"
              className="w-48 sm:w-64 md:w-72 h-auto drop-shadow-2xl"
              style={{
                filter: wonGames.length > 0 ? 'drop-shadow(0 0 30px rgba(255, 182, 193, 0.3))' : 'none'
              }}
            />
            {/* Story Count Badge */}
            <div className="absolute -bottom-3 -right-3 bg-secondary text-secondary-foreground font-vhs text-xs px-3 py-1 rounded-full shadow-lg">
              {wonGames.length} {wonGames.length === 1 ? 'STORY' : 'STORIES'}
            </div>
          </div>
          {wonGames.length === 0 && (
            <p className="font-vhs text-xs text-muted-foreground mt-4 text-center">
              No victories yet...
            </p>
          )}
        </button>

        {/* Killer Scrapbook */}
        <button
          onClick={() => handleOpenBook('killer')}
          disabled={lostGames.length === 0}
          className={`scrapbook-cover-button group relative transition-all duration-300 ${
            lostGames.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 hover:rotate-1'
          }`}
        >
          <div className="relative">
            <img
              src={killerCover}
              alt="Killer Scrapbook"
              className="w-48 sm:w-64 md:w-72 h-auto drop-shadow-2xl"
              style={{
                filter: lostGames.length > 0 ? 'drop-shadow(0 0 30px rgba(139, 0, 0, 0.4))' : 'none'
              }}
            />
            {/* Story Count Badge */}
            <div className="absolute -bottom-3 -right-3 bg-primary text-primary-foreground font-vhs text-xs px-3 py-1 rounded-full shadow-lg">
              {lostGames.length} {lostGames.length === 1 ? 'VICTIM' : 'VICTIMS'}
            </div>
          </div>
          {lostGames.length === 0 && (
            <p className="font-vhs text-xs text-muted-foreground mt-4 text-center">
              No kills recorded...
            </p>
          )}
        </button>
      </div>

      {/* Open Book Overlay */}
      {openBook && (
        <ScrapbookBook
          type={openBook}
          games={openBook === 'finalGirl' ? wonGames : lostGames}
          onClose={handleCloseBook}
        />
      )}
    </div>
  );
};

export default Scrapbooks;
