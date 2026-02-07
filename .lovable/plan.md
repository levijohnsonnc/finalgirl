

# Fix Narration Playback on iPhone

## The Problem
iOS Safari enforces two restrictions that break the current narration flow:

1. **User gesture expiration** -- `audio.play()` must happen in direct response to a user tap. The current code awaits a network fetch (several seconds) between the tap and the play call, so iOS considers the gesture "stale" and silently refuses to play.
2. **Data URI size limits** -- iOS Safari caps data URIs at roughly 2MB. A narrated story encoded as `data:audio/mpeg;base64,...` can exceed this, causing silent failure even if the gesture issue were solved.

## The Fix

Two changes, applied identically in both `NowPlaying.tsx` and `TheEnd.tsx`:

### 1. Prime the Audio element on tap
Create and "unlock" an `Audio` element immediately when the user taps "Narrate" -- before any async work. This satisfies iOS's gesture requirement. The element plays a tiny silent buffer to mark itself as user-activated, then we load the real audio into it after the fetch completes.

### 2. Use Blob URLs instead of data URIs
Convert the base64 response to a `Blob`, create an object URL with `URL.createObjectURL()`, and assign that to the audio element's `src`. This avoids the data URI size cap entirely and is more memory-efficient on all platforms.

## Technical Details

### Files changed

**`src/pages/NowPlaying.tsx`** and **`src/pages/TheEnd.tsx`** -- both have nearly identical `handleNarrate` functions that need the same update.

### New flow (pseudocode)

```text
handleNarrate():
  1. Create Audio element immediately (in tap handler)
  2. Play a tiny silent WAV to "unlock" it on iOS
  3. await fetch narrate-story endpoint
  4. Decode base64 response to Uint8Array
  5. Create Blob from binary data (type: audio/mpeg)
  6. Create object URL from Blob
  7. Set audio.src = objectURL
  8. await audio.play()
  9. On ended/error, revoke the object URL to free memory
```

### Helper function
A small shared utility will be created to convert base64 strings to Blobs, keeping the two page files clean:

**`src/lib/audioUtils.ts`** (new file)
- `base64ToBlob(base64: string, mimeType: string): Blob` -- decodes base64 to binary and wraps in a Blob
- `createSilentAudio(): HTMLAudioElement` -- creates and primes an Audio element with a tiny silent WAV data URI (44 bytes, well under any size limit) so iOS marks it as user-gesture-activated

### Changes to handleNarrate in both files
- At the very top of the function (before any await), call `createSilentAudio()` to get a primed audio element
- After the fetch, use `base64ToBlob()` to convert the response
- Set `audio.src = URL.createObjectURL(blob)` on the primed element
- Add cleanup in `onended` and `onerror` to call `URL.revokeObjectURL()`
- Remove the old `data:audio/mpeg;base64,...` data URI approach

### Why this works on iOS
- The Audio element is created and `.play()` is called synchronously within the tap handler (satisfying the gesture policy)
- The silent audio is tiny enough to always work as a data URI
- The real audio uses a Blob URL which has no size restriction
- When the real src is assigned and played, iOS allows it because the element was already "unlocked"

### No backend changes needed
The edge function returns the same base64 audio content. Only the client-side playback mechanism changes.

