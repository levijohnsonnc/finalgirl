

# Optional Authentication System with Google Sign-In

## Overview
Add an optional sign-in system that allows users to persist their game data (scrapbooks, stats, collection settings) to the cloud. Users can continue using the app without signing in, but logged-in users get their data synced across devices. Includes both email/password and Google OAuth sign-in options.

---

## Database Schema

### Tables to Create

**1. `profiles` table**
- `id` (uuid, primary key, references auth.users)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**2. `game_history` table**
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `timestamp` (bigint)
- `outcome` (text: 'won' | 'lost')
- `killer` (text)
- `location` (text)
- `final_girl` (text)
- `setup_scenario` (text, nullable)
- `starting_event` (text, nullable)
- `intro_story` (text, nullable)
- `ending_narration` (text, nullable)
- `game_highlights` (text, nullable)
- `final_horror_level` (integer, nullable)
- `final_girl_health` (integer, nullable)
- `killer_health` (integer, nullable)
- `weapon_used` (text, nullable)
- `ending_sub_location` (text, nullable)
- `victims_saved` (integer, nullable)
- `victims_killed` (integer, nullable)
- `poster_image_url` (text, nullable)
- `scene_image_url` (text, nullable)
- `created_at` (timestamp)

**3. `user_settings` table**
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users, unique)
- `owned_films` (jsonb - array of film IDs)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### RLS Policies
All tables will have Row-Level Security enabled:
- Users can only read/write their own data
- Policies use `auth.uid()` to verify ownership

---

## Authentication Configuration

### Email Settings
- **Auto-confirm email signups: ENABLED** - Users can sign in immediately without email verification

### Google OAuth
- Uses Lovable Cloud's managed Google OAuth (no API keys needed)
- Implemented via `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`
- Will use the `supabase--configure-social-auth` tool to generate the required integration module

---

## New Components

### 1. Auth Page (`/auth`)
**File:** `src/pages/Auth.tsx`

- Full-screen page with the provided cabin/dock horror image as background
- Applies same VHS effects as Marquee:
  - `projector-pulse` animation
  - `film-grain` overlay
  - `scanlines-overlay`
  - `vignette`
  - `frame-jump` (random)
  - `screen-flicker` (random)
- Form positioned to the right side of the screen
- **Sign-in options:**
  - Email/password form (login or signup toggle)
  - "Sign in with Google" button
- Conditional rendering based on auth state:
  - **Not logged in:** Show login/signup forms + Google button
  - **Logged in:** Show user email + logout button
- Styled with VHS aesthetic (`font-vhs`, muted colors, blood-red accents)

### 2. Auth Context/Hook
**File:** `src/hooks/useAuth.ts`

- Uses `supabase.auth.onAuthStateChange` for session management
- Provides: `user`, `session`, `isLoading`, `signIn`, `signUp`, `signOut`, `signInWithGoogle`
- Handles both email/password and Google OAuth

---

## Data Synchronization Strategy

### On First Sign-Up/Sign-In (Migration)
When a user signs up or signs in for the first time:
1. Check if user already has data in the database
2. If not, read all existing localStorage data
3. Upload to database tables
4. Clear localStorage (data now lives in cloud)

### Ongoing Sync (Logged-In Users)
- `useGameHistory` hook will check auth state
- If logged in: Read/write to database
- If not logged in: Continue using localStorage

### Hook Modifications
**`src/hooks/useGameHistory.ts`**
- Add auth state check
- If authenticated: Use database queries via React Query
- If not authenticated: Use existing localStorage logic

**`src/pages/Archive.tsx`**
- Add auth state check for `owned_films`
- If authenticated: Read/write to `user_settings` table
- If not authenticated: Use existing localStorage

---

## Footer Navigation Updates

### Marquee Page (`src/components/Marquee.tsx`)
Add subtle "Sign In" / "Sign Out" link to footer navigation:
- Position: Integrated with existing nav links
- Style: Same as other footer links (`text-foreground/30`, hover color)
- Text changes based on auth state

### Main App Footer (`src/pages/Index.tsx`)
Add same subtle auth link to the fixed footer

---

## Routing Changes

**`src/App.tsx`**
- Add `/auth` route pointing to new Auth page

---

## Implementation Sequence

1. **Database Setup**
   - Create migration with `profiles`, `game_history`, and `user_settings` tables
   - Enable RLS with appropriate policies
   - Configure auto-confirm email signups

2. **Google OAuth Setup**
   - Use `supabase--configure-social-auth` tool to configure Google provider
   - This generates `src/integrations/lovable/` module automatically

3. **Auth Infrastructure**
   - Create `useAuth` hook with session management (email + Google)
   - Create Auth page with VHS styling and both sign-in methods
   - Add `/auth` route

4. **Footer Integration**
   - Add auth link to Marquee footer
   - Add auth link to main app footer

5. **Data Layer Updates**
   - Modify `useGameHistory` to support both localStorage and database
   - Create sync logic for first sign-up migration
   - Update Archive page for `owned_films` sync

6. **Image Asset**
   - Copy uploaded cabin image to `src/assets/auth-bg.png`

---

## Technical Details

### VHS Effects to Reuse
The Auth page will import and apply these existing CSS classes:
- `projector-pulse` - slow brightness animation on background
- `film-grain` - animated noise overlay
- `scanlines-overlay` - horizontal CRT lines
- `vignette` - darkened corners
- Random `frame-jump` and `screen-flicker` effects (same logic as Marquee)

### Form Styling
- Background: Semi-transparent dark (`bg-black/60 backdrop-blur`)
- Font: `font-vhs` for labels and buttons
- Inputs: Dark background, muted borders, VHS-style focus states
- Email/Password Button: Blood-red accent, subtle glow on hover
- Google Button: White background with Google branding

### Data Types
The `GameResult` interface will remain the same, but database columns use snake_case. A mapping utility will convert between camelCase (frontend) and snake_case (database).

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Auth.tsx` | Authentication page with VHS styling, email/password + Google sign-in |
| `src/hooks/useAuth.ts` | Auth state management hook |
| `src/assets/auth-bg.png` | Background image (cabin/dock horror scene) |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/auth` route |
| `src/components/Marquee.tsx` | Add Sign In/Out link to footer |
| `src/pages/Index.tsx` | Add Sign In/Out link to footer |
| `src/hooks/useGameHistory.ts` | Add database sync for authenticated users |
| `src/pages/Archive.tsx` | Add database sync for owned_films |

## Tools to Use

| Tool | Purpose |
|------|---------|
| Database migration tool | Create tables with RLS policies |
| Configure auth tool | Enable auto-confirm email signups |
| Configure social auth tool | Set up Google OAuth integration |

