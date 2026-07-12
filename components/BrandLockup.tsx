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
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  const textStackRef = useRef<HTMLDivElement>(null)

  // The logo sits *beside* the text at scale 1, which needs roughly 480px of
  // room (logo + gap + the widest line — usually "Every technique has a
  // purpose."). Phones don't have that much width. Rather than let any single
  // piece (the nowrap title, that tagline line) overflow — which forces iOS
  // Safari/Chrome to shrink-to-fit the *entire page*, breaking every full-bleed
  // section on the site — shrink the whole lockup as one unit so every piece
  // keeps its calibrated proportions relative to each other, just smaller.
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const NATURAL_WIDTH = 480
  const available = windowWidth - 80 // rough section padding either side
  const responsiveCap = available > 0 ? (available / NATURAL_WIDTH) * 0.9 : scale
  const effectiveScale = Math.min(scale, responsiveCap)

  useEffect(() => {
    function measure() {
      if (textStackRef.current) {
        setLogoSize(textStackRef.current.offsetHeight)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [effectiveScale])

  return (
    <div style={{ display: 'inline-block', maxWidth: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: `${24 * effectiveScale}px`, alignItems: 'start' }}>
        <div>
          {/* Measured height includes invisible font leading above the title's "M"
              and below the tagline's last line. Shift down to match the visible
              glyph top, and shrink to remove that same leading from the bottom —
              both offsets scale with the rest of the unit. */}
          <LogoMark
            size={Math.max(0, logoSize - 15 * effectiveScale)}
            mode="light"
            style={{ position: 'relative', top: `${6 * effectiveScale}px` }}
          />
        </div>
        <div ref={textStackRef}>
          <span style={{
            display: 'block', fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: `${48 * effectiveScale}px`,
            color: '#21201D', fontWeight: '400', lineHeight: '1', whiteSpace: 'nowrap', textAlign: 'center'
          }}>
            Mise en Place
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `${10 * effectiveScale}px`, margin: `${12 * effectiveScale}px 0` }}>
            <div style={{ width: `${50 * effectiveScale}px`, height: '1px', background: '#21201D' }} />
            <div style={{ width: `${4 * effectiveScale}px`, height: `${4 * effectiveScale}px`, borderRadius: '50%', background: '#7A7468' }} />
            <div style={{ width: `${50 * effectiveScale}px`, height: '1px', background: '#21201D' }} />
          </div>
          <p style={{
            fontSize: `${11 * effectiveScale}px`, color: '#7A7468', letterSpacing: '0.06em',
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
