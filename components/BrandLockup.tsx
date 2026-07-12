'use client'

import { useState, useRef, useEffect } from 'react'
import LogoMark from '@/components/LogoMark'

// The "logo + title + divider + tagline" unit, as one reusable, resizable block.
// Every pixel value here was hand-calibrated at scale=1 (see Hero's edit history —
// getting the logo's top/bottom to match the title+tagline stack exactly took a lot
// of back-and-forth). Multiplying every one of those values by `scale` keeps all
// those relationships intact at any size, instead of re-guessing new numbers.
export default function BrandLockup({ scale = 1 }: { scale?: number }) {
  const [logoSize, setLogoSize] = useState(130 * scale)
  const textStackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function measure() {
      if (textStackRef.current) {
        setLogoSize(textStackRef.current.offsetHeight)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [scale])

  return (
    <div style={{ display: 'inline-block' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: `${24 * scale}px`, alignItems: 'start' }}>
        <div>
          {/* Measured height includes invisible font leading above the title's "M"
              and below the tagline's last line. Shift down to match the visible
              glyph top, and shrink to remove that same leading from the bottom —
              both offsets scale with the rest of the unit. */}
          <LogoMark
            size={Math.max(0, logoSize - 15 * scale)}
            mode="light"
            style={{ position: 'relative', top: `${6 * scale}px` }}
          />
        </div>
        <div ref={textStackRef}>
          <span style={{
            display: 'block', fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: `${48 * scale}px`,
            color: '#21201D', fontWeight: '400', lineHeight: '1', whiteSpace: 'nowrap', textAlign: 'center'
          }}>
            Mise en Place
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${10 * scale}px`, margin: `${12 * scale}px 0` }}>
            <div style={{ width: `${50 * scale}px`, height: '1px', background: '#21201D' }} />
            <div style={{ width: `${4 * scale}px`, height: `${4 * scale}px`, borderRadius: '50%', background: '#7A7468' }} />
            <div style={{ width: `${50 * scale}px`, height: '1px', background: '#21201D' }} />
          </div>
          <p style={{
            fontSize: `${11 * scale}px`, color: '#7A7468', letterSpacing: '0.06em',
            lineHeight: '1.6', margin: '0', textTransform: 'uppercase', textAlign: 'center'
          }}>
            <span style={{ color: '#21201D' }}>Every recipe has a story.</span><br/>
            <span style={{ color: '#B85C38' }}>Every technique has a purpose.</span><br/>
            <span style={{ color: '#C99A3D' }}>Everything in its place.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
