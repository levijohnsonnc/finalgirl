import { useState } from 'react';
import { X } from 'lucide-react';

interface ScrapbookPolaroidProps {
  sceneImageUrl: string;
}

export const ScrapbookPolaroid = ({ sceneImageUrl }: ScrapbookPolaroidProps) => {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      {/* Polaroid tucked into margin */}
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

      {/* Lightbox */}
      {showLightbox && (
        <div 
          className="polaroid-lightbox"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="lightbox-close"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={sceneImageUrl}
            alt="Scene evidence - full view"
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="lightbox-caption font-display text-sm tracking-widest text-foreground/70">
            RECOVERED EVIDENCE
          </span>
        </div>
      )}
    </>
  );
};
