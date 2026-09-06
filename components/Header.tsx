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

export default function Header() {
  const router = useRouter()
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search,     setSearch]     = useState('')
  const [catOpen,    setCatOpen]    = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState('')
  const { count, cartOpen, setCartOpen } = useCart()
  const [categorias, setCategorias] = useState<{id:number,nombre:string,emoji:string,subcategorias:string[]}[]>([])
  const catRef = useRef<HTMLDivElement>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)

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

  return (
    <>
    <header className="fixed inset-x-0 z-50 transition-all duration-400"
      style={{ top: 0, background: '#FFFFFF', boxShadow: scrolled ? '0 4px 20px rgba(13,26,58,0.12)' : '0 1px 0 rgba(13,26,58,0.08)' }}>

      {/* ── Main bar ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-2.5">
        <div className="flex items-center gap-4 relative">

          {/* Cart icon — solo desktop */}
          <a href="/" className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF6A3D, #FF8A63)' }}>
            <ShoppingCart size={20} strokeWidth={2.5} color="#fff" />
          </a>

          {/* Logo texto — izquierda en desktop, centrado absoluto en mobile */}
          <motion.a href="/"
            className="hidden lg:flex items-center gap-2.5 flex-shrink-0"
            whileHover={{ scale: 1.02 }}>
            <div className="leading-none">
              <div className="font-display font-black text-2xl tracking-wide"
                style={{ background: 'linear-gradient(135deg,#FF6A3D,#F5E060,#FF6A3D)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }}>
                MAYORISTA
              </div>
              <div className="font-display font-black text-2xl tracking-widest"
                style={{ background: 'linear-gradient(135deg,#FF6A3D,#F5E060,#FF6A3D)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }}>
                UNIVERSAL
              </div>
            </div>
          </motion.a>

          {/* Mobile: ícono carrito a la izquierda + texto centrado absoluto */}
          <a href="/" className="lg:hidden flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF6A3D, #FF8A63)' }}>
            <ShoppingCart size={20} strokeWidth={2.5} color="#fff" />
          </a>
          <div className="lg:hidden absolute left-0 right-0 flex justify-center items-center pointer-events-none" style={{ zIndex: 1 }}>
            <div className="flex items-center gap-2" style={{ transform: 'translateX(37px)' }}>
            <a href="/" className="pointer-events-auto leading-none text-center">
              <div className="font-display font-black text-xl tracking-wide"
                style={{ background: 'linear-gradient(135deg,#FF6A3D,#F5E060,#FF6A3D)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }}>
                MAYORISTA
              </div>
              <div className="font-display font-black text-xl tracking-widest"
                style={{ background: 'linear-gradient(135deg,#FF6A3D,#F5E060,#FF6A3D)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }}>
                UNIVERSAL
              </div>
            </a>
            {/* Iconos redes — al lado derecho del texto */}
            <div className="pointer-events-auto flex items-center gap-1">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/mayoristauniversal26', color: '#FFFFFF', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', border: 'transparent', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { name: 'Facebook', href: 'https://www.facebook.com/mayoristauniversal', color: '#FFFFFF', bg: '#1877F2', border: '#1877F2', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },              ].map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg, border: `1px solid ${s.border}`, color: s.color, flexShrink: 0 }}>
                  {s.icon}
                </a>
              ))}
            </div>
            </div>{/* end translateX wrapper */}
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-2 items-center gap-2">
            {!search && (
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                  background: 'linear-gradient(135deg,#16a34a,#15803d)',
                  color: '#FFFFFF', fontWeight: 800, fontSize: 11.5,
                  padding: '6px 20px 6px 12px',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)',
                  filter: 'drop-shadow(0 3px 8px rgba(22,163,74,0.55))',
                  whiteSpace: 'nowrap', pointerEvents: 'none',
                }}>
                🔍 ¡Buscá acá lo que necesitás!
              </motion.div>
            )}
            <form className="flex w-full rounded-lg overflow-hidden border border-gold/25 focus-within:border-gold/60 transition-colors"
              onSubmit={e => { e.preventDefault(); if (search.trim()) window.location.href = `/buscar?q=${encodeURIComponent(search.trim())}` }}>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar productos, categorías o marcas..."
                className="flex-1 bg-white text-gray-800 placeholder-gray-400 px-4 py-2.5 outline-none text-sm min-w-0" />
              <button type="submit" className="px-5 py-2.5 flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)' }}>
                <Search size={18} className="text-navy" strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

            {/* Social icons */}
            <div className="flex items-center gap-1.5">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/mayoristauniversal26', color: '#FFFFFF', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', border: 'transparent', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { name: 'Facebook', href: 'https://www.facebook.com/mayoristauniversal', color: '#FFFFFF', bg: '#1877F2', border: '#1877F2', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },              ].map(s => (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', border: '1px solid #009ee3', borderRadius: 8, padding: '5px 10px' }}>
              <Image src="/mp-logo.png" alt="Mercado Pago" width={90} height={24} style={{ objectFit: 'contain', display: 'block' }} />
            </div>

            {/* WhatsApp */}
            <motion.a href="https://wa.me/5491164660482" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <MessageCircle size={16} /> WhatsApp
            </motion.a>

            {/* Cart */}
            <motion.button className="relative p-1.5 transition-colors" style={{ color: '#0D47A1' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FF6A3D')}
              onMouseLeave={e => (e.currentTarget.style.color = '#0D47A1')}
              whileHover={{ scale: 1.1 }} onClick={() => setCartOpen(true)}>
              <ShoppingCart size={24} />
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">{count}</span>}
            </motion.button>

            {/* Account */}
            {userName ? (
              <div className="flex items-center gap-2">
                <motion.a href="/mi-cuenta"
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: '#0D47A1' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FF6A3D')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#0D47A1')}
                  whileHover={{ scale: 1.03 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                style={{ color: '#0D47A1' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF6A3D')}
                onMouseLeave={e => (e.currentTarget.style.color = '#0D47A1')}
                whileHover={{ scale: 1.03 }}>
                <span className="text-[11px] leading-none opacity-90">Ingresar / Registrarse</span>
                <span className="text-[12px] font-bold leading-none flex items-center gap-1">Mi cuenta <ChevronDown size={11} /></span>
              </motion.a>
            )}
          </div>

          {/* Mobile: solo cuenta a la derecha */}
          <div className="lg:hidden ml-auto flex items-center gap-2 flex-shrink-0">

            {/* Account */}
            <a href={userName ? '/mi-cuenta' : '/login'} style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: userName ? 'linear-gradient(135deg,#FF6A3D,#FF8A63)' : 'rgba(255,106,61,0.15)',
                border: '1.5px solid rgba(255,106,61,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {userName
                  ? <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF' }}>{userName.charAt(0).toUpperCase()}</span>
                  : <User size={15} color="#FF6A3D" />
                }
              </div>
            </a>

          </div>
        </div>
      </div>

      {/* Mobile search bar — siempre visible */}
      <div className="lg:hidden" style={{ background: '#FFFFFF', borderTop: '1px solid rgba(13,26,58,0.08)' }}>
        {!mobileSearch && (
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              margin: '6px 12px 0', background: 'linear-gradient(135deg,#16a34a,#15803d)',
              color: '#FFFFFF', fontWeight: 800, fontSize: 11,
              padding: '5px 10px 14px',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), 50% 100%, 0 calc(100% - 10px))',
              filter: 'drop-shadow(0 3px 6px rgba(22,163,74,0.5))',
              pointerEvents: 'none',
            }}>
            🔍 ¡Buscá acá lo que necesitás!
          </motion.div>
        )}
        <form className="px-3 py-2 flex gap-2"
          onSubmit={e => { e.preventDefault(); if (mobileSearch.trim()) { window.location.href = `/buscar?q=${encodeURIComponent(mobileSearch.trim())}` } }}>
          <input
            type="text" value={mobileSearch} onChange={e => setMobileSearch(e.target.value)}
            placeholder="Buscar productos, categorías o marcas..."
            className="flex-1 bg-white border border-gold/30 text-gray-800 placeholder-gray-400 rounded-lg px-3 py-2 outline-none text-sm"
          />
          <button type="submit" className="px-4 py-2 rounded-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)' }}>
            <Search size={18} className="text-navy" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="lg:hidden border-t border-white/10 overflow-hidden"
            style={{ background: 'rgba(10,54,128,0.98)' }}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="px-4 py-4 space-y-3">
              <form className="flex rounded-lg overflow-hidden border border-gold/30"
                onSubmit={e => { e.preventDefault(); const v = (e.currentTarget.querySelector('input') as HTMLInputElement).value.trim(); if (v) window.location.href = `/buscar?q=${encodeURIComponent(v)}` }}>
                <input type="text" placeholder="Buscar productos..."
                  className="flex-1 bg-navy-light text-white placeholder-gray-500 px-4 py-2.5 outline-none text-sm" />
                <button type="submit" className="px-4 py-2.5" style={{ background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)' }}>
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
                  { name: 'Instagram', href: 'https://www.instagram.com/mayoristauniversal26', color: '#FF0090', bg: 'rgba(255,0,144,0.15)', border: 'rgba(255,0,144,0.4)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                  { name: 'Facebook', href: 'https://www.facebook.com/mayoristauniversal', color: '#8B7355', bg: 'rgba(24,119,242,0.15)', border: 'rgba(24,119,242,0.4)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },                ].map(s => (
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
                    style={{ background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#FFFFFF' }}>
                    👤 Mi cuenta
                  </a>
                ) : (
                  <a href="/login"
                    className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#FFFFFF' }}>
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
