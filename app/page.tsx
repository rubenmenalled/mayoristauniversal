import Header           from '@/components/Header'
import HeroSection      from '@/components/HeroSection'
import CatalogosSection from '@/components/CatalogosSection'
import ComoComprar      from '@/components/ComoComprar'
import MediosDePago    from '@/components/MediosDePago'
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
        <CatalogosSection categorias={categorias} />
        <ComoComprar />
        <MediosDePago />
        <Testimonios />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
