'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/CartContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const MIN_COMPRA = 150000

interface Props { open: boolean; onClose: () => void }

export default function CartSidebar({ open, onClose }: Props) {
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const router = useRouter()

  const faltaMinimo = total < MIN_COMPRA

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
            style={{ width: '100%', maxWidth: 420, background: '#0a1628', borderLeft: '1px solid rgba(212,175,55,0.2)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={20} color="#D4AF37" />
                <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 18 }}>Mi Carrito</span>
                <span style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#614830', fontWeight: 900, fontSize: 12, padding: '2px 8px', borderRadius: 99 }}>
                  {items.length}
                </span>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a9a' }}>
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Tu carrito está vacío</div>
                  <div style={{ color: '#7a8a9a', fontSize: 13 }}>Agregá productos para comenzar</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 12, padding: 12, display: 'flex', gap: 12 }}>
                      {/* Image */}
                      <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#6B543E', position: 'relative' }}>
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="60px" />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 24 }}>📦</div>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                        <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 14, marginBottom: 8 }}>
                          ${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}
                        </div>
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => updateQty(item.id, Math.max(item.minOrder, item.quantity - item.minOrder))}
                            style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Minus size={12} />
                          </button>
                          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 13, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + item.minOrder)}
                            style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={12} />
                          </button>
                          <button onClick={() => removeItem(item.id)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
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
              <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
                {/* Mínimo de compra */}
                {faltaMinimo && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#f87171' }}>
                    ⚠️ Mínimo $150.000. Te faltan <strong>${(MIN_COMPRA - total).toLocaleString('es-AR')}</strong> — seguí agregando productos
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: '#7a8a9a', fontWeight: 700 }}>Total</span>
                  <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 20 }}>${total.toLocaleString('es-AR')}</span>
                </div>
                {faltaMinimo ? (
                  <button
                    onClick={onClose}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                      background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
                      color: '#614830', fontWeight: 900, fontSize: 15, cursor: 'pointer',
                    }}>
                    + SEGUIR AGREGANDO PRODUCTOS
                  </button>
                ) : (
                  <button
                    onClick={() => { onClose(); router.push('/checkout') }}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                      background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
                      color: '#614830', fontWeight: 900, fontSize: 15, cursor: 'pointer',
                    }}>
                    FINALIZAR COMPRA →
                  </button>
                )}
                <button onClick={clearCart}
                  style={{ width: '100%', marginTop: 8, padding: '10px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#f87171', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
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
