import { useState, useEffect, useCallback, useMemo } from 'react';

interface ProjectorSlideshowProps {
  images: string[];
}

export const ProjectorSlideshow = ({ images }: ProjectorSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Shuffle images once on mount for variety
  const shuffled = useMemo(() => {
    const arr = [...images];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [images]);

  const advance = useCallback(() => {
    if (shuffled.length < 2) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % shuffled.length);
      setNextIndex(prev => (prev + 1) % shuffled.length);
      setIsTransitioning(false);
    }, 2000); // match CSS transition duration
  }, [shuffled.length]);

  useEffect(() => {
    if (shuffled.length < 2) return;
    const interval = setInterval(advance, 5000);
    return () => clearInterval(interval);
  }, [advance, shuffled.length]);

  if (shuffled.length === 0) return null;

  return (
    <div className="projector-slideshow">
      {/* Warm projector tint overlay */}
      <div className="projector-warmth" />

      {/* Current image */}
      <img
        src={shuffled[currentIndex]}
        alt=""
        className={`projector-slide ${isTransitioning ? 'opacity-0' : 'opacity-70'}`}
        draggable={false}
      />

      {/* Next image (fades in during transition) */}
      {shuffled.length > 1 && (
        <img
          src={shuffled[nextIndex]}
          alt=""
          className={`projector-slide ${isTransitioning ? 'opacity-70' : 'opacity-0'}`}
          draggable={false}
        />
      )}
    </div>
  );
};
