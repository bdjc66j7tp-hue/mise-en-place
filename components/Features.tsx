'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

type FeaturedRecipe = { id: string; title: string } | null

export default function Features() {
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null)
  const [featuredSong, setFeaturedSong] = useState<FeaturedRecipe>(null)
  const [featuredScale, setFeaturedScale] = useState<FeaturedRecipe>(null)

  useEffect(() => {
    const supabase = createClient()
    async function loadFeatured() {
      // Featured recipe with a song
      const songRes = await supabase
        .from('recipes')
        .select('id, title')
        .eq('visibility', 'public')
        .eq('is_featured', true)
        .not('spotify_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (songRes.data) setFeaturedSong({ id: songRes.data.id, title: songRes.data.title })

      // Featured recipe with servings (for Scale demo)
      const scaleRes = await supabase
        .from('recipes')
        .select('id, title')
        .eq('visibility', 'public')
        .eq('is_featured', true)
        .not('servings', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (scaleRes.data) setFeaturedScale({ id: scaleRes.data.id, title: scaleRes.data.title })
    }
    loadFeatured()
  }, [])

  const iconProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#C0DD97',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  const icons = [
    // 0 — Import: download into box
    <svg key="import" {...iconProps}>
      <path d="M3 16v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
      <polyline points="8 11 12 15 16 11" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>,
    // 1 — Pan with flames (Learn culinary techniques)
    <svg key="pan" {...iconProps}>
      <path d="M8 8q-1.5 2 0 4q1.5-1 0 0q1.5-1.5 2.5 1" />
      <path d="M13 8q-1.5 2 0 4q1.5-1 0 0q1.5-1.5 2.5 1" />
      <path d="M3 14h14" />
      <path d="M3 14v2a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-2" />
      <line x1="17" y1="14" x2="22" y2="12" />
    </svg>,
    // 2 — People (Community)
    <svg key="people" {...iconProps}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14.5c2.8 0 5 2.2 5 5" />
    </svg>,
    // 3 — Balance scale (Scale servings)
    <svg key="scale" {...iconProps}>
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="6" y1="20" x2="18" y2="20" />
      <line x1="4" y1="7" x2="20" y2="7" />
      <path d="M4 7l-2.5 5a3.5 3.5 0 0 0 7 0L6 7" />
      <path d="M20 7l-2.5 5a3.5 3.5 0 0 0 7 0L22 7" transform="translate(-4 0)" />
    </svg>,
    // 4 — Dual arrows (Convert units)
    <svg key="convert" {...iconProps}>
      <polyline points="7 7 3 11 7 15" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <polyline points="17 9 21 13 17 17" />
      <line x1="21" y1="13" x2="3" y2="13" />
    </svg>,
    // 5 — Music note (Link a song)
    <svg key="music" {...iconProps}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>,
  ]

  type Feature = {
    title: string
    desc: string
    comingSoon: boolean
    behavior: 'navigate' | 'expand' | 'none'
    expandedDesc?: string
    ctaLabel?: string
    ctaHref?: string
  }

  const features: Feature[] = [
    {
      title: 'Import from anywhere',
      desc: 'Any website, TikTok, Instagram, handwritten card or photo. AI strips it to a clean recipe instantly.',
      comingSoon: false,
      behavior: 'navigate',
      ctaHref: '/import',
    },
    {
      title: 'Learn culinary techniques',
      desc: 'Every technique in every recipe is tappable. A full culinary education built into every recipe you import.',
      comingSoon: true,
      behavior: 'none',
    },
    {
      title: 'Community',
      desc: 'Follow great cooks. Save their recipes. Every cook has their colour — named after food.',
      comingSoon: true,
      behavior: 'none',
    },
    {
      title: 'Scale servings',
      desc: 'Cooking for 8 when the recipe says 4? Type your new serving count and every ingredient rescales instantly.',
      comingSoon: false,
      behavior: 'expand',
      expandedDesc: 'Every recipe is written for a specific number of servings. Click the Serves number on any recipe and type the count you need — the ingredients rescale in real time, fractions stay tidy, and the original is always one click away.',
      ctaLabel: featuredScale ? `Try it on “${featuredScale.title}” →` : 'Browse recipes →',
      ctaHref: featuredScale ? `/recipes/${featuredScale.id}` : '/recipes',
    },
    {
      title: 'Convert units',
      desc: 'Read a metric recipe in cups, or a US recipe in grams. Same ingredients, the units you think in.',
      comingSoon: true,
      behavior: 'none',
    },
    {
      title: 'Link a song',
      desc: 'Every recipe has a soundtrack. Link the song that reminds you of this dish.',
      comingSoon: false,
      behavior: 'expand',
      expandedDesc: 'Every recipe deserves a soundtrack. Paste a Spotify link when you create or edit a recipe and it plays right there while you cook. The song stays with the recipe forever.',
      ctaLabel: featuredSong ? `Hear it on “${featuredSong.title}” →` : 'Browse recipes →',
      ctaHref: featuredSong ? `/recipes/${featuredSong.id}` : '/recipes',
    },
  ]

  function handleClick(feat: Feature) {
    if (feat.behavior === 'navigate' && feat.ctaHref) {
      window.location.href = feat.ctaHref
    } else if (feat.behavior === 'expand') {
      setExpandedTitle((prev) => (prev === feat.title ? null : feat.title))
    }
  }

  return (
    <section style={{ background: 'white', padding: '60px 40px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', textAlign: 'center', marginBottom: '8px' }}>
          What Mise en Place does
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#3B6D11', textAlign: 'center', fontWeight: '400', marginBottom: '6px' }}>
          Your kitchen. Your collection. Your way.
        </h2>
        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', lineHeight: '1.7', marginBottom: '32px' }}>
          Everything a serious home cook needs — and nothing they don&apos;t.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {features.map((feat, i) => {
            const isExpanded = expandedTitle === feat.title
            const isClickable = feat.behavior === 'navigate' || feat.behavior === 'expand'
            const ctaStyle = { display: 'inline-block', background: '#3B6D11', color: 'white', fontSize: '12px', fontWeight: 500, padding: '8px 14px', borderRadius: '8px', textDecoration: 'none' }
            return (
              <div key={i} onClick={() => handleClick(feat)} style={{ background: '#EAF3DE', borderRadius: '12px', padding: '16px 14px', border: isExpanded ? '0.5px solid #3B6D11' : '0.5px solid #C0DD97', cursor: isClickable ? 'pointer' : 'default', opacity: feat.comingSoon ? 0.65 : 1, position: 'relative', gridColumn: isExpanded ? '1 / -1' : 'auto', transition: 'border 0.2s' }}>
                {feat.comingSoon && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '9px', padding: '2px 7px', borderRadius: '20px', background: '#27500A', color: '#C0DD97', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500' }}>Soon</span>
                )}
                <div style={{ width: '34px', height: '34px', background: '#3B6D11', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {icons[i]}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#27500A', marginBottom: '6px' }}>{feat.title}</div>
                <div style={{ fontSize: '12px', color: '#3B6D11', lineHeight: '1.6', opacity: 0.8 }}>{feat.desc}</div>
                {isExpanded && feat.expandedDesc && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '0.5px solid #C0DD97' }}>
                    <p style={{ fontSize: '13px', color: '#27500A', lineHeight: '1.7', margin: '0 0 12px 0' }}>{feat.expandedDesc}</p>
                    {feat.ctaLabel && feat.ctaHref && (
                      <a href={feat.ctaHref} onClick={(e) => e.stopPropagation()} style={ctaStyle}>{feat.ctaLabel}</a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}