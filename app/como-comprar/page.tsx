'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const PASOS = [
  {
    numero: '1',
    emoji: '📋',
    titulo: 'Explorá el catálogo',
    desc: 'Navegá por todas nuestras categorías y encontrá los productos que necesitás. Podés buscar por nombre, categoría o marca.',
    accion: 'Ver catálogo →',
    href: '/catalogo',
  },
  {
    numero: '2',
    emoji: '🛒',
    titulo: 'Agregá al carrito',
    desc: 'Seleccioná los artículos de tu preferencia y hacé clic en "Añadir al carrito". Revisá el resumen antes de continuar.',
    accion: null,
    href: null,
  },
  {
    numero: '3',
    emoji: '💬',
    titulo: 'Coordiná por WhatsApp',
    desc: 'Te contactamos por WhatsApp para confirmar disponibilidad, acordar el medio de pago (transferencia, Mercado Pago o efectivo) y el transporte de entrega.',
    accion: 'Escribinos →',
    href: 'https://wa.me/5491164660482?text=¡Hola! Quiero hacer un pedido.',
  },
  {
    numero: '4',
    emoji: '📦',
    titulo: 'Recibí tu pedido',
    desc: 'Una vez confirmado el pago, preparamos tu pedido y lo enviamos por el transporte que elijas. Los tiempos de entrega pueden demorar de 3 a 7 días hábiles según el destino.',
    accion: null,
    href: null,
  },
]

export default function ComoComprarPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)' }}>

      {/* Header */}
      <div style={{
        background: 'rgba(240,240,240,0.97)', borderBottom: '1px solid rgba(245,197,24,0.2)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#F5C518', fontWeight: 700, fontSize: 13,
            }}>
            <ArrowLeft size={16} /> Inicio
          </button>
          <div style={{ color: '#C01515', fontWeight: 900, fontSize: 20 }}>¿Cómo Comprar?</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>

        <h1 style={{ color: '#F5C518', fontWeight: 900, fontSize: 28, marginBottom: 8, textAlign: 'center' }}>
          ¿Cómo comprar en Mayorista Universal?
        </h1>
        <p style={{ color: '#4A5568', fontSize: 16, textAlign: 'center', marginBottom: 48 }}>
          Seguí estos 4 pasos simples para hacer tu pedido
        </p>

        {/* Pasos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PASOS.map((paso, i) => (
            <div key={i} style={{
              background: '#FFFFFF',
              border: '1px solid rgba(245,197,24,0.25)',
              borderRadius: 16,
              padding: '24px 28px',
              display: 'flex', gap: 20, alignItems: 'flex-start',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              {/* Número */}
              <div style={{
                width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#F5C518,#FFE45C)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 22, color: '#FFFFFF',
              }}>
                {paso.numero}
              </div>

              {/* Contenido */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{paso.emoji}</div>
                <div style={{ color: '#C01515', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                  {paso.titulo}
                </div>
                <div style={{ color: '#4A5568', fontSize: 15, lineHeight: 1.7, marginBottom: paso.accion ? 14 : 0 }}>
                  {paso.desc}
                </div>
                {paso.accion && paso.href && (
                  <a href={paso.href}
                    target={paso.href.startsWith('http') ? '_blank' : undefined}
                    rel={paso.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg,#F5C518,#FFE45C)',
                      color: '#FFFFFF', fontWeight: 800, fontSize: 13,
                      padding: '8px 20px', borderRadius: 10, textDecoration: 'none',
                    }}>
                    {paso.accion}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ color: '#4A5568', fontSize: 15, marginBottom: 20 }}>
            ¿Tenés alguna duda? ¡Estamos para ayudarte!
          </p>
          <a href="https://wa.me/5491164660482?text=¡Hola! Tengo una consulta sobre cómo comprar."
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg,#16a34a,#15803d)',
              color: '#FFFFFF', fontWeight: 900, fontSize: 16,
              padding: '14px 36px', borderRadius: 12, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(22,163,74,0.3)',
            }}>
            💬 Consultanos por WhatsApp

          </a>
        </div>
      </div>
    </div>
  )
}
