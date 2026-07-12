-- Migration: nutrition fields on recipes + favorites (heart/save) table
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Not applied automatically — this repo has no Supabase CLI/migration runner wired up.

-- ── 0. Tighten the MVP-era "anyone can insert" policy on recipes ───────────
-- The app has always required auth before inserting (see import-recipe/route.ts),
-- so this only closes a gap where the DB itself allowed anonymous inserts via
-- the API directly, bypassing the app. Safe to drop — nothing in the app relies
-- on anon inserts.
drop policy if exists "Allow public inserts for MVP" on public.recipes;

create policy "Authenticated users can insert their own recipes"
  on public.recipes for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ── 1. Nutrition columns on recipes (per serving) ──────────────────────────
alter table public.recipes
  add column if not exists calories   integer,
  add column if not exists fat_g      numeric,
  add column if not exists sodium_mg  numeric,
  add column if not exists sugar_g    numeric;

comment on column public.recipes.calories  is 'Estimated calories per serving';
comment on column public.recipes.fat_g     is 'Estimated fat in grams per serving';
comment on column public.recipes.sodium_mg is 'Estimated sodium in milligrams per serving';
comment on column public.recipes.sugar_g   is 'Estimated sugar in grams per serving';

-- ── 2. Favorites table ──────────────────────────────────────────────────────
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  recipe_id  uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists favorites_recipe_id_idx on public.favorites(recipe_id);

alter table public.favorites enable row level security;

-- Anyone can see counts / whether a recipe is favorited by a given user
-- (needed so a recipe's "favorited by X people" or another viewer's
-- saved-tab can be read). Adjust if you want favorites fully private.
drop policy if exists "Favorites are viewable by everyone" on public.favorites;
create policy "Favorites are viewable by everyone"
  on public.favorites for select
  using (true);

drop policy if exists "Users can favorite recipes" on public.favorites;
create policy "Users can favorite recipes"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can unfavorite their own" on public.favorites;
create policy "Users can unfavorite their own"
  on public.favorites for delete
  using (auth.uid() = user_id);
