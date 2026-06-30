'use client'

import Hero from '@/components/ui/animated-shader-hero'

export default function HeroTestPage() {
  return (
    <Hero
      trustBadge={{
        text: 'Importadora directa · Precios mayoristas · Envíos a todo el país',
        icons: ['⚡'],
      }}
      headline={{
        line1: 'MAYORISTA',
        line2: 'UNIVERSAL',
      }}
      subtitle="Miles de productos al por mayor — peluches, juguetería, bazar, electrónica, perfumería y mucho más. Comprá desde donde estés, 24/7."
      buttons={{
        primary: {
          text: 'Ver catálogo',
          onClick: () => { window.location.href = '/catalogo' },
        },
        secondary: {
          text: 'Hablar por WhatsApp',
          onClick: () => { window.location.href = 'https://wa.me/5491138385284' },
        },
      }}
    />
  )
}
