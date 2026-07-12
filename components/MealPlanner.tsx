'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { MealSuggestion } from '@/app/api/meal-planner/route'

const DIETARY_OPTIONS = [
  'Vegan', 'Vegetarian', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Low-carb',
]

type State = 'idle' | 'loading' | 'results' | 'error'

// ── Suggestion card ──────────────────────────────────────────

function SuggestionCard({ s }: { s: MealSuggestion }) {
  const isRecipe = s.source === 'recipe'
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError]     = useState('')

  async function generateAndSave() {
    setGenerating(true)
    setGenError('')

    // Build a rich text description Claude can expand into a full recipe
    const text = [
      `Recipe: ${s.title}`,
      '',
      s.description,
      '',
      `Key ingredients: ${s.key_ingredients.join(', ')}`,
      s.estimated_time ? `Estimated time: ${s.estimated_time}` : '',
      s.tags.length ? `Tags: ${s.tags.join(', ')}` : '',
      '',
      'Please write a complete recipe with a full ingredients list (with quantities) and detailed step-by-step instructions.',
    ].filter(Boolean).join('\n')

    try {
      const res = await fetch('/api/import-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await res.json()

      if (!res.ok) {
        setGenError(data.error ?? 'Could not generate recipe. Are you signed in?')
        setGenerating(false)
        return
      }

      // Navigate to the new recipe
      if (data.recipe?.id) {
        // Fetch an Unsplash photo in the background, then navigate
        // (non-blocking — recipe page will just show without a photo if this fails)
        try {
          await fetch(
            `/api/unsplash-photo?q=${encodeURIComponent(s.title)}&recipeId=${data.recipe.id}`
          )
        } catch { /* best effort */ }
        router.push(`/recipes/${data.recipe.id}`)
      } else {
        setGenError('Recipe saved but could not find its page.')
        setGenerating(false)
      }
    } catch {
      setGenError('Network error — please try again.')
      setGenerating(false)
    }
  }

  return (
    <div style={{
      background: 'white', borderRadius: '14px',
      border: '0.5px solid #E4DACB', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Photo (saved recipes only) */}
      {isRecipe && (
        <div style={{ width: '100%', height: '130px', background: '#5C6B47', overflow: 'hidden', flexShrink: 0 }}>
          {s.photo_url ? (
            <img src={s.photo_url} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
                <path d="M3 19C3 13 6 8 12 6C18 8 21 13 21 19" stroke="#F3EDE4" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 19C7 15 8.8 12 12 11C15.2 12 17 15 17 19" stroke="#F3EDE4" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Badge */}
        <span style={{
          alignSelf: 'flex-start', fontSize: '9px', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.07em',
          padding: '3px 8px', borderRadius: '20px',
          background: isRecipe ? '#F3EDE4' : '#F5E6C8',
          color: isRecipe ? '#5C6B47' : '#8B6F3E',
          border: `0.5px solid ${isRecipe ? '#E4DACB' : '#E8D5A8'}`,
        }}>
          {isRecipe ? '✓ In your recipes' : '✦ Mise en Place Creations'}
        </span>

        {/* Title */}
        <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '17px', color: '#21201D', lineHeight: 1.25, fontWeight: 400 }}>
          {s.title}
        </div>

        {/* Description */}
        <p style={{ fontSize: '12px', color: '#5A564D', lineHeight: 1.6, margin: 0, flex: 1 }}>
          {s.description}
        </p>

        {/* Key ingredients */}
        {s.key_ingredients.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {s.key_ingredients.slice(0, 5).map(ing => (
              <span key={ing} style={{
                background: '#F3EDE4', color: '#5C6B47', fontSize: '10px',
                padding: '2px 8px', borderRadius: '20px', border: '0.5px solid #E4DACB',
              }}>
                {ing}
              </span>
            ))}
          </div>
        )}

        {/* Footer: time + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', gap: '8px' }}>
          {s.estimated_time && (
            <span style={{ fontSize: '11px', color: '#7A7468' }}>⏱ {s.estimated_time}</span>
          )}
          {isRecipe && s.recipe_id ? (
            <Link href={`/recipes/${s.recipe_id}`} style={{
              background: '#5C6B47', color: '#F3EDE4', fontSize: '11px', fontWeight: 500,
              padding: '6px 12px', borderRadius: '7px', textDecoration: 'none', flexShrink: 0, marginLeft: 'auto',
            }}>
              View recipe →
            </Link>
          ) : (
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <button
                onClick={generateAndSave}
                disabled={generating}
                style={{
                  background: generating ? '#E8D5A8' : '#F5E6C8',
                  color: '#8B6F3E', fontSize: '11px', fontWeight: 500,
                  padding: '6px 12px', borderRadius: '7px', flexShrink: 0,
                  border: '0.5px solid #E8D5A8', cursor: generating ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {generating ? 'Generating…' : 'Generate full recipe →'}
              </button>
              {genError && (
                <span style={{ fontSize: '10px', color: '#c0392b' }}>{genError}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

const SAVED_PER_PAGE = 6

export default function MealPlanner() {
  const [open, setOpen]               = useState(true)
  const [ingredients, setIngredients] = useState('')
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([])
  const [state, setState]             = useState<State>('idle')
  const [savedMatches, setSavedMatches]   = useState<MealSuggestion[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<MealSuggestion[]>([])
  const [savedPage, setSavedPage]     = useState(0)
  const [errorMsg, setErrorMsg]       = useState('')

  function togglePref(pref: string) {
    setDietaryPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ingredients.trim()) return
    setState('loading')
    setSavedMatches([])
    setAiSuggestions([])
    setSavedPage(0)
    setErrorMsg('')

    try {
      const res = await fetch('/api/meal-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, dietaryPrefs }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.')
        setState('error')
        return
      }
      setSavedMatches(data.savedMatches ?? [])
      setAiSuggestions(data.aiSuggestions ?? [])
      setState('results')
    } catch {
      setErrorMsg('Network error — please try again.')
      setState('error')
    }
  }

  function reset() {
    setState('idle')
    setSavedMatches([])
    setAiSuggestions([])
    setSavedPage(0)
    setErrorMsg('')
  }

  // Pagination for saved matches
  const totalSavedPages  = Math.ceil(savedMatches.length / SAVED_PER_PAGE)
  const pagedSaved       = savedMatches.slice(savedPage * SAVED_PER_PAGE, (savedPage + 1) * SAVED_PER_PAGE)

  return (
    <div style={{ background: '#5C6B47', borderBottom: '1px solid #4A5639' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Collapsed toggle bar ── */}
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 0', color: '#F3EDE4', fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Fridge / chef icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F3EDE4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
              <line x1="4" y1="10" x2="20" y2="10"/>
              <line x1="9" y1="6" x2="9" y2="8"/>
              <line x1="9" y1="14" x2="9" y2="18"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>AI Meal Planner</span>
            <span style={{ fontSize: '12px', color: '#DCE0D2' }}>— tell me what&apos;s in your pantry</span>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            stroke="#DCE0D2" strokeWidth="1.5" strokeLinecap="round"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <polyline points="3 6 8 11 13 6"/>
          </svg>
        </button>

        {/* ── Expanded panel ── */}
        {open && (
          <div style={{ paddingBottom: '28px' }}>

            {state === 'idle' || state === 'error' ? (
              <form onSubmit={handleSubmit}>
                {/* Ingredients */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Ingredients on hand
                  </label>
                  <textarea
                    value={ingredients}
                    onChange={e => setIngredients(e.target.value)}
                    placeholder="chicken thighs, garlic, spinach, lemon, feta…"
                    rows={2}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: '#4A5639', border: '0.5px solid #6E7D5A',
                      borderRadius: '10px', padding: '10px 14px',
                      fontSize: '14px', color: '#F3EDE4', fontFamily: 'inherit',
                      resize: 'none', outline: 'none', lineHeight: 1.5,
                    }}
                    onFocus={e => { e.target.style.borderColor = '#C99A3D' }}
                    onBlur={e => { e.target.style.borderColor = '#6E7D5A' }}
                  />
                </div>

                {/* Dietary prefs */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Dietary preferences
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {DIETARY_OPTIONS.map(pref => {
                      const active = dietaryPrefs.includes(pref)
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => togglePref(pref)}
                          style={{
                            padding: '5px 13px', borderRadius: '20px', fontSize: '12px',
                            cursor: 'pointer', fontFamily: 'inherit', fontWeight: active ? 600 : 400,
                            background: active ? '#C99A3D' : 'transparent',
                            color: active ? '#21201D' : '#DCE0D2',
                            border: `0.5px solid ${active ? '#C99A3D' : '#6E7D5A'}`,
                            transition: 'all 0.15s',
                          }}
                        >
                          {pref}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <p style={{ fontSize: '13px', color: '#F4A261', marginBottom: '12px' }}>{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={!ingredients.trim()}
                  style={{
                    background: ingredients.trim() ? '#C99A3D' : '#4A5639',
                    color: ingredients.trim() ? '#21201D' : '#8B9478',
                    border: 'none', borderRadius: '9px',
                    padding: '10px 24px', fontSize: '13px', fontWeight: 600,
                    fontFamily: 'inherit', cursor: ingredients.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                  }}
                >
                  Find meals →
                </button>
              </form>
            ) : state === 'loading' ? (
              <div style={{ padding: '24px 0', color: '#DCE0D2', fontSize: '14px', fontStyle: 'italic' }}>
                Checking your recipes and thinking up ideas…
              </div>
            ) : (
              /* Results */
              <div>

                {/* Saved recipe matches — paginated, can be uneven */}
                {savedMatches.length > 0 && (
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        From your recipes
                        {savedMatches.length > SAVED_PER_PAGE && (
                          <span style={{ color: '#C99A3D', marginLeft: '8px' }}>
                            · {savedMatches.length} matches
                          </span>
                        )}
                      </div>
                      {/* Pagination arrows */}
                      {totalSavedPages > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setSavedPage(p => Math.max(0, p - 1))}
                            disabled={savedPage === 0}
                            style={{
                              background: 'none', border: '0.5px solid #6E7D5A',
                              color: savedPage === 0 ? '#6E7D5A' : '#F3EDE4',
                              borderRadius: '6px', padding: '4px 10px',
                              fontSize: '13px', cursor: savedPage === 0 ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >←</button>
                          <span style={{ fontSize: '11px', color: '#DCE0D2' }}>
                            {savedPage + 1} / {totalSavedPages}
                          </span>
                          <button
                            onClick={() => setSavedPage(p => Math.min(totalSavedPages - 1, p + 1))}
                            disabled={savedPage === totalSavedPages - 1}
                            style={{
                              background: 'none', border: '0.5px solid #6E7D5A',
                              color: savedPage === totalSavedPages - 1 ? '#6E7D5A' : '#F3EDE4',
                              borderRadius: '6px', padding: '4px 10px',
                              fontSize: '13px', cursor: savedPage === totalSavedPages - 1 ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >→</button>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {pagedSaved.map((s, i) => <SuggestionCard key={i} s={s} />)}
                    </div>
                  </div>
                )}

                {/* Claude always renders exactly 6 — always a clean 2×3 grid */}
                {aiSuggestions.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                      Mise en Place Creations
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {aiSuggestions.map((s, i) => <SuggestionCard key={i} s={s} />)}
                    </div>
                  </div>
                )}

                <button
                  onClick={reset}
                  style={{
                    background: 'none', border: '0.5px solid #6E7D5A',
                    color: '#DCE0D2', borderRadius: '8px',
                    padding: '8px 16px', fontSize: '12px', fontFamily: 'inherit',
                    cursor: 'pointer', marginTop: '8px',
                  }}
                >
                  ← Search again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
