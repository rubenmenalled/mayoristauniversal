'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ShoppingBag, User, Check, Copy, MessageCircle } from 'lucide-react'
import Image from 'next/image'

// Logo Mercado Pago
// white=true → logo blanco (para fondos azules)
// white=false → logo azul (para fondos blancos)
function MPLogo({ height = 28, white = false }: { height?: number; white?: boolean }) {
  const aspectRatio = 3.84 // 4096 / 1067
  const width = Math.round(height * aspectRatio)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mp-logo.png"
      alt="Mercado Pago"
      width={width}
      height={height}
      style={{
        display: 'block',
        objectFit: 'contain',
        filter: white ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  )
}

const GOLD = '#D4AF37'
const BLUE = '#1565C0'
const MIN_COMPRA = 150000

const STEPS = [
  { n: 1, label: 'Tus datos' },
  { n: 2, label: 'Pago' },
  { n: 3, label: '¡Listo!' },
]

const stepIndex: Record<string, number> = { form: 1, pago: 2, listo: 3 }

function StepBar({ current }: { current: 'form' | 'pago' | 'listo' }) {
  const active = stepIndex[current]
  return (
    <div style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #EEE',
      padding: '14px 24px',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        {STEPS.map((s, i) => {
          const done = s.n < active
          const isCurrent = s.n === active
          return (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'unset' }}>
              {/* Círculo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: done ? '#22c55e' : isCurrent ? 'linear-gradient(135deg,#D4AF37,#F0C030)' : '#E5E7EB',
                  color: done || isCurrent ? '#FFFFFF' : '#9CA3AF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 14, flexShrink: 0,
                  boxShadow: isCurrent ? '0 2px 10px rgba(212,175,55,0.4)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {done ? '✓' : s.n}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap',
                  color: isCurrent ? GOLD : done ? '#22c55e' : '#9CA3AF',
                  letterSpacing: '0.03em',
                }}>
                  {s.label}
                </span>
              </div>
              {/* Línea conectora */}
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 3, marginBottom: 14,
                  background: done ? '#22c55e' : '#E5E7EB',
                  borderRadius: 2, transition: 'background 0.3s',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const MP_ALIAS = 'ruby.mena.1972'
const MP_TITULAR = 'Andres Ruben Menalled'

// Link directo de Mercado Pago para transferir al alias
function getMPLink(total: number) {
  // Intenta abrir la app nativa en mobile, sino la web
  const encoded = encodeURIComponent(MP_ALIAS)
  return `https://mpago.la/transfer?alias=${encoded}&amount=${total}`
}

// Deep link para abrir la app de MP en mobile
function getMPDeepLink(total: number) {
  return `mercadopago://transfer?alias=${encodeURIComponent(MP_ALIAS)}&amount=${total}`
}

// Fallback: página web de MP para enviar dinero
const MP_WEB = 'https://www.mercadopago.com.ar/activities'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'pago' | 'listo'>('form')
  const [waUrl, setWaUrl] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [totalPago, setTotalPago] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user
        setUserId(u.id)
        setForm(f => ({
          nombre: f.nombre || u.user_metadata?.nombre || '',
          email: f.email || u.email || '',
          telefono: f.telefono || u.user_metadata?.whatsapp || '',
        }))
      }
    })
  }, [])

  if (items.length === 0 && step === 'form') {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 60 }}>🛒</div>
        <div style={{ color: BLUE, fontWeight: 900, fontSize: 20 }}>Tu carrito está vacío</div>
        <button onClick={() => router.push('/')} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '12px 28px', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer' }}>
          Ver productos
        </button>
      </div>
    )
  }

  async function handleConfirmar() {
    if (!form.nombre.trim() || !form.email.trim() || !form.telefono.trim()) {
      setError('Completá todos los campos')
      return
    }
    if (total < MIN_COMPRA) {
      setError(`El mínimo de compra es $${MIN_COMPRA.toLocaleString('es-AR')}`)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/confirmar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, total, user_id: userId, metodoPago: 'mercadopago' }),
      })
      const data = await res.json()
      if (data.ok) {
        setTotalPago(total)   // guardar total ANTES de vaciar el carrito
        clearCart()
        setWaUrl(data.waUrl)
        setStep('pago')
      } else {
        setError('Error al confirmar. Intentá de nuevo.')
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    }
    setLoading(false)
  }

  function copiarAlias() {
    navigator.clipboard.writeText(MP_ALIAS).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  // Abre la app de MP (mobile) o la web de MP para hacer la transferencia
  function abrirMercadoPago() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      // Intenta abrir la app nativa; si no abre en 1.5s va a la web
      const start = Date.now()
      window.location.href = 'mercadopago://'
      setTimeout(() => {
        if (Date.now() - start < 2000) {
          window.open('https://www.mercadopago.com.ar', '_blank')
        }
      }, 1500)
    } else {
      window.open('https://www.mercadopago.com.ar', '_blank')
    }
  }

  function handleYaTransferi() {
    window.open(waUrl, '_blank')
    setStep('listo')
  }

  // ── STEP: PAGO ────────────────────────────────────────────────────────────
  if (step === 'pago') {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
        <StepBar current="pago" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 520, width: '100%' }}>

          {/* Card principal */}
          <div style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: '0 8px 48px rgba(0,0,0,0.12)', overflow: 'hidden' }}>

            {/* Header azul MP */}
            <div style={{ background: 'linear-gradient(135deg, #009ee3 0%, #0076c0 100%)', padding: '32px 32px 24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <MPLogo height={44} white />
              </div>
              <h1 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 20, margin: '0 0 6px 0' }}>Pagá con Mercado Pago</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: 0 }}>Transferencia segura al instante</p>
            </div>

            <div style={{ padding: '28px 32px' }}>

              {/* Total destacado */}
              <div style={{ background: '#FFF8E7', border: `2px solid ${GOLD}`, borderRadius: 14, padding: '18px 24px', marginBottom: 12, textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 6px 0' }}>TOTAL A PAGAR</p>
                <p style={{ color: GOLD, fontWeight: 900, fontSize: 34, margin: 0, lineHeight: 1 }}>${totalPago.toLocaleString('es-AR')}</p>
              </div>

              {/* Pasos claros */}
              <div style={{ marginBottom: 20 }}>
                {[
                  { n: '1', text: 'Copiá el alias de abajo', icon: '📋' },
                  { n: '2', text: 'Abrí Mercado Pago y buscá "Transferir"', icon: '📱' },
                  { n: '3', text: `Ingresá el alias y el monto $${totalPago.toLocaleString('es-AR')}`, icon: '💰' },
                  { n: '4', text: 'Volvé aquí y envianos el comprobante', icon: '✅' },
                ].map(s => (
                  <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F0C030)', color: '#fff', fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {s.n}
                    </div>
                    <span style={{ fontSize: 13, color: '#444', lineHeight: 1.4 }}>{s.icon} {s.text}</span>
                  </div>
                ))}
              </div>

              {/* Alias para copiar — bien destacado */}
              <div style={{ background: '#F0F8FF', border: '2px solid #009ee3', borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
                <p style={{ color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 6px 0' }}>ALIAS DE MERCADO PAGO</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <p style={{ color: '#0076c0', fontWeight: 900, fontSize: 22, margin: '0 0 2px 0', letterSpacing: '0.02em' }}>{MP_ALIAS}</p>
                    <p style={{ color: '#888', fontSize: 12, margin: 0 }}>Titular: {MP_TITULAR}</p>
                  </div>
                  <button
                    onClick={copiarAlias}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: copiado ? '#22c55e' : '#0076c0',
                      color: '#FFFFFF', border: 'none', borderRadius: 8,
                      padding: '10px 16px', fontWeight: 700, fontSize: 13,
                      cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s'
                    }}>
                    <Copy size={14} />
                    {copiado ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Monto a transferir */}
              <div style={{ background: '#F0FFF4', border: '2px solid #22c55e', borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#166534', fontWeight: 700, fontSize: 13 }}>💰 Monto a transferir:</span>
                <span style={{ color: '#166534', fontWeight: 900, fontSize: 22 }}>${totalPago.toLocaleString('es-AR')}</span>
              </div>

              {/* Botón abrir MP */}
              <button
                onClick={abrirMercadoPago}
                style={{
                  width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #009ee3, #0076c0)',
                  color: '#FFFFFF', fontWeight: 900, fontSize: 15,
                  cursor: 'pointer', marginBottom: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 4px 20px rgba(0,118,192,0.4)',
                }}>
                <MPLogo height={20} white />
                Abrir Mercado Pago
              </button>

              {/* Botón confirmar por WA */}
              <button
                onClick={handleYaTransferi}
                style={{
                  width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                  background: '#25D366', color: '#FFFFFF', fontWeight: 900, fontSize: 15,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 10, boxShadow: '0 4px 20px rgba(37,211,102,0.3)'
                }}>
                <MessageCircle size={18} />
                Ya transferí — Enviar comprobante por WhatsApp
              </button>

              <p style={{ color: '#AAA', fontSize: 12, textAlign: 'center', margin: '12px 0 0 0', lineHeight: 1.5 }}>
                Procesamos tu pedido al recibir el comprobante
              </p>

              {/* Aviso demora entrega */}
              <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: 10, padding: '10px 14px', marginTop: 12, display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🚚</span>
                <p style={{ color: '#1E40AF', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                  <strong>Tiempo de entrega:</strong> los pedidos pueden demorar de <strong>3 a 7 días hábiles</strong> según el transporte y destino.
                </p>
              </div>

              {/* Aviso IVA */}
              <div style={{ background: '#FFFBEB', border: '1px solid #F59E0B', borderRadius: 10, padding: '10px 14px', marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                  <p style={{ color: '#78350F', fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                    <strong>Precios sin IVA.</strong> Si necesitás factura, consultanos antes:{' '}
                    <a href="mailto:info@mayoristauniversal.com" style={{ color: '#B45309', fontWeight: 700, textDecoration: 'none' }}>info@mayoristauniversal.com</a>{' '}
                    o{' '}
                    <a href="https://wa.me/5491164660482?text=Hola%2C%20quiero%20consultar%20sobre%20facturación." target="_blank" rel="noopener noreferrer" style={{ color: '#B45309', fontWeight: 700, textDecoration: 'none' }}>WhatsApp</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }

  // ── STEP: LISTO ───────────────────────────────────────────────────────────
  if (step === 'listo') {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
        <StepBar current="listo" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Check size={40} color="#22c55e" />
          </div>
          <h1 style={{ color: BLUE, fontWeight: 900, fontSize: 26, marginBottom: 12 }}>¡Pedido confirmado!</h1>
          <p style={{ color: '#555', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            Recibimos tu pedido. Envianos el comprobante de transferencia por WhatsApp y lo procesamos enseguida.
          </p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#25D366', color: '#FFFFFF', fontWeight: 900, fontSize: 16,
              padding: '16px 32px', borderRadius: 12, textDecoration: 'none',
              marginBottom: 16, boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
            }}>
            <MessageCircle size={20} /> Enviar comprobante por WhatsApp
          </a>
          <br />
          <button onClick={() => router.push('/')}
            style={{ background: 'none', border: '1px solid #DDD', borderRadius: 12, padding: '12px 28px', color: '#666', fontWeight: 700, cursor: 'pointer', fontSize: 14, marginTop: 8 }}>
            Volver al inicio
          </button>
        </div>
        </div>
      </div>
    )
  }

  // ── STEP: FORM ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
      {/* Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #EEE', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: GOLD, fontWeight: 700, fontSize: 13 }}>
            <ArrowLeft size={16} /> Volver
          </button>
          <div style={{ color: BLUE, fontWeight: 900, fontSize: 20 }}>Finalizar Compra</div>
          <div style={{ marginLeft: 'auto' }}>
            <MPLogo height={28} />
          </div>
        </div>
      </div>
      {/* Barra de pasos */}
      <StepBar current="form" />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

        {/* Formulario */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EEE', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: BLUE, fontWeight: 900, fontSize: 18, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color={GOLD} /> Tus datos
          </h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { label: 'Nombre completo', key: 'nombre', placeholder: 'Juan García', type: 'text' },
              { label: 'Email', key: 'email', placeholder: 'juan@email.com', type: 'email' },
              { label: 'Teléfono / WhatsApp', key: 'telefono', placeholder: '11 1234-5678', type: 'tel' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <label style={{ color: '#555', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: '100%', background: '#F7F8FA', border: '1.5px solid #E0E0E0', borderRadius: 8, padding: '11px 14px', color: '#1A1A1A', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>

          {/* Preview MP */}
          <div style={{ marginTop: 24, background: '#F0F8FF', border: '1.5px solid #009ee3', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <MPLogo height={28} />
            <div>
              <p style={{ color: '#0076c0', fontWeight: 800, fontSize: 13, margin: '0 0 2px 0' }}>Pago con Mercado Pago</p>
              <p style={{ color: '#555', fontSize: 12, margin: 0 }}>Alias: <strong>{MP_ALIAS}</strong></p>
            </div>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', color: '#DC2626', fontSize: 13, marginTop: 16 }}>
              {error}
            </div>
          )}
        </div>

        {/* Resumen */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EEE', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: BLUE, fontWeight: 900, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={16} color={GOLD} /> Resumen del pedido
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, maxHeight: 280, overflowY: 'auto' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F0F0F0', position: 'relative' }}>
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="44px" />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>📦</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#1A1A1A', fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>x{item.quantity}</div>
                </div>
                <div style={{ color: GOLD, fontWeight: 900, fontSize: 13, flexShrink: 0 }}>
                  ${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #EEE', paddingTop: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: BLUE, fontWeight: 900, fontSize: 16 }}>TOTAL</span>
              <span style={{ color: GOLD, fontWeight: 900, fontSize: 24 }}>${total.toLocaleString('es-AR')}</span>
            </div>
          </div>

          {total < MIN_COMPRA && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', color: '#DC2626', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>
              Mínimo de compra: ${MIN_COMPRA.toLocaleString('es-AR')}
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirmar}
            disabled={loading || total < MIN_COMPRA}
            style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 'none',
              background: loading || total < MIN_COMPRA
                ? '#E5E7EB'
                : 'linear-gradient(135deg, #009ee3, #0076c0)',
              color: loading || total < MIN_COMPRA ? '#9CA3AF' : '#FFFFFF',
              fontWeight: 900, fontSize: 15,
              cursor: loading || total < MIN_COMPRA ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s ease',
            }}>
            {loading ? (
              'Procesando...'
            ) : (
              <>
                <MPLogo height={22} white />
                PAGAR CON MERCADO PAGO
              </>
            )}
          </button>
          <div style={{ textAlign: 'center', color: '#999', fontSize: 11, marginTop: 10 }}>
            Al siguiente paso te mostramos cómo transferir
          </div>

          {/* Aviso demora entrega */}
          <div style={{ marginTop: 14, background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>🚚</span>
            <p style={{ color: '#1E40AF', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              <strong>Tiempo de entrega:</strong> los pedidos pueden demorar de <strong>3 a 7 días hábiles</strong> según el transporte y destino.
            </p>
          </div>

          {/* Aviso IVA / Facturación */}
          <div style={{
            marginTop: 18,
            background: '#FFFBEB',
            border: '1.5px solid #F59E0B',
            borderRadius: 12,
            padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <div>
                <p style={{ color: '#92400E', fontWeight: 800, fontSize: 12, margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Los precios no incluyen IVA
                </p>
                <p style={{ color: '#78350F', fontSize: 12, margin: '0 0 8px 0', lineHeight: 1.5 }}>
                  Si necesitás <strong>factura</strong>, los precios tienen un recargo equivalente al IVA vigente. Consultanos antes de confirmar el pedido.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <a
                    href="mailto:info@mayoristauniversal.com"
                    style={{ color: '#B45309', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                  >
                    ✉️ info@mayoristauniversal.com
                  </a>
                  <a
                    href="https://wa.me/5491164660482?text=Hola%2C%20quiero%20consultar%20sobre%20facturación%20de%20mi%20pedido."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#B45309', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                  >
                    💬 WhatsApp: +54 9 11 6466-0482
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
