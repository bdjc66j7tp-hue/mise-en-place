// app/api/import-recipe/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import FirecrawlApp from '@mendable/firecrawl-js'
import { TECHNIQUES } from '@/lib/techniques'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })

// ── Technique auto-matching ──────────────────────────────────
// Scans recipe steps + ingredients for technique name/id keywords.
// Returns an array of matched technique IDs (up to 8 — a generous cap).
function matchTechniqueIds(
  steps: unknown,
  ingredients: unknown,
): string[] {
  const text = [
    ...(Array.isArray(steps) ? steps : []),
    ...(Array.isArray(ingredients) ? ingredients : []),
  ]
    .join(' ')
    .toLowerCase()

  if (!text.trim()) return []

  const matched: string[] = []

  for (const t of TECHNIQUES) {
    // Match against the technique name (first significant word is enough for broad coverage)
    // or the id itself (e.g. "brunoise", "saute", "braise")
    const nameWords = t.name.toLowerCase().replace(/[()\/éàèùâêîôûäëïöü]/g, (c) => {
      const map: Record<string, string> = { é:'e', à:'a', è:'e', ù:'u', â:'a', ê:'e', î:'i', ô:'o', û:'u', ä:'a', ë:'e', ï:'i', ö:'o', ü:'u' }
      return map[c] ?? c
    })
    const idWord = t.id.replace(/_/g, ' ')

    // Check if the text contains the full technique name, or a meaningful keyword
    const keywords = [nameWords, idWord, t.id]
    const hits = keywords.some((kw) => {
      // Use whole-word-ish matching: the keyword should appear as a standalone word or phrase
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`\\b${escaped}\\b`).test(text)
    })

    if (hits) matched.push(t.id)
    if (matched.length >= 8) break
  }

  return matched
}

// ── Nutrition parsing ────────────────────────────────────────────────────
// Claude returns a `nutrition` object alongside the recipe fields. Pull out
// the four values we store as columns, coercing to numbers and falling back
// to null for anything missing/malformed so a bad estimate never breaks the save.
function extractNutrition(recipe: Record<string, unknown>) {
  const n = recipe.nutrition as Record<string, unknown> | null | undefined
  if (!n || typeof n !== 'object') {
    return { calories: null, fat_g: null, sodium_mg: null, sugar_g: null }
  }
  const toNum = (v: unknown): number | null => {
    const num = typeof v === 'number' ? v : parseFloat(String(v))
    return Number.isFinite(num) ? num : null
  }
  return {
    calories:  toNum(n.calories),
    fat_g:     toNum(n.fat_g),
    sodium_mg: toNum(n.sodium_mg),
    sugar_g:   toNum(n.sugar_g),
  }
}

const RECIPE_JSON_PROMPT =
  'Extract this recipe and return JSON only with these fields: ' +
  'title, description, prep_time, cook_time, servings (number), difficulty, ' +
  'ingredients (array of strings), steps (array of strings), tags (array of strings), ' +
  'photo_url (first full URL to a photo of the finished dish if visible, otherwise null), ' +
  'nutrition (object with your best estimate of PER-SERVING values based on the ingredients ' +
  'and servings count, with these numeric fields: calories (whole number), fat_g (grams, one ' +
  'decimal place), sodium_mg (milligrams, whole number), sugar_g (grams, one decimal place). ' +
  'These are estimates, not lab measurements — use standard nutrition knowledge for the ' +
  'ingredients and quantities given. If servings is missing or the recipe is too incomplete ' +
  'to estimate, set nutrition to null).'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          }
        }
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to import recipes' }, { status: 401 })
    }

    const body = await request.json()
    const { text, url, image, imageMediaType } = body

    if (!text && !url && !image) {
      return NextResponse.json({ error: 'Please provide a URL, recipe text, or photo' }, { status: 400 })
    }

    let recipe: Record<string, unknown>
    let photo_url: string | null = null
    const source_url = url || null

    // -------------------------------------------------------------------------
    // Mode 1: Image (camera / photo of recipe card)
    // Claude vision reads the image directly — no Firecrawl needed.
    // -------------------------------------------------------------------------
    if (image) {
      const mediaType = (imageMediaType || 'image/jpeg') as
        'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

      const message = await anthropic.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: image }
            },
            {
              type: 'text',
              text:
                'This is a photo of a recipe card or printed recipe. ' +
                RECIPE_JSON_PROMPT +
                ' Set photo_url to null (the image is the card itself, not a dish photo).'
            }
          ]
        }]
      })

      const content = message.content[0]
      if (content.type !== 'text') throw new Error('Unexpected response type')
      const cleaned = content.text.replace(/```json/g, '').replace(/```/g, '').trim()
      recipe = JSON.parse(cleaned)
      photo_url = null // card photos aren't dish photos
    }

    // -------------------------------------------------------------------------
    // Mode 2: URL — Firecrawl scrape + Claude text extraction
    // -------------------------------------------------------------------------
    else if (url) {
      let recipeText = ''
      try {
        const scraped = await firecrawl.scrapeUrl(url)
        const pageContent = scraped?.data?.content || scraped?.data?.markdown || null
        if (!pageContent) {
          return NextResponse.json(
            { error: 'Could not read that URL. Try pasting the recipe text instead.' },
            { status: 400 }
          )
        }
        recipeText = pageContent
        const meta = scraped?.data?.metadata || {}
        photo_url =
          (meta.ogImage as string | undefined) ||
          (meta['og:image'] as string | undefined) ||
          (meta.twitterImage as string | undefined) ||
          (meta.image as string | undefined) ||
          null
      } catch (err) {
        console.error('Firecrawl error:', err)
        return NextResponse.json(
          { error: 'Could not fetch that URL. Try pasting the recipe text instead.' },
          { status: 400 }
        )
      }

      const message = await anthropic.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: RECIPE_JSON_PROMPT + ' Recipe: ' + recipeText
        }]
      })

      const content = message.content[0]
      if (content.type !== 'text') throw new Error('Unexpected response type')
      const cleaned = content.text.replace(/```json/g, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(cleaned)

      // Prefer Firecrawl og:image over anything Claude found in the text
      const rawPhotoUrl = photo_url ||
        (typeof parsed.photo_url === 'string' && parsed.photo_url.startsWith('http')
          ? parsed.photo_url
          : null)
      photo_url = rawPhotoUrl ? rawPhotoUrl.replace(/^http:\/\//, 'https://') : null
      recipe = parsed
    }

    // -------------------------------------------------------------------------
    // Mode 3: Pasted text
    // -------------------------------------------------------------------------
    else {
      const message = await anthropic.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: RECIPE_JSON_PROMPT + ' Recipe: ' + text
        }]
      })

      const content = message.content[0]
      if (content.type !== 'text') throw new Error('Unexpected response type')
      const cleaned = content.text.replace(/```json/g, '').replace(/```/g, '').trim()
      recipe = JSON.parse(cleaned)
      photo_url = null
    }

    // -------------------------------------------------------------------------
    // Auto-match techniques from the recipe's steps + ingredients
    // -------------------------------------------------------------------------
    const technique_ids = matchTechniqueIds(recipe.steps, recipe.ingredients)
    const nutrition = extractNutrition(recipe)

    // -------------------------------------------------------------------------
    // Save to Supabase (same for all modes)
    // -------------------------------------------------------------------------
    const { data, error } = await supabase
      .from('recipes')
      .insert([{
        title:         recipe.title,
        description:   recipe.description,
        prep_time:     recipe.prep_time,
        cook_time:     recipe.cook_time,
        servings:      recipe.servings,
        difficulty:    recipe.difficulty,
        ingredients:   recipe.ingredients,
        steps:         recipe.steps,
        tags:          recipe.tags,
        technique_ids: technique_ids.length > 0 ? technique_ids : null,
        source_url,
        photo_url,
        user_id:       user.id,
        user_email:    user.email,
        calories:      nutrition.calories,
        fat_g:         nutrition.fat_g,
        sodium_mg:     nutrition.sodium_mg,
        sugar_g:       nutrition.sugar_g,
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', JSON.stringify(error))
      return NextResponse.json({ recipe, saved: false, error: error.message })
    }

    return NextResponse.json({ recipe: data, saved: true })

  } catch (error) {
    console.error('Recipe import error:', error)
    return NextResponse.json({ error: 'Failed to import recipe. Please try again.' }, { status: 500 })
  }
}
