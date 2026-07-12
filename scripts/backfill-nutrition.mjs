#!/usr/bin/env node
// scripts/backfill-nutrition.mjs
//
// One-time backfill: estimates per-serving nutrition (calories, fat, sodium,
// sugar) for recipes that predate the nutrition feature and so have no data
// yet. Uses the same Claude-based estimation approach as new imports.
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (Supabase Dashboard →
// Project Settings → API → service_role key). The anon key can't update rows
// across every user's recipes — this needs to backfill everyone's, bypassing
// RLS the same way an admin task would. Never expose this key client-side or
// commit it — keep it in .env.local only (already gitignored).
//
// Run:  node scripts/backfill-nutrition.mjs

import { readFileSync, existsSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// ── Load .env.local manually — this runs standalone, outside Next.js ───────
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim()
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Missing SUPABASE_SERVICE_ROLE_KEY.\n' +
    'Add it to .env.local — Supabase Dashboard → Project Settings → API → ' +
    '"service_role" key (secret, not the anon/public one) — then re-run.'
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const NUTRITION_PROMPT =
  "Given this recipe's ingredients and serving count, estimate PER-SERVING " +
  'nutrition. Return JSON only, no markdown fences, with these numeric ' +
  'fields: calories (whole number), fat_g (grams, one decimal place), ' +
  'sodium_mg (milligrams, whole number), sugar_g (grams, one decimal ' +
  'place). These are estimates based on standard nutrition knowledge, not ' +
  'lab measurements. If a value truly cannot be estimated, use null for it.'

function toNum(v) {
  const num = typeof v === 'number' ? v : parseFloat(String(v))
  return Number.isFinite(num) ? num : null
}

async function estimateNutrition(recipe) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content:
        `${NUTRITION_PROMPT}\n\nServings: ${recipe.servings}\nIngredients:\n` +
        (recipe.ingredients ?? []).map((i) => `- ${i}`).join('\n'),
    }],
  })
  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  const cleaned = content.text.replace(/```json/g, '').replace(/```/g, '').trim()
  const parsed = JSON.parse(cleaned)
  return {
    calories:  toNum(parsed.calories),
    fat_g:     toNum(parsed.fat_g),
    sodium_mg: toNum(parsed.sodium_mg),
    sugar_g:   toNum(parsed.sugar_g),
  }
}

async function main() {
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, servings, ingredients')
    .is('calories', null)

  if (error) {
    console.error('Failed to fetch recipes:', error.message)
    process.exit(1)
  }

  if (!recipes || recipes.length === 0) {
    console.log('Nothing to backfill — every recipe already has nutrition data.')
    return
  }

  console.log(`Found ${recipes.length} recipe(s) missing nutrition data.\n`)

  let succeeded = 0
  let skipped = 0
  let failed = 0

  for (const [i, recipe] of recipes.entries()) {
    const label = `[${i + 1}/${recipes.length}] "${recipe.title}"`

    if (!recipe.ingredients || recipe.ingredients.length === 0 || !recipe.servings) {
      console.log(`${label} — skipped (missing ingredients or servings)`)
      skipped++
      continue
    }

    try {
      const nutrition = await estimateNutrition(recipe)
      const { error: updateError } = await supabase
        .from('recipes')
        .update(nutrition)
        .eq('id', recipe.id)

      if (updateError) throw updateError

      console.log(`${label} — done (${nutrition.calories ?? '?'} cal)`)
      succeeded++
    } catch (err) {
      console.error(`${label} — failed: ${err.message}`)
      failed++
    }

    // Small pause between calls to stay well clear of rate limits
    await new Promise((r) => setTimeout(r, 400))
  }

  console.log(`\nDone. ${succeeded} updated, ${skipped} skipped, ${failed} failed.`)
}

main()
