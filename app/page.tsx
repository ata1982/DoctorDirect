import ModernHeader from '@/components/ModernHeader'
import ModernHero from '@/components/ModernHero'
import ModernFeatures from '@/components/ModernFeatures'
import ModernFooter from '@/components/ModernFooter'

export default function Home() {
  return (
    <main className="min-h-screen">
      <ModernHeader />
      <ModernHero />
      <ModernFeatures />
      <ModernFooter />
    </main>
  )
}