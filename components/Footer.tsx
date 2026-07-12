import Link from 'next/link'
import LogoMark from '@/components/LogoMark'

export default function Footer() {
  return (
    <footer style={{ background: '#21201D', padding: '40px', fontFamily: 'var(--font-montserrat), Arial, sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <LogoMark size={26} mode="dark" />
              <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '15px', color: '#F3EDE4' }}>
                Mise en Place
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#C99A3D', marginBottom: '10px' }}>
              Everything in its place
            </div>
            <div style={{ fontSize: '11px', color: '#9A9488', lineHeight: '1.7' }}>
              Every recipe has a story.<br/>
              Every technique has a purpose.
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#9A9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: '500' }}>
              Explore
            </div>
            {[
              { label: 'Recipes', href: '/recipes' },
              { label: 'Techniques', href: '/techniques' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ display: 'block', fontSize: '12px', color: '#C9C4B8', marginBottom: '6px', textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#9A9488', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: '500' }}>
              Get started
            </div>
            {[
              { label: 'Import a recipe', href: '/import' },
              { label: 'Sign in', href: '/signin' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ display: 'block', fontSize: '12px', color: '#C9C4B8', marginBottom: '6px', textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '0.5px solid #3A3833', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: '#7A7468' }}>
            © 2026 Mise en Place. Built in Vancouver, Canada.
          </div>
          <div style={{ fontSize: '11px', color: '#7A7468' }}>
            Free during beta
          </div>
        </div>
      </div>
    </footer>
  )
}
