'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import CartSidebar from '@/components/CartSidebar'

interface Producto {
  id: number; name: string; brand: string; category: string
  subcategory?: string; price: number; wholesalePrice: number; minOrder: number
  rating: number; reviews: number; image: string
  badge?: string; discount?: number; location: string
}

interface Subcategoria {
  id: number; nombre: string; emoji: string; categoria_id: number
}

const BADGE: Record<string, string> = {
  OFERTA: 'bg-red-600', NUEVO: 'bg-green-600', HOT: 'bg-orange-500', TOP: 'bg-yellow-500',
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

export default function CategoriaPage() {
  const { nombre } = useParams()
  const router = useRouter()
  const nombreDecoded = decodeURIComponent(nombre as string)

  const { addItem, count, cartOpen, setCartOpen } = useCart()
  const [productos, setProductos] = useState<Producto[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])
  const [subActiva, setSubActiva] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<Producto | null>(null)

  function normalizar(s: string) {
    return (s || '').toLowerCase().trim()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ')
  }

  useEffect(() => {
    // Cargar productos
    fetch('/api/productos-publicos')
      .then(r => r.json())
      .then((data: Producto[]) => {
        const catNorm = normalizar(nombreDecoded)
        const filtrados = data.filter(p =>
          normalizar(p.category) === catNorm ||
          normalizar(p.category).includes(catNorm) ||
          catNorm.includes(normalizar(p.category))
        )
        setProductos(filtrados)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Cargar subcategorías
    fetch('/api/subcategorias?categoria=' + encodeURIComponent(nombreDecoded))
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSubcategorias(data) })
      .catch(() => {})
  }, [nombreDecoded])

  const productosFiltrados = subActiva
    ? productos.filter(p => p.subcategory?.toLowerCase() === subActiva.toLowerCase())
    : productos

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(7,22,51,0.97)', borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', fontWeight: 700, fontSize: 13 }}>
            <ArrowLeft size={16} /> Inicio
          </button>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 20, flex: 1 }}>{nombreDecoded}</div>
          <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 6 }}>
            <ShoppingCart size={24} />
            {count > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#D4AF37', color: '#030D1E', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{count}</span>}
          </button>
        </div>
      </div>

      {/* Filtros subcategorías */}
      {subcategorias.length > 0 && (
        <div style={{
          background: 'rgba(7,22,51,0.95)', borderBottom: '1px solid rgba(212,175,55,0.1)',
          padding: '12px 16px', overflowX: 'auto',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'nowrap', minWidth: 'max-content' }}>
            <button
              onClick={() => setSubActiva('')}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap',
                background: subActiva === '' ? 'linear-gradient(135deg,#D4AF37,#F0C030)' : 'rgba(255,255,255,0.08)',
                color: subActiva === '' ? '#030D1E' : '#ccc',
              }}>
              Todos ({productos.length})
            </button>
            {subcategorias.map(sub => {
              const cant = productos.filter(p => p.subcategory?.toLowerCase() === sub.nombre.toLowerCase()).length
              return (
                <button key={sub.id}
                  onClick={() => setSubActiva(sub.nombre)}
                  style={{
                    padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap',
                    background: subActiva === sub.nombre ? 'linear-gradient(135deg,#D4AF37,#F0C030)' : 'rgba(255,255,255,0.08)',
                    color: subActiva === sub.nombre ? '#030D1E' : '#ccc',
                  }}>
                  {sub.emoji} {sub.nombre} {cant > 0 ? `(${cant})` : ''}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#7a8a9a', padding: 80, fontSize: 16 }}>Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 20 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>
              {subActiva ? `No hay productos en ${subActiva}` : `No hay productos en ${nombreDecoded} todavía`}
            </div>
            {subActiva && (
              <button onClick={() => setSubActiva('')}
                style={{ marginTop: 16, background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 10, padding: '10px 24px', color: '#030D1E', fontWeight: 900, cursor: 'pointer' }}>
                Ver todos
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ color: '#7a8a9a', fontSize: 13, marginBottom: 24 }}>
              {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} en{' '}
              <span style={{ color: '#D4AF37', fontWeight: 700 }}>{subActiva || nombreDecoded}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {productosFiltrados.map((p, i) => (
                <motion.div key={p.id}
                  className="glass-card rounded-xl overflow-hidden relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4 }}>
                  <div style={{ position: 'relative', height: 150, background: '#071633', overflow: 'hidden', cursor: p.image ? 'zoom-in' : 'default' }}
                    onClick={() => p.image && setLightbox(p)}>
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-contain p-2" sizes="180px" />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>📦</div>
                    )}
                    {p.image && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '2px 5px', fontSize: 10, color: '#fff' }}>🔍</div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,13,30,0.7), transparent)' }} />
                    {p.discount && p.discount > 0 && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 99 }}>-{p.discount}%</span>
                    )}
                    {p.badge && (
                      <span className={`absolute top-2 right-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full ${BADGE[p.badge] ?? 'bg-gray-600'}`}>{p.badge}</span>
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    {p.brand && <div style={{ color: '#7a8a9a', fontSize: 10, fontWeight: 600, marginBottom: 2 }}>Marca: {p.brand}</div>}
                    <h3 style={{ color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1.4, marginBottom: 6, minHeight: 32 }}>{p.name}</h3>
                    <Stars n={p.rating} />
                    <div style={{ marginTop: 8 }}>
                      {p.price > 0 && <div style={{ color: '#6b7280', fontSize: 11, textDecoration: 'line-through' }}>${p.price.toLocaleString('es-AR')}</div>}
                      <div style={{ color: '#7a8a9a', fontSize: 10, marginTop: 2 }}>
                        Mayorista: <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 14 }}>${p.wholesalePrice.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                    <motion.button
                      style={{ width: '100%', marginTop: 10, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#030D1E', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addItem({ id: p.id, name: p.name, price: p.price, wholesalePrice: p.wholesalePrice, image: p.image, minOrder: p.minOrder })}>
                      <ShoppingCart size={11} /> AGREGAR
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, cursor: 'zoom-out' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 500, background: '#0a1628', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.3)' }}>
            {/* Foto grande */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#071633' }}>
              <Image src={lightbox.image} alt={lightbox.name} fill style={{ objectFit: 'contain', padding: 16 }} sizes="500px" />
            </div>
            {/* Info */}
            <div style={{ padding: '16px 20px 20px' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 15, marginBottom: 8 }}>{lightbox.name}</div>
              <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 22, marginBottom: 12 }}>
                ${lightbox.wholesalePrice.toLocaleString('es-AR')}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setLightbox(null)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px', color: '#ccc', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  Cerrar
                </button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => { addItem({ id: lightbox.id, name: lightbox.name, price: lightbox.price, wholesalePrice: lightbox.wholesalePrice, image: lightbox.image, minOrder: lightbox.minOrder }); setLightbox(null) }}
                  style={{ flex: 2, background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 10, padding: '10px', color: '#030D1E', fontWeight: 900, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <ShoppingCart size={14} /> AGREGAR AL CARRITO
                </motion.button>
              </div>
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 16 }}>Tocá afuera para cerrar</div>
        </motion.div>
      )}
    </div>
  )
}
