'use client'
import { useRouter } from 'next/navigation'

export default function PagoExitoso() {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#F0EBE0,#F8F5EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
      <div style={{ fontSize: 72 }}>✅</div>
      <h1 style={{ color: '#1A2B4A', fontWeight: 900, fontSize: 28, textAlign: 'center' }}>¡Pago exitoso!</h1>
      <p style={{ color: '#7a8a9a', fontSize: 15, textAlign: 'center', maxWidth: 400 }}>
        Tu pedido fue procesado correctamente. Te enviaremos los detalles por email.
      </p>
      <button onClick={() => router.push('/')} style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 12, padding: '14px 32px', color: '#F0EBE0', fontWeight: 900, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>
        Volver al inicio
      </button>
    </div>
  )
}
