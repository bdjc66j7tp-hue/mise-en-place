'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { MemberSearchResult } from '@/app/api/community/search/route'

// ── Types ─────────────────────────────────────────────────────

export type RecentRecipe = {
  id: string
  title: string
  photo_url: string | null
  tags: string[] | null
  user_id: string
  created_at: string
  author_name: string | null
  author_photo: string | null
}

export type RecentComment = {
  id: string
  author_name: string
  content: string
  created_at: string
  recipe_id: string
  recipe_title: string
}

export type NewMember = {
  id: string
  display_name: string
  bio: string | null
  profile_photo_url: string | null
}

type Props = {
  recentRecipes:  RecentRecipe[]
  recentComments: RecentComment[]
  newMembers:     NewMember[]
}

// ── Helpers ───────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 2)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30)  return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function Avatar({ name, photoUrl, size = 36 }: { name: string; photoUrl: string | null; size?: number }) {
  return photoUrl ? (
    <img
      src={photoUrl}
      alt={name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: '#5C6B47',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, color: '#F3EDE4', fontWeight: 600, flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  )
}

// ── Search results ────────────────────────────────────────────

function MemberCard({ m }: { m: MemberSearchResult }) {
  return (
    <Link href={`/cook/${m.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', borderRadius: '14px', border: '0.5px solid #E4DACB',
        padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px',
        transition: 'box-shadow 0.15s', cursor: 'pointer',
      }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(33,32,29,0.12)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        {/* Header: avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={m.display_name} photoUrl={m.profile_photo_url} size={44} />
          <div>
            <div style={{ fontWeight: 600, color: '#21201D', fontSize: '15px' }}>{m.display_name}</div>
            <div style={{ fontSize: '12px', color: '#7A7468' }}>
              {m.recipe_count} {m.recipe_count === 1 ? 'recipe' : 'recipes'}
            </div>
          </div>
        </div>

        {/* Bio */}
        {m.bio && (
          <p style={{
            fontSize: '13px', color: '#5A564D', lineHeight: 1.55, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {m.bio}
          </p>
        )}

        {/* Top tags */}
        {m.top_tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {m.top_tags.map(tag => (
              <span key={tag} style={{
                background: '#F3EDE4', color: '#5C6B47', fontSize: '10px',
                padding: '3px 9px', borderRadius: '20px', border: '0.5px solid #E4DACB',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Sample recipe photos */}
        {m.sample_photos.length > 0 && (
          <div style={{ display: 'flex', gap: '6px' }}>
            {m.sample_photos.slice(0, 3).map((url, i) => (
              <img key={i} src={url} alt="" style={{
                flex: 1, height: '64px', objectFit: 'cover',
                borderRadius: '8px', minWidth: 0,
              }} />
            ))}
            {/* grey placeholders if fewer than 3 photos */}
            {Array.from({ length: Math.max(0, 3 - m.sample_photos.length) }).map((_, i) => (
              <div key={`ph-${i}`} style={{
                flex: 1, height: '64px', background: '#F3EDE4',
                borderRadius: '8px', minWidth: 0,
              }} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

// ── Sub-sections ──────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: '11px', fontWeight: 600, color: '#7A7468',
      textTransform: 'uppercase', letterSpacing: '0.1em',
      margin: '0 0 16px',
    }}>
      {children}
    </h2>
  )
}

function NewMembersRow({ members }: { members: NewMember[] }) {
  if (members.length === 0) return null
  return (
    <section style={{ marginBottom: '40px' }}>
      <SectionHeading>New members</SectionHeading>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {members.map(m => (
          <Link key={m.id} href={`/cook/${m.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              background: 'white', borderRadius: '12px', border: '0.5px solid #E4DACB',
              padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '8px', width: '120px', textAlign: 'center',
              transition: 'box-shadow 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(33,32,29,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <Avatar name={m.display_name} photoUrl={m.profile_photo_url} size={48} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#21201D', lineHeight: 1.3 }}>
                {m.display_name}
              </div>
              {m.bio && (
                <p style={{
                  fontSize: '10px', color: '#7A7468', margin: 0, lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {m.bio}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function RecentRecipesGrid({ recipes }: { recipes: RecentRecipe[] }) {
  if (recipes.length === 0) return null
  return (
    <section style={{ marginBottom: '40px' }}>
      <SectionHeading>Recent recipes</SectionHeading>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
      }}>
        {recipes.map(r => (
          <Link key={r.id} href={`/recipes/${r.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white', borderRadius: '12px', border: '0.5px solid #E4DACB',
              overflow: 'hidden', transition: 'box-shadow 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(33,32,29,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              {/* Photo */}
              {r.photo_url ? (
                <img src={r.photo_url} alt={r.title} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '140px', background: '#F3EDE4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
                    <path d="M3 19C3 13 6 8 12 6C18 8 21 13 21 19" stroke="#D6C9AF" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 19C7 15 8.8 12 12 11C15.2 12 17 15 17 19" stroke="#D6C9AF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#21201D', lineHeight: 1.3, marginBottom: '6px' }}>
                  {r.title}
                </div>
                {/* Author */}
                {r.author_name && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Avatar name={r.author_name} photoUrl={r.author_photo} size={18} />
                    <span style={{ fontSize: '11px', color: '#7A7468' }}>{r.author_name}</span>
                  </div>
                )}
                {/* Tags */}
                {r.tags && r.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {r.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{
                        background: '#F3EDE4', color: '#5C6B47', fontSize: '9px',
                        padding: '2px 7px', borderRadius: '20px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: '#7A7468', marginTop: '6px' }}>{timeAgo(r.created_at)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function RecentCommentsFeed({ comments }: { comments: RecentComment[] }) {
  if (comments.length === 0) return null
  return (
    <section style={{ marginBottom: '40px' }}>
      <SectionHeading>Recent comments</SectionHeading>
      <div style={{ background: 'white', borderRadius: '14px', border: '0.5px solid #E4DACB' }}>
        {comments.map((c, i) => (
          <div key={c.id} style={{
            padding: '14px 18px',
            borderBottom: i < comments.length - 1 ? '0.5px solid #E4DACB' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Avatar name={c.author_name} photoUrl={null} size={26} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#21201D' }}>{c.author_name}</span>
              <span style={{ fontSize: '10px', color: '#7A7468' }}>· {timeAgo(c.created_at)}</span>
            </div>
            <p style={{ fontSize: '12px', color: '#5A564D', lineHeight: 1.55, margin: '0 0 4px 34px',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {c.content}
            </p>
            <Link href={`/recipes/${c.recipe_id}`} style={{ fontSize: '10px', color: '#7A7468', textDecoration: 'none', marginLeft: '34px' }}>
              on <span style={{ textDecoration: 'underline' }}>{c.recipe_title}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────

export default function CommunityPage({ recentRecipes, recentComments, newMembers }: Props) {
  const [query, setQuery]               = useState('')
  const [results, setResults]           = useState<MemberSearchResult[]>([])
  const [searching, setSearching]       = useState(false)
  const [searchDone, setSearchDone]     = useState(false)
  const [searchError, setSearchError]   = useState('')
  const debounceRef                     = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearchDone(false)
      setSearchError('')
      return
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      setSearchError('')
      try {
        const res = await fetch(`/api/community/search?q=${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error()
        const data: MemberSearchResult[] = await res.json()
        setResults(data)
        setSearchDone(true)
      } catch {
        setSearchError('Search failed — please try again.')
      } finally {
        setSearching(false)
      }
    }, 400)
  }, [query])

  const isSearching = query.trim().length >= 2

  return (
    <div style={{ minHeight: '100vh', background: '#F3EDE4' }}>

      {/* ── Header / search bar ── */}
      <div style={{ background: '#21201D', padding: '40px 24px 48px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '36px', color: '#F3EDE4', fontWeight: 400,
            margin: '0 0 6px',
          }}>
            Community
          </h1>
          <p style={{ fontSize: '14px', color: '#DCE0D2', margin: '0 0 28px', lineHeight: 1.5 }}>
            Discover cooks, follow their recipes, and find your people.
          </p>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <circle cx="7" cy="7" r="5" stroke="#DCE0D2" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="#DCE0D2" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Find members who post plant-based, Italian, weeknight…"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#4A5639', border: '0.5px solid #6E7D5A',
                borderRadius: '12px', padding: '14px 16px 14px 40px',
                fontSize: '14px', color: '#F3EDE4', fontFamily: 'inherit',
                outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = '#C99A3D' }}
              onBlur={e => { e.target.style.borderColor = '#6E7D5A' }}
            />
            {searching && (
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#DCE0D2' }}>
                Searching…
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '36px 24px' }}>

        {isSearching ? (
          /* ── Search results ── */
          <section>
            <SectionHeading>
              {searchDone
                ? results.length > 0
                  ? `${results.length} member${results.length === 1 ? '' : 's'} found`
                  : `No members found for "${query.trim()}"`
                : 'Members'}
            </SectionHeading>
            {searchError && (
              <p style={{ color: '#c0392b', fontSize: '13px' }}>{searchError}</p>
            )}
            {results.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '14px',
              }}>
                {results.map(m => <MemberCard key={m.id} m={m} />)}
              </div>
            ) : searchDone ? (
              <p style={{ fontSize: '14px', color: '#7A7468', fontStyle: 'italic' }}>
                Try a different term — dietary styles (vegan, gluten-free), cuisines (Thai, Italian), or meal types (weeknight, batch cooking).
              </p>
            ) : null}
          </section>
        ) : (
          /* ── Default feed ── */
          <>
            <NewMembersRow members={newMembers} />
            <RecentRecipesGrid recipes={recentRecipes} />
            <RecentCommentsFeed comments={recentComments} />

            {recentRecipes.length === 0 && recentComments.length === 0 && newMembers.length === 0 && (
              <p style={{ fontSize: '14px', color: '#7A7468', fontStyle: 'italic', textAlign: 'center', paddingTop: '40px' }}>
                No public members yet — be the first to make your profile public!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
