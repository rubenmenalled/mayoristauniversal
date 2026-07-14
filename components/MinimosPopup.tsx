'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Package, Shuffle, ShoppingBag, BellRing } from 'lucide-react'
import { MIN_CATALOGO_DEFAULT, MIN_CATALOGO_OVERRIDE, MIN_SUBCATEGORIA_OVERRIDE, fmtPesos } from '@/lib/minimos'

// Puntos que explican CÓMO funciona la compra mínima (fijos, no dependen de los montos)
const PUNTOS = [
  { Icon: Package,     texto: <>Cada rubro tiene su propia compra mínima.</> },
  { Icon: Shuffle,     texto: <>Dentro de un rubro mezclás libremente los productos que quieras.</> },
  { Icon: ShoppingBag, texto: <>Podés llevar <b style={{ fontWeight: 700 }}>varios rubros en el mismo pedido</b> — cada uno completando su mínimo.</> },
  { Icon: BellRing,    texto: <>El carrito te avisa cuánto te falta en cada rubro.</> },
]

// Nombres lindos para mostrar. Fallback: capitaliza la key.
// Solo hace falta tocar esto si sumás un RUBRO NUEVO con mínimo especial; los MONTOS salen solos de lib/minimos.ts
const NOMBRE_LINDO: Record<string, string> = {
  'FATTZ IMPORT': 'Fattz Import',
  'JUGUETERIA': 'Juguetería',
  'PELUCHES': 'Peluches',
  'LIBRERIA': 'Librería',
  'BAZAR Y HOGAR': 'Bazar y Hogar',
  'BELLEZA': 'Belleza',
  'CAMPING': 'Camping',
  'ARTICULOS X BULTO': 'Artículos x Bulto',
  'LENCERIA': 'Lencería',
  'PANTUFLAS': 'Pantuflas',
  'MARROQUINERIA': 'Marroquinería',
  'TODO PARA EL DEPORTE': 'Deporte',
  'RELOJES': 'Relojes',
  'DECO CASA': 'Deco Casa',
  'PERFUMERIA': 'Perfumería',
  'PELUQUERIA Y BARBERIA': 'Peluquería y Barbería',
  'NEXT PARAGUAS': 'Next Paraguas',
  'PARAGUAS M ELEVEN': 'Paraguas M Eleven',
  'INDIO MOHI': 'Indio Mohi',
  'JUGUETES, PELUCHES Y MÁS': 'Juguetería, Peluches, Bebé, Kik, Tendencias y Perfumería',
}

const MAX_NOMBRES = 5

function lindo(key: string): string {
  if (NOMBRE_LINDO[key]) return NOMBRE_LINDO[key]
  return key.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

// Arma los tramos de mínimos automáticamente a partir de lib/minimos.ts.
// Cambiás un monto en minimos.ts → el popup se reagrupa solo (con re-deploy).
function construirTramos(): { monto: string; rubros: string }[] {
  const DEF = MIN_CATALOGO_DEFAULT
  const entradas = [
    ...Object.entries(MIN_CATALOGO_OVERRIDE),
    ...Object.entries(MIN_SUBCATEGORIA_OVERRIDE),
  ]

  // Agrupa por monto, ignorando los que igualan el default (ya cuentan como "la mayoría")
  const porMonto = new Map<number, string[]>()
  for (const [key, monto] of entradas) {
    if (monto === DEF) continue
    const nombre = lindo(key)
    const arr = porMonto.get(monto) ?? []
    if (!arr.includes(nombre)) arr.push(nombre)
    porMonto.set(monto, arr)
  }

  const tramos: { monto: string; rubros: string }[] = []
  // Línea del default primero
  tramos.push({ monto: 'Desde ' + fmtPesos(DEF), rubros: 'La mayoría de los rubros' })

  // Montos > 0 y distintos del default, ascendente
  for (const m of Array.from(porMonto.keys()).filter(m => m > 0).sort((a, b) => a - b)) {
    const nombres = porMonto.get(m)!
    const rubros = nombres.length > MAX_NOMBRES
      ? nombres.slice(0, MAX_NOMBRES).join(', ') + ' y más'
      : nombres.join(', ')
    tramos.push({ monto: fmtPesos(m), rubros })
  }

  // Monto 0 (por bulto) al final
  if (porMonto.has(0)) {
    tramos.push({ monto: 'Cajas cerradas', rubros: porMonto.get(0)!.join(', ') + ' (por bulto)' })
  }

  return tramos
}

const TRAMOS = construirTramos()

export default function MinimosPopup() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

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
          initial={{ opacity: 0, y: 20, x: 8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{
            position: 'fixed',
            bottom: 110,
            right: 24,
            zIndex: 9000,
            width: 'min(90vw, 320px)',
            maxHeight: '75vh',
            overflowY: 'auto',
            background: '#FFFFFF',
            borderRadius: 16,
            boxShadow: '0 14px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {/* Header */}
          <div style={{ position: 'sticky', top: 0, background: '#0E2A57', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px 16px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart size={18} color="#FF8A3D" />
              <span style={{ color: '#FFFFFF', fontSize: 13.5, fontWeight: 700 }}>Cómo funciona la compra mínima</span>
            </div>
            <button onClick={close} aria-label="Cerrar" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 2, flexShrink: 0 }}>
              <X size={17} color="#9FB3D6" />
            </button>
          </div>

          {/* Puntos */}
          <div style={{ padding: '12px 14px 4px' }}>
            {PUNTOS.map(({ Icon, texto }, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 9 }}>
                <Icon size={16} color="#F26522" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12.5, color: '#2C3E5A', lineHeight: 1.4 }}>{texto}</span>
              </div>
            ))}
          </div>

          {!expanded ? (
            <div style={{ padding: '2px 14px 14px' }}>
              <button onClick={() => setExpanded(true)}
                style={{ width: '100%', background: '#F1F4F9', color: '#0E2A57', border: 'none', textAlign: 'center', padding: 9, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>
                Ver mínimo por rubro
              </button>
              <button onClick={close} style={{ width: '100%', background: '#F26522', color: '#FFFFFF', border: 'none', textAlign: 'center', padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Entendido, a comprar
              </button>
            </div>
          ) : (
            <>
              {/* Tramos de mínimos (automáticos desde lib/minimos.ts) */}
              <div style={{ padding: '4px 14px 4px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8A94A6', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Mínimo por rubro</div>
                {TRAMOS.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: i < TRAMOS.length - 1 ? '1px solid #EEF1F5' : 'none' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0E2A57', minWidth: 82, flexShrink: 0 }}>{t.monto}</span>
                    <span style={{ fontSize: 11.5, color: '#5A6B84', lineHeight: 1.35 }}>{t.rubros}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ padding: '8px 14px 14px' }}>
                <button onClick={close} style={{ width: '100%', background: '#F26522', color: '#FFFFFF', border: 'none', textAlign: 'center', padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Entendido, a comprar
                </button>
                <div style={{ textAlign: 'center', fontSize: 10.5, color: '#9AA4B4', marginTop: 8, lineHeight: 1.4 }}>
                  Sumá los rubros que quieras · el mínimo de cada uno lo ves en cada catálogo
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
