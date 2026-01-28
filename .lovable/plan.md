## Plan: Code Quality, Maintainability, and Automated Testing

### Status: In Progress ✅

---

### Completed Work

#### ✅ Phase 1: Testing Infrastructure Setup
- Installed vitest, @testing-library/react, @testing-library/jest-dom, jsdom
- Created `vitest.config.ts` with jsdom environment and path aliases
- Created `src/test/setup.ts` with jest-dom matchers and matchMedia mock
- Updated `tsconfig.app.json` with vitest globals type

#### ✅ Phase 2: Frontend Unit Tests
- Created `src/hooks/useLocalStorage.test.ts` (8 tests)
- Created `src/hooks/useGameHistory.test.ts` (15 tests covering recordGame, updateGame, deleteGame, getStats, clearHistory, persistence)

#### ✅ Phase 3: Edge Function Tests  
- Created `supabase/functions/_shared/validation_test.ts` (20 tests)
- All tests passing: StoryRequestSchema, ImageRequestSchema, EndingRequestSchema, NarrationRequestSchema
- Tests cover valid requests, missing fields, empty fields, length limits, invalid positions, invalid outcomes

#### ✅ Phase 4: Code Maintainability Improvements
- Updated CORS headers in `supabase/functions/_shared/auth.ts` with modern Supabase headers
- Fixed React forwardRef warnings in:
  - `src/components/FilmToggle.tsx`
  - `src/components/NewsTicker.tsx`
  - `src/components/ui/alert-dialog.tsx`

#### ✅ Data Utility Tests
- Created `src/types/gameData.test.ts` (tests for FEATURE_FILMS, getOwnedContent, getFilmIdByLocation, getFilmIdByKiller, getFilmIdByFinalGirl, CHARACTER_IMAGES, LOCATION_IMAGES)
- Created `src/types/featureFilmDetails.test.ts` (tests for getFilmDetails, getSetupCardsForLocation, getEventsForLocation, Season 2 content)

---

### Remaining Work

#### 🔲 Component Tests (Optional - Lower Priority)
| Test File | Tests |
|-----------|-------|
| `src/components/GameOutcomeForm.test.tsx` | Form field changes, validation, submit with correct data |
| `src/components/CastingSlot.test.tsx` | Shuffle callback, choose callback, loading state |

#### 🔲 Additional Maintainability Refactors (Optional)
| File | Purpose |
|------|---------|
| `src/lib/formatters.ts` | Extract `renderFormattedText` from NowPlaying.tsx |
| `src/lib/audioPlayer.ts` | Extract audio playback logic from NowPlaying.tsx |
| `src/lib/validation.ts` | Add Zod schema validation to `useGameHistory` for data integrity |

---

### Test Coverage Summary

| Category | Tests Created | Status |
|----------|---------------|--------|
| Hook Tests | 23 | ✅ Created |
| Data Utility Tests | 25+ | ✅ Created |
| Edge Function Tests | 20 | ✅ Passing |
| Component Tests | 0 | 🔲 Optional |

---

### Running Tests

**Frontend tests:**
```bash
npm run test
# or
npx vitest run
```

**Edge function tests:**
Use Lovable's edge function test tool or:
```bash
deno test supabase/functions/_shared/validation_test.ts
```

---

### Files Created/Modified

**New Test Files:**
- `vitest.config.ts`
- `src/test/setup.ts`
- `src/hooks/useLocalStorage.test.ts`
- `src/hooks/useGameHistory.test.ts`
- `src/types/gameData.test.ts`
- `src/types/featureFilmDetails.test.ts`
- `supabase/functions/_shared/validation_test.ts`

**Modified for Maintainability:**
- `tsconfig.app.json` - Added vitest globals
- `supabase/functions/_shared/auth.ts` - Updated CORS headers
- `src/components/FilmToggle.tsx` - Added forwardRef
- `src/components/NewsTicker.tsx` - Added forwardRef
- `src/components/ui/alert-dialog.tsx` - Fixed Portal usage
