export default function Story() {
  return (
    <section style={{ background: '#27500A', padding: '60px 40px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontStyle: 'italic', color: '#C0DD97', fontWeight: '400', marginBottom: '12px' }}>
            Built by a cook, priced with purpose
          </h2>
          <p style={{ fontSize: '13px', color: '#97C459', lineHeight: '1.8', marginBottom: '10px' }}>
            Mise en Place was built in Vancouver by someone who believes that cooking is one of the most human things we do — and that the tools we use to cook should be beautiful, honest and worth every cent.
          </p>
          <p style={{ fontSize: '13px', color: '#97C459', lineHeight: '1.8', marginBottom: '10px' }}>
            The name speaks for itself. The community is global. And the price is personal.
          </p>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#C0DD97', fontStyle: 'italic', margin: '12px 0 4px' }}>
            $2.67 / month
          </div>
          <div style={{ fontSize: '11px', color: '#639922', fontStyle: 'italic' }}>
            Priced with purpose — <span style={{ color: '#97C459', cursor: 'pointer' }}>ask us why ›</span>
          </div>
        </div>
        <div style={{ background: '#3B6D11', borderRadius: '14px', padding: '24px', textAlign: 'center', border: '0.5px solid #639922' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '60px', color: '#C0DD97', fontWeight: '400', lineHeight: '1' }}>
            1967
          </div>
          <div style={{ fontSize: '11px', color: '#97C459', marginTop: '5px', fontStyle: 'italic' }}>
            Priced with purpose
          </div>
          {[
            'Built in Vancouver, Canada',
            'A name that means what it says',
            'Every recipe credited to its creator',
            'Ad free. Always.',
          ].map((fact, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#EAF3DE', background: '#27500A', borderRadius: '8px', padding: '7px 10px', textAlign: 'left', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#97C459' }}>✓</span> {fact}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}