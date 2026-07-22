'use client'

import { useEffect, useState } from 'react'
import ShaderBg from './ShaderBg'

// Fechas objetivo (mes 0-indexado: 6=julio, 7=agosto)
const EVENTOS = [
  {
    key: 'amigo',
    emoji: '🤝',
    titulo: 'Día del Amigo',
    fecha: '20 jul',
    target: new Date(2026, 6, 20),
    accent: '#38BDF8',
    tint: 'linear-gradient(100deg, rgba(13,44,84,0.82) 0%, rgba(29,78,216,0.55) 55%, rgba(22,163,74,0.45) 100%)',
  },
  {
    key: 'nino',
    emoji: '🎆',
    titulo: 'Día del Niño',
    fecha: '16 ago',
    target: new Date(2026, 7, 16),
    accent: '#FBBF24',
    tint: 'linear-gradient(160deg, rgba(8,10,38,0.94) 0%, rgba(22,16,64,0.9) 55%, rgba(42,20,72,0.88) 100%)',
    bounce: true,
    bigTitle: true,
    fireworks: true,
  },
]

// Posiciones de las explosiones de fuegos artificiales (%, %, color)
const FUEGOS = [
  { x: 18, y: 30, color: '#F472B6' },
  { x: 55, y: 65, color: '#38BDF8' },
  { x: 82, y: 25, color: '#FBBF24' },
]

// Posiciones de estrellitas fijas (%, %)
const ESTRELLAS = [
  { x: 8, y: 15 }, { x: 28, y: 70 }, { x: 40, y: 20 }, { x: 63, y: 35 },
  { x: 72, y: 78 }, { x: 90, y: 55 }, { x: 15, y: 85 }, { x: 48, y: 55 },
]

function diasHasta(target: Date) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - hoy.getTime()) / 86400000)
}

export default function CountdownBanners() {
  const [dias, setDias] = useState<Record<string, number>>({})

  useEffect(() => {
    const calc = () => {
      const d: Record<string, number> = {}
      EVENTOS.forEach(e => { d[e.key] = diasHasta(e.target) })
      setDias(d)
    }
    calc()
    const t = setInterval(calc, 60 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  const visibles = EVENTOS.filter(e => (dias[e.key] ?? 1) >= 0)
  if (visibles.length === 0) return null

  return (
    <section style={{ background: '#0D2C54', padding: '16px 14px 4px' }}>
      <style>{`
        .cd-wrap { max-width: 760px; margin: 0 auto; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .cd-pill {
          position: relative; overflow: hidden;
          flex: 1 1 0; min-width: 230px; max-width: 420px;
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.14);
          transition: transform .25s ease;
          isolation: isolate;
        }
        .cd-pill:hover { transform: translateY(-2px); }
        .cd-emoji { font-size: 22px; line-height: 1; filter: drop-shadow(0 2px 3px rgba(0,0,0,.5)); }
        .cd-num { font-weight: 800; font-size: 27px; line-height: 1; font-variant-numeric: tabular-nums; letter-spacing: -1px; text-shadow: 0 2px 6px rgba(0,0,0,.45); }
        @keyframes cdDot { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        .cd-dot { width: 6px; height: 6px; border-radius: 50%; animation: cdDot 1.6s ease-in-out infinite; }
        @keyframes cdBounce { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-5px) rotate(4deg); } }
        .cd-emoji.cd-bounce { display: inline-block; animation: cdBounce 1.4s ease-in-out infinite; }
        @keyframes cdTwinkle { 0%,100% { opacity: .25; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1); } }
        .cd-star { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #fff; box-shadow: 0 0 4px 1px rgba(255,255,255,0.8); animation: cdTwinkle 2.2s ease-in-out infinite; }
        @keyframes cdBurst { 0%,100% { opacity: .45; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.35); } }
        .cd-burst { position: absolute; width: 100px; height: 100px; border-radius: 50%; animation: cdBurst 3s ease-in-out infinite; mix-blend-mode: screen; }
      `}</style>

      <div className="cd-wrap">
        {visibles.map(e => {
          const n = dias[e.key] ?? 0
          return (
            <div key={e.key} className="cd-pill" style={{ boxShadow: `0 8px 22px -10px ${e.accent}` }}>
              {/* Fondo shader animado */}
              <ShaderBg style={{ zIndex: 0 }} />
              {/* Tinte de color del evento */}
              <div style={{ position: 'absolute', inset: 0, background: e.tint, zIndex: 1, pointerEvents: 'none' }} />

              {/* Cielo nocturno: estrellas + fuegos artificiales */}
              {(e as any).fireworks && (
                <>
                  {ESTRELLAS.map((s, i) => (
                    <span
                      key={i}
                      className="cd-star"
                      style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: 1, animationDelay: `${i * 0.3}s`, pointerEvents: 'none' }}
                    />
                  ))}
                  {FUEGOS.map((f, i) => (
                    <span
                      key={i}
                      className="cd-burst"
                      style={{
                        left: `${f.x}%`, top: `${f.y}%`, transform: 'translate(-50%,-50%)',
                        background: `radial-gradient(circle, ${f.color} 0%, ${f.color} 25%, transparent 75%)`,
                        zIndex: 1, animationDelay: `${i * 1.1}s`, pointerEvents: 'none',
                      }}
                    />
                  ))}
                </>
              )}

              {/* Contenido */}
              <span className={`cd-emoji${(e as any).bounce ? ' cd-bounce' : ''}`} style={{ position: 'relative', zIndex: 2 }}>{e.emoji}</span>

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="cd-dot" style={{ background: e.accent, boxShadow: `0 0 8px ${e.accent}` }} />
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: (e as any).bigTitle ? 25 : 15.5, whiteSpace: 'nowrap', textShadow: (e as any).bigTitle ? '0 0 10px rgba(251,191,36,0.6), 0 1px 4px rgba(0,0,0,.7)' : '0 1px 4px rgba(0,0,0,.6)', letterSpacing: 0.2 }}>{e.titulo}</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: 11.5, fontWeight: 500, marginTop: 2, textShadow: '0 1px 2px rgba(0,0,0,.5)' }}>
                  {e.fecha} · armá tu pedido
                </span>
              </div>

              <div style={{ position: 'relative', zIndex: 2, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
                {n === 0 ? (
                  <span className="cd-num" style={{ color: '#fff', fontSize: 24 }}>¡HOY!</span>
                ) : (
                  <>
                    <span style={{ color: e.accent, fontSize: 11, fontWeight: 900, letterSpacing: 1.5, textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>FALTAN</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
                      <span className="cd-num" style={{ color: '#fff' }}>{n}</span>
                      <span style={{ color: '#fff', fontSize: 15, fontWeight: 800, textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>DÍAS</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
