import React from 'react';
import { GameResult } from '@/hooks/useGameHistory';
import { format } from 'date-fns';
import { getFinalGirlMaxHealth } from '@/data/finalGirlHealth';

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
  const maxFinalGirlHealth = getFinalGirlMaxHealth(game.finalGirl);
  const isWin = game.outcome === 'won';

  return (
    <div className="story-page-content">
      {/* Date + Outcome Header */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="story-date" style={{ marginBottom: 0 }}>
          {format(new Date(game.timestamp), 'MMMM d, yyyy')}
        </div>
        <span className={`font-display text-xs tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm border ${
          isWin
            ? 'text-secondary border-secondary/50 bg-secondary/10'
            : 'text-primary border-primary/50 bg-primary/10'
        }`}>
          {isWin ? 'SURVIVED' : 'LOST'}
        </span>
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
        {game.location && (
          <div className="footer-detail">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{game.location}</span>
          </div>
        )}
        {game.setupScenario && (
          <div className="footer-detail">
            <span className="detail-label">Setup:</span>
            <span className="detail-value">{game.setupScenario}</span>
          </div>
        )}
        {game.startingEvent && (
          <div className="footer-detail">
            <span className="detail-label">Event:</span>
            <span className="detail-value">{game.startingEvent}</span>
          </div>
        )}
      </div>

      {/* Game Stats — shown when any stat was recorded */}
      {(game.finalHorrorLevel !== undefined ||
        game.finalGirlHealth !== undefined ||
        game.killerHealth !== undefined ||
        game.weaponUsed ||
        game.victimsSaved !== undefined ||
        game.victimsKilled !== undefined ||
        game.endingSubLocation) && (
        <div className="story-footer" style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
          {game.finalHorrorLevel !== undefined && (
            <div className="footer-detail">
              <span className="detail-label">Horror:</span>
              <span className="detail-value">{game.finalHorrorLevel}/7</span>
            </div>
          )}
          {game.finalGirlHealth !== undefined && (
            <div className="footer-detail">
              <span className="detail-label">HP:</span>
              <span className="detail-value">{game.finalGirlHealth}/{maxFinalGirlHealth}</span>
            </div>
          )}
          {game.killerHealth !== undefined && game.killerHealth > 0 && (
            <div className="footer-detail">
              <span className="detail-label">Killer HP:</span>
              <span className="detail-value">{game.killerHealth}</span>
            </div>
          )}
          {game.weaponUsed && (
            <div className="footer-detail">
              <span className="detail-label">Weapon:</span>
              <span className="detail-value">{game.weaponUsed}</span>
            </div>
          )}
          {(game.victimsSaved !== undefined || game.victimsKilled !== undefined) && (
            <div className="footer-detail">
              <span className="detail-label">Victims:</span>
              <span className="detail-value">
                {game.victimsSaved ?? 0} saved / {game.victimsKilled ?? 0} lost
              </span>
            </div>
          )}
          {game.endingSubLocation && (
            <div className="footer-detail">
              <span className="detail-label">Final scene:</span>
              <span className="detail-value">{game.endingSubLocation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
