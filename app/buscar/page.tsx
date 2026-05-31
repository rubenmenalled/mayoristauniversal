'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Star, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import CartSidebar from '@/components/CartSidebar'

interface Producto {
  id: number; name: string; brand: string; category: string
  price: number; wholesalePrice: number; minOrder: number
  rating: number; reviews: number; image: string
  badge?: string; discount?: number; location: string
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

// Genera variantes con y sin acentos + singular/plural
function getVariants(term: string): string[] {
  const t = term.toLowerCase().trim()
  if (!t) return []
  const base = stripAccents(t)   // sin acentos

  const seeds = new Set<string>([t, base])

  // Si el término original no tenía acentos, agregar variantes con ü y ñ
  // (para encontrar "pingüino" al buscar "pinguino", etc.)
  if (base === t) {
    // u → ü en cada posición
    for (let i = 0; i < t.length; i++) {
      if (t[i] === 'u') seeds.add(t.slice(0, i) + 'ü' + t.slice(i + 1))
    }
    // n → ñ en cada posición
    for (let i = 0; i < t.length; i++) {
      if (t[i] === 'n') seeds.add(t.slice(0, i) + 'ñ' + t.slice(i + 1))
    }
  }

  // Agregar plural/singular para cada semilla
  const variants = new Set<string>(seeds)
  seeds.forEach(seed => {
    if (!seed.endsWith('s')) {
      variants.add(seed + 's')
      variants.add(seed + 'es')
    }
    if (seed.endsWith('es') && seed.length > 3) variants.add(seed.slice(0, -2))
    if (seed.endsWith('s') && seed.length > 2)  variants.add(seed.slice(0, -1))
  })

  return Array.from(variants)
}

function matchesSearch(p: Producto, variants: string[]): boolean {
  const name  = (p.name     || '').toLowerCase()
  const brand = (p.brand    || '').toLowerCase()
  const cat   = (p.category || '').toLowerCase()
  return variants.some(v => name.includes(v) || brand.includes(v) || cat.includes(v))
}

function BuscarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem, count, cartOpen, setCartOpen } = useCart()
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(240,240,240,0.97)', borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', fontWeight: 700, fontSize: 13 }}>
            <ArrowLeft size={16} /> Inicio
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF', padding: 6 }}>
            <ShoppingCart size={24} />
            {count > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#D4AF37', color: '#FFFFFF', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{count}</span>}
          </button>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.3)' }}>
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Buscar productos, categorías o marcas..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', outline: 'none', color: '#FFFFFF', padding: '10px 16px', fontSize: 14 }}
            />
            <button type="submit" style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
              <Search size={18} color="#FFFFFF" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      {/* Resultados */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#7a8a9a', padding: 80 }}>Buscando...</div>
        ) : (
          <>
            <div style={{ color: '#7a8a9a', fontSize: 13, marginBottom: 24 }}>
              {productos.length === 0
                ? `No se encontraron resultados para "${q}"`
                : <>{productos.length} resultado{productos.length !== 1 ? 's' : ''} para <span style={{ color: '#D4AF37', fontWeight: 700 }}>"{q}"</span></>
              }
            </div>

            {productos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 20 }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
                <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Sin resultados</div>
                <div style={{ color: '#7a8a9a', fontSize: 14 }}>Probá con otro término o explorá los catálogos</div>
                <button onClick={() => router.push('/catalogo')}
                  style={{ marginTop: 20, background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 10, padding: '12px 28px', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer' }}>
                  Ver catálogos
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {productos.map((p, i) => (
                  <motion.div key={p.id}
                    className="glass-card rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }} whileHover={{ y: -4 }}>
                    <div style={{ position: 'relative', height: 340, background: '#F0F0F0', overflow: 'hidden' }}>
                      {p.image ? (
                        <Image src={p.image} alt={p.name} fill className="object-contain" sizes="220px" quality={95} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>📦</div>
                      )}
                      {(p.discount ?? 0) > 0 && (
                        <span style={{ position: 'absolute', top: 8, left: 8, background: '#dc2626', color: '#FFFFFF', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 99 }}>-{p.discount}%</span>
                      )}
                    </div>
                    <div style={{ padding: 8 }}>
                      {p.brand && <div style={{ color: '#7a8a9a', fontSize: 9, fontWeight: 600, marginBottom: 1 }}>Marca: {p.brand}</div>}
                      <h3 style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, minHeight: 28 }}>{p.name}</h3>
                      <Stars n={p.rating} />
                      <div style={{ marginTop: 8 }}>
                        <div style={{ color: '#7a8a9a', fontSize: 10, marginTop: 2 }}>
                          Mayorista: <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 14 }}>${p.wholesalePrice.toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                      <motion.button
                        style={{ width: '100%', marginTop: 10, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => addItem({ id: p.id, name: p.name, price: p.price, wholesalePrice: p.wholesalePrice, image: p.image, minOrder: p.minOrder })}>
                        <ShoppingCart size={11} /> AGREGAR
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
