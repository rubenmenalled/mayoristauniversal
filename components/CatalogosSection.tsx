'use client'

// Fotos de stock por categoría (Unsplash)
const FOTOS: Record<string, string> = {
  BAZAR:        '/cat_bazar.jpg',
  BEBE:         'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  BEBES:        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  BELLEZA:      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
  BLANQUERIA:   '/cat_blanqueria.jpg',
  COTILLON:     'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
  ELECTRONICA:  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  FITNESS:      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  HERRAMIENTAS: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80',
  JUGUETERIA:   'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80',
  LIBRERIA:     'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  MARROQUINERIA:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  MASCOTAS:     'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&q=80',
  OPTICA:       'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
  PELUCHES:            '/cat_peluches.jpg',
  'PELUCHES ENAMORADOS':   'https://images.unsplash.com/photo-1762542523027-e44a394788b6?w=600&q=80&auto=format&fit=crop',
  'PRODUCTOS REGIONALES':  'https://images.unsplash.com/photo-1675001077167-ba5dd533be2f?w=600&q=80&auto=format&fit=crop',
  PERFUMERIA:   '/cat_perfumeria.jpg',
  RODADOS:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  HOGAR:        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  COCINA:       'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
  DEPORTES:     'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
  ROPA:         'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
  CALZADO:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
}

interface Categoria {
  id: number
  name: string
  image: string
  emoji: string
  count: number
}

const SHIMMER_KEYFRAMES = `
@keyframes shimmer {
  0%   { background-position: -800px 0; }
  100% { background-position:  800px 0; }
}
`

function SkeletonGrid() {
  return (
    <section style={{ background: '#020810', padding: 'clamp(16px, 3vw, 32px) 16px' }}>
      <style dangerouslySetInnerHTML={{ __html: SHIMMER_KEYFRAMES }} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Título skeleton */}
        <div style={{
          height: 28, width: 260, borderRadius: 6, marginBottom: 28,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%)',
          backgroundSize: '800px 100%',
          animation: 'shimmer 1.6s infinite linear',
        }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: 12,
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 'clamp(160px, 30vw, 220px)',
                borderRadius: 12,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%)',
                backgroundSize: '800px 100%',
                animation: 'shimmer 1.6s infinite linear',
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function CatalogosSection({ categorias }: { categorias?: Categoria[] }) {

  if (categorias === undefined) return null
  if (categorias.length === 0) return <SkeletonGrid />

  // Eliminar duplicados (ej: BEBE y BEBES)
  const vistas = new Set<string>()
  const unicas = categorias.filter(cat => {
    const key = cat.name.toUpperCase().replace(/S$/, '') // BEBES → BEBE
    if (vistas.has(key)) return false
    vistas.add(key)
    return true
  })

  return (
    <section id="catalogos" style={{ background: '#020810', padding: 'clamp(16px, 3vw, 32px) 16px' }}>
      {/* Título */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          color: '#D4AF37', fontWeight: 900, fontSize: 'clamp(20px, 2.5vw, 28px)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 24, borderBottom: '2px solid rgba(212,175,55,0.3)',
          paddingBottom: 12,
        }}>
          📋 Nuestros Catálogos
        </h2>

        {/* Grid de tarjetas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: 12,
        }}>
          {unicas.map(cat => (
            <a
              key={cat.id}
              href={`/categorias/${encodeURIComponent(cat.name)}`}
              style={{
                position: 'relative',
                display: 'block',
                height: 'clamp(160px, 30vw, 220px)',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                textDecoration: 'none',
                background: '#071633',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              {/* Imagen de fondo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image || FOTOS[cat.name.toUpperCase()] || FOTOS['BAZAR']}
                alt={cat.name}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />

              {/* Overlay oscuro */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.65) 100%)',
              }} />

              {/* Nombre categoría — arriba izquierda */}
              <div style={{
                position: 'absolute', top: 16, left: 16,
                color: '#fff', fontWeight: 900,
                fontSize: 'clamp(18px, 2vw, 22px)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}>
                {cat.name}
              </div>

              {/* VER MÁS — abajo izquierda */}
              <div style={{
                position: 'absolute', bottom: 16, left: 16,
                color: '#D4AF37', fontWeight: 800,
                fontSize: 13, letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                VER MÁS →
              </div>

              {/* Borde dorado al hover */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: 12,
                border: '2px solid transparent',
                transition: 'border-color 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
