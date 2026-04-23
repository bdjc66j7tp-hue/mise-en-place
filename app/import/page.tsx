'use client'

import { useState } from 'react'

interface Recipe {
  title: string
  description: string
  prepTime: string
  cookTime: string
  servings: number
  difficulty: string
  ingredients: string[]
  steps: string[]
  tags: string[]
}

export default function ImportPage() {
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
        body: JSON.stringify({ text })
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
      <div style={{ background: '#27500A', padding: '16px 24px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontStyle: 'italic', color: '#C0DD97' }}>
          Mise en Place · Import a recipe
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '0.5px solid #C0DD97', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontStyle: 'italic', color: '#3B6D11', fontWeight: '400', marginBottom: '6px' }}>
            Import a recipe
          </h1>
          <p style={{ fontSize: '13px', color: '#639922', marginBottom: '20px', lineHeight: '1.6' }}>
            Paste any recipe text below. Claude will format it instantly.
          </p>
          <form onSubmit={handleImport}>
            <textarea
              required
              placeholder="Paste your recipe text here..."
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
              {loading ? 'Claude is formatting your recipe...' : 'Import recipe'}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FADBD8', borderRadius: '8px', fontSize: '13px', color: '#C0392B' }}>
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', border: '0.5px solid #C0DD97', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontStyle: 'italic', color: '#3B6D11', marginBottom: '8px' }}>
              Formatting your recipe...
            </div>
            <div style={{ fontSize: '13px', color: '#639922' }}>
              This takes about 10 seconds.
            </div>
          </div>
        )}

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
                  { label: 'Prep', value: recipe.prepTime },
                  { label: 'Cook', value: recipe.cookTime },
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
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#27500A', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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

              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#27500A', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}