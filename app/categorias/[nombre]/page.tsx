'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, ShoppingCart, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useCart, RETAIL_MARKUP } from '@/lib/CartContext'
import { minDeCatalogo } from '@/lib/minimos'
import { TextReveal } from '@/components/ui/cascade-text'
import CartSidebar from '@/components/CartSidebar'

interface Producto {
  id: number; name: string; brand: string; category: string
  subcategory?: string; price: number; wholesalePrice: number; minOrder: number
  rating: number; reviews: number; image: string; images?: string[]
  badge?: string; discount?: number; location: string; descripcion?: string
}

interface Subcategoria {
  id: number; nombre: string; emoji: string; categoria_id: number; preview_image?: string
}

const BADGE: Record<string, string> = {
  OFERTA: 'bg-red-600', NUEVO: 'bg-green-600', HOT: 'bg-orange-500', TOP: 'bg-yellow-500', DESTACADO: 'bg-yellow-500',
}

const EXCL_MARR = ['MOCHILAS-CARTERAS','MOCHILAS Y CARTERAS','MOCHILAS','BANDOLERAS','BOLSOS MATERNALES','CARTERAS']

function getBulkInfo(category: string, subcategory: string, minOrder: number) {
  const cat = (category || '').toUpperCase()
  const sub = (subcategory || '').toUpperCase()
  if (cat !== 'ACCESORIOS DE PELO' && cat !== 'MARROQUINERIA' && cat !== 'LIBRERIA' && cat !== 'BELLEZA' && cat !== 'ACCESORIOS DE INVIERNO') return null
  if (cat === 'MARROQUINERIA' && EXCL_MARR.includes(sub)) return { badge: false, sku: true, label: 'Mayorista:', badgeText: '' }
  if (cat === 'LIBRERIA' || cat === 'ACCESORIOS DE PELO' || cat === 'BELLEZA' || cat === 'ACCESORIOS DE INVIERNO') {
    const badgeText = minOrder >= 20
      ? `📦 PRECIO POR CAJA (x${minOrder}) DE COLORES SURTIDOS`
      : `📦 PRECIO POR PAQUETE (x${minOrder}) DE COLORES SURTIDOS`
    const label = minOrder >= 20 ? `Precio x caja (x${minOrder}):` : 'Precio x docena:'
    return { badge: true, sku: true, label, badgeText }
  }
  return { badge: true, sku: true, label: 'Precio x docena:', badgeText: '📦 PRECIO POR DOCENA (x12) DE COLORES SURTIDOS' }
}

const BG_SUBS = [
  '#E8EAF6','#FCE4EC','#E8F5E9','#FFF8E1','#E3F2FD',
  '#F3E5F5','#E0F7FA','#FBE9E7','#EDE7F6','#E8F5E9',
  '#FFF3E0','#E1F5FE','#FCE4EC','#F1F8E9','#E8EAF6',
]

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
  const searchParams = useSearchParams()
  const nombreDecoded = decodeURIComponent(nombre as string)

  const { addItem, count, cartOpen, setCartOpen, isWholesale } = useCart()
  const [productos, setProductos] = useState<Producto[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])
  const [subActiva, setSubActiva] = useState<string>(
    searchParams.get('sub') ? decodeURIComponent(searchParams.get('sub')!) : ''
  )
  const [subSubActiva, setSubSubActiva] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Sub-subcategorías hardcodeadas por subcategoría
  const SUB_SUBS: Record<string, { nombre: string; emoji: string; imagen: string; filtro: (p: Producto) => boolean }[]> = {}
  const [pagina, setPagina]           = useState(0)
  const [hayMas, setHayMas]           = useState(false)
  const [loadingMas, setLoadingMas]   = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [busquedaInterna, setBusquedaInterna] = useState('')
  const [productosBusqueda, setProductosBusqueda] = useState<Producto[]>([])
  const [loadingBusqueda, setLoadingBusqueda] = useState(false)
  const [lightbox, setLightbox] = useState<Producto | null>(null)
  const [lightboxImgIdx, setLightboxImgIdx] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [dragStart, setDragStart] = useState<{x:number,y:number}|null>(null)
  const [offset, setOffset] = useState({x:0,y:0})
  const [dragging, setDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function normalizar(s: string) {
    return (s || '').toLowerCase().trim()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ')
  }

  function buildUrl(cat: string, sub: string, pg: number) {
    let url = '/api/productos-publicos?categoria=' + encodeURIComponent(cat)
    if (sub && sub !== '__todos__') url += '&subcategoria=' + encodeURIComponent(sub)
    url += '&page=' + pg
    return url
  }

  // Cargar subcategorías al entrar
  useEffect(() => {
    fetch('/api/subcategorias?categoria=' + encodeURIComponent(nombreDecoded))
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSubcategorias(data)
        if (!Array.isArray(data) || data.length === 0) {
          setLoading(true)
          fetch(buildUrl(nombreDecoded, '', 0))
            .then(r => r.json())
            .then((d: Producto[]) => {
              const lista = Array.isArray(d) ? d : []
              setProductos(lista)
              setHayMas(lista.length === 60)
              setPagina(0)
              setLoading(false)
            })
            .catch(() => setLoading(false))
        } else if (!subActiva) {
          // Mostrar los productos directamente al entrar (debajo de las
          // subcategorías). Las subcategorías quedan arriba para filtrar.
          setLoading(true)
          fetch(buildUrl(nombreDecoded, '', 0))
            .then(r => r.json())
            .then((d: Producto[]) => {
              const lista = Array.isArray(d) ? d : []
              setProductos(lista)
              setHayMas(lista.length === 60)
              setPagina(0)
              setLoading(false)
            })
            .catch(() => setLoading(false))
        } else {
          setLoading(false)
        }
      })
      .catch(() => setLoading(false))
  }, [nombreDecoded])

  // Cargar productos cuando cambia la subcategoría activa
  useEffect(() => {
    if (!subActiva || subActiva === '__todos__') {
      if (subcategorias.length === 0) return
      setLoading(true)
      fetch(buildUrl(nombreDecoded, '', 0))
        .then(r => r.json())
        .then((d: Producto[]) => {
          const lista = Array.isArray(d) ? d : []
          setProductos(lista); setHayMas(lista.length === 60); setPagina(0); setLoading(false)
        })
        .catch(() => setLoading(false))
      return
    }
    setLoading(true)
    setProductos([])
    setPagina(0)
    fetch(buildUrl(nombreDecoded, subActiva, 0))
      .then(r => r.json())
      .then((d: Producto[]) => {
        const lista = Array.isArray(d) ? d : []
        setProductos(lista); setHayMas(lista.length === 60); setPagina(0); setLoading(false)
      })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subActiva, nombreDecoded])

  function cargarMas() {
    const nextPage = pagina + 1
    setLoadingMas(true)
    fetch(buildUrl(nombreDecoded, subActiva, nextPage))
      .then(r => r.json())
      .then((d: Producto[]) => {
        const lista = Array.isArray(d) ? d : []
        setProductos(prev => [...prev, ...lista])
        setHayMas(lista.length === 60)
        setPagina(nextPage)
        setLoadingMas(false)
      })
      .catch(() => setLoadingMas(false))
  }

  // Búsqueda interna: si hay subcategoría activa busca solo en ella, si no en toda la categoría
  useEffect(() => {
    if (!busquedaInterna.trim()) { setProductosBusqueda([]); return }
    setLoadingBusqueda(true)
    const timer = setTimeout(() => {
      const subParam = subActiva && subActiva !== '__todos__'
        ? `&subcategoria=${encodeURIComponent(subActiva)}`
        : ''
      fetch(`/api/productos-publicos?categoria=${encodeURIComponent(nombreDecoded)}${subParam}&q=${encodeURIComponent(busquedaInterna.trim())}`)
        .then(r => r.json())
        .then(d => { setProductosBusqueda(Array.isArray(d) ? d : []); setLoadingBusqueda(false) })
        .catch(() => setLoadingBusqueda(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [busquedaInterna, nombreDecoded, subActiva])

  // Scroll infinito: carga la siguiente tanda (de a 60) al acercarse al final,
  // en vez de un botón "Ver más". Misma velocidad, más cómodo.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hayMas || loadingMas || busquedaInterna.trim()) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) cargarMas()
    }, { rootMargin: '500px' })
    obs.observe(el)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hayMas, loadingMas, busquedaInterna, pagina])

  // Filtro de sub-subcategoría (client-side)
  const subSubConfig = subActiva && SUB_SUBS[subActiva] && subSubActiva && subSubActiva !== '__todos__'
    ? SUB_SUBS[subActiva].find(ss => ss.nombre === subSubActiva)
    : null

  const porSubcategoria = subActiva === '' || subActiva === '__todos__'
    ? productos
    : productos.filter(p => {
        if (p.subcategory && p.subcategory.trim() !== '') {
          return p.subcategory.toLowerCase() === subActiva.toLowerCase()
        }
        const keyword = subActiva.toLowerCase().split(' ')[0]
        return p.name?.toLowerCase().includes(keyword)
      })

  const porSubSub = subSubConfig
    ? porSubcategoria.filter(subSubConfig.filtro)
    : porSubcategoria

  // Si hay búsqueda activa → usar resultados de la API (busca en toda la categoría)
  // Si no hay búsqueda → usar los productos del filtro local
  const productosFiltrados = busquedaInterna.trim() !== ''
    ? productosBusqueda
    : porSubSub

  // Barra fija del mínimo: aparece al scrollear (sticky no anda por el overflow del body)
  const [showFixedMin, setShowFixedMin] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowFixedMin(((document.scrollingElement?.scrollTop) || 0) > 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const minVal = (subActiva && subActiva.toUpperCase() === 'FITTZ MASCOTAS') ? 300000 : minDeCatalogo(nombreDecoded)

  // Cuenta regresiva Día del Niño (16 de agosto) — solo catálogos de niños
  const esNino = ['PELUCHES', 'PELUCHES DE PERSONAJES', 'BEBÉ', 'JUGUETERIA'].includes(nombreDecoded.toUpperCase())
  const [diasNino, setDiasNino] = useState<number | null>(null)
  const [diasAmigo, setDiasAmigo] = useState<number | null>(null)
  useEffect(() => {
    const now = new Date()
    const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dias = (d: Date) => Math.max(0, Math.ceil((d.getTime() - hoy.getTime()) / 86400000))
    setDiasNino(dias(new Date(2026, 7, 16)))  // 16 ago 2026
    setDiasAmigo(dias(new Date(2026, 6, 20))) // 20 jul 2026
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0B1E3F 0%, #13294f 100%)', paddingTop: 38 }}>
      {/* Header — debajo del AnnouncementBar (38px fijo) */}
      <div style={{
        background: 'rgba(13,71,161,0.95)', borderBottom: '1px solid rgba(255,106,61,0.2)',
        padding: '16px 24px', position: 'sticky', top: 38, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Fila 1: navegación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.push('/')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#FF6A3D', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              <ArrowLeft size={16} /> Inicio
            </button>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 18, flex: 1 }}>{nombreDecoded}</div>
            <a href="/catalogo" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)',
              color: '#FFFFFF', fontWeight: 900, fontSize: 11,
              padding: '5px 12px', borderRadius: 8, textDecoration: 'none',
              whiteSpace: 'nowrap', letterSpacing: '0.04em', flexShrink: 0,
            }}>
              📋 VER CATÁLOGO
            </a>
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF', padding: 4, flexShrink: 0 }}>
              <ShoppingCart size={22} />
              {count > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#FF6A3D', color: '#FFFFFF', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{count}</span>}
            </button>
          </div>
          {/* Fila 2: buscador interno */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', border: '1.5px solid rgba(255,106,61,0.3)', borderRadius: 10, padding: '7px 14px', transition: 'border-color 0.2s' }}
            onFocus={() => {}} >
            <input
              type="text"
              value={busquedaInterna}
              onChange={e => setBusquedaInterna(e.target.value)}
              placeholder={subActiva && subActiva !== '__todos__' ? `Buscar en ${subActiva}...` : `Buscar en ${nombreDecoded}...`}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#333', background: 'transparent', minWidth: 0 }}
            />
            {busquedaInterna ? (
              <button onClick={() => setBusquedaInterna('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>✕</button>
            ) : (
              <Search size={16} color="#FFFFFF" style={{ flexShrink: 0 }} />
            )}
          </div>
        </div>
      </div>

      {/* Cartel informativo LLAVEROS */}
      {nombreDecoded.toUpperCase() === 'LLAVEROS' && !busquedaInterna.trim() && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFF8E1 0%, #FFF3CD 100%)',
            border: '2px solid #FF6A3D',
            borderRadius: 14,
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>🔑</span>
            <div>
              <div style={{ color: '#92660A', fontWeight: 900, fontSize: 15, marginBottom: 4 }}>
                Pedido mínimo: 6 llaveros
              </div>
              <div style={{ color: '#7a5c1e', fontSize: 13, lineHeight: 1.5 }}>
                Podés combinar distintos modelos — 1 de cada uno hasta completar los 6 surtidos. ¡Elegí los que más te gusten!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-subcategorías como tarjetas — cuando hay subActiva con sub-subs y no hay subSubActiva */}
      {subActiva && SUB_SUBS[subActiva] && !subSubActiva && !busquedaInterna.trim() && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ color: '#FF6A3D', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
            Seleccioná una categoría
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {/* Tarjeta "Ver todos" */}
            <motion.div
              onClick={() => setSubSubActiva('__todos__')}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              style={{ position: 'relative', height: 160, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: '#E8EAF6', transition: 'transform 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.72) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 40 }}>🧸</span>
                <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>VER TODOS</span>
                <span style={{ color: '#FF6A3D', fontSize: 12, fontWeight: 700 }}>Ver productos →</span>
              </div>
            </motion.div>
            {/* Tarjetas de sub-subcategorías */}
            {SUB_SUBS[subActiva].map((ss, i) => (
              <motion.div key={ss.nombre}
                onClick={() => setSubSubActiva(ss.nombre)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.05 }}
                style={{ position: 'relative', height: 160, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: BG_SUBS[(i + 1) % BG_SUBS.length], transition: 'transform 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.72) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ fontSize: 40 }}>{ss.emoji}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>{ss.nombre}</span>
                  <span style={{ color: '#FF6A3D', fontSize: 12, fontWeight: 700 }}>Ver productos →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Cuenta regresiva Día del Amigo — TODOS los catálogos */}
      {diasAmigo !== null && diasAmigo > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 16px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px,2vw,16px)', flexWrap: 'wrap',
            background: 'linear-gradient(135deg,#0EA5E9 0%,#14B8A6 55%,#22C55E 100%)',
            borderRadius: 14, padding: '12px 18px', boxShadow: '0 6px 20px rgba(13,148,136,0.32)', textAlign: 'center',
          }}>
            <span style={{ fontSize: 26 }}>🤝</span>
            <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 'clamp(15px,2.2vw,20px)', letterSpacing: '0.02em' }}>
              ¡Faltan{' '}
              <span style={{ background: '#FFFFFF', color: '#0E7490', padding: '2px 12px', borderRadius: 99, fontWeight: 900, fontSize: 'clamp(17px,2.6vw,24px)' }}>{diasAmigo} días</span>
              {' '}para el DÍA DEL AMIGO!
            </span>
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 'clamp(11px,1.6vw,13px)', opacity: 0.96 }}>⏰ 20 de julio · ¡Armá tu pedido!</span>
          </div>
        </div>
      )}

      {/* Cuenta regresiva Día del Niño — catálogos de niños */}
      {esNino && diasNino !== null && diasNino > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 16px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px,2vw,16px)', flexWrap: 'wrap',
            background: 'linear-gradient(135deg,#FF6A3D 0%,#FF4D8D 55%,#7C3AED 100%)',
            borderRadius: 14, padding: '12px 18px', boxShadow: '0 6px 20px rgba(124,58,237,0.32)', textAlign: 'center',
          }}>
            <span style={{ fontSize: 26 }}>🎁</span>
            <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 'clamp(15px,2.2vw,20px)', letterSpacing: '0.02em' }}>
              ¡Faltan{' '}
              <span style={{ background: '#FFFFFF', color: '#E0327A', padding: '2px 12px', borderRadius: 99, fontWeight: 900, fontSize: 'clamp(17px,2.6vw,24px)' }}>{diasNino} días</span>
              {' '}para el DÍA DEL NIÑO!
            </span>
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 'clamp(11px,1.6vw,13px)', opacity: 0.96 }}>⏰ 16 de agosto · ¡Armá tu pedido!</span>
          </div>
        </div>
      )}

      {/* Mínimo de compra — arriba de todo, siempre visible (antes de VER TODOS/subcategorías) */}
      {minVal > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 16px 0' }}>
          <div style={{ background: 'linear-gradient(135deg,#FF6A3D,#E0521F)', border: '2px solid #FFD7C2', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 6px 20px rgba(224,82,31,0.35)' }}>
            <span style={{ fontSize: 26 }}>⚠️</span>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>Mínimo de compra en este catálogo: ${minVal.toLocaleString('es-AR')}</div>
              <div style={{ color: '#FFE8DD', fontWeight: 700, fontSize: 12.5, marginTop: 2 }}>Cada rubro se compra por separado · no se combinan distintos catálogos.</div>
            </div>
          </div>
        </div>
      )}

      {/* Subcategorías como tarjetas — solo si no hay ninguna activa */}
      {subcategorias.length > 0 && !subActiva && !loading && !busquedaInterna.trim() && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
          {/* Botón ver todos los productos de la categoría */}
          <button onClick={() => setSubActiva('__todos__')}
            style={{ width: '100%', marginBottom: 20, padding: '16px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#0D2C54', fontWeight: 900, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(255,106,61,0.3)' }}>
            🛍️ VER TODOS LOS PRODUCTOS DE {nombreDecoded} →
          </button>
          <div style={{ color: '#FF6A3D', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
            O elegí una subcategoría
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {/* Tarjetas de subcategorías */}
            {subcategorias.map((sub, i) => {
              const FALLBACK_IMGS: Record<string, string> = {
                'BUBBLE': 'https://usimg.k2049.com/files/x/bb5e793a31f0477c88994b2decee6035.jpg',
              }
              const primeraFoto = sub.preview_image || FALLBACK_IMGS[sub.nombre.toUpperCase()] || undefined
              const bg = BG_SUBS[i % BG_SUBS.length]
              return (
                <motion.div key={sub.id}
                  onClick={() => setSubActiva(sub.nombre)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ position: 'relative', height: 160, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: bg, transition: 'transform 0.2s ease', }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>

                  {primeraFoto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={primeraFoto} alt={sub.nombre} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'auto' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.72) 100%)' }} />
                  {((sub as any).count ?? 0) >= 10 && (
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 5, background: 'rgba(255,106,61,0.95)', color: '#0B1E3F', fontWeight: 900, fontSize: 10, padding: '3px 8px', borderRadius: 99, boxShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>
                      {(sub as any).count} artículos
                    </div>
                  )}
                  {['FATTZ IMPORT', 'FITTZ MASCOTAS'].includes(sub.nombre.toUpperCase()) && (
                    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 6, background: 'linear-gradient(135deg,#FF6A3D,#E0521F)', color: '#FFFFFF', fontWeight: 900, fontSize: 10.5, padding: '4px 9px', borderRadius: 99, boxShadow: '0 2px 8px rgba(0,0,0,0.45)', letterSpacing: '0.02em' }}>
                      ⚠️ Mínimo de compra $300.000
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4, padding: 12 }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>{sub.nombre}</span>
                    <span style={{ color: '#FF6A3D', fontSize: 12, fontWeight: 700 }}>Ver productos →</span>
                  </div>
                </motion.div>
              )
            })}

            {/* Botón WhatsApp lentes de sol — solo en LENTES */}
            {nombreDecoded.toUpperCase() === 'LENTES' && (
              <motion.a
                href="https://wa.me/5491164660482?text=%C2%A1Hola!%20Quiero%20ver%20m%C3%A1s%20de%20200%20modelos%20de%20lentes%20de%20sol%20%F0%9F%95%B6%EF%B8%8F"
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: subcategorias.length * 0.05 }}
                style={{
                  position: 'relative', height: 160, borderRadius: 12, overflow: 'hidden',
                  cursor: 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.5)',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: 16, textDecoration: 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(22,163,74,0.7)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(22,163,74,0.5)' }}
              >
                <span style={{ fontSize: 36 }}>💬</span>
                <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 13, textAlign: 'center', lineHeight: 1.4, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                  Para ver más de 200 modelos de lentes de sol pedir por WhatsApp
                </span>
                <span style={{
                  background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.6)',
                  borderRadius: 20, padding: '5px 16px',
                  color: '#FFFFFF', fontWeight: 900, fontSize: 12, letterSpacing: '0.05em',
                }}>
                  CONSULTAR AHORA →
                </span>
              </motion.a>
            )}

            {/* Botón WhatsApp relojes surtidos — solo en RELOJES */}
            {nombreDecoded.toUpperCase() === 'RELOJES' && (
              <motion.a
                href="https://wa.me/5491164660482?text=%C2%A1Hola!%20Quiero%20ver%20m%C3%A1s%20de%20250%20relojes%20surtidos%20%F0%9F%95%90"
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: subcategorias.length * 0.05 }}
                style={{
                  position: 'relative', height: 160, borderRadius: 12, overflow: 'hidden',
                  cursor: 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.5)',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: 16, textDecoration: 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(22,163,74,0.7)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(22,163,74,0.5)' }}
              >
                <span style={{ fontSize: 36 }}>💬</span>
                <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 13, textAlign: 'center', lineHeight: 1.4, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                  Para ver más de 250 relojes surtidos, pedidos solo por WhatsApp
                </span>
                <span style={{
                  background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.6)',
                  borderRadius: 20, padding: '5px 16px',
                  color: '#FFFFFF', fontWeight: 900, fontSize: 12, letterSpacing: '0.05em',
                }}>
                  CONSULTAR AHORA →
                </span>
              </motion.a>
            )}
          </div>
        </div>
      )}

      {/* Content — productos */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>

        {/* Botón volver — nivel 3: volver a BUBBLE */}
        {subActiva && subSubActiva && SUB_SUBS[subActiva] && (
          <button onClick={() => setSubSubActiva('')}
            style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,106,61,0.4)', borderRadius: 20, padding: '8px 16px', color: '#FF6A3D', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ← Volver a {subActiva}
          </button>
        )}

        {/* Botón volver — nivel 2: volver a subcategorías (solo si no hay sub-subs pendientes de elegir) */}
        {subActiva && subcategorias.length > 0 && (!SUB_SUBS[subActiva] || subSubActiva) && (
          <button onClick={() => { setSubActiva(''); setSubSubActiva('') }}
            style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,106,61,0.4)', borderRadius: 20, padding: '8px 16px', color: '#FF6A3D', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ← Volver a subcategorías
          </button>
        )}

        {/* Botón volver — cuando estoy en sub-subs picker (BUBBLE sin subSubActiva), volver a subcategorías */}
        {subActiva && SUB_SUBS[subActiva] && !subSubActiva && subcategorias.length > 0 && (
          <button onClick={() => setSubActiva('')}
            style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,106,61,0.4)', borderRadius: 20, padding: '8px 16px', color: '#FF6A3D', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ← Volver a subcategorías
          </button>
        )}

        {/* Barra FIJA del mínimo — aparece al scrollear, pegada bajo la barra de avisos (38px) */}
        {minVal > 0 && (
          <div style={{
            position: 'fixed', top: 38, left: 0, right: 0, zIndex: 45,
            transform: showFixedMin ? 'translateY(0)' : 'translateY(-130%)',
            transition: 'transform 0.25s ease', pointerEvents: 'none',
            background: 'linear-gradient(135deg,#FF6A3D,#E0521F)',
            boxShadow: '0 4px 14px rgba(11,30,63,0.45)',
            padding: '7px 16px', textAlign: 'center',
            color: '#FFFFFF', fontWeight: 900, fontSize: 13, letterSpacing: '0.02em',
          }}>
            🛒 Mínimo de compra en este catálogo: ${minVal.toLocaleString('es-AR')}
          </div>
        )}

        {/* No mostrar productos si estamos en el picker de sub-subcategorías */}
        {subActiva && SUB_SUBS[subActiva] && !subSubActiva && !busquedaInterna.trim() ? null : (loading || loadingBusqueda) ? (
          <div style={{ textAlign: 'center', color: '#FFFFFF', padding: 80, fontSize: 16 }}>{loadingBusqueda ? `Buscando "${busquedaInterna}"...` : 'Cargando productos...'}</div>
        ) : productosFiltrados.length === 0 && (!subcategorias.length || subActiva || busquedaInterna.trim()) ? (
          <div style={{ textAlign: 'center', padding: 80, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,106,61,0.15)', borderRadius: 20 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>
              {busquedaInterna.trim() ? `Sin resultados para "${busquedaInterna}"` : subActiva ? `No hay productos en ${subActiva}` : `No hay productos en ${nombreDecoded} todavía`}
            </div>
            {(subActiva || busquedaInterna.trim()) && (
              <button onClick={() => { setSubActiva(''); setBusquedaInterna('') }}
                style={{ marginTop: 16, background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', border: 'none', borderRadius: 10, padding: '10px 24px', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer' }}>
                Ver todos
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 24 }}>
              {busquedaInterna.trim()
                ? <><span style={{ color: '#FF6A3D', fontWeight: 700 }}>{productosFiltrados.length}</span> resultado{productosFiltrados.length !== 1 ? 's' : ''} para <span style={{ color: '#FF6A3D', fontWeight: 700 }}>"{busquedaInterna}"</span></>
                : <>{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} en <span style={{ color: '#FF6A3D', fontWeight: 700 }}>{subActiva || nombreDecoded}</span></>
              }
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
              .prod-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
              @media (hover: hover) { .prod-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(255,106,61,0.2); } }
              .prod-hover-img { opacity: 0; transition: opacity 0.35s ease; pointer-events: none; }
              @media (hover: hover) { .prod-card:hover .prod-hover-img { opacity: 1; } }
              .cat-prod-grid { grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); }
              @media (max-width: 640px) { .cat-prod-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; } }
            ` }} />
            <div className="cat-prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
              {productosFiltrados.map((p, i) => (
                <div key={p.id}
                  className="prod-card rounded-xl overflow-hidden relative"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    opacity: 1, animation: i < 12 ? `fadeUp 0.3s ease ${Math.min(i * 0.03, 0.25)}s both` : 'none' }}
                >

                  <div style={{ position: 'relative', height: 190, background: nombreDecoded.toUpperCase() === 'ELECTRONICA' ? '#FFFFFF' : '#F8F8F8', overflow: 'hidden', cursor: p.image ? 'zoom-in' : 'default' }}
                    onClick={() => { if (p.image) { setLightbox(p); setLightboxImgIdx(0) } }}>
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className={nombreDecoded.toUpperCase() === 'ELECTRONICA' ? 'object-contain' : 'object-cover'} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px" quality={75} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>📦</div>
                    )}
                    {/* 2da imagen: aparece al pasar el mouse (hover) */}
                    {p.images && p.images.length > 1 && (
                      <div className="prod-hover-img" style={{ position: 'absolute', inset: 0 }}>
                        <Image src={p.images[1]} alt={p.name} fill className={nombreDecoded.toUpperCase() === 'ELECTRONICA' ? 'object-contain' : 'object-cover'} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px" quality={75} />
                      </div>
                    )}
                    {/* Tapar watermark CX en fotos de marca XC */}
                    {p.image && p.brand?.toUpperCase() === 'XC' && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 42, background: `linear-gradient(to bottom, ${nombreDecoded.toUpperCase() === 'ELECTRONICA' ? '#FFFFFF' : '#F8F8F8'} 55%, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
                    )}
                    {p.image && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '2px 5px', fontSize: 10, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 3 }}>
                        🔍{p.images && p.images.length > 1 && <span style={{ fontSize: 9, color: '#FF6A3D', fontWeight: 700 }}>{p.images.length}📷</span>}
                      </div>
                    )}
                    {(p.discount ?? 0) > 0 && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#dc2626', color: '#FFFFFF', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 99 }}>-{p.discount}%</span>
                    )}
                    {p.badge && p.badge !== 'x6 UNIDADES' && (
                      <span className={`absolute top-2 right-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full ${BADGE[p.badge] ?? 'bg-gray-600'}`}>{p.badge}</span>
                    )}
                    {p.badge === 'x6 UNIDADES' && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(135deg,#7C3AED,#A855F7)', padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <span style={{ fontSize: 13 }}>🎁</span>
                        <span style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 900, letterSpacing: '0.06em' }}>PRECIO POR 6 UNIDADES</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 8 }}>
                    {p.brand && <div style={{ color: '#9CA3AF', fontSize: 9, fontWeight: 600, marginBottom: 1 }}>Marca: {p.brand}</div>}
                    {p.location && p.location !== 'Buenos Aires' && p.location !== 'POP' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,106,61,0.15)', border: '1px solid rgba(255,106,61,0.35)', borderRadius: 5, padding: '2px 6px', marginBottom: 3, width: 'fit-content' }}>
                        <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 9 }}>COD</span>
                        <span style={{ color: '#111827', fontWeight: 700, fontSize: 10 }}>
                          {p.location.startsWith('SKU:') ? p.location.replace('SKU:', '').trim() : p.location}
                        </span>
                      </div>
                    )}
                    <h3 style={{ color: '#111827', fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, minHeight: 28 }}>{p.name}</h3>
                    {(() => {
                      let titulo: string | null = null
                      let precioUnit: string | null = null
                      let extraInfo: string | null = null
                      const bi = getBulkInfo(p.category ?? '', p.subcategory ?? '', p.minOrder)

                      if (p.descripcion?.startsWith('PRECIO POR')) {
                        const sepIdx = p.descripcion.indexOf(') | ')
                        const pricePart = sepIdx >= 0 ? p.descripcion.slice(0, sepIdx + 1) : p.descripcion
                        extraInfo = sepIdx >= 0 ? p.descripcion.slice(sepIdx + 4) : null
                        const match = pricePart.match(/^(PRECIO POR \d+ UNIDADES)\s*\((.+)\)$/)
                        titulo = match ? match[1] : pricePart
                        // c/u SIEMPRE calculado desde el precio actual (no del texto, que puede quedar viejo)
                        precioUnit = match ? `$${Math.round(p.wholesalePrice / Math.max(1, p.minOrder)).toLocaleString('es-AR')} c/u` : null
                      } else if (p.badge === 'x6 UNIDADES') {
                        titulo = 'PRECIO POR 6 UNIDADES'
                        precioUnit = `$${Math.round(p.wholesalePrice / 6).toLocaleString('es-AR')} c/u`
                      } else if (p.minOrder > 1) {
                        // LENCERIA POR BULTO: el precio guardado es el de la DOCENA, vendido por X docenas
                        const esDocena = (p.subcategory ?? '').toUpperCase() === 'LENCERIA POR BULTO'
                        // COTILLON guarda precio UNITARIO (la docena = unitario x minOrder).
                        // El resto de las categorías guarda el precio del pack.
                        const esCot = (p.category ?? '').toUpperCase() === 'COTILLON' || (p.subcategory ?? '').toUpperCase() === 'POP IT' || (p.category ?? '').toUpperCase() === 'ARTICULOS X BULTO' || (p.subcategory ?? '').toUpperCase() === 'INFAC-TEC' || (p.subcategory ?? '').toUpperCase() === 'TOYS.AR'
                        if (esDocena) {
                          titulo = `VENTA POR ${p.minOrder} DOCENAS`
                          precioUnit = `$${p.wholesalePrice.toLocaleString('es-AR')} la docena`
                        } else {
                          titulo = `PRECIO POR ${p.minOrder} UNIDADES`
                          const setQ = ((p.name ?? '').match(/set\s*x\s*(\d+)/i) || [])[1]
                          const u = esCot ? p.wholesalePrice : Math.round(p.wholesalePrice / p.minOrder)
                          precioUnit = `$${u.toLocaleString('es-AR')} ${setQ ? `por set de ${setQ}` : 'c/u'}`
                        }
                      }

                      return titulo ? (
                        <>
                          <div style={{ background: '#FFFDE7', border: '1.5px solid #F59E0B', borderRadius: 6, padding: '4px 8px', marginBottom: extraInfo ? 2 : 4 }}>
                            {precioUnit && (
                              <div style={{ color: '#111', fontSize: 17, fontWeight: 900 }}>{precioUnit}</div>
                            )}
                            {(p.subcategory ?? '').toUpperCase() !== 'TOYS.AR' && <span style={{ color: '#111', fontSize: 10, fontWeight: 900, letterSpacing: '0.02em' }}>{titulo}</span>}
                            <div style={{ color: '#C2410C', fontSize: 13, fontWeight: 900, marginTop: 2 }}>{(() => {
                              const esDoc = (p.subcategory ?? '').toUpperCase() === 'LENCERIA POR BULTO'
                              const esBulk = (p.category ?? '').toUpperCase() === 'COTILLON' || (p.subcategory ?? '').toUpperCase() === 'POP IT' || (p.category ?? '').toUpperCase() === 'ARTICULOS X BULTO' || (p.subcategory ?? '').toUpperCase() === 'INFAC-TEC' || (p.subcategory ?? '').toUpperCase() === 'TOYS.AR'
                              const total = (esBulk || esDoc) ? p.wholesalePrice * p.minOrder : p.wholesalePrice
                              const label = esDoc ? `EL BULTO (${p.minOrder} DOCENAS)` : ((p.category ?? '').toUpperCase() === 'ARTICULOS X BULTO' || (p.subcategory ?? '').toUpperCase() === 'TOYS.AR') ? `EL BULTO X${p.minOrder}` : p.minOrder === 12 ? 'LA DOCENA' : `PACK X ${p.minOrder}`
                              return `${label}: $${total.toLocaleString('es-AR')}`
                            })()}</div>
                          </div>
                          {extraInfo && (
                            <p style={{ color: '#6B7280', fontSize: 9, lineHeight: 1.4, marginBottom: 4, marginTop: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{extraInfo}</p>
                          )}
                          {!extraInfo && p.descripcion && !p.descripcion.startsWith('PRECIO POR') && (
                            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, padding: '4px 8px', marginTop: 4, marginBottom: 2 }}>
                              <p style={{ color: '#1D4ED8', fontSize: 11, fontWeight: 700, lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.descripcion}</p>
                            </div>
                          )}
                        </>
                      ) : (
                        p.descripcion ? (
                          <p style={{ color: '#6B7280', fontSize: 10, lineHeight: 1.4, marginBottom: 4, marginTop: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.descripcion}</p>
                        ) : null
                      )
                    })()}
                    {(() => {
                      const bi = getBulkInfo(p.category ?? '', p.subcategory ?? '', p.minOrder)
                      if (!bi?.sku) return null
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,106,61,0.15)', border: '1px solid rgba(255,106,61,0.35)', borderRadius: 5, padding: '2px 6px', marginBottom: 4 }}>
                          <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 9 }}>SKU</span>
                          <span style={{ color: '#111827', fontWeight: 700, fontSize: 10 }}>
                            {p.location?.startsWith('SKU:') ? p.location.replace('SKU:', '').trim() : 'Sin código'}
                          </span>
                        </div>
                      )
                    })()}
                    <Stars n={p.rating} />
                    {(() => {
                      const bi = getBulkInfo(p.category ?? '', p.subcategory ?? '', p.minOrder)
                      const isBulk = p.descripcion?.startsWith('PRECIO POR') || p.badge === 'x6 UNIDADES' || p.minOrder > 1
                      if (isBulk) return null
                      return (
                        <div style={{ marginTop: 6 }}>
                          <div style={{ color: '#6B7280', fontSize: 10, marginTop: 2 }}>
                            {bi?.label ?? 'Mayorista:'} <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 14 }}>${p.wholesalePrice.toLocaleString('es-AR')}</span>
                          </div>
                        </div>
                      )
                    })()}
                    <button
                      className="btn-agregar"
                      style={{ width: '100%', marginTop: 10, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#0D2C54', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, WebkitTapHighlightColor: 'transparent' }}
                      onClick={() => {
                        const cat = (p.category ?? '').toUpperCase()
                        const sub = (p.subcategory ?? '').toUpperCase()
                        const esU = cat === 'ARTICULOS X BULTO' || cat === 'COTILLON' || sub === 'POP IT' || sub === 'LENCERIA POR BULTO' || sub === 'TOYS.AR'
                        const isDescPor = p.descripcion?.startsWith('PRECIO POR')
                        const dividir = !isDescPor && !esU && p.minOrder > 1
                        addItem({
                          id: p.id, name: p.name, brand: p.brand, price: p.price,
                          wholesalePrice: dividir ? Math.round(p.wholesalePrice / p.minOrder) : p.wholesalePrice,
                          image: p.image,
                          minOrder: isDescPor ? 1 : p.minOrder,
                          category: p.category,
                          subcategory: p.subcategory,
                        })
                      }}>
                      <ShoppingCart size={12} /><TextReveal text="AGREGAR" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Scroll infinito: carga automática al acercarse al final */}
            {hayMas && !busquedaInterna.trim() && (
              <div ref={sentinelRef} style={{ textAlign: 'center', marginTop: 24, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loadingMas && (
                  <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 14, opacity: 0.85 }}>Cargando más productos…</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Lightbox */}
      {lightbox && (() => {
        const lista = productosFiltrados.filter(p => p.image)
        const idx = lista.findIndex(p => p.id === lightbox.id)
        const prev = lista[idx - 1] ?? null
        const next = lista[idx + 1] ?? null
        const lbImages = lightbox.images && lightbox.images.length > 1 ? lightbox.images : [lightbox.image]
        const activeSrc = lbImages[lightboxImgIdx] || lightbox.image
        return (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { if (zoom) { setZoom(false); setOffset({x:0,y:0}) } else setLightbox(null) }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, cursor: 'default' }}>
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '100%' : 860, height: isMobile ? 'calc(100vh - 32px)' : 'calc(100vh - 48px)', maxHeight: isMobile ? '100%' : 640, background: '#FFFFFF', borderRadius: isMobile ? 16 : 20, overflow: 'hidden', border: '1px solid rgba(255,106,61,0.3)', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
              {/* IMAGEN — izquierda en desktop, arriba en mobile */}
              <div style={{ flex: isMobile ? '0 0 45%' : '0 0 58%', display: 'flex', flexDirection: 'column', background: '#F5F5F5', borderRight: isMobile ? 'none' : '1px solid #E5E7EB', borderBottom: isMobile ? '1px solid #E5E7EB' : 'none', overflow: 'hidden' }}>
              {/* Foto grande */}
              <div
                ref={imgRef}
                style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: zoom ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
                onClick={e => {
                  e.stopPropagation()
                  if (dragging) return
                  if (!zoom) { setZoom(true); setOffset({x:0,y:0}) }
                }}
                onMouseDown={e => {
                  if (!zoom) return
                  e.preventDefault()
                  setDragStart({x: e.clientX - offset.x * 1.8, y: e.clientY - offset.y * 1.8})
                }}
                onMouseMove={e => {
                  if (!dragStart || !zoom) return
                  const nx = (e.clientX - dragStart.x) / 1.8
                  const ny = (e.clientY - dragStart.y) / 1.8
                  const max = 110
                  setOffset({ x: Math.max(-max, Math.min(max, nx)), y: Math.max(-max, Math.min(max, ny)) })
                  setDragging(true)
                }}
                onMouseUp={() => { setDragStart(null); setTimeout(() => setDragging(false), 50) }}
                onMouseLeave={() => { setDragStart(null); setTimeout(() => setDragging(false), 50) }}
                onTouchStart={e => {
                  if (!zoom) return
                  const t = e.touches[0]
                  setDragStart({x: t.clientX - offset.x * 1.8, y: t.clientY - offset.y * 1.8})
                }}
                onTouchMove={e => {
                  if (!dragStart || !zoom) return
                  e.stopPropagation()
                  const t = e.touches[0]
                  const nx = (t.clientX - dragStart.x) / 1.8
                  const ny = (t.clientY - dragStart.y) / 1.8
                  const max = 110
                  setOffset({ x: Math.max(-max, Math.min(max, nx)), y: Math.max(-max, Math.min(max, ny)) })
                  setDragging(true)
                }}
                onTouchEnd={() => { setDragStart(null); setTimeout(() => setDragging(false), 100) }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  transform: zoom ? `scale(1.8) translate(${offset.x}px, ${offset.y}px)` : 'scale(1)',
                  transition: dragging ? 'none' : 'transform 0.25s ease',
                  transformOrigin: 'center center',
                  willChange: 'transform',
                }}>
                  <Image src={activeSrc} alt={lightbox.name} fill style={{ objectFit: 'contain', padding: 10 }} sizes="500px" quality={100} />
                  {/* Tapar watermark CX en fotos de marca XC */}
                  {lightbox.brand?.toUpperCase() === 'XC' && !zoom && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '23%', background: 'linear-gradient(to bottom, #F5F5F5 60%, transparent)', zIndex: 2, pointerEvents: 'none' }} />
                  )}
                </div>

                {/* Hint zoom */}
                {!zoom && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.45)', borderRadius: 20, padding: '3px 9px', color: 'rgba(255,255,255,0.8)', fontSize: 11, pointerEvents: 'none' }}>
                    🔍 Ampliar
                  </div>
                )}

                {prev && !zoom && (
                  <button onClick={e => { e.stopPropagation(); setLightbox(prev); setLightboxImgIdx(0); setZoom(false); setOffset({x:0,y:0}) }}
                    style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                    <ChevronLeft size={20} color="#fff" />
                  </button>
                )}
                {next && !zoom && (
                  <button onClick={e => { e.stopPropagation(); setLightbox(next); setLightboxImgIdx(0); setZoom(false); setOffset({x:0,y:0}) }}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                    <ChevronRight size={20} color="#fff" />
                  </button>
                )}

                {zoom ? (
                  <button onClick={e => { e.stopPropagation(); setZoom(false); setOffset({x:0,y:0}); setDragging(false) }}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '6px 14px', color: '#fff', fontSize: 13, cursor: 'pointer', zIndex: 20, fontWeight: 700 }}>
                    ✕ Reducir
                  </button>
                ) : (
                  <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.45)', borderRadius: 20, padding: '3px 10px', color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>
                    {idx + 1} / {lista.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {lbImages.length > 1 && !zoom && (
                <div style={{ display: 'flex', gap: 6, padding: '8px 10px', justifyContent: 'center', flexWrap: 'wrap', background: '#FFF', borderTop: '1px solid #E5E7EB', flexShrink: 0 }}>
                  {lbImages.map((src, i) => (
                    <button key={i} onClick={() => { setLightboxImgIdx(i); setZoom(false); setOffset({x:0,y:0}) }}
                      style={{ width: 44, height: 44, borderRadius: 7, overflow: 'hidden', border: i === lightboxImgIdx ? '2px solid #FF6A3D' : '2px solid #E5E7EB', padding: 0, cursor: 'pointer', background: '#F3F4F6', flexShrink: 0, transition: 'border-color 0.2s' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`foto ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
              </div>{/* fin izquierda */}

              {/* INFO — derecha en desktop, abajo en mobile */}
              {!zoom && <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? '12px 14px 14px' : '18px 18px 18px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {lightbox.brand && (
                  <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marca: {lightbox.brand}</div>
                )}
                <div style={{ color: '#111827', fontWeight: 900, fontSize: isMobile ? 16 : 14, marginBottom: 8, lineHeight: 1.3 }}>{lightbox.name}</div>
                {lightbox.descripcion && (
                  lightbox.descripcion.startsWith('PRECIO POR') ? (() => {
                    const sepIdx = lightbox.descripcion!.indexOf(') | ')
                    const pricePart = sepIdx >= 0 ? lightbox.descripcion!.slice(0, sepIdx + 1) : lightbox.descripcion!
                    const extra = sepIdx >= 0 ? lightbox.descripcion!.slice(sepIdx + 4) : null
                    const match = pricePart.match(/^(PRECIO POR \d+ UNIDADES)\s*\((.+)\)$/)
                    const titulo = match ? match[1] : pricePart
                    const precioUnit = match ? `$${Math.round(lightbox.wholesalePrice / Math.max(1, lightbox.minOrder)).toLocaleString('es-AR')} c/u` : null
                    return (
                      <>
                        <div style={{ background: '#FFFDE7', border: '1.5px solid #F59E0B', borderRadius: 8, padding: '8px 12px', marginBottom: extra ? 6 : 10 }}>
                          <div style={{ color: '#111', fontSize: 12, fontWeight: 900, letterSpacing: '0.02em' }}>{titulo}</div>
                          {precioUnit && <div style={{ color: '#111', fontSize: 13, fontWeight: 900, marginTop: 3 }}>{precioUnit}</div>}
                        </div>
                        {extra && (
                          <div style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.6, marginBottom: 10, padding: '8px 12px', background: '#F9FAFB', borderRadius: 8, borderLeft: '3px solid #FF6A3D', whiteSpace: 'pre-line' }}>
                            {extra}
                          </div>
                        )}
                      </>
                    )
                  })() : (
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
                      <p style={{ color: '#1D4ED8', fontSize: 13, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>{lightbox.descripcion}</p>
                    </div>
                  )
                )}
                {lightbox.location && lightbox.location !== 'Buenos Aires' && lightbox.location !== 'POP' && !getBulkInfo(lightbox.category ?? '', lightbox.subcategory ?? '', lightbox.minOrder) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,106,61,0.12)', border: '1px solid rgba(255,106,61,0.4)', borderRadius: 8, padding: '6px 12px', marginBottom: 10 }}>
                    <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 13, letterSpacing: '0.05em' }}>COD</span>
                    <span style={{ color: '#111827', fontWeight: 800, fontSize: 15 }}>
                      {lightbox.location.startsWith('SKU:') ? lightbox.location.replace('SKU:', '').trim() : lightbox.location}
                    </span>
                  </div>
                )}
                {(() => {
                  const lbi = getBulkInfo(lightbox.category ?? '', lightbox.subcategory ?? '', lightbox.minOrder)
                  if (!lbi) return <div style={{ marginBottom: 12 }} />
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                      {lbi.badge && (
                        <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', borderRadius: 8, padding: '6px 12px' }}>
                          <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 900, letterSpacing: '0.05em' }}>{lbi.badgeText}</span>
                        </div>
                      )}
                      {lbi.sku && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,106,61,0.15)', border: '1px solid rgba(255,106,61,0.4)', borderRadius: 8, padding: '6px 12px' }}>
                          <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 13, letterSpacing: '0.05em' }}>SKU</span>
                          <span style={{ color: '#111827', fontWeight: 800, fontSize: 15 }}>
                            {lightbox.location?.startsWith('SKU:') ? lightbox.location.replace('SKU:', '').trim() : 'Sin código'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })()}
                <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                  {(() => {
                    // COTILLON / POP IT guardan precio UNITARIO; el resto guarda precio del pack
                    const esBulto = (lightbox.category ?? '').toUpperCase() === 'ARTICULOS X BULTO' || (lightbox.subcategory ?? '').toUpperCase() === 'TOYS.AR'
                    const esDocena = (lightbox.subcategory ?? '').toUpperCase() === 'LENCERIA POR BULTO'
                    const esU = (lightbox.category ?? '').toUpperCase() === 'COTILLON' || (lightbox.subcategory ?? '').toUpperCase() === 'POP IT' || esBulto || esDocena
                    const cu = esU ? lightbox.wholesalePrice : Math.round(lightbox.wholesalePrice / lightbox.minOrder)
                    const packTotal = esU ? lightbox.wholesalePrice * lightbox.minOrder : lightbox.wholesalePrice
                    return (
                      <>
                        {lightbox.minOrder > 1 && (
                          <div style={{ background: '#FFFDE7', border: '1.5px solid #F59E0B', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
                            <div style={{ color: '#92400E', fontSize: 12, fontWeight: 900 }}>{esDocena ? `VENTA POR ${lightbox.minOrder} DOCENAS` : `PRECIO POR ${lightbox.minOrder} UNIDADES`}</div>
                            <div style={{ color: '#111', fontSize: 15, fontWeight: 900, marginTop: 2 }}>${cu.toLocaleString('es-AR')} {esDocena ? 'la docena' : (((lightbox.name ?? '').match(/set\s*x\s*(\d+)/i) || [])[1] ? `por set de ${((lightbox.name ?? '').match(/set\s*x\s*(\d+)/i) || [])[1]}` : 'c/u')}</div>
                            <div style={{ color: '#C2410C', fontSize: 13, fontWeight: 700, marginTop: 2 }}>{esDocena ? `EL BULTO (${lightbox.minOrder} DOCENAS)` : esBulto ? `EL BULTO X${lightbox.minOrder}` : lightbox.minOrder === 12 ? 'LA DOCENA' : `PACK X ${lightbox.minOrder}`}: ${packTotal.toLocaleString('es-AR')}</div>
                          </div>
                        )}
                        <div style={{ color: '#FF6A3D', fontWeight: 900, fontSize: isMobile ? 26 : 22 }}>
                          ${(lightbox.minOrder > 1 ? packTotal : lightbox.wholesalePrice).toLocaleString('es-AR')}
                          {lightbox.minOrder > 1 && <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E', marginLeft: 6 }}>{esDocena ? `el bulto (${lightbox.minOrder} docenas)` : esBulto ? `el bulto x${lightbox.minOrder}` : lightbox.minOrder === 12 ? 'la docena' : `el pack x ${lightbox.minOrder}`}</span>}
                        </div>
                      </>
                    )
                  })()}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => setLightbox(null)}
                    style={{ flex: 1, background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 10, padding: isMobile ? '14px 6px' : '10px 6px', color: '#374151', fontWeight: 700, cursor: 'pointer', fontSize: isMobile ? 15 : 12 }}>
                    Cerrar
                  </button>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const cat = (lightbox.category ?? '').toUpperCase()
                      const sub = (lightbox.subcategory ?? '').toUpperCase()
                      const esU = cat === 'ARTICULOS X BULTO' || cat === 'COTILLON' || sub === 'POP IT' || sub === 'LENCERIA POR BULTO' || sub === 'TOYS.AR'
                      const isDescPor = lightbox.descripcion?.startsWith('PRECIO POR')
                      const dividir = !isDescPor && !esU && lightbox.minOrder > 1
                      addItem({
                        id: lightbox.id, name: lightbox.name, brand: lightbox.brand, price: lightbox.price,
                        wholesalePrice: dividir ? Math.round(lightbox.wholesalePrice / lightbox.minOrder) : lightbox.wholesalePrice,
                        image: lightbox.image,
                        minOrder: isDescPor ? 1 : lightbox.minOrder,
                        category: lightbox.category,
                        subcategory: lightbox.subcategory,
                      })
                      setLightbox(null)
                    }}
                    className="btn-agregar"
                    style={{ flex: 2, background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', border: 'none', borderRadius: 10, padding: isMobile ? '14px 6px' : '10px 6px', color: '#0D2C54', fontWeight: 900, cursor: 'pointer', fontSize: isMobile ? 15 : 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <ShoppingCart size={14} /><TextReveal text="AGREGAR" />
                  </motion.button>
                </div>
              </div>}
            </div>
            {!zoom && <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 12 }}>Tocá afuera para cerrar</div>}
          </motion.div>
        )
      })()}
    </div>
  )
}
