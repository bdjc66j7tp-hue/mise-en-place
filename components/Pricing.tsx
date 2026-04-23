export default function Pricing() {
  return (
    <section style={{ background: '#EAF3DE', padding: '60px 40px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', textAlign: 'center', marginBottom: '8px' }}>
          Simple, honest pricing
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#3B6D11', textAlign: 'center', fontWeight: '400', marginBottom: '6px' }}>
          Everything in its place — including the price
        </h2>
        <p style={{ fontSize: '14px', color: '#555', textAlign: 'center', lineHeight: '1.7', marginBottom: '28px' }}>
          Start free. Upgrade when you're ready. Cancel any time.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div style={{ background: 'white', border: '0.5px solid #C0DD97', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#27500A' }}>Free</div>
            <div style={{ fontSize: '28px', fontWeight: '500', color: '#3B6D11', margin: '5px 0 2px' }}>$0</div>
            <div style={{ fontSize: '11px', color: '#639922' }}>forever</div>
            <hr style={{ border: 'none', borderTop: '0.5px solid #EAF3DE', margin: '11px 0' }}/>
            {[
              '5 recipe imports per day',
              'Full community access',
              'Meal planner & shopping list',
              '3 colours — Forest, Tomato, Blueberry',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#27500A', marginBottom: '5px' }}>
                <span style={{ color: '#3B6D11' }}>✓</span> {f}
              </div>
            ))}
            {[
              'Culinary technique library',
              'Unlimited imports',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#97C459', marginBottom: '5px' }}>
                <span>✕</span> {f}
              </div>
            ))}
            <button style={{ marginTop: '14px', width: '100%', padding: '10px', borderRadius: '9px', fontSize: '12px', cursor: 'pointer', border: 'none', fontWeight: '500', background: '#EAF3DE', color: '#3B6D11' }}>
              Download free
            </button>
          </div>
          <div style={{ background: 'white', border: '2px solid #3B6D11', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '10px', background: '#3B6D11', color: 'white', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px' }}>Pro</div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#27500A' }}>Mise en Place Pro</div>
            <div style={{ fontSize: '28px', fontWeight: '500', color: '#3B6D11', margin: '5px 0 2px' }}>$2.67</div>
            <div style={{ fontSize: '11px', color: '#639922' }}>per month · or $19.67/year</div>
            <hr style={{ border: 'none', borderTop: '0.5px solid #EAF3DE', margin: '11px 0' }}/>
            {[
              'Unlimited recipe imports',
              'Everything in Free',
              'Full culinary technique library',
              'Full food colour palette',
              'Lemon · Aubergine · Saffron + more',
              'Ad free forever',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#27500A', marginBottom: '5px' }}>
                <span style={{ color: '#3B6D11' }}>✓</span> {f}
              </div>
            ))}
            <button style={{ marginTop: '14px', width: '100%', padding: '10px', borderRadius: '9px', fontSize: '12px', cursor: 'pointer', border: 'none', fontWeight: '500', background: '#3B6D11', color: 'white' }}>
              Go Pro
            </button>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#639922', fontStyle: 'italic', marginTop: '14px' }}>
          Priced with purpose — <span style={{ color: '#3B6D11', cursor: 'pointer', fontWeight: '500' }}>ask us why $2.67 ›</span>
        </p>
      </div>
    </section>
  )
}