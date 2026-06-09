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
    <div style={{ flex: '0 0 auto', width: 180, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ position: 'relative', height: 160, background: '#F5F5F5' }}>
        {p.image
          ? <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="180px" />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 40 }}>📦</div>}
      </div>
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ color: '#111827', fontSize: 11, fontWeight: 700, lineHeight: 1.3, marginBottom: 6, minHeight: 28, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
        <div style={{ marginTop: 'auto' }}>
          {isPack ? (
            <>
              <div style={{ color: '#111827', fontSize: 18, fontWeight: 900, lineHeight: 1.1 }}>
                {fmt(cu)} <span style={{ color: '#6B7280', fontSize: 11, fontWeight: 700 }}>c/u</span>
              </div>
              <div style={{ color: '#B45309', fontSize: 12, fontWeight: 700, marginTop: 1 }}>
                {p.minOrder === 12 ? 'la docena' : `pack x${p.minOrder}`}: {fmt(big)}
              </div>
            </>
          ) : (
            <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 18 }}>{fmt(big)}</div>
          )}
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

// Intercala round-robin entre grupos (para que el mix tenga variedad)
function interleave(groups: Prod[][], max: number): Prod[] {
  const out: Prod[] = []; const seen = new Set<number>()
  let i = 0
  while (out.length < max) {
    let added = false
    for (const g of groups) {
      if (g[i] && !seen.has(g[i].id)) { out.push(g[i]); seen.add(g[i].id); added = true; if (out.length >= max) break }
    }
    if (!added) break
    i++
  }
  return out
}

export default function ProductRow({ title, emoji, subtitle, urls, max = 18, href }: {
  title: string; emoji: string; subtitle?: string; urls: string[]; max?: number; href?: string
}) {
  const [prods, setProds] = useState<Prod[]>([])
  useEffect(() => {
    Promise.all(urls.map(u => fetch(u).then(r => r.json()).catch(() => [])))
      .then(res => {
        const groups = res.map(g => (Array.isArray(g) ? g.filter((p: Prod) => p.image) : []))
        setProds(interleave(groups, max))
      })
      .catch(() => {})
  }, [])

  if (prods.length === 0) return null

  return (
    <section style={{ padding: '28px 0', borderTop: '1px solid #EEEEEE' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>{emoji}</span>
            <h2 style={{ color: '#111827', fontWeight: 900, fontSize: 22, margin: 0 }}>{title}</h2>
          </div>
          {href && <a href={href} style={{ color: '#B45309', fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Ver todo →</a>}
        </div>
        {subtitle && <p style={{ color: '#6B7280', fontSize: 13, margin: '0 0 16px' }}>{subtitle}</p>}
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
          {prods.map(p => <Card key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  )
}
