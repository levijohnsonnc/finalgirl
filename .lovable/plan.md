

## Plan: Switch OpenAI image generation to gpt-image-1 with low moderation

### Problem
The current OpenAI implementation uses `dall-e-3` with default (strict) content moderation, which rejects horror-themed prompts as content policy violations.

### Change

**File: `supabase/functions/generate-scene-image/index.ts`** — `generateWithOpenAI` function

Update the API call:
- Change model from `"dall-e-3"` to `"gpt-image-1"`
- Add `moderation: "low"` to reduce false-positive content rejections on horror/thriller imagery
- Update the endpoint if needed (gpt-image-1 uses the same `/v1/images/generations` endpoint)
- Adjust size parameter if needed (gpt-image-1 supports `1536x1024` for landscape instead of `1792x1024`)
- Parse the OpenAI error response body to surface `content_policy_violation` specifically instead of the generic "check your API key" message

### Also improve error handling
- Parse the error JSON from OpenAI to detect the actual error type
- Return a specific message for content policy violations vs. auth/quota errors

