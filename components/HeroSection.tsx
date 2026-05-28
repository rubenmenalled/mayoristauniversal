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
  const [prev, setPrev]       = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [current])

  function goTo(idx: number) {
    if (idx === current || animating) return
    setAnimating(true)
    setPrev(current)
    setCurrent(idx)
    setTimeout(() => { setPrev(null); setAnimating(false) }, 700)
  }

  return (
    <>
      <style>{`
        #hero-section {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        @keyframes hero-kenburns {
          0%   { transform: scale(1)    translateX(0)    translateY(0); }
          33%  { transform: scale(1.06) translateX(-1%)  translateY(-0.5%); }
          66%  { transform: scale(1.04) translateX(1%)   translateY(0.5%); }
          100% { transform: scale(1)    translateX(0)    translateY(0); }
        }
        @keyframes panda-mover {
          0%    { transform: translateX(88vw)  scaleX(-1); }
          44%   { transform: translateX(0vw)   scaleX(-1); }
          50%   { transform: translateX(0vw)   scaleX(1);  }
          94%   { transform: translateX(88vw)  scaleX(1);  }
          100%  { transform: translateX(88vw)  scaleX(-1); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @media (max-width: 767px) {
          #hero-section { padding-top: 195px; }
          #hero-banner { height: 58vw; position: relative; overflow: hidden; }
          #hero-banner .slide-img { width: 100%; height: 100%; object-fit: cover; object-position: center center; display: block; }
        }
        @media (min-width: 768px) {
          #hero-section { padding-top: 200px; }
          #hero-banner { width: 100%; position: relative; overflow: hidden; }
          #hero-banner .slide-img { width: 100%; height: auto; display: block; max-width: none; }
        }
      `}</style>

      <section id="hero-section">
        <div id="hero-banner">

          {/* Slide anterior (fade out) */}
          {prev !== null && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, animation: 'slide-out 0.7s ease forwards' }}>
              <picture>
                <source media="(max-width: 767px)" srcSet={SLIDES[prev].mobile} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SLIDES[prev].desktop} alt="" className="slide-img" />
              </picture>
            </div>
          )}

          {/* Slide actual (fade in + leve zoom) */}
          <div style={{ position: prev !== null ? 'absolute' : 'relative', inset: 0, zIndex: 2, animation: animating ? 'slide-in 0.7s ease forwards' : undefined }}>
            <picture>
              <source media="(max-width: 767px)" srcSet={SLIDES[current].mobile} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SLIDES[current].desktop}
                alt="Mayorista Universal"
                className="slide-img"
                style={ !animating ? { animation: 'hero-kenburns 18s ease-in-out infinite', transformOrigin: 'center center' } : undefined }
              />
            </picture>
          </div>

          {/* Panda — caminando de lado a lado */}
          <div style={{
            position: 'absolute', bottom: '4%', left: 0, zIndex: 10,
            pointerEvents: 'none',
            animation: 'panda-mover 28s linear infinite',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/panda-v2.gif"
              alt="Panda caminando"
              style={{ height: 'clamp(80px, 11vw, 150px)', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
            />
          </div>

          {/* Puntos de navegación */}
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8 }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                style={{
                  width: i === current ? 24 : 8, height: 8,
                  borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
                  background: i === current ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.35s ease',
                }} />
            ))}
          </div>

          {/* Flechas prev / next */}
          <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: 38, height: 38, color: '#FFF', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            ‹
          </button>
          <button onClick={() => goTo((current + 1) % SLIDES.length)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', width: 38, height: 38, color: '#FFF', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            ›
          </button>

        </div>
      </section>
    </>
  )
}
