import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (!recipe) notFound()

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
        </div>
        <a href="/recipes" style={{ fontSize: '12px', color: '#97C459', textDecoration: 'none' }}>
          ← My recipes
        </a>
      </div>

      {/* Recipe header */}
      <div style={{ background: '#27500A', padding: '32px 24px 40px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {recipe.tags?.map((tag: string, i: number) => (
              <span key={i} style={{ background: '#3B6D11', color: '#C0DD97', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', border: '0.5px solid #639922' }}>
                {tag}
              </span>
            ))}
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontStyle: 'italic', color: 'white', fontWeight: '400', marginBottom: '8px', lineHeight: '1.2' }}>
            {recipe.title}
          </h1>
          <p style={{ fontSize: '14px', color: '#97C459', lineHeight: '1.7', marginBottom: '20px' }}>
            {recipe.description}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Prep', value: recipe.prep_time },
              { label: 'Cook', value: recipe.cook_time },
              { label: 'Serves', value: recipe.servings },
              { label: 'Difficulty', value: recipe.difficulty },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#3B6D11', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #639922' }}>
                <div style={{ fontSize: '9px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{stat.label}</div>
                <div style={{ fontSize: '14px', color: '#EAF3DE', fontWeight: '500' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe body */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Ingredients */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #C0DD97', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#27500A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Ingredients
          </h2>
          {recipe.ingredients?.map((ingredient: string, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid #EAF3DE' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3B6D11', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: '#27500A' }}>{ingredient}</span>
            </div>
          ))}
        </div>

        {/* Method */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #C0DD97', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#27500A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Method
          </h2>
          {recipe.steps?.map((step: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3B6D11', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: '500', flexShrink: 0, marginTop: '1px' }}>
                {i + 1}
              </div>
              <p style={{ fontSize: '14px', color: '#27500A', lineHeight: '1.7', margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        {recipe.notes && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #C0DD97', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#27500A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Notes
            </h2>
            <p style={{ fontSize: '14px', color: '#27500A', lineHeight: '1.7', margin: 0 }}>{recipe.notes}</p>
          </div>
        )}

        {/* Source */}
        {recipe.source_url && (
          <div style={{ background: '#EAF3DE', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M7.5 1H11v3.5" stroke="#3B6D11" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#3B6D11', textDecoration: 'none' }}>
              View original recipe
            </a>
          </div>
        )}
      </div>
    </div>
  )
}