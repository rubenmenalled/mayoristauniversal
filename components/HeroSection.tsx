'use client'

import { useState, useEffect } from 'react'

const SLIDES_DESKTOP = [
  { src: '/portada_desktop.jpg' },
  { src: '/banner_lenceria.jpg' },
  { src: '/banner_pantuflas.jpg' },
  { src: '/banner_peluches_madera.jpg' },
  { src: '/banner_licencia_clubes.jpg' },
  { src: '/banner1.jpg' },
  { src: '/banner2.jpg' },
  { src: '/banner3.jpg' },
  { src: '/banner4.jpg' },
  { src: '/banner5.jpg' },
]

const SLIDES_MOBILE = [
  { src: '/portada_mobile.jpg' },
  { src: '/banner_lenceria.jpg' },
  { src: '/banner_pantuflas.jpg' },
  { src: '/banner_peluches_madera.jpg' },
  { src: '/banner_licencia_clubes.jpg' },
  { src: '/banner1_m.jpg' },
  { src: '/banner2_m.jpg' },
  { src: '/banner3_m.jpg' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const slides = isMobile ? SLIDES_MOBILE : SLIDES_DESKTOP

  useEffect(() => {
    setCurrent(c => Math.min(c, slides.length - 1))
  }, [slides.length])

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  return (
    <>
      <style>{`
        #hero-section {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        #hero-banner {
          background: #0B1E3F;
        }
        @media (max-width: 767px) {
          #hero-section { padding-top: 250px; }
          #hero-banner { aspect-ratio: 3/2; }
        }
        @media (min-width: 768px) {
          #hero-section { padding-top: 200px; }
          #hero-banner { aspect-ratio: 5/2; }
        }
        /* Todos los slides ocupan exactamente el mismo recuadro fijo */
        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          z-index: 1;
          transition: opacity 0.8s ease;
        }
        .hero-slide.active {
          opacity: 1;
          z-index: 2;
        }
        /* Fondo borroso (rellena bordes sin distorsionar) */
        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(24px) brightness(0.55);
          transform: scale(1.12);
        }
        /* Banner completo, sin recorte ni distorsión */
        .hero-fg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
      `}</style>

      <section id="hero-section">
        <div id="hero-banner" style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>

          {slides.map((slide, i) => (
            <div key={slide.src} className={`hero-slide ${i === current ? 'active' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-bg" src={slide.src} alt="" aria-hidden="true" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero-fg"
                src={slide.src}
                alt={`Banner ${i + 1}`}
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}


          {/* Puntos */}
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? 24 : 8, height: 8,
                  borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
                  background: i === current ? '#F5C518' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.35s ease',
                }} />
            ))}
          </div>

          {/* Flechas */}
          <button onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: 38, height: 38, color: '#FFF', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ‹
          </button>
          <button onClick={() => setCurrent(c => (c + 1) % slides.length)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: 38, height: 38, color: '#FFF', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ›
          </button>

        </div>
      </section>
    </>
  )
}
