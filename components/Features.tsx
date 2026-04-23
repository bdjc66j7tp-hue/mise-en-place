export default function Features() {
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
          Everything a serious home cook needs — and nothing they don't.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { title: 'Import from anywhere', desc: 'Any website, TikTok, Instagram, handwritten card or photo. AI strips it to a clean recipe instantly.' },
            { title: 'Meal planning', desc: 'Drag your recipes onto a weekly calendar. Shopping list generated automatically from your plan.' },
            { title: 'Learn culinary techniques', desc: 'Every technique in every recipe is tappable. A full culinary education built into every recipe you import.' },
            { title: 'Community', desc: 'Follow great cooks. Save their recipes. Every cook has their colour — named after food.' },
            { title: 'Convert & scale', desc: 'Metric, imperial or US cups. Scale any recipe from 1 to 50 servings instantly.' },
            { title: 'Link a song', desc: 'Every recipe has a soundtrack. Link the song that reminds you of this dish.' },
          ].map((feat, i) => (
            <div key={i} style={{
              background: '#EAF3DE', borderRadius: '12px', padding: '16px 14px',
              border: '0.5px solid #C0DD97', cursor: 'pointer'
            }}>
              <div style={{
                width: '34px', height: '34px', background: '#3B6D11',
                borderRadius: '8px', marginBottom: '10px'
              }} />
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#27500A', marginBottom: '6px' }}>
                {feat.title}
              </div>
              <div style={{ fontSize: '12px', color: '#3B6D11', lineHeight: '1.6', opacity: 0.8 }}>
                {feat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}