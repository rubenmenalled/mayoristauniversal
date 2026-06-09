'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { featuredOffer, suppliers, type Product } from '@/data/mockData'
import { Star, MessageCircle, CheckCircle, MapPin, ChevronRight, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/CartContext'

/* ─── Countdown timer ─── */
function CountdownTimer() {
  const [t, setT] = useState({ d: 2, h: 14, m: 37, s: 52 })
  useEffect(() => {
    const id = setInterval(() => setT(prev => {
      let { d, h, m, s } = prev
      s--
      if (s < 0) { s = 59; m-- }
      if (m < 0) { m = 59; h-- }
      if (h < 0) { h = 23; d-- }
      if (d < 0) d = 0
      return { d, h, m, s }
    }), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { v: t.d, l: 'DÍAS'  },
    { v: t.h, l: 'HORAS' },
    { v: t.m, l: 'MIN'   },
    { v: t.s, l: 'SEG'   },
  ]

  return (
    <div className="flex items-end gap-2">
      {units.map(({ v, l }, i) => (
        <div key={l} className="flex items-end gap-1">
          <div className="flex flex-col items-center">
            <div className="w-12 h-11 flex items-center justify-center rounded-md font-display font-black text-2xl text-white"
              style={{ background: 'rgba(240,240,240,0.9)', border: '1px solid rgba(212,175,55,0.3)' }}>
              {String(v).padStart(2, '0')}
            </div>
            <span className="text-gray-500 text-[9px] mt-1 font-bold tracking-wider">{l}</span>
          </div>
          {i < 3 && <span className="text-gold font-black text-xl mb-5 leading-none">:</span>}
        </div>
      ))}
    </div>
  )
}

/* ─── Star rating ─── */
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= Math.round(n) ? 'text-gold fill-gold' : 'text-gray-600'} />
      ))}
    </div>
  )
}

/* ─── Badge ─── */
const BADGE: Record<string, string> = {
  OFERTA: 'bg-red-600', NUEVO: 'bg-green-600', HOT: 'bg-orange-500', TOP: 'bg-gold text-navy', DESTACADO: 'bg-gold text-navy',
}

/* ─── Product card ─── */
function ProductCard({ p }: { p: Product }) {
  const { addItem } = useCart()
  return (
    <motion.div className="group glass-card rounded-xl overflow-hidden relative"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      {/* Hover border */}
      <div className="absolute inset-0 rounded-xl border border-gold/0 group-hover:border-gold/40 transition-all duration-300 pointer-events-none z-10" />

      {/* Image */}
      <div className="relative h-80 bg-navy-mid overflow-hidden" style={{ background: '#F0F0F0' }}>
        <Image src={p.image} alt={p.name} fill
          className="object-contain transition-transform duration-500 group-hover:scale-105 p-2"
          sizes="(max-width:640px) 100vw, 200px" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 to-transparent" />
        {/* Discount badge */}
        {p.discount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
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
      <div className="p-2">
        <div className="text-gray-400 text-[9px] font-semibold mb-0.5">Marca: {p.brand}</div>
        <h3 className="text-white text-[11px] font-bold leading-tight mb-1 line-clamp-2 group-hover:text-gold transition-colors min-h-[1.8rem]">
          {p.name}
        </h3>
        <Stars n={p.rating} />
        <div className="text-gray-500 text-[10px] mb-2">({p.reviews})</div>

        <div className="text-[10px] text-gray-400 mb-1">
          Precio mayorista:{' '}
          <span className="text-gold font-black text-sm">${p.wholesalePrice.toLocaleString('es-AR')}</span>
        </div>

        <motion.button
          className="w-full mt-2 py-1.5 rounded-lg text-navy text-xs font-bold flex items-center justify-center gap-1"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => addItem({ id: p.id, name: p.name, price: p.price, wholesalePrice: p.wholesalePrice, image: p.image, minOrder: p.minOrder })}>
          <ShoppingCart size={12} /> AGREGAR AL CARRITO
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ─── Supplier row ─── */
function SupplierRow({ s }: { s: typeof suppliers[0] }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
        style={{ background: s.color, fontSize: 10 }}>
        {s.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-white text-sm font-bold truncate group-hover:text-gold transition-colors">{s.name}</span>
          {s.verified && <CheckCircle size={12} className="text-electric flex-shrink-0" />}
        </div>
        <div className="text-gray-400 text-[11px] flex items-center gap-1">
          <MapPin size={10} />{s.category}
        </div>
      </div>
      <motion.button
        className="flex-shrink-0 px-3 py-1.5 rounded-lg text-navy text-[11px] font-black"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        CONTACTAR
      </motion.button>
    </div>
  )
}

/* ─── Main component ─── */
const TABS = ['Todos', 'Nuevos', 'En oferta', 'Más vendidos']

export default function Marketplace({ products: initialProducts }: { products?: Product[] }) {
  const [tab,      setTab]      = useState('Todos')
  const [category, setCategory] = useState('Todos')
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts || [])

  useEffect(() => {
    fetch('/api/productos-publicos')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setAllProducts(data) })
      .catch(() => {})
  }, [])

  const filtered = tab === 'En oferta'
    ? allProducts.filter(p => p.badge === 'OFERTA')
    : tab === 'Nuevos'
    ? allProducts.filter(p => p.badge === 'NUEVO')
    : allProducts

  return (
    <section id="productos" className="py-10 relative"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ── LEFT — Ofertas destacadas ── */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gold/20">
              <span className="text-gold font-black text-sm uppercase tracking-wide">⚡ Ofertas Destacadas</span>
            </div>

            {/* Placeholder cuando no hay oferta destacada */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 text-center"
              style={{ minHeight: 220, border: '1px dashed rgba(212,175,55,0.3)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔥</div>
              <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 14, marginBottom: 6 }}>
                PRÓXIMAS OFERTAS
              </div>
              <div style={{ color: '#7a8a9a', fontSize: 12 }}>
                Las novedades aparecerán acá cuando las publiques desde el panel
              </div>
            </div>
          </div>

          {/* ── CENTER — Productos destacados ── */}
          <div className="lg:col-span-10">
            {/* Header + tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-white font-black text-sm uppercase tracking-wide">Productos Destacados</span>
              <div className="flex gap-1 ml-auto">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      tab === t
                        ? 'text-navy shadow-lg'
                        : 'glass-card text-gray-300 hover:text-gold'
                    }`}
                    style={tab === t ? { background: 'linear-gradient(135deg,#D4AF37,#F0C030)' } : {}}>
                    {t}
                  </button>
                ))}
              </div>
              <a href="#" className="text-gold text-xs font-bold flex items-center gap-1 hover:underline whitespace-nowrap">
                VER TODOS <ChevronRight size={12} />
              </a>
            </div>

            {/* Products grid */}
            <AnimatePresence mode="wait">
              <motion.div key={tab}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}>
                {filtered.slice(0, 6).map(p => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}
