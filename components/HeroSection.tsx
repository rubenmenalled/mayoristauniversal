'use client'

import { useState, useEffect } from 'react'

const SLIDES_DESKTOP = [
  { src: '/portada_desktop.png' },
  { src: '/banner1.png' },
  { src: '/banner2.png' },
  { src: '/banner3.png' },
  { src: '/banner4.png' },
  { src: '/banner5.png' },
]

const SLIDES_MOBILE = [
  { src: '/portada_mobile.png' },
  { src: '/banner1_m.png' },
  { src: '/banner2_m.png' },
  { src: '/banner3_m.png' },
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
        @keyframes panda-mover {
          0%    { transform: translateX(88vw)  scaleX(-1); }
          44%   { transform: translateX(0vw)   scaleX(-1); }
          50%   { transform: translateX(0vw)   scaleX(1);  }
          94%   { transform: translateX(88vw)  scaleX(1);  }
          100%  { transform: translateX(88vw)  scaleX(-1); }
        }
        @media (max-width: 767px) {
          #hero-section { padding-top: 250px; }
          #hero-banner { aspect-ratio: 3/2; }
          .hero-slide { position: absolute !important; inset: 0; }
          .hero-slide img { width: 100%; height: 100%; object-fit: contain; }
        }
        @media (min-width: 768px) {
          #hero-section { padding-top: 200px; }
        }
        .hero-slide {
          transition: opacity 0.8s ease;
        }
        .hero-slide img {
          width: 100%;
          height: auto;
          display: block;
        }
        .hero-slide.active {
          position: relative;
          opacity: 1;
          z-index: 2;
        }
        .hero-slide.inactive {
          position: absolute;
          inset: 0;
          opacity: 0;
          z-index: 1;
          overflow: hidden;
        }
        .hero-slide.inactive img {
          height: 100%;
          object-fit: cover;
        }
      `}</style>

      <section id="hero-section">
        <div id="hero-banner" style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>

          {slides.map((slide, i) => (
            <div key={slide.src} className={`hero-slide ${i === current ? 'active' : 'inactive'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt={`Banner ${i + 1}`} />
            </div>
          ))}

          {/* Panda */}
          <div style={{
            position: 'absolute', bottom: '4%', left: 0, zIndex: 10,
            pointerEvents: 'none',
            animation: 'panda-mover 28s linear infinite',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/panda-v2.gif" alt="Panda"
              style={{ height: 'clamp(80px, 11vw, 150px)', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
          </div>

          {/* Puntos */}
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? 24 : 8, height: 8,
                  borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
                  background: i === current ? '#D4AF37' : 'rgba(255,255,255,0.6)',
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
