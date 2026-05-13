'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, Menu, X, ChevronDown, MessageCircle, Plus, Grid } from 'lucide-react'

const navLinks = [
  { name: 'PRODUCTOS',    href: '#productos'   },
  { name: 'OFERTAS',      href: '#ofertas'     },
  { name: 'NOVEDADES',    href: '#novedades'   },
  { name: 'CÓMO COMPRAR', href: '#como-comprar'},
  { name: 'AYUDA',        href: '#ayuda'       },
]

export default function Header() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search,     setSearch]     = useState('')
  const [catOpen,    setCatOpen]    = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [categorias, setCategorias] = useState<{id:number,nombre:string,emoji:string}[]>([])
  const catRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    fetch('/api/categorias').then(r => r.json()).then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
      scrolled ? 'shadow-2xl shadow-black/70' : ''
    }`}
      style={{ background: scrolled ? 'rgba(7,22,51,0.97)' : 'rgba(7,22,51,0.92)', backdropFilter: 'blur(16px)' }}>

      {/* ── Main bar ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-2.5">
        <div className="flex items-center gap-4">

          {/* Logo */}
          <motion.a href="/" className="flex-shrink-0 flex items-center gap-2.5" whileHover={{ scale: 1.02 }}>
            {/* Cart icon logo */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C030)' }}>
              <ShoppingCart size={20} className="text-navy" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="font-display font-black text-xl tracking-wide"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F5E060,#D4AF37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                MAYORISTA
              </div>
              <div className="font-display font-black text-xl tracking-widest"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F5E060,#D4AF37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                UNIVERSAL
              </div>
            </div>
          </motion.a>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-2">
            <div className="flex w-full rounded-lg overflow-hidden border border-gold/25 focus-within:border-gold/60 transition-colors">
              <button className="flex items-center gap-1.5 bg-navy-light px-4 py-2.5 border-r border-gold/20 text-sm text-gray-300 hover:text-white whitespace-nowrap flex-shrink-0 transition-colors">
                Todas las categorías <ChevronDown size={13} />
              </button>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar productos, categorías o marcas..."
                className="flex-1 bg-navy-light text-white placeholder-gray-500 px-4 py-2.5 outline-none text-sm min-w-0" />
              <button className="px-5 py-2.5 flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}>
                <Search size={18} className="text-navy" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Publicar */}
            <motion.button
              className="flex flex-col items-center text-center text-gray-300 hover:text-gold transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Plus size={18} className="mb-0.5" />
              <span className="text-[10px] font-bold leading-none">¿VENDÉS?</span>
              <span className="text-[10px] leading-none opacity-70">Publicar productos</span>
            </motion.button>

            {/* WhatsApp */}
            <motion.a href="https://wa.me/5491155550000" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <MessageCircle size={16} /> WhatsApp
            </motion.a>

            {/* Cart */}
            <motion.button className="relative p-1.5 text-gray-300 hover:text-gold transition-colors" whileHover={{ scale: 1.1 }}>
              <ShoppingCart size={24} />
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">3</span>
            </motion.button>

            {/* Account */}
            <motion.button
              className="flex flex-col items-end text-gray-300 hover:text-gold transition-colors"
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-[11px] leading-none opacity-80">Ingresar / Registrarse</span>
              <span className="text-[12px] font-bold leading-none flex items-center gap-1">Mi cuenta <ChevronDown size={11} /></span>
            </motion.button>
          </div>

          {/* Mobile menu btn */}
          <button className="lg:hidden ml-auto text-white p-1.5" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Nav bar ── */}
      <div className="hidden lg:block border-t border-white/10"
        style={{ background: 'rgba(3,13,30,0.85)' }}>
        <div className="max-w-[1400px] mx-auto px-4">
          <nav className="flex items-center gap-0">
            {/* Categorías dropdown */}
            <div ref={catRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setCatOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 text-white font-bold text-sm border-r border-white/10 hover:bg-gold/10 transition-colors mr-2"
                style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <Grid size={15} /> CATEGORÍAS <ChevronDown size={12} style={{ transform: catOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: '100%', left: 0, zIndex: 200,
                      background: 'rgba(7,22,51,0.98)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      borderRadius: 12, padding: '8px',
                      minWidth: 200, maxHeight: 400, overflowY: 'auto',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    }}>
                    {categorias.length === 0 ? (
                      <div style={{ color: '#7a8a9a', fontSize: 12, padding: '12px 16px' }}>
                        No hay categorías cargadas
                      </div>
                    ) : categorias.map(c => (
                      <a key={c.id} href={`/categorias/${encodeURIComponent(c.nombre)}`}
                        onClick={() => setCatOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 14px', borderRadius: 8,
                          color: '#ccc', fontSize: 13, fontWeight: 700,
                          textDecoration: 'none', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(212,175,55,0.15)'
                          e.currentTarget.style.color = '#D4AF37'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#ccc'
                        }}>
                        <span style={{ fontSize: 18 }}>{c.emoji}</span>
                        {c.nombre}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLinks.map(link => (
              <a key={link.name} href={link.href}
                className="flex items-center gap-1 px-4 py-2.5 text-gray-300 hover:text-gold text-sm font-semibold transition-colors whitespace-nowrap relative group">
                {link.name}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="lg:hidden border-t border-white/10 overflow-hidden"
            style={{ background: 'rgba(7,22,51,0.98)' }}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="px-4 py-4 space-y-3">
              <div className="flex rounded-lg overflow-hidden border border-gold/30">
                <input type="text" placeholder="Buscar productos..."
                  className="flex-1 bg-navy-light text-white placeholder-gray-500 px-4 py-2.5 outline-none text-sm" />
                <button className="px-4 py-2.5" style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}>
                  <Search size={16} className="text-navy" />
                </button>
              </div>
              {navLinks.map(l => (
                <a key={l.name} href={l.href}
                  className="block text-gray-300 hover:text-gold py-2.5 border-b border-white/5 text-sm font-semibold transition-colors"
                  onClick={() => setMobileOpen(false)}>{l.name}</a>
              ))}
              {categorias.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={() => setMobileCatOpen(v => !v)}
                    className="w-full flex items-center justify-between text-gray-300 hover:text-gold py-2.5 border-b border-white/5 text-sm font-semibold transition-colors">
                    <span>CATEGORÍAS</span>
                    <ChevronDown size={14} style={{ transform: mobileCatOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </button>
                  {mobileCatOpen && categorias.map(c => (
                    <a key={c.id} href={`/categorias/${encodeURIComponent(c.nombre)}`}
                      className="block text-gray-400 hover:text-gold py-2 pl-4 border-b border-white/5 text-sm transition-colors"
                      onClick={() => { setMobileOpen(false); setMobileCatOpen(false) }}>
                      {c.emoji} {c.nombre}
                    </a>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <a href="https://wa.me/5491155550000"
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold text-center">📱 WhatsApp</a>
                <button className="flex-1 btn-outline-gold py-2.5 rounded-lg text-sm font-semibold">+ Publicar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
