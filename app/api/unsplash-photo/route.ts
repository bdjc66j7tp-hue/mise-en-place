import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/unsplash-photo?q=lemon+garlic+chicken&recipeId=xxx
export async function GET(request: NextRequest) {
  const q        = request.nextUrl.searchParams.get('q')?.trim()
  const recipeId = request.nextUrl.searchParams.get('recipeId')?.trim()

  if (!q || !recipeId) {
    return NextResponse.json({ error: 'Missing q or recipeId' }, { status: 400 })
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    return NextResponse.json({ error: 'Unsplash not configured' }, { status: 500 })
  }

  // Search Unsplash for a food photo matching the recipe title
  const searchUrl = new URL('https://api.unsplash.com/search/photos')
  searchUrl.searchParams.set('query', `${q} food dish`)
  searchUrl.searchParams.set('per_page', '3')
  searchUrl.searchParams.set('orientation', 'landscape')
  searchUrl.searchParams.set('content_filter', 'high')

  const unsplashRes = await fetch(searchUrl.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (!unsplashRes.ok) {
    return NextResponse.json({ error: 'Unsplash search failed' }, { status: 502 })
  }

  const unsplashData = await unsplashRes.json()
  const results: { urls: { regular: string }; links: { download_location: string } }[] =
    unsplashData.results ?? []

  if (results.length === 0) {
    return NextResponse.json({ photo_url: null })
  }

  const photo = results[0]
  const photoUrl = photo.urls.regular

  // Unsplash guidelines: trigger a download ping when a photo is used
  fetch(photo.links.download_location, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  }).catch(() => {/* non-blocking, best effort */})

  // Save the photo URL to the recipe
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

  await supabase
    .from('recipes')
    .update({ photo_url: photoUrl })
    .eq('id', recipeId)

  return NextResponse.json({ photo_url: photoUrl })
}
