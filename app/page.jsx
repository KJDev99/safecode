import AdvantagesHero from '@/components/home/advantages-hero'
import Hero from '@/components/home/hero'
import ServicesHero from '@/components/home/services-hero'
import System from '@/components/home/system'
import UserRole from '@/components/home/user-role'
import WorksHero from '@/components/home/works-hero'
import PartnersHero from '@/components/home/partners-hero'
import FinallySection from '@/components/home/finally-section'

export default function Home() {
  return (
    <>
      <Hero />
      <System />
      <ServicesHero />
      <WorksHero />
      <AdvantagesHero />
      <UserRole />
      <PartnersHero />
      <FinallySection />
    </>
  )
}
