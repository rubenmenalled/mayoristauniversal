'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function PagoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get('status')
  const emailSent = useRef(false)

  useEffect(() => {
    if (status === 'success' && !emailSent.current) {
      emailSent.current = true
      try {
        const saved = localStorage.getItem('mp_pending_order')
        if (saved) {
          fetch('/api/mp-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: saved,
          }).catch(() => {})
          localStorage.removeItem('mp_pending_order')
        }
      } catch {}
    }
  }, [status])

  const config = {
    success: {
      emoji: '✅',
      title: '¡Pago recibido!',
      msg: 'Tu pedido fue confirmado. Te vamos a contactar por WhatsApp para coordinar el envío.',
      color: '#065F46',
      bg: '#D1FAE5',
      border: '#6EE7B7',
    },
    pending: {
      emoji: '⏳',
      title: 'Pago pendiente',
      msg: 'Tu pago está siendo procesado. Te avisamos cuando se confirme.',
      color: '#92400E',
      bg: '#FEF3C7',
      border: '#FCD34D',
    },
    failure: {
      emoji: '❌',
      title: 'Pago no completado',
      msg: 'Hubo un problema con el pago. Podés intentar de nuevo o contactarnos por WhatsApp.',
      color: '#991B1B',
      bg: '#FEE2E2',
      border: '#FCA5A5',
    },
  }

  const c = config[status as keyof typeof config] ?? config.pending

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 40, maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{c.emoji}</div>
        <h1 style={{ color: '#111827', fontWeight: 900, fontSize: 24, marginBottom: 12 }}>{c.title}</h1>
        <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 24 }}>
          <p style={{ color: c.color, fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{c.msg}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => router.push('/')}
            style={{ padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#FFFFFF', fontWeight: 900, fontSize: 15, cursor: 'pointer' }}>
            Volver al inicio
          </button>
          {status === 'failure' && (
            <a
              href="https://wa.me/5491164660482?text=Hola,%20tuve%20un%20problema%20con%20el%20pago"
              style={{ padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#FFFFFF', fontWeight: 900, fontSize: 14, cursor: 'pointer', textDecoration: 'none', display: 'block' }}>
              💬 Contactar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PagoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FFFFFF' }} />}>
      <PagoContent />
    </Suspense>
  )
}
