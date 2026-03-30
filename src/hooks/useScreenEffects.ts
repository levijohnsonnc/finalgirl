import { useState, useEffect } from 'react';

interface ScreenEffects {
  showFlicker: boolean;
  showFrameJump: boolean;
}

/**
 * Provides random VHS analog imperfection effects (flicker and frame jump).
 * Flicker fires every 15-30s for 150ms; frame jump fires every 40-60s for 120ms.
 */
export const useScreenEffects = (): ScreenEffects => {
  const [showFlicker, setShowFlicker] = useState(false);
  const [showFrameJump, setShowFrameJump] = useState(false);

  useEffect(() => {
    const scheduleFlicker = (): ReturnType<typeof setTimeout> => {
      const delay = Math.random() * 15000 + 15000;
      return setTimeout(() => {
        setShowFlicker(true);
        setTimeout(() => setShowFlicker(false), 150);
        scheduleFlicker();
      }, delay);
    };

    const scheduleFrameJump = (): ReturnType<typeof setTimeout> => {
      const delay = Math.random() * 20000 + 40000;
      return setTimeout(() => {
        setShowFrameJump(true);
        setTimeout(() => setShowFrameJump(false), 120);
        scheduleFrameJump();
      }, delay);
    };

    const flickerTimeout = scheduleFlicker();
    const frameJumpTimeout = scheduleFrameJump();

    return () => {
      clearTimeout(flickerTimeout);
      clearTimeout(frameJumpTimeout);
    };
  }, []);

  return { showFlicker, showFrameJump };
};
