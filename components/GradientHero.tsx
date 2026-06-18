'use client'

import { TextReveal } from '@/components/ui/cascade-text'

// Mosaico de rubros (mismas fotos que usan los catálogos)
const COLLAGE = [
  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=70', // jugueteria
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=70', // bebé
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70', // cotillon
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=70', // belleza
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=70', // ropa
  'https://www.juguetemayor.com/upload/goods/20201124/20201124020148_0.jpg', // peluche stitch
  'https://images.pexels.com/photos/6879815/pexels-photo-6879815.jpeg?w=400&h=400&fit=crop', // lenceria
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
          filter: brightness(1) saturate(1.08);
        }
        .hero-blob {
          position: absolute; border-radius: 50%;
          filter: blur(70px); mix-blend-mode: screen; pointer-events: none;
          will-change: transform;
        }
        .hero-blob.a { width: 440px; height: 440px; top: -40px; left: 4%;
          background: rgba(255,106,61,0.95); animation: heroCircle 18s ease-in-out infinite; }
        .hero-blob.b { width: 400px; height: 400px; bottom: -60px; right: 5%;
          background: rgba(70,140,255,0.9); animation: heroCircleRev 24s ease-in-out infinite; }
        .hero-blob.c { width: 320px; height: 320px; top: 8%; left: 34%;
          background: rgba(255,150,90,0.85); animation: heroVert 14s ease-in-out infinite; }
        .hero-blob.d { width: 300px; height: 300px; bottom: 0%; left: 16%;
          background: rgba(110,170,255,0.8); animation: heroHoriz 20s ease-in-out infinite; }
        @keyframes heroCircle {
          0%,100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(160px, 50px) scale(1.12); }
          50% { transform: translate(110px, 150px) scale(1.2); }
          75% { transform: translate(-60px, 90px) scale(1.06); }
        }
        @keyframes heroCircleRev {
          0%,100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(-150px, -60px) scale(1.14); }
          50% { transform: translate(-90px, -150px) scale(1.22); }
          75% { transform: translate(80px, -80px) scale(1.08); }
        }
        @keyframes heroVert {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-120px) scale(1.15); }
        }
        @keyframes heroHoriz {
          0%,100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(170px) scale(1.12); }
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
              'radial-gradient(circle at 28% 30%, rgba(255,106,61,0.16), transparent 45%),' +
              'radial-gradient(circle at 78% 72%, rgba(13,71,161,0.22), transparent 50%),' +
              'linear-gradient(180deg, rgba(11,30,63,0.62) 0%, rgba(11,30,63,0.52) 55%, rgba(11,30,63,0.68) 100%)',
          }} />

          {/* Brillos animados */}
          <div className="hero-blob a" aria-hidden="true" />
          <div className="hero-blob b" aria-hidden="true" />
          <div className="hero-blob c" aria-hidden="true" />
          <div className="hero-blob d" aria-hidden="true" />

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
