import Header        from '@/components/Header'
import HeroSection   from '@/components/HeroSection'
import PromoBanner   from '@/components/PromoBanner'
import Categories    from '@/components/Categories'
import BenefitsBar   from '@/components/Benefits'
import Marketplace   from '@/components/Marketplace'
import Suppliers     from '@/components/Suppliers'
import Testimonials  from '@/components/Testimonials'
import Footer        from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PromoBanner />
        <Categories />
        <BenefitsBar />
        <Marketplace />

        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
