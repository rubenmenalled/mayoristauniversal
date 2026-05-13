'use client'
import { useRouter } from 'next/navigation'

export default function PagoFallido() {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#030D1E,#071633)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
      <div style={{ fontSize: 72 }}>❌</div>
      <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 28, textAlign: 'center' }}>Pago no completado</h1>
      <p style={{ color: '#7a8a9a', fontSize: 15, textAlign: 'center', maxWidth: 400 }}>
        Hubo un problema con tu pago. Podés intentarlo de nuevo o contactarnos por WhatsApp.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => router.push('/checkout')} style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 12, padding: '14px 28px', color: '#030D1E', fontWeight: 900, fontSize: 15, cursor: 'pointer' }}>
          Intentar de nuevo
        </button>
        <a href="https://wa.me/5491164660482" target="_blank" style={{ background: '#16a34a', border: 'none', borderRadius: 12, padding: '14px 28px', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', textDecoration: 'none' }}>
          📱 WhatsApp
        </a>
      </div>
    </div>
  )
}
