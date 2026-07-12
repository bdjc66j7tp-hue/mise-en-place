import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

interface RecipeRow {
  id: string
  title: string
  photo_url: string | null
  tags: string[] | null
  source_url: string | null
  servings: number | null
  prep_time: string | null
  cook_time: string | null
  user_id: string
  is_featured: boolean | null
}

export default async function Showcase() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() { /* read-only render */ }
      }
    }
  )

  const { data: recipeRows } = await supabase
    .from('recipes')
    .select('id, title, photo_url, tags, source_url, servings, prep_time, cook_time, user_id, is_featured')
    .eq('visibility', 'public')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(4)

  const recipes = (recipeRows ?? []) as RecipeRow[]

  // Only show what's real — if there's nothing public to showcase yet, skip the section
  if (recipes.length === 0) return null

  const authorIds = [...new Set(recipes.map(r => r.user_id))]
  const { data: authorRows } = authorIds.length > 0
    ? await supabase.from('profiles').select('id, display_name, is_public').in('id', authorIds)
    : { data: [] }
  const authorMap = new Map((authorRows ?? []).map(p => [p.id, p]))

  function initials(name: string | null) {
    if (!name) return '·'
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  }

  function sourceDomain(url: string | null) {
    if (!url) return null
    try { return new URL(url).hostname.replace('www.', '') } catch { return null }
  }

  return (
    <section style={{ background: 'white', padding: '60px 40px', fontFamily: 'var(--font-montserrat), Arial, sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#B85C38', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', textAlign: 'center', marginBottom: '8px' }}>
          Recently added
        </p>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', color: '#21201D', textAlign: 'center', fontWeight: '400', marginBottom: '6px' }}>
          Fresh from the kitchen
        </h2>
        <p style={{ fontSize: '14px', color: '#7A7468', textAlign: 'center', lineHeight: '1.7', marginBottom: '28px' }}>
          Every recipe credited to its creator, ready to make your own.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {recipes.map((r) => {
            const author = authorMap.get(r.user_id)
            const authorName = author?.is_public ? author.display_name : null
            const domain = sourceDomain(r.source_url)
            const tag = r.tags && r.tags.length > 0 ? r.tags[0] : null
            return (
              <Link key={r.id} href={`/recipes/${r.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '0.5px solid #E4DACB', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ height: '82px', background: '#F3EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {r.photo_url && (
                      <img src={r.photo_url} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    {tag && (
                      <span style={{ position: 'absolute', top: '6px', right: '6px', fontSize: '9px', background: 'white', color: '#5C6B47', padding: '2px 7px', borderRadius: '20px', border: '0.5px solid #5C6B47' }}>
                        {tag}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '9px 11px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', color: '#21201D' }}>{r.title}</div>
                    <div style={{ fontSize: '10px', color: '#9A9488', marginTop: '2px' }}>
                      {[r.prep_time && `Prep ${r.prep_time}`, r.servings && `Serves ${r.servings}`].filter(Boolean).join(' · ')}
                    </div>
                    {domain && (
                      <div style={{ fontSize: '10px', color: '#B85C38', marginTop: '3px' }}>↗ {domain}</div>
                    )}
                    {authorName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', paddingTop: '5px', borderTop: '0.5px solid #F3EDE4' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#5C6B47', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: 'white', fontWeight: '500' }}>
                          {initials(authorName)}
                        </div>
                        <span style={{ fontSize: '10px', color: '#9A9488' }}>{authorName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <Link href="/recipes" style={{ display: 'inline-block', background: 'transparent', color: '#21201D', border: '1.5px solid #21201D', borderRadius: '12px', padding: '10px 22px', fontSize: '13px', textDecoration: 'none' }}>
            Browse all recipes ›
          </Link>
        </div>
      </div>
    </section>
  )
}
