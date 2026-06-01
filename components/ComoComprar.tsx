'use client';

import Link from 'next/link';

interface Paso {
  numero: number;
  emoji: string;
  titulo: string;
  descripcion: string;
}

const pasos: Paso[] = [
  {
    numero: 1,
    emoji: '🔍',
    titulo: 'Explorá y elegí tus productos',
    descripcion: 'Explorá nuestro amplio catálogo de productos, donde podrás buscar por categorías. Elegí el artículo de tu preferencia y hacé click en «Agregar». Recordá que el mínimo de compra es de $150.000.',
  },
  {
    numero: 2,
    emoji: '🛒',
    titulo: 'Revisá tu carrito',
    descripcion: 'Una vez agregado el/los productos, aparecerá el recuadro del carrito a tu derecha. También podés hacer click en el ícono del carrito (abajo a la derecha). Luego seleccioná «Ir a Pagar».',
  },
  {
    numero: 3,
    emoji: '💳',
    titulo: 'Ingresá tus datos y pagá',
    descripcion: 'Completá tus datos personales, de facturación y de envío. Luego elegí tu método de pago: 🏦 Transferencia bancaria (sin recargo) al alias ruby.mena.1972 · 💙 Mercado Pago con saldo en cuenta (sin recargo) · 💳 Mercado Pago con tarjeta de crédito (+10% de recargo automático).',
  },
  {
    numero: 4,
    emoji: '🚚',
    titulo: 'Confirmación y envío',
    descripcion: 'Al realizar el pedido verás el detalle y, si elegís transferencia, los datos bancarios para acreditar el pago. Una vez recibido el pago nos ponemos en contacto y procedemos con el envío.',
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
          background: rgba(240,240,240, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.18);
          border-radius: 12px;
        }

        .paso-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          color: #D4AF37;
          font-size: 22px;
          flex-shrink: 0;
          align-self: center;
        }

        @media (max-width: 768px) {
          .como-comprar-grid {
            flex-direction: column !important;
            gap: 0 !important;
            position: relative;
            padding-left: 32px;
          }

          .como-comprar-grid::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 24px;
            bottom: 24px;
            width: 2px;
            background: linear-gradient(to bottom, #D4AF37, rgba(212,175,55,0.2));
            border-radius: 2px;
          }

          .paso-card {
            flex-direction: row !important;
            text-align: left !important;
            align-items: flex-start !important;
            padding: 20px 16px !important;
            margin-bottom: 12px;
            border-radius: 10px;
          }

          .paso-card:last-child {
            margin-bottom: 0;
          }

          .paso-content {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .paso-arrow {
            display: none !important;
          }

          .paso-numero {
            margin-right: 16px !important;
            margin-bottom: 0 !important;
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
                backgroundColor: '#D4AF37',
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
                  {/* Emoji */}
                  <span
                    className="paso-emoji"
                    style={{
                      fontSize: '32px',
                      marginBottom: '16px',
                      lineHeight: 1,
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
                      backgroundColor: '#D4AF37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '16px',
                      color: '#C01515',
                      marginBottom: '16px',
                      flexShrink: 0,
                    }}
                  >
                    {paso.numero}
                  </div>

                  {/* Texto */}
                  <div className="paso-content" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#C01515',
                        marginBottom: '8px',
                        lineHeight: 1.3,
                      }}
                    >
                      {paso.titulo}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#000000',
                        lineHeight: 1.6,
                        margin: 0,
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
              href="/catalogo"
              style={{
                display: 'inline-block',
                backgroundColor: '#D4AF37',
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
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#F0C030';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#D4AF37';
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
