import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'
import { getAdminClient } from '@/lib/supabase'
import { parseProductId, productUrl } from '@/lib/slug'
import ProductDetailClient, { ProductoDetalle } from '@/components/ProductDetailClient'

export const revalidate = 3600

interface Props {
  params: Promise<{ id: string }>
}

const COLS = 'id,nombre,marca,categoria,subcategoria,precio,precio_mayorista,pedido_minimo,imagen,badge,descuento,ubicacion,descripcion'

function mapProducto(p: any): ProductoDetalle {
  const imgs = (p.imagen || '').split('|').map((s: string) => s.trim()).filter(Boolean)
  return {
    id: p.id,
    name: p.nombre,
    brand: p.marca,
    category: p.categoria,
    subcategory: p.subcategoria || undefined,
    price: p.precio,
    wholesalePrice: p.precio_mayorista,
    minOrder: p.pedido_minimo || 1,
    rating: 4.5,
    reviews: 12,
    image: imgs[0] || '',
    images: imgs,
    badge: p.badge || undefined,
    discount: p.descuento || 0,
    location: p.ubicacion || '',
    descripcion: p.descripcion || undefined,
  }
}

async function getProducto(id: number): Promise<ProductoDetalle | null> {
  const supabase = getAdminClient()
  const { data } = await supabase.from('productos').select(COLS).eq('id', id).maybeSingle()
  if (!data) return null
  if (data.badge === 'OCULTO') return null
  return mapProducto(data)
}

async function getRelacionados(categoria: string, subcategoria: string | undefined, excludeId: number): Promise<ProductoDetalle[]> {
  const supabase = getAdminClient()
  let query = supabase.from('productos').select(COLS)
    .eq('categoria', categoria)
    .neq('id', excludeId)
    .or('badge.is.null,badge.neq.OCULTO')
    .limit(6)
  if (subcategoria) query = query.eq('subcategoria', subcategoria)
  const { data } = await query
  return (data || []).map(mapProducto)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const productId = parseProductId(id)
  if (!productId) return {}
  const producto = await getProducto(productId)
  if (!producto) return {}

  const title = `${producto.name} | Mayorista Universal`
  const description = producto.descripcion
    ? `${producto.descripcion} Precio mayorista: $${producto.wholesalePrice.toLocaleString('es-AR')}. Envíos a todo el país.`
    : `Comprá ${producto.name} al por mayor. Precio mayorista: $${producto.wholesalePrice.toLocaleString('es-AR')}. Marca ${producto.brand}. Envíos a todo el país en 3 a 7 días hábiles.`
  const canonicalPath = productUrl(producto.id, producto.name)

  return {
    title,
    description,
    alternates: { canonical: `https://www.mayoristauniversal.com${canonicalPath}` },
    openGraph: {
      title,
      description,
      url: `https://www.mayoristauniversal.com${canonicalPath}`,
      type: 'website',
      siteName: 'Mayorista Universal',
      locale: 'es_AR',
      images: producto.image ? [{ url: producto.image }] : undefined,
    },
  }
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params
  const productId = parseProductId(id)
  if (!productId) notFound()

  const producto = await getProducto(productId)
  if (!producto) notFound()

  const relacionados = await getRelacionados(producto.category, producto.subcategory, producto.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.name,
    image: producto.images && producto.images.length > 0 ? producto.images : undefined,
    description: producto.descripcion || `${producto.name} al por mayor. Marca ${producto.brand}.`,
    sku: producto.location?.startsWith('SKU:') ? producto.location.replace('SKU:', '').trim() : String(producto.id),
    brand: { '@type': 'Brand', name: producto.brand || 'Mayorista Universal' },
    offers: {
      '@type': 'Offer',
      url: `https://www.mayoristauniversal.com${productUrl(producto.id, producto.name)}`,
      priceCurrency: 'ARS',
      price: producto.wholesalePrice,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Mayorista Universal' },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mayoristauniversal.com' },
      { '@type': 'ListItem', position: 2, name: producto.category, item: `https://www.mayoristauniversal.com/categorias/${encodeURIComponent(producto.category)}` },
      { '@type': 'ListItem', position: 3, name: producto.name, item: `https://www.mayoristauniversal.com${productUrl(producto.id, producto.name)}` },
    ],
  }

  return (
    <>
      <Script
        id={`jsonld-product-${producto.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      <Script
        id={`jsonld-breadcrumb-producto-${producto.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        strategy="beforeInteractive"
      />
      <ProductDetailClient product={producto} relacionados={relacionados} />
    </>
  )
}
