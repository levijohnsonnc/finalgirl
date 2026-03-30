import React from 'react';
import { GameResult } from '@/hooks/useGameHistory';
import { format } from 'date-fns';

// Render markdown-style bold/italic as React elements (XSS-safe)
const renderFormattedInline = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/\*([^*]+?)\*/);

    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const italicIndex = italicMatch ? remaining.indexOf(italicMatch[0]) : Infinity;

    if (boldIndex === Infinity && italicIndex === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIndex <= italicIndex && boldMatch) {
      if (boldIndex > 0) parts.push(remaining.slice(0, boldIndex));
      parts.push(<strong key={key++} className="font-bold text-foreground">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldIndex + boldMatch[0].length);
    } else if (italicMatch) {
      if (italicIndex > 0) parts.push(remaining.slice(0, italicIndex));
      parts.push(<em key={key++} className="italic text-foreground/90">{italicMatch[1]}</em>);
      remaining = remaining.slice(italicIndex + italicMatch[0].length);
    }
  }

  return parts;
};

// Split text into paragraphs and render with safe inline formatting
const renderStoryText = (text: string): React.ReactNode[] => {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

  let chunks: string[];
  if (paragraphs.length === 1) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    chunks = [];
    for (let i = 0; i < sentences.length; i += 4) {
      chunks.push(sentences.slice(i, i + 4).join(''));
    }
  } else {
    chunks = paragraphs;
  }

  return chunks.map((chunk, i) => (
    <p key={i}>{renderFormattedInline(chunk.trim())}</p>
  ));
};

interface ScrapbookStoryPageProps {
  game: GameResult;
  type: 'finalGirl' | 'killer';
}

export const ScrapbookStoryPage = ({ game, type }: ScrapbookStoryPageProps) => {

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
          <div className="story-text">
            {renderStoryText(game.introStory)}
          </div>
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
          <div className="story-text">
            {renderStoryText(game.endingNarration)}
          </div>
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
