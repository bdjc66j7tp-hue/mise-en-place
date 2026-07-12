// app/import/page.tsx
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

interface Recipe {
  id: string
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

type Mode = 'url' | 'text' | 'photo'

export default function ImportPage() {
  const [mode, setMode] = useState<Mode>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoSrc(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function clearPhoto() {
    setPhotoSrc(null)
    setPhotoFile(null)
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRecipe(null)

    try {
      let body: Record<string, unknown>

      if (mode === 'photo') {
        if (!photoFile || !photoSrc) {
          setError('Please select a photo first.')
          setLoading(false)
          return
        }
        // Strip the "data:image/jpeg;base64," prefix — API wants raw base64
        const base64 = photoSrc.split(',')[1]
        const mediaType = photoFile.type || 'image/jpeg'
        body = { image: base64, imageMediaType: mediaType }
      } else if (mode === 'url') {
        body = { url }
      } else {
        body = { text }
      }

      const response = await fetch('/api/import-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
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

  const tabs: { key: Mode; label: string }[] = [
    { key: 'url',   label: 'Paste a URL' },
    { key: 'text',  label: 'Paste recipe text' },
    { key: 'photo', label: 'Recipe card photo' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Import form */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '0.5px solid #E4DACB', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '24px', color: '#21201D', fontWeight: 400, marginBottom: '6px' }}>
            Import a recipe
          </h1>
          <p style={{ fontSize: '13px', color: '#7A7468', marginBottom: '20px', lineHeight: '1.6' }}>
            Paste a URL, paste the recipe text, or take a photo of a recipe card.
          </p>

          {/* Mode tabs */}
          <div style={{ display: 'flex', background: '#F3EDE4', borderRadius: '10px', padding: '3px', marginBottom: '20px', gap: '2px' }}>
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setMode(key); setError(''); setRecipe(null) }}
                style={{
                  flex: 1, padding: '8px 6px', fontSize: '12px', border: 'none',
                  borderRadius: '8px', cursor: 'pointer',
                  fontWeight: mode === key ? 500 : 400,
                  background: mode === key ? '#5C6B47' : 'transparent',
                  color: mode === key ? '#F3EDE4' : '#7A7468',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleImport}>

            {/* URL mode */}
            {mode === 'url' && (
              <input
                type="url"
                required
                placeholder="https://www.example.com/recipe..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '0.5px solid #E4DACB', fontSize: '14px', outline: 'none',
                  color: '#21201D', background: '#F3EDE4', marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              />
            )}

            {/* Text mode */}
            {mode === 'text' && (
              <textarea
                required
                placeholder="Paste your recipe text here — ingredients, instructions, anything. Claude will do the rest..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '0.5px solid #E4DACB', fontSize: '13px', outline: 'none',
                  color: '#21201D', background: '#F3EDE4', resize: 'vertical',
                  fontFamily: 'var(--font-montserrat), Arial, sans-serif', lineHeight: '1.6',
                  marginBottom: '12px', boxSizing: 'border-box'
                }}
              />
            )}

            {/* Photo mode */}
            {mode === 'photo' && (
              <div style={{ marginBottom: '12px' }}>
                {!photoSrc ? (
                  // Upload / camera prompt
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '1.5px dashed #D6C9AF', borderRadius: '12px',
                      background: '#F3EDE4', padding: '40px 24px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: '12px', cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {/* Camera icon */}
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#5C6B47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="#5C6B47" strokeWidth="1.5"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: '14px', color: '#21201D', fontWeight: 500, marginBottom: '4px' }}>
                        Take a photo or upload an image
                      </div>
                      <div style={{ fontSize: '12px', color: '#7A7468', lineHeight: 1.5 }}>
                        Point your camera at a recipe card, cookbook page, or handwritten recipe.
                        Claude will read it and fill in all the fields.
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#C99A3D', marginTop: '4px' }}>
                      Tap to open camera · or choose a photo from your library
                    </div>
                  </div>
                ) : (
                  // Preview selected photo
                  <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '0.5px solid #E4DACB' }}>
                    <img
                      src={photoSrc}
                      alt="Recipe card preview"
                      style={{ width: '100%', maxHeight: '340px', objectFit: 'contain', background: '#F3EDE4', display: 'block' }}
                    />
                    <button
                      type="button"
                      onClick={clearPhoto}
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'rgba(33,32,29,0.85)', border: 'none', borderRadius: '6px',
                        padding: '5px 10px', fontSize: '11px', color: '#F3EDE4',
                        cursor: 'pointer', fontFamily: 'inherit'
                      }}
                    >
                      Change photo
                    </button>
                  </div>
                )}

                {/* Hidden file input — accepts camera or library on mobile */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode === 'photo' && !photoSrc)}
              style={{
                background: loading ? '#8B9478' : '#5C6B47',
                color: '#F3EDE4', border: 'none', borderRadius: '10px',
                padding: '12px 24px', fontSize: '14px', fontWeight: 500,
                cursor: (loading || (mode === 'photo' && !photoSrc)) ? 'not-allowed' : 'pointer',
                width: '100%', fontFamily: 'inherit',
                opacity: (mode === 'photo' && !photoSrc && !loading) ? 0.5 : 1,
              }}
            >
              {loading
                ? mode === 'photo'
                  ? 'Claude is reading your recipe card...'
                  : 'Claude is importing your recipe...'
                : mode === 'photo'
                  ? 'Extract recipe from photo'
                  : 'Import recipe'}
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
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', border: '0.5px solid #E4DACB', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', color: '#21201D', marginBottom: '8px' }}>
              {mode === 'photo'
                ? 'Reading your recipe card...'
                : mode === 'url'
                  ? 'Fetching and formatting your recipe...'
                  : 'Formatting your recipe...'}
            </div>
            <div style={{ fontSize: '13px', color: '#7A7468' }}>
              This takes about 10–15 seconds.
            </div>
          </div>
        )}

        {/* Success — recipe saved */}
        {recipe && (
          <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #E4DACB', overflow: 'hidden' }}>
            <div style={{ background: '#21201D', padding: '24px 28px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {recipe.tags?.map((tag, i) => (
                  <span key={i} style={{ background: '#5C6B47', color: '#F3EDE4', fontSize: '10px', padding: '3px 10px', borderRadius: '20px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '26px', color: '#F3EDE4', fontWeight: 400, marginBottom: '8px' }}>
                {recipe.title}
              </h2>
              <p style={{ fontSize: '13px', color: '#DCE0D2', lineHeight: '1.6', marginBottom: '16px' }}>
                {recipe.description}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Prep',       value: recipe.prep_time },
                  { label: 'Cook',       value: recipe.cook_time },
                  { label: 'Serves',     value: String(recipe.servings) },
                  { label: 'Difficulty', value: recipe.difficulty },
                ].map((stat, i) => (
                  <div key={i} style={{ background: '#4A5639', borderRadius: '8px', padding: '8px 14px' }}>
                    <div style={{ fontSize: '9px', color: '#DCE0D2', textTransform: 'uppercase', marginBottom: '2px' }}>{stat.label}</div>
                    <div style={{ fontSize: '13px', color: '#F3EDE4', fontWeight: 500 }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ background: '#F3EDE4', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#21201D', fontWeight: 500 }}>Recipe saved!</div>
                  <div style={{ fontSize: '12px', color: '#7A7468', marginTop: '2px' }}>
                    {mode === 'photo' ? 'You can add a dish photo from the recipe page.' : 'Head to your recipes to view it.'}
                  </div>
                </div>
                <Link
                  href={`/recipes/${recipe.id}`}
                  style={{ background: '#5C6B47', color: '#F3EDE4', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap', fontWeight: 500 }}
                >
                  View recipe →
                </Link>
              </div>

              <h3 style={{ fontSize: '13px', fontWeight: 500, color: '#21201D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Ingredients
              </h3>
              <div style={{ marginBottom: '24px' }}>
                {recipe.ingredients?.map((ingredient, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '0.5px solid #E4DACB' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5C6B47', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#21201D' }}>{ingredient}</span>
                  </div>
                ))}
              </div>
              <h3 style={{ fontSize: '13px', fontWeight: 500, color: '#21201D', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Method
              </h3>
              <div>
                {recipe.steps?.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#5C6B47', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#F3EDE4', fontWeight: 500, flexShrink: 0, marginTop: '1px' }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: '13px', color: '#21201D', lineHeight: '1.7', margin: 0 }}>{step}</p>
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
