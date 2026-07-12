import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export type MemberSearchResult = {
  id: string
  display_name: string
  bio: string | null
  profile_photo_url: string | null
  recipe_count: number
  top_tags: string[]
  sample_photos: string[]
}

// GET /api/community/search?q=plant-based
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

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

  // 1. Fetch all public recipes (tags + photo + user_id)
  //    We'll filter by tag match in JS so we can do case-insensitive partial matching.
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('user_id, tags, photo_url')
    .eq('visibility', 'public')

  if (error || !recipes) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }

  // 2. Case-insensitive partial match on any tag
  const term = q.toLowerCase()

  // Map: user_id → { matchingRecipeCount, allTags, samplePhotos }
  const userMap = new Map<string, { count: number; tags: string[]; photos: string[] }>()

  for (const recipe of recipes) {
    const tags: string[] = recipe.tags ?? []
    const matches = tags.some(t => t.toLowerCase().includes(term))
    if (!matches) continue

    if (!userMap.has(recipe.user_id)) {
      userMap.set(recipe.user_id, { count: 0, tags: [], photos: [] })
    }
    const entry = userMap.get(recipe.user_id)!
    entry.count += 1
    entry.tags.push(...tags)
    if (recipe.photo_url && entry.photos.length < 3) {
      entry.photos.push(recipe.photo_url)
    }
  }

  if (userMap.size === 0) return NextResponse.json([])

  // 3. Fetch public profiles for matched user_ids
  const userIds = Array.from(userMap.keys())
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, bio, profile_photo_url')
    .in('id', userIds)
    .eq('is_public', true)

  if (!profiles || profiles.length === 0) return NextResponse.json([])

  // 4. Also get total recipe counts for each matched member
  const { data: recipeCounts } = await supabase
    .from('recipes')
    .select('user_id')
    .in('user_id', userIds)
    .eq('visibility', 'public')

  const totalCountMap: Record<string, number> = {}
  for (const r of recipeCounts ?? []) {
    totalCountMap[r.user_id] = (totalCountMap[r.user_id] ?? 0) + 1
  }

  // 5. Build result cards
  const results: MemberSearchResult[] = profiles.map(p => {
    const entry = userMap.get(p.id)!

    // Frequency-rank all their tags
    const freq: Record<string, number> = {}
    for (const tag of entry.tags) {
      const key = tag.toLowerCase()
      freq[key] = (freq[key] ?? 0) + 1
    }
    const topTags = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t)

    return {
      id:               p.id,
      display_name:     p.display_name ?? 'Member',
      bio:              p.bio,
      profile_photo_url: p.profile_photo_url,
      recipe_count:     totalCountMap[p.id] ?? 0,
      top_tags:         topTags,
      sample_photos:    entry.photos,
    }
  })

  // Sort by number of matching recipes (most relevant first)
  results.sort((a, b) => (userMap.get(b.id)?.count ?? 0) - (userMap.get(a.id)?.count ?? 0))

  return NextResponse.json(results)
}
