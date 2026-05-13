'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { ArrowLeft, ShoppingBag, User, Mail, Phone } from 'lucide-react'
import Image from 'next/image'

const GOLD = 'linear-gradient(135deg,#D4AF37,#F0C030)'
const MIN_COMPRA = 150000

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#030D1E,#071633)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 60 }}>🛒</div>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>Tu carrito está vacío</div>
        <button onClick={() => router.push('/')} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '12px 28px', color: '#030D1E', fontWeight: 900, cursor: 'pointer' }}>
          Ver productos
        </button>
      </div>
    )
  }

  async function handlePagar() {
    if (!form.nombre || !form.email || !form.telefono) {
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
      const res = await fetch('/api/crear-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, ...form }),
      })
      const data = await res.json()
      if (data.url) {
        clearCart()
        window.location.href = data.url
      } else {
        setError('Error al procesar el pago. Intentá de nuevo.')
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#030D1E,#071633)' }}>
      {/* Header */}
      <div style={{ background: 'rgba(7,22,51,0.97)', borderBottom: '1px solid rgba(212,175,55,0.2)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', fontWeight: 700, fontSize: 13 }}>
            <ArrowLeft size={16} /> Volver
          </button>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>Finalizar Compra</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

        {/* Formulario */}
        <div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 18, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="#D4AF37" /> Tus datos
            </h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { label: 'Nombre completo', key: 'nombre', icon: <User size={14} />, placeholder: 'Juan García' },
                { label: 'Email', key: 'email', icon: <Mail size={14} />, placeholder: 'juan@email.com' },
                { label: 'Teléfono', key: 'telefono', icon: <Phone size={14} />, placeholder: '11 1234-5678' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    {label.toUpperCase()}
                  </label>
                  <input
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginTop: 16 }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Resumen */}
        <div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 16, padding: 24, position: 'sticky', top: 90 }}>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={16} color="#D4AF37" /> Resumen del pedido
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#071633', position: 'relative' }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="44px" />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>📦</div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ color: '#7a8a9a', fontSize: 11 }}>x{item.quantity}</div>
                  </div>
                  <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 13, flexShrink: 0 }}>
                    ${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#7a8a9a', fontSize: 13 }}>Subtotal</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>${total.toLocaleString('es-AR')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 16 }}>TOTAL</span>
                <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 20 }}>${total.toLocaleString('es-AR')}</span>
              </div>
            </div>
            <button
              onClick={handlePagar}
              disabled={loading || total < MIN_COMPRA}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: loading || total < MIN_COMPRA ? 'rgba(212,175,55,0.3)' : GOLD,
                color: '#030D1E', fontWeight: 900, fontSize: 15,
                cursor: loading || total < MIN_COMPRA ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'Procesando...' : '🔒 PAGAR CON MERCADO PAGO'}
            </button>
            <div style={{ textAlign: 'center', color: '#7a8a9a', fontSize: 11, marginTop: 10 }}>
              Pago 100% seguro con Mercado Pago
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
