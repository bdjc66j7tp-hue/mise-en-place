'use client'

import { useState } from 'react'
import Link from 'next/link'
import PhotoUpload from '@/app/recipes/[id]/PhotoUpload'
import { scaleIngredients } from '@/lib/scale'

type Recipe = {
  id: string
  title: string
  description: string | null
  prep_time: string | null
  cook_time: string | null
  servings: number | null
  difficulty: string | null
  ingredients: string[] | null
  steps: string[] | null
  tags: string[] | null
  notes: string | null
  source_url: string | null
  photo_url: string | null
  spotify_url: string | null
}

type Props = {
  recipe: Recipe
  isOwner: boolean
  spotifyEmbedUrl: string | null
}

export default function RecipeScaler({ recipe, isOwner, spotifyEmbedUrl }: Props) {
  const originalServings = recipe.servings ?? 0
  const [servings, setServings] = useState(originalServings)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(originalServings || ''))

  const factor = originalServings > 0 ? servings / originalServings : 1
  const ingredients = recipe.ingredients ?? []
  const scaled = scaleIngredients(ingredients, factor)
  const isScaled = servings !== originalServings && originalServings > 0
  const canScale = originalServings > 0

  function commitDraft() {
    const parsed = parseInt(draft, 10)
    if (!isNaN(parsed) && parsed > 0 && parsed <= 200) {
      setServings(parsed)
    } else {
      setDraft(String(servings))
    }
    setEditing(false)
  }

  function reset() {
    setServings(originalServings)
    setDraft(String(originalServings))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EAF3DE' }}>
      <div style={{ background: '#27500A', padding: '24px 24px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <PhotoUpload recipeId={recipe.id} photoUrl={recipe.photo_url} recipeTitle={recipe.title} isOwner={isOwner} />

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px', marginTop: '20px' }}>
            {recipe.tags?.map((tag, i) => (
              <span key={i} style={{ background: '#3B6D11', color: '#C0DD97', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', border: '0.5px solid #639922' }}>{tag}</span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontStyle: 'italic', color: 'white', fontWeight: 400, lineHeight: 1.2, margin: 0, flex: 1 }}>{recipe.title}</h1>
            {isOwner && (
              <Link href={`/recipes/${recipe.id}/edit`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <div style={{ background: '#3B6D11', color: '#C0DD97', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, border: '0.5px solid #639922' }}>Edit</div>
              </Link>
            )}
          </div>

          <p style={{ fontSize: '14px', color: '#97C459', lineHeight: 1.7, marginBottom: '20px' }}>{recipe.description}</p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: '#3B6D11', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #639922' }}>
              <div style={{ fontSize: '9px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Prep</div>
              <div style={{ fontSize: '14px', color: '#EAF3DE', fontWeight: 500 }}>{recipe.prep_time}</div>
            </div>
            <div style={{ background: '#3B6D11', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #639922' }}>
              <div style={{ fontSize: '9px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Cook</div>
              <div style={{ fontSize: '14px', color: '#EAF3DE', fontWeight: 500 }}>{recipe.cook_time}</div>
            </div>

            <div style={{ background: '#3B6D11', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #639922', minWidth: '88px' }}>
              <div style={{ fontSize: '9px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Serves</div>
              {!canScale ? (
                <div style={{ fontSize: '14px', color: '#EAF3DE', fontWeight: 500 }}>—</div>
              ) : editing ? (
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={draft}
                  autoFocus
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitDraft}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitDraft()
                    if (e.key === 'Escape') { setDraft(String(servings)); setEditing(false) }
                  }}
                  style={{ width: '50px', fontSize: '14px', color: 'white', fontWeight: 500, background: 'transparent', border: 'none', borderBottom: '1px solid #97C459', outline: 'none', padding: 0, fontFamily: 'inherit' }}
                />
              ) : (
                <button
                  onClick={() => { setDraft(String(servings)); setEditing(true) }}
                  title="Click to change servings"
                  style={{ fontSize: '14px', color: '#EAF3DE', fontWeight: 500, background: 'transparent', border: 'none', borderBottom: '1px dashed #97C459', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {servings}
                </button>
              )}
            </div>

            <div style={{ background: '#3B6D11', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #639922' }}>
              <div style={{ fontSize: '9px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Difficulty</div>
              <div style={{ fontSize: '14px', color: '#EAF3DE', fontWeight: 500 }}>{recipe.difficulty}</div>
            </div>
          </div>

          {isScaled && (
            <div style={{ marginTop: '12px', fontSize: '11px', color: '#97C459', fontStyle: 'italic' }}>
              Scaled from {originalServings} to {servings} servings ·{' '}
              <button onClick={reset} style={{ background: 'none', border: 'none', color: '#C0DD97', textDecoration: 'underline', cursor: 'pointer', fontSize: '11px', fontStyle: 'italic', padding: 0 }}>Reset</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
        {spotifyEmbedUrl && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, marginBottom: '8px' }}>
              Play while you cook
            </div>
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="152"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: '12px', display: 'block' }}
            />
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #C0DD97', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#27500A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Ingredients</h2>
          {scaled.map((ingredient, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid #EAF3DE' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3B6D11', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: '#27500A' }}>{ingredient}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #C0DD97', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#27500A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Method</h2>
          {recipe.steps?.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3B6D11', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 500, flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
              <p style={{ fontSize: '14px', color: '#27500A', lineHeight: 1.7, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        {recipe.notes && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #C0DD97', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#27500A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Notes</h2>
            <p style={{ fontSize: '14px', color: '#27500A', lineHeight: 1.7, margin: 0 }}>{recipe.notes}</p>
          </div>
        )}

        {recipe.source_url && (
          <div style={{ background: '#EAF3DE', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M7.5 1H11v3.5" stroke="#3B6D11" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#3B6D11', textDecoration: 'none' }}>
              View original recipe — {new URL(recipe.source_url).hostname.replace('www.', '')}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}