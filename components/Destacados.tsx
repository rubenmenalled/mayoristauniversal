'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'

interface Prod {
  id: number; name: string; brand?: string; category?: string; subcategory?: string
  price: number; wholesalePrice: number; minOrder: number; image: string; images?: string[]
}

function fmt(n: number) { return `$${Number(n).toLocaleString('es-AR')}` }

function Card({ p }: { p: Prod }) {
  const { addItem, setCartOpen } = useCart()
  const esU = (p.category ?? '').toUpperCase() === 'COTILLON' || (p.subcategory ?? '').toUpperCase() === 'POP IT'
  const isPack = p.minOrder > 1
  const packTotal = esU ? p.wholesalePrice * p.minOrder : p.wholesalePrice
  const cu = esU ? p.wholesalePrice : (isPack ? Math.round(p.wholesalePrice / p.minOrder) : p.wholesalePrice)
  const big = isPack ? packTotal : p.wholesalePrice

  return (
    <div style={{
      flex: '0 0 auto', width: 180, background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', height: 160, background: '#F5F5F5' }}>
        {p.image
          ? <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="180px" />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>📦</div>}
      </div>
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 6, minHeight: 28, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
        <div style={{ marginTop: 'auto' }}>
          {isPack && <div style={{ color: '#9aabb8', fontSize: 10 }}>{fmt(cu)} c/u</div>}
          <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 16 }}>
            {fmt(big)}
            {isPack && <span style={{ color: '#92400E', fontSize: 10, fontWeight: 700, marginLeft: 4 }}>{p.minOrder === 12 ? 'la docena' : `pack x${p.minOrder}`}</span>}
          </div>
        </div>
        <button
          onClick={() => { addItem({ id: p.id, name: p.name, price: p.price, wholesalePrice: p.wholesalePrice, image: p.image, minOrder: p.minOrder, brand: p.brand, category: p.category }); setCartOpen(true) }}
          style={{ marginTop: 8, background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 8, padding: '8px', color: '#0F3460', fontWeight: 900, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          🛒 Agregar
        </button>
      </div>
    </div>
  )
}

export default function Destacados() {
  const [prods, setProds] = useState<Prod[]>([])
  useEffect(() => {
    fetch('/api/productos-publicos?destacados=true')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setProds(d) })
      .catch(() => {})
  }, [])

  if (prods.length === 0) return null

  return (
    <section style={{ padding: '32px 0', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>⭐</span>
          <h2 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 22, margin: 0 }}>Destacados</h2>
        </div>
        <p style={{ color: '#7a8a9a', fontSize: 13, margin: '0 0 18px' }}>Lo mejor de nuestro catálogo, al precio mayorista</p>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
          {prods.map(p => <Card key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  )
}
