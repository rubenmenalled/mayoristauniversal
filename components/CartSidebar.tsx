'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart, RETAIL_MARKUP, RETAIL_MIN, EXPENSIVE_THRESHOLD, EXPENSIVE_MIN_QTY, itemIsWholesale } from '@/lib/CartContext'
import Image from 'next/image'

const WA_NUMBER = '5491164660482'

// Reglas de mínimo por categoría: { categoria: unidades mínimas }
const MIN_CATEGORIA: Record<string, number> = {
  RELOJES: 12,
}

interface Props { open: boolean; onClose: () => void }

function buildWAMessage(items: ReturnType<typeof useCart>['items'], isWholesale: boolean): string {
  const modo = isWholesale ? 'MAYORISTA' : 'MINORISTA'
  const markup = isWholesale ? 1 : RETAIL_MARKUP
  let msg = `🛒 *Pedido ${modo} - Mayorista Universal*\n\n`
  for (const item of items) {
    const unitPrice = Math.round(item.wholesalePrice * markup)
    const subtotal = unitPrice * item.quantity
    msg += `▪ *${item.name}*${item.brand ? ` (${item.brand})` : ''}\n`
    msg += `  ${item.quantity} unid. × $${unitPrice.toLocaleString('es-AR')} = $${subtotal.toLocaleString('es-AR')}\n`
    if (item.image) msg += `  🖼️ ${item.image}\n`
    msg += `\n`
  }
  const total = items.reduce((s, i) => s + Math.round(i.wholesalePrice * markup) * i.quantity, 0)
  msg += `💰 *Total: $${total.toLocaleString('es-AR')}*`
  if (!isWholesale) {
    msg += `\n_(precio minorista, incluye recargo del ${Math.round((RETAIL_MARKUP - 1) * 100)}%)_`
  }
  return encodeURIComponent(msg)
}

export default function CartSidebar({ open, onClose }: Props) {
  const { items, removeItem, updateQty, clearCart, isWholesale, displayTotal, wholesaleTotal, retailProgress, faltaMayorista } = useCart()

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

  const waLink = `https://wa.me/${WA_NUMBER}?text=${buildWAMessage(items, isWholesale)}`
  const llegaMinimo = wholesaleTotal >= RETAIL_MIN
  const puedeComprar = items.length > 0 && alertasCategorias.length === 0 && llegaMinimo

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
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', background: '#F9FAFB' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <div style={{ color: '#111827', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Tu carrito está vacío</div>
                  <div style={{ color: '#6B7280', fontSize: 13 }}>Agregá productos para comenzar</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => {
                    const ws = itemIsWholesale(item, isWholesale)
                    const unitDisplay = ws ? item.wholesalePrice : Math.round(item.wholesalePrice * RETAIL_MARKUP)
                    const subtotal = unitDisplay * item.quantity
                    const isExpensive = item.wholesalePrice > EXPENSIVE_THRESHOLD
                    return (
                      <div key={item.id} style={{ background: '#FFFFFF', border: `1px solid ${isExpensive && !ws ? '#BAE6FD' : '#E5E7EB'}`, borderRadius: 10, padding: 10, display: 'flex', gap: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 15 }}>
                              ${subtotal.toLocaleString('es-AR')}
                            </span>
                            <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 11 }}>
                              ({item.minOrder > 1 ? `$${(unitDisplay * item.minOrder).toLocaleString('es-AR')}/doc.` : `$${unitDisplay.toLocaleString('es-AR')} c/u`})
                            </span>
                            {ws
                              ? <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>MAYORISTA</span>
                              : <span style={{ background: '#DBEAFE', color: '#1E40AF', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>MINORISTA</span>
                            }
                          </div>
                          {isExpensive && !ws && (
                            <div style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', borderRadius: 6, padding: '5px 9px', marginBottom: 6, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <span style={{ fontSize: 13 }}>💡</span>
                              <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 900 }}>
                                Productos mayores a $100.000 se venden de a 2 unidades para precio mayorista
                              </span>
                            </div>
                          )}
                          {/* Qty controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button onClick={() => updateQty(item.id, Math.max(item.minOrder, item.quantity - item.minOrder))}
                              style={{ width: 28, height: 28, borderRadius: 7, background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Minus size={12} />
                            </button>
                            <div style={{ textAlign: 'center', minWidth: 36 }}>
                              {item.minOrder > 1 ? (
                                <>
                                  <div style={{ color: '#111827', fontWeight: 800, fontSize: 14, lineHeight: 1 }}>{item.quantity / item.minOrder}</div>
                                  <div style={{ color: '#9CA3AF', fontSize: 9, fontWeight: 600 }}>doc.</div>
                                </>
                              ) : (
                                <span style={{ color: '#111827', fontWeight: 800, fontSize: 14 }}>{item.quantity}</span>
                              )}
                            </div>
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
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', background: '#FFFFFF' }}>

                {/* Alertas por categoría */}
                {alertasCategorias.map((msg, i) => (
                  <div key={i} style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: 11, color: '#92400E', lineHeight: 1.4 }}>
                    {msg}
                  </div>
                ))}

                {/* Mínimo minorista */}
                {!llegaMinimo && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: 12, color: '#DC2626', fontWeight: 700 }}>
                    ⚠️ Mínimo de compra $30.000 — te faltan <strong>${(RETAIL_MIN - wholesaleTotal).toLocaleString('es-AR')}</strong>
                  </div>
                )}

                {/* Barra de progreso compacta */}
                {isWholesale ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 8, padding: '6px 10px', marginBottom: 8 }}>
                    <span style={{ fontSize: 13 }}>🏆</span>
                    <span style={{ color: '#92650A', fontWeight: 900, fontSize: 12 }}>¡Precio mayorista activo!</span>
                  </div>
                ) : (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ color: '#0369A1', fontWeight: 700, fontSize: 11 }}>🛍️ Modo minorista — faltán <strong>${faltaMayorista.toLocaleString('es-AR')}</strong> para mayorista</span>
                    </div>
                    <div style={{ background: '#E0F2FE', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#38BDF8,#0EA5E9)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${retailProgress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}

                {/* Desglose de totales */}
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#6B7280', fontSize: 12 }}>Subtotal</span>
                    <span style={{ color: '#111827', fontWeight: 700, fontSize: 12 }}>${wholesaleTotal.toLocaleString('es-AR')}</span>
                  </div>
                  {!isWholesale && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#0369A1', fontSize: 12 }}>Recargo minorista (+{Math.round((RETAIL_MARKUP - 1) * 100)}%)</span>
                        <span style={{ color: '#0369A1', fontWeight: 700, fontSize: 12 }}>${(displayTotal - wholesaleTotal).toLocaleString('es-AR')}</span>
                      </div>
                      <div style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', borderRadius: 6, padding: '5px 8px', marginBottom: 6, fontSize: 11, fontWeight: 800, color: '#FFFFFF', textAlign: 'center' }}>
                        🏆 Sumando más de $180.000 el total cambia a precios mayoristas
                      </div>
                    </>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#111827', fontWeight: 800, fontSize: 14 }}>Total</span>
                    <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 20 }}>${displayTotal.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                {/* Checkout buttons */}
                {puedeComprar ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#FFFFFF', fontWeight: 900, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,211,102,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
                      <MessageCircle size={18} />
                      PEDIR POR WHATSAPP
                    </a>
                  </div>
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
