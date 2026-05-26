'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, Menu, X, ChevronDown, MessageCircle, Grid, User, LogOut } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import CartSidebar from './CartSidebar'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const navLinks = [
  { name: 'CÓMO COMPRAR', href: '/como-comprar'},
]

const FRASES = [
  { emoji: '🛒', texto: 'Tu supermercado mayorista, con un solo click' },
  { emoji: '🏪', texto: 'Todo lo que tu negocio necesita, en un solo lugar' },
  { emoji: '⚡', texto: 'Comprá mayorista desde donde estés, 24/7' },
  { emoji: '💼', texto: 'Miles de productos. Precios mayoristas. Sin salir de casa.' },
]

export default function Header() {
  const router = useRouter()
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search,     setSearch]     = useState('')
  const [catOpen,    setCatOpen]    = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState('')
  const [fraseIdx, setFraseIdx] = useState(0)
  const [fraseVisible, setFraseVisible] = useState(true)
  const { count, cartOpen, setCartOpen } = useCart()
  const [categorias, setCategorias] = useState<{id:number,nombre:string,emoji:string}[]>([])
  const catRef = useRef<HTMLDivElement>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    fetch('/api/cats').then(r => r.json()).then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user
      if (u) setUserName(u.user_metadata?.nombre || u.email || 'Mi cuenta')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user
      setUserName(u ? (u.user_metadata?.nombre || u.email || 'Mi cuenta') : null)
    })
    return () => listener.subscription.unsubscribe()
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

  useEffect(() => {
    const interval = setInterval(() => {
      setFraseVisible(false)
      setTimeout(() => {
        setFraseIdx(i => (i + 1) % FRASES.length)
        setFraseVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
    <header className={`fixed inset-x-0 z-50 transition-all duration-400 ${
      scrolled ? 'shadow-2xl shadow-black/70' : ''
    }`}
      style={{ top: 38, background: scrolled ? 'rgba(240,240,240,0.97)' : 'rgba(240,240,240,0.92)', backdropFilter: 'blur(16px)' }}>

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
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F5E060,#D4AF37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }}>
                MAYORISTA
              </div>
              <div className="font-display font-black text-xl tracking-widest"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F5E060,#D4AF37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }}>
                UNIVERSAL
              </div>
            </div>
          </motion.a>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-2">
            <form className="flex w-full rounded-lg overflow-hidden border border-gold/25 focus-within:border-gold/60 transition-colors"
              onSubmit={e => { e.preventDefault(); if (search.trim()) window.location.href = `/buscar?q=${encodeURIComponent(search.trim())}` }}>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar productos, categorías o marcas..."
                className="flex-1 bg-navy-light text-white placeholder-gray-500 px-4 py-2.5 outline-none text-sm min-w-0" />
              <button type="submit" className="px-5 py-2.5 flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}>
                <Search size={18} className="text-navy" strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

            {/* Social icons */}
            <div className="flex items-center gap-1.5">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/mayoristauniversal', color: '#FF0090', bg: 'rgba(255,0,144,0.15)', border: 'rgba(255,0,144,0.4)', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { name: 'Facebook', href: 'https://www.facebook.com/mayoristauniversal', color: '#1565C0', bg: 'rgba(24,119,242,0.15)', border: 'rgba(24,119,242,0.4)', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { name: 'X', href: 'https://www.x.com/mayoristauniversal', color: '#ffffff', bg: '#000000', border: '#000000', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              ].map(s => (
                <motion.a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  title={s.name}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                  whileHover={{ scale: 1.15, y: -1 }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>

            {/* Mercado Pago badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e6f4fb', border: '1px solid #009ee3', borderRadius: 8, padding: '5px 10px' }}>
              <Image src="/mp-logo.png" alt="Mercado Pago" width={90} height={24} style={{ objectFit: 'contain', display: 'block' }} />
            </div>

            {/* WhatsApp */}
            <motion.a href="https://wa.me/5491164660482" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <MessageCircle size={16} /> WhatsApp
            </motion.a>

            {/* Cart */}
            <motion.button className="relative p-1.5 transition-colors" style={{ color: '#1565C0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
              onMouseLeave={e => (e.currentTarget.style.color = '#1565C0')}
              whileHover={{ scale: 1.1 }} onClick={() => setCartOpen(true)}>
              <ShoppingCart size={24} />
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">{count}</span>}
            </motion.button>

            {/* Account */}
            {userName ? (
              <div className="flex items-center gap-2">
                <motion.a href="/mi-cuenta"
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: '#1565C0' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#1565C0')}
                  whileHover={{ scale: 1.03 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} color="#FFFFFF" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] leading-none opacity-70 text-gold">Bienvenido</span>
                    <span className="text-[12px] font-bold leading-none text-gold" style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {userName.split(' ')[0].split('@')[0]}
                    </span>
                  </div>
                </motion.a>
              </div>
            ) : (
              <motion.a href="/login"
                className="flex flex-col items-end transition-colors"
                style={{ color: '#1565C0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1565C0')}
                whileHover={{ scale: 1.03 }}>
                <span className="text-[11px] leading-none opacity-80">Ingresar / Registrarse</span>
                <span className="text-[12px] font-bold leading-none flex items-center gap-1">Mi cuenta <ChevronDown size={11} /></span>
              </motion.a>
            )}
          </div>

          {/* Mobile: redes + controles en un solo bloque a la derecha */}
          <div className="lg:hidden ml-auto flex items-center gap-1.5">
            {/* Iconos redes sociales */}
            {[
              { name: 'Instagram', href: 'https://www.instagram.com/mayoristauniversal', color: '#FF0090', bg: 'rgba(255,0,144,0.15)', border: 'rgba(255,0,144,0.35)',
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
              { name: 'Facebook', href: 'https://www.facebook.com/mayoristauniversal', color: '#1565C0', bg: 'rgba(24,119,242,0.15)', border: 'rgba(24,119,242,0.35)',
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              { name: 'X', href: 'https://www.x.com/mayoristauniversal', color: '#ffffff', bg: '#000000', border: '#000000',
                icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            ].map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" title={s.name}
                style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg, border: `1px solid ${s.border}`, color: s.color, flexShrink: 0 }}>
                {s.icon}
              </a>
            ))}

            {/* Separador */}
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />

            {/* Búsqueda */}
            <button style={{ padding: '4px', flexShrink: 0, color: '#1565C0', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMobileSearchOpen(v => !v)}>
              <Search size={20} />
            </button>

            {/* Account */}
            <a href={userName ? '/mi-cuenta' : '/login'} style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: userName ? 'linear-gradient(135deg,#D4AF37,#F0C030)' : 'rgba(212,175,55,0.15)',
                border: '1.5px solid rgba(212,175,55,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {userName
                  ? <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF' }}>{userName.charAt(0).toUpperCase()}</span>
                  : <User size={15} color="#D4AF37" />
                }
              </div>
            </a>

            {/* Menú hamburguesa */}
            <button style={{ padding: '4px 2px', flexShrink: 0, color: '#1565C0', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div className="lg:hidden border-t border-white/10"
            style={{ background: 'rgba(240,240,240,0.98)' }}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <form className="px-4 py-3 flex gap-2"
              onSubmit={e => { e.preventDefault(); if (mobileSearch.trim()) { window.location.href = `/buscar?q=${encodeURIComponent(mobileSearch.trim())}` } }}>
              <input
                type="text" value={mobileSearch} onChange={e => setMobileSearch(e.target.value)}
                placeholder="Buscar productos, categorías o marcas..."
                autoFocus
                className="flex-1 bg-navy-light border border-gold/30 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 outline-none text-sm"
              />
              <button type="submit" className="px-4 py-2.5 rounded-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}>
                <Search size={18} className="text-navy" strokeWidth={2.5} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav bar ── */}
      <div className="hidden lg:block border-t border-white/10"
        style={{ background: 'rgba(240,240,240,0.85)' }}>
        <div className="max-w-[1400px] mx-auto px-4">
          <nav className="flex items-center gap-0">
            {/* Categorías dropdown */}
            <div ref={catRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setCatOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 font-bold text-sm border-r border-white/10 hover:bg-gold/10 transition-colors mr-2"
                style={{ borderRight: '1px solid rgba(255,255,255,0.1)', color: '#1565C0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1565C0')}>
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
                      background: 'rgba(240,240,240,0.98)',
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
                          color: '#CC0000', fontSize: 13, fontWeight: 700,
                          textDecoration: 'none', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(212,175,55,0.15)'
                          e.currentTarget.style.color = '#D4AF37'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#CC0000'
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
              <a key={link.name}
                href={link.href}
                onClick={link.href.startsWith('/') ? (e) => { e.preventDefault(); window.location.href = link.href } : undefined}
                className="flex items-center gap-1 px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap relative group"
                style={{ color: '#1565C0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1565C0')}>
                {link.name}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Franja azul de frases rotativas ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2E45 100%)',
        borderTop: '1px solid rgba(212,175,55,0.25)',
        padding: '7px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 36, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          opacity: fraseVisible ? 1 : 0,
          transform: fraseVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          <span style={{ fontSize: 18 }}>{FRASES[fraseIdx].emoji}</span>
          <span style={{ color: '#D4AF37', fontWeight: 800, fontSize: 'clamp(11px, 1.6vw, 13px)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            {FRASES[fraseIdx].texto}
          </span>
          <span style={{ fontSize: 18 }}>{FRASES[fraseIdx].emoji}</span>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="lg:hidden border-t border-white/10 overflow-hidden"
            style={{ background: 'rgba(240,240,240,0.98)' }}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="px-4 py-4 space-y-3">
              <form className="flex rounded-lg overflow-hidden border border-gold/30"
                onSubmit={e => { e.preventDefault(); const v = (e.currentTarget.querySelector('input') as HTMLInputElement).value.trim(); if (v) window.location.href = `/buscar?q=${encodeURIComponent(v)}` }}>
                <input type="text" placeholder="Buscar productos..."
                  className="flex-1 bg-navy-light text-white placeholder-gray-500 px-4 py-2.5 outline-none text-sm" />
                <button type="submit" className="px-4 py-2.5" style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}>
                  <Search size={16} className="text-navy" />
                </button>
              </form>
              <div style={{ marginTop: 4 }}>
                <button
                  onClick={() => setMobileCatOpen(v => !v)}
                  className="w-full flex items-center justify-between text-gray-300 hover:text-gold py-2.5 border-b border-white/5 text-sm font-semibold transition-colors">
                  <span>CATEGORÍAS</span>
                  <ChevronDown size={14} style={{ transform: mobileCatOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>
                {mobileCatOpen && (
                  categorias.length === 0 ? (
                    <div className="text-gray-500 text-xs py-2 pl-4">No hay categorías cargadas</div>
                  ) : categorias.map(c => (
                    <a key={c.id} href={`/categorias/${encodeURIComponent(c.nombre)}`}
                      className="block text-gray-400 hover:text-gold py-2 pl-4 border-b border-white/5 text-sm transition-colors"
                      onClick={() => { setMobileOpen(false); setMobileCatOpen(false) }}>
                      {c.emoji} {c.nombre}
                    </a>
                  ))
                )}
              </div>
              {navLinks.map(l => (
                <a key={l.name} href={l.href}
                  className="block text-gray-300 hover:text-gold py-2.5 border-b border-white/5 text-sm font-semibold transition-colors"
                  onClick={() => setMobileOpen(false)}>{l.name}</a>
              ))}
              {/* Redes sociales mobile */}
              <div className="flex gap-2 pt-1">
                {[
                  { name: 'Instagram', href: 'https://www.instagram.com/mayoristauniversal', color: '#FF0090', bg: 'rgba(255,0,144,0.15)', border: 'rgba(255,0,144,0.4)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                  { name: 'Facebook', href: 'https://www.facebook.com/mayoristauniversal', color: '#1565C0', bg: 'rgba(24,119,242,0.15)', border: 'rgba(24,119,242,0.4)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                  { name: 'X', href: 'https://www.x.com/mayoristauniversal', color: '#ffffff', bg: 'rgba(255,255,255,0.12)', border: 'rgba(255,255,255,0.3)', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                ].map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>
                    {s.icon} {s.name}
                  </a>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <a href="https://wa.me/5491164660482"
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold text-center">📱 WhatsApp</a>
                {userName ? (
                  <a href="/mi-cuenta"
                    className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF' }}>
                    👤 Mi cuenta
                  </a>
                ) : (
                  <a href="/login"
                    className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF' }}>
                    Ingresar
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
