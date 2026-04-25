import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function RecipesPage() {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#EAF3DE' }}>
      
      {/* Header */}
      <div style={{ background: '#27500A', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: '#3B6D11', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
              <path d="M2 14C2 9 4 5 9 3.5C14 5 16 9 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5.5 14C5.5 11 6.8 9 9 8C11.2 9 12.5 11 12.5 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="14" x2="16" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="11" r="1.3" fill="white"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontStyle: 'italic', color: '#C0DD97' }}>
            Mise en Place
          </div>
          <div style={{ fontSize: '11px', color: '#639922', marginLeft: '4px' }}>· My Recipes</div>
        </div>
        <a href="/import" style={{ background: '#3B6D11', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}>
          + Import recipe
        </a>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Page title */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#3B6D11', fontWeight: '400', marginBottom: '4px' }}>
            My Recipe Collection
          </h1>
          <p style={{ fontSize: '13px', color: '#639922' }}>
            {recipes?.length || 0} recipes saved
          </p>
        </div>

        {/* Empty state */}
        {(!recipes || recipes.length === 0) && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '0.5px solid #C0DD97' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontStyle: 'italic', color: '#3B6D11', marginBottom: '8px' }}>
              No recipes yet
            </div>
            <p style={{ fontSize: '13px', color: '#639922', marginBottom: '20px' }}>
              Import your first recipe to get started
            </p>
            <a href="/import" style={{ background: '#3B6D11', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', textDecoration: 'none' }}>
              Import a recipe
            </a>
          </div>
        )}

        {/* Recipe grid */}
        {recipes && recipes.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {recipes.map((recipe) => (
              <div key={recipe.id} style={{ background: 'white', borderRadius: '14px', border: '0.5px solid #C0DD97', overflow: 'hidden', cursor: 'pointer' }}>
                
                {/* Card header */}
                <div style={{ background: '#27500A', padding: '16px 18px' }}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {recipe.tags?.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} style={{ background: '#3B6D11', color: '#C0DD97', fontSize: '9px', padding: '2px 8px', borderRadius: '20px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontStyle: 'italic', color: 'white', fontWeight: '400', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                    {recipe.title}
                  </h2>
                  <p style={{ fontSize: '11px', color: '#97C459', lineHeight: '1.5', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {recipe.description}
                  </p>
                </div>

                {/* Card body */}
                <div style={{ padding: '12px 18px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    {[
                      { label: 'Prep', value: recipe.prep_time },
                      { label: 'Cook', value: recipe.cook_time },
                      { label: 'Serves', value: recipe.servings },
                    ].map((stat, i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center', background: '#EAF3DE', borderRadius: '8px', padding: '6px 4px' }}>
                        <div style={{ fontSize: '8px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{stat.label}</div>
                        <div style={{ fontSize: '11px', color: '#27500A', fontWeight: '500' }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '10px', color: '#639922' }}>
                      {recipe.difficulty}
                    </span>
                    <span style={{ fontSize: '10px', color: '#97C459' }}>
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}