'use client'

import { useEffect, useState } from 'react'

// Fechas objetivo (mes 0-indexado: 6=julio, 7=agosto)
const EVENTOS = [
  {
    key: 'amigo',
    emoji: '🤝',
    titulo: 'DÍA DEL AMIGO',
    fecha: '20 de julio',
    target: new Date(2026, 6, 20),
    grad: 'linear-gradient(135deg,#2563EB 0%,#1D4ED8 45%,#16A34A 100%)',
    numShadow: '#0B3FA8',
    numShadowDark: '#082C75',
  },
  {
    key: 'nino',
    emoji: '🎁',
    titulo: 'DÍA DEL NIÑO',
    fecha: '16 de agosto',
    target: new Date(2026, 7, 16),
    grad: 'linear-gradient(135deg,#FB7185 0%,#EC4899 45%,#9333EA 100%)',
    numShadow: '#A21CAF',
    numShadowDark: '#701A75',
  },
]

function diasHasta(target: Date) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const ms = target.getTime() - hoy.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
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
    const t = setInterval(calc, 60 * 60 * 1000) // recalcular cada hora
    return () => clearInterval(t)
  }, [])

  const visibles = EVENTOS.filter(e => (dias[e.key] ?? 1) >= 0)
  if (visibles.length === 0) return null

  return (
    <section
      style={{
        background: '#0D2C54',
        padding: '26px 14px 6px',
        perspective: '1100px',
      }}
    >
      <style>{`
        @keyframes floatCard {
          0%,100% { transform: rotateX(7deg) translateY(0); }
          50%     { transform: rotateX(7deg) translateY(-7px); }
        }
        .cd-row {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 22px;
        }
        @media (max-width: 720px) { .cd-row { grid-template-columns: 1fr; } }
        .cd-card {
          position: relative; border-radius: 22px; padding: 22px 26px;
          display: flex; align-items: center; gap: 20px;
          transform-style: preserve-3d;
          transform: rotateX(7deg);
          animation: floatCard 4.5s ease-in-out infinite;
          transition: transform .35s ease, box-shadow .35s ease;
          border: 1px solid rgba(255,255,255,0.25);
          cursor: default; overflow: hidden;
        }
        .cd-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 45%);
          pointer-events: none;
        }
        .cd-card:hover {
          transform: rotateX(0deg) translateY(-6px) scale(1.02);
          animation-play-state: paused;
        }
        .cd-num {
          font-weight: 900; font-size: clamp(46px, 8vw, 78px); line-height: 0.9;
          color: #FFFFFF; letter-spacing: -2px;
        }
        .cd-emoji { font-size: clamp(40px, 7vw, 64px); filter: drop-shadow(2px 4px 3px rgba(0,0,0,.35)); }
      `}</style>

      <div className="cd-row">
        {visibles.map(e => {
          const n = dias[e.key] ?? 0
          const txt = n === 0 ? '¡HOY!' : null
          return (
            <div
              key={e.key}
              className="cd-card"
              style={{
                background: e.grad,
                boxShadow: `0 22px 38px rgba(0,0,0,0.45), 0 6px 0 rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.35)`,
              }}
            >
              <span className="cd-emoji">{e.emoji}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                {txt ? (
                  <span
                    className="cd-num"
                    style={{ textShadow: `2px 2px 0 ${e.numShadow}, 4px 4px 0 ${e.numShadowDark}, 6px 7px 10px rgba(0,0,0,.4)` }}
                  >
                    {txt}
                  </span>
                ) : (
                  <>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, textShadow: '1px 1px 2px rgba(0,0,0,.4)' }}>Faltan</span>
                    <span
                      className="cd-num"
                      style={{ textShadow: `2px 2px 0 ${e.numShadow}, 4px 4px 0 ${e.numShadow}, 6px 6px 0 ${e.numShadowDark}, 8px 9px 12px rgba(0,0,0,.45)` }}
                    >
                      {n}
                    </span>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, textShadow: '1px 1px 2px rgba(0,0,0,.4)' }}>días</span>
                  </>
                )}
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(15px,2.4vw,20px)', textShadow: '1px 2px 3px rgba(0,0,0,.4)', lineHeight: 1.1 }}>
                  {e.titulo}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: 600, marginTop: 3 }}>
                  ⏰ {e.fecha} · ¡Armá tu pedido!
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
