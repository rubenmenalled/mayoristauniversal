import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo Mayorista | Todas las Categorías | Mayorista Universal',
  description: 'Explorá todo el catálogo mayorista: indumentaria, bazar, hogar, juguetes, electrónica, belleza y más de 20 rubros. Los mejores precios al por mayor en Argentina.',
  alternates: {
    canonical: 'https://www.mayoristauniversal.com/catalogo',
  },
  openGraph: {
    title: 'Catálogo Mayorista | Mayorista Universal Argentina',
    description: 'Más de 20 categorías mayoristas. Comprá al por mayor con los mejores precios de Argentina.',
    url: 'https://www.mayoristauniversal.com/catalogo',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
