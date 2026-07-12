import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import MealPlanner from '@/components/MealPlanner'
import FavoriteButton from '@/components/FavoriteButton'

interface Recipe {
  id: string
  title: string
  description: string
  prep_time: string
  cook_time: string
  servings: number
  difficulty: string
  tags: string[]
  photo_url: string | null
  source_url: string | null
  created_at: string
}

export const dynamic = 'force-dynamic'

export default async function RecipesPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from a Server Component during a normal page render —
            // only Server Actions/Route Handlers can write cookies. Safe to
            // ignore here since this route doesn't rely on writing a refreshed
            // session cookie back; reads still work fine either way.
          }
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })

  // Bulk-fetch which of these recipes the current user has already favorited
  let favoritedIds = new Set<string>()
  if (user && recipes && recipes.length > 0) {
    const { data: favorites } = await supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', user.id)
      .in('recipe_id', recipes.map((r) => r.id))
    favoritedIds = new Set((favorites ?? []).map((f) => f.recipe_id))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4' }}>

      <MealPlanner />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '32px', color: '#21201D', fontWeight: '400', marginBottom: '8px' }}>
          Community recipes
        </h1>
        <p style={{ fontSize: '14px', color: '#7A7468', marginBottom: '32px' }}>
          {recipes?.length ?? 0} recipe{recipes?.length === 1 ? '' : 's'} from cooks everywhere
        </p>

        {error && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #E4DACB', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#7A7468' }}>Couldn&apos;t load recipes: {error.message}</div>
          </div>
        )}

        {recipes && recipes.length === 0 && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '40px 24px', border: '0.5px solid #E4DACB', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', color: '#21201D', marginBottom: '8px' }}>
              No recipes yet
            </div>
            <div style={{ fontSize: '13px', color: '#7A7468', marginBottom: '20px' }}>
              Be the first to share a recipe with the community.
            </div>
            <Link href="/import" style={{ display: 'inline-block', background: '#5C6B47', color: '#F3EDE4', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none' }}>
              Import a recipe
            </Link>
          </div>
        )}

        {recipes && recipes.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {recipes.map((recipe: Recipe) => {
              const hasPhoto = !!recipe.photo_url
              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '0.5px solid #E4DACB', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <FavoriteButton
                      recipeId={recipe.id}
                      initialFavorited={favoritedIds.has(recipe.id)}
                      userId={user?.id ?? null}
                      variant="card"
                    />
                    <div style={{ width: '100%', height: '160px', background: '#5C6B47', position: 'relative', overflow: 'hidden' }}>
                      {hasPhoto ? (
                        <img
                          src={recipe.photo_url!}
                          alt={recipe.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg viewBox="0 0 24 24" fill="none" width="36" height="36">
                            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#F3EDE4" strokeWidth="1.5"/>
                            <circle cx="8" cy="10" r="2" stroke="#F3EDE4" strokeWidth="1.5"/>
                            <path d="M3 16l5-4 4 3 3-4 6 5" stroke="#F3EDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {recipe.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} style={{ background: '#F3EDE4', color: '#5C6B47', fontSize: '9px', padding: '2px 8px', borderRadius: '20px' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', color: '#21201D', fontWeight: '400', marginBottom: '6px', lineHeight: '1.3' }}>
                        {recipe.title}
                      </h2>
                      {recipe.description && (
                        <p style={{ fontSize: '12px', color: '#5A564D', lineHeight: '1.5', marginBottom: '12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {recipe.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#7A7468', marginTop: 'auto' }}>
                        {recipe.prep_time && <span>Prep {recipe.prep_time}</span>}
                        {recipe.cook_time && <span>Cook {recipe.cook_time}</span>}
                        {recipe.servings && <span>Serves {recipe.servings}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}