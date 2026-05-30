import { useEffect, useState } from 'react'
import { ReactLenis } from '@studio-freight/react-lenis'
import BackgroundFX from './components/BackgroundFX'
import Header from './components/Header'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import UploadSection from './components/UploadSection'
import Features from './components/Features'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import ThemePicker from './components/ThemePicker'
import { checkHealth } from './lib/api'

export default function App() {
  const [healthy, setHealthy] = useState(false)

  useEffect(() => {
    let mounted = true
    const tick = async () => {
      const ok = await checkHealth()
      if (mounted) setHealthy(ok)
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <BackgroundFX />
      <Header healthy={healthy} />
      <main className="relative">
        <Hero />
        <Marquee />
        <UploadSection />
        <Features />
        <FAQ />
      </main>
      <Footer />
      <ThemePicker />
    </ReactLenis>
  )
}
