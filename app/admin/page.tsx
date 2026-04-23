'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface WaitlistEntry {
  id: number
  email: string
  created_at: string
}

export default function AdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === 'mise1967') {
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    if (!authenticated) return
    async function fetchWaitlist() {
      const { data } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setEntries(data)
      setLoading(false)
    }
    fetchWaitlist()
  }, [authenticated])

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#27500A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#3B6D11', borderRadius: '16px', padding: '40px', width: '320px', border: '0.5px solid #639922', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontStyle: 'italic', color: '#C0DD97', marginBottom: '6px' }}>
            Mise en Place
          </div>
          <div style={{ fontSize: '11px', color: '#639922', marginBottom: '28px' }}>
            Admin access only
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: error ? '1px solid #C0392B' : '0.5px solid #639922',
                background: '#27500A', color: 'white', fontSize: '14px',
                outline: 'none', marginBottom: '10px'
              }}
            />
            {error && (
              <div style={{ fontSize: '12px', color: '#E74C3C', marginBottom: '10px' }}>
                Incorrect password
              </div>
            )}
            <button type="submit" style={{
              width: '100%', background: '#EAF3DE', color: '#27500A',
              border: 'none', borderRadius: '10px', padding: '12px',
              fontSize: '14px', fontWeight: '500', cursor: 'pointer'
            }}>
              Sign in
            </button>
          </form>
          <div style={{ fontSize: '11px', color: '#639922', marginTop: '20px', fontStyle: 'italic' }}>
            Priced with purpose — misoenplace.app
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#27500A', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '40px', background: '#3B6D11', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 18 18" fill="none" width="20" height="20">
              <path d="M2 14C2 9 4 5 9 3.5C14 5 16 9 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5.5 14C5.5 11 6.8 9 9 8C11.2 9 12.5 11 12.5 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="14" x2="16" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="11" r="1.3" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontStyle: 'italic', color: '#C0DD97' }}>
              Mise en Place
            </div>
            <div style={{ fontSize: '11px', color: '#639922' }}>Admin Dashboard</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#3B6D11', borderRadius: '12px', padding: '20px', border: '0.5px solid #639922' }}>
            <div style={{ fontSize: '11px', color: '#97C459', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total signups</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#EAF3DE', fontWeight: '400' }}>
              {loading ? '...' : entries.length}
            </div>
          </div>
          <div style={{ background: '#3B6D11', borderRadius: '12px', padding: '20px', border: '0.5px solid #639922' }}>
            <div style={{ fontSize: '11px', color: '#97C459', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Latest signup</div>
            <div style={{ fontSize: '13px', color: '#EAF3DE', marginTop: '8px' }}>
              {loading ? '...' : entries.length > 0 ? new Date(entries[0].created_at).toLocaleDateString() : 'None yet'}
            </div>
          </div>
          <div style={{ background: '#3B6D11', borderRadius: '12px', padding: '20px', border: '0.5px solid #639922' }}>
            <div style={{ fontSize: '11px', color: '#97C459', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</div>
            <div style={{ fontSize: '13px', color: '#97C459', marginTop: '8px', fontStyle: 'italic' }}>
              🌿 Waitlist open
            </div>
          </div>
        </div>

        <div style={{ background: '#3B6D11', borderRadius: '12px', border: '0.5px solid #639922', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #27500A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontStyle: 'italic', color: '#C0DD97' }}>
              Waitlist signups
            </div>
            <div style={{ fontSize: '11px', color: '#639922' }}>Most recent first</div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#97C459', fontStyle: 'italic' }}>Loading...</div>
          ) : entries.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#97C459', fontStyle: 'italic' }}>No signups yet — share misoenplace.app!</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#27500A' }}>
                  <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: '10px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500' }}>#</th>
                  <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: '10px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500' }}>Email</th>
                  <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: '10px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500' }}>Date</th>
                  <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: '10px', color: '#639922', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={entry.id} style={{ borderTop: '0.5px solid #27500A' }}>
                    <td style={{ padding: '12px 20px', fontSize: '12px', color: '#639922' }}>{entries.length - i}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', color: '#EAF3DE' }}>{entry.email}</td>
                    <td style={{ padding: '12px 20px', fontSize: '12px', color: '#97C459' }}>{new Date(entry.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 20px', fontSize: '12px', color: '#97C459' }}>{new Date(entry.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#639922', fontStyle: 'italic' }}>
          Mise en Place · Priced with purpose · misoenplace.app
        </div>
      </div>
    </div>
  )
}
