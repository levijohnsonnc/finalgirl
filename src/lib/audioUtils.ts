/**
 * Audio utilities for iOS-compatible playback.
 *
 * iOS Safari requires audio.play() to be called synchronously within a user
 * gesture handler.  Because we fetch narration audio asynchronously, we "prime"
 * an Audio element with a tiny silent WAV immediately on tap, then swap in the
 * real audio once the fetch completes.
 *
 * We also use Blob URLs instead of data URIs to avoid iOS's ~2 MB data-URI cap.
 */

// A minimal valid WAV file: 44-byte header, 1 sample of silence (16-bit mono, 44100 Hz)
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

/**
 * Create an Audio element and immediately play a silent clip so iOS marks it as
 * "user-gesture-activated".  The returned element can later have its `src`
 * replaced with real audio and `.play()` will be allowed.
 */
export function createPrimedAudio(): HTMLAudioElement {
  const audio = new Audio(SILENT_WAV);
  // Play the silent buffer synchronously within the tap handler.
  // We intentionally ignore the promise – the point is just to unlock the element.
  audio.play().catch(() => {});
  return audio;
}

/**
 * Decode a base64 string into a Blob.
 *
 * Uses `atob` → charCode conversion which works correctly for binary data
 * because every base64-decoded byte maps 1-to-1 to a Latin-1 char code.
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteChars = atob(base64);
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimeType });
}
