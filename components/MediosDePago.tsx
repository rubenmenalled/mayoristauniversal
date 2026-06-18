'use client';

import { useState, useEffect } from 'react';

const medios = [
  {
    icono: '🏦',
    titulo: 'Transferencia Bancaria',
    desc: 'CBU / Alias disponible al confirmar el pedido',
    badge: '',
    href: null,
  },
  {
    icono: '💙',
    titulo: 'Mercado Pago',
    desc: 'Link de pago o QR. Aceptamos todas las tarjetas',
    badge: '',
    href: null,
  },
  {
    icono: '💵',
    titulo: 'Efectivo',
    desc: 'Solo para retiro en depósito con coordinación previa',
    badge: 'Retiro',
    href: null,
  },
  {
    icono: '📱',
    titulo: 'Consultá otros métodos',
    desc: 'Escribinos por WhatsApp para más opciones de pago',
    badge: 'WhatsApp',
    href: 'https://wa.me/5491164660482',
  },
];

function getBadgeStyle(badge: string): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    marginTop: '10px',
  };
  if (badge === 'Sin recargo') {
    return { ...base, background: '#14532d', color: '#4ade80', border: '1px solid #16a34a' };
  }
  return { ...base, background: '#1a1200', color: '#FF6A3D', border: '1px solid #FF6A3D' };
}

export default function MediosDePago() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const sectionStyle: React.CSSProperties = {
    background: '#FFFFFF',
    padding: '72px 24px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '26px' : '34px',
    fontWeight: 800,
    color: '#FF6A3D',
    textAlign: 'center',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#8899aa',
    textAlign: 'center',
    marginBottom: '48px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '36px',
  };

  const getCardStyle = (index: number): React.CSSProperties => ({
    background: hovered === index
      ? 'rgba(255,106,61, 0.08)'
      : 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${hovered === index ? 'rgba(255,106,61, 0.55)' : 'rgba(255,106,61, 0.18)'}`,
    borderRadius: '14px',
    padding: '24px 18px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    transition: 'all 0.22s ease',
    cursor: medios[index].href ? 'pointer' : 'default',
    textDecoration: 'none',
    boxShadow: hovered === index
      ? '0 4px 24px rgba(255,106,61, 0.12)'
      : 'none',
  });

  const iconStyle: React.CSSProperties = {
    fontSize: '30px',
    marginBottom: '12px',
    lineHeight: 1,
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 700,
    color: '#C01515',
    marginBottom: '6px',
    lineHeight: 1.3,
  };

  const cardDescStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#3A4A6A',
    lineHeight: 1.5,
    flexGrow: 1,
  };

  const footerTextStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '12px',
    color: '#3A4A6A',
    marginTop: '8px',
    lineHeight: 1.6,
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>💳 Medios de Pago</h2>
        <p style={subtitleStyle}>Opciones flexibles para tu comodidad</p>

        <div style={gridStyle}>
          {medios.map((medio, i) => {
            const cardContent = (
              <>
                <span style={iconStyle}>{medio.icono}</span>
                <span style={cardTitleStyle}>{medio.titulo}</span>
                <span style={cardDescStyle}>{medio.desc}</span>
                {medio.badge && <span style={getBadgeStyle(medio.badge)}>{medio.badge}</span>}
              </>
            );

            if (medio.href) {
              return (
                <a
                  key={i}
                  href={medio.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={getCardStyle(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div
                key={i}
                style={getCardStyle(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {cardContent}
              </div>
            );
          })}
        </div>

        <p style={footerTextStyle}>
          Los precios no incluyen IVA. Se agrega según condición impositiva al momento de facturar.
        </p>
      </div>
    </section>
  );
}
