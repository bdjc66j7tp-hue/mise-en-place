// app/api/favorites/route.ts
// Toggle a recipe in/out of the current user's favorites ("hearted" recipes).
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
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
}

// POST { recipe_id } — favorite a recipe
export async function POST(request: NextRequest) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to save recipes' }, { status: 401 })
  }

  const { recipe_id } = await request.json()
  if (!recipe_id) {
    return NextResponse.json({ error: 'recipe_id is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('favorites')
    .insert([{ user_id: user.id, recipe_id }])

  // Ignore unique-violation (already favorited) — treat as success/no-op
  if (error && error.code !== '23505') {
    console.error('Favorite insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ favorited: true })
}

// DELETE ?recipe_id=xxx — unfavorite a recipe
export async function DELETE(request: NextRequest) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in' }, { status: 401 })
  }

  const recipe_id = request.nextUrl.searchParams.get('recipe_id')
  if (!recipe_id) {
    return NextResponse.json({ error: 'recipe_id is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('recipe_id', recipe_id)

  if (error) {
    console.error('Favorite delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ favorited: false })
}
