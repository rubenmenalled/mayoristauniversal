import { Metadata } from 'next'

interface Props {
  params: Promise<{ nombre: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nombre } = await params
  const nombreDecoded = decodeURIComponent(nombre)
  const nombreCapitalized = nombreDecoded.charAt(0).toUpperCase() + nombreDecoded.slice(1).toLowerCase()

  return {
    title: `${nombreCapitalized} al por mayor | Mayorista Universal Argentina`,
    description: `Comprá ${nombreCapitalized} al por mayor con los mejores precios mayoristas de Argentina. Envíos a todo el país.`,
    alternates: {
      canonical: `https://www.mayoristauniversal.com/categorias/${nombre}`,
    },
    openGraph: {
      title: `${nombreCapitalized} Mayorista | Mayorista Universal`,
      description: `Los mejores precios mayoristas en ${nombreCapitalized}. Compra directa al por mayor en Argentina.`,
      url: `https://www.mayoristauniversal.com/categorias/${nombre}`,
      type: 'website',
    },
  }
}

export default function CategoriaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
