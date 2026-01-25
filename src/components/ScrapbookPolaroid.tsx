import { useState } from 'react';

interface ScrapbookPolaroidProps {
  sceneImageUrl: string;
}

export const ScrapbookPolaroid = ({ sceneImageUrl }: ScrapbookPolaroidProps) => {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      {/* Small polaroid - HIDDEN when lightbox is open */}
      {!showLightbox && (
        <div className="scrapbook-polaroid" onClick={() => setShowLightbox(true)}>
          {/* Paperclip */}
          <div className="polaroid-clip" />
          
          {/* Polaroid frame */}
          <div className="polaroid-frame">
            <img
              src={sceneImageUrl}
              alt="Scene evidence"
              className="polaroid-image"
            />
            <span className="polaroid-caption">EVIDENCE</span>
          </div>
        </div>
      )}

      {/* Lightbox - transparent backdrop, floating polaroid */}
      {showLightbox && (
        <div 
          className="polaroid-lightbox-transparent"
          onClick={() => setShowLightbox(false)}
        >
          {/* Polaroid frame - enlarged, centered, floating with physical look */}
          <div 
            className="lightbox-polaroid-floating"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={sceneImageUrl}
              alt="Scene evidence - full view"
              className="lightbox-image"
            />
            <span className="lightbox-caption">
              RECOVERED EVIDENCE
            </span>
          </div>
        </div>
      )}
    </>
  );
};
