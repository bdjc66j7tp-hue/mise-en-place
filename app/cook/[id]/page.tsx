import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
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
      <div style={{ minHeight: '100vh', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', border: '0.5px solid #C0DD97', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontStyle: 'italic', color: '#3B6D11', marginBottom: '8px' }}>This profile is private</div>
          <div style={{ fontSize: '13px', color: '#639922', lineHeight: '1.5' }}>The cook keeps this one to themselves.</div>
          <Link href="/recipes" style={{ display: 'inline-block', marginTop: '20px', fontSize: '13px', color: '#3B6D11', textDecoration: 'none', borderBottom: '1px solid #C0DD97', paddingBottom: '2px' }}>
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

  const socials = [
    profile.instagram_username && { name: 'Instagram', href: `https://instagram.com/${profile.instagram_username}`, icon: 'instagram' },
    profile.tiktok_username && { name: 'TikTok', href: `https://tiktok.com/@${profile.tiktok_username}`, icon: 'tiktok' },
    profile.youtube_handle && { name: 'YouTube', href: `https://youtube.com/@${profile.youtube_handle}`, icon: 'youtube' },
    profile.website_url && { name: 'Website', href: profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`, icon: 'website' },
  ].filter(Boolean) as { name: string; href: string; icon: string }[]

  return (
    <div style={{ minHeight: '100vh', background: '#EAF3DE' }}>

      <div style={{ width: '100%', aspectRatio: '5 / 2', maxHeight: '240px', background: '#3B6D11', borderBottom: '0.5px solid #639922', overflow: 'hidden' }}>
        {profile.banner_photo_url && (
          <img src={profile.banner_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginTop: '-60px', marginBottom: '24px', display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#27500A', border: '4px solid #EAF3DE', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {profile.profile_photo_url ? (
              <img src={profile.profile_photo_url} alt={profile.display_name || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontStyle: 'italic', color: '#97C459' }}>
                {(profile.display_name || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ paddingBottom: '12px', flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#27500A', fontWeight: '400', margin: 0 }}>
                {profile.display_name || 'Cook'}
              </h1>
              {isOwnProfile && profile.is_public === false && (
                <span style={{ fontSize: '10px', color: '#639922', background: '#EAF3DE', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em', border: '0.5px solid #C0DD97' }}>
                  Private
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: '#639922', marginTop: '4px' }}>
              {recipes?.length ?? 0} recipe{recipes?.length === 1 ? '' : 's'}
            </p>
          </div>
          {isOwnProfile && (
            <Link href={`/cook/${id}/edit`} style={{ textDecoration: 'none', paddingBottom: '12px' }}>
              <div style={{ background: '#3B6D11', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
                Edit profile
              </div>
            </Link>
          )}
        </div>

        {profile.bio && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', border: '0.5px solid #C0DD97', marginBottom: socials.length > 0 ? '12px' : '24px' }}>
            <p style={{ fontSize: '14px', color: '#27500A', lineHeight: '1.6', margin: 0 }}>{profile.bio}</p>
          </div>
        )}

        {socials.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" title={s.name} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', background: 'white', borderRadius: '10px', border: '0.5px solid #C0DD97', color: '#3B6D11', textDecoration: 'none' }}>
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

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontStyle: 'italic', color: '#27500A', fontWeight: '400', marginBottom: '16px', marginTop: '32px' }}>
          Recipes
        </h2>

        {(!recipes || recipes.length === 0) ? (
          <div style={{ background: 'white', borderRadius: '14px', padding: '40px 24px', border: '0.5px solid #C0DD97', textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontStyle: 'italic', color: '#3B6D11', marginBottom: '6px' }}>No recipes yet</div>
            <div style={{ fontSize: '12px', color: '#639922' }}>{isOwnProfile ? 'Import your first recipe to get started.' : 'This cook hasn\'t added any recipes.'}</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {recipes.map((recipe) => {
              const hasUserPhoto = recipe.photo_url && recipe.photo_url.includes('supabase')
              return (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '0.5px solid #C0DD97', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', height: '160px', background: '#3B6D11', overflow: 'hidden' }}>
                      {hasUserPhoto ? (
                        <img src={recipe.photo_url} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg viewBox="0 0 24 24" fill="none" width="36" height="36">
                            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#97C459" strokeWidth="1.5"/>
                            <circle cx="8" cy="10" r="2" stroke="#97C459" strokeWidth="1.5"/>
                            <path d="M3 16l5-4 4 3 3-4 6 5" stroke="#97C459" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px 16px', flex: 1 }}>
                      {isOwnProfile && recipe.visibility !== 'public' && (
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ display: 'inline-block', fontSize: '9px', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em', background: recipe.visibility === 'draft' ? '#E8DAB2' : '#D4C4A0', color: '#27500A', border: '0.5px solid #C0DD97' }}>
                            {recipe.visibility === 'draft' ? 'Draft' : 'Private'}
                          </span>
                        </div>
                      )}
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontStyle: 'italic', color: '#27500A', fontWeight: '400', marginBottom: '4px', lineHeight: '1.3' }}>{recipe.title}</h3>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}