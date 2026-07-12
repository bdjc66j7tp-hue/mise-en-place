// components/VideoTipsSection.tsx
'use client'

import { useState, useMemo } from 'react'
import { VIDEO_TIPS, VIDEO_TIP_SOURCES, withAffiliateParams, type VideoTip } from '@/lib/videoTips'

const COLORS = {
  bgDeep: '#21201D',
  bgMid: '#4A5639',
  cream: '#F3EDE4',
  sage: '#DCE0D2',
  border: '#6E7D5A',
}

export default function VideoTipsSection() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return VIDEO_TIPS
    const q = query.toLowerCase()
    return VIDEO_TIPS.filter((v) => v.title.toLowerCase().includes(q))
  }, [query])

  const grouped = useMemo(() => {
    const bySource: Record<string, VideoTip[]> = {}
    for (const tip of filtered) {
      if (!bySource[tip.source]) bySource[tip.source] = []
      bySource[tip.source].push(tip)
    }
    return bySource
  }, [filtered])

  return (
    <section style={{ padding: '64px 24px 80px', background: COLORS.bgDeep }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '11px',
            color: COLORS.sage,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 500,
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          More to explore
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '28px',
            color: COLORS.cream,
            fontWeight: 400,
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          Video Cooking Tips
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: COLORS.sage,
            lineHeight: 1.7,
            textAlign: 'center',
            maxWidth: '520px',
            margin: '0 auto 8px',
          }}
        >
          Short videos from culinary schools and chefs around the web. Every
          title below opens the original site in a new tab — we don&rsquo;t
          host or embed any of these videos ourselves. All credit belongs to
          each source.
        </p>
        <p
          style={{
            fontSize: '12px',
            color: COLORS.sage,
            textAlign: 'center',
            marginBottom: '32px',
            opacity: 0.85,
          }}
        >
          {VIDEO_TIPS.length} videos across {Object.keys(VIDEO_TIP_SOURCES).length} sources
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search video tips…"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '420px',
            margin: '0 auto 40px',
            padding: '12px 18px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.border}`,
            background: COLORS.bgMid,
            color: COLORS.cream,
            fontSize: '14px',
            outline: 'none',
          }}
        />

        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: COLORS.sage, fontSize: '14px' }}>
            No video tips match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          Object.entries(grouped).map(([sourceKey, tips]) => {
            const source = VIDEO_TIP_SOURCES[sourceKey as keyof typeof VIDEO_TIP_SOURCES]
            return (
              <div key={sourceKey} style={{ marginBottom: '40px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(220, 224, 210, 0.25)',
                    paddingBottom: '8px',
                    marginBottom: '14px',
                  }}
                >
                  <a
                    href={withAffiliateParams(source.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: COLORS.cream,
                      textDecoration: 'none',
                    }}
                  >
                    {source.name}
                  </a>
                  <span style={{ fontSize: '12px', color: COLORS.sage, opacity: 0.8 }}>
                    {tips.length} videos
                  </span>
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '4px 24px',
                  }}
                >
                  {tips.map((v) => (
                    <li key={v.url}>
                      <a
                        href={withAffiliateParams(v.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          padding: '9px 0',
                          fontSize: '13.5px',
                          color: COLORS.cream,
                          textDecoration: 'none',
                          borderBottom: '1px solid rgba(220, 224, 210, 0.18)',
                        }}
                      >
                        {v.title} <span style={{ color: COLORS.sage }}>›</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
