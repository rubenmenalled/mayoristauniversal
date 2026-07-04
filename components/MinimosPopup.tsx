'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Package, Shuffle, ShoppingBag, BellRing } from 'lucide-react'

// Puntos que explican CÓMO funciona la compra mínima
const PUNTOS = [
  { Icon: Package,     texto: <>Cada rubro tiene su propia compra mínima.</> },
  { Icon: Shuffle,     texto: <>Dentro de un rubro mezclás libremente los productos que quieras.</> },
  { Icon: ShoppingBag, texto: <>Podés llevar <b style={{ fontWeight: 700 }}>varios rubros en el mismo pedido</b> — cada uno completando su mínimo.</> },
  { Icon: BellRing,    texto: <>El carrito te avisa cuánto te falta en cada rubro.</> },
]

// Mínimos agrupados por monto. Editar acá si cambian los mínimos de lib/minimos.ts
const TRAMOS: { monto: string; rubros: string }[] = [
  { monto: 'Desde $100.000', rubros: 'La mayoría de los rubros' },
  { monto: '$120.000',       rubros: 'Librería, Belleza, Bazar y Hogar, Deporte, Perfumería y más' },
  { monto: '$150.000',       rubros: 'Juguetería, Peluches' },
  { monto: '$200.000',       rubros: 'Camping, Regionales Indio Mohi' },
  { monto: '$300.000',       rubros: 'Fattz Import' },
  { monto: 'Cajas cerradas', rubros: 'Artículos x Bulto (por bulto)' },
]

export default function MinimosPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try { if (sessionStorage.getItem('minimos_info_seen')) return } catch {}
    const t = setTimeout(() => setOpen(true), 800)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setOpen(false)
    try { sessionStorage.setItem('minimos_info_seen', '1') } catch {}
    // Mantiene la secuencia con el popup de canal de WhatsApp
    try { window.dispatchEvent(new Event('welcome-closed')) } catch {}
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={close}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{ position: 'relative', width: '100%', maxWidth: 'min(92vw, 430px)', maxHeight: '90vh', overflowY: 'auto', background: '#FFFFFF', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.55)' }}
          >
            {/* Header */}
            <div style={{ position: 'sticky', top: 0, background: '#0E2A57', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingCart size={22} color="#FF8A3D" />
                <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>Cómo funciona la compra mínima</span>
              </div>
              <button onClick={close} aria-label="Cerrar" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}>
                <X size={20} color="#9FB3D6" />
              </button>
            </div>

            {/* Puntos */}
            <div style={{ padding: '16px 20px 6px' }}>
              {PUNTOS.map(({ Icon, texto }, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, marginBottom: 12 }}>
                  <Icon size={19} color="#F26522" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 14.5, color: '#2C3E5A', lineHeight: 1.5 }}>{texto}</span>
                </div>
              ))}
            </div>

            {/* Tramos de mínimos */}
            <div style={{ padding: '4px 20px 4px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8A94A6', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Mínimo por rubro</div>
              {TRAMOS.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '8px 0', borderBottom: i < TRAMOS.length - 1 ? '1px solid #EEF1F5' : 'none' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#0E2A57', minWidth: 100, flexShrink: 0 }}>{t.monto}</span>
                  <span style={{ fontSize: 13.5, color: '#5A6B84', lineHeight: 1.4 }}>{t.rubros}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ padding: '10px 20px 20px' }}>
              <button onClick={close} style={{ width: '100%', background: '#F26522', color: '#FFFFFF', border: 'none', textAlign: 'center', padding: 13, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Entendido, a comprar
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#9AA4B4', marginTop: 10, lineHeight: 1.5 }}>
                Sumá los rubros que quieras · el mínimo de cada uno lo ves en cada catálogo
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
