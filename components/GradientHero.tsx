'use client'

import { useState, useEffect, useRef } from 'react'
import { TextReveal } from '@/components/ui/cascade-text'

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
    // Si ya está visible al cargar (caso hero), dispara enseguida; si no, espera al scroll.
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
  // Usamos ResizeObserver porque el header crece cuando carga la barra de
  // categorías (fetch async) y al cambiar de orientación.
  const [heroPad, setHeroPad] = useState<number | null>(null)
  useEffect(() => {
    let ro: ResizeObserver | null = null
    // calc re-busca el header en cada llamada: si todavía no montó al inicio,
    // el intervalo lo encuentra apenas aparece (evita que el offset no se aplique).
    const calc = () => {
      const header = document.querySelector('header') as HTMLElement | null
      if (!header) return
      const bottom = header.getBoundingClientRect().bottom
      if (bottom <= 0) return
      // safeMin pequeño: el ResizeObserver/intervalo mide el valor real y siempre gana
      const safeMin = window.innerWidth < 1024 ? 80 : 80
      // -1px para que el banner quede tapado por el borde del header (sin hueco)
      setHeroPad(Math.max(Math.round(bottom) - 1, safeMin))
      if (!ro) { ro = new ResizeObserver(calc); ro.observe(header) }
    }
    calc()
    window.addEventListener('resize', calc)
    window.addEventListener('load', calc)
    // Reintenta durante ~5s por si el header monta o crece tarde (fetch, fuentes).
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
        #hero-collage {
          position: absolute; inset: 0; display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: 50%;
        }
        #hero-collage > span {
          background-size: cover; background-position: center;
          filter: brightness(1.07) saturate(1.1);
        }
        .hero-blob {
          position: absolute; border-radius: 50%;
          filter: blur(45px); mix-blend-mode: screen; pointer-events: none;
          will-change: transform, opacity; opacity: 0;
        }
        .hero-blob.a { width: 210px; height: 210px; top: 6%; left: 8%;
          background: rgba(255,106,61,1); animation: heroStepA 6s ease-in-out infinite; }
        .hero-blob.b { width: 190px; height: 190px; bottom: 8%; right: 10%;
          background: rgba(80,150,255,1); animation: heroStepB 7s ease-in-out infinite; }
        .hero-blob.c { width: 170px; height: 170px; top: 14%; left: 40%;
          background: rgba(255,150,90,1); animation: heroStepC 5s ease-in-out infinite; }
        /* en cada punto se PRENDE; entre punto y punto viaja rápido y se APAGA */
        @keyframes heroStepA {
          0%   { transform: translate(0,0) scale(1);          opacity: 1; }
          12%  { transform: translate(40px,10px) scale(0.5);  opacity: 0; }
          25%  { transform: translate(170px,45px) scale(1);   opacity: 1; }
          37%  { transform: translate(210px,75px) scale(0.5); opacity: 0; }
          50%  { transform: translate(330px,125px) scale(1);  opacity: 1; }
          62%  { transform: translate(250px,150px) scale(0.5);opacity: 0; }
          75%  { transform: translate(120px,165px) scale(1);  opacity: 1; }
          87%  { transform: translate(50px,90px) scale(0.5);  opacity: 0; }
          100% { transform: translate(0,0) scale(1);          opacity: 1; }
        }
        @keyframes heroStepB {
          0%   { transform: translate(0,0) scale(1);            opacity: 1; }
          12%  { transform: translate(-40px,-12px) scale(0.5);  opacity: 0; }
          25%  { transform: translate(-160px,-55px) scale(1);   opacity: 1; }
          37%  { transform: translate(-230px,-45px) scale(0.5); opacity: 0; }
          50%  { transform: translate(-310px,-30px) scale(1);   opacity: 1; }
          62%  { transform: translate(-220px,-95px) scale(0.5); opacity: 0; }
          75%  { transform: translate(-120px,-145px) scale(1);  opacity: 1; }
          87%  { transform: translate(-50px,-80px) scale(0.5);  opacity: 0; }
          100% { transform: translate(0,0) scale(1);            opacity: 1; }
        }
        @keyframes heroStepC {
          0%   { transform: translate(0,0) scale(1);           opacity: 1; }
          16%  { transform: translate(-60px,30px) scale(0.5);  opacity: 0; }
          33%  { transform: translate(-190px,95px) scale(1);   opacity: 1; }
          50%  { transform: translate(0px,130px) scale(0.5);   opacity: 0; }
          66%  { transform: translate(190px,75px) scale(1);    opacity: 1; }
          83%  { transform: translate(90px,40px) scale(0.5);   opacity: 0; }
          100% { transform: translate(0,0) scale(1);           opacity: 1; }
        }
        @media (max-width: 1023px) {
          #grad-hero { padding-top: 220px; }
          #hero-collage { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 25%; }
          #hero-title { display: none; }
        }
      `}</style>
      <div id="grad-hero" style={heroPad ? { paddingTop: heroPad } : undefined}>
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

          {/* Oscurecido extra detrás del título, para que las letras blancas no se pierdan contra fotos claras */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 96% 50% at 50% 38%, rgba(4,11,26,0.68), transparent 80%)',
          }} />

          {/* Brillos animados */}
          <div className="hero-blob a" aria-hidden="true" />
          <div className="hero-blob b" aria-hidden="true" />
          <div className="hero-blob c" aria-hidden="true" />

          {/* Contenido — z-10: por encima del collage pero DEBAJO del header (z-50),
              así al scrollear el título se oculta detrás del header y no lo pisa */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4"
            style={{ padding: 'clamp(20px, 4vw, 88px) 16px' }}>
            <h1 id="hero-title" style={{
              color: '#FFFFFF', fontWeight: 900, lineHeight: 1.05, margin: 0,
              fontSize: 'clamp(34px, 6vw, 68px)', letterSpacing: '-0.02em',
              textShadow: '0 4px 30px rgba(0,0,0,0.55)',
            }}>
              MAYORISTA UNIVERSAL
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.94)', margin: '14px 0 0', fontWeight: 700,
              fontSize: 'clamp(20px, 3vw, 26px)', textShadow: '0 2px 16px rgba(0,0,0,0.5)',
            }}>
              IMPORTADORA Y DISTRIBUIDORA MULTIRUBROS
            </p>
            <a href="/catalogo" className="btn-agregar" style={{
              marginTop: 26, background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)',
              color: '#FFFFFF', fontWeight: 900, fontSize: 16, textDecoration: 'none',
              padding: '13px 30px', borderRadius: 12, boxShadow: '0 8px 24px rgba(255,106,61,0.45)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TextReveal text="Ver catálogo" />
            </a>

            {/* Contador digital en vivo (arranca al entrar en pantalla) */}
            <div ref={counterRef} style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,2vw,14px)', justifyContent: 'center', alignItems: 'stretch' }}>
              {[
                { v: prodCount.toLocaleString('es-AR'), l: 'productos' },
                { v: catCount.toLocaleString('es-AR'), l: 'categorías' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12,
                  padding: '8px 16px', minWidth: 92,
                }}>
                  <div style={{
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 900,
                    fontSize: 'clamp(22px,3.4vw,34px)', letterSpacing: '0.04em',
                    fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
                    backgroundImage: 'linear-gradient(180deg,#FFE08A 0%,#FFB347 45%,#FF6A3D 100%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', color: 'transparent',
                    filter: 'drop-shadow(0 0 12px rgba(255,150,60,0.65)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
                  }}>{s.v}</div>
                  <div style={{
                    color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(10px,1.4vw,12px)',
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2,
                  }}>{s.l}</div>
                </div>
              ))}
              <div style={{
                display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.92)',
                fontSize: 'clamp(11px,1.6vw,13px)', fontWeight: 700, padding: '0 6px',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}>🆕 nuevos cada semana</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
