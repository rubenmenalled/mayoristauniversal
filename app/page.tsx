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
import { categories as mockCategories, products as mockProducts } from '@/data/mockData'

export default async function HomePage() {
  const [dbProductos, dbCategorias] = await Promise.all([getProductos(), getCategorias()])

  const categorias = dbCategorias.length > 0 ? dbCategorias : mockCategories
  const productos  = dbProductos.length  > 0 ? dbProductos  : mockProducts

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
