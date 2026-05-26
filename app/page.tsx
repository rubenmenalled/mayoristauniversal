import Header           from '@/components/Header'
import HeroSection      from '@/components/HeroSection'
import CatalogosSection from '@/components/CatalogosSection'
import ComoComprar      from '@/components/ComoComprar'
import MediosDePago    from '@/components/MediosDePago'
import Testimonios      from '@/components/Testimonios'
import FAQ              from '@/components/FAQ'
import Footer           from '@/components/Footer'
import WhatsAppButton   from '@/components/WhatsAppButton'
import Script           from 'next/script'
import { getCategorias } from '@/lib/data'

export const revalidate = 0

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Hay un mínimo de compra?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sí, el monto mínimo de compra es de $150.000. Esto nos permite ofrecerte los mejores precios mayoristas.' },
    },
    {
      '@type': 'Question',
      name: '¿Cómo hago un pedido?',
      acceptedAnswer: { '@type': 'Answer', text: 'Explorás nuestros catálogos, elegís los productos y nos contactás por WhatsApp con el detalle. Te respondemos en el día con disponibilidad y precios.' },
    },
    {
      '@type': 'Question',
      name: '¿Envían a todo el país?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sí, trabajamos con múltiples transportes: Andreani, OCA, Correo Argentino, Labulle y bus de carga. El costo de envío va por cuenta del comprador.' },
    },
    {
      '@type': 'Question',
      name: '¿Cuáles son los medios de pago?',
      acceptedAnswer: { '@type': 'Answer', text: 'Aceptamos transferencia bancaria, Mercado Pago y efectivo para retiro en depósito.' },
    },
    {
      '@type': 'Question',
      name: '¿Los precios incluyen IVA?',
      acceptedAnswer: { '@type': 'Answer', text: 'Los precios son sin IVA. Al momento de facturar se agrega según tu condición impositiva (Responsable Inscripto o Consumidor Final).' },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tarda en llegar el pedido?',
      acceptedAnswer: { '@type': 'Answer', text: 'Una vez confirmado el pago, preparamos el pedido en 24/48hs hábiles. Los tiempos de entrega pueden demorar de 3 a 7 días hábiles según el transporte y destino.' },
    },
  ],
}

export default async function HomePage() {
  const categorias = await getCategorias()

  return (
    <>
      <Script
        id="jsonld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        strategy="beforeInteractive"
      />
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
