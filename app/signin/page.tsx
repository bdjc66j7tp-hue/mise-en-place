'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function SignInForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const prefill = searchParams.get('email')
    if (prefill) setEmail(prefill)
  }, [searchParams])

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
    // If no error, browser is redirecting to Google — no need to reset loading
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setSending(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '14px', padding: '32px', border: '0.5px solid #C0DD97', maxWidth: '420px', width: '100%' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontStyle: 'italic', color: '#27500A', fontWeight: '400', marginBottom: '8px', textAlign: 'center' }}>
          Welcome to Mise en Place
        </h1>
        <p style={{ fontSize: '13px', color: '#639922', textAlign: 'center', marginBottom: '24px', lineHeight: '1.5' }}>
          Sign in to start saving recipes. No password needed.
        </p>

        {sent ? (
          <div style={{ background: '#EAF3DE', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontStyle: 'italic', color: '#3B6D11', marginBottom: '6px' }}>Check your email</div>
            <div style={{ fontSize: '12px', color: '#639922', lineHeight: '1.5' }}>We sent a sign-in link to <strong>{email}</strong>. Click it to sign in.</div>
          </div>
        ) : (
          <>
            {/* Google sign-in */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || sending}
              style={{
                width: '100%', background: 'white', color: '#27500A',
                border: '1px solid #C0DD97', borderRadius: '8px',
                padding: '12px', fontSize: '14px', fontWeight: '500',
                cursor: googleLoading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', marginBottom: '16px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: '#C0DD97' }} />
              <span style={{ fontSize: '11px', color: '#639922' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#C0DD97' }} />
            </div>

            {/* Magic link form */}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={sending || googleLoading}
                style={{ width: '100%', padding: '12px 14px', fontSize: '14px', border: '0.5px solid #C0DD97', borderRadius: '8px', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
              <button
                type="submit"
                disabled={sending || googleLoading || !email}
                style={{ width: '100%', background: '#3B6D11', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: sending ? 'wait' : 'pointer' }}
              >
                {sending ? 'Sending...' : 'Send sign-in link'}
              </button>
            </form>

            {error && <div style={{ fontSize: '12px', color: '#B33', marginTop: '12px', textAlign: 'center' }}>{error}</div>}
          </>
        )}
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#EAF3DE' }} />}>
      <SignInForm />
    </Suspense>
  )
}