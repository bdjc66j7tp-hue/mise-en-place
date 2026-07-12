'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BrandLockup from '@/components/BrandLockup'

export default function Hero() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    router.push(`/signin?email=${encodeURIComponent(email)}`)
  }

  return (
    <section style={{
      background: '#F3EDE4',
      padding: '72px 40px 64px',
      textAlign: 'center',
      fontFamily: 'var(--font-montserrat), Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        {/* Extracted into BrandLockup — the reusable, calibrated logo+title+divider+tagline
            unit. scale=1.05 is a deliberate test of that reusability: every hand-tuned
            pixel value inside it scales together, so bumping it 5% here should hold all
            the same alignment without re-doing any of that work. */}
        <BrandLockup scale={1.05} />
        <p style={{
          fontSize: '14px', color: '#5A564D', lineHeight: '1.7',
          maxWidth: '480px', margin: '20px auto 28px auto'
        }}>
          The recipe app that imports from any website, teaches you culinary technique, and grows smarter with every cook who uses it.
        </p>

        <form onSubmit={handleSubmit} style={{
          display: 'flex', gap: '8px', maxWidth: '420px',
          margin: '0 auto 20px auto', flexWrap: 'wrap', justifyContent: 'center'
        }}>
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: '1', minWidth: '200px', padding: '13px 16px',
              borderRadius: '12px', border: '0.5px solid #D6C9AF',
              background: 'white', color: '#21201D', fontSize: '14px',
              outline: 'none', fontFamily: 'inherit'
            }}
          />
          <button type="submit" style={{
            background: '#5C6B47', color: '#F3EDE4', border: 'none',
            borderRadius: '12px', padding: '13px 24px', fontSize: '14px',
            fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit'
          }}>
            Get cooking
          </button>
        </form>

      <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#E4DACB', borderRadius: '20px', padding: '5px 14px',
          marginBottom: '12px', border: '0.5px solid #D6C9AF'
        }}>
          <span style={{ fontSize: '11px', color: '#5C6B47', fontWeight: '500' }}>
            Coming soon to iOS & Android
          </span>
        </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{
            background: '#E4DACB', color: '#5C6B47', borderRadius: '8px',
            padding: '7px 14px', fontSize: '11px', opacity: 0.8,
            display: 'flex', alignItems: 'center', gap: '6px',
            border: '0.5px solid #D6C9AF'
          }}>
            App Store <span style={{ fontSize: '9px', opacity: 0.8 }}>· Soon</span>
          </div>
          <div style={{
            background: '#E4DACB', color: '#5C6B47', borderRadius: '8px',
            padding: '7px 14px', fontSize: '11px', opacity: 0.8,
            display: 'flex', alignItems: 'center', gap: '6px',
            border: '0.5px solid #D6C9AF'
          }}>
            Google Play <span style={{ fontSize: '9px', opacity: 0.8 }}>· Soon</span>
          </div>
        </div>
        <p style={{ fontSize: '11px', color: '#C99A3D' }}>
          Free during beta
        </p>
      </div>
    </section>
  )
}
