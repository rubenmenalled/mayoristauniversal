'use client';

const messages = [
  '🚚 Envíos a todo el país',
  '📦 Más de 20 categorías disponibles',
  '💙 Pagá con Mercado Pago',
  '💬 Atención personalizada por WhatsApp',
  '🏷️ Precios mayoristas',
  '🇦🇷 Comprá desde cualquier provincia',
  '⚡ Nuevos productos cada semana',
];

const separator = '   ·   ';

const tickerContent = messages.join(separator) + separator;

export default function AnnouncementBar() {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return null
  return (
    <div
      style={{
        width: '100%',
        height: '38px',
        backgroundColor: '#D4AF37',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        flexShrink: 0,
      }}
    >
      <style>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .announcement-track {
          display: flex;
          white-space: nowrap;
          animation: ticker-scroll 28s linear infinite;
          will-change: transform;
        }

        .announcement-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="announcement-track">
        {/* Content duplicated for seamless loop */}
        <span
          style={{
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.02em',
            paddingRight: '0',
          }}
        >
          {tickerContent}
          {tickerContent}
        </span>
      </div>
    </div>
  );
}
