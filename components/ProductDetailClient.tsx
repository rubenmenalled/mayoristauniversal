'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import { getPriceDisplay } from '@/lib/pricing'
import { productUrl } from '@/lib/slug'
import CartSidebar from '@/components/CartSidebar'

export interface ProductoDetalle {
  id: number; name: string; brand: string; category: string
  subcategory?: string; price: number; wholesalePrice: number; minOrder: number
  rating: number; reviews: number; image: string; images?: string[]
  badge?: string; discount?: number; location: string; descripcion?: string
}

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= Math.round(n) ? 'text-gold fill-gold' : 'text-gray-600'} />
      ))}
    </div>
  )
}

export default function ProductDetailClient({ product, relacionados }: { product: ProductoDetalle; relacionados: ProductoDetalle[] }) {
  const { addItem, count, cartOpen, setCartOpen } = useCart()
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])
  const pd = getPriceDisplay(product)
  const sku = product.location?.startsWith('SKU:') ? product.location.replace('SKU:', '').trim() : null

  function handleAdd() {
    addItem({
      id: product.id, name: product.name, brand: product.brand,
      price: product.price, wholesalePrice: product.wholesalePrice,
      image: product.image, minOrder: product.minOrder,
      category: product.category, subcategory: product.subcategory,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0B1E3F 0%, #13294f 100%)' }}>
      {/* Header */}
      <div style={{ background: 'rgba(13,71,161,0.95)', borderBottom: '1px solid rgba(255,106,61,0.2)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href={`/categorias/${encodeURIComponent(product.category)}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FF6A3D', fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
            <ArrowLeft size={16} /> {product.category}
          </Link>
          <div style={{ flex: 1 }} />
          <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF', padding: 4 }}>
            <ShoppingCart size={22} />
            {count > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#FF6A3D', color: '#FFFFFF', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{count}</span>}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 60px' }}>
        {/* Breadcrumb */}
        <nav style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 18, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Inicio</Link> /
          <Link href={`/categorias/${encodeURIComponent(product.category)}`} style={{ color: 'rgba(255,255,255,0.6)' }}>{product.category}</Link>
          {product.subcategory && <> / <span>{product.subcategory}</span></>}
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="pd-grid">
          <style dangerouslySetInnerHTML={{ __html: `
            @media (min-width: 800px) { .pd-grid { grid-template-columns: 460px 1fr !important; } }
          `}} />
          {/* Galería */}
          <div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#FFFFFF', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
              {images[imgIdx] ? (
                <Image src={images[imgIdx]} alt={product.name} fill style={{ objectFit: 'contain' }} sizes="(max-width: 800px) 100vw, 460px" quality={90} priority />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 64 }}>📦</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', position: 'relative', border: i === imgIdx ? '2px solid #FF6A3D' : '2px solid transparent', background: '#FFFFFF', cursor: 'pointer', padding: 0 }}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="60px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.brand && <div style={{ color: '#FF6A3D', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Marca: {product.brand}</div>}
            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 900, lineHeight: 1.25, marginBottom: 10 }}>{product.name}</h1>
            <Stars n={product.rating} />
            {sku && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,106,61,0.15)', border: '1px solid rgba(255,106,61,0.35)', borderRadius: 6, padding: '3px 10px', marginTop: 10 }}>
                <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 11 }}>SKU</span>
                <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 12 }}>{sku}</span>
              </div>
            )}

            <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 18 }}>
              {pd.isBulk ? (
                <>
                  {pd.precioUnit && <div style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 900 }}>{pd.precioUnit}</div>}
                  {pd.titulo && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em', marginTop: 2 }}>{pd.titulo}</div>}
                  <div style={{ color: '#FF6A3D', fontSize: 18, fontWeight: 900, marginTop: 8 }}>{pd.packLabel}: ${pd.packTotal?.toLocaleString('es-AR')}</div>
                  {pd.extraInfo && <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, lineHeight: 1.5, marginTop: 8 }}>{pd.extraInfo}</p>}
                </>
              ) : (
                <>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{pd.simpleLabel}</div>
                  <div style={{ color: '#FF6A3D', fontSize: 30, fontWeight: 900 }}>${pd.simplePrice.toLocaleString('es-AR')}</div>
                  {product.minOrder > 1 && <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>Pedido mínimo: {product.minOrder} unidades</div>}
                </>
              )}
            </div>

            {product.descripcion && !product.descripcion.startsWith('PRECIO POR') && (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5, lineHeight: 1.6, marginTop: 16 }}>{product.descripcion}</p>
            )}

            <button onClick={handleAdd}
              style={{ width: '100%', marginTop: 20, padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: added ? '#22C55E' : 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: added ? '#FFFFFF' : '#0D2C54', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
              <ShoppingCart size={18} /> {added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
            </button>

            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, marginTop: 14, lineHeight: 1.5 }}>
              Venta exclusivamente al por mayor · Envíos a todo el país · Atención personalizada por WhatsApp
            </p>
          </div>
        </div>

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h2 style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 900, marginBottom: 16 }}>Más de {product.subcategory || product.category}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {relacionados.map(r => (
                <Link key={r.id} href={productUrl(r.id, r.name)} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#FFFFFF', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <div style={{ position: 'relative', height: 130, background: '#F8F8F8' }}>
                      {r.image && <Image src={r.image} alt={r.name} fill style={{ objectFit: 'cover' }} sizes="150px" />}
                    </div>
                    <div style={{ padding: 8 }}>
                      <div style={{ color: '#111827', fontSize: 10.5, fontWeight: 700, lineHeight: 1.3, minHeight: 26, overflow: 'hidden' }}>{r.name}</div>
                      <div style={{ color: '#FF6A3D', fontSize: 13, fontWeight: 900, marginTop: 4 }}>${r.wholesalePrice.toLocaleString('es-AR')}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
