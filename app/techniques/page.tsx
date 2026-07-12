// app/techniques/page.tsx
import Link from 'next/link'
import TechniqueGallery from '@/components/TechniqueGallery'
import VideoTipsSection from '@/components/VideoTipsSection'

export const metadata = {
  title: 'Culinary Techniques | Mise en Place',
  description:
    'Every cooking technique used across Mise en Place recipes, explained plainly — searing vs. sweating, braising vs. stewing, and everything in between.',
}

const COLORS = {
  bgDeep: '#21201D',
  bgMid: '#5C6B47',
  cream: '#F3EDE4',
  sage: '#DCE0D2',
}

export default function TechniquesPage() {
  return (
    <main>
      {/* Header band — same visual language as Education.tsx on the homepage */}
      <section style={{ background: COLORS.bgMid, padding: '64px 24px 56px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              fontSize: '12px',
              color: COLORS.sage,
              textDecoration: 'none',
            }}
          >
            ‹ Mise en Place
          </Link>
          <p
            style={{
              fontSize: '11px',
              color: COLORS.sage,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500,
              marginTop: '20px',
              marginBottom: '8px',
            }}
          >
            The Culinary Dictionary
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '34px',
              color: COLORS.cream,
              fontWeight: 400,
              marginBottom: '14px',
            }}
          >
            Every technique, explained plainly
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: COLORS.sage,
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            Tap any technique to see what it actually means — including the
            ones that get mixed up constantly, like sweating, sautéing, and
            searing. This is the same library every recipe draws from.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ padding: '48px 24px 80px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <TechniqueGallery selectable={false} />
        </div>
      </section>

      {/* Separate, credited, outbound-link-only video library — not part
          of the technique dictionary above. See VideoTipsSection.tsx. */}
      <VideoTipsSection />
    </main>
  )
}
