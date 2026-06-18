'use client'

import { useEffect, useState } from 'react'
import SocialCards, { CardItem } from '@/components/ui/card-fan-carousel'

interface Prod { id: number; name: string; image: string }

export default function DestacadosFan() {
  const [cards, setCards] = useState<CardItem[]>([])

  useEffect(() => {
    fetch('/api/productos-publicos?destacados=true', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Prod[]) => {
        if (!Array.isArray(data)) return
        const items = data
          .filter(p => p.image)
          .slice(0, 12)
          .map(p => ({
            imgUrl: p.image,
            alt: p.name,
            linkUrl: `/buscar?q=${encodeURIComponent(p.name)}`,
          }))
        setCards(items)
      })
      .catch(() => {})
  }, [])

  if (cards.length === 0) return null

  return (
    <section style={{ padding: '40px 0 8px', borderTop: '1px solid #EEEEEE', background: '#FFFFFF' }}>
      <style>{`
        .fan-title {
          font-weight: 900; font-size: clamp(24px, 4vw, 34px); margin: 0; letter-spacing: -0.01em;
          background: linear-gradient(90deg, #0D2C54 0%, #FF6A3D 65%, #FF8A63 100%);
          -webkit-background-clip: text; background-clip: text;
          color: transparent; -webkit-text-fill-color: transparent;
        }
        .fan-beam {
          height: 3px; border-radius: 3px; margin: 8px auto 0; width: 120px;
          background: linear-gradient(90deg, rgba(255,106,61,0) 0%, #FF6A3D 18%, #FFD089 50%, #FF6A3D 82%, rgba(255,106,61,0) 100%);
          background-size: 220% 100%;
          animation: fanBeam 2.6s linear infinite;
        }
        @keyframes fanBeam { 0% { background-position: 220% 0; } 100% { background-position: -220% 0; } }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h2 className="fan-title">⭐ Destacados</h2>
        <span className="fan-beam" style={{ display: 'block' }} />
        <p style={{ color: '#6B7280', fontSize: 14, margin: '10px 0 0' }}>
          Lo mejor de nuestro catálogo — tocá una carta para verla
        </p>
      </div>
      <SocialCards cards={cards} />
    </section>
  )
}
