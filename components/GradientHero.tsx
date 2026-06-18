'use client'

import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'

export default function GradientHero() {
  return (
    <section style={{ width: '100%' }}>
      <style>{`
        #grad-hero { padding-top: 200px; }
        #grad-hero-band { height: 460px; }
        @media (max-width: 767px) {
          #grad-hero { padding-top: 250px; }
          #grad-hero-band { height: 380px; }
        }
      `}</style>
      <div id="grad-hero">
        <div id="grad-hero-band" style={{ position: 'relative', width: '100%' }}>
          <BackgroundGradientAnimation>
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-4">
              <h1 style={{
                color: '#FFFFFF', fontWeight: 900, lineHeight: 1.05, margin: 0,
                fontSize: 'clamp(34px, 6vw, 68px)', letterSpacing: '-0.02em',
                textShadow: '0 4px 30px rgba(0,0,0,0.45)',
              }}>
                MAYORISTA UNIVERSAL
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.92)', margin: '14px 0 0', fontWeight: 600,
                fontSize: 'clamp(15px, 2.4vw, 22px)', textShadow: '0 2px 16px rgba(0,0,0,0.4)',
              }}>
                Precios mayoristas · Envíos a todo el país
              </p>
              <a href="/catalogo" style={{
                marginTop: 26, background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)',
                color: '#FFFFFF', fontWeight: 900, fontSize: 16, textDecoration: 'none',
                padding: '13px 30px', borderRadius: 12, boxShadow: '0 8px 24px rgba(255,106,61,0.45)',
              }}>
                Ver catálogo
              </a>
            </div>
          </BackgroundGradientAnimation>
        </div>
      </div>
    </section>
  )
}
