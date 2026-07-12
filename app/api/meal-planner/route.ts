import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type MealSuggestion = {
  source:           'recipe' | 'ai'
  // Saved recipe fields
  recipe_id?:       string
  photo_url?:       string | null
  // Shared fields
  title:            string
  description:      string
  key_ingredients:  string[]
  estimated_time:   string | null
  tags:             string[]
  // Match score (for sorting; not sent to client in final shape but useful internally)
  _score?:          number
}

// ── Ingredient matching ──────────────────────────────────────
// Returns how many of the user's ingredients appear in the recipe
function scoreRecipe(
  recipeTitle: string,
  recipeIngredients: string[],
  recipeTags: string[],
  userIngredients: string[],
  dietaryPrefs: string[],
): number {
  let score = 0
  const titleLower = recipeTitle.toLowerCase()

  for (const userIng of userIngredients) {
    const term = userIng.toLowerCase().trim()
    if (!term) continue

    // +3 if the term appears in the recipe title (strongest signal)
    if (titleLower.includes(term)) {
      score += 3
      continue
    }

    // +2 if found in any ingredient string
    const foundInIngredients = recipeIngredients.some(ri => ri.toLowerCase().includes(term))
    if (foundInIngredients) score += 2

    // +1 if found in tags
    const foundInTags = recipeTags.some(t => t.toLowerCase().includes(term))
    if (foundInTags) score += 1
  }

  // +1 per dietary pref matched by a tag (loose match)
  for (const pref of dietaryPrefs) {
    const term = pref.toLowerCase()
    if (recipeTags.some(t => t.toLowerCase().includes(term))) score += 1
  }

  return score
}

// ── Claude prompt ────────────────────────────────────────────
function buildClaudePrompt(
  userIngredients: string[],
  dietaryPrefs:    string[],
  count:           number,
  alreadySuggested: string[],
): string {
  const ingList  = userIngredients.filter(Boolean).join(', ')
  const dietList = dietaryPrefs.length > 0 ? dietaryPrefs.join(', ') : 'none specified'
  const exclude  = alreadySuggested.length > 0
    ? `Do NOT suggest any of these (already matched from saved recipes): ${alreadySuggested.join(', ')}.`
    : ''

  return `You are a creative home-cooking assistant. Suggest exactly ${count} meal ideas based on the user's available ingredients and dietary preferences.

Available ingredients: ${ingList}
Dietary preferences: ${dietList}
${exclude}

Rules:
- Use primarily the listed ingredients; it's fine to assume basic pantry staples (salt, pepper, oil, garlic, onion) are available.
- Each suggestion must fit ALL stated dietary preferences.
- Vary the suggestions (don't give 3 versions of the same dish).
- Estimated time should be realistic for a home cook.

Return ONLY a valid JSON object in this exact shape — no markdown, no explanation:
{
  "suggestions": [
    {
      "title": "Recipe title",
      "description": "2–3 sentence description of the dish and why these ingredients work well together.",
      "key_ingredients": ["ingredient1", "ingredient2", "ingredient3"],
      "estimated_time": "25 minutes",
      "tags": ["tag1", "tag2"]
    }
  ]
}`
}

// ── Route ────────────────────────────────────────────────────
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
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const rawIngredients: string = body.ingredients ?? ''
    const dietaryPrefs:  string[] = body.dietaryPrefs ?? []

    // Parse comma/newline-separated ingredients
    const userIngredients = rawIngredients
      .split(/[\n,]+/)
      .map((s: string) => s.trim())
      .filter(Boolean)

    if (userIngredients.length === 0) {
      return NextResponse.json({ error: 'Please enter at least one ingredient.' }, { status: 400 })
    }

    // ── 1. Fetch candidate recipes ───────────────────────────
    // Include: public recipes + user's own private recipes (if logged in)
    let recipeQuery = supabase
      .from('recipes')
      .select('id, title, description, photo_url, ingredients, tags, prep_time, cook_time')

    if (user) {
      // Public OR owned by this user
      recipeQuery = recipeQuery.or(`visibility.eq.public,user_id.eq.${user.id}`)
    } else {
      recipeQuery = recipeQuery.eq('visibility', 'public')
    }

    const { data: allRecipes } = await recipeQuery

    // ── 2. Score + rank ALL saved recipe matches ────────────
    const scored = (allRecipes ?? [])
      .map(r => ({
        ...r,
        _score: scoreRecipe(r.title ?? '', r.ingredients ?? [], r.tags ?? [], userIngredients, dietaryPrefs),
      }))
      .filter(r => r._score > 0)
      .sort((a, b) => b._score - a._score)

    const savedCards: MealSuggestion[] = scored.map(r => {
      const prepMins  = parseInt(r.prep_time  ?? '0', 10) || 0
      const cookMins  = parseInt(r.cook_time  ?? '0', 10) || 0
      const totalMins = prepMins + cookMins
      const timeStr   = totalMins > 0 ? `${totalMins} minutes` : null

      const keyIngs = userIngredients
        .filter(ui => (r.ingredients ?? []).some((ri: string) => ri.toLowerCase().includes(ui.toLowerCase())))
        .slice(0, 4)

      return {
        source:          'recipe',
        recipe_id:       r.id,
        photo_url:       r.photo_url,
        title:           r.title,
        description:     r.description ?? '',
        key_ingredients: keyIngs.length > 0 ? keyIngs : (r.ingredients ?? []).slice(0, 4).map((i: string) => i.split(' ').slice(-1)[0]),
        estimated_time:  timeStr,
        tags:            r.tags ?? [],
      }
    })

    // ── 3. Claude always generates exactly 6 suggestions ────
    // Independent of saved matches — always a full 2×3 grid
    const claudePrompt = buildClaudePrompt(userIngredients, dietaryPrefs, 6, [])

    const message = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1600,
      messages:   [{ role: 'user', content: claudePrompt }],
    })

    let aiCards: MealSuggestion[] = []
    const rawText = (message.content[0] as { type: string; text: string }).text?.trim() ?? ''

    try {
      const jsonStart = rawText.indexOf('{')
      const jsonEnd   = rawText.lastIndexOf('}')
      const json      = rawText.slice(jsonStart, jsonEnd + 1)
      const parsed    = JSON.parse(json)

      aiCards = (parsed.suggestions ?? []).map((s: {
        title: string
        description: string
        key_ingredients: string[]
        estimated_time: string
        tags: string[]
      }) => ({
        source:          'ai' as const,
        title:           s.title,
        description:     s.description,
        key_ingredients: s.key_ingredients ?? [],
        estimated_time:  s.estimated_time ?? null,
        tags:            s.tags ?? [],
      }))
    } catch {
      console.error('Claude meal planner parse error:', rawText)
    }

    // Return the two sections separately so the UI can render them independently
    return NextResponse.json({ savedMatches: savedCards, aiSuggestions: aiCards })
  } catch (err) {
    console.error('Meal planner error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
