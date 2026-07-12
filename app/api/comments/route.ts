import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function makeSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
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
        },
      },
    }
  )
}

// ── GET /api/comments?recipeId=xxx ───────────────────────────
export async function GET(request: NextRequest) {
  const recipeId = request.nextUrl.searchParams.get('recipeId')
  if (!recipeId) {
    return NextResponse.json({ error: 'Missing recipeId' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data, error } = await supabase
    .from('comments')
    .select('id, author_name, content, created_at')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

// ── POST /api/comments ───────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = makeSupabase(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to comment' }, { status: 401 })
    }

    const body = await request.json()
    const { recipeId, content } = body

    if (!recipeId || typeof recipeId !== 'string') {
      return NextResponse.json({ error: 'Missing recipeId' }, { status: 400 })
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })
    }
    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Comment must be 2000 characters or fewer' }, { status: 400 })
    }

    // Resolve the author name: prefer profiles.display_name, fall back to email prefix
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    const authorName =
      profile?.display_name?.trim() ||
      user.email?.split('@')[0] ||
      'Member'

    const { data: inserted, error: insertError } = await supabase
      .from('comments')
      .insert({
        recipe_id:   recipeId,
        user_id:     user.id,
        author_name: authorName,
        content:     content.trim(),
      })
      .select('id, author_name, content, created_at')
      .single()

    if (insertError) {
      console.error('Comment insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 })
    }

    return NextResponse.json(inserted, { status: 201 })
  } catch (err) {
    console.error('Unexpected comments error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
