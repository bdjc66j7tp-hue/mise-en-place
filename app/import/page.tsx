'use client'

import { useState } from 'react'

interface Recipe {
  title: string
  description: string
  prep_time: string
  cook_time: string
  servings: number
  difficulty: string
  ingredients: string[]
  steps: string[]
  tags: string[]
}

export default function ImportPage() {
  const [mode, setMode] = useState<'url' | 'text'>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState('')

  async function handleImport(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRecipe(null)

    try {
      const response = await fetch('/api/import-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'url' ? { url } : { text })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setRecipe(data.recipe)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EAF3DE' }}>

      {/* Header */}
      <div style={{ background: '#27500A', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', background: '#3B6D11', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <path d="M2 14C2 9 4 5 9 3.5C14 5 16 9 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5.5 14C5.5 11 6.8 9 9 8C11.2 9 12.5 11 12.5 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="16" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="11" r="1.3" fill="white"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontStyle: 'italic', color: '#C0DD97' }}>
          Mise en Place · Import a recipe
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Import form */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '0.5px solid #C0DD97', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontStyle: 'italic', color: '#3B6D11', fontWeight: '400', marginBottom: '6px' }}>
            Import a recipe
          </h1>
          <p style={{ fontSize: '13px', color: '#639922', marginBottom: '20px', lineHeight: '1.6' }}>
            Paste a URL from any recipe website, or paste the recipe text directly.
          </p>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: '#EAF3DE', borderRadius: '10px', padding: '3px', marginBottom: '16px' }}>
            <button
              onClick={() => setMode('url')}
              style={{
                flex: 1, padding: '8px', fontSize: '13px', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontWeight: mode === 'url' ? '500' : '400',
                background: mode === 'url' ? '#3B6D11' : 'transparent',
                color: mode === 'url' ? 'white' : '#639922'
              }}
            >
              Paste a URL
            </button>
            <button
              onClick={() => setMode('text')}
              style={{
                flex: 1, padding: '8px', fontSize: '13px', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontWeight: mode === 'text' ? '500' : '400',
                background: mode === 'text' ? '#3B6D11' : 'transparent',
                color: mode === 'text' ? 'white' : '#639922'
              }}
            >
              Paste recipe text
            </button>
          </div>

          <form onSubmit={handleImport}>
            {mode === 'url' ? (
              <input
                type="url"
                required
                placeholder="https://www.example.com/recipe..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px',
                  borderRadius: '10px', border: '0.5px solid #C0DD97',
                  fontSize: '14px', outline: 'none', color: '#27500A',
                  background: '#EAF3DE', marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <textarea
                required
                placeholder="Paste your recipe text here — ingredients, instructions, anything. Claude will do the rest..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                style={{
                  width: '100%', padding: '12px 16px',
                  borderRadius: '10px', border: '0.5px solid #C0DD97',
                  fontSize: '13px', outline: 'none', color: '#27500A',
                  background: '#EAF3DE', resize: 'vertical',
                  fontFamily: 'sans-serif', lineHeight: '1.6',
                  marginBottom: '12px', boxSizing: 'border-box'
                }}
              />
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#639922' : '#3B6D11',
                color: 'white', border: 'none', borderRadius: '10px',
                padding: '12px 24px', fontSize: '14px', fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer', width: '100%'
              }}
            >
              {loading ? 'Claude is importing your recipe...' : 'Import recipe'}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FADBD8', borderRadius: '8px', fontSize: '13px', color: '#C0392B' }}>
              {error}
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', border: '0.5px solid #C0DD97', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontStyle: 'italic', color: '#3B6D11', marginBottom: '8px' }}>
              {mode === 'url' ? 'Fetching and formatting your recipe...' : 'Formatting your recipe...'}
            </div>
            <div style={{ fontSize: '13px', color: '#639922' }}>
              This takes about 10-15 seconds.
            </div>
          </div>
        )}

        {/* Recipe card */}
        {recipe && (
          <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #C0DD97', overflow: 'hidden' }}>
            <div style={{ background: '#27500A', padding: '24px 28px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {recipe.tags.map((tag, i) => (
                  <span key={i} style={{ background: '#3B6D11', color: '#C0DD97', fontSize: '10px', padding: '3px 10px', borderRadius: '20px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontStyle: 'italic', color: 'white', fontWeight: '400', marginBottom: '8px' }}>
                {recipe.title}
              </h2>
              <p style={{ fontSize: '13px', color: '#97C459', lineHeight: '1.6', marginBottom: '16px' }}>
                {recipe.description}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Prep', value: recipe.prep_time },
                  { label: 'Cook', value: recipe.cook_time },
                  { label: 'Serves', value: String(recipe.servings) },
                  { label: 'Difficulty', value: recipe.difficulty },
                ].map((stat, i) => (
                  <div key={i} style={{ background: '#3B6D11', borderRadius: '8px', padding: '8px 14px' }}>
                    <div style={{ fontSize: '9px', color: '#639922', textTransform: 'uppercase', marginBottom: '2px' }}>{stat.label}</div>
                    <div style={{ fontSize: '13px', color: '#EAF3DE', fontWeight: '500' }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '500', color: '#27500A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Ingredients
              </h3>
              <div style={{ marginBottom: '24px' }}>
                {recipe.ingredients.map((ingredient, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '0.5px solid #EAF3DE' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B6D11', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#27500A' }}>{ingredient}</span>
                  </div>
                ))}
              </div>
              <h3 style={{ fontSize: '13px', fontWeight: '500', color: '#27500A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Method
              </h3>
              <div>
                {recipe.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#3B6D11', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', fontWeight: '500', flexShrink: 0, marginTop: '1px' }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: '13px', color: '#27500A', lineHeight: '1.7', margin: 0 }}>{step}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="/recipes" style={{ background: '#3B6D11', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
                  View my recipes →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}