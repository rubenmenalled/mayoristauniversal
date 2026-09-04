'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { ShoppingCart, Search } from 'lucide-react'
import { minDeCatalogo, catalogoDe, CATEGORIA_GRUPO_OVERRIDE } from '@/lib/minimos'
import { useCart } from '@/lib/CartContext'

const WA = 'https://wa.me/5491164660482'

const TRANSPORTES = [
  { nombre: 'Correo Argentino', emoji: '📮', desc: 'Entrega en todo el país' },
  { nombre: 'OCA', emoji: '🚛', desc: 'Puerta a puerta en 24-72hs' },
  { nombre: 'Andreani', emoji: '📦', desc: 'Seguimiento online en tiempo real' },
  { nombre: 'Via Cargo', emoji: '🏎️', desc: 'Ideal para envíos al interior' },
  { nombre: 'Expreso Zapla', emoji: '🚚', desc: 'Norte y NOA' },
  { nombre: 'Retiro en depósito', emoji: '🏭', desc: 'Coordiná por WhatsApp' },
]

interface Categoria {
  id: number
  name: string
  image: string
  emoji: string
  count: number
}

interface Producto {
  id: number; name: string; brand: string; category: string; subcategory?: string
  price: number; wholesalePrice: number; minOrder: number
  image: string; badge?: string; discount?: number; location: string; descripcion?: string
}

const PAGE_SIZE = 60
const MIX_CATS = ['JUGUETERIA', 'PELUCHES']

function interleave(arrays: Producto[][]): Producto[] {
  const seen = new Set<number>()
  const result: Producto[] = []
  let i = 0
  let any = true
  while (any) {
    any = false
    for (const arr of arrays) {
      if (i < arr.length) {
        any = true
        const p = arr[i]
        if (p && !seen.has(p.id)) { seen.add(p.id); result.push(p) }
      }
    }
    i++
  }
  return result
}

function ProductoCard({ p, onAdd }: { p: Producto; onAdd: (p: Producto) => void }) {
  const cat = (p.category ?? '').toUpperCase()
  const sub = (p.subcategory ?? '').toUpperCase()
  const esBulk = sub === 'POP IT' || sub === 'INFAC-TEC' || sub === 'TOYS.AR' || ['IMPORTADORA MAX', 'IMPORTADORA COMEX', 'IMPORTADORA TREN'].includes(cat)
  const esDocena = sub === 'LENCERIA POR BULTO'
  const isDescPor = p.descripcion?.startsWith('PRECIO POR')

  let titulo: string | null = null
  let precioUnit: string | null = null
  if (isDescPor) {
    const sepIdx = (p.descripcion || '').indexOf(') | ')
    const pricePart = sepIdx >= 0 ? (p.descripcion || '').slice(0, sepIdx + 1) : (p.descripcion || '')
    const match = pricePart.match(/^(PRECIO POR \d+ UNIDADES)\s*\((.+)\)$/)
    titulo = match ? match[1] : pricePart
    precioUnit = match ? `$${Math.round(p.wholesalePrice / Math.max(1, p.minOrder)).toLocaleString('es-AR')} c/u` : null
  } else if (p.badge === 'x6 UNIDADES') {
    titulo = 'PRECIO POR 6 UNIDADES'
    precioUnit = `$${Math.round(p.wholesalePrice / 6).toLocaleString('es-AR')} c/u`
  } else if (p.minOrder > 1) {
    if (esDocena) {
      titulo = `VENTA POR ${p.minOrder} DOCENAS`
      precioUnit = `$${p.wholesalePrice.toLocaleString('es-AR')} la docena`
    } else {
      titulo = `PRECIO POR ${p.minOrder} UNIDADES`
      precioUnit = `$${(esBulk ? p.wholesalePrice : Math.round(p.wholesalePrice / p.minOrder)).toLocaleString('es-AR')} c/u`
    }
  }
  const totalLine = (() => {
    if (!titulo) return null
    const total = (esBulk || esDocena) ? p.wholesalePrice * p.minOrder : p.wholesalePrice
    const label = esDocena ? `EL BULTO (${p.minOrder} DOCENAS)` : esBulk ? `EL BULTO X${p.minOrder}` : p.minOrder === 12 ? 'LA DOCENA' : `PACK X ${p.minOrder}`
    return `${label}: $${total.toLocaleString('es-AR')}`
  })()

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <div style={{ position: 'relative', height: 160, background: '#F8F8F8' }}>
        {p.image ? (
          <Image src={p.image} alt={p.name} fill className="object-contain" sizes="220px" quality={80} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>📦</div>
        )}
        {(p.discount ?? 0) > 0 && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 99 }}>-{p.discount}%</span>
        )}
        <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(11,30,63,0.85)', color: '#FFD13C', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 6, maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p.category}
        </span>
      </div>
      <div style={{ padding: 10 }}>
        {p.brand && <div style={{ color: '#9CA3AF', fontSize: 9, fontWeight: 700, marginBottom: 2, textTransform: 'uppercase' }}>{p.brand}</div>}
        <h3 style={{ color: '#111827', fontSize: 12, fontWeight: 700, lineHeight: 1.3, marginBottom: 6, minHeight: 30, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h3>

        {titulo ? (
          <div style={{ background: '#FFFDE7', border: '1.5px solid #F59E0B', borderRadius: 6, padding: '5px 8px', marginBottom: 6 }}>
            {precioUnit && <div style={{ color: '#111', fontSize: 15, fontWeight: 900 }}>{precioUnit}</div>}
            <span style={{ color: '#111', fontSize: 9.5, fontWeight: 900 }}>{titulo}</span>
            {totalLine && <div style={{ color: '#C2410C', fontSize: 11.5, fontWeight: 900, marginTop: 2 }}>{totalLine}</div>}
          </div>
        ) : (
          <div style={{ color: '#6B7280', fontSize: 10, marginBottom: 6 }}>
            Mayorista: <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 15 }}>${p.wholesalePrice.toLocaleString('es-AR')}</span>
          </div>
        )}

        <button
          onClick={() => onAdd(p)}
          style={{ width: '100%', padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#0D2C54', fontSize: 11.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          <ShoppingCart size={12} /> AGREGAR
        </button>
      </div>
    </div>
  )
}

export default function CatalogosSection({ categorias }: { categorias?: Categoria[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [orden, setOrden] = useState<'recientes' | 'menor' | 'mayor'>('recientes')
  const [productos, setProductos] = useState<Producto[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  const unicas = useMemo(() => {
    if (!categorias) return []
    const vistas = new Set<string>()
    return categorias.filter(cat => {
      const nombre = cat.name.toUpperCase()
      const key = nombre === 'BEBES' ? 'BEBÉ' : nombre
      if (vistas.has(key)) return false
      vistas.add(key)
      return true
    })
  }, [categorias])

  const PROXIMAMENTE = new Set(['RODADOS'])
  const catsReales = unicas.filter(c => !PROXIMAMENTE.has(c.name.toUpperCase()))

  const toggleCat = (nombre: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(nombre)) next.delete(nombre)
      else next.add(nombre)
      return next
    })
    setPage(0)
  }

  const fetchProductos = useCallback(async (pageToFetch: number) => {
    setLoading(true)
    try {
      if (selected.size === 0) {
        // Mezcla para la pantalla principal: juguetes + peluches con más peso,
        // más una porción general (todas las categorías) para variedad.
        const limitFoco = (pageToFetch + 1) * 20
        const [jugData, pelData, genRes] = await Promise.all([
          fetch(`/api/productos-publicos?categoria=${encodeURIComponent(MIX_CATS[0])}&limit=${limitFoco}`).then(r => r.json()).catch(() => [] as Producto[]),
          fetch(`/api/productos-publicos?categoria=${encodeURIComponent(MIX_CATS[1])}&limit=${limitFoco}`).then(r => r.json()).catch(() => [] as Producto[]),
          fetch(`/api/productos-publicos?page=${pageToFetch}`).then(async r => ({
            data: await r.json() as Producto[],
            total: parseInt(r.headers.get('X-Total-Count') || '0', 10),
          })).catch(() => ({ data: [] as Producto[], total: 0 })),
        ])
        setTotalCount(genRes.total)
        setProductos(interleave([jugData, pelData, genRes.data]))
      } else {
        const limit = (pageToFetch + 1) * PAGE_SIZE
        const results = await Promise.all(
          Array.from(selected).map(nombre =>
            fetch(`/api/productos-publicos?categoria=${encodeURIComponent(nombre)}&limit=${limit}`)
              .then(r => r.json()).catch(() => [] as Producto[])
          )
        )
        const seen = new Set<number>()
        const merged: Producto[] = []
        for (const arr of results) {
          if (!Array.isArray(arr)) continue
          for (const p of arr) { if (!seen.has(p.id)) { seen.add(p.id); merged.push(p) } }
        }
        setTotalCount(merged.length)
        setProductos(merged)
      }
    } finally {
      setLoading(false)
    }
  }, [selected])

  useEffect(() => {
    setPage(0)
    fetchProductos(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const cargarMas = () => {
    const next = page + 1
    setPage(next)
    fetchProductos(next)
  }

  const productosFiltrados = useMemo(() => {
    let arr = productos
    const min = parseInt(precioMin, 10)
    const max = parseInt(precioMax, 10)
    if (!isNaN(min)) arr = arr.filter(p => p.wholesalePrice >= min)
    if (!isNaN(max)) arr = arr.filter(p => p.wholesalePrice <= max)
    if (orden === 'menor') arr = [...arr].sort((a, b) => a.wholesalePrice - b.wholesalePrice)
    else if (orden === 'mayor') arr = [...arr].sort((a, b) => b.wholesalePrice - a.wholesalePrice)
    return arr
  }, [productos, precioMin, precioMax, orden])

  const handleAdd = (p: Producto) => {
    const cat = (p.category ?? '').toUpperCase()
    const sub = (p.subcategory ?? '').toUpperCase()
    const esU = sub === 'POP IT' || sub === 'LENCERIA POR BULTO' || sub === 'INFAC-TEC' || sub === 'TOYS.AR' || ['IMPORTADORA MAX', 'IMPORTADORA COMEX', 'IMPORTADORA TREN'].includes(cat)
    const isDescPor = p.descripcion?.startsWith('PRECIO POR')
    const dividir = !isDescPor && !esU && p.minOrder > 1
    addItem({
      id: p.id, name: p.name, brand: p.brand, price: p.price,
      wholesalePrice: dividir ? Math.round(p.wholesalePrice / p.minOrder) : p.wholesalePrice,
      image: p.image, minOrder: isDescPor ? 1 : p.minOrder, category: p.category,
    })
  }

  if (categorias === undefined) return null

  return (
    <>
    <section id="catalogos" style={{ background: 'linear-gradient(180deg, #0B1E3F 0%, #13294f 100%)', padding: '4px clamp(16px, 2.5vw, 40px) 24px' }}>
      <div style={{ maxWidth: 1500, margin: '0 auto' }}>

        <style dangerouslySetInnerHTML={{ __html: `
          .envios-hide-mobile { display: inline; }
          .envios-mp { display: flex; }
          .cat-check-row:hover { background: rgba(255,106,61,0.08) !important; }
          .cat-sidebar { flex: 0 0 250px; }
          .cat-main { flex: 1; min-width: 0; }
          @media (max-width: 780px) {
            .envios-hide-mobile { display: none; }
            .envios-mp { display: none; }
            .cat-layout { flex-direction: column !important; }
            .cat-sidebar { flex: 1 1 auto !important; }
          }
        `}} />

        <div
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(4px, 2vw, 10px)',
            padding: '6px 10px', marginBottom: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.97)',
            borderRadius: 8,
            border: '1px solid rgba(255,106,61,0.2)',
            overflow: 'hidden',
          }}
        >
          <span style={{ color: '#0B1E3F', fontWeight: 900, fontSize: 'clamp(10px,2.5vw,13px)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            IMPORTADOR DIRECTO
          </span>
          <div style={{ width: 1, height: 14, background: 'rgba(0,0,0,0.15)', flexShrink: 0 }} />
          <span style={{ fontSize: 'clamp(14px,3.5vw,18px)', flexShrink: 0 }}>🚚</span>
          <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 'clamp(10px,2.5vw,13px)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            ENVÍOS A TODO EL PAÍS
          </span>
          <span className="envios-hide-mobile" style={{ color: '#7a8a9a', fontSize: 10, whiteSpace: 'nowrap' }}>· Tocá aquí</span>
          <span style={{ fontSize: 'clamp(12px,3vw,16px)', flexShrink: 0 }}>🇦🇷</span>
          <div className="envios-mp" style={{ alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.12)' }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mp-logo.png" alt="Mercado Pago" style={{ height: 16, objectFit: 'contain', display: 'block', marginLeft: 4 }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '2px solid rgba(255,106,61,0.3)', paddingBottom: 12 }}>
          <h2 style={{
            color: '#FF6A3D', fontWeight: 900, fontSize: 'clamp(20px, 2.5vw, 28px)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            margin: 0,
          }}>
            📋 Nuestros Catálogos
          </h2>
          <a href="/como-comprar" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)',
            color: '#FFFFFF', fontWeight: 900,
            fontSize: 'clamp(10px,1.4vw,12px)',
            padding: '7px 14px', borderRadius: 8,
            textDecoration: 'none', whiteSpace: 'nowrap',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            ❓ Cómo Comprar
          </a>
        </div>

        <div className="cat-layout" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Sidebar de filtros */}
          <aside className="cat-sidebar" style={{
            background: '#FFFFFF', borderRadius: 14, padding: 18,
            position: 'sticky', top: 90, boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}>
            <div style={{ color: '#0B1E3F', fontWeight: 900, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
              Filtrar por categoría
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 12, maxHeight: 480, overflowY: 'auto' }}>
              {catsReales.map(cat => {
                const nombre = cat.name
                const esGrupo = !!CATEGORIA_GRUPO_OVERRIDE[nombre.toUpperCase()]
                const min = minDeCatalogo(catalogoDe(nombre))
                const checked = selected.has(nombre)
                return (
                  <label key={cat.id} className="cat-check-row" style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 6px',
                    borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s ease',
                  }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleCat(nombre)}
                      style={{ marginTop: 3, accentColor: '#FF6A3D', width: 15, height: 15, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#1a1a2e', fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>{cat.emoji}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{nombre}</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 1 }}>
                        {cat.count.toLocaleString('es-AR')} art. {esGrupo ? <span style={{ color: '#D97706', fontWeight: 700 }}>· combinable</span> : min > 0 ? <span style={{ color: '#D97706', fontWeight: 700 }}>· mín ${min.toLocaleString('es-AR')}</span> : null}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
            <div style={{ borderTop: '1px solid #EEE', paddingTop: 14, marginTop: 2 }}>
              <div style={{ color: '#0B1E3F', fontWeight: 900, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                Precio
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder="Desde" value={precioMin} onChange={e => setPrecioMin(e.target.value)}
                  style={{ width: '50%', border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 8px', fontSize: 12, outline: 'none' }} />
                <input type="number" placeholder="Hasta" value={precioMax} onChange={e => setPrecioMax(e.target.value)}
                  style={{ width: '50%', border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 8px', fontSize: 12, outline: 'none' }} />
              </div>
            </div>

            {(selected.size > 0 || precioMin || precioMax) && (
              <button onClick={() => { setSelected(new Set()); setPrecioMin(''); setPrecioMax('') }} style={{
                marginTop: 14, width: '100%', background: '#F3F4F6', border: 'none', borderRadius: 8,
                padding: '8px', color: '#374151', fontWeight: 800, fontSize: 11.5, cursor: 'pointer',
              }}>
                Limpiar filtros
              </button>
            )}
          </aside>

          {/* Grilla de productos */}
          <div className="cat-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5 }}>
                {selected.size > 0 && `${productosFiltrados.length.toLocaleString('es-AR')} productos`}
                {selected.size === 0 && `${totalCount.toLocaleString('es-AR')} productos en total`}
              </div>
              <select value={orden} onChange={e => setOrden(e.target.value as any)} style={{
                background: '#FFFFFF', border: 'none', borderRadius: 8, padding: '6px 10px',
                fontSize: 12, fontWeight: 700, color: '#1a1a2e', cursor: 'pointer',
              }}>
                <option value="recientes">{selected.size === 0 ? 'Mezcla del catálogo' : 'Más recientes'}</option>
                <option value="menor">Precio: menor a mayor</option>
                <option value="mayor">Precio: mayor a menor</option>
              </select>
            </div>

            {productosFiltrados.length === 0 && !loading ? (
              <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,106,61,0.15)', borderRadius: 20 }}>
                <Search size={40} color="#7a8a9a" style={{ marginBottom: 12 }} />
                <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 16 }}>Sin resultados con estos filtros</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {productosFiltrados.map(p => (
                  <ProductoCard key={p.id} p={p} onAdd={handleAdd} />
                ))}
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: 24, fontSize: 13 }}>Cargando...</div>
            )}

            {!loading && (selected.size === 0 ? productos.length < totalCount : true) && productosFiltrados.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button onClick={cargarMas} style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,106,61,0.4)',
                  color: '#FFFFFF', fontWeight: 800, fontSize: 12.5, padding: '10px 24px',
                  borderRadius: 99, cursor: 'pointer',
                }}>
                  Cargar más productos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Modal de envíos */}
    {modalOpen && (
      <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)', border: '1px solid rgba(255,106,61,0.35)', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 20 }}>🚚 ENVÍOS A TODO EL PAÍS</div>
              <div style={{ color: '#7a8a9a', fontSize: 13, marginTop: 4 }}>Trabajamos con los principales transportes</div>
            </div>
            <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
          <div style={{ background: 'rgba(255,106,61,0.08)', border: '1px solid rgba(255,106,61,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ color: '#FF6A3D', fontWeight: 800, fontSize: 13, marginBottom: 8 }}>¿Cómo funciona?</div>
            <div style={{ color: '#555', fontSize: 13, lineHeight: 1.7 }}>
              1️⃣ Hacé tu pedido desde el catálogo<br />
              2️⃣ Te contactamos por WhatsApp para coordinar pago y envío<br />
              3️⃣ Elegís el transporte de tu preferencia<br />
              4️⃣ Tu pedido llega a cualquier provincia 🇦🇷
            </div>
          </div>
          <div style={{ background: 'rgba(0,158,227,0.08)', border: '1px solid rgba(0,158,227,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⏱️</span>
            <span style={{ color: '#555', fontSize: 13, lineHeight: 1.5 }}>
              <strong style={{ color: '#333' }}>Demoras de entrega:</strong> pueden tardar de <strong style={{ color: '#C01515' }}>1 a 7 días hábiles</strong> aproximadamente.
            </span>
          </div>
          <div style={{ color: '#333', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', marginBottom: 12 }}>TRANSPORTES DISPONIBLES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {TRANSPORTES.map(t => (
              <div key={t.nombre} style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(255,106,61,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{t.emoji}</div>
                <div style={{ color: '#333', fontWeight: 800, fontSize: 13 }}>{t.nombre}</div>
                <div style={{ color: '#7a8a9a', fontSize: 11, marginTop: 3 }}>{t.desc}</div>
              </div>
            ))}
          </div>
          <a href={`${WA}?text=${encodeURIComponent('¡Hola! Quiero consultar sobre opciones de envío y transporte.')}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg,#16a34a,#15803d)', borderRadius: 14, padding: 16, width: '100%', color: '#FFFFFF', fontWeight: 900, fontSize: 16, textDecoration: 'none', boxShadow: '0 4px 20px rgba(22,163,74,0.4)' }}>
            <span style={{ fontSize: 22 }}>💬</span> Consultar por WhatsApp
          </a>
          <div style={{ color: '#7a8a9a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>Respondemos en el momento · Lun a Sab 9 a 18hs</div>
        </div>
      </div>
    )}
    </>
  )
}
