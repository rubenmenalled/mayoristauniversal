import Header        from '@/components/Header'
import HeroSection   from '@/components/HeroSection'
import PromoBanner   from '@/components/PromoBanner'
import Categories    from '@/components/Categories'
import BenefitsBar   from '@/components/Benefits'
import Marketplace   from '@/components/Marketplace'
import Testimonials  from '@/components/Testimonials'
import Footer        from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getProductos, getCategorias } from '@/lib/data'

export const revalidate = 60 // Refresca datos cada 60 segundos

export default async function HomePage() {
  const [productos, categorias] = await Promise.all([getProductos(), getCategorias()])

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PromoBanner />
        <Categories categories={categorias} />
        <BenefitsBar />
        <Marketplace products={productos} />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
