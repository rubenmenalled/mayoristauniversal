'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import CartSidebar from '@/components/CartSidebar'

interface Producto {
  id: number; name: string; brand: string; category: string
  subcategory?: string; price: number; wholesalePrice: number; minOrder: number
  rating: number; reviews: number; image: string; images?: string[]
  badge?: string; discount?: number; location: string
}

interface Subcategoria {
  id: number; nombre: string; emoji: string; categoria_id: number
}

const BADGE: Record<string, string> = {
  OFERTA: 'bg-red-600', NUEVO: 'bg-green-600', HOT: 'bg-orange-500', TOP: 'bg-yellow-500',
}

const EXCL_MARR = ['MOCHILAS-CARTERAS','MOCHILAS Y CARTERAS','MOCHILAS','BANDOLERAS','BOLSOS MATERNALES','CARTERAS']

function getBulkInfo(category: string, subcategory: string, minOrder: number) {
  const cat = (category || '').toUpperCase()
  const sub = (subcategory || '').toUpperCase()
  if (cat !== 'ACCESORIOS DE PELO' && cat !== 'MARROQUINERIA' && cat !== 'LIBRERIA' && cat !== 'BELLEZA' && cat !== 'INVIERNO 2026') return null
  if (cat === 'MARROQUINERIA' && EXCL_MARR.includes(sub)) return { badge: false, sku: true, label: 'Mayorista:', badgeText: '' }
  if (cat === 'LIBRERIA' || cat === 'ACCESORIOS DE PELO' || cat === 'BELLEZA' || cat === 'INVIERNO 2026') {
    const badgeText = minOrder >= 20
      ? `📦 PRECIO POR CAJA (x${minOrder}) DE COLORES SURTIDOS`
      : `📦 PRECIO POR PAQUETE (x${minOrder}) DE COLORES SURTIDOS`
    const label = minOrder >= 20 ? `Precio x caja (x${minOrder}):` : 'Precio x docena:'
    return { badge: true, sku: true, label, badgeText }
  }
  return { badge: true, sku: true, label: 'Precio x docena:', badgeText: '📦 PRECIO POR DOCENA (x12) DE COLORES SURTIDOS' }
}

const BG_SUBS = [
  '#E8EAF6','#FCE4EC','#E8F5E9','#FFF8E1','#E3F2FD',
  '#F3E5F5','#E0F7FA','#FBE9E7','#EDE7F6','#E8F5E9',
  '#FFF3E0','#E1F5FE','#FCE4EC','#F1F8E9','#E8EAF6',
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= Math.round(n) ? 'text-gold fill-gold' : 'text-gray-600'} />
      ))}
    </div>
  )
}

export default function CategoriaPage() {
  const { nombre } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const nombreDecoded = decodeURIComponent(nombre as string)

  const { addItem, count, cartOpen, setCartOpen } = useCart()
  const [productos, setProductos] = useState<Producto[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])
  const [subActiva, setSubActiva] = useState<string>(
    searchParams.get('sub') ? decodeURIComponent(searchParams.get('sub')!) : ''
  )
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<Producto | null>(null)
  const [lightboxImgIdx, setLightboxImgIdx] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [dragStart, setDragStart] = useState<{x:number,y:number}|null>(null)
  const [offset, setOffset] = useState({x:0,y:0})
  const [dragging, setDragging] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  function normalizar(s: string) {
    return (s || '').toLowerCase().trim()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ')
  }

  useEffect(() => {
    // Cargar productos filtrados por categoría directamente
    fetch('/api/productos-publicos?categoria=' + encodeURIComponent(nombreDecoded))
      .then(r => r.json())
      .then((data: Producto[]) => {
        setProductos(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Cargar subcategorías
    fetch('/api/subcategorias?categoria=' + encodeURIComponent(nombreDecoded))
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSubcategorias(data) })
      .catch(() => {})
  }, [nombreDecoded])

  const productosFiltrados = subActiva === '' || subActiva === '__todos__'
    ? productos
    : productos.filter(p => {
        // 1) Filtrar por subcategory exacto si existe en el producto
        if (p.subcategory && p.subcategory.trim() !== '') {
          return p.subcategory.toLowerCase() === subActiva.toLowerCase()
        }
        // 2) Fallback: buscar la subcategoría como palabra en el nombre del producto
        const keyword = subActiva.toLowerCase().split(' ')[0]
        return p.name?.toLowerCase().includes(keyword)
      })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)', paddingTop: 38 }}>
      {/* Header — debajo del AnnouncementBar (38px fijo) */}
      <div style={{
        background: 'rgba(240,240,240,0.97)', borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '16px 24px', position: 'sticky', top: 38, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', fontWeight: 700, fontSize: 13 }}>
            <ArrowLeft size={16} /> Inicio
          </button>
          <div style={{ color: '#C01515', fontWeight: 900, fontSize: 20, flex: 1 }}>{nombreDecoded}</div>
          <a href="/catalogo" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
            color: '#FFFFFF', fontWeight: 900, fontSize: 12,
            padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
            whiteSpace: 'nowrap', letterSpacing: '0.04em',
          }}>
            📋 VER CATÁLOGO
          </a>
          <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#C01515', padding: 6 }}>
            <ShoppingCart size={24} />
            {count > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#D4AF37', color: '#FFFFFF', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{count}</span>}
          </button>
        </div>
      </div>

      {/* Subcategorías como tarjetas — solo si no hay ninguna activa */}
      {subcategorias.length > 0 && !subActiva && !loading && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ color: '#D4AF37', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
            Seleccioná una subcategoría
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {/* Tarjetas de subcategorías */}
            {subcategorias.map((sub, i) => {
              const cant = productos.filter(p => p.subcategory?.toLowerCase() === sub.nombre.toLowerCase()).length
              const primeraFoto = productos.find(
                p => p.subcategory?.toLowerCase() === sub.nombre.toLowerCase() && p.image
              )?.image
              const bg = BG_SUBS[i % BG_SUBS.length]
              return (
                <motion.div key={sub.id}
                  onClick={() => setSubActiva(sub.nombre)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ position: 'relative', height: 160, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: bg, transition: 'transform 0.2s ease', }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>

                  {primeraFoto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={primeraFoto} alt={sub.nombre} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'auto' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.72) 100%)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4, padding: 12 }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>{sub.nombre}</span>
                    {cant > 0 && <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700 }}>{cant} productos</span>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content — productos */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>

        {/* Botón volver a subcategorías */}
        {subActiva && subcategorias.length > 0 && (
          <button onClick={() => setSubActiva('')}
            style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: '8px 16px', color: '#D4AF37', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ← Volver a subcategorías
          </button>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: '#7a8a9a', padding: 80, fontSize: 16 }}>Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 20 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
            <div style={{ color: '#C01515', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>
              {subActiva ? `No hay productos en ${subActiva}` : `No hay productos en ${nombreDecoded} todavía`}
            </div>
            {subActiva && (
              <button onClick={() => setSubActiva('')}
                style={{ marginTop: 16, background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 10, padding: '10px 24px', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer' }}>
                Ver todos
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ color: '#CBD5E1', fontSize: 13, marginBottom: 24 }}>
              {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} en{' '}
              <span style={{ color: '#D4AF37', fontWeight: 700 }}>{subActiva || nombreDecoded}</span>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `.prod-card { transition: transform 0.2s ease, box-shadow 0.2s ease; } @media (hover: hover) { .prod-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(212,175,55,0.2); } }` }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {productosFiltrados.map((p, i) => (
                <motion.div key={p.id}
                  className="prod-card glass-card rounded-xl overflow-hidden relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}>

                  <div style={{ position: 'relative', height: 220, background: '#F0F0F0', overflow: 'hidden', cursor: p.image ? 'zoom-in' : 'default' }}
                    onClick={() => { if (p.image) { setLightbox(p); setLightboxImgIdx(0) } }}>
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-contain" sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px" quality={95} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>📦</div>
                    )}
                    {p.image && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '2px 5px', fontSize: 10, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 3 }}>
                        🔍{p.images && p.images.length > 1 && <span style={{ fontSize: 9, color: '#D4AF37', fontWeight: 700 }}>{p.images.length}📷</span>}
                      </div>
                    )}
                    {(p.discount ?? 0) > 0 && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#dc2626', color: '#FFFFFF', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 99 }}>-{p.discount}%</span>
                    )}
                    {p.badge && (
                      <span className={`absolute top-2 right-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full ${BADGE[p.badge] ?? 'bg-gray-600'}`}>{p.badge}</span>
                    )}
                  </div>
                  <div style={{ padding: 8 }}>
                    {p.brand && <div style={{ color: '#CBD5E1', fontSize: 9, fontWeight: 600, marginBottom: 1 }}>Marca: {p.brand}</div>}
                    <h3 style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, minHeight: 28 }}>{p.name}</h3>
                    <Stars n={p.rating} />
                    {(() => {
                      const bi = getBulkInfo(p.category ?? '', p.subcategory ?? '', p.minOrder)
                      if (!bi) return null
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4, marginBottom: 2 }}>
                          {bi.badge && (
                            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', borderRadius: 6, padding: '3px 7px' }}>
                              <span style={{ color: '#FFFFFF', fontSize: 9, fontWeight: 900, letterSpacing: '0.05em' }}>{bi.badgeText}</span>
                            </div>
                          )}
                          {bi.sku && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 5, padding: '2px 6px' }}>
                              <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 9 }}>SKU</span>
                              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 10 }}>
                                {p.location?.startsWith('SKU:') ? p.location.replace('SKU:', '').trim() : 'Sin código'}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                    <div style={{ marginTop: 6 }}>
                      <div style={{ color: '#CBD5E1', fontSize: 10, marginTop: 2 }}>
                        {getBulkInfo(p.category ?? '', p.subcategory ?? '', p.minOrder)?.label ?? 'Mayorista:'} <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 14 }}>${p.wholesalePrice.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                    <button
                      style={{ width: '100%', marginTop: 10, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, WebkitTapHighlightColor: 'transparent' }}
                      onClick={() => addItem({ id: p.id, name: p.name, price: p.price, wholesalePrice: p.wholesalePrice, image: p.image, minOrder: p.minOrder, category: p.category })}>
                      <ShoppingCart size={11} /> AGREGAR
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Lightbox */}
      {lightbox && (() => {
        const lista = productosFiltrados.filter(p => p.image)
        const idx = lista.findIndex(p => p.id === lightbox.id)
        const prev = lista[idx - 1] ?? null
        const next = lista[idx + 1] ?? null
        const lbImages = lightbox.images && lightbox.images.length > 1 ? lightbox.images : [lightbox.image]
        const activeSrc = lbImages[lightboxImgIdx] || lightbox.image
        return (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { if (zoom) { setZoom(false); setOffset({x:0,y:0}) } else setLightbox(null) }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: zoom ? 0 : 16, cursor: zoom ? 'zoom-out' : 'default' }}>
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: zoom ? '100%' : 500, maxHeight: zoom ? '100vh' : 'calc(100vh - 40px)', background: '#0a1628', borderRadius: zoom ? 0 : 20, overflow: zoom ? 'hidden' : 'auto', border: zoom ? 'none' : '1px solid rgba(212,175,55,0.3)', transition: 'all 0.25s ease' }}>
              {/* Foto grande */}
              <div
                ref={imgRef}
                style={{ position: 'relative', width: '100%', height: zoom ? '100vh' : 'min(280px, 42vh)', background: lightbox.category?.toUpperCase() === 'ACCESORIOS DE PELO' ? '#FFFFFF' : '#111', overflow: 'hidden', cursor: zoom ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
                onClick={e => { e.stopPropagation(); if (!dragging) { setZoom(z => !z); setOffset({x:0,y:0}) } }}
                onMouseDown={e => { if (zoom) { setDragStart({x: e.clientX - offset.x, y: e.clientY - offset.y}); setDragging(false) } }}
                onMouseMove={e => { if (zoom && dragStart) { setDragging(true); setOffset({x: e.clientX - dragStart.x, y: e.clientY - dragStart.y}) } }}
                onMouseUp={() => { setTimeout(() => setDragging(false), 50); setDragStart(null) }}
                onMouseLeave={() => { setDragStart(null) }}
                onTouchStart={e => { if (zoom) setDragStart({x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y}) }}
                onTouchMove={e => { if (zoom && dragStart) { setDragging(true); setOffset({x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y}) } }}
                onTouchEnd={() => { setTimeout(() => setDragging(false), 50); setDragStart(null) }}
              >
                <div style={{ position: 'absolute', inset: 0, transform: zoom ? `scale(2.5) translate(${offset.x/2.5}px, ${offset.y/2.5}px)` : 'scale(1)', transition: dragStart ? 'none' : 'transform 0.3s ease', transformOrigin: 'center center' }}>
                  <Image src={activeSrc} alt={lightbox.name} fill style={{ objectFit: 'contain', padding: zoom ? 0 : 16 }} sizes="(max-width: 768px) 95vw, 800px" quality={95} />
                </div>

                {/* Hint zoom */}
                {!zoom && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '3px 10px', color: 'rgba(255,255,255,0.7)', fontSize: 11, pointerEvents: 'none' }}>
                    🔍 Toca para zoom
                  </div>
                )}

                {/* Flecha izquierda (producto anterior) */}
                {prev && !zoom && (
                  <button onClick={e => { e.stopPropagation(); setLightbox(prev); setLightboxImgIdx(0); setZoom(false); setOffset({x:0,y:0}) }}
                    style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}>
                    <ChevronLeft size={22} color="#fff" />
                  </button>
                )}

                {/* Flecha derecha (producto siguiente) */}
                {next && !zoom && (
                  <button onClick={e => { e.stopPropagation(); setLightbox(next); setLightboxImgIdx(0); setZoom(false); setOffset({x:0,y:0}) }}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}>
                    <ChevronRight size={22} color="#fff" />
                  </button>
                )}

                {/* Contador / cerrar zoom */}
                {zoom ? (
                  <button onClick={e => { e.stopPropagation(); setZoom(false); setOffset({x:0,y:0}) }}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '4px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', zIndex: 20 }}>
                    ✕ Cerrar zoom
                  </button>
                ) : (
                  <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '3px 10px', color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                    {idx + 1} / {lista.length}
                  </div>
                )}
              </div>

              {/* Thumbnails — solo cuando hay más de 1 imagen */}
              {lbImages.length > 1 && !zoom && (
                <div style={{ display: 'flex', gap: 8, padding: '10px 16px 0', justifyContent: 'center' }}>
                  {lbImages.map((src, i) => (
                    <button key={i} onClick={() => { setLightboxImgIdx(i); setZoom(false); setOffset({x:0,y:0}) }}
                      style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', border: i === lightboxImgIdx ? '2px solid #D4AF37' : '2px solid rgba(255,255,255,0.15)', padding: 0, cursor: 'pointer', background: '#111', flexShrink: 0, transition: 'border-color 0.2s' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`foto ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Info */}
              {!zoom && <div style={{ padding: '16px 20px 20px' }}>
                <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15, marginBottom: 10 }}>{lightbox.name}</div>
                {(() => {
                  const lbi = getBulkInfo(lightbox.category ?? '', lightbox.subcategory ?? '', lightbox.minOrder)
                  if (!lbi) return <div style={{ marginBottom: 12 }} />
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                      {lbi.badge && (
                        <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', borderRadius: 8, padding: '6px 12px' }}>
                          <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 900, letterSpacing: '0.05em' }}>{lbi.badgeText}</span>
                        </div>
                      )}
                      {lbi.sku && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 8, padding: '6px 12px' }}>
                          <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 13, letterSpacing: '0.05em' }}>SKU</span>
                          <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>
                            {lightbox.location?.startsWith('SKU:') ? lightbox.location.replace('SKU:', '').trim() : 'Sin código'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })()}
                <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>
                  ${lightbox.wholesalePrice.toLocaleString('es-AR')}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setLightbox(null)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px', color: '#ccc', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                    Cerrar
                  </button>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => { addItem({ id: lightbox.id, name: lightbox.name, price: lightbox.price, wholesalePrice: lightbox.wholesalePrice, image: lightbox.image, minOrder: lightbox.minOrder, category: lightbox.category }); setLightbox(null) }}
                    style={{ flex: 2, background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 10, padding: '10px', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ShoppingCart size={14} /> AGREGAR AL CARRITO
                  </motion.button>
                </div>
              </div>}
            </div>
            {!zoom && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 16 }}>Tocá afuera para cerrar</div>}
          </motion.div>
        )
      })()}
    </div>
  )
}
