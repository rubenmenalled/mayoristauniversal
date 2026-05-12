'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { products, featuredOffer, suppliers } from '@/data/mockData'
import { Star, MessageCircle, CheckCircle, MapPin, ChevronRight } from 'lucide-react'

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
              style={{ background: 'rgba(3,13,30,0.9)', border: '1px solid rgba(212,175,55,0.3)' }}>
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
  OFERTA: 'bg-red-600', NUEVO: 'bg-green-600', HOT: 'bg-orange-500', TOP: 'bg-gold text-navy',
}

/* ─── Product card ─── */
function ProductCard({ p }: { p: typeof products[0] }) {
  return (
    <motion.div className="group glass-card rounded-xl overflow-hidden relative"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      {/* Hover border */}
      <div className="absolute inset-0 rounded-xl border border-gold/0 group-hover:border-gold/40 transition-all duration-300 pointer-events-none z-10" />

      {/* Image */}
      <div className="relative h-40 bg-navy-mid overflow-hidden">
        <Image src={p.image} alt={p.name} fill
          className="object-cover transition-transform duration-500 group-hover:scale-108"
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
      <div className="p-3">
        <div className="text-gray-400 text-[10px] font-semibold mb-0.5">Marca: {p.brand}</div>
        <h3 className="text-white text-xs font-bold leading-tight mb-1.5 line-clamp-2 group-hover:text-gold transition-colors min-h-[2rem]">
          {p.name}
        </h3>
        <Stars n={p.rating} />
        <div className="text-gray-500 text-[10px] mb-2">({p.reviews})</div>

        {/* Prices */}
        <div className="mb-1">
          <span className="text-gray-500 text-xs line-through">${p.price.toLocaleString('es-AR')}</span>
        </div>
        <div className="text-[10px] text-gray-400 mb-1">
          Precio mayorista:{' '}
          <span className="text-gold font-black text-sm">${p.wholesalePrice.toLocaleString('es-AR')}</span>
        </div>

        <motion.button
          className="w-full mt-2 py-1.5 rounded-lg text-navy text-xs font-bold flex items-center justify-center gap-1"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}
          whileTap={{ scale: 0.97 }}>
          <MessageCircle size={12} /> CONSULTAR
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

export default function Marketplace() {
  const [tab,      setTab]      = useState('Todos')
  const [category, setCategory] = useState('Todos')

  const filtered = tab === 'En oferta'
    ? products.filter(p => p.badge === 'OFERTA')
    : tab === 'Nuevos'
    ? products.filter(p => p.badge === 'NUEVO')
    : products

  return (
    <section id="productos" className="py-10 relative"
      style={{ background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ── LEFT — Ofertas destacadas ── */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gold/20">
              <span className="text-gold font-black text-sm uppercase tracking-wide">⚡ Ofertas Destacadas</span>
            </div>

            {/* Countdown */}
            <div className="mb-4">
              <CountdownTimer />
            </div>

            {/* Featured offer card */}
            <motion.div className="glass-card rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <div className="relative h-44">
                <Image src={featuredOffer.image} alt={featuredOffer.name} fill
                  className="object-cover" sizes="300px" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 to-transparent" />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  -{featuredOffer.discount}%
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white text-sm font-bold mb-2 leading-tight">{featuredOffer.name}</h3>
                <Stars n={featuredOffer.rating} />
                <div className="text-gray-500 text-[10px] mb-2">({featuredOffer.reviews} reseñas)</div>
                <div className="text-gray-500 text-xs line-through">${featuredOffer.price.toLocaleString('es-AR')}</div>
                <div className="text-gold font-black text-xl">${featuredOffer.wholesalePrice.toLocaleString('es-AR')}</div>
                <motion.button
                  className="w-full mt-3 py-2 rounded-lg text-navy text-sm font-black"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  VER OFERTA
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* ── CENTER — Productos destacados ── */}
          <div className="lg:col-span-6">
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

          {/* ── RIGHT — Proveedores destacados ── */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gold/20">
              <span className="text-white font-black text-sm uppercase tracking-wide">Proveedores Destacados</span>
              <a href="#proveedores" className="text-gold text-xs font-bold flex items-center gap-0.5">
                VER TODOS <ChevronRight size={12} />
              </a>
            </div>

            <div className="glass-card rounded-xl overflow-hidden divide-y divide-white/5">
              {suppliers.map(s => <SupplierRow key={s.id} s={s} />)}
            </div>

            {/* Coverage mini-card */}
            <div className="mt-4 glass-card rounded-xl p-4 relative overflow-hidden"
              style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="relative z-10">
                <div className="text-white font-black text-sm mb-0.5">ENVÍOS A TODO EL PAÍS</div>
                <div className="text-gold text-xs font-semibold mb-3">LLEGAMOS A LAS 24 PROVINCIAS</div>
                <motion.button
                  className="px-4 py-2 rounded-lg text-navy text-xs font-black"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  VER COBERTURA
                </motion.button>
              </div>
              {/* Argentina map hint */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-6xl opacity-15 pointer-events-none select-none">
                🇦🇷
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats + promo bar ── */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Promo banner */}
          <motion.div className="glass-card rounded-xl p-5 flex items-center gap-4"
            style={{ border: '1px solid rgba(212,175,55,0.2)' }}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}>
              %
            </div>
            <div>
              <div className="text-white font-black text-sm">PROMOCIONES EXCLUSIVAS</div>
              <div className="text-gray-400 text-xs mb-2">PARA COMPRAS MAYORISTAS</div>
              <button className="px-4 py-1.5 rounded-lg text-navy text-xs font-black"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}>
                VER PROMOCIONES
              </button>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div className="glass-card rounded-xl p-5 grid grid-cols-4 gap-2"
            style={{ border: '1px solid rgba(212,175,55,0.2)' }}
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {[
              { icon: '📦', n: '+25.000', l: 'PRODUCTOS'    },
              { icon: '🏭', n: '+8.000',  l: 'PROVEEDORES'  },
              { icon: '👥', n: '+100.000',l: 'COMPRADORES'  },
              { icon: '🗺️', n: '24',      l: 'PROVINCIAS'  },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-gold font-black text-sm leading-none">{s.n}</div>
                <div className="text-gray-400 text-[10px] mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
