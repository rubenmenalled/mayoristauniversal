import Header           from '@/components/Header'
import HeroSection      from '@/components/HeroSection'
import CatalogosSection from '@/components/CatalogosSection'
import Footer           from '@/components/Footer'
import WhatsAppButton   from '@/components/WhatsAppButton'
import { getCategorias } from '@/lib/data'

export const revalidate = 0 // Siempre datos frescos

export default async function HomePage() {
  const categorias = await getCategorias()

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CatalogosSection categorias={categorias} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
