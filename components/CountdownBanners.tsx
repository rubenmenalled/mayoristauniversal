'use client'

import { useEffect, useState } from 'react'

// Fechas objetivo (mes 0-indexado: 6=julio, 7=agosto)
const EVENTOS = [
  {
    key: 'amigo',
    emoji: '🤝',
    titulo: 'Día del Amigo',
    fecha: '20 jul',
    target: new Date(2026, 6, 20),
    accent: '#38BDF8',
    glow: 'rgba(56,189,248,0.25)',
  },
  {
    key: 'nino',
    emoji: '🎁',
    titulo: 'Día del Niño',
    fecha: '16 ago',
    target: new Date(2026, 7, 16),
    accent: '#F472B6',
    glow: 'rgba(244,114,182,0.25)',
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
          flex: 1 1 0; min-width: 230px;
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px; border-radius: 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .cd-pill:hover { transform: translateY(-2px); }
        .cd-emoji { font-size: 22px; line-height: 1; }
        .cd-num {
          font-weight: 800; font-size: 26px; line-height: 1;
          font-variant-numeric: tabular-nums; letter-spacing: -1px;
        }
        @keyframes cdDot { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        .cd-dot { width: 6px; height: 6px; border-radius: 50%; animation: cdDot 1.6s ease-in-out infinite; }
      `}</style>

      <div className="cd-wrap">
        {visibles.map(e => {
          const n = dias[e.key] ?? 0
          return (
            <div
              key={e.key}
              className="cd-pill"
              style={{ boxShadow: `0 6px 18px -8px ${e.glow}` }}
            >
              <span className="cd-emoji">{e.emoji}</span>

              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="cd-dot" style={{ background: e.accent, boxShadow: `0 0 8px ${e.accent}` }} />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>{e.titulo}</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, fontWeight: 500, marginTop: 2 }}>
                  {e.fecha} · armá tu pedido
                </span>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                {n === 0 ? (
                  <span className="cd-num" style={{ color: e.accent, fontSize: 20 }}>¡HOY!</span>
                ) : (
                  <>
                    <span className="cd-num" style={{ color: e.accent }}>{n}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}>días</span>
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
