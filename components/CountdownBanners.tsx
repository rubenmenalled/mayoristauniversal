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
    emoji: '🎁',
    titulo: 'Día del Niño',
    fecha: '16 ago',
    target: new Date(2026, 7, 16),
    accent: '#F472B6',
    tint: 'linear-gradient(100deg, rgba(13,44,84,0.82) 0%, rgba(219,39,119,0.55) 55%, rgba(147,51,234,0.45) 100%)',
  },
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
          flex: 1 1 0; min-width: 230px;
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

              {/* Contenido */}
              <span className="cd-emoji" style={{ position: 'relative', zIndex: 2 }}>{e.emoji}</span>

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="cd-dot" style={{ background: e.accent, boxShadow: `0 0 8px ${e.accent}` }} />
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 15.5, whiteSpace: 'nowrap', textShadow: '0 1px 4px rgba(0,0,0,.6)', letterSpacing: 0.2 }}>{e.titulo}</span>
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
