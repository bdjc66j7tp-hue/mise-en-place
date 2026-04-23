'use client'

import { useState } from 'react'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{ background: '#27500A', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '62px' }}>
        
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', background: '#3B6D11', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
              <path d="M2 14C2 9 4 5 9 3.5C14 5 16 9 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5.5 14C5.5 11 6.8 9 9 8C11.2 9 12.5 11 12.5 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="14" x2="16" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="11" r="1.3" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontStyle: 'italic', color: '#C0DD97', whiteSpace: 'nowrap' }}>
              Mise en Place
            </div>
            <div style={{ fontSize: '9px', color: '#639922', fontStyle: 'italic' }}>
              Everything in its place
            </div>
          </div>
        </div>

        {/* DESKTOP LINKS */}
        <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }} className="desktop-nav">
          <a href="#" style={{ fontSize: '13px', color: '#97C459', textDecoration: 'none' }}>Discover</a>
          <a href="#" style={{ fontSize: '13px', color: '#97C459', textDecoration: 'none' }}>Learn</a>
          <a href="#" style={{ fontSize: '13px', color: '#97C459', textDecoration: 'none' }}>Community</a>
          <a href="#" style={{ fontSize: '13px', color: '#97C459', textDecoration: 'none' }}>Pro</a>
        </div>

        {/* DESKTOP CTA */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} className="desktop-nav">
          <button style={{ fontSize: '12px', color: '#97C459', cursor: 'pointer', background: 'none', border: 'none' }}>
            Sign in
          </button>
          <button style={{ background: '#3B6D11', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer' }}>
            Download free
          </button>
        </div>

        {/* HAMBURGER — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'none' }}
        >
          <div style={{ width: '22px', height: '2px', background: '#97C459', marginBottom: '5px', borderRadius: '2px' }}></div>
          <div style={{ width: '22px', height: '2px', background: '#97C459', marginBottom: '5px', borderRadius: '2px' }}></div>
          <div style={{ width: '22px', height: '2px', background: '#97C459', borderRadius: '2px' }}></div>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{ background: '#3B6D11', padding: '16px 24px 24px', borderTop: '0.5px solid #27500A' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a href="#" style={{ fontSize: '15px', color: '#C0DD97', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Discover</a>
            <a href="#" style={{ fontSize: '15px', color: '#C0DD97', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Learn</a>
            <a href="#" style={{ fontSize: '15px', color: '#C0DD97', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Community</a>
            <a href="#" style={{ fontSize: '15px', color: '#C0DD97', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Pro</a>
            <hr style={{ border: 'none', borderTop: '0.5px solid #27500A' }}/>
            <button style={{ background: '#EAF3DE', color: '#27500A', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Download free
            </button>
          </div>
        </div>
      )}

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}