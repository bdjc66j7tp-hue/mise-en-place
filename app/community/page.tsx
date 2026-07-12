import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import CommunityPage, { type RecentRecipe, type RecentComment, type NewMember } from '@/components/CommunityPage'

export const dynamic = 'force-dynamic'

export default async function Community() {
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

  // ── 1. New public members ──────────────────────────────────
  const { data: memberRows } = await supabase
    .from('profiles')
    .select('id, display_name, bio, profile_photo_url')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(8)

  const newMembers: NewMember[] = (memberRows ?? []).map(m => ({
    id:               m.id,
    display_name:     m.display_name ?? 'Member',
    bio:              m.bio,
    profile_photo_url: m.profile_photo_url,
  }))

  // ── 2. Recent public recipes from public members ───────────
  //    Fetch recipes, then separately fetch the author profiles
  const { data: recipeRows } = await supabase
    .from('recipes')
    .select('id, title, photo_url, tags, user_id, created_at')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(18) // fetch a few extra; we'll filter to public-profile authors below

  // Collect unique author IDs
  const authorIds = [...new Set((recipeRows ?? []).map(r => r.user_id))]

  // Fetch only public profiles for those authors
  const { data: authorRows } = authorIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, display_name, profile_photo_url, is_public')
        .in('id', authorIds)
    : { data: [] }

  const authorMap = new Map(
    (authorRows ?? []).map(p => [p.id, p])
  )

  const recentRecipes: RecentRecipe[] = (recipeRows ?? [])
    .filter(r => authorMap.get(r.user_id)?.is_public)
    .slice(0, 9)
    .map(r => {
      const author = authorMap.get(r.user_id)
      return {
        id:          r.id,
        title:       r.title,
        photo_url:   r.photo_url,
        tags:        r.tags,
        user_id:     r.user_id,
        created_at:  r.created_at,
        author_name: author?.display_name ?? null,
        author_photo: author?.profile_photo_url ?? null,
      }
    })

  // ── 3. Recent comments from public members ─────────────────
  //    Fetch recent comments, filter to public-profile authors
  const publicMemberIds = new Set((memberRows ?? []).map(m => m.id))

  // Fetch recent comments along with their recipe title
  const { data: commentRows } = await supabase
    .from('comments')
    .select('id, author_name, content, created_at, user_id, recipe_id')
    .order('created_at', { ascending: false })
    .limit(40) // fetch extra to allow filtering

  const publicComments = (commentRows ?? []).filter(c => publicMemberIds.has(c.user_id))

  // Fetch recipe titles for those comments
  const recipeIdsNeeded = [...new Set(publicComments.slice(0, 8).map(c => c.recipe_id))]
  const { data: commentRecipes } = recipeIdsNeeded.length > 0
    ? await supabase
        .from('recipes')
        .select('id, title')
        .in('id', recipeIdsNeeded)
    : { data: [] }

  const recipeTitleMap = new Map((commentRecipes ?? []).map(r => [r.id, r.title]))

  const recentComments: RecentComment[] = publicComments.slice(0, 8).map(c => ({
    id:           c.id,
    author_name:  c.author_name,
    content:      c.content,
    created_at:   c.created_at,
    recipe_id:    c.recipe_id,
    recipe_title: recipeTitleMap.get(c.recipe_id) ?? 'a recipe',
  }))

  return (
    <CommunityPage
      recentRecipes={recentRecipes}
      recentComments={recentComments}
      newMembers={newMembers}
    />
  )
}
