'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

interface User {
  id: string
  email: string
  display_name: string | null
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', authUser.id)
          .single()
        setUser({ id: authUser.id, email: authUser.email!, display_name: profile?.display_name ?? null })
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ background: '#27500A', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: '#3B6D11', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
              <path d="M2 14C2 9 4 5 9 3.5C14 5 16 9 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5.5 14C5.5 11 6.8 9 9 8C11.2 9 12.5 11 12.5 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="14" x2="16" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="11" r="1.3" fill="white"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontStyle: 'italic', color: '#C0DD97' }}>Mise en Place</div>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <Link href="/recipes" style={{ fontSize: '12px', color: '#97C459', textDecoration: 'none' }}>Community recipes</Link>

        {!loading && user && (
          <>
            <Link href={`/cook/${user.id}`} style={{ fontSize: '12px', color: '#97C459', textDecoration: 'none' }}>My recipes</Link>
            <Link href="/import" style={{ fontSize: '12px', color: '#97C459', textDecoration: 'none' }}>Import</Link>
            <Link href={`/cook/${user.id}`} style={{ fontSize: '12px', color: '#C0DD97', textDecoration: 'none' }}>
              {user.display_name || 'My profile'}
            </Link>
            <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#97C459', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
              Sign out
            </button>
          </>
        )}
        {!loading && !user && (
          <Link href="/signin" style={{ fontSize: '12px', color: '#C0DD97', textDecoration: 'none' }}>Sign in</Link>
        )}
      </div>
    </div>
  )
}