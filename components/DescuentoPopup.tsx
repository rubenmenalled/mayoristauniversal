'use client'

import { useEffect, useState } from 'react'
import { CATEGORIAS_DESCUENTO_10 } from '@/lib/descuentos'

interface Props { categoria: string }

export default function DescuentoPopup({ categoria }: Props) {
  const cat = (categoria || '').trim().toUpperCase()
  const aplica = CATEGORIAS_DESCUENTO_10.includes(cat)

  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  // Se muestra cada vez que se entra a una categoría elegible (sin recordar cierres previos)
  useEffect(() => {
    if (!aplica) return
    setClosing(false)
    const t = setTimeout(() => setVisible(true), 700)
    return () => clearTimeout(t)
  }, [aplica, cat])

  const close = () => {
    setClosing(true)
    setTimeout(() => { setVisible(false); setClosing(false) }, 250)
  }

  if (!aplica || !visible) return null

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        opacity: closing ? 0 : 1, transition: 'opacity 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #4B5563 0%, #374151 100%)',
          border: '1.5px solid rgba(255,138,61,0.55)',
          borderRadius: 20, padding: '36px 30px 30px', maxWidth: 380, width: '100%',
          position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          transform: closing ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
          transition: 'transform 0.25s ease, opacity 0.25s ease', opacity: closing ? 0 : 1,
          textAlign: 'center',
        }}
      >
        <button
          onClick={close} aria-label="Cerrar"
          style={{
            position: 'absolute', top: 12, right: 14, background: 'rgba(255,255,255,0.08)',
            border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9FB3D6', fontSize: 15,
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
        <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 21, marginBottom: 10, letterSpacing: '-0.01em' }}>
          10% OFF en compras grandes
        </div>
        <div style={{ color: '#B9C6DE', fontSize: 14.5, lineHeight: 1.55, marginBottom: 24 }}>
          Compras mayores a <b style={{ color: '#FF8A3D' }}>$500.000</b> tienen un{' '}
          <b style={{ color: '#FF8A3D' }}>10% de descuento</b>.
        </div>

        <button
          onClick={close}
          style={{
            width: '100%', padding: 13, borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#FFFFFF',
            fontWeight: 900, fontSize: 14, cursor: 'pointer',
          }}
        >
          ¡Genial, a comprar!
        </button>
      </div>
    </div>
  )
}
