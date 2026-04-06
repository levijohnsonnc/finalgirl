

## User API Key for Image Generation

### Overview
Let users bring their own API key (Google Gemini, OpenAI, or Stability AI) to unlock AI-generated scene images on both the "Now Playing" (beginning) and "The End" (ending) pages. Keys are stored server-side only, never exposed to the client after entry.

### Security Model
- API keys are stored in a new `user_api_keys` table with RLS so users can only access their own rows.
- The key value is sent to the backend once on save; the client never reads it back (write-only from the UI perspective).
- A new edge function `generate-scene-image` accepts the user's auth token, looks up the key from the DB server-side, and calls the appropriate provider. The raw key never touches the client after initial entry.
- The UI masks the key after entry, showing only the last 4 characters.

### Database

**New table: `user_api_keys`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | default gen_random_uuid() |
| user_id | uuid NOT NULL | |
| provider | text NOT NULL | 'google', 'openai', or 'stability' |
| api_key_encrypted | text NOT NULL | stored as-is (encrypted at rest by Supabase) |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

- UNIQUE constraint on (user_id, provider) — one key per provider per user.
- RLS: users can INSERT/UPDATE/DELETE their own rows. SELECT returns only `id`, `provider`, `user_id`, `created_at` (the edge function reads the key server-side using service role).
- Actually, for simplicity: RLS allows full CRUD on own rows. The client simply never queries the `api_key_encrypted` column — we only SELECT `id, provider, created_at` in the hook.

**New table: `user_image_settings`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | default gen_random_uuid() |
| user_id | uuid NOT NULL UNIQUE | |
| auto_generate_images | boolean | default false |
| preferred_provider | text | default null |
| created_at / updated_at | timestamptz | |

- RLS: users can CRUD their own row.

### Frontend Changes

**1. My Collection (Archive.tsx) — New "Image Generation" settings section**
- Placed above the season list, below the header.
- If not logged in: greyed out with "Sign in to configure image generation."
- If logged in, shows:
  - Provider dropdown (Google Gemini / OpenAI DALL-E / Stability AI).
  - Password-style input for the API key, with a Save button.
  - After saving, shows "Key saved (····XXXX)" with a Remove button.
  - Security copy: "Your key is stored securely and is never exposed after saving."
  - Toggle: "Auto-generate scene images" (disabled until a key is saved).

**2. New hook: `useImageGeneration`**
- Reads from `user_api_keys` and `user_image_settings`.
- Exposes: `hasApiKey`, `provider`, `autoGenerate`, `setAutoGenerate`, `saveApiKey`, `removeApiKey`, `generateImage(context)`.
- `generateImage` calls the new edge function with auth token + image context; the edge function looks up the key.

**3. NowPlaying.tsx — After story loads**
- If `hasApiKey`:
  - If `autoGenerate` is on, automatically call `generateImage` with the story context.
  - Show a "Generate Scene" button (replaces/augments the current Image Prompt button). If an image exists, show "Regenerate Scene" instead.
  - Show the auto-generate toggle inline.
- If no API key:
  - Where the generate button would be, show a muted hint: "Add an image API key in My Collection to generate scene images."

**4. TheEnd.tsx — Same pattern**
- Identical generate/regenerate/auto-generate controls after the ending story loads.
- Uses the ending story + character context for the image prompt.

### Edge Function: `generate-scene-image`

- Authenticated endpoint (validates JWT in code).
- Reads the user's API key from `user_api_keys` using the service role client.
- Accepts: `{ story, killer, killerDescription, finalGirl, finalGirlDescription, location, locationDescription, sceneType: 'beginning' | 'ending' }`.
- Uses the same two-step approach as the existing `generate-story-image`: extract a visual description via Lovable AI, then call the user's chosen provider to generate the image.
- Provider routing:
  - **Google Gemini**: calls `generativelanguage.googleapis.com` (same as current).
  - **OpenAI**: calls `api.openai.com/v1/images/generations` with DALL-E 3.
  - **Stability AI**: calls `api.stability.ai/v2beta/stable-image/generate/core`.
- Returns `{ imageUrl }` (base64 data URL).

### Summary of files changed/created

| File | Action |
|------|--------|
| Migration SQL | New tables `user_api_keys`, `user_image_settings` with RLS |
| `src/hooks/useImageGeneration.ts` | New hook |
| `src/pages/Archive.tsx` | Add API key management section |
| `src/pages/NowPlaying.tsx` | Add generate/regenerate/auto-generate controls |
| `src/pages/TheEnd.tsx` | Same controls |
| `supabase/functions/generate-scene-image/index.ts` | New edge function |

