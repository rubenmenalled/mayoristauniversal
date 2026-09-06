'use client'

import { useState, useEffect, useRef } from 'react'
import { TextReveal } from '@/components/ui/cascade-text'

const HERO_PHOTO = 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=1600&q=75'

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

  return (
    <section style={{ width: '100%', background: '#0B1E3F' }}>
      <style>{`
        #grad-hero { padding-top: 160px; }
        @media (max-width: 1023px) {
          #grad-hero { padding-top: 220px; }
        }
      `}</style>
      <div id="grad-hero" style={heroPad ? { paddingTop: heroPad } : undefined}>
        <div style={{ position: 'relative', width: '100%', minHeight: 'clamp(360px, 52vw, 520px)', overflow: 'hidden', background: '#0B1E3F', display: 'flex', alignItems: 'flex-end' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_PHOTO} alt="" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

          {/* Degradado único para legibilidad — sin blobs animados ni collage */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, rgba(6,10,20,0.95) 8%, rgba(6,10,20,0.62) 48%, rgba(6,10,20,0.18) 78%)',
          }} />

          <div className="relative z-10" style={{ padding: 'clamp(24px, 5vw, 64px)', maxWidth: 680 }}>
            <div style={{
              color: '#FFD13C', fontWeight: 700, fontSize: 'clamp(11px,1.4vw,13px)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Importador directo
            </div>
            <h1 style={{
              color: '#FFFFFF', fontWeight: 800, lineHeight: 1.04, margin: '10px 0 0',
              fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: '-0.01em',
            }}>
              Mayorista Universal
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.8)', margin: '14px 0 0', fontWeight: 500,
              fontSize: 'clamp(14px, 2vw, 17px)',
            }}>
              Importadora y distribuidora multirubro. Precios de fábrica, sin intermediarios.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,3vw,26px)', marginTop: 24, flexWrap: 'wrap' }}>
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
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600 }}>
                  <b style={{ color: '#FFD13C', fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{prodCount.toLocaleString('es-AR')}</b> productos
                </span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600 }}>
                  <b style={{ color: '#FFD13C', fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>{catCount.toLocaleString('es-AR')}</b> categorías
                </span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600 }}>🆕 nuevos cada semana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
