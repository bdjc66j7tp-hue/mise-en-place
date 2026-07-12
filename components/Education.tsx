import Link from 'next/link'

export default function Education() {
  const techniques = [
    'Sauté', 'Deglaze', 'Julienne', 'Mise en place',
    'Mirepoix', 'Brunoise', 'Braise', 'Chiffonade'
  ]
  return (
    <section style={{ background: '#5C6B47', padding: '60px 40px', fontFamily: 'var(--font-montserrat), Arial, sans-serif' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', marginBottom: '8px' }}>
          Learn as you cook
        </p>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '28px', color: '#F3EDE4', fontWeight: '400', marginBottom: '6px' }}>
          Culinary technique built into every recipe
        </h2>
        <p style={{ fontSize: '14px', color: '#DCE0D2', lineHeight: '1.7', marginBottom: '28px' }}>
          Learning that feels like discovery, not a lesson.
        </p>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' }}>
          {techniques.map((t, i) => (
            <div key={i} style={{
              background: '#4A5639', color: '#F3EDE4', fontSize: '12px',
              padding: '6px 13px', borderRadius: '20px',
              border: '0.5px solid #6E7D5A', cursor: 'pointer'
            }}>
              {t}
            </div>
          ))}
        </div>
        <Link href="/techniques" style={{
          display: 'inline-block', textDecoration: 'none',
          background: '#F3EDE4', color: '#21201D', border: 'none',
          borderRadius: '12px', padding: '12px 26px', fontSize: '14px',
          fontWeight: '500', cursor: 'pointer'
        }}>
          Explore the technique library ›
        </Link>
      </div>
    </section>
  )
}
