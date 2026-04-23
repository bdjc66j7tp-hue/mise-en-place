export default function Education() {
  const techniques = [
    'Sauté', 'Deglaze', 'Julienne', 'Mise en place',
    'Mirepoix', 'Brunoise', 'Braise', 'Chiffonade'
  ]

  return (
    <section style={{ background: '#3B6D11', padding: '60px 40px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: '#97C459', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', marginBottom: '8px' }}>
          Learn as you cook
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#EAF3DE', fontWeight: '400', marginBottom: '6px' }}>
          Culinary technique built into every recipe
        </h2>
        <p style={{ fontSize: '14px', color: '#97C459', lineHeight: '1.7', marginBottom: '28px' }}>
          Every technique in every recipe you import is tappable. A full technique card slides up — what it is, how it works, when to use it. Learning that feels like discovery, not a lesson.
        </p>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' }}>
          {techniques.map((t, i) => (
            <div key={i} style={{
              background: '#27500A', color: '#C0DD97', fontSize: '12px',
              padding: '6px 13px', borderRadius: '20px',
              border: '0.5px solid #639922', cursor: 'pointer'
            }}>
              {t}
            </div>
          ))}
        </div>
        <button style={{
          background: '#EAF3DE', color: '#27500A', border: 'none',
          borderRadius: '12px', padding: '12px 26px', fontSize: '14px',
          fontWeight: '500', cursor: 'pointer'
        }}>
          Explore the technique library ›
        </button>
      </div>
    </section>
  )
}