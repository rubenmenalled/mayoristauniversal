'use client'

import { TextReveal } from '@/components/ui/cascade-text'

// Mosaico de rubros (mismas fotos que usan los catálogos)
const COLLAGE = [
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=70', // jugueteria
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=70', // bebé
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70', // cotillon
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=70', // belleza
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=70', // ropa
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=70', // calzado
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=70', // deco bazar
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=70', // cocina
  'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&q=70', // relojes
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=70', // bijouterie
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=70', // mascotas
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=70', // electronica
]

export default function GradientHero() {
  return (
    <section style={{ width: '100%' }}>
      <style>{`
        #grad-hero { padding-top: 200px; }
        #grad-hero-band { height: 380px; }
        #hero-collage {
          position: absolute; inset: 0; display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: 50%;
        }
        #hero-collage > span {
          background-size: cover; background-position: center;
          filter: brightness(0.85) saturate(1.05);
        }
        .hero-blob {
          position: absolute; border-radius: 50%;
          filter: blur(48px); mix-blend-mode: screen; pointer-events: none;
        }
        .hero-blob.a { width: 360px; height: 360px; top: -80px; left: 8%;
          background: rgba(255,106,61,0.55); animation: heroFloatA 14s ease-in-out infinite; }
        .hero-blob.b { width: 300px; height: 300px; bottom: -90px; right: 10%;
          background: rgba(13,71,161,0.6); animation: heroFloatB 18s ease-in-out infinite; }
        @keyframes heroFloatA {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes heroFloatB {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px, -30px) scale(1.12); }
        }
        @media (max-width: 767px) {
          #grad-hero { padding-top: 250px; }
          #grad-hero-band { height: 320px; }
          #hero-collage { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 25%; }
        }
      `}</style>
      <div id="grad-hero">
        <div id="grad-hero-band" style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#0B1E3F' }}>
          {/* Collage de rubros */}
          <div id="hero-collage" aria-hidden="true">
            {COLLAGE.map((src, i) => (
              <span key={i} style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>

          {/* Velo navy + tinte coral para legibilidad */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background:
              'radial-gradient(circle at 28% 30%, rgba(255,106,61,0.22), transparent 45%),' +
              'radial-gradient(circle at 78% 72%, rgba(13,71,161,0.30), transparent 50%),' +
              'linear-gradient(180deg, rgba(11,30,63,0.88) 0%, rgba(11,30,63,0.82) 55%, rgba(11,30,63,0.90) 100%)',
          }} />

          {/* Brillos animados */}
          <div className="hero-blob a" aria-hidden="true" />
          <div className="hero-blob b" aria-hidden="true" />

          {/* Contenido */}
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-4">
            <h1 style={{
              color: '#FFFFFF', fontWeight: 900, lineHeight: 1.05, margin: 0,
              fontSize: 'clamp(34px, 6vw, 68px)', letterSpacing: '-0.02em',
              textShadow: '0 4px 30px rgba(0,0,0,0.55)',
            }}>
              MAYORISTA UNIVERSAL
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.94)', margin: '14px 0 0', fontWeight: 600,
              fontSize: 'clamp(15px, 2.4vw, 22px)', textShadow: '0 2px 16px rgba(0,0,0,0.5)',
            }}>
              Todo para tu negocio en un solo lugar · Comprá al por mayor con envío a todo el país
            </p>
            <a href="/catalogo" className="btn-agregar" style={{
              marginTop: 26, background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)',
              color: '#FFFFFF', fontWeight: 900, fontSize: 16, textDecoration: 'none',
              padding: '13px 30px', borderRadius: 12, boxShadow: '0 8px 24px rgba(255,106,61,0.45)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TextReveal text="Ver catálogo" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
