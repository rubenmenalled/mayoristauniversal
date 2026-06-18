'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Star, ShoppingCart } from 'lucide-react'
import { useCart, RETAIL_MARKUP } from '@/lib/CartContext'
import CartSidebar from '@/components/CartSidebar'

interface Producto {
  id: number; name: string; brand: string; category: string; subcategory?: string
  price: number; wholesalePrice: number; minOrder: number
  rating: number; reviews: number; image: string; images?: string[]
  badge?: string; discount?: number; location: string; descripcion?: string
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= Math.round(n) ? 'text-gold fill-gold' : 'text-gray-600'} />
      ))}
    </div>
  )
}

// Quita diacríticos: á→a, é→e, ü→u, ñ→n, etc.
function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Genera variantes: original + sin acentos (para búsqueda robusta en la API)
function getVariants(term: string): string[] {
  const t = term.toLowerCase().trim()
  if (!t) return []
  const base = stripAccents(t)
  const variants = new Set<string>([t])
  if (base !== t) variants.add(base)
  return Array.from(variants)
}

function BuscarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem, count, cartOpen, setCartOpen, isWholesale } = useCart()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = useState(q)
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q.trim()) { setProductos([]); setLoading(false); return }
    setLoading(true)
    // Buscar todas las variantes en paralelo vía API (server-side, sin límite de 1000 filas)
    const variants = getVariants(q)
    Promise.all(
      variants.map(v =>
        fetch(`/api/productos-publicos?q=${encodeURIComponent(v)}`)
          .then(r => r.json())
          .catch(() => [] as Producto[])
      )
    ).then(results => {
      const seen = new Set<number>()
      const merged: Producto[] = []
      for (const arr of results) {
        if (!Array.isArray(arr)) continue
        for (const p of arr) {
          if (!seen.has(p.id)) { seen.add(p.id); merged.push(p) }
        }
      }
      setProductos(merged)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [q])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) window.location.href = `/buscar?q=${encodeURIComponent(query.trim())}`
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0B1E3F 0%, #13294f 100%)', paddingTop: 38 }}>
      {/* Header */}
      <div style={{
        background: 'rgba(13,71,161,0.95)', borderBottom: '1px solid rgba(245,197,24,0.2)',
        padding: '16px 24px', position: 'sticky', top: 38, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#F5C518', fontWeight: 700, fontSize: 13 }}>
            <ArrowLeft size={16} /> Inicio
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF', padding: 6 }}>
            <ShoppingCart size={24} />
            {count > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#F5C518', color: '#FFFFFF', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{count}</span>}
          </button>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(245,197,24,0.3)' }}>
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Buscar productos, categorías o marcas..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', outline: 'none', color: '#FFFFFF', padding: '10px 16px', fontSize: 14 }}
            />
            <button type="submit" style={{ background: 'linear-gradient(135deg,#F5C518,#FFE45C)', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
              <Search size={18} color="#FFFFFF" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      {/* Resultados */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#FFFFFF', padding: 80 }}>Buscando...</div>
        ) : (
          <>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 24 }}>
              {productos.length === 0
                ? `No se encontraron resultados para "${q}"`
                : <>{productos.length} resultado{productos.length !== 1 ? 's' : ''} para <span style={{ color: '#F5C518', fontWeight: 700 }}>"{q}"</span></>
              }
            </div>

            {productos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20 }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
                <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Sin resultados</div>
                <div style={{ color: '#7a8a9a', fontSize: 14 }}>Probá con otro término o explorá los catálogos</div>
                <button onClick={() => router.push('/catalogo')}
                  style={{ marginTop: 20, background: 'linear-gradient(135deg,#F5C518,#FFE45C)', border: 'none', borderRadius: 10, padding: '12px 28px', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer' }}>
                  Ver catálogos
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {productos.map((p, i) => (
                  <motion.div key={p.id}
                    className="rounded-xl overflow-hidden relative"
                    style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }} whileHover={{ y: -4 }}>
                    <div style={{ position: 'relative', height: 220, background: '#F8F8F8', overflow: 'hidden' }}>
                      {p.image ? (
                        <Image src={p.image} alt={p.name} fill className="object-contain" sizes="250px" quality={85} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>📦</div>
                      )}
                      {(p.discount ?? 0) > 0 && (
                        <span style={{ position: 'absolute', top: 8, left: 8, background: '#dc2626', color: '#FFFFFF', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 99 }}>-{p.discount}%</span>
                      )}
                    </div>
                    <div style={{ padding: 8 }}>
                      {p.brand && <div style={{ color: '#9CA3AF', fontSize: 9, fontWeight: 600, marginBottom: 1 }}>Marca: {p.brand}</div>}
                      {p.location && p.location !== 'Buenos Aires' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.35)', borderRadius: 5, padding: '2px 6px', marginBottom: 3, width: 'fit-content' }}>
                          <span style={{ color: '#F5C518', fontWeight: 900, fontSize: 9 }}>COD</span>
                          <span style={{ color: '#111827', fontWeight: 700, fontSize: 10 }}>{p.location.startsWith('SKU:') ? p.location.replace('SKU:', '').trim() : p.location}</span>
                        </div>
                      )}
                      <h3 style={{ color: '#111827', fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, minHeight: 28 }}>{p.name}</h3>
                      {(() => {
                        let titulo: string | null = null
                        let precioUnit: string | null = null
                        let extraInfo: string | null = null
                        if (p.descripcion?.startsWith('PRECIO POR')) {
                          const sepIdx = p.descripcion.indexOf(') | ')
                          const pricePart = sepIdx >= 0 ? p.descripcion.slice(0, sepIdx + 1) : p.descripcion
                          extraInfo = sepIdx >= 0 ? p.descripcion.slice(sepIdx + 4) : null
                          const match = pricePart.match(/^(PRECIO POR \d+ UNIDADES)\s*\((.+)\)$/)
                          titulo = match ? match[1] : pricePart
                          precioUnit = match ? `$${Math.round(p.wholesalePrice / Math.max(1, p.minOrder)).toLocaleString('es-AR')} c/u` : null
                        } else if (p.badge === 'x6 UNIDADES') {
                          titulo = 'PRECIO POR 6 UNIDADES'
                          precioUnit = `$${Math.round(p.wholesalePrice / 6).toLocaleString('es-AR')} c/u`
                        } else if (p.minOrder > 1) {
                          const esDocena = (p.subcategory ?? '').toUpperCase() === 'LENCERIA POR BULTO'
                          const esCot = (p.category ?? '').toUpperCase() === 'COTILLON' || (p.subcategory ?? '').toUpperCase() === 'POP IT' || (p.category ?? '').toUpperCase() === 'ARTICULOS X BULTO'
                          if (esDocena) {
                            titulo = `VENTA POR ${p.minOrder} DOCENAS`
                            precioUnit = `$${p.wholesalePrice.toLocaleString('es-AR')} la docena`
                          } else {
                            titulo = `PRECIO POR ${p.minOrder} UNIDADES`
                            precioUnit = `$${(esCot ? p.wholesalePrice : Math.round(p.wholesalePrice / p.minOrder)).toLocaleString('es-AR')} c/u`
                          }
                        }
                        return titulo ? (
                          <>
                            <div style={{ background: '#FFFDE7', border: '1.5px solid #F59E0B', borderRadius: 6, padding: '4px 8px', marginBottom: extraInfo ? 2 : 4 }}>
                              {precioUnit && <div style={{ color: '#111', fontSize: 17, fontWeight: 900 }}>{precioUnit}</div>}
                              <span style={{ color: '#111', fontSize: 10, fontWeight: 900, letterSpacing: '0.02em' }}>{titulo}</span>
                              <div style={{ color: '#B45309', fontSize: 13, fontWeight: 900, marginTop: 2 }}>{(() => {
                                const esDoc = (p.subcategory ?? '').toUpperCase() === 'LENCERIA POR BULTO'
                                const esBulk = (p.category ?? '').toUpperCase() === 'COTILLON' || (p.subcategory ?? '').toUpperCase() === 'POP IT' || (p.category ?? '').toUpperCase() === 'ARTICULOS X BULTO'
                                const total = (esBulk || esDoc) ? p.wholesalePrice * p.minOrder : p.wholesalePrice
                                const label = esDoc ? `EL BULTO (${p.minOrder} DOCENAS)` : (p.category ?? '').toUpperCase() === 'ARTICULOS X BULTO' ? `EL BULTO X${p.minOrder}` : p.minOrder === 12 ? 'LA DOCENA' : `PACK X ${p.minOrder}`
                                return `${label}: $${total.toLocaleString('es-AR')}`
                              })()}</div>
                            </div>
                            {extraInfo && <p style={{ color: '#6B7280', fontSize: 9, lineHeight: 1.4, marginBottom: 4, marginTop: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{extraInfo}</p>}
                            {!extraInfo && p.descripcion && !p.descripcion.startsWith('PRECIO POR') && (
                              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, padding: '4px 8px', marginTop: 4, marginBottom: 2 }}>
                                <p style={{ color: '#1D4ED8', fontSize: 11, fontWeight: 700, lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.descripcion}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          p.descripcion ? <p style={{ color: '#6B7280', fontSize: 10, lineHeight: 1.4, marginBottom: 4, marginTop: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.descripcion}</p> : null
                        )
                      })()}
                      <Stars n={p.rating} />
                      {(() => {
                        const isBulk = p.descripcion?.startsWith('PRECIO POR') || p.badge === 'x6 UNIDADES' || p.minOrder > 1
                        if (isBulk) return null
                        return (
                          <div style={{ marginTop: 6 }}>
                            <div style={{ color: '#6B7280', fontSize: 10, marginTop: 2 }}>
                              Mayorista: <span style={{ color: '#F5C518', fontWeight: 900, fontSize: 14 }}>${p.wholesalePrice.toLocaleString('es-AR')}</span>
                            </div>
                          </div>
                        )
                      })()}
                      <motion.button
                        className="btn-agregar"
                        style={{ width: '100%', marginTop: 10, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#F5C518,#FFE45C)', color: '#0D2C54', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          const cat = (p.category ?? '').toUpperCase()
                          const sub = (p.subcategory ?? '').toUpperCase()
                          const esU = cat === 'ARTICULOS X BULTO' || cat === 'COTILLON' || sub === 'POP IT' || sub === 'LENCERIA POR BULTO'
                          const isDescPor = p.descripcion?.startsWith('PRECIO POR')
                          const dividir = !isDescPor && !esU && p.minOrder > 1
                          addItem({
                            id: p.id, name: p.name, brand: p.brand, price: p.price,
                            wholesalePrice: dividir ? Math.round(p.wholesalePrice / p.minOrder) : p.wholesalePrice,
                            image: p.image,
                            minOrder: isDescPor ? 1 : p.minOrder,
                            category: p.category,
                          })
                        }}>
                        <ShoppingCart size={12} />AGREGAR
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8a9a' }}>Cargando...</div>}>
      <BuscarContent />
    </Suspense>
  )
}
