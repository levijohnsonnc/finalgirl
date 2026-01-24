import { GameResult } from '@/hooks/useGameHistory';
import { format } from 'date-fns';

interface ScrapbookStoryPageProps {
  game: GameResult;
  type: 'finalGirl' | 'killer';
}

export const ScrapbookStoryPage = ({ game, type }: ScrapbookStoryPageProps) => {
  const formatStoryText = (text: string) => {
    // Convert **text** to bold and *text* to italic
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  };

  return (
    <div className="story-page-content">
      {/* Date Header */}
      <div className="story-date">
        {format(new Date(game.timestamp), 'MMMM d, yyyy')}
      </div>

      {/* Intro Story Section */}
      <div className="story-section">
        <h4 className="story-heading">
          <span className="heading-line" />
          THE BEGINNING
          <span className="heading-line" />
        </h4>
        {game.introStory ? (
          <div 
            className="story-text"
            dangerouslySetInnerHTML={{ __html: formatStoryText(game.introStory) }}
          />
        ) : (
          <p className="story-text story-missing">
            This chapter's beginning was lost to time...
          </p>
        )}
      </div>

      {/* Ending Narration Section */}
      <div className="story-section">
        <h4 className="story-heading">
          <span className="heading-line" />
          {type === 'finalGirl' ? 'THE ESCAPE' : 'THE END'}
          <span className="heading-line" />
        </h4>
        {game.endingNarration ? (
          <div 
            className="story-text"
            dangerouslySetInnerHTML={{ __html: formatStoryText(game.endingNarration) }}
          />
        ) : (
          <p className="story-text story-missing">
            {type === 'finalGirl' 
              ? "How she survived remains unwritten..."
              : "The final moments fade to black..."
            }
          </p>
        )}
      </div>

      {/* Game Details Footer */}
      <div className="story-footer">
        <div className="footer-detail">
          <span className="detail-label">Final Girl:</span>
          <span className="detail-value">{game.finalGirl}</span>
        </div>
        <div className="footer-detail">
          <span className="detail-label">Killer:</span>
          <span className="detail-value">{game.killer}</span>
        </div>
        <div className="footer-detail">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{game.location}</span>
        </div>
      </div>
    </div>
  );
};
