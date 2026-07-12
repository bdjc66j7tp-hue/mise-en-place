'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import TechniqueGallery from '@/components/TechniqueGallery'
import { suggestTechniqueIds } from '@/lib/techniques'

export default function EditRecipePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [error, setError] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')
  const [stepsText, setStepsText] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [notes, setNotes] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private' | 'draft'>('public')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [techniqueIds, setTechniqueIds] = useState<string[]>([])
  const [suggestedTechniqueIds, setSuggestedTechniqueIds] = useState<string[]>([])

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be signed in to edit recipes.')
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.is_admin ?? false)

      const { data: recipe } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (!recipe) {
        setError('Recipe not found.')
        setLoading(false)
        return
      }

      if (recipe.user_id !== user.id) {
        setError('You can only edit your own recipes.')
        setLoading(false)
        return
      }

      setTitle(recipe.title ?? '')
      setDescription(recipe.description ?? '')
      setPrepTime(recipe.prep_time ?? '')
      setCookTime(recipe.cook_time ?? '')
      setServings(recipe.servings ? String(recipe.servings) : '')
      setDifficulty(recipe.difficulty ?? '')
      setIngredientsText((recipe.ingredients ?? []).join('\n'))
      setStepsText((recipe.steps ?? []).join('\n'))
      setTagsText((recipe.tags ?? []).join(', '))
      setNotes(recipe.notes ?? '')
      setSourceUrl(recipe.source_url ?? '')
      setSpotifyUrl(recipe.spotify_url ?? '')
      setVisibility(recipe.visibility ?? 'public')
      setIsFeatured(recipe.is_featured ?? false)
      setTechniqueIds(recipe.technique_ids ?? [])

      const methodText = [
        recipe.title ?? '',
        ...(recipe.ingredients ?? []),
        ...(recipe.steps ?? []),
      ].join('\n')
      setSuggestedTechniqueIds(suggestTechniqueIds(methodText))

      setAuthorized(true)
      setLoading(false)
    }

    load()
  }, [id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()

    const updatePayload: Record<string, unknown> = {
      title: title.trim(),
      description: description.trim() || null,
      prep_time: prepTime.trim() || null,
      cook_time: cookTime.trim() || null,
      servings: servings.trim() ? parseInt(servings.trim(), 10) || null : null,
      difficulty: difficulty.trim() || null,
      ingredients: ingredientsText.split('\n').map((s) => s.trim()).filter(Boolean),
      steps: stepsText.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: tagsText.split(',').map((s) => s.trim()).filter(Boolean),
      notes: notes.trim() || null,
      source_url: sourceUrl.trim() || null,
      spotify_url: spotifyUrl.trim() || null,
      visibility,
      technique_ids: techniqueIds,
    }
    if (isAdmin) {
      updatePayload.is_featured = isFeatured
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update(updatePayload)
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push(`/recipes/${id}`)
    router.refresh()
  }

  async function handleDelete() {
    setDeleting(true)
    setError('')

    const supabase = createClient()

    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
      setConfirmingDelete(false)
      return
    }

    router.push('/recipes')
    router.refresh()
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F3EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '17px', color: '#21201D' }}>Loading...</div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#F3EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', border: '0.5px solid #E4DACB', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', color: '#21201D', marginBottom: '8px' }}>Not allowed</div>
          <div style={{ fontSize: '13px', color: '#7A7468' }}>{error}</div>
        </div>
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '10px 12px', fontSize: '14px', border: '0.5px solid #E4DACB', borderRadius: '8px', boxSizing: 'border-box' as const, fontFamily: 'inherit', color: '#21201D' }
  const labelStyle = { display: 'block', fontSize: '11px', color: '#21201D', textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontWeight: '500', marginBottom: '8px' }
  const cardStyle = { background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #E4DACB', marginBottom: '16px' }
  const radioRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer' }
  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4', padding: '40px 20px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', color: '#21201D', fontWeight: '400', marginBottom: '24px' }}>
          Edit recipe
        </h1>

        <form onSubmit={handleSave}>

          <div style={cardStyle}>
            <label style={labelStyle}>Visibility</label>

            <label style={{ ...radioRowStyle, background: visibility === 'public' ? '#F3EDE4' : 'transparent' }}>
              <input type="radio" name="visibility" checked={visibility === 'public'} onChange={() => setVisibility('public')} style={{ marginTop: '3px', accentColor: '#5C6B47' }} />
              <div>
                <div style={{ fontSize: '14px', color: '#21201D', fontWeight: '500' }}>Public</div>
                <div style={{ fontSize: '12px', color: '#7A7468', marginTop: '2px', lineHeight: '1.4' }}>Shows in the public gallery and on your profile.</div>
              </div>
            </label>

            <label style={{ ...radioRowStyle, background: visibility === 'private' ? '#F3EDE4' : 'transparent', marginTop: '4px' }}>
              <input type="radio" name="visibility" checked={visibility === 'private'} onChange={() => setVisibility('private')} style={{ marginTop: '3px', accentColor: '#5C6B47' }} />
              <div>
                <div style={{ fontSize: '14px', color: '#21201D', fontWeight: '500' }}>Private</div>
                <div style={{ fontSize: '12px', color: '#7A7468', marginTop: '2px', lineHeight: '1.4' }}>Only on your profile. Doesn&apos;t appear in the public gallery.</div>
              </div>
            </label>

            <label style={{ ...radioRowStyle, background: visibility === 'draft' ? '#F3EDE4' : 'transparent', marginTop: '4px' }}>
              <input type="radio" name="visibility" checked={visibility === 'draft'} onChange={() => setVisibility('draft')} style={{ marginTop: '3px', accentColor: '#5C6B47' }} />
              <div>
                <div style={{ fontSize: '14px', color: '#21201D', fontWeight: '500' }}>Draft</div>
                <div style={{ fontSize: '12px', color: '#7A7468', marginTop: '2px', lineHeight: '1.4' }}>Only you can see it. Perfect for grandma&apos;s recipe card or a work in progress.</div>
              </div>
            </label>
          </div>

          {isAdmin && (
            <div style={cardStyle}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: '#5C6B47', width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '14px', color: '#21201D', fontWeight: '500' }}>Feature on homepage <span style={{ fontSize: '10px', color: '#7A7468', fontWeight: '400', marginLeft: '6px' }}>Admin only</span></div>
                  <div style={{ fontSize: '12px', color: '#7A7468', marginTop: '2px', lineHeight: '1.4' }}>
                    Mark this recipe as showcase-worthy. Featured public recipes can be surfaced on the homepage.
                  </div>
                </div>
              </label>
            </div>
          )}

          <div style={cardStyle}>
            <label style={labelStyle}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} style={inputStyle} />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Prep time</label>
                <input type="text" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="20 min" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Cook time</label>
                <input type="text" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="40 min" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Serves</label>
                <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="4" min={1} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Difficulty</label>
                <input type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="Easy" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Ingredients</label>
            <p style={{ fontSize: '12px', color: '#7A7468', marginTop: 0, marginBottom: '10px' }}>One per line.</p>
            <textarea value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} rows={Math.max(6, ingredientsText.split('\n').length + 1)} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Steps</label>
            <p style={{ fontSize: '12px', color: '#7A7468', marginTop: 0, marginBottom: '10px' }}>One step per line. Add as many as you need.</p>
            <textarea value={stepsText} onChange={(e) => setStepsText(e.target.value)} rows={Math.max(6, stepsText.split('\n').length + 1)} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }} />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Tags</label>
            <p style={{ fontSize: '12px', color: '#7A7468', marginTop: 0, marginBottom: '10px' }}>Separate with commas.</p>
            <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="dinner, italian, quick" style={inputStyle} />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Source URL</label>
            <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://" style={inputStyle} />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Song for this recipe</label>
            <p style={{ fontSize: '12px', color: '#7A7468', marginTop: 0, marginBottom: '10px' }}>
              Paste a Spotify link. The song plays right on the recipe page.
            </p>
            <input
              type="url"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              style={inputStyle}
            />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Culinary techniques</label>
            <p style={{ fontSize: '12px', color: '#7A7468', marginTop: 0, marginBottom: '10px' }}>
              Tag the techniques used in this recipe. Cooks viewing the finished recipe can tap one to see what it means.
            </p>
            <TechniqueGallery
              selectable
              selectedIds={techniqueIds}
              suggestedIds={suggestedTechniqueIds}
              onSelectionChange={setTechniqueIds}
            />
          </div>

          {error && (
            <div style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', border: '0.5px solid #E4DACB', marginBottom: '16px', fontSize: '13px', color: '#B33' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={saving || deleting}
              style={{ flex: 1, background: '#5C6B47', color: '#F3EDE4', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: saving ? 'wait' : 'pointer' }}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/recipes/${id}`)}
              disabled={saving || deleting}
              style={{ flex: 1, background: 'white', color: '#5C6B47', border: '0.5px solid #E4DACB', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: saving ? 'wait' : 'pointer' }}
            >
              Cancel
            </button>
          </div>

        </form>

        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #E8C4C4', marginTop: '32px' }}>
          <div style={{ fontSize: '11px', color: '#A04040', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, marginBottom: '8px' }}>
            Danger zone
          </div>
          <div style={{ fontSize: '14px', color: '#21201D', marginBottom: '4px', fontWeight: 500 }}>Delete this recipe</div>
          <div style={{ fontSize: '12px', color: '#7A7468', lineHeight: '1.5', marginBottom: '16px' }}>
            Permanently removes the recipe and its photo. This can&apos;t be undone.
          </div>

          {!confirmingDelete ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={saving || deleting}
              style={{ background: 'white', color: '#A04040', border: '0.5px solid #E8C4C4', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
            >
              Delete recipe
            </button>
          ) : (
            <div>
              <div style={{ fontSize: '13px', color: '#A04040', marginBottom: '12px', fontWeight: 500 }}>
                Are you sure? This will delete &ldquo;{title}&rdquo; forever.
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ background: '#A04040', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 500, cursor: deleting ? 'wait' : 'pointer' }}
                >
                  {deleting ? 'Deleting...' : 'Yes, delete it'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                  style={{ background: 'white', color: '#21201D', border: '0.5px solid #E4DACB', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 500, cursor: deleting ? 'wait' : 'pointer' }}
                >
                  Keep it
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}