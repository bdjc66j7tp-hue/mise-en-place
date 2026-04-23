export default function Showcase() {
  const recipes = [
    { title: 'Creamy Tuscan Chicken Pasta', meta: '30 min · Serves 4 · 2.4k saves', credit: 'budgetbytes.com', author: 'SM', colour: '#3B6D11', colourName: 'Forest', tag: 'Dairy-free', bg: '#EAF3DE' },
    { title: 'Classic French Omelette', meta: '10 min · Serves 1 · 1.8k saves', credit: 'seriouseats.com', author: 'JC', colour: '#C0392B', colourName: 'Tomato', tag: 'Vegetarian', bg: '#C0DD97' },
    { title: 'Braised Short Ribs', meta: '3 hrs · Serves 4 · 3.2k saves', credit: 'nytcooking.com', author: 'MK', colour: '#1A5276', colourName: 'Blueberry', tag: 'Gluten-free', bg: '#97C459' },
    { title: 'Saffron Risotto Milanese', meta: '45 min · Serves 2 · 892 saves', credit: 'greatitalianchefs.com', author: 'GC', colour: '#BA7517', colourName: 'Saffron', tag: 'Keto', bg: '#EAF3DE' },
  ]

  return (
    <section style={{ background: 'white', padding: '60px 40px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', textAlign: 'center', marginBottom: '8px' }}>
          From the community
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontStyle: 'italic', color: '#3B6D11', textAlign: 'center', fontWeight: '400', marginBottom: '6px' }}>
          What cooks are sharing today
        </h2>
        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', lineHeight: '1.7', marginBottom: '28px' }}>
          Every recipe credited to its creator, translated and ready to make your own.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {recipes.map((r, i) => (
            <div key={i} style={{ background: 'white', border: '0.5px solid #C0DD97', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ height: '82px', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '6px', right: '6px', fontSize: '9px', background: 'white', color: '#3B6D11', padding: '2px 7px', borderRadius: '20px', border: '0.5px solid #3B6D11' }}>
                  {r.tag}
                </span>
              </div>
              <div style={{ padding: '9px 11px' }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#27500A' }}>{r.title}</div>
                <div style={{ fontSize: '10px', color: '#639922', marginTop: '2px' }}>{r.meta}</div>
                <div style={{ fontSize: '10px', color: '#3B6D11', marginTop: '3px' }}>↗ {r.credit}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', paddingTop: '5px', borderTop: '0.5px solid #EAF3DE' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: r.colour, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: 'white', fontWeight: '500' }}>
                    {r.author}
                  </div>
                  <span style={{ fontSize: '10px', color: '#639922' }}>· {r.colourName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <button style={{ background: 'transparent', color: '#3B6D11', border: '1.5px solid #3B6D11', borderRadius: '12px', padding: '10px 22px', fontSize: '13px', cursor: 'pointer' }}>
            Browse all recipes ›
          </button>
        </div>
      </div>
    </section>
  )
}