export default function Footer() {
  return (
    <footer style={{ background: '#3B6D11', padding: '40px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '28px', height: '28px', background: '#27500A', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                  <path d="M1.5 11C1.5 7 3.5 4 7 3C10.5 4 12.5 7 12.5 11" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M4 11C4 8.5 5.2 7 7 6.5C8.8 7 10 8.5 10 11" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                  <line x1="1.5" y1="11" x2="12.5" y2="11" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="7" cy="9" r="1" fill="white"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontStyle: 'italic', color: '#EAF3DE' }}>
                Mise en Place
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#97C459', fontStyle: 'italic', marginBottom: '10px' }}>
              Everything in its place
            </div>
            <div style={{ fontSize: '11px', color: '#97C459', lineHeight: '1.7', fontStyle: 'italic' }}>
              Import Recipes From Anywhere<br/>
              Meal Planning · Shopping Lists<br/>
              Conversions & Scaling · Learn
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#97C459', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: '500' }}>
              Explore
            </div>
            {['Discover recipes', 'Culinary techniques', 'Community', 'User profiles', 'Trending today'].map((link, i) => (
              <div key={i} style={{ fontSize: '12px', color: '#C0DD97', marginBottom: '6px', cursor: 'pointer' }}>
                {link}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#97C459', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: '500' }}>
              Mise en Place
            </div>
            {['Our story', 'Pro — $2.67/month', 'Download iOS', 'Download Android', 'Privacy policy'].map((link, i) => (
              <div key={i} style={{ fontSize: '12px', color: '#C0DD97', marginBottom: '6px', cursor: 'pointer' }}>
                {link}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '0.5px solid #27500A', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: '#639922' }}>
            © 2026 Mise en Place. Built in Vancouver, Canada.
          </div>
          <div style={{ fontSize: '11px', color: '#639922', fontStyle: 'italic' }}>
            Priced with purpose — ask us why $2.67
          </div>
        </div>
      </div>
    </footer>
  )
}