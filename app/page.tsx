import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Showcase from '@/components/Showcase'
import Education from '@/components/Education'
import Pricing from '@/components/Pricing'
import Colours from '@/components/Colours'
import Story from '@/components/Story'
import Footer from '@/components/Footer'
export const dynamic = 'force-dynamic'
export default async function Home() {
const cookieStore = await cookies()
const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
cookies: {
getAll() { return cookieStore.getAll() },
setAll() {
// no-op: this page only reads the session to decide whether
// to redirect. Writing cookies isn't allowed during a normal
// page render (only in a Server Action or Route Handler), and
// this page never needs to write any.
        }
      }
    }
  )
const { data: { user } } = await supabase.auth.getUser()
if (user) {
redirect('/recipes')
  }
return (
<main>
<Hero />
<Features />
{/* <HowItWorks /> */}
<Showcase />
<Education />
{/* <Pricing /> */}
{/* <Colours /> — moved to onboarding (Phase 3.2) */}
{/* <Story /> */}
<Footer />
</main>
  )
}