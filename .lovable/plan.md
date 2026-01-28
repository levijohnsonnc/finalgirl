

## Plan: Code Quality, Maintainability, and Automated Testing

### Overview

After thoroughly analyzing the codebase, I'll implement a comprehensive testing and maintainability strategy across **frontend components/hooks**, **edge functions**, and **data integrity** layers.

---

### Current State Assessment

| Area | Status | Issues Found |
|------|--------|--------------|
| **Test Coverage** | None | No test files exist (`*.test.ts` or `*.spec.ts`) |
| **Edge Function Validation** | Good | Zod schemas in `_shared/validation.ts` |
| **Type Safety** | Good | TypeScript throughout, well-defined interfaces |
| **Error Handling** | Moderate | Edge functions handle errors; frontend could be more consistent |
| **Code Organization** | Good | Clear separation of concerns (hooks, components, types, data) |
| **CORS Headers** | Incomplete | Missing newer Supabase headers in `_shared/auth.ts` |

---

### Phase 1: Testing Infrastructure Setup

**Files to create/modify:**

| File | Action |
|------|--------|
| `package.json` | Add test dependencies |
| `vitest.config.ts` | Create Vitest configuration |
| `src/test/setup.ts` | Create test setup file |
| `tsconfig.app.json` | Add Vitest globals type |

**Dependencies to add:**
- `vitest` (test runner)
- `@testing-library/react` (component testing)
- `@testing-library/jest-dom` (DOM matchers)
- `jsdom` (browser environment simulation)

---

### Phase 2: Frontend Unit Tests

**Priority 1 - Core Hooks** (highest business value):

| Test File | Tests |
|-----------|-------|
| `src/hooks/useLocalStorage.test.ts` | Read/write, JSON parsing errors, key isolation |
| `src/hooks/useGameHistory.test.ts` | recordGame, updateGame, deleteGame, getStats calculation, clearHistory |

**Priority 2 - Data Utilities**:

| Test File | Tests |
|-----------|-------|
| `src/types/gameData.test.ts` | `getOwnedContent`, `getFilmIdByLocation`, `getFilmIdByKiller`, `getFilmIdByFinalGirl` |
| `src/types/featureFilmDetails.test.ts` | `getFilmDetails` returns correct data, handles missing IDs |

**Priority 3 - Key Components**:

| Test File | Tests |
|-----------|-------|
| `src/components/FilmToggle.test.tsx` | Owned/not-owned states, toggle callback, disabled state |
| `src/components/GameOutcomeForm.test.tsx` | Form field changes, validation, submit with correct data |
| `src/components/CastingSlot.test.tsx` | Shuffle callback, choose callback, loading state |

---

### Phase 3: Edge Function Tests

**Test files to create in `supabase/functions/`:**

| Test File | Coverage |
|-----------|----------|
| `generate-story/index_test.ts` | Valid request, missing fields, rate limiting, error responses |
| `generate-ending/index_test.ts` | Won/lost outcomes, optional fields, validation errors |
| `generate-story-image/index_test.ts` | Position validation (1-4), character context building |
| `narrate-story/index_test.ts` | Text chunking, audio concatenation, rate limits |
| `_shared/validation_test.ts` | Schema validation for all request types |

**Edge cases to test:**
- Empty/missing optional fields (`startingEvent`, `startingSetup`)
- Maximum length inputs (backstory at 5000 chars)
- Invalid position values for image generation
- Malformed JSON requests
- Rate limit (429) and credit exhaustion (402) responses

---

### Phase 4: Code Maintainability Improvements

**1. Update CORS Headers** (`supabase/functions/_shared/auth.ts`):
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};
```

**2. Extract Reusable Utilities**:

| File | Purpose |
|------|---------|
| `src/lib/formatters.ts` | Move `renderFormattedText` from NowPlaying.tsx |
| `src/lib/audioPlayer.ts` | Extract audio playback logic from NowPlaying.tsx |

**3. Add Type Guards for Runtime Safety**:

| File | Addition |
|------|----------|
| `src/types/gameData.ts` | `isValidCharacterName`, `isValidLocationName` type guards |
| `src/hooks/useGameHistory.ts` | Validate data integrity on localStorage read |

---

### Phase 5: Data Integrity Validation

**Create validation utilities** (`src/lib/validation.ts`):
- Validate game result data structure before storage
- Validate character/location names against known data
- Sanitize user inputs (gameHighlights, weaponUsed, endingSubLocation)

**Add schema validation to `useGameHistory`**:
- Parse stored data with Zod on read
- Handle migration if data format changes
- Log warnings for invalid stored data

---

### Implementation Order

```text
Step 1: Testing Infrastructure
    |
    +-- Install dependencies
    +-- Configure Vitest
    +-- Create setup file
    |
Step 2: Hook Tests (no UI dependencies)
    |
    +-- useLocalStorage.test.ts
    +-- useGameHistory.test.ts
    |
Step 3: Data Utility Tests
    |
    +-- gameData.test.ts
    +-- featureFilmDetails.test.ts
    |
Step 4: Edge Function Tests
    |
    +-- _shared/validation_test.ts
    +-- generate-story/index_test.ts
    +-- generate-ending/index_test.ts
    +-- generate-story-image/index_test.ts
    +-- narrate-story/index_test.ts
    |
Step 5: Component Tests
    |
    +-- FilmToggle.test.tsx
    +-- GameOutcomeForm.test.tsx
    |
Step 6: Maintainability Refactors
    |
    +-- Update CORS headers
    +-- Extract utilities
    +-- Add type guards
```

---

### Test Examples

**useGameHistory.test.ts** (sample structure):
```typescript
describe('useGameHistory', () => {
  beforeEach(() => localStorage.clear());
  
  it('records a new game with generated id and timestamp');
  it('updates an existing game by id');
  it('calculates win rate correctly');
  it('aggregates stats by finalGirl, killer, and location');
  it('handles empty history gracefully');
  it('clears all history');
  it('deletes a specific game');
});
```

**generate-story/index_test.ts** (sample structure):
```typescript
Deno.test('returns story for valid request');
Deno.test('returns 400 for missing killer name');
Deno.test('handles optional startingEvent gracefully');
Deno.test('returns generic error message for internal failures');
```

---

### Technical Notes

**Testing Environment:**
- Frontend tests run with Vitest + jsdom
- Edge function tests run with Deno's built-in test runner
- Both use native assertion libraries (no external test frameworks needed)

**Mock Strategy:**
- Mock `supabase.functions.invoke` for component integration tests
- Mock `fetch` for edge function unit tests to avoid live API calls
- Use `localStorage` directly in hook tests (jsdom provides implementation)

**Running Tests:**
- Frontend: `npm run test` (after adding script)
- Edge functions: Use Lovable's edge function test tool

---

### Success Criteria

1. All core hooks have 90%+ branch coverage
2. All edge functions have tests for happy path + error cases
3. All data utility functions have tests for edge cases
4. No breaking changes to existing functionality
5. Tests run in under 30 seconds total

