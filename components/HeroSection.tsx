'use client'

export default function HeroSection() {
  return (
    <>
      <style>{`
        #hero-section {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        /* Mobile: espacio para AnnouncementBar (38px) + Header (~54px) */
        @media (max-width: 767px) {
          #hero-section { padding-top: 92px; }
          #hero-banner { height: 56vw; overflow: hidden; }
          #hero-banner img { width: 100%; height: 100%; object-fit: cover; object-position: center center; display: block; }
        }
        /* Desktop: imagen full-bleed, header flota encima */
        @media (min-width: 768px) {
          #hero-section { padding-top: 0; }
          #hero-banner { width: 100%; }
          #hero-banner img { width: 100%; height: auto; display: block; }
        }
      `}</style>

      <section id="hero-section">
        <a id="hero-banner" href="/catalogo" style={{ position: 'relative', cursor: 'pointer', display: 'block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portada_desktop.png"
            alt="Mayorista Universal - Multirubros Mayoristas"
          />
          <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
            color: '#F0EBE0', fontWeight: 900,
            fontSize: 'clamp(12px,2vw,15px)',
            padding: 'clamp(8px,1.5vw,12px) clamp(18px,3vw,32px)',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
            whiteSpace: 'nowrap',
          }}>
            📋 VER TODOS LOS CATÁLOGOS
          </div>
        </a>

        {/* Envíos */}
        <div style={{
          background: 'rgba(240,235,224,0.98)',
          borderTop: '1px solid rgba(212,175,55,0.24)',
          padding: 'clamp(12px,2vw,20px) 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <span style={{ fontSize: 36 }}>🚚</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 'clamp(16px,1.8vw,24px)', lineHeight: 1, letterSpacing: '0.05em' }}>
              ENVÍOS A TODO EL PAÍS
            </span>
            <span style={{ color: '#7a8a9a', fontSize: 12, marginTop: 3 }}>Comprá desde cualquier provincia de Argentina</span>
          </div>
          <span style={{ fontSize: 28, marginLeft: 8 }}>🇦🇷</span>
        </div>
      </section>
    </>
  )
}
