'use client'

import { GlowCard } from '@/components/ui/spotlight-card'

const BASE = 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/'

const CATS = [
  { name: 'TENDENCIAS', img: 'cat-tendencias.jpg?v=2' },
  { name: 'NEXT MUNDO', img: 'cat-nextmundo.jpg?v=1' },
  { name: 'BEBÉ', img: 'cat-bebe-v3.jpg?v=1' },
  { name: 'MULTI-POP', img: 'cat-multipop-v2.jpg?v=3' },
  { name: 'PELUCHES PERSONAJES', img: 'banner-personajes-toystory.jpg?v=2' },
  { name: 'CITY LAND', img: 'sub-cityland.jpg?v=1' },
]

export default function GlowTestPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D2C54', padding: '40px 16px' }}>
      <h1 style={{ color: '#fff', textAlign: 'center', fontWeight: 900, fontSize: 28, marginBottom: 6 }}>
        Prueba: catálogos con efecto Spotlight ✨
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>
        Mové el mouse por la pantalla — el borde brilla y sigue el puntero
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 26, justifyContent: 'center', maxWidth: 1100, margin: '0 auto' }}>
        {CATS.map((c) => (
          <GlowCard key={c.name} glowColor="orange" customSize width={300} height={200} className="p-0">
            <div style={{ position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden' }}>
              <img src={BASE + c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)' }} />
              <div style={{ position: 'absolute', left: 16, bottom: 14, color: '#fff', fontWeight: 900, fontSize: 20, textShadow: '0 2px 6px rgba(0,0,0,.6)' }}>
                {c.name}
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  )
}
