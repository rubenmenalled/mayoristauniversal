import { Metadata } from 'next'
import Script from 'next/script'

interface Props {
  params: Promise<{ nombre: string }>
}

async function getDescripcion(nombreDecoded: string): Promise<string | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/categorias?nombre=eq.${encodeURIComponent(nombreDecoded)}&select=descripcion`
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
      },
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    return data?.[0]?.descripcion || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nombre } = await params
  const nombreDecoded = decodeURIComponent(nombre)
  const nombreCapitalized = nombreDecoded.charAt(0).toUpperCase() + nombreDecoded.slice(1).toLowerCase()
  const descripcionReal = await getDescripcion(nombreDecoded)

  const description = descripcionReal
    ? `${descripcionReal} Envíos a todo el país en 3 a 7 días hábiles.`
    : `Comprá ${nombreCapitalized} al por mayor con los mejores precios mayoristas de Argentina. Amplio stock, envíos a todo el país en 3 a 7 días hábiles.`

  return {
    title: `${nombreCapitalized} al por mayor | Mayorista Universal Argentina`,
    description,
    alternates: {
      canonical: `https://www.mayoristauniversal.com/categorias/${nombre}`,
    },
    openGraph: {
      title: `${nombreCapitalized} Mayorista | Mayorista Universal`,
      description: descripcionReal || `Los mejores precios mayoristas en ${nombreCapitalized}. Compra directa al por mayor en Argentina.`,
      url: `https://www.mayoristauniversal.com/categorias/${nombre}`,
      type: 'website',
      siteName: 'Mayorista Universal',
      locale: 'es_AR',
    },
  }
}

export default async function CategoriaLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ nombre: string }>
}) {
  const { nombre } = await params
  const nombreDecoded = decodeURIComponent(nombre)
  const nombreCapitalized = nombreDecoded.charAt(0).toUpperCase() + nombreDecoded.slice(1).toLowerCase()

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://www.mayoristauniversal.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catálogo',
        item: 'https://www.mayoristauniversal.com/catalogo',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: nombreCapitalized,
        item: `https://www.mayoristauniversal.com/categorias/${nombre}`,
      },
    ],
  }

  return (
    <>
      <Script
        id={`jsonld-breadcrumb-${nombre}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  )
}
