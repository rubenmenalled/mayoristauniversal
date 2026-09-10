'use client'

import { useState, useEffect, useRef } from 'react'
import { TextReveal } from '@/components/ui/cascade-text'

// Cuenta de 0 al objetivo con easing (efecto "reloj digital"). Arranca cuando start=true.
function useCountUp(target: number, duration = 1800, start = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start || !target) return
    let raf = 0
    let startTs = 0
    const tick = (now: number) => {
      if (!startTs) startTs = now
      const p = Math.min((now - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return val
}

export default function GradientHero({ totalProductos = 0, totalCategorias = 0 }: { totalProductos?: number; totalCategorias?: number }) {
  // El contador arranca cuando entra en pantalla (IntersectionObserver)
  const counterRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = counterRef.current
    if (!el) return
    const visible = () => {
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight && r.bottom > 0
    }
    if (visible()) { setInView(true); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setInView(true) }),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const prodCount = useCountUp(totalProductos, 2200, inView)
  const catCount = useCountUp(totalCategorias, 1500, inView)

  // Medimos el alto real del header fijo (escritorio y celular) para que el
  // banner arranque justo debajo, sin franja blanca y sin quedar tapado.
  const [heroPad, setHeroPad] = useState<number | null>(null)
  useEffect(() => {
    let ro: ResizeObserver | null = null
    const calc = () => {
      const header = document.querySelector('header') as HTMLElement | null
      if (!header) return
      const bottom = header.getBoundingClientRect().bottom
      if (bottom <= 0) return
      const safeMin = 80
      setHeroPad(Math.max(Math.round(bottom) - 1, safeMin))
      if (!ro) { ro = new ResizeObserver(calc); ro.observe(header) }
    }
    calc()
    window.addEventListener('resize', calc)
    window.addEventListener('load', calc)
    let n = 0
    const iv = setInterval(() => { calc(); if (++n >= 20) clearInterval(iv) }, 250)
    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener('resize', calc)
      window.removeEventListener('load', calc)
      clearInterval(iv)
    }
  }, [])

  const COLLAGE_LEFT = [
    { src: 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/productos/hero-mickey.jpg', alt: 'Peluche Mickey', top: '8%', left: '2%', size: 108, rot: -9 },
    { src: 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/productos/sar_13421.jpg', alt: 'Velador led SAR', top: '58%', left: '9%', size: 92, rot: 6 },
    { src: 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/productos/sar_12973.jpg', alt: 'Joystick inalámbrico', top: '80%', left: '0%', size: 76, rot: -5 },
  ]
  const COLLAGE_RIGHT = [
    { src: 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/productos/hero-stitch.jpg', alt: 'Peluche Stitch', top: '6%', left: '86%', size: 104, rot: 8 },
    { src: 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/productos/sar_13188.jpg', alt: 'Parlante gaming RGB', top: '56%', left: '90%', size: 92, rot: -7 },
    { src: 'https://complotmg.com.ar/storage/legacy/productos/3135a.jpeg', alt: 'Taza minion', top: '80%', left: '95%', size: 76, rot: 5 },
  ]

  return (
    <section style={{ width: '100%', background: '#EDECE8' }}>
      <style>{`
        #grad-hero { padding-top: 160px; }
        @media (max-width: 1023px) {
          #grad-hero { padding-top: 220px; }
        }
        .hero-collage-item {
          position: absolute;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(20,20,20,0.16), 0 2px 6px rgba(20,20,20,0.08);
          border: 3px solid #FFFFFF;
          background: #fff;
        }
        .hero-collage-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        @media (max-width: 900px) {
          .hero-collage-item { display: none; }
        }
      `}</style>
      <div id="grad-hero" style={heroPad ? { paddingTop: heroPad } : undefined}>
        <div style={{ position: 'relative', width: '100%', minHeight: 'clamp(280px, 34vw, 400px)', background: '#EDECE8', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg aria-hidden="true" viewBox="0 0 1200 400" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M0,255 C200,300 400,220 600,245 C800,270 1000,225 1200,260 L1200,400 L0,400 Z" fill="#DCDAD4" />
            <path d="M0,285 C220,250 420,315 620,285 C820,255 1020,305 1200,275 L1200,400 L0,400 Z" fill="#E4E2DC" />
            <path d="M0,330 C250,305 450,350 650,330 C850,310 1050,345 1200,325 L1200,400 L0,400 Z" fill="#D2D0C9" />
          </svg>

          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%', width: 'min(900px, 90vw)', height: 'min(500px, 60vw)',
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(ellipse at center, rgba(255,138,99,0.22) 0%, rgba(255,138,99,0.10) 40%, rgba(255,138,99,0) 72%)',
            pointerEvents: 'none',
          }} />

          {[...COLLAGE_LEFT, ...COLLAGE_RIGHT].map((it, i) => (
            <div
              key={i}
              className="hero-collage-item"
              style={{
                top: it.top, left: it.left, width: it.size, height: it.size,
                transform: `rotate(${it.rot}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.alt} loading="lazy" />
            </div>
          ))}

          <div className="relative z-10" style={{ padding: 'clamp(24px, 5vw, 64px)', maxWidth: 1100, width: '100%', margin: '0 auto', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Mayorista Universal" style={{ height: 'clamp(56px, 8vw, 96px)', width: 'auto', margin: '0 auto' }} />
            <h1 style={{
              color: '#E4001B', fontWeight: 900, lineHeight: 1.02, margin: '10px 0 0',
              fontSize: 'clamp(28px, 7.5vw, 92px)', letterSpacing: '-0.02em', whiteSpace: 'nowrap',
            }}>
              Mayorista Universal
            </h1>
            <p style={{
              color: '#4B5563', margin: '14px 0 0', fontWeight: 500,
              fontSize: 'clamp(14px, 2vw, 17px)',
            }}>
              Importadora y distribuidora multirubro. Precios de fábrica, sin intermediarios.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px,3vw,26px)', marginTop: 24, flexWrap: 'wrap' }}>
              <a href="#catalogos" className="btn-agregar" style={{
                background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)',
                color: '#FFFFFF', fontWeight: 700, fontSize: 15, textDecoration: 'none',
                padding: '13px 28px', borderRadius: 11, boxShadow: '0 8px 24px rgba(255,106,61,0.4)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
              onClick={e => {
                e.preventDefault()
                setTimeout(() => {
                  document.getElementById('catalogos')?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' })
                }, 300)
              }}>
                <TextReveal text="Ver catálogo →" />
              </a>

              <div ref={counterRef} style={{ display: 'flex', gap: 'clamp(14px,2.4vw,22px)', flexWrap: 'wrap' }}>
                <span style={{ color: '#374151', fontSize: 13, fontWeight: 600 }}>
                  <b style={{ color: '#0D47A1', fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{prodCount.toLocaleString('es-AR')}</b> productos
                </span>
                <span style={{ color: '#374151', fontSize: 13, fontWeight: 600 }}>
                  <b style={{ color: '#0D47A1', fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{catCount.toLocaleString('es-AR')}</b> categorías
                </span>
                <span style={{ color: '#6B7280', fontSize: 13, fontWeight: 600 }}>🆕 nuevos cada semana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
