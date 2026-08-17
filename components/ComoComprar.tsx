'use client';

import Link from 'next/link';

interface Paso {
  numero: number;
  emoji: string;
  titulo: string;
  descripcion: string;
  image: string;
}

const pasos: Paso[] = [
  {
    numero: 1,
    emoji: '🔍',
    titulo: 'Explorá y elegí tus productos',
    descripcion: 'Explorá nuestro amplio catálogo de productos, donde podrás buscar por categorías. Elegí el artículo de tu preferencia y hacé click en «Agregar». Recordá que el mínimo de compra es de $150.000.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=700&q=70',
  },
  {
    numero: 2,
    emoji: '🛒',
    titulo: 'Revisá tu carrito',
    descripcion: 'Una vez agregado el/los productos, aparecerá el recuadro del carrito a tu derecha. Luego seleccioná «Ir a Pagar».',
    image: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=700&q=70',
  },
  {
    numero: 3,
    emoji: '💳',
    titulo: 'Ingresá tus datos y pagá',
    descripcion: 'Completá tus datos personales, de facturación y de envío. Luego elegí tu método de pago: 🏦 Transferencia bancaria (sin recargo) · 💙 Mercado Pago con saldo en cuenta (sin recargo) · 💳 Mercado Pago con tarjeta de crédito (+10% de recargo automático).',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&q=70',
  },
  {
    numero: 4,
    emoji: '🚚',
    titulo: 'Confirmación y envío',
    descripcion: 'Al realizar el pedido verás el detalle y, si elegís transferencia, los datos bancarios para acreditar el pago. Una vez recibido el pago nos ponemos en contacto y procedemos con el envío.',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700&q=70',
  },
];

export default function ComoComprar() {
  return (
    <>
      <style>{`
        .como-comprar-grid {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 0;
          position: relative;
        }

        .paso-card {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 20px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,106,61, 0.35);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(11,30,63,0.18);
        }

        .paso-bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 0;
        }
        .paso-overlay {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(11,30,63,0.45) 0%, rgba(11,30,63,0.72) 55%, rgba(11,30,63,0.93) 100%);
        }

        .paso-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          color: #FF6A3D;
          font-size: 22px;
          flex-shrink: 0;
          align-self: center;
        }

        @media (max-width: 768px) {
          .como-comprar-grid {
            flex-direction: column !important;
            gap: 12px !important;
            padding-left: 0 !important;
          }

          .paso-card {
            flex: 0 0 auto !important;
            flex-direction: column !important;
            text-align: left !important;
            align-items: flex-start !important;
            padding: 16px !important;
            border-radius: 12px;
          }

          .paso-content {
            flex-direction: column !important;
            align-items: flex-start !important;
            width: 100%;
          }

          .paso-arrow {
            display: none !important;
          }

          .paso-numero {
            margin: 0 0 10px 0 !important;
            flex-shrink: 0;
          }

          .paso-emoji {
            display: none !important;
          }
        }
      `}</style>

      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '72px 24px',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#C01515',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
              }}
            >
              ¿Cómo comprar?
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#000000',
                maxWidth: '480px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Comprá mayorista en 4 simples pasos, sin complicaciones
            </p>
            <div
              style={{
                width: '56px',
                height: '3px',
                backgroundColor: '#FF6A3D',
                margin: '20px auto 0',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* Steps grid */}
          <div className="como-comprar-grid">
            {pasos.map((paso, i) => (
              <>
                <div key={paso.numero} className="paso-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={paso.image} alt="" className="paso-bg" loading="lazy" decoding="async" />
                  <div className="paso-overlay" />

                  {/* Emoji */}
                  <span
                    className="paso-emoji"
                    style={{
                      fontSize: '32px',
                      marginBottom: '16px',
                      lineHeight: 1,
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {paso.emoji}
                  </span>

                  {/* Número en círculo */}
                  <div
                    className="paso-numero"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#FF6A3D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '16px',
                      color: '#FFFFFF',
                      marginBottom: '16px',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    {paso.numero}
                  </div>

                  {/* Texto */}
                  <div className="paso-content" style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        marginBottom: '8px',
                        lineHeight: 1.3,
                        textShadow: '0 2px 10px rgba(0,0,0,0.45)',
                      }}
                    >
                      {paso.titulo}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.92)',
                        lineHeight: 1.6,
                        margin: 0,
                        textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {paso.descripcion}
                    </p>
                  </div>
                </div>

                {/* Arrow between cards (desktop only) */}
                {i < pasos.length - 1 && (
                  <div key={`arrow-${i}`} className="paso-arrow">
                    →
                  </div>
                )}
              </>
            ))}
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', marginTop: '52px' }}>
            <Link
              href="/#catalogos"
              style={{
                display: 'inline-block',
                backgroundColor: '#FF6A3D',
                color: '#C01515',
                fontWeight: 800,
                fontSize: '14px',
                letterSpacing: '0.08em',
                padding: '16px 40px',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease, transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FF8A63';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FF6A3D';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              VER CATÁLOGOS →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
