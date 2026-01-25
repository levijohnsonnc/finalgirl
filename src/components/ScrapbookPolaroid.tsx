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

      {/* Lightbox - shows as enlarged polaroid */}
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
          
          {/* Polaroid frame in lightbox */}
          <div 
            className="lightbox-polaroid-frame"
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
