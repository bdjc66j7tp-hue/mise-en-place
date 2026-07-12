'use client'
import { useState } from 'react'
import Link from 'next/link'
import PhotoUpload from '@/app/recipes/[id]/PhotoUpload'
import { scaleIngredients } from '@/lib/scale'
import { convertToMetric, convertTempToMetric } from '@/lib/units'
import TechniqueGallery from '@/components/TechniqueGallery'
import Comments from '@/components/Comments'
import FavoriteButton from '@/components/FavoriteButton'

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
  technique_ids: string[] | null
  user_id?: string
  calories: number | null
  fat_g: number | null
  sodium_mg: number | null
  sugar_g: number | null
}

type AuthorProfile = {
  display_name: string | null
  profile_photo_url: string | null
} | null

type Props = {
  recipe: Recipe
  isOwner: boolean
  spotifyEmbedUrl: string | null
  userId: string | null
  authorProfile: AuthorProfile
  initialFavorited: boolean
}

export default function RecipeScaler({ recipe, isOwner, spotifyEmbedUrl, userId, authorProfile, initialFavorited }: Props) {
  const originalServings = recipe.servings ?? 0
  const [servings, setServings] = useState(originalServings)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(originalServings || ''))
  const [metric, setMetric] = useState(false)

  const factor = originalServings > 0 ? servings / originalServings : 1
  const ingredients = recipe.ingredients ?? []
  const scaled = scaleIngredients(ingredients, factor)
  const displayIngredients = metric ? scaled.map(convertToMetric) : scaled
  const displaySteps = metric
    ? (recipe.steps ?? []).map(convertTempToMetric)
    : (recipe.steps ?? [])

  const isScaled = servings !== originalServings && originalServings > 0
  const canScale = originalServings > 0
  const techniqueIds = recipe.technique_ids ?? []

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

  // Small US/Metric toggle pill
  function UnitToggle() {
    return (
      <div style={{ display: 'flex', background: '#F3EDE4', borderRadius: '8px', padding: '2px', gap: '2px' }}>
        <button
          onClick={() => setMetric(false)}
          style={{
            padding: '4px 10px', fontSize: '11px', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontWeight: metric ? 400 : 600, fontFamily: 'inherit',
            background: metric ? 'transparent' : '#5C6B47',
            color: metric ? '#5C6B47' : '#F3EDE4',
            transition: 'background 0.15s',
          }}
        >
          US
        </button>
        <button
          onClick={() => setMetric(true)}
          style={{
            padding: '4px 10px', fontSize: '11px', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontWeight: metric ? 600 : 400, fontFamily: 'inherit',
            background: metric ? '#5C6B47' : 'transparent',
            color: metric ? '#F3EDE4' : '#5C6B47',
            transition: 'background 0.15s',
          }}
        >
          Metric
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4' }}>
      <div style={{ background: '#21201D', padding: '24px 24px 32px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <PhotoUpload recipeId={recipe.id} photoUrl={recipe.photo_url} recipeTitle={recipe.title} isOwner={isOwner} />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px', marginTop: '20px' }}>
            {recipe.tags?.map((tag, i) => (
              <span key={i} style={{ background: '#5C6B47', color: '#F3EDE4', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', border: '0.5px solid #4A5639' }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '32px', color: '#F3EDE4', fontWeight: 400, lineHeight: 1.2, margin: 0, flex: 1 }}>{recipe.title}</h1>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <FavoriteButton recipeId={recipe.id} initialFavorited={initialFavorited} userId={userId} variant="detail" />
              {isOwner && (
                <Link href={`/recipes/${recipe.id}/edit`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#5C6B47', color: '#F3EDE4', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, border: '0.5px solid #4A5639' }}>Edit</div>
                </Link>
              )}
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#DCE0D2', lineHeight: 1.7, marginBottom: '12px' }}>{recipe.description}</p>

          {/* Author byline */}
          {authorProfile?.display_name && (
            <div style={{ marginBottom: '20px' }}>
              <Link
                href={`/cook/${recipe.user_id}`}
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {authorProfile.profile_photo_url ? (
                  <img
                    src={authorProfile.profile_photo_url}
                    alt={authorProfile.display_name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #6E7D5A' }}
                  />
                ) : (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', background: '#5C6B47',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: '#F3EDE4', fontWeight: 600, flexShrink: 0,
                  }}>
                    {authorProfile.display_name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '12px', color: '#DCE0D2' }}>
                  by <span style={{ color: '#F3EDE4', fontWeight: 500 }}>{authorProfile.display_name}</span>
                </span>
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: '#4A5639', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #6E7D5A' }}>
              <div style={{ fontSize: '9px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Prep</div>
              <div style={{ fontSize: '14px', color: '#F3EDE4', fontWeight: 500 }}>{recipe.prep_time}</div>
            </div>
            <div style={{ background: '#4A5639', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #6E7D5A' }}>
              <div style={{ fontSize: '9px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Cook</div>
              <div style={{ fontSize: '14px', color: '#F3EDE4', fontWeight: 500 }}>{recipe.cook_time}</div>
            </div>
            <div style={{ background: '#4A5639', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #6E7D5A', minWidth: '88px' }}>
              <div style={{ fontSize: '9px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Serves</div>
              {!canScale ? (
                <div style={{ fontSize: '14px', color: '#F3EDE4', fontWeight: 500 }}>—</div>
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
                  style={{ width: '50px', fontSize: '14px', color: '#F3EDE4', fontWeight: 500, background: 'transparent', border: 'none', borderBottom: '1px solid #C99A3D', outline: 'none', padding: 0, fontFamily: 'inherit' }}
                />
              ) : (
                <button
                  onClick={() => { setDraft(String(servings)); setEditing(true) }}
                  title="Click to change servings"
                  style={{ fontSize: '14px', color: '#F3EDE4', fontWeight: 500, background: 'transparent', border: 'none', borderBottom: '1px dashed #C99A3D', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {servings}
                </button>
              )}
            </div>
            <div style={{ background: '#4A5639', borderRadius: '10px', padding: '10px 16px', border: '0.5px solid #6E7D5A' }}>
              <div style={{ fontSize: '9px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Difficulty</div>
              <div style={{ fontSize: '14px', color: '#F3EDE4', fontWeight: 500 }}>{recipe.difficulty}</div>
            </div>
          </div>
          {isScaled && (
            <div style={{ marginTop: '12px', fontSize: '11px', color: '#DCE0D2', fontStyle: 'italic' }}>
              Scaled from {originalServings} to {servings} servings ·{' '}
              <button onClick={reset} style={{ background: 'none', border: 'none', color: '#C99A3D', textDecoration: 'underline', cursor: 'pointer', fontSize: '11px', fontStyle: 'italic', padding: 0 }}>Reset</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
        {spotifyEmbedUrl && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#7A7468', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, marginBottom: '8px' }}>
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

        {/* Ingredients */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #E4DACB', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#21201D', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Ingredients</h2>
            <UnitToggle />
          </div>
          {displayIngredients.map((ingredient, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '0.5px solid #E4DACB' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#5C6B47', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: '#21201D' }}>{ingredient}</span>
            </div>
          ))}
          {metric && (
            <div style={{ marginTop: '12px', fontSize: '11px', color: '#7A7468', fontStyle: 'italic' }}>
              Showing metric measurements · temperatures in steps converted to °C
            </div>
          )}
        </div>

        {/* Method */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #E4DACB', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#21201D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Method</h2>
          {displaySteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#5C6B47', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#F3EDE4', fontWeight: 500, flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
              <p style={{ fontSize: '14px', color: '#21201D', lineHeight: 1.7, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        {(recipe.calories != null || recipe.fat_g != null || recipe.sodium_mg != null || recipe.sugar_g != null) && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #E4DACB', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#21201D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Nutrition</h2>
            <p style={{ fontSize: '11px', color: '#7A7468', marginTop: 0, marginBottom: '16px' }}>Estimated per serving</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '9px', color: '#7A7468', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Calories</div>
                <div style={{ fontSize: '16px', color: '#21201D', fontWeight: 500 }}>{recipe.calories != null ? Math.round(recipe.calories) : '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#7A7468', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Fat</div>
                <div style={{ fontSize: '16px', color: '#21201D', fontWeight: 500 }}>{recipe.fat_g != null ? `${recipe.fat_g}g` : '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#7A7468', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Sodium</div>
                <div style={{ fontSize: '16px', color: '#21201D', fontWeight: 500 }}>{recipe.sodium_mg != null ? `${recipe.sodium_mg}mg` : '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#7A7468', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Sugar</div>
                <div style={{ fontSize: '16px', color: '#21201D', fontWeight: 500 }}>{recipe.sugar_g != null ? `${recipe.sugar_g}g` : '—'}</div>
              </div>
            </div>
          </div>
        )}

        {techniqueIds.length > 0 && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #E4DACB', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#21201D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Techniques used</h2>
            <p style={{ fontSize: '12px', color: '#7A7468', marginTop: 0, marginBottom: '16px' }}>Tap a technique to see what it means.</p>
            <TechniqueGallery selectable={false} filterIds={techniqueIds} />
          </div>
        )}

        {recipe.notes && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #E4DACB', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#21201D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Notes</h2>
            <p style={{ fontSize: '14px', color: '#21201D', lineHeight: 1.7, margin: 0 }}>{recipe.notes}</p>
          </div>
        )}

        {recipe.source_url && (
          <div style={{ background: '#F3EDE4', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11L11 1M7.5 1H11v3.5" stroke="#5C6B47" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#5C6B47', textDecoration: 'none' }}>
              View original recipe — {new URL(recipe.source_url).hostname.replace('www.', '')}
            </a>
          </div>
        )}

        <Comments recipeId={recipe.id} userId={userId} />
      </div>
    </div>
  )
}
