import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Showcase from '@/components/Showcase'
import Education from '@/components/Education'
import Pricing from '@/components/Pricing'
import Colours from '@/components/Colours'
import Story from '@/components/Story'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <Education />
      <Pricing />
      <Colours />
      <Story />
      <Footer />
    </main>
  )
}