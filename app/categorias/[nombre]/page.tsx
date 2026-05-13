'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, MessageCircle } from 'lucide-react'

interface Producto {
  id: number; name: string; brand: string; category: string
  price: number; wholesalePrice: number; minOrder: number
  rating: number; reviews: number; image: string
  badge?: string; discount?: number; location: string
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

  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    fetch('/api/productos-publicos')
      .then(r => r.json())
      .then((data: Producto[]) => {
        const filtrados = data.filter(p =>
          p.category?.toLowerCase() === nombreDecoded.toLowerCase()
        )
        setProductos(filtrados)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [nombreDecoded])

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
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#D4AF37', fontWeight: 700, fontSize: 13,
            }}>
            <ArrowLeft size={16} /> Inicio
          </button>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>
            {nombreDecoded}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#7a8a9a', padding: 80, fontSize: 16 }}>
            Cargando productos...
          </div>
        ) : productos.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 80,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>
              No hay productos en {nombreDecoded} todavía
            </div>
            <div style={{ color: '#7a8a9a', fontSize: 14, marginBottom: 24 }}>
              Pronto vas a encontrar productos en esta categoría
            </div>
            <button onClick={() => router.push('/')}
              style={{
                background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
                border: 'none', borderRadius: 10, padding: '12px 28px',
                color: '#030D1E', fontWeight: 900, cursor: 'pointer', fontSize: 14,
              }}>
              Volver al inicio
            </button>
          </div>
        ) : (
          <>
            <div style={{ color: '#7a8a9a', fontSize: 13, marginBottom: 24 }}>
              {productos.length} producto{productos.length !== 1 ? 's' : ''} en <span style={{ color: '#D4AF37', fontWeight: 700 }}>{nombreDecoded}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {productos.map((p, i) => (
                <motion.div key={p.id}
                  className="glass-card rounded-xl overflow-hidden relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: 160, background: '#071633', overflow: 'hidden' }}>
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="220px" />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>
                        📦
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,13,30,0.7), transparent)' }} />
                    {p.discount && p.discount > 0 && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 99 }}>
                        -{p.discount}%
                      </span>
                    )}
                    {p.badge && (
                      <span className={`absolute top-2 right-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full ${BADGE[p.badge] ?? 'bg-gray-600'}`}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  {/* Body */}
                  <div style={{ padding: 12 }}>
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
                      style={{
                        width: '100%', marginTop: 10, padding: '7px',
                        borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
                        color: '#030D1E', fontSize: 11, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => window.open(`https://wa.me/5491164660482?text=Hola!%20Me%20interesa%20el%20producto%3A%20${encodeURIComponent(p.name)}`, '_blank')}>
                      <MessageCircle size={11} /> CONSULTAR
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
