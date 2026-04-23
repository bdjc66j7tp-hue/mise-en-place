'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Hero() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('waitlist').insert([{ email }])
    if (!error) {
      setSubmitted(true)
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <section style={{
      background: '#27500A',
      padding: '72px 40px 64px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#3B6D11', borderRadius: '20px', padding: '5px 14px',
          marginBottom: '22px', border: '0.5px solid #639922'
        }}>
          <span style={{ fontSize: '11px', color: '#C0DD97', fontWeight: '500' }}>
            Now available on iOS & Android
          </span>
        </div>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: '52px', fontStyle: 'italic',
          color: 'white', lineHeight: '1.15', fontWeight: '400', margin: '0 0 12px 0'
        }}>
          Everything<br/>in its <em style={{ color: '#97C459' }}>place</em>
        </h1>
        <p style={{
          fontFamily: 'Georgia, serif', fontSize: '13px', color: '#97C459',
          fontStyle: 'italic', lineHeight: '1.8', margin: '0 0 14px 0'
        }}>
          Import Recipes From Anywhere · Meal Planning · Shopping Lists · Conversions & Scaling · Learn
        </p>
        <p style={{
          fontSize: '14px', color: '#9FE1CB', lineHeight: '1.7',
          maxWidth: '420px', margin: '0 auto 28px auto'
        }}>
          The recipe app that imports from any website, teaches you culinary technique, and grows smarter with every cook who uses it.
        </p>

        {submitted ? (
          <div style={{
            background: '#3B6D11', borderRadius: '12px', padding: '20px',
            marginBottom: '20px', border: '0.5px solid #639922'
          }}>
            <div style={{ fontSize: '16px', color: '#C0DD97', fontFamily: 'Georgia, serif', fontStyle: 'italic', marginBottom: '4px' }}>
              You're on the list! 🌿
            </div>
            <div style={{ fontSize: '13px', color: '#97C459' }}>
              We'll be in touch when Mise en Place is ready.
            </div>
          </div>
        ) : (
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
                borderRadius: '12px', border: '0.5px solid #639922',
                background: '#3B6D11', color: 'white', fontSize: '14px',
                outline: 'none'
              }}
            />
            <button type="submit" disabled={loading} style={{
              background: '#EAF3DE', color: '#27500A', border: 'none',
              borderRadius: '12px', padding: '13px 24px', fontSize: '14px',
              fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap'
            }}>
              {loading ? 'Joining...' : 'Join the waitlist'}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{
            background: '#3B6D11', color: '#C0DD97', borderRadius: '8px',
            padding: '7px 14px', fontSize: '11px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            border: '0.5px solid #639922'
          }}>
            App Store
          </div>
          <div style={{
            background: '#3B6D11', color: '#C0DD97', borderRadius: '8px',
            padding: '7px 14px', fontSize: '11px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            border: '0.5px solid #639922'
          }}>
            Google Play
          </div>
        </div>
        <p style={{ fontSize: '11px', color: '#639922', fontStyle: 'italic' }}>
          Free to download · 5 recipe imports per day · Pro from $2.67/month
        </p>
      </div>
    </section>
  )
}