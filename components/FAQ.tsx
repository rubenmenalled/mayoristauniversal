'use client'

import { useState } from 'react'

const preguntas = [
  {
    pregunta: '¿Hay un mínimo de compra?',
    respuesta:
      'Sí, el monto mínimo de compra es de $150.000. Esto nos permite ofrecerte los mejores precios mayoristas.',
  },
  {
    pregunta: '¿Cómo hago un pedido?',
    respuesta:
      'Explorás nuestros catálogos, elegís los productos y nos contactás por WhatsApp con el detalle. Te respondemos en el día con disponibilidad y precios.',
  },
  {
    pregunta: '¿Envían a todo el país?',
    respuesta:
      'Sí, trabajamos con múltiples transportes: Andreani, OCA, Correo Argentino, Labulle y bus de carga. El costo de envío va por cuenta del comprador.',
  },
  {
    pregunta: '¿Cuáles son los medios de pago?',
    respuesta:
      'Aceptamos transferencia bancaria, Mercado Pago y efectivo para retiro en depósito. Consultanos por otros métodos.',
  },
  {
    pregunta: '¿Los precios incluyen IVA?',
    respuesta:
      'Los precios son sin IVA. Al momento de facturar se agrega según tu condición impositiva (Responsable Inscripto o Consumidor Final).',
  },
  {
    pregunta: '¿Puedo retirar el pedido personalmente?',
    respuesta:
      'Sí, podés retirar en nuestro depósito coordinando día y horario por WhatsApp previamente.',
  },
  {
    pregunta: '¿Cuánto tarda en llegar el pedido?',
    respuesta:
      'Una vez confirmado el pago, preparamos el pedido en 24/48hs hábiles. Los tiempos de envío dependen del transporte elegido y la distancia.',
  },
  {
    pregunta: '¿Qué pasa si un producto llega dañado?',
    respuesta:
      'Trabajamos con embalaje reforzado para evitar roturas. En caso de inconveniente, contactanos inmediatamente y lo resolvemos.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  const sectionStyle: React.CSSProperties = {
    background: '#0F3460',
    padding: '80px 20px',
    width: '100%',
    boxSizing: 'border-box',
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(24px, 4vw, 36px)',
    fontWeight: 700,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: '0 0 48px 0',
    letterSpacing: '-0.5px',
  }

  const listStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }

  const ctaWrapStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '48px',
  }

  const ctaButtonStyle: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #D4AF37, #F0C030)',
    color: '#0F3460',
    fontWeight: 700,
    fontSize: '16px',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    letterSpacing: '0.2px',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
  }

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Preguntas Frecuentes</h2>

        <div style={listStyle}>
          {preguntas.map((item, i) => {
            const isOpen = openIndex === i

            const itemStyle: React.CSSProperties = {
              background: isOpen ? 'rgba(27,82,153, 0.85)' : 'rgba(27,82,153, 0.45)',
              border: isOpen
                ? '1px solid rgba(212, 175, 55, 0.6)'
                : '1px solid rgba(212, 175, 55, 0.12)',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }

            const buttonStyle: React.CSSProperties = {
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '20px 24px',
              textAlign: 'left',
            }

            const questionStyle: React.CSSProperties = {
              color: isOpen ? '#F0C030' : '#E8EEF8',
              fontWeight: 600,
              fontSize: '16px',
              margin: 0,
              transition: 'color 0.3s ease',
              flex: 1,
            }

            const arrowStyle: React.CSSProperties = {
              color: '#D4AF37',
              fontSize: '18px',
              flexShrink: 0,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              display: 'inline-block',
              lineHeight: 1,
            }

            const answerStyle: React.CSSProperties = {
              maxHeight: isOpen ? '300px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 0.35s ease',
            }

            const answerInnerStyle: React.CSSProperties = {
              padding: '0 24px 20px 24px',
              color: '#8899BB',
              fontSize: '15px',
              lineHeight: '1.65',
            }

            return (
              <div key={i} style={itemStyle}>
                <button style={buttonStyle} onClick={() => toggle(i)} aria-expanded={isOpen}>
                  <span style={questionStyle}>{item.pregunta}</span>
                  <span style={arrowStyle}>▼</span>
                </button>
                <div style={answerStyle} aria-hidden={!isOpen}>
                  <p style={answerInnerStyle}>{item.respuesta}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div style={ctaWrapStyle}>
          <a
            href="https://wa.me/5491164660482"
            target="_blank"
            rel="noopener noreferrer"
            style={ctaButtonStyle}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.opacity = '0.88'
              ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.opacity = '1'
              ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
            }}
          >
            ¿Tenés más dudas? Consultanos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
