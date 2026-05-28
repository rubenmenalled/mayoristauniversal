'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  { desktop: '/portada_desktop.png', mobile: '/portada_mobile.png' },
  { desktop: '/banner1.png',         mobile: '/banner1.png' },
  { desktop: '/banner2.png',         mobile: '/banner2.png' },
  { desktop: '/banner3.png',         mobile: '/banner3.png' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

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
        @keyframes hero-kenburns {
          0%   { transform: scale(1)    translateX(0)    translateY(0); }
          50%  { transform: scale(1.05) translateX(-0.5%) translateY(-0.3%); }
          100% { transform: scale(1)    translateX(0)    translateY(0); }
        }
        @media (max-width: 767px) {
          #hero-section { padding-top: 195px; }
          #hero-banner { aspect-ratio: 5/3; }
        }
        @media (min-width: 768px) {
          #hero-section { padding-top: 200px; }
          #hero-banner { aspect-ratio: 5/2; }
        }
        .hero-slide {
          position: absolute;
          inset: 0;
          transition: opacity 0.8s ease;
        }
        .hero-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }
        .hero-slide.active {
          opacity: 1;
          z-index: 2;
        }
        .hero-slide.inactive {
          opacity: 0;
          z-index: 1;
        }
      `}</style>

      <section id="hero-section">
        <div id="hero-banner" style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>

          {SLIDES.map((slide, i) => (
            <div key={i} className={`hero-slide ${i === current ? 'active' : 'inactive'}`}>
              <picture>
                <source media="(max-width: 767px)" srcSet={slide.mobile} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.desktop} alt={`Banner ${i + 1}`} />
              </picture>
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
            {SLIDES.map((_, i) => (
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
          <button onClick={() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: 38, height: 38, color: '#FFF', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ‹
          </button>
          <button onClick={() => setCurrent(c => (c + 1) % SLIDES.length)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: 38, height: 38, color: '#FFF', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ›
          </button>

        </div>
      </section>
    </>
  )
}
