import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProfileTabs from '@/components/ProfileTabs'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from a Server Component during a normal page render —
            // only Server Actions/Route Handlers can write cookies. Safe to
            // ignore here since this route doesn't rely on writing a refreshed
            // session cookie back; reads still work fine either way.
          }
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === id

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  if (profile.is_public === false && !isOwnProfile) {
    return (
      <div style={{ minHeight: '100vh', background: '#F3EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', border: '0.5px solid #E4DACB', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#5C6B47" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '20px', color: '#21201D', marginBottom: '8px' }}>This profile is private</div>
          <div style={{ fontSize: '13px', color: '#7A7468', lineHeight: '1.5' }}>The cook keeps this one to themselves.</div>
          <Link href="/recipes" style={{ display: 'inline-block', marginTop: '20px', fontSize: '13px', color: '#5C6B47', textDecoration: 'none', borderBottom: '1px solid #E4DACB', paddingBottom: '2px' }}>
            ← Back to recipes
          </Link>
        </div>
      </div>
    )
  }

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', id)
    .neq('visibility', isOwnProfile ? '__never__' : 'draft')
    .order('created_at', { ascending: false })

  // Recipes this profile has hearted/saved from other cooks — only surfaced
  // on your own profile (favorites are treated as personal, like a reading list).
  type SavedRecipe = { id: string; title: string; photo_url: string | null; visibility?: string }
  let savedRecipes: SavedRecipe[] | null = null
  if (isOwnProfile) {
    const { data: favorites } = await supabase
      .from('favorites')
      .select('recipe_id, recipes(id, title, photo_url, visibility)')
      .eq('user_id', id)
      .order('created_at', { ascending: false })

    savedRecipes = (favorites ?? [])
      .map((f): SavedRecipe | null => {
        const r = Array.isArray(f.recipes) ? f.recipes[0] : f.recipes
        return r ? { id: r.id, title: r.title, photo_url: r.photo_url, visibility: r.visibility } : null
      })
      .filter((r): r is SavedRecipe => r !== null)
  }

  const socials = [
    profile.instagram_username && { name: 'Instagram', href: `https://instagram.com/${profile.instagram_username}`, icon: 'instagram' },
    profile.tiktok_username && { name: 'TikTok', href: `https://tiktok.com/@${profile.tiktok_username}`, icon: 'tiktok' },
    profile.youtube_handle && { name: 'YouTube', href: `https://youtube.com/@${profile.youtube_handle}`, icon: 'youtube' },
    profile.website_url && { name: 'Website', href: profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`, icon: 'website' },
  ].filter(Boolean) as { name: string; href: string; icon: string }[]

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4' }}>

      <div style={{ width: '100%', aspectRatio: '5 / 2', maxHeight: '240px', background: '#5C6B47', borderBottom: '0.5px solid #4A5639', overflow: 'hidden' }}>
        {profile.banner_photo_url && (
          <img src={profile.banner_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginTop: '-60px', marginBottom: '24px', display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#21201D', border: '4px solid #F3EDE4', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {profile.profile_photo_url ? (
              <img src={profile.profile_photo_url} alt={profile.display_name || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '40px', color: '#C99A3D' }}>
                {(profile.display_name || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ paddingBottom: '12px', flex: 1, minWidth: '200px', alignSelf: 'flex-start', marginTop: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', color: '#21201D', fontWeight: '400', margin: 0 }}>
                {profile.display_name || 'Cook'}
              </h1>
              {isOwnProfile && profile.is_public === false && (
                <span style={{ fontSize: '10px', color: '#7A7468', background: '#F3EDE4', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em', border: '0.5px solid #E4DACB' }}>
                  Private
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: '#7A7468', marginTop: '4px' }}>
              {recipes?.length ?? 0} recipe{recipes?.length === 1 ? '' : 's'}
            </p>
          </div>
          {isOwnProfile && (
            <Link href={`/cook/${id}/edit`} style={{ textDecoration: 'none', paddingBottom: '12px' }}>
              <div style={{ background: '#5C6B47', color: '#F3EDE4', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
                Edit profile
              </div>
            </Link>
          )}
        </div>

        {profile.bio && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', border: '0.5px solid #E4DACB', marginBottom: socials.length > 0 ? '12px' : '24px' }}>
            <p style={{ fontSize: '14px', color: '#21201D', lineHeight: '1.6', margin: 0 }}>{profile.bio}</p>
          </div>
        )}

        {socials.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" title={s.name} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', background: 'white', borderRadius: '10px', border: '0.5px solid #E4DACB', color: '#5C6B47', textDecoration: 'none' }}>
                {s.icon === 'instagram' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                )}
                {s.icon === 'tiktok' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
                  </svg>
                )}
                {s.icon === 'youtube' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.5 15.5v-7l6 3.5z"/>
                  </svg>
                )}
                {s.icon === 'website' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                )}
              </a>
            ))}
          </div>
        )}

        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', color: '#21201D', fontWeight: '400', marginBottom: '16px', marginTop: '32px' }}>
          Recipes
        </h2>

        <ProfileTabs
          addedRecipes={recipes ?? []}
          savedRecipes={savedRecipes}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  )
}