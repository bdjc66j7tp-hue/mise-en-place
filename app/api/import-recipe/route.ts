import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { text, source_url, user_email } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Recipe text is required' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a recipe extraction assistant. Extract and format the following recipe into a clean structured format.

Recipe:
${text}

Return as JSON only:
{
  "title": "Recipe name",
  "description": "Brief description",
  "prep_time": "e.g. 15 minutes",
  "cook_time": "e.g. 30 minutes",
  "servings": 4,
  "difficulty": "Easy/Medium/Hard",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["Step 1", "Step 2"],
  "tags": ["tag1", "tag2"]
}

Return ONLY the JSON, no other text.`
        }
      ]
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const cleaned = content.text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const recipe = JSON.parse(cleaned)

    // Save to Supabase
    const { data, error } = await supabase
      .from('recipes')
      .insert([{
        title: recipe.title,
        description: recipe.description,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        tags: recipe.tags,
        source_url: source_url || null,
        user_email: user_email || null,
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error full:', JSON.stringify(error, null, 2))
      // Still return the recipe even if save fails
      return NextResponse.json({ recipe, saved: false })
    }

    return NextResponse.json({ recipe: data, saved: true })

  } catch (error) {
    console.error('Recipe import error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    return NextResponse.json({ error: 'Failed to import recipe. Please try again.' }, { status: 500 })
  }
}