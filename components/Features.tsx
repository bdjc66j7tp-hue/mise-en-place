'use client'

export default function Features() {
  const iconProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#F3EDE4',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  const badgeColors = ['#B85C38', '#5C6B47', '#C99A3D']

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
    // 2 — Lightbulb (AI Meal Planner)
    <svg key="planner" {...iconProps}>
      <path d="M9 21h6" />
      <path d="M10 17h4" />
      <path d="M12 3a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V17H9v-2.8A6 6 0 0 1 6 9a6 6 0 0 1 6-6z" />
    </svg>,
  ]

  type Feature = {
    title: string
    desc: string
    ctaHref: string
  }

  const features: Feature[] = [
    {
      title: 'Import from anywhere',
      desc: 'Paste a link, paste the text, or snap a photo of a recipe card. AI strips it to a clean recipe instantly.',
      ctaHref: '/import',
    },
    {
      title: 'Learn culinary techniques',
      desc: 'Every technique in every recipe is tappable. A full culinary education built into every recipe you import.',
      ctaHref: '/techniques',
    },
    {
      title: 'AI Meal Planner',
      desc: 'Tell Mise en Place what\'s in your pantry. It checks your saved recipes first, then suggests new ideas.',
      ctaHref: '/recipes',
    },
  ]

  function handleClick(feat: Feature) {
    window.location.href = feat.ctaHref
  }

  return (
    <section style={{ background: 'white', padding: '60px 40px', fontFamily: 'var(--font-montserrat), Arial, sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#B85C38', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', textAlign: 'center', marginBottom: '8px' }}>
          What Mise en Place does
        </p>
        <h2 className="nowrap-desktop-only" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '22px', color: '#21201D', textAlign: 'center', fontWeight: '400', marginBottom: '6px' }}>
          Your recipes, organized. Your culinary skills, elevated.
        </h2>
        <p style={{ fontSize: '14px', color: '#7A7468', textAlign: 'center', lineHeight: '1.7', marginBottom: '32px' }}>
          Everything a serious home cook needs — and more.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {features.map((feat, i) => (
            <div key={i} onClick={() => handleClick(feat)} style={{ background: '#F3EDE4', borderRadius: '12px', padding: '16px 14px', border: '0.5px solid #E4DACB', cursor: 'pointer', position: 'relative', transition: 'border 0.2s' }}>
              <div style={{ width: '34px', height: '34px', background: badgeColors[i], borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icons[i]}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#21201D', marginBottom: '6px' }}>{feat.title}</div>
              <div style={{ fontSize: '12px', color: '#5A564D', lineHeight: '1.6' }}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
