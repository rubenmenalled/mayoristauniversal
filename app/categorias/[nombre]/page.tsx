'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, ShoppingCart, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
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
  OFERTA: 'bg-red-600', NUEVO: 'bg-green-600', HOT: 'bg-orange-500', TOP: 'bg-yellow-500',
}

const EXCL_MARR = ['MOCHILAS-CARTERAS','MOCHILAS Y CARTERAS','MOCHILAS','BANDOLERAS','BOLSOS MATERNALES','CARTERAS']

function getBulkInfo(category: string, subcategory: string, minOrder: number) {
  const cat = (category || '').toUpperCase()
  const sub = (subcategory || '').toUpperCase()
  if (cat !== 'ACCESORIOS DE PELO' && cat !== 'MARROQUINERIA' && cat !== 'LIBRERIA' && cat !== 'BELLEZA' && cat !== 'INVIERNO 2026') return null
  if (cat === 'MARROQUINERIA' && EXCL_MARR.includes(sub)) return { badge: false, sku: true, label: 'Mayorista:', badgeText: '' }
  if (cat === 'LIBRERIA' || cat === 'ACCESORIOS DE PELO' || cat === 'BELLEZA' || cat === 'INVIERNO 2026') {
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

  const { addItem, count, cartOpen, setCartOpen } = useCart()
  const [productos, setProductos] = useState<Producto[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([])
  const [subActiva, setSubActiva] = useState<string>(
    searchParams.get('sub') ? decodeURIComponent(searchParams.get('sub')!) : ''
  )
  const [subSubActiva, setSubSubActiva] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Sub-subcategorías hardcodeadas por subcategoría
  const SUB_SUBS: Record<string, { nombre: string; emoji: string; imagen: string; filtro: (p: Producto) => boolean }[]> = {
    'BUBBLE': [
      {
        nombre: 'BOLSAS DE REGALO',
        emoji: '🎁',
        imagen: 'https://usimg.k2049.com/files/x/3e2f4a1b8c9d4e5f6a7b8c9d0e1f2a3b.jpg',
        filtro: (p) => p.name.toLowerCase().includes('bolsa'),
      },
    ],
  }
  const [busquedaInterna, setBusquedaInterna] = useState('')
  const [lightbox, setLightbox] = useState<Producto | null>(null)
  const [lightboxImgIdx, setLightboxImgIdx] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [dragStart, setDragStart] = useState<{x:number,y:number}|null>(null)
  const [offset, setOffset] = useState({x:0,y:0})
  const [dragging, setDragging] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  function normalizar(s: string) {
    return (s || '').toLowerCase().trim()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ')
  }

  // Cargar subcategorías al entrar
  useEffect(() => {
    fetch('/api/subcategorias?categoria=' + encodeURIComponent(nombreDecoded))
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSubcategorias(data)
        // Si no hay subcategorías, cargar todos los productos directamente
        if (!Array.isArray(data) || data.length === 0) {
          setLoading(true)
          fetch('/api/productos-publicos?categoria=' + encodeURIComponent(nombreDecoded))
            .then(r => r.json())
            .then((d: Producto[]) => { setProductos(Array.isArray(d) ? d : []); setLoading(false) })
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
      // Solo cargar todos si no hay subcategorías
      if (subcategorias.length === 0) return
      setLoading(true)
      fetch('/api/productos-publicos?categoria=' + encodeURIComponent(nombreDecoded))
        .then(r => r.json())
        .then((d: Producto[]) => { setProductos(Array.isArray(d) ? d : []); setLoading(false) })
        .catch(() => setLoading(false))
      return
    }
    setLoading(true)
    setProductos([])
    fetch('/api/productos-publicos?categoria=' + encodeURIComponent(nombreDecoded) + '&subcategoria=' + encodeURIComponent(subActiva))
      .then(r => r.json())
      .then((d: Producto[]) => { setProductos(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subActiva, nombreDecoded])

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

  const productosFiltrados = busquedaInterna.trim() === ''
    ? porSubSub
    : porSubSub.filter(p => {
        const q = normalizar(busquedaInterna)
        return normalizar(p.name || '').includes(q) ||
               normalizar(p.brand || '').includes(q) ||
               normalizar(p.subcategory || '').includes(q) ||
               normalizar(p.location || '').includes(q)
      })

  return (
    <div style={{ minHeight: '100vh', background: '#7A8C6A', paddingTop: 38 }}>
      {/* Header — debajo del AnnouncementBar (38px fijo) */}
      <div style={{
        background: 'rgba(122,140,106,0.97)', borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '16px 24px', position: 'sticky', top: 38, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Fila 1: navegación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.push('/')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              <ArrowLeft size={16} /> Inicio
            </button>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 18, flex: 1 }}>{nombreDecoded}</div>
            <a href="/catalogo" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
              color: '#FFFFFF', fontWeight: 900, fontSize: 11,
              padding: '5px 12px', borderRadius: 8, textDecoration: 'none',
              whiteSpace: 'nowrap', letterSpacing: '0.04em', flexShrink: 0,
            }}>
              📋 VER CATÁLOGO
            </a>
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF', padding: 4, flexShrink: 0 }}>
              <ShoppingCart size={22} />
              {count > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#D4AF37', color: '#FFFFFF', fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{count}</span>}
            </button>
          </div>
          {/* Fila 2: buscador interno */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', border: '1.5px solid rgba(212,175,55,0.3)', borderRadius: 10, padding: '7px 14px', transition: 'border-color 0.2s' }}
            onFocus={() => {}} >
            <input
              type="text"
              value={busquedaInterna}
              onChange={e => setBusquedaInterna(e.target.value)}
              placeholder={`Buscar en ${nombreDecoded}...`}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#333', background: 'transparent', minWidth: 0 }}
            />
            {busquedaInterna ? (
              <button onClick={() => setBusquedaInterna('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>✕</button>
            ) : (
              <Search size={16} color="#7A8C6A" style={{ flexShrink: 0 }} />
            )}
          </div>
        </div>
      </div>

      {/* Sub-subcategorías como tarjetas — cuando hay subActiva con sub-subs y no hay subSubActiva */}
      {subActiva && SUB_SUBS[subActiva] && !subSubActiva && !busquedaInterna.trim() && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ color: '#D4AF37', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
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
                <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700 }}>Ver productos →</span>
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
                  <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700 }}>Ver productos →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Subcategorías como tarjetas — solo si no hay ninguna activa */}
      {subcategorias.length > 0 && !subActiva && !loading && !busquedaInterna.trim() && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ color: '#D4AF37', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
            Seleccioná una subcategoría
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
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4, padding: 12 }}>
                    <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>{sub.nombre}</span>
                    <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700 }}>Ver productos →</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content — productos */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>

        {/* Botón volver — nivel 3: volver a BUBBLE */}
        {subActiva && subSubActiva && SUB_SUBS[subActiva] && (
          <button onClick={() => setSubSubActiva('')}
            style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 20, padding: '8px 16px', color: '#D4AF37', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ← Volver a {subActiva}
          </button>
        )}

        {/* Botón volver — nivel 2: volver a subcategorías (solo si no hay sub-subs pendientes de elegir) */}
        {subActiva && subcategorias.length > 0 && (!SUB_SUBS[subActiva] || subSubActiva) && (
          <button onClick={() => { setSubActiva(''); setSubSubActiva('') }}
            style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 20, padding: '8px 16px', color: '#D4AF37', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ← Volver a subcategorías
          </button>
        )}

        {/* Botón volver — cuando estoy en sub-subs picker (BUBBLE sin subSubActiva), volver a subcategorías */}
        {subActiva && SUB_SUBS[subActiva] && !subSubActiva && subcategorias.length > 0 && (
          <button onClick={() => setSubActiva('')}
            style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 20, padding: '8px 16px', color: '#D4AF37', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ← Volver a subcategorías
          </button>
        )}

        {/* No mostrar productos si estamos en el picker de sub-subcategorías */}
        {subActiva && SUB_SUBS[subActiva] && !subSubActiva && !busquedaInterna.trim() ? null : loading ? (
          <div style={{ textAlign: 'center', color: '#FFFFFF', padding: 80, fontSize: 16 }}>Cargando productos...</div>
        ) : productosFiltrados.length === 0 && (!subcategorias.length || subActiva || busquedaInterna.trim()) ? (
          <div style={{ textAlign: 'center', padding: 80, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 20 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>
              {busquedaInterna.trim() ? `Sin resultados para "${busquedaInterna}"` : subActiva ? `No hay productos en ${subActiva}` : `No hay productos en ${nombreDecoded} todavía`}
            </div>
            {(subActiva || busquedaInterna.trim()) && (
              <button onClick={() => { setSubActiva(''); setBusquedaInterna('') }}
                style={{ marginTop: 16, background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 10, padding: '10px 24px', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer' }}>
                Ver todos
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 24 }}>
              {busquedaInterna.trim()
                ? <><span style={{ color: '#D4AF37', fontWeight: 700 }}>{productosFiltrados.length}</span> resultado{productosFiltrados.length !== 1 ? 's' : ''} para <span style={{ color: '#D4AF37', fontWeight: 700 }}>"{busquedaInterna}"</span></>
                : <>{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} en <span style={{ color: '#D4AF37', fontWeight: 700 }}>{subActiva || nombreDecoded}</span></>
              }
            </div>
            <style dangerouslySetInnerHTML={{ __html: `.prod-card { transition: transform 0.2s ease, box-shadow 0.2s ease; } @media (hover: hover) { .prod-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(212,175,55,0.2); } }` }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {productosFiltrados.map((p, i) => (
                <motion.div key={p.id}
                  className="prod-card rounded-xl overflow-hidden relative"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}>

                  <div style={{ position: 'relative', height: 340, background: '#F0F0F0', overflow: 'hidden', cursor: p.image ? 'zoom-in' : 'default' }}
                    onClick={() => { if (p.image) { setLightbox(p); setLightboxImgIdx(0) } }}>
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-contain" sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px" quality={95} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>📦</div>
                    )}
                    {p.image && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '2px 5px', fontSize: 10, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 3 }}>
                        🔍{p.images && p.images.length > 1 && <span style={{ fontSize: 9, color: '#D4AF37', fontWeight: 700 }}>{p.images.length}📷</span>}
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
                    {p.location && p.location !== 'Buenos Aires' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 5, padding: '2px 6px', marginBottom: 3, width: 'fit-content' }}>
                        <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 9 }}>COD</span>
                        <span style={{ color: '#111827', fontWeight: 700, fontSize: 10 }}>
                          {p.location.startsWith('SKU:') ? p.location.replace('SKU:', '').trim() : p.location}
                        </span>
                      </div>
                    )}
                    <h3 style={{ color: '#111827', fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, minHeight: 28 }}>{p.name}</h3>
                    {(() => {
                      let titulo: string | null = null
                      let precioUnit: string | null = null
                      const bi = getBulkInfo(p.category ?? '', p.subcategory ?? '', p.minOrder)

                      if (p.descripcion?.startsWith('PRECIO POR')) {
                        const match = p.descripcion.match(/^(PRECIO POR \d+ UNIDADES)\s*\((.+)\)$/)
                        titulo = match ? match[1] : p.descripcion
                        precioUnit = match ? match[2] : null
                      } else if (p.badge === 'x6 UNIDADES') {
                        titulo = 'PRECIO POR 6 UNIDADES'
                        precioUnit = `$${Math.round(p.wholesalePrice / 6).toLocaleString('es-AR')} c/u`
                      } else if (p.minOrder > 1) {
                        titulo = `PRECIO POR ${p.minOrder} UNIDADES`
                        precioUnit = `$${Math.round(p.wholesalePrice / p.minOrder).toLocaleString('es-AR')} c/u`
                      }

                      return titulo ? (
                        <div style={{ background: '#FFFDE7', border: '1.5px solid #F59E0B', borderRadius: 6, padding: '4px 8px', marginBottom: 4 }}>
                          {precioUnit && (
                            <div style={{ color: '#333', fontSize: 11, fontWeight: 800 }}>{precioUnit}</div>
                          )}
                          <span style={{ color: '#111', fontSize: 10, fontWeight: 900, letterSpacing: '0.02em' }}>{titulo}</span>
                          <div style={{ color: '#B45309', fontSize: 13, fontWeight: 900, marginTop: 2 }}>Mayorista: ${p.wholesalePrice.toLocaleString('es-AR')}</div>
                        </div>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 5, padding: '2px 6px', marginBottom: 4 }}>
                          <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 9 }}>SKU</span>
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
                            {bi?.label ?? 'Mayorista:'} <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 14 }}>${p.wholesalePrice.toLocaleString('es-AR')}</span>
                          </div>
                        </div>
                      )
                    })()}
                    <button
                      style={{ width: '100%', marginTop: 10, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, WebkitTapHighlightColor: 'transparent' }}
                      onClick={() => addItem({ id: p.id, name: p.name, brand: p.brand, price: p.price, wholesalePrice: p.wholesalePrice, image: p.image, minOrder: p.descripcion?.startsWith('PRECIO POR') ? 1 : p.minOrder, category: p.category })}>
                      <ShoppingCart size={11} /> AGREGAR
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
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
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: zoom ? 0 : 16, cursor: zoom ? 'zoom-out' : 'default' }}>
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: zoom ? '100%' : 680, maxHeight: zoom ? '100vh' : 'calc(100vh - 40px)', background: '#FFFFFF', borderRadius: zoom ? 0 : 20, overflow: zoom ? 'hidden' : 'auto', border: zoom ? 'none' : '1px solid rgba(212,175,55,0.3)', transition: 'all 0.25s ease' }}>
              {/* Foto grande */}
              <div
                ref={imgRef}
                style={{ position: 'relative', width: '100%', height: zoom ? '100vh' : 'min(360px, 52vh)', background: '#F9FAFB', overflow: 'hidden', cursor: zoom ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
                onClick={e => { e.stopPropagation(); if (!dragging) { setZoom(z => !z); setOffset({x:0,y:0}) } }}
                onMouseDown={e => { if (zoom) { setDragStart({x: e.clientX - offset.x, y: e.clientY - offset.y}); setDragging(false) } }}
                onMouseMove={e => { if (zoom && dragStart) { setDragging(true); setOffset({x: e.clientX - dragStart.x, y: e.clientY - dragStart.y}) } }}
                onMouseUp={() => { setTimeout(() => setDragging(false), 50); setDragStart(null) }}
                onMouseLeave={() => { setDragStart(null) }}
                onTouchStart={e => { if (zoom) setDragStart({x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y}) }}
                onTouchMove={e => { if (zoom && dragStart) { setDragging(true); setOffset({x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y}) } }}
                onTouchEnd={() => { setTimeout(() => setDragging(false), 50); setDragStart(null) }}
              >
                <div style={{ position: 'absolute', inset: 0, transform: zoom ? `scale(2.5) translate(${offset.x/2.5}px, ${offset.y/2.5}px)` : 'scale(1)', transition: dragStart ? 'none' : 'transform 0.3s ease', transformOrigin: 'center center' }}>
                  <Image src={activeSrc} alt={lightbox.name} fill style={{ objectFit: 'contain', padding: zoom ? 0 : 16 }} sizes="(max-width: 768px) 95vw, 800px" quality={95} />
                </div>

                {/* Hint zoom */}
                {!zoom && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '3px 10px', color: 'rgba(255,255,255,0.7)', fontSize: 11, pointerEvents: 'none' }}>
                    🔍 Toca para zoom
                  </div>
                )}

                {/* Flecha izquierda (producto anterior) */}
                {prev && !zoom && (
                  <button onClick={e => { e.stopPropagation(); setLightbox(prev); setLightboxImgIdx(0); setZoom(false); setOffset({x:0,y:0}) }}
                    style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}>
                    <ChevronLeft size={22} color="#fff" />
                  </button>
                )}

                {/* Flecha derecha (producto siguiente) */}
                {next && !zoom && (
                  <button onClick={e => { e.stopPropagation(); setLightbox(next); setLightboxImgIdx(0); setZoom(false); setOffset({x:0,y:0}) }}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}>
                    <ChevronRight size={22} color="#fff" />
                  </button>
                )}

                {/* Contador / cerrar zoom */}
                {zoom ? (
                  <button onClick={e => { e.stopPropagation(); setZoom(false); setOffset({x:0,y:0}) }}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '4px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', zIndex: 20 }}>
                    ✕ Cerrar zoom
                  </button>
                ) : (
                  <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '3px 10px', color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                    {idx + 1} / {lista.length}
                  </div>
                )}
              </div>

              {/* Thumbnails — solo cuando hay más de 1 imagen */}
              {lbImages.length > 1 && !zoom && (
                <div style={{ display: 'flex', gap: 8, padding: '10px 16px 0', justifyContent: 'center' }}>
                  {lbImages.map((src, i) => (
                    <button key={i} onClick={() => { setLightboxImgIdx(i); setZoom(false); setOffset({x:0,y:0}) }}
                      style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', border: i === lightboxImgIdx ? '2px solid #D4AF37' : '2px solid #E5E7EB', padding: 0, cursor: 'pointer', background: '#F3F4F6', flexShrink: 0, transition: 'border-color 0.2s' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`foto ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Info */}
              {!zoom && <div style={{ padding: '16px 20px 20px' }}>
                {lightbox.brand && (
                  <div style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marca: {lightbox.brand}</div>
                )}
                <div style={{ color: '#111827', fontWeight: 900, fontSize: 15, marginBottom: lightbox.descripcion ? 6 : 10 }}>{lightbox.name}</div>
                {lightbox.descripcion && (
                  lightbox.descripcion.startsWith('PRECIO POR') ? (() => {
                    const match = lightbox.descripcion!.match(/^(PRECIO POR \d+ UNIDADES)\s*\((.+)\)$/)
                    const titulo = match ? match[1] : lightbox.descripcion
                    const precioUnit = match ? match[2] : null
                    return (
                      <div style={{ background: '#FFFDE7', border: '1.5px solid #F59E0B', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
                        <div style={{ color: '#111', fontSize: 12, fontWeight: 900, letterSpacing: '0.02em' }}>{titulo}</div>
                        {precioUnit && <div style={{ color: '#111', fontSize: 13, fontWeight: 900, marginTop: 3 }}>{precioUnit}</div>}
                      </div>
                    )
                  })() : (
                    <div style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.5, marginBottom: 10, padding: '8px 12px', background: '#F9FAFB', borderRadius: 8, borderLeft: '3px solid #D4AF37' }}>
                      {lightbox.descripcion}
                    </div>
                  )
                )}
                {lightbox.location && lightbox.location !== 'Buenos Aires' && !getBulkInfo(lightbox.category ?? '', lightbox.subcategory ?? '', lightbox.minOrder) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 8, padding: '6px 12px', marginBottom: 10 }}>
                    <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 13, letterSpacing: '0.05em' }}>COD</span>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 8, padding: '6px 12px' }}>
                          <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 13, letterSpacing: '0.05em' }}>SKU</span>
                          <span style={{ color: '#111827', fontWeight: 800, fontSize: 15 }}>
                            {lightbox.location?.startsWith('SKU:') ? lightbox.location.replace('SKU:', '').trim() : 'Sin código'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })()}
                <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>
                  ${lightbox.wholesalePrice.toLocaleString('es-AR')}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setLightbox(null)}
                    style={{ flex: 1, background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px', color: '#374151', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                    Cerrar
                  </button>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => { addItem({ id: lightbox.id, name: lightbox.name, brand: lightbox.brand, price: lightbox.price, wholesalePrice: lightbox.wholesalePrice, image: lightbox.image, minOrder: lightbox.descripcion?.startsWith('PRECIO POR') ? 1 : lightbox.minOrder, category: lightbox.category }); setLightbox(null) }}
                    style={{ flex: 2, background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 10, padding: '10px', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ShoppingCart size={14} /> AGREGAR AL CARRITO
                  </motion.button>
                </div>
              </div>}
            </div>
            {!zoom && <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 16 }}>Tocá afuera para cerrar</div>}
          </motion.div>
        )
      })()}
    </div>
  )
}
