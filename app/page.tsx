import Header           from '@/components/Header'
import HeroSection      from '@/components/HeroSection'
import StatsSection     from '@/components/StatsSection'
import CatalogosSection from '@/components/CatalogosSection'
import ComoComprar      from '@/components/ComoComprar'
import Testimonios      from '@/components/Testimonios'
import FAQ              from '@/components/FAQ'
import Footer           from '@/components/Footer'
import WhatsAppButton   from '@/components/WhatsAppButton'
import { getCategorias } from '@/lib/data'

export const revalidate = 0

export default async function HomePage() {
  const categorias = await getCategorias()

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <CatalogosSection categorias={categorias} />
        <ComoComprar />
        <Testimonios />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
