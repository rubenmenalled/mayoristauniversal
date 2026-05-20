'use client'

import { useState } from 'react'

const WA = 'https://wa.me/5491164660482'

const TRANSPORTES = [
  { nombre: 'Correo Argentino', emoji: '📮', desc: 'Entrega en todo el país' },
  { nombre: 'OCA', emoji: '🚛', desc: 'Puerta a puerta en 24-72hs' },
  { nombre: 'Andreani', emoji: '📦', desc: 'Seguimiento online en tiempo real' },
  { nombre: 'Via Cargo', emoji: '🏎️', desc: 'Ideal para envíos al interior' },
  { nombre: 'Expreso Zapla', emoji: '🚚', desc: 'Norte y NOA' },
  { nombre: 'Retiro en depósito', emoji: '🏭', desc: 'Coordiná por WhatsApp' },
]

export default function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <style>{`
        #hero-section {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        @media (max-width: 767px) {
          #hero-section { padding-top: 92px; }
          #hero-banner { height: 56vw; overflow: hidden; }
          #hero-banner img { width: 100%; height: 100%; object-fit: cover; object-position: center center; display: block; }
        }
        @media (min-width: 768px) {
          #hero-section { padding-top: 98px; }
          #hero-banner { width: 100%; }
          #hero-banner img { width: 100%; height: auto; display: block; }
        }
        .envios-bar:hover { opacity: 0.92; transform: scale(1.01); }
        .envios-bar { transition: all 0.2s ease; cursor: pointer; }
        .transporte-card:hover { transform: translateY(-2px); background: rgba(212,175,55,0.12) !important; }
        .transporte-card { transition: all 0.18s ease; }
      `}</style>

      <section id="hero-section">
        <div id="hero-banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/portada_desktop.png" alt="Mayorista Universal - Multirubros Mayoristas" />
        </div>

        {/* Botón catálogos debajo de la imagen */}
        <div style={{ background: 'rgba(97,72,48,0.98)', padding: '14px 16px', display: 'flex', justifyContent: 'center' }}>
          <a href="/catalogo" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
            color: '#614830', fontWeight: 900,
            fontSize: 'clamp(13px,1.8vw,16px)',
            padding: 'clamp(10px,1.5vw,14px) clamp(24px,3vw,48px)',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}>
            📋 VER TODOS LOS CATÁLOGOS
          </a>
        </div>

        {/* Barra de envíos — clickeable */}
        <div
          className="envios-bar"
          onClick={() => setModalOpen(true)}
          style={{
            background: 'rgba(97,72,48,0.98)',
            borderTop: '1px solid rgba(212,175,55,0.24)',
            padding: 'clamp(12px,2vw,20px) 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          }}
        >
          <span style={{ fontSize: 36 }}>🚚</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 'clamp(16px,1.8vw,24px)', lineHeight: 1, letterSpacing: '0.05em' }}>
              ENVÍOS A TODO EL PAÍS
            </span>
            <span style={{ color: '#7a8a9a', fontSize: 12, marginTop: 3 }}>Tocá para ver opciones de transporte y contacto</span>
          </div>
          <span style={{ fontSize: 28, marginLeft: 8 }}>🇦🇷</span>
        </div>
      </section>

      {/* Modal de envíos */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #614830 0%, #6B543E 100%)',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: 20, width: '100%', maxWidth: 480,
              maxHeight: '90vh', overflowY: 'auto',
              padding: 28,
            }}
          >
            {/* Encabezado */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 20, letterSpacing: '0.04em' }}>🚚 ENVÍOS A TODO EL PAÍS</div>
                <div style={{ color: '#7a8a9a', fontSize: 13, marginTop: 4 }}>Trabajamos con los principales transportes</div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFFFFF', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            </div>

            {/* Cómo funciona */}
            <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ color: '#D4AF37', fontWeight: 800, fontSize: 13, marginBottom: 8 }}>¿Cómo funciona?</div>
              <div style={{ color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
                1️⃣ Hacé tu pedido desde el catálogo<br />
                2️⃣ Te contactamos por WhatsApp para coordinar pago y envío<br />
                3️⃣ Elegís el transporte de tu preferencia<br />
                4️⃣ Tu pedido llega a cualquier provincia 🇦🇷
              </div>
            </div>

            {/* Opciones de transporte */}
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', marginBottom: 12 }}>TRANSPORTES DISPONIBLES</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {TRANSPORTES.map(t => (
                <div key={t.nombre} className="transporte-card" style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,175,55,0.15)',
                  borderRadius: 12, padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{t.emoji}</div>
                  <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 13 }}>{t.nombre}</div>
                  <div style={{ color: '#7a8a9a', fontSize: 11, marginTop: 3 }}>{t.desc}</div>
                </div>
              ))}
            </div>

            {/* Botón WhatsApp */}
            <a
              href={`${WA}?text=${encodeURIComponent('Hola! Quiero consultar sobre opciones de envío y transporte.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'linear-gradient(135deg,#16a34a,#15803d)',
                border: 'none', borderRadius: 14,
                padding: '16px', width: '100%',
                color: '#FFFFFF', fontWeight: 900, fontSize: 16,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(22,163,74,0.4)',
              }}
            >
              <span style={{ fontSize: 22 }}>💬</span>
              Consultar por WhatsApp
            </a>
            <div style={{ color: '#7a8a9a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
              Respondemos en el momento · Lun a Sab 9 a 18hs
            </div>
          </div>
        </div>
      )}
    </>
  )
}
