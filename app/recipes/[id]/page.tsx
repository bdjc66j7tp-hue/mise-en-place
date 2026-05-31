import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import RecipeScaler from '@/components/RecipeScaler'

export const dynamic = 'force-dynamic'

// Turns any Spotify URL into an embed URL.
// Returns null if it doesn't look like a Spotify link.
function getSpotifyEmbedUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('spotify.com')) return null
    const path = parsed.pathname.replace(/^\/embed/, '')
    return `https://open.spotify.com/embed${path}`
  } catch {
    return null
  }
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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

  const { data: recipe } = await supabase.from('recipes').select('*').eq('id', id).single()

  if (!recipe) notFound()

  const isOwner = user?.id === recipe.user_id
  const spotifyEmbedUrl = getSpotifyEmbedUrl(recipe.spotify_url)

  return (
    <RecipeScaler
      recipe={recipe}
      isOwner={isOwner}
      spotifyEmbedUrl={spotifyEmbedUrl}
    />
  )
}