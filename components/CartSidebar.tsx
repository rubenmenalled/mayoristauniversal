'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, CreditCard, User } from 'lucide-react'
import { useCart, RETAIL_MARKUP, RETAIL_MIN, itemIsWholesale } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

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
  const [mpLoading, setMpLoading] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Sesión y datos del cliente
  const [sessionUser, setSessionUser] = useState<{ nombre: string; email: string; telefono: string } | null>(null)
  const [guestForm, setGuestForm] = useState({ nombre: '', email: '', telefono: '' })
  const [guestSaved, setGuestSaved] = useState(false)
  const [guestErrors, setGuestErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Cargar datos guardados de invitado en localStorage
    const saved = localStorage.getItem('guest_checkout')
    if (saved) { try { const d = JSON.parse(saved); setGuestForm(d); setGuestSaved(true) } catch {} }

    // Verificar sesión Supabase
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user
      if (u) {
        supabase.from('clientes').select('nombre,email,telefono,whatsapp').eq('user_id', u.id).single()
          .then(({ data: f }) => {
            setSessionUser({
              nombre: f?.nombre || u.user_metadata?.nombre || '',
              email: f?.email || u.email || '',
              telefono: f?.telefono || f?.whatsapp || u.user_metadata?.whatsapp || '',
            })
          })
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { setSessionUser(null) }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Datos efectivos del cliente (logueado o invitado guardado)
  const clienteData = sessionUser ?? (guestSaved ? guestForm : null)

  function validarGuest() {
    const errs: Record<string, string> = {}
    if (!guestForm.nombre.trim()) errs.nombre = 'Ingresá tu nombre'
    if (!guestForm.email.trim() || !/\S+@\S+\.\S+/.test(guestForm.email)) errs.email = 'Email inválido'
    if (!guestForm.telefono.trim() || guestForm.telefono.replace(/\D/g, '').length < 8) errs.telefono = 'Teléfono inválido'
    setGuestErrors(errs)
    return Object.keys(errs).length === 0
  }

  function guardarGuest() {
    if (!validarGuest()) return
    localStorage.setItem('guest_checkout', JSON.stringify(guestForm))
    setGuestSaved(true)
  }

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
  const puedeComprar = items.length > 0 && alertasCategorias.length === 0

  // Notificar pedido iniciado → ntfy + email + WhatsApp (via servidor)
  async function notificarPedidoIniciado(metodo: string) {
    try {
      const total = items.reduce((s, i) => s + i.wholesalePrice * i.quantity, 0)
      await fetch('/api/notificar-carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total, metodo, cliente: clienteData }),
      })
    } catch { /* silencioso */ }
  }

  async function handleMercadoPago() {
    notificarPedidoIniciado('Mercado Pago')
    setMpLoading(true)
    try {
      const res = await fetch('/api/mp-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, isWholesale }),
      })
      const data = await res.json()
      if (data.init_point) {
        // Guardar carrito para enviar email cuando vuelva de MP
        localStorage.setItem('mp_pending_order', JSON.stringify({
          items,
          isWholesale,
          total: Math.round(displayTotal * 1.10),
          timestamp: Date.now(),
        }))
        window.location.href = data.init_point
      } else {
        alert('Error al iniciar el pago. Intentá de nuevo.')
      }
    } catch {
      alert('Error al conectar con Mercado Pago.')
    } finally {
      setMpLoading(false)
    }
  }

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
            style={{ width: '100%', maxWidth: 'min(520px, 95vw)', background: '#FFFFFF', borderLeft: '1px solid #E5E7EB', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' }}
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
                <div style={isMobile
                  ? { display: 'flex', flexDirection: 'column', gap: 8 }
                  : { display: 'grid', gridTemplateColumns: items.length === 1 ? '1fr' : '1fr 1fr', gap: 10 }
                }>
                  {items.map(item => {
                    const ws = itemIsWholesale(item, isWholesale)
                    const baseSubtotal = item.wholesalePrice * item.quantity
                    const unitDisplay = ws ? item.wholesalePrice : Math.round(item.wholesalePrice * RETAIL_MARKUP)
                    const subtotal = unitDisplay * item.quantity
                    const recargo = subtotal - baseSubtotal

                    /* ── MOBILE: fila horizontal compacta ── */
                    if (isMobile) return (
                      <div key={item.id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', alignItems: 'center' }}>
                        {/* Imagen 70px */}
                        <div style={{ width: 70, height: 70, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.image
                            ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 3 }} />
                            : <div style={{ fontSize: 26 }}>📦</div>}
                        </div>
                        {/* Info compacta */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {item.brand && <div style={{ color: '#9CA3AF', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.brand}</div>}
                          <div style={{ color: '#111827', fontWeight: 700, fontSize: 12, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 13 }}>${subtotal.toLocaleString('es-AR')}</span>
                              {!ws && <span style={{ color: '#0369A1', fontSize: 9, fontWeight: 700, marginLeft: 4 }}>+30%</span>}
                              {ws && <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: 8, fontWeight: 800, padding: '1px 4px', borderRadius: 3, marginLeft: 4 }}>MAY</span>}
                            </div>
                            {/* Qty + delete */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <button onClick={() => updateQty(item.id, Math.max(item.minOrder, item.quantity - item.minOrder))}
                                style={{ width: 24, height: 24, borderRadius: 6, background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Minus size={10} />
                              </button>
                              <div style={{ textAlign: 'center', minWidth: 28 }}>
                                {item.minOrder > 1 ? (
                                  <><div style={{ color: '#111827', fontWeight: 800, fontSize: 12, lineHeight: 1 }}>{item.quantity / item.minOrder}</div><div style={{ color: '#9CA3AF', fontSize: 8 }}>doc.</div></>
                                ) : (
                                  <span style={{ color: '#111827', fontWeight: 800, fontSize: 13 }}>{item.quantity}</span>
                                )}
                              </div>
                              <button onClick={() => updateQty(item.id, item.quantity + item.minOrder)}
                                style={{ width: 24, height: 24, borderRadius: 6, background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Plus size={10} />
                              </button>
                              <button onClick={() => removeItem(item.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', paddingLeft: 2 }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )

                    /* ── DESKTOP: tarjeta vertical (imagen arriba) ── */
                    return (
                      <div key={item.id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                        {/* Imagen */}
                        <div style={{ width: '100%', height: items.length === 1 ? 220 : 148, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #F3F4F6', position: 'relative' }}>
                          {item.image
                            ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                            : <div style={{ fontSize: 44 }}>📦</div>}
                          {/* Badge modo */}
                          <div style={{ position: 'absolute', top: 7, right: 7 }}>
                            {ws
                              ? <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>MAYORISTA</span>
                              : <span style={{ background: '#DBEAFE', color: '#1E40AF', fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>MINORISTA</span>}
                          </div>
                          {/* Botón eliminar */}
                          <button onClick={() => removeItem(item.id)}
                            style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(255,255,255,0.9)', border: '1px solid #FECACA', borderRadius: 6, cursor: 'pointer', color: '#EF4444', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                        {/* Info */}
                        <div style={{ padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {item.brand && <div style={{ color: '#9CA3AF', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.brand}</div>}
                          <div style={{ color: '#111827', fontWeight: 700, fontSize: 12, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1 }}>{item.name}</div>
                          {/* Precio */}
                          {ws ? (
                            <div>
                              <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 15 }}>${subtotal.toLocaleString('es-AR')}</div>
                              <div style={{ color: '#9CA3AF', fontSize: 10 }}>{item.minOrder > 1 ? `$${(item.wholesalePrice * item.minOrder).toLocaleString('es-AR')}/doc.` : `$${item.wholesalePrice.toLocaleString('es-AR')} c/u`}</div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6B7280', fontSize: 10 }}>Base</span>
                                <span style={{ color: '#374151', fontWeight: 700, fontSize: 11 }}>${baseSubtotal.toLocaleString('es-AR')}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#0369A1', fontSize: 10 }}>+30%</span>
                                <span style={{ color: '#0369A1', fontWeight: 700, fontSize: 11 }}>+${recargo.toLocaleString('es-AR')}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6', paddingTop: 2, marginTop: 2 }}>
                                <span style={{ color: '#111827', fontWeight: 800, fontSize: 11 }}>Total</span>
                                <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 14 }}>${subtotal.toLocaleString('es-AR')}</span>
                              </div>
                            </div>
                          )}
                          {/* Qty controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <button onClick={() => updateQty(item.id, Math.max(item.minOrder, item.quantity - item.minOrder))}
                              style={{ width: 26, height: 26, borderRadius: 6, background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Minus size={11} />
                            </button>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                              {item.minOrder > 1 ? (
                                <><div style={{ color: '#111827', fontWeight: 800, fontSize: 14, lineHeight: 1 }}>{item.quantity / item.minOrder}</div><div style={{ color: '#9CA3AF', fontSize: 9 }}>doc.</div></>
                              ) : (
                                <span style={{ color: '#111827', fontWeight: 800, fontSize: 14 }}>{item.quantity}</span>
                              )}
                            </div>
                            <button onClick={() => updateQty(item.id, item.quantity + item.minOrder)}
                              style={{ width: 26, height: 26, borderRadius: 6, background: '#F3F4F6', border: '1px solid #E5E7EB', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Plus size={11} />
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
                      <div style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', borderRadius: 8, padding: '10px 12px', marginBottom: 8, fontSize: 13, fontWeight: 900, color: '#FFFFFF', textAlign: 'center', boxShadow: '0 2px 8px rgba(212,175,55,0.4)', lineHeight: 1.4 }}>
                        🏆 Sumando más de $150.000 el total cambia a precios mayoristas
                      </div>
                    </>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#111827', fontWeight: 800, fontSize: 14 }}>Total</span>
                    <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 20 }}>${displayTotal.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                {/* Seguir comprando */}
                <button onClick={onClose}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #D4AF37', background: 'transparent', color: '#B8941C', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                  ← Seguir comprando
                </button>

                {/* ─── FORMULARIO DATOS DEL CLIENTE ─── */}
                {!sessionUser && (
                  <div style={{ marginBottom: 8 }}>
                    {guestSaved ? (
                      /* Datos ya cargados — mostrar resumen editable */
                      <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <User size={15} color="#15803D" />
                          <div>
                            <div style={{ color: '#111827', fontWeight: 800, fontSize: 13 }}>{guestForm.nombre}</div>
                            <div style={{ color: '#6B7280', fontSize: 11 }}>{guestForm.telefono}</div>
                          </div>
                        </div>
                        <button onClick={() => { setGuestSaved(false); setGuestErrors({}) }}
                          style={{ background: 'none', border: 'none', color: '#15803D', fontSize: 12, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                          Editar
                        </button>
                      </div>
                    ) : (
                      /* Formulario de datos */
                      <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <User size={14} color="#92400E" />
                          <span style={{ color: '#92400E', fontWeight: 900, fontSize: 13 }}>Tus datos para el pedido</span>
                        </div>
                        {/* Nombre */}
                        <div style={{ marginBottom: 8 }}>
                          <input
                            type="text"
                            placeholder="Nombre y apellido *"
                            value={guestForm.nombre}
                            onChange={e => setGuestForm(p => ({ ...p, nombre: e.target.value }))}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${guestErrors.nombre ? '#EF4444' : '#E5E7EB'}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                          />
                          {guestErrors.nombre && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{guestErrors.nombre}</div>}
                        </div>
                        {/* Email */}
                        <div style={{ marginBottom: 8 }}>
                          <input
                            type="email"
                            placeholder="Email *"
                            value={guestForm.email}
                            onChange={e => setGuestForm(p => ({ ...p, email: e.target.value }))}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${guestErrors.email ? '#EF4444' : '#E5E7EB'}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                          />
                          {guestErrors.email && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{guestErrors.email}</div>}
                        </div>
                        {/* Teléfono */}
                        <div style={{ marginBottom: 10 }}>
                          <input
                            type="tel"
                            placeholder="WhatsApp / Teléfono *"
                            value={guestForm.telefono}
                            onChange={e => setGuestForm(p => ({ ...p, telefono: e.target.value }))}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${guestErrors.telefono ? '#EF4444' : '#E5E7EB'}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                          />
                          {guestErrors.telefono && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{guestErrors.telefono}</div>}
                        </div>
                        <button onClick={guardarGuest}
                          style={{ width: '100%', padding: '9px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}>
                          Confirmar datos →
                        </button>
                        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#9CA3AF' }}>
                          ¿Ya tenés cuenta?{' '}
                          <a href="/login" style={{ color: '#D4AF37', fontWeight: 700, textDecoration: 'none' }}>Ingresá aquí</a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Checkout buttons */}
                {puedeComprar && (sessionUser || guestSaved) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                    {/* MP con +10% recargo */}
                    <button
                      onClick={handleMercadoPago}
                      disabled={mpLoading}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: 'none', background: mpLoading ? '#9CA3AF' : 'linear-gradient(135deg,#009EE3,#0070BA)', color: '#FFFFFF', fontWeight: 900, cursor: mpLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(0,158,227,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <CreditCard size={16} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 14, fontWeight: 900 }}>{mpLoading ? 'REDIRIGIENDO...' : 'PAGAR CON MERCADO PAGO'}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9 }}>
                          ${Math.round(displayTotal * 1.10).toLocaleString('es-AR')} · +10% recargo tarjeta
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.75, marginTop: 1 }}>Los precios no incluyen IVA</div>
                      </div>
                    </button>

                    {/* Transferencia bancaria */}
                    <button
                      onClick={() => { notificarPedidoIniciado('Transferencia'); setShowTransfer(v => !v) }}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '2px solid #15803D', background: showTransfer ? '#F0FDF4' : 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', color: '#15803D', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 2px 8px rgba(21,128,61,0.15)' }}>
                      <span style={{ fontSize: 18 }}>🏦</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>TRANSFERENCIA BANCARIA · ${displayTotal.toLocaleString('es-AR')}</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#DC2626', letterSpacing: '0.05em', lineHeight: 1.2, marginTop: 1 }}>
                          ✅ SIN RECARGO
                        </div>
                        <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>Los precios no incluyen IVA</div>
                      </div>
                    </button>

                    {/* Panel con datos de transferencia */}
                    {showTransfer && (
                      <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontWeight: 900, color: '#15803D', fontSize: 13, marginBottom: 2 }}>📲 Datos para transferir</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', borderRadius: 8, padding: '8px 12px', border: '1px solid #BBF7D0' }}>
                          <span style={{ color: '#6B7280', fontSize: 12 }}>Alias</span>
                          <span style={{ color: '#111827', fontWeight: 900, fontSize: 14, letterSpacing: '0.03em' }}>ruby.mena.1972</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', borderRadius: 8, padding: '8px 12px', border: '1px solid #BBF7D0' }}>
                          <span style={{ color: '#6B7280', fontSize: 12 }}>Total a transferir</span>
                          <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 16 }}>${displayTotal.toLocaleString('es-AR')}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', textAlign: 'center', lineHeight: 1.4 }}>
                          Enviá el comprobante por WhatsApp para confirmar el pedido
                        </div>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#FFFFFF', fontWeight: 900, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
                          <MessageCircle size={15} />
                          ENVIAR COMPROBANTE POR WHATSAPP
                        </a>
                      </div>
                    )}

                    {/* WA */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => notificarPedidoIniciado('WhatsApp')}
                      style={{ width: '100%', padding: '11px', borderRadius: 12, border: '1.5px solid #25D366', background: 'transparent', color: '#128C7E', fontWeight: 900, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageCircle size={16} />
                        PEDIR POR WHATSAPP
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>Los precios no incluyen IVA</div>
                    </a>
                  </div>
                ) : !puedeComprar ? (
                  <button
                    onClick={onClose}
                    style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#FFFFFF', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(212,175,55,0.35)' }}>
                    + SEGUIR AGREGANDO PRODUCTOS
                  </button>
                ) : null}
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
