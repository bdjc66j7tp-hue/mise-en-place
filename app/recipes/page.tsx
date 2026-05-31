import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#EAF3DE' }}>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontStyle: 'italic', color: '#27500A', fontWeight: '400', marginBottom: '8px' }}>
          Community recipes
        </h1>
        <p style={{ fontSize: '14px', color: '#639922', marginBottom: '32px' }}>
          {recipes?.length ?? 0} recipe{recipes?.length === 1 ? '' : 's'} from cooks everywhere
        </p>

        {error && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #C0DD97', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#639922' }}>Couldn&apos;t load recipes: {error.message}</div>
          </div>
        )}

        {recipes && recipes.length === 0 && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '40px 24px', border: '0.5px solid #C0DD97', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontStyle: 'italic', color: '#3B6D11', marginBottom: '8px' }}>
              No recipes yet
            </div>
            <div style={{ fontSize: '13px', color: '#639922', marginBottom: '20px' }}>
              Be the first to share a recipe with the community.
            </div>
            <Link href="/import" style={{ display: 'inline-block', background: '#3B6D11', color: '#EAF3DE', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none' }}>
              Import a recipe
            </Link>
          </div>
        )}

        {recipes && recipes.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {recipes.map((recipe: Recipe) => {
              const hasUserPhoto = recipe.photo_url && recipe.photo_url.includes('supabase')
              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '0.5px solid #C0DD97', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', height: '160px', background: '#3B6D11', position: 'relative', overflow: 'hidden' }}>
                      {hasUserPhoto ? (
                        <img
                          src={recipe.photo_url!}
                          alt={recipe.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg viewBox="0 0 24 24" fill="none" width="36" height="36">
                            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#97C459" strokeWidth="1.5"/>
                            <circle cx="8" cy="10" r="2" stroke="#97C459" strokeWidth="1.5"/>
                            <path d="M3 16l5-4 4 3 3-4 6 5" stroke="#97C459" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {recipe.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} style={{ background: '#EAF3DE', color: '#3B6D11', fontSize: '9px', padding: '2px 8px', borderRadius: '20px' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontStyle: 'italic', color: '#27500A', fontWeight: '400', marginBottom: '6px', lineHeight: '1.3' }}>
                        {recipe.title}
                      </h2>
                      {recipe.description && (
                        <p style={{ fontSize: '12px', color: '#639922', lineHeight: '1.5', marginBottom: '12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {recipe.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#97C459', marginTop: 'auto' }}>
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