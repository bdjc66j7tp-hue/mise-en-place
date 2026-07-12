export default function HowItWorks() {
  return (
    <section style={{ background: '#EAF3DE', padding: '60px 40px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', textAlign: 'center', marginBottom: '8px' }}>
          How it works
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#3B6D11', textAlign: 'center', fontWeight: '400', marginBottom: '32px' }}>
          From any source to your collection in seconds
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { num: '1', title: 'Find a recipe anywhere', desc: 'A food blog, your grandmother\'s handwritten card, a cookbook page. Anywhere at all.' },
            { num: '2', title: 'Paste, type or scan', desc: 'Drop the link in, paste the text, or photograph the card. AI reads it and cleans it into a proper recipe automatically.' },
            { num: '3', title: 'Clean recipe card, instantly', desc: 'Your language. Your measurements. Source always credited. Ready to cook from immediately.' },
            { num: '4', title: 'It joins the community library', desc: 'Every recipe you import enriches the shared library. Other cooks discover it. The whole platform improves with every scan.' },
          ].map((step, i) => (
            <div key={i}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px', height: '34px', background: '#3B6D11',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '13px', fontWeight: '500',
                  color: 'white', flexShrink: 0, marginTop: '1px'
                }}>
                  {step.num}
                </div>
                <div style={{ paddingBottom: '18px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#27500A', marginBottom: '3px' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#3B6D11', lineHeight: '1.6', opacity: 0.85 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
              {i < 3 && (
                <div style={{ width: '1px', height: '18px', background: '#C0DD97', marginLeft: '16px' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}