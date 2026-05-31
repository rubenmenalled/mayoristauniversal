'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const MIN_COMPRA = 150000

// Reglas de mínimo por categoría: { categoria: unidades mínimas }
const MIN_CATEGORIA: Record<string, number> = {
  RELOJES: 12,
}

interface Props { open: boolean; onClose: () => void }

export default function CartSidebar({ open, onClose }: Props) {
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const router = useRouter()

  const faltaMinimo = total < MIN_COMPRA

  // Verificar mínimos por categoría
  const alertasCategorias: string[] = []
  Object.entries(MIN_CATEGORIA).forEach(([cat, minUnits]) => {
    const itemsCat = items.filter(i => i.category?.toUpperCase() === cat)
    if (itemsCat.length > 0) {
      const totalUnits = itemsCat.reduce((s, i) => s + i.quantity, 0)
      if (totalUnits < minUnits) {
        alertasCategorias.push(`⌚ ${cat}: necesitás ${minUnits} unidades surtidas (tenés ${totalUnits})`)
      }
    }
  })
  const bloqueadoPorCategoria = alertasCategorias.length > 0
  const puedeComprar = !faltaMinimo && !bloqueadoPorCategoria

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[100]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-[101] flex flex-col"
            style={{ width: '100%', maxWidth: 420, background: '#FFFFFF', borderLeft: '1px solid #E5E7EB', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={20} color="#D4AF37" />
                <span style={{ color: '#111827', fontWeight: 900, fontSize: 18 }}>Mi Carrito</span>
                <span style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF', fontWeight: 900, fontSize: 12, padding: '2px 8px', borderRadius: 99 }}>
                  {items.length}
                </span>
              </div>
              <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', color: '#6B7280', borderRadius: 8, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', background: '#F9FAFB' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <div style={{ color: '#111827', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Tu carrito está vacío</div>
                  <div style={{ color: '#6B7280', fontSize: 13 }}>Agregá productos para comenzar</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 12, display: 'flex', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                      {/* Image */}
                      <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6', position: 'relative', border: '1px solid #E5E7EB' }}>
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 24 }}>📦</div>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {item.brand && <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Marca: {item.brand}</div>}
                        <div style={{ color: '#111827', fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                        <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 15, marginBottom: 8 }}>
                          ${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}
                        </div>
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => updateQty(item.id, Math.max(item.minOrder, item.quantity - item.minOrder))}
                            style={{ width: 28, height: 28, borderRadius: 7, background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ color: '#111827', fontWeight: 800, fontSize: 14, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + item.minOrder)}
                            style={{ width: 28, height: 28, borderRadius: 7, background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={12} />
                          </button>
                          <button onClick={() => removeItem(item.id)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid #E5E7EB', background: '#FFFFFF' }}>

                {/* Alertas por categoría */}
                {alertasCategorias.map((msg, i) => (
                  <div key={i} style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 8, padding: '10px 14px', marginBottom: 10, fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
                    {msg}
                  </div>
                ))}

                {/* Mínimo de compra total */}
                {faltaMinimo && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 10, fontSize: 12, color: '#DC2626' }}>
                    ⚠️ Mínimo $150.000. Te faltan <strong>${(MIN_COMPRA - total).toLocaleString('es-AR')}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '12px 0', borderTop: '1px solid #F3F4F6' }}>
                  <span style={{ color: '#6B7280', fontWeight: 700, fontSize: 14 }}>Total</span>
                  <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 22 }}>${total.toLocaleString('es-AR')}</span>
                </div>

                {puedeComprar ? (
                  <button
                    onClick={() => { onClose(); router.push('/checkout') }}
                    style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(212,175,55,0.35)' }}>
                    FINALIZAR COMPRA →
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(212,175,55,0.35)' }}>
                    + SEGUIR AGREGANDO PRODUCTOS
                  </button>
                )}
                <button onClick={clearCart}
                  style={{ width: '100%', marginTop: 8, padding: '10px', borderRadius: 12, border: '1px solid #FECACA', background: '#FEF2F2', color: '#EF4444', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
