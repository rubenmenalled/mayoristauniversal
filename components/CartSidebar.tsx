'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, CreditCard, User } from 'lucide-react'
import { useCart, RETAIL_MARKUP, RETAIL_MIN, WHOLESALE_MIN, itemIsWholesale } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect, useRef } from 'react'

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
  // Agrupar por catálogo
  const grupos: Record<string, typeof items> = {}
  for (const item of items) {
    const cat = (item.category || 'OTROS').toUpperCase()
    ;(grupos[cat] = grupos[cat] || []).push(item)
  }
  const cats = Object.keys(grupos)
  let total = 0
  for (const cat of cats) {
    msg += `📦 *${cat}*\n`
    let subCat = 0
    for (const item of grupos[cat]) {
      const unitPrice = Math.round(item.wholesalePrice * markup)
      const subtotal = unitPrice * item.quantity
      subCat += subtotal
      msg += `▪ ${item.name}\n  ${item.quantity} unid. × $${unitPrice.toLocaleString('es-AR')} = $${subtotal.toLocaleString('es-AR')}\n`
      if (item.image) msg += `  🖼️ ${item.image}\n`
    }
    total += subCat
    msg += `  _Subtotal ${cat}: $${subCat.toLocaleString('es-AR')}_\n\n`
  }
  msg += `💰 *Total: $${total.toLocaleString('es-AR')}*`
  if (cats.length > 1) msg += `\n\n_Cada catálogo se procesa y envía por separado._`
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
  // "Datos al final": el formulario aparece recién cuando el cliente elige una forma de pago
  const [pedirDatos, setPedirDatos] = useState(false)
  const datosRef = useRef<HTMLDivElement>(null)

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
    setPedirDatos(false)
  }

  // ¿Ya tenemos los datos del cliente? Si no, pedirlos (revela el formulario al final)
  function tieneDatos() {
    if (sessionUser || guestSaved) return true
    setPedirDatos(true)
    return false
  }

  // Cuando se pide completar datos, llevar el formulario a la vista
  useEffect(() => {
    if (pedirDatos) setTimeout(() => datosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }, [pedirDatos])

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

  // Opción A: mínimo de compra en $ por catálogo (cada catálogo se compra por separado)
  const markupActual = isWholesale ? 1 : RETAIL_MARKUP
  const MIN_CATALOGO_DEFAULT = 100000
  const MIN_CATALOGO_OVERRIDE: Record<string, number> = { 'FATTZ IMPORT': 300000 }
  const minDeCatalogo = (c?: string) => MIN_CATALOGO_OVERRIDE[(c || '').toUpperCase()] ?? MIN_CATALOGO_DEFAULT
  const gruposMap: Record<string, { cat: string; sub: number }> = {}
  items.forEach(i => {
    const cat = (i.category || 'OTROS').toUpperCase()
    if (!gruposMap[cat]) gruposMap[cat] = { cat, sub: 0 }
    gruposMap[cat].sub += Math.round(i.wholesalePrice * markupActual) * i.quantity
  })
  const grupos = Object.values(gruposMap).map(g => {
    const min = minDeCatalogo(g.cat)
    return { ...g, min, ok: g.sub >= min, falta: Math.max(0, min - g.sub) }
  })
  const todosCatalogosOk = grupos.length > 0 && grupos.every(g => g.ok)

  const waLink = `https://wa.me/${WA_NUMBER}?text=${buildWAMessage(items, isWholesale)}`
  const puedeComprar = items.length > 0 && alertasCategorias.length === 0 && todosCatalogosOk
  // Los medios de pago se activan cuando CADA catálogo llega a su mínimo
  const alcanzaMin = todosCatalogosOk
  const faltaMin = grupos.reduce((s, g) => s + g.falta, 0)

  // Confirmar pedido → guarda en DB + notifica (ntfy, email, WhatsApp)
  async function notificarPedidoIniciado(metodo: string) {
    try {
      const total = items.reduce((s, i) => s + i.wholesalePrice * i.quantity, 0)
      const nombre   = clienteData?.nombre   || sessionUser?.nombre   || ''
      const email    = clienteData?.email    || sessionUser?.email    || ''
      const telefono = clienteData?.telefono || sessionUser?.telefono || ''

      // Guardar en BD y enviar todas las notificaciones
      await fetch('/api/confirmar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, email, telefono, items, total,
          user_id: sessionUser ? undefined : null,
          metodoPago: metodo,
        }),
      })
    } catch { /* silencioso */ }
  }

  async function handleMercadoPago() {
    if (!tieneDatos()) return
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
                <ShoppingBag size={20} color="#FF6A3D" />
                <span style={{ color: '#111827', fontWeight: 900, fontSize: 18 }}>Mi Carrito</span>
                <span style={{ background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#FFFFFF', fontWeight: 900, fontSize: 12, padding: '2px 8px', borderRadius: 99 }}>
                  {items.length}
                </span>
              </div>
              <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', color: '#6B7280', borderRadius: 8, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Cuerpo scrolleable: productos + totales + botones (para que nada quede tapado) */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>

            {/* Items */}
            <div style={{ padding: '12px 16px', background: '#F9FAFB' }}>
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
                    // El carrito SIEMPRE muestra precio mayorista; el +30% minorista se revela al momento de pagar
                    const subtotal = item.wholesalePrice * item.quantity

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
                              <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 13 }}>${subtotal.toLocaleString('es-AR')}</span>
                              <span style={{ color: '#9CA3AF', fontSize: 9, fontWeight: 600, marginLeft: 4 }}>{item.minOrder > 1 ? '/doc.' : 'c/u'}</span>
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
                        <div style={{ width: '100%', height: items.length === 1 ? 190 : 140, background: '#F9FAFB', borderBottom: '1px solid #F3F4F6', position: 'relative', overflow: 'hidden' }}>
                          {item.image
                            ? <img src={item.image} alt={item.name} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', maxWidth: 'calc(100% - 16px)', maxHeight: 'calc(100% - 16px)' }} />
                            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>📦</div>}
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
                          {/* Precio (siempre mayorista en el carrito) */}
                          <div>
                            <div style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 15 }}>${subtotal.toLocaleString('es-AR')}</div>
                            <div style={{ color: '#9CA3AF', fontSize: 10 }}>{item.minOrder > 1 ? `$${(item.wholesalePrice * item.minOrder).toLocaleString('es-AR')}/doc.` : `$${item.wholesalePrice.toLocaleString('es-AR')} c/u`}</div>
                          </div>
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

                {/* Opción A: mínimo de compra por catálogo */}
                {grupos.map((g) => (
                  <div key={g.cat} style={{ background: g.ok ? '#ECFDF5' : '#FFF7ED', border: `1.5px solid ${g.ok ? '#86EFAC' : '#FFD7C2'}`, borderRadius: 10, padding: '9px 11px', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontWeight: 900, fontSize: 12.5, color: g.ok ? '#15803D' : '#9A3412', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{g.cat}</span>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>Subtotal ${g.sub.toLocaleString('es-AR')}</span>
                    </div>
                    <div style={{ background: '#E5E7EB', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 99, width: `${Math.min(100, Math.round((g.sub / g.min) * 100))}%`, background: g.ok ? '#16A34A' : '#FF6A3D', transition: 'width .4s ease' }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, marginTop: 5, color: g.ok ? '#15803D' : '#B45309' }}>
                      {g.ok
                        ? `✅ Mínimo $${g.min.toLocaleString('es-AR')} alcanzado`
                        : `⚠️ Faltan $${g.falta.toLocaleString('es-AR')} para el mínimo de $${g.min.toLocaleString('es-AR')}`}
                    </div>
                  </div>
                ))}
                {grupos.length > 1 && (
                  <div style={{ fontSize: 10.5, color: '#6B7280', textAlign: 'center', marginBottom: 8, lineHeight: 1.4 }}>
                    ℹ️ Cada catálogo tiene su mínimo y se procesa por separado.
                  </div>
                )}


                {/* Desglose de totales */}
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#6B7280', fontSize: 12 }}>Subtotal</span>
                    <span style={{ color: '#111827', fontWeight: 700, fontSize: 12 }}>${wholesaleTotal.toLocaleString('es-AR')}</span>
                  </div>
                  {!isWholesale && (
                    <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, padding: '7px 10px', marginBottom: 8, fontSize: 11, color: '#0369A1', lineHeight: 1.45 }}>
                      ℹ️ Precio <strong>minorista</strong>. Comprando <strong>$100.000+</strong> accedés al <strong>precio mayorista</strong>; si no, se suma <strong>+30%</strong> al momento de pagar.
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#111827', fontWeight: 800, fontSize: 14 }}>Total</span>
                    <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 20 }}>${wholesaleTotal.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                {/* Seguir comprando */}
                <button onClick={onClose}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #FF6A3D', background: 'transparent', color: '#E0521F', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                  ← Seguir comprando
                </button>

                {/* ─── FORMULARIO DATOS DEL CLIENTE (al final: aparece al elegir forma de pago) ─── */}
                {!sessionUser && (guestSaved || pedirDatos) && (
                  <div ref={datosRef} style={{ marginBottom: 8, marginTop: 4 }}>
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
                          <span style={{ color: '#92400E', fontWeight: 900, fontSize: 13 }}>Último paso: tus datos para finalizar</span>
                        </div>
                        {/* Nombre */}
                        <div style={{ marginBottom: 8 }}>
                          <input
                            type="text"
                            placeholder="Nombre y apellido *"
                            value={guestForm.nombre}
                            onChange={e => setGuestForm(p => ({ ...p, nombre: e.target.value }))}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${guestErrors.nombre ? '#EF4444' : '#E5E7EB'}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#111827', background: '#FFFFFF' }}
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
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${guestErrors.email ? '#EF4444' : '#E5E7EB'}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#111827', background: '#FFFFFF' }}
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
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${guestErrors.telefono ? '#EF4444' : '#E5E7EB'}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#111827', background: '#FFFFFF' }}
                          />
                          {guestErrors.telefono && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{guestErrors.telefono}</div>}
                        </div>
                        <button onClick={guardarGuest}
                          style={{ width: '100%', padding: '9px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#FFFFFF', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}>
                          Confirmar datos →
                        </button>
                        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#9CA3AF' }}>
                          ¿Ya tenés cuenta?{' '}
                          <a href="/login" style={{ color: '#FF6A3D', fontWeight: 700, textDecoration: 'none' }}>Ingresá aquí</a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Checkout buttons (siempre visibles; desactivados hasta el mínimo) */}
                {puedeComprar ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                    {/* Aviso: faltan $X para habilitar los medios de pago */}
                    {!alcanzaMin && (
                      <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ fontSize: 16, lineHeight: 1.2 }}>🔒</span>
                        <span style={{ color: '#0369A1', fontWeight: 700, fontSize: 12, lineHeight: 1.4 }}>
                          Faltan <strong>${faltaMin.toLocaleString('es-AR')}</strong> para llegar al mínimo de <strong>${RETAIL_MIN.toLocaleString('es-AR')}</strong>. Los medios de pago se activan al alcanzarlo.
                        </span>
                      </div>
                    )}

                    {/* Desglose del recargo minorista — se revela recién al momento de pagar */}
                    {alcanzaMin && !isWholesale && (
                      <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 10, padding: '10px 12px', fontSize: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ color: '#6B7280' }}>Subtotal (precio mayorista)</span>
                          <span style={{ color: '#374151', fontWeight: 700 }}>${wholesaleTotal.toLocaleString('es-AR')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ color: '#0369A1' }}>Recargo minorista (+{Math.round((RETAIL_MARKUP - 1) * 100)}%)</span>
                          <span style={{ color: '#0369A1', fontWeight: 700 }}>+${(displayTotal - wholesaleTotal).toLocaleString('es-AR')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #FDE68A', paddingTop: 4, marginTop: 2 }}>
                          <span style={{ color: '#111827', fontWeight: 900 }}>Total a pagar</span>
                          <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 15 }}>${displayTotal.toLocaleString('es-AR')}</span>
                        </div>
                        <div style={{ color: '#92400E', fontSize: 10, marginTop: 5, lineHeight: 1.4 }}>
                          💡 Llegando a $100.000 te ahorrás el recargo (precio mayorista).
                        </div>
                      </div>
                    )}

                    {/* Transferencia / dinero en cuenta — SIN RECARGO (opción recomendada, va arriba) */}
                    <button
                      disabled={!alcanzaMin}
                      onClick={() => { if (!alcanzaMin) return; if (!tieneDatos()) return; notificarPedidoIniciado('Transferencia'); setShowTransfer(v => !v) }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #15803D', background: showTransfer ? '#ECFDF3' : 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', color: '#15803D', fontWeight: 900, cursor: alcanzaMin ? 'pointer' : 'not-allowed', opacity: alcanzaMin ? 1 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 3px 12px rgba(21,128,61,0.25)' }}>
                      <span style={{ fontSize: 18 }}>🏦</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>TRANSFERENCIA / DINERO EN CUENTA · ${displayTotal.toLocaleString('es-AR')}</div>
                        <div style={{ marginTop: 4 }}>
                          <span style={{ display: 'inline-block', background: '#16A34A', color: '#FFFFFF', fontSize: 12, fontWeight: 900, letterSpacing: '0.05em', padding: '2px 10px', borderRadius: 99 }}>✅ SIN RECARGO</span>
                        </div>
                        <div style={{ fontSize: 10, color: '#6B7280', marginTop: 3 }}>Los precios no incluyen IVA</div>
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
                          <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 16 }}>${displayTotal.toLocaleString('es-AR')}</span>
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

                    {/* MP con +10% recargo */}
                    <button
                      onClick={handleMercadoPago}
                      disabled={mpLoading || !alcanzaMin}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: 'none', background: (mpLoading || !alcanzaMin) ? '#9CA3AF' : 'linear-gradient(135deg,#009EE3,#0070BA)', color: '#FFFFFF', fontWeight: 900, cursor: (mpLoading || !alcanzaMin) ? 'not-allowed' : 'pointer', opacity: alcanzaMin ? 1 : 0.6, boxShadow: '0 4px 14px rgba(0,158,227,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <CreditCard size={16} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 14, fontWeight: 900 }}>{mpLoading ? 'REDIRIGIENDO...' : 'PAGAR CON MERCADO PAGO'}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9 }}>
                          ${Math.round(displayTotal * 1.10).toLocaleString('es-AR')} · +10% recargo tarjeta
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.75, marginTop: 1 }}>Los precios no incluyen IVA</div>
                      </div>
                    </button>

                    {/* WA */}
                    <a
                      href={alcanzaMin ? waLink : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => { if (!alcanzaMin) { e.preventDefault(); return } if (!tieneDatos()) { e.preventDefault(); return } notificarPedidoIniciado('WhatsApp') }}
                      style={{ width: '100%', padding: '11px', borderRadius: 12, border: '1.5px solid #25D366', background: 'transparent', color: '#128C7E', fontWeight: 900, fontSize: 13, cursor: alcanzaMin ? 'pointer' : 'not-allowed', opacity: alcanzaMin ? 1 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageCircle size={16} />
                        PEDIR POR WHATSAPP
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>Los precios no incluyen IVA</div>
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={onClose}
                    style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#FFFFFF', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,106,61,0.35)' }}>
                    + SEGUIR AGREGANDO PRODUCTOS
                  </button>
                )}
                <button onClick={clearCart}
                  style={{ width: '100%', marginTop: 8, padding: '10px', borderRadius: 12, border: '1px solid #FECACA', background: '#FEF2F2', color: '#EF4444', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Vaciar carrito
                </button>
              </div>
            )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
