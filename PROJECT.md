# Mise en Placé — Project Status

**Owner:** Steve Ellis (steveellis67@gmail.com)  
**Domain:** miseenplacerecipes.com — **live** on Vercel (Production). DNS at Namecheap: A record `@` → `216.198.79.1`, CNAME `www` → domain-specific Vercel value (check Vercel's Domains page for the current one if it ever needs re-adding — it issues a unique per-domain CNAME target, not the generic `cname.vercel-dns.com`).  
**Note:** misoenplace.app was purchased earlier by mistake (typo). It's kept (owned through the year) and set up as a 308 redirect to miseenplacerecipes.com via Vercel's domain redirect feature — not removed, just forwards traffic.  
**Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · Supabase · Anthropic Claude API  
**Last updated:** July 12, 2026 (same day, later session — brand refresh rolled out sitewide, deployed to production, and a couple of follow-up polish fixes)

---

## What This Is

A recipe management and culinary education web app for serious home cooks. Core idea: every technique mentioned in a recipe is tappable, opening a popup with a definition, step-by-step how-to instructions, and a link to a professional video (Rouxbe, CIA, or YouTube). Recipes can be imported from any URL, photo, or pasted text using Claude AI. An AI Meal Planner suggests recipes based on what's in your pantry.

---

## Design Language

- **Brand palette:** `#21201D` (charcoal), `#5C6B47` (olive), `#B85C38` (terracotta), `#C99A3D` (mustard), `#F3EDE4` (cream), plus supporting neutrals derived from those five: `#E4DACB`/`#D6C9AF` (light tan borders), `#7A7468`/`#5A564D` (muted body text on light bg), `#DCE0D2`/`#C9C4B8` (secondary text on dark/olive bg), `#4A5639`/`#6E7D5A` (darker olive fills/borders for chips and panels on olive or charcoal backgrounds). Hex values are eye-estimated from a brand mockup image, not an official style guide — nudge them if Steve has exact values later.
- **New typography:** Playfair Display (headings, `var(--font-playfair)`) + Montserrat (body/nav, `var(--font-montserrat)`), loaded via `next/font/google` in `app/layout.tsx`. Replaces the old Georgia-italic/Arial pairing sitewide.
- **Old palette (fully retired from every live, user-facing page):** `#27500A` (deep green), `#3B6D11`, `#639922`, `#EAF3DE` (cream), `#97C459` (sage — except LogoMark's deliberate dark-mode leaf, see below), `#C0DD97`, Georgia italic headings, Arial/system body.
- **Rebrand status:** Applied to every page a signed-in or signed-out user can actually reach — homepage chrome (`Header.tsx`, `Footer.tsx`, `Hero.tsx`, `Features.tsx`, `Showcase.tsx`, `Education.tsx`), recipe gallery (`/recipes` + `MealPlanner.tsx` + `FavoriteButton.tsx`), profile page (`/cook/[id]` + `ProfileTabs.tsx`), techniques page (`/techniques` + `TechniqueGallery.tsx` + `VideoTipsSection.tsx`), import page (`/import`), community page (`/community` + `CommunityPage.tsx` — still unlinked from nav/footer but fully rebranded since it'll be revealed later), individual recipe pages (`/recipes/[id]` view via `RecipeScaler.tsx`, `/recipes/[id]/edit`, `PhotoUpload.tsx`, `Comments.tsx`), and sign-in (`/signin`, including the "check your email" state). **Not yet applied:** `/cook/[id]/edit` (profile edit) + its `ProfilePhotoUpload.tsx`/`BannerPhotoUpload.tsx`, `/admin`, and the dormant homepage sections that are commented out and not currently rendered (`HowItWorks.tsx`, `Pricing.tsx`, `Colours.tsx`, `Story.tsx`) — plus the unused `Nav.tsx` (not imported anywhere). Worth a pass if/when those get switched back on.
- **Logo:** `components/LogoMark.tsx` — a 2x2 grid icon mark (leaf/whisk/measuring cup/open book), replaces the old single leaf-steam icon. Both modes render with no background fill so it lets the surface color show through — `mode="dark"` for olive/charcoal surfaces (bright green leaf `#97C459` for visibility, off-white line work), `mode="light"` for cream surfaces (true brand olive leaf, charcoal line work). Used in Header, Footer, and Hero (via BrandLockup).
- **`components/BrandLockup.tsx`:** Reusable, resizable version of the Hero's logo + "Mise en Place" + divider + tagline unit, accepting a `scale` prop that multiplies every calibrated pixel value (including the DOM-measured logo sizing and font-leading offsets) so the exact alignment holds at any size. Currently used in `Hero.tsx` at `scale={1.05}`.
- **Style:** Inline styles throughout (not Tailwind classes in components)
- **All components use inline styles** — do not add Tailwind class-based styling to existing components

---

## Tech Stack & Key Libraries

| Layer | Tool |
|---|---|
| Framework | Next.js App Router (`force-dynamic` on data pages) |
| Auth + DB | Supabase (`@supabase/ssr`) |
| AI | Anthropic SDK — Claude Opus 4.5 (import/vision), Claude Haiku (meal planner) |
| Web scraping | Firecrawl (`@mendable/firecrawl-js`) |
| Photos | Unsplash API (free tier, Access Key in `.env.local`) |

### Supabase client pattern
- **Server components / API routes:** `createServerClient` from `@supabase/ssr` with `cookies()` from `next/headers`
- **Client components:** `createBrowserClient` via `lib/supabase-browser.ts` (exported as `createClient`)

---

## Environment Variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=<set in Vercel project env vars — see Supabase dashboard>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<set in Vercel project env vars — see Supabase dashboard>
ANTHROPIC_API_KEY=<set in Vercel project env vars — see Anthropic console>
FIRECRAWL_API_KEY=<set in Vercel project env vars — see Firecrawl dashboard>
UNSPLASH_ACCESS_KEY=<set in Vercel project env vars — see Unsplash developer dashboard>
```

**Security note:** actual key values were previously committed in plaintext here — GitHub's push protection blocked a push over the Anthropic key on 2026-07-12 and they were redacted. If any of these keys have been exposed (check GitHub's secret-scanning alert / this file's git history), rotate them from each provider's dashboard as a precaution.

---

## Completed Features

### ✅ Recipe Import (AI-powered)
- **Route:** `app/api/import-recipe/route.ts`
- Three modes: URL (Firecrawl scrape → Claude), pasted text (Claude), photo/image (Claude vision)
- Auto-matches culinary technique IDs from recipe steps + ingredients on save
- Saves to Supabase `recipes` table with `technique_ids` populated automatically

### ✅ Recipe Scaler
- **Component:** `components/RecipeScaler.tsx`
- Live ingredient scaling by serving count
- Unit conversion (imperial ↔ metric)
- Shows author byline (avatar + name linking to `/cook/[userId]`)
- Spotify song link integration
- Comments section at bottom

### ✅ Culinary Technique Gallery
- **Data:** `lib/techniques.ts` — single source of truth, ~80 techniques
- **Component:** `components/TechniqueGallery.tsx`
- **Page:** `app/techniques/page.tsx`
- Techniques organized by 12 categories, searchable
- Each technique has: `id`, `name`, `category`, `definition`, `steps[]`, optional `confusedWith`, optional `videoUrl` + `videoSourceLabel`
- **Technique popup** shows: definition → numbered how-to steps → "confused with" callout → "▶ Watch how to do it" video link
- **63+ techniques** have direct video links: Rouxbe (professional culinary school), CIA (Culinary Institute of America YouTube), or YouTube search
- **`id` values are stable** — do not rename once recipes reference them

### ✅ AI Meal Planner
- **Route:** `app/api/meal-planner/route.ts`
- **Component:** `components/MealPlanner.tsx` — open by default at top of `/recipes` page
- User types pantry ingredients + dietary preferences
- Returns two separate sections:
  - **Saved matches** (scored from user's saved recipes) — paginated with arrows
  - **AI suggestions** (Claude Haiku generates exactly 6, always a full 2×3 grid)
- Clicking an AI suggestion calls `/api/import-recipe` with rich prompt text, then `/api/unsplash-photo` for a photo, then navigates to the saved recipe

### ✅ Unsplash Photo Integration
- **Route:** `app/api/unsplash-photo/route.ts`
- GET `?q=recipe+title&recipeId=uuid`
- Searches Unsplash for a landscape food photo, triggers required download ping, saves URL to recipe

### ✅ Comments
- **Route:** `app/api/comments/route.ts`
- **Component:** `components/Comments.tsx`
- Auth-gated posting, 2000-char limit, initials avatar
- Author name snapshot at post time (changing profile name does NOT cascade to old comments — known limitation, deferred)
- Wired into `RecipeScaler` at bottom of every recipe page

### ✅ Recipe Author Byline
- `app/recipes/[id]/page.tsx` fetches `authorProfile` (display_name, profile_photo_url from `profiles` table)
- Displayed in `RecipeScaler` below description — avatar/initials + name as Link to `/cook/[userId]`
- Live from profiles (updates automatically if user changes display name)

### ✅ Community Page
- **Page:** `app/community/page.tsx` (server) + `components/CommunityPage.tsx` (client)
- **Search route:** `app/api/community/search/route.ts`
- Shows: new public members, recent public recipes, recent comments from public members
- Debounced search by recipe tags — finds members who cook in your style
- Privacy: only `is_public = true` profiles appear. Users can use the full app without being public.

### ✅ Video Tips Library
- **Data:** `lib/videoTips.ts`
- Separate browsable index of short cooking videos from Rouxbe and CIA
- Shown on `/techniques` page as "Video Cooking Tips" section
- Outbound links only — we do not host or embed video
- Affiliate ID placeholder ready (`ROUXBE_AFFILIATE_ID`) — set when affiliate account exists

### ✅ Nutrition Estimates
- **Route:** `app/api/import-recipe/route.ts` — same Claude call used for recipe extraction also returns a `nutrition` object (calories, fat_g, sodium_mg, sugar_g), estimated **per serving**
- Saved to new `recipes` columns: `calories`, `fat_g`, `sodium_mg`, `sugar_g`
- Displayed in a "Nutrition" card in `RecipeScaler.tsx` — values don't change when servings are scaled, since they're already per-serving
- **Backfill:** `scripts/backfill-nutrition.mjs` (`npm run backfill:nutrition`) — one-time script that estimates nutrition for recipes imported before this feature existed. Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (not committed). Already run once — all 35 pre-existing recipes backfilled.

### ✅ Favorites (heart/save a recipe)
- **Route:** `app/api/favorites/route.ts` — POST to favorite, DELETE to unfavorite, auth-gated
- **Component:** `components/FavoriteButton.tsx` — heart icon, optimistic toggle, two variants (`card` overlay for gallery grids, `detail` pill for the recipe page). Redirects to `/signin` if logged out.
- Wired into `RecipeScaler.tsx` (recipe detail) and `app/recipes/page.tsx` (gallery cards)
- **Table:** new `favorites` table (`user_id`, `recipe_id`, unique pair) — see Supabase Tables below

### ✅ Profile Tabs (Added / Saved)
- **Component:** `components/ProfileTabs.tsx`
- `app/cook/[id]/page.tsx` now shows two tabs: **Added** (recipes the profile owns — same query as before) and **Saved** (recipes favorited from other cooks, joined via `favorites`)
- **Saved tab only appears on your own profile** — favorites are treated as personal, not broadcast to visitors viewing someone else's profile (easy to change if you want it public later)

### ✅ Landing page cleanup (beta soft-launch pass)
- **Hero** — dropped the `$2.67/month` price tease; paywall isn't built yet, so the hero now just says "Free during beta"
- **Features** — "Import from anywhere" copy no longer claims TikTok/Instagram support (never actually implemented — only URL/text/photo); now matches `/import` reality
- **HowItWorks** — dropped unimplemented "translation" and "dietary tagging" claims from step 2; copy now matches what the import pipeline actually does
- **Showcase** — was 100% hardcoded fake data (fabricated recipe titles, fake "2.4k saves" counts, fake credit sites). Rewritten as an async server component pulling real public/featured recipes from Supabase (title, real tags, real source domain via `source_url`, real author from `profiles` where `is_public`). Renders `null` and disappears entirely if there are no public recipes yet, instead of showing fake content.
- **Footer** — replaced five dead/placeholder links (`Discover recipes`, `User profiles`, `Trending today`, `Our story`, `Download iOS/Android`, `Privacy policy` — none had real hrefs or destination pages) with real working links: Recipes, Techniques, Community, Import a recipe, Sign in. Dropped the `$2.67` pricing tagline for the same reason as the hero.
- **Signup flow verified** — confirmed open (Google OAuth + magic link, no invite gate) for the soft-launch decision to let anyone sign up without promoting it widely yet.
- **Bug fix (blocking build):** `app/api/meal-planner/route.ts` had an implicit-`any` TypeScript error (`ri` param in the ingredient-matching filter) that failed `tsc --noEmit`. Added explicit `string` type — fixed, `tsc --noEmit` now passes clean with zero errors.

### ✅ Live deployment
- Site is live at **miseenplacerecipes.com** on Vercel, Production environment
- `misoenplace.app` (the old typo domain) 308-redirects to it
- Supabase Auth **Site URL** and **Redirect URLs** updated to the new domain; magic link + Google sign-in both confirmed working on the real domain

### ✅ Brand refresh (sitewide — every live, user-facing page)
- New logo mark, color palette, and typography applied everywhere a user can land, including `/community` (kept unlinked but still rebranded, since it'll be switched on later) and the recipe detail/edit/comments/photo-upload surfaces and sign-in — see **Design Language** above for the full page list and what's still outstanding
- `components/BrandLockup.tsx` extracted from Hero's logo+title+tagline block into a reusable, scale-aware component
- **How It Works section** — commented out of `app/page.tsx` (component file untouched, just not rendered — easy to bring back)
- **Community hidden** — nav link removed from Header, link removed from Footer, Showcase section reworded away from "community" framing ("Recently added" / "Fresh from the kitchen" instead of "From the community"). The `/community` page, `CommunityPage.tsx`, and its search route are all still fully built, rebranded, and live at the URL — just not linked to anywhere until there's an actual community to show.
- **Features tiles reduced from 6 to 3** — Import, Learn culinary techniques, AI Meal Planner. Dropped: Scale servings, Community, Link a song tiles (and their now-unused Supabase `featuredSong`/`featuredScale` queries, removed from `Features.tsx`). The underlying features themselves (RecipeScaler's serving-scale UI, the Community page, and the per-recipe Spotify song embed) all still exist and are now rebranded too, in case any come back as a tile later.
- **"Claude suggests" → "Mise en Place Creations"** — renamed in `MealPlanner.tsx`, both the section eyebrow above the 6-card AI suggestion grid and the small pill badge on each of those cards. The "✓ In your recipes" badge on saved-match cards is unchanged. Code comments still say "Claude" internally (not user-facing, left as-is).
- **Profile page name position** — in `app/cook/[id]/page.tsx`, the name/recipe-count block next to the avatar no longer bottom-aligns with the avatar via the shared `flex-end` row (which crowded it right against the banner boundary). It now uses `alignSelf: 'flex-start'` + `marginTop: '80px'` to sit further down in the open cream space, independent of the avatar and "Edit profile" button's alignment.

### ✅ Deployed to production (this session's full backlog)
- Discovered the local git repo's `main` was already in sync with `origin/main`, but a huge amount of prior feature work — Community page, Techniques page, Comments, Favorites, Meal Planner, photo upload, `lib/techniques.ts`, `lib/videoTips.ts`, `lib/units.ts`, the Supabase migration, plus this entire session's rebrand — had never actually been committed to git at all (shown as untracked, not just uncommitted). The live site was serving a May 31 build.
- Hit a stale, unremovable `.git/index.lock` in the mounted project folder (a FUSE-mount quirk — `rm`/`os.remove` both failed with "Operation not permitted" despite normal-looking file ownership). Worked around it by rsync-ing the whole working tree to a scratch copy outside the mount, committing and pushing from there.
- GitHub's push protection blocked the first push attempt: `PROJECT.md` had **live plaintext API keys** committed in it (Anthropic, Supabase, Firecrawl, Unsplash). Redacted all of them from this file's Environment Variables section (values now live only in Vercel's project env vars / each provider's dashboard) and pushed again successfully.
- **Action item for Steve:** since those keys sat in a git-tracked file (even though the push itself was blocked, they were committed locally and briefly present in a rejected push), consider rotating the Anthropic, Firecrawl, and Unsplash keys from their respective dashboards as a precaution. The Supabase anon key is public-safe by design and doesn't need rotation.
- Everything from this session is now live on `main` → deployed via Vercel's GitHub integration. Added `.DS_Store` to `.gitignore` and stopped tracking the ones already committed, while at it.

---

## Key File Map

```
app/
  page.tsx                        — Homepage
  recipes/
    page.tsx                      — Recipe gallery (MealPlanner at top, favorite hearts on cards)
    [id]/page.tsx                 — Single recipe (fetches author profile + favorite status)
  techniques/page.tsx             — Technique gallery
  community/page.tsx              — Community page (server component)
  import/page.tsx                 — Recipe import UI
  cook/[id]/page.tsx              — Public cook profile (Added / Saved tabs) — note: actual folder is [id], not [userId]
  api/
    import-recipe/route.ts        — AI recipe import (all 3 modes) + technique auto-tagging + nutrition estimate
    meal-planner/route.ts         — Pantry → saved matches + 6 AI suggestions
    unsplash-photo/route.ts       — Fetch + save Unsplash photo for a recipe
    comments/route.ts             — GET + POST comments
    community/search/route.ts     — Tag-based member search
    favorites/route.ts            — POST/DELETE to favorite/unfavorite a recipe

components/
  Header.tsx                      — Nav: Home, Recipes, Techniques, Community, Import
  Features.tsx                    — Homepage feature icons (6 tiles)
  TechniqueGallery.tsx            — Gallery + TechniquePopup (selectable mode for recipe editor)
  MealPlanner.tsx                 — Collapsible meal planner banner
  RecipeScaler.tsx                — Full recipe view with scaling, author, nutrition, favorite button, comments
  Comments.tsx                    — Comment thread component
  CommunityPage.tsx               — Community client component
  FavoriteButton.tsx              — Heart icon toggle (card + detail variants)
  ProfileTabs.tsx                 — Added/Saved tab switcher for cook profile

lib/
  techniques.ts                   — All ~80 techniques with steps + video links
  videoTips.ts                    — Rouxbe + CIA video tip index
  supabase-browser.ts             — Browser Supabase client (createClient)

scripts/
  backfill-nutrition.mjs          — One-time nutrition backfill for pre-existing recipes (npm run backfill:nutrition)

supabase/
  migrations/0001_nutrition_and_favorites.sql — Nutrition columns + favorites table + tightened recipes insert policy (already applied)
```

---

## Supabase Tables (key columns)

### `recipes`
`id`, `title`, `description`, `ingredients` (text[]), `steps` (text[]), `tags` (text[]), `technique_ids` (text[]), `photo_url`, `source_url`, `spotify_url`, `prep_time`, `cook_time`, `servings`, `difficulty`, `visibility` (public/private), `is_featured`, `user_id`, `user_email`, `created_at`, `calories` (int, per serving), `fat_g` (numeric, per serving), `sodium_mg` (numeric, per serving), `sugar_g` (numeric, per serving)

- **Insert policy tightened:** the old MVP-era "Allow public inserts for MVP" policy (let the `anon` role insert with no check) was dropped and replaced with an authenticated-only policy requiring `auth.uid() = user_id`. The app never relied on anon inserts, so this only closes a gap that let someone bypass the app via the API directly.

### `profiles`
`id` (= auth user id), `display_name`, `profile_photo_url`, `is_public`, `bio`, `created_at`, plus in active use: `instagram_username`, `tiktok_username`, `youtube_handle`, `website_url`, `banner_photo_url`

### `comments`
`id`, `recipe_id`, `user_id`, `author_name` (snapshot at post time), `content`, `created_at`

### `favorites`
`id`, `user_id`, `recipe_id` (unique pair), `created_at` — RLS: anyone can read (needed for the Saved tab / future favorite counts), only the owning user can insert or delete their own rows.

---

## Pending / Known Issues

- **Comment author names** — stored as a snapshot at post time. If a user changes their `display_name`, old comments still show the old name. Fix: change comments GET to JOIN `profiles` and return current `display_name` instead of stored snapshot.
- **PROJECT.md** — this file. Update after each session.
- **Full `next build`** — `tsc --noEmit` passes clean with zero errors (verified this session, after fixing the meal-planner type error). A real `next build` still hasn't been completed end-to-end in a normal dev environment — run `npm run build` locally before deploying, just as a final sanity check beyond type-checking.
- **Paywall** — not designed or built yet. Deliberately deferred until after beta feedback; AI Meal Planner is the intended gate (see Next Phase #4).

---

## Next Phase (not yet started)

1. **Point domain at hosting** — miseenplacerecipes.com is purchased. Still need to:
   - Point the domain at hosting (Vercel recommended)
   - Update Supabase Auth → URL Configuration (allowed URLs) to include the new domain
   - No `.env.local` changes needed (Supabase URL stays the same)

2. **Social media accounts** — Set up for promotion once domain is live

3. **App Store preparation** — Two options:
   - **PWA (Progressive Web App):** Add service worker + web manifest → users can install from browser on iOS/Android. Fastest path, no App Store.
   - **Capacitor wrapper:** Wrap the Next.js web app in a native shell → submit to Apple App Store + Google Play. Not a rebuild — just a wrapper. Recommended when ready for stores.

4. **Monetization** — AI Meal Planner gated to paid members. Rouxbe affiliate link ready to activate.

5. **Sources still to add to videoTips.ts:**
   - Jacques Pépin Foundation (jp.foundation) — only Knife Skills category catalogued so far
   - Le Creuset Cooking School (lecreuset.ca/cooking-techniques)
   - Ricardo Cuisine (ricardocuisine.com) — lowest priority

6. **Next feature batch (agreed on, not started):**
   - **Search/filter** on the recipe gallery — by tag, technique, difficulty. Getting more important as the recipe count grows (35+ already).
   - **Shopping list generator** — add one or more recipes to a consolidated ingredient list (merge duplicates). Builds on existing scaling/ingredients logic.
   - **"I made this"** — a mark distinct from favoriting, to track recipes actually cooked (vs. just saved). Possible future "cooking streak" feature.
   - **Star ratings** — separate from comments, to help surface the best recipes.
