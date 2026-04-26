import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import FirecrawlApp from '@mendable/firecrawl-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const { text, url, user_email } = await request.json()

    if (!text && !url) {
      return NextResponse.json({ error: 'Please provide a URL or recipe text' }, { status: 400 })
    }

    let recipeText = text
    const source_url = url || null

    if (url) {
      try {
        console.log('Firecrawl fetching:', url)
        const scraped = await firecrawl.scrapeUrl(url)
        const pageContent = scraped?.data?.content || scraped?.data?.markdown || null
        console.log('Page content found:', pageContent ? 'YES' : 'NO')

        if (pageContent) {
          recipeText = pageContent
        } else {
          return NextResponse.json({ error: 'Could not read that URL. Try pasting the recipe text instead.' }, { status: 400 })
        }
      } catch (err) {
        console.error('Firecrawl error:', err)
        return NextResponse.json({ error: 'Could not fetch that URL. Try pasting the recipe text instead.' }, { status: 400 })
      }
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: 'Extract this recipe and return JSON only with these fields: title, description, prep_time, cook_time, servings (number), difficulty, ingredients (array), steps (array), tags (array). Recipe: ' + recipeText
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
        source_url: source_url,
        user_email: user_email || null,
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
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    return NextResponse.json({ error: 'Failed to import recipe. Please try again.' }, { status: 500 })
  }
}