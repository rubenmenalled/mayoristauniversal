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
  { emoji: '🛒', texto: 'Llevá todo a tu local u hogar con un solo click' },
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
  const [categorias, setCategorias] = useState<{id:number,nombre:string,emoji:string,subcategorias:string[]}[]>([])
  const catRef = useRef<HTMLDivElement>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)
  const [openCat, setOpenCat] = useState<string | null>(null)
  const catBarRef = useRef<HTMLDivElement>(null)
  const [subsByCategory, setSubsByCategory] = useState<Record<string, string[]>>({})
  const [mobileGridOpen, setMobileGridOpen] = useState(false)
  const [mobileSelectedCat, setMobileSelectedCat] = useState<string | null>(null)

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
      if (catBarRef.current && !catBarRef.current.contains(e.target as Node)) {
        setOpenCat(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Cargar subcategorías reales de la DB cuando se abre una categoría (solo desktop)
  useEffect(() => {
    if (!openCat || openCat === '__mobile__') return
    if (subsByCategory[openCat] !== undefined) return
    fetch(`/api/subcategorias?categoria=${encodeURIComponent(openCat)}`)
      .then(r => r.json())
      .then((data: {nombre:string}[]) => {
        const names = (data || []).map((s: {nombre:string}) => s.nombre).filter(Boolean)
        setSubsByCategory(prev => ({ ...prev, [openCat]: names }))
      })
      .catch(() => setSubsByCategory(prev => ({ ...prev, [openCat]: [] })))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCat])

  async function fetchSubs(cat: string) {
    if (subsByCategory[cat] !== undefined) return
    try {
      const res = await fetch(`/api/subcategorias?categoria=${encodeURIComponent(cat)}`)
      const data = await res.json()
      const names = (data || []).map((s: {nombre:string}) => s.nombre).filter(Boolean)
      setSubsByCategory(prev => ({ ...prev, [cat]: names }))
    } catch {
      setSubsByCategory(prev => ({ ...prev, [cat]: [] }))
    }
  }

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
      style={{ top: 38, background: scrolled ? 'rgba(10,54,128,0.98)' : 'rgba(13,71,161,0.95)', backdropFilter: 'blur(16px)' }}>

      {/* ── Main bar ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-2.5">
        <div className="flex items-center gap-4 relative">

          {/* Cart icon — solo desktop */}
          <a href="/" className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C030)' }}>
            <ShoppingCart size={20} strokeWidth={2.5} color="#fff" />
          </a>

          {/* Logo texto — izquierda en desktop, centrado absoluto en mobile */}
          <motion.a href="/"
            className="hidden lg:flex items-center gap-2.5 flex-shrink-0"
            whileHover={{ scale: 1.02 }}>
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

          {/* Mobile: ícono carrito a la izquierda + texto centrado absoluto */}
          <a href="/" className="lg:hidden flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C030)' }}>
            <ShoppingCart size={20} strokeWidth={2.5} color="#fff" />
          </a>
          <div className="lg:hidden absolute left-0 right-0 flex justify-center items-center pointer-events-none" style={{ zIndex: 1 }}>
            <div className="flex items-center gap-2" style={{ transform: 'translateX(37px)' }}>
            <a href="/" className="pointer-events-auto leading-none text-center">
              <div className="font-display font-black text-xl tracking-wide"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F5E060,#D4AF37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }}>
                MAYORISTA
              </div>
              <div className="font-display font-black text-xl tracking-widest"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F5E060,#D4AF37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }}>
                UNIVERSAL
              </div>
            </a>
            {/* Iconos redes — al lado derecho del texto */}
            <div className="pointer-events-auto flex items-center gap-1">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/mayoristauniversal26', color: '#FFFFFF', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', border: 'transparent', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { name: 'Facebook', href: 'https://www.facebook.com/mayoristauniversal', color: '#FFFFFF', bg: '#1877F2', border: '#1877F2', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },                { name: 'Canal WhatsApp', href: 'https://whatsapp.com/channel/0029Vb7ugE42ER6gCX7OAr0T', color: '#FFFFFF', bg: '#25D366', border: '#25D366', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z"/></svg> },
              ].map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg, border: `1px solid ${s.border}`, color: s.color, flexShrink: 0 }}>
                  {s.icon}
                </a>
              ))}
            </div>
            </div>{/* end translateX wrapper */}
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-2">
            <form className="flex w-full rounded-lg overflow-hidden border border-gold/25 focus-within:border-gold/60 transition-colors"
              onSubmit={e => { e.preventDefault(); if (search.trim()) window.location.href = `/buscar?q=${encodeURIComponent(search.trim())}` }}>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar productos, categorías o marcas..."
                className="flex-1 bg-white text-gray-800 placeholder-gray-400 px-4 py-2.5 outline-none text-sm min-w-0" />
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
                { name: 'Instagram', href: 'https://www.instagram.com/mayoristauniversal26', color: '#FFFFFF', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', border: 'transparent', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { name: 'Facebook', href: 'https://www.facebook.com/mayoristauniversal', color: '#FFFFFF', bg: '#1877F2', border: '#1877F2', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },                { name: 'Canal WhatsApp', href: 'https://whatsapp.com/channel/0029Vb7ugE42ER6gCX7OAr0T', color: '#FFFFFF', bg: '#25D366', border: '#25D366', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z"/></svg> },
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
            <motion.button className="relative p-1.5 transition-colors" style={{ color: '#FFFFFF' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
              onMouseLeave={e => (e.currentTarget.style.color = '#FFFFFF')}
              whileHover={{ scale: 1.1 }} onClick={() => setCartOpen(true)}>
              <ShoppingCart size={24} />
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">{count}</span>}
            </motion.button>

            {/* Account */}
            {userName ? (
              <div className="flex items-center gap-2">
                <motion.a href="/mi-cuenta"
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#FFFFFF')}
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
                style={{ color: '#FFFFFF' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                onMouseLeave={e => (e.currentTarget.style.color = '#FFFFFF')}
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

          </div>
        </div>
      </div>

      {/* Mobile search bar — siempre visible */}
      <div className="lg:hidden border-t border-white/10" style={{ background: 'rgba(10,54,128,0.98)' }}>
        <form className="px-3 py-2 flex gap-2"
          onSubmit={e => { e.preventDefault(); if (mobileSearch.trim()) { window.location.href = `/buscar?q=${encodeURIComponent(mobileSearch.trim())}` } }}>
          <input
            type="text" value={mobileSearch} onChange={e => setMobileSearch(e.target.value)}
            placeholder="Buscar productos, categorías o marcas..."
            className="flex-1 bg-white border border-gold/30 text-gray-800 placeholder-gray-400 rounded-lg px-3 py-2 outline-none text-sm"
          />
          <button type="submit" className="px-4 py-2 rounded-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)' }}>
            <Search size={18} className="text-navy" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* ── Barra de categorías ── */}
      {categorias.length > 0 && (
        <div ref={catBarRef} style={{ background: 'rgba(8,45,105,0.98)', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 400 }}>
          <style>{`@keyframes fadeInDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* ── DESKTOP: botón + mega-menú ── */}
          <div className="hidden md:flex" style={{ alignItems: 'center', padding: '0 8px', position: 'relative', zIndex: 400 }}>
            <button
              onClick={() => setOpenCat(openCat === '__desktop__' ? null : '__desktop__')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', color: '#FFFFFF', fontWeight: 800, fontSize: 13, background: openCat === '__desktop__' ? 'rgba(255,255,255,0.15)' : 'none', border: 'none', whiteSpace: 'nowrap', cursor: 'pointer', borderRadius: 6, transition: 'background 0.15s' }}>
              <span style={{ fontSize: 16 }}>☰</span> CATEGORÍAS
              <span style={{ fontSize: 9, transition: 'transform 0.2s', transform: openCat === '__desktop__' ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▼</span>
            </button>

            {/* Accesos directos a categorías top */}
            <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: 2, marginLeft: 6, overflow: 'hidden' }}>
              <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.2)', marginRight: 4, flexShrink: 0 }} />
              {['PELUCHES','JUGUETERIA','LENCERIA','BEBÉ','COTILLON','BELLEZA','PANTUFLAS','ACCESORIOS DE INVIERNO','PERFUMERIA','DECO BAZAR','BLANQUERIA','ELECTRONICA','RELOJES','BIJOUTERIE','LLAVEROS','HERRAMIENTAS']
                .map(name => categorias.find(c => c.nombre.toUpperCase() === name))
                .filter((c): c is (typeof categorias)[number] => Boolean(c))
                .map(cat => (
                  <a key={cat.id} href={`/categorias/${encodeURIComponent(cat.nombre)}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 10px', color: '#FFFFFF', fontWeight: 700, fontSize: 12.5, textDecoration: 'none', whiteSpace: 'nowrap', borderRadius: 6, transition: 'background 0.15s, color 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#D4AF37' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FFFFFF' }}>
                    <span style={{ fontSize: 14 }}>{cat.emoji}</span>{cat.nombre}
                  </a>
                ))}
            </nav>

            {openCat === '__desktop__' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 500, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.25)', width: 720, padding: '16px', animation: 'fadeInDown 0.15s ease' }}>
                {!openCat || openCat === '__desktop__' ? (
                  /* Grilla de todas las categorías */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {categorias.map((cat) => (
                      <button key={cat.id}
                        onClick={() => { setOpenCat(cat.nombre); fetchSubs(cat.nombre) }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', background: '#F9F9F9', border: '1px solid #EEE', borderRadius: 8, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FAF3E8'; e.currentTarget.style.borderColor = '#FFFFFF' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F9F9F9'; e.currentTarget.style.borderColor = '#EEE' }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.emoji}</span>
                        <span style={{ color: '#333', fontWeight: 700, fontSize: 11, lineHeight: 1.2 }}>{cat.nombre}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {/* Panel de subcategorías cuando se selecciona una cat desde el mega-menú */}
            {openCat && openCat !== '__desktop__' && openCat !== '__mobile__' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 500, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.25)', width: 480, padding: '14px', animation: 'fadeInDown 0.15s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #F0F0F0' }}>
                  <button onClick={() => setOpenCat('__desktop__')}
                    style={{ background: 'none', border: 'none', color: '#FFFFFF', fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ← Volver
                  </button>
                  <span style={{ color: '#CCC' }}>|</span>
                  <span style={{ fontSize: 20 }}>{categorias.find(c => c.nombre === openCat)?.emoji}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 14 }}>{openCat}</span>
                </div>
                {subsByCategory[openCat] === undefined ? (
                  <div style={{ color: '#999', fontSize: 12, padding: '8px 0' }}>Cargando...</div>
                ) : subsByCategory[openCat].length === 0 ? (
                  <div style={{ color: '#bbb', fontSize: 12, padding: '8px 0' }}>Sin subcategorías</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                    {subsByCategory[openCat].map((sub) => (
                      <a key={sub} href={`/categorias/${encodeURIComponent(openCat)}?sub=${encodeURIComponent(sub)}`}
                        onClick={() => setOpenCat(null)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', background: '#FAF3E8', border: '1px solid rgba(200,168,130,0.12)', borderRadius: 8, color: '#444', fontWeight: 600, fontSize: 12, textDecoration: 'none', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#E8F0E4'; e.currentTarget.style.color = '#FFFFFF' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FAF3E8'; e.currentTarget.style.color = '#444' }}>
                        <span style={{ color: '#FFFFFF', fontSize: 10, flexShrink: 0 }}>▸</span>{sub}
                      </a>
                    ))}
                  </div>
                )}
                <a href={`/categorias/${encodeURIComponent(openCat)}`}
                  onClick={() => setOpenCat(null)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, padding: '10px', background: '#FFFFFF', borderRadius: 8, color: '#FFFFFF', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
                  Ver todos los productos →
                </a>
              </div>
            )}
          </div>

          {/* ── MOBILE: overlay fullscreen ── */}
          <div className="md:hidden">
            {/* Botón toggle */}
            <button
              onClick={() => { setMobileGridOpen(v => !v); setMobileSelectedCat(null) }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 16px', background: 'none', border: 'none', color: '#FFFFFF', fontWeight: 800, fontSize: 13, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <span>📋 TODAS LAS CATEGORÍAS</span>
              <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: mobileGridOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▼</span>
            </button>
          </div>

          {/* Overlay fullscreen para mobile — fuera del header fijo */}
          {mobileGridOpen && (
            <div className="md:hidden" style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end',
            }} onClick={e => { if (e.target === e.currentTarget) { setMobileGridOpen(false); setMobileSelectedCat(null) } }}>
              <div style={{
                background: '#FFFFFF', borderRadius: '20px 20px 0 0',
                maxHeight: '80vh', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Header del panel */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '1px solid #EEE', flexShrink: 0 }}>
                  {mobileSelectedCat ? (
                    <button onClick={() => setMobileSelectedCat(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#FFFFFF', fontWeight: 700, fontSize: 14, cursor: 'pointer', padding: 0 }}>
                      ← Volver
                    </button>
                  ) : (
                    <span style={{ fontWeight: 900, fontSize: 15, color: '#333' }}>📋 Categorías</span>
                  )}
                  <button onClick={() => { setMobileGridOpen(false); setMobileSelectedCat(null) }}
                    style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999', lineHeight: 1, padding: '0 4px' }}>✕</button>
                </div>

                {/* Contenido scrolleable */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
                  {!mobileSelectedCat ? (
                    /* Grid de categorías */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {categorias.map((cat) => (
                        <button key={cat.id}
                          onClick={() => { setMobileSelectedCat(cat.nombre); fetchSubs(cat.nombre) }}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 6px', background: '#F9F9F9', border: '1px solid #EEE', borderRadius: 10, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                          <span style={{ fontSize: 24 }}>{cat.emoji}</span>
                          <span style={{ color: '#333', fontWeight: 700, fontSize: 10, textAlign: 'center', lineHeight: 1.3 }}>{cat.nombre}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Panel subcategorías */
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '4px 0' }}>
                        <span style={{ fontSize: 26 }}>{categorias.find(c => c.nombre === mobileSelectedCat)?.emoji}</span>
                        <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 16 }}>{mobileSelectedCat}</span>
                      </div>
                      {subsByCategory[mobileSelectedCat] === undefined ? (
                        <div style={{ textAlign: 'center', color: '#999', padding: 24, fontSize: 13 }}>Cargando subcategorías...</div>
                      ) : subsByCategory[mobileSelectedCat].length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#bbb', padding: 16, fontSize: 13 }}>Sin subcategorías</div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                          {subsByCategory[mobileSelectedCat].map((sub) => (
                            <a key={sub}
                              href={`/categorias/${encodeURIComponent(mobileSelectedCat)}?sub=${encodeURIComponent(sub)}`}
                              onClick={() => { setMobileGridOpen(false); setMobileSelectedCat(null) }}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', background: '#FAF3E8', border: '1px solid rgba(200,168,130,0.15)', borderRadius: 10, color: '#333', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                              <span style={{ color: '#FFFFFF', fontSize: 11, flexShrink: 0 }}>▸</span>{sub}
                            </a>
                          ))}
                        </div>
                      )}
                      <a href={`/categorias/${encodeURIComponent(mobileSelectedCat)}`}
                        onClick={() => { setMobileGridOpen(false); setMobileSelectedCat(null) }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, padding: '13px', background: '#FFFFFF', borderRadius: 12, color: '#FFFFFF', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
                        Ver todos los productos →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Franja azul de frases rotativas ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
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
            style={{ background: 'rgba(10,54,128,0.98)' }}
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
