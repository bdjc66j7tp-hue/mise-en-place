export default function Colours() {
  const colours = [
    { name: 'Forest', hex: '#3B6D11' },
    { name: 'Tomato', hex: '#C0392B' },
    { name: 'Blueberry', hex: '#1A5276' },
    { name: 'Lemon', hex: '#D4AC0D' },
    { name: 'Aubergine', hex: '#6C3483' },
    { name: 'Clementine', hex: '#D35400' },
    { name: 'Chocolate', hex: '#4A2C0A' },
    { name: 'Rose', hex: '#943D6B' },
    { name: 'Avocado', hex: '#6B8F71' },
    { name: 'Saffron', hex: '#BA7517' },
    { name: 'Chilli', hex: '#A93226' },
    { name: 'Truffle', hex: '#1C2833' },
    { name: 'Oyster', hex: '#5D8A8A' },
  ]

  return (
    <section style={{ background: 'white', padding: '60px 40px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', marginBottom: '8px' }}>
          Make it yours
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#3B6D11', fontWeight: '400', marginBottom: '6px' }}>
          Your colour. Your identity. Your kitchen.
        </h2>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px auto' }}>
          Every cook on Mise en Place has a colour — named after food, worn like a chef's jacket. Pick yours during onboarding.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', margin: '24px 0 8px' }}>
          {colours.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.hex }} />
              <div style={{ fontSize: '10px', color: '#639922' }}>{c.name}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: '#97C459', fontStyle: 'italic', margin: '8px 0 20px' }}>
          Forest · Tomato · Blueberry free &nbsp;·&nbsp; Full palette with Pro
        </p>
        <button style={{
          background: '#3B6D11', color: 'white', border: 'none',
          borderRadius: '12px', padding: '13px 26px', fontSize: '14px',
          fontWeight: '500', cursor: 'pointer'
        }}>
          Download and choose your colour
        </button>
      </div>
    </section>
  )
}