'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload'
import BannerPhotoUpload from '@/components/BannerPhotoUpload'

export default function EditProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null)
  const [bannerPhotoUrl, setBannerPhotoUrl] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [youtube, setYoutube] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== id) {
        setError('You can only edit your own profile.')
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, bio, profile_photo_url, banner_photo_url, is_public, instagram_username, tiktok_username, youtube_handle, website_url')
        .eq('id', id)
        .single()

      if (profile) {
        setDisplayName(profile.display_name ?? '')
        setBio(profile.bio ?? '')
        setProfilePhotoUrl(profile.profile_photo_url ?? null)
        setBannerPhotoUrl(profile.banner_photo_url ?? null)
        setIsPublic(profile.is_public ?? true)
        setInstagram(profile.instagram_username ?? '')
        setTiktok(profile.tiktok_username ?? '')
        setYoutube(profile.youtube_handle ?? '')
        setWebsite(profile.website_url ?? '')
      }
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
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        is_public: isPublic,
        instagram_username: instagram.trim().replace(/^@/, '') || null,
        tiktok_username: tiktok.trim().replace(/^@/, '') || null,
        youtube_handle: youtube.trim().replace(/^@/, '') || null,
        website_url: website.trim() || null,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push(`/cook/${id}`)
    router.refresh()
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontStyle: 'italic', color: '#3B6D11' }}>Loading...</div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', border: '0.5px solid #C0DD97', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontStyle: 'italic', color: '#3B6D11', marginBottom: '8px' }}>Not allowed</div>
          <div style={{ fontSize: '13px', color: '#639922' }}>{error}</div>
        </div>
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '10px 12px', fontSize: '14px', border: '0.5px solid #C0DD97', borderRadius: '8px', boxSizing: 'border-box' as const, fontFamily: 'inherit', color: '#27500A' }
  const labelStyle = { display: 'block', fontSize: '11px', color: '#27500A', textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontWeight: '500', marginBottom: '8px' }
  const cardStyle = { background: 'white', borderRadius: '14px', padding: '24px', border: '0.5px solid #C0DD97', marginBottom: '16px' }

  const radioRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer' }

  return (
    <div style={{ minHeight: '100vh', background: '#EAF3DE', padding: '40px 20px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#27500A', fontWeight: '400', marginBottom: '24px' }}>
          Edit profile
        </h1>

        <form onSubmit={handleSave}>

          <div style={cardStyle}>
            <label style={labelStyle}>Banner</label>
            <BannerPhotoUpload currentBannerUrl={bannerPhotoUrl} onUploaded={setBannerPhotoUrl} />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Profile photo</label>
            <ProfilePhotoUpload currentPhotoUrl={profilePhotoUrl} onUploaded={setProfilePhotoUrl} />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              style={inputStyle}
            />
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A few words about you and your cooking."
              maxLength={300}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <div style={{ fontSize: '11px', color: '#97C459', marginTop: '6px', textAlign: 'right' }}>
              {bio.length} / 300
            </div>
          </div>

          <div style={cardStyle}>
            <label style={labelStyle}>Visibility</label>

            <label style={{ ...radioRowStyle, background: isPublic ? '#EAF3DE' : 'transparent' }}>
              <input type="radio" name="visibility" checked={isPublic} onChange={() => setIsPublic(true)} style={{ marginTop: '3px', accentColor: '#3B6D11' }} />
              <div>
                <div style={{ fontSize: '14px', color: '#27500A', fontWeight: '500' }}>Public</div>
                <div style={{ fontSize: '12px', color: '#639922', marginTop: '2px', lineHeight: '1.4' }}>Anyone can find your profile and see your shared recipes.</div>
              </div>
            </label>

            <label style={{ ...radioRowStyle, background: !isPublic ? '#EAF3DE' : 'transparent', marginTop: '4px' }}>
              <input type="radio" name="visibility" checked={!isPublic} onChange={() => setIsPublic(false)} style={{ marginTop: '3px', accentColor: '#3B6D11' }} />
              <div>
                <div style={{ fontSize: '14px', color: '#27500A', fontWeight: '500' }}>Private</div>
                <div style={{ fontSize: '12px', color: '#639922', marginTop: '2px', lineHeight: '1.4' }}>Your profile is hidden. Only you can see it. Perfect for keeping a personal recipe collection.</div>
              </div>
            </label>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontStyle: 'italic', color: '#27500A', fontWeight: '400', marginTop: 0, marginBottom: '4px' }}>
              Connect
            </h2>
            <p style={{ fontSize: '12px', color: '#639922', marginTop: 0, marginBottom: '16px' }}>
              Optional. Add the ones you want shown on your profile.
            </p>

            <label style={labelStyle}>Instagram username</label>
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="yourhandle" style={{ ...inputStyle, marginBottom: '14px' }} />

            <label style={labelStyle}>TikTok username</label>
            <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="yourhandle" style={{ ...inputStyle, marginBottom: '14px' }} />

            <label style={labelStyle}>YouTube handle</label>
            <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="yourhandle" style={{ ...inputStyle, marginBottom: '14px' }} />

            <label style={labelStyle}>Website or blog</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yoursite.com" style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', border: '0.5px solid #C0DD97', marginBottom: '16px', fontSize: '13px', color: '#B33' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{ flex: 1, background: '#3B6D11', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: saving ? 'wait' : 'pointer' }}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/cook/${id}`)}
              disabled={saving}
              style={{ flex: 1, background: 'white', color: '#3B6D11', border: '0.5px solid #C0DD97', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: saving ? 'wait' : 'pointer' }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}