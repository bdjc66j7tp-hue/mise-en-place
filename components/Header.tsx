'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import LogoMark from '@/components/LogoMark'
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
<div style={{ background: '#5C6B47', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
<Link href="/" style={{ textDecoration: 'none' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
<LogoMark size={32} mode="dark" />
<div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '18px', color: '#F3EDE4' }}>Mise en Place</div>
</div>
</Link>
<div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontFamily: 'var(--font-montserrat), Arial, sans-serif' }}>
<Link href="/recipes" style={{ fontSize: '12px', color: '#C9C4B8', textDecoration: 'none' }}>Recipes</Link>
{/* Community nav link hidden until there's an actual community to show — page stays live at /community */}
<Link href="/techniques" style={{ fontSize: '12px', color: '#C9C4B8', textDecoration: 'none' }}>Techniques</Link>
{!loading && user && (
<>
<Link href={`/cook/${user.id}`} style={{ fontSize: '12px', color: '#C9C4B8', textDecoration: 'none' }}>My recipes</Link>
<Link href="/import" style={{ fontSize: '12px', color: '#C9C4B8', textDecoration: 'none' }}>Import</Link>
<Link href={`/cook/${user.id}`} style={{ fontSize: '12px', color: '#C99A3D', textDecoration: 'none' }}>
{user.display_name || 'My profile'}
</Link>
<button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#C9C4B8', fontSize: '12px', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
              Sign out
</button>
</>
        )}
{!loading && !user && (
<Link href="/signin" style={{ fontSize: '12px', color: '#C99A3D', textDecoration: 'none' }}>Sign in</Link>
        )}
</div>
</div>
  )
}