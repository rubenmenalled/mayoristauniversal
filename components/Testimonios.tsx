'use client'

import { useState, useEffect, useCallback } from 'react'

const testimonios = [
  {
    nombre: 'María G.',
    ciudad: 'Rosario, Santa Fe',
    rubro: 'Bazar y hogar',
    texto: 'Compro hace 2 años y siempre llega todo perfecto. Los precios son los mejores que encontré en el mercado mayorista.',
    estrellas: 5,
  },
  {
    nombre: 'Carlos T.',
    ciudad: 'Córdoba Capital',
    rubro: 'Juguetería',
    texto: 'Excelente atención por WhatsApp, me ayudaron a armar el pedido y coordinaron el envío en tiempo récord.',
    estrellas: 5,
  },
  {
    nombre: 'Romina P.',
    ciudad: 'Mendoza',
    rubro: 'Perfumería y cosmética',
    texto: 'La variedad de productos es increíble. Encuentro todo en un solo lugar y los precios son muy convenientes.',
    estrellas: 5,
  },
  {
    nombre: 'Diego M.',
    ciudad: 'Mar del Plata, Bs. As.',
    rubro: 'Artículos de librería',
    texto: 'Muy recomendable para revendedores. El trato es muy profesional y los productos siempre de buena calidad.',
    estrellas: 5,
  },
  {
    nombre: 'Laura F.',
    ciudad: 'Tucumán',
    rubro: 'Blanquería y textiles',
    texto: 'Me sorprendió la rapidez del envío. Pedí un martes y el viernes ya tenía la mercadería en mi local.',
    estrellas: 5,
  },
  {
    nombre: 'Facundo R.',
    ciudad: 'Salta Capital',
    rubro: 'Electrónica y accesorios',
    texto: 'Trabajo con ellos desde el primer día y nunca me fallaron. Son serios y los precios no tienen competencia.',
    estrellas: 5,
  },
]

function getInitial(nombre: string): string {
  return nombre.charAt(0).toUpperCase()
}

export default function Testimonios() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const visibleCount = isDesktop ? 3 : 1
  const totalSlides = testimonios.length - visibleCount + 1

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return
      setTransitioning(true)
      setCurrentIndex(index)
      setTimeout(() => setTransitioning(false), 400)
    },
    [transitioning]
  )

  const next = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalSlides
    goTo(nextIndex)
  }, [currentIndex, totalSlides, goTo])

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  const visibleTestimonios = testimonios.slice(currentIndex, currentIndex + visibleCount)

  const sectionStyle: React.CSSProperties = {
    background: '#74ACDF',
    padding: '80px 20px',
    width: '100%',
    boxSizing: 'border-box',
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
  }

  const headingWrapStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '48px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(24px, 4vw, 36px)',
    fontWeight: 700,
    color: '#D4AF37',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#D4AF37',
    margin: 0,
    fontWeight: 500,
  }

  const sliderWrapStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    transition: 'opacity 0.4s ease',
    opacity: transitioning ? 0 : 1,
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    borderRadius: '16px',
    padding: '28px',
    flex: isDesktop ? '1 1 0' : '0 0 100%',
    maxWidth: isDesktop ? 'calc((100% - 48px) / 3)' : '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxSizing: 'border-box',
  }

  const avatarStyle: React.CSSProperties = {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #D4AF37, #F0C030)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 700,
    color: '#C01515',
    flexShrink: 0,
  }

  const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  }

  const nameStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '16px',
    margin: '0 0 2px 0',
  }

  const metaStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    margin: 0,
  }

  const starsStyle: React.CSSProperties = {
    fontSize: '18px',
    letterSpacing: '2px',
  }

  const quoteStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.82)',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: 0,
    fontStyle: 'italic',
  }

  const dotsWrapStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '36px',
  }

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headingWrapStyle}>
          <h2 style={titleStyle}>Lo que dicen nuestros clientes</h2>
          <p style={subtitleStyle}>Más de 1000 clientes confían en nosotros</p>
        </div>

        <div style={sliderWrapStyle}>
          {visibleTestimonios.map((t, i) => (
            <div key={currentIndex + i} style={cardStyle}>
              <div style={headerRowStyle}>
                <div style={avatarStyle}>{getInitial(t.nombre)}</div>
                <div>
                  <p style={nameStyle}>{t.nombre}</p>
                  <p style={metaStyle}>{t.ciudad} · {t.rubro}</p>
                </div>
              </div>
              <div style={starsStyle}>
                {'⭐'.repeat(t.estrellas)}
              </div>
              <p style={quoteStyle}>"{t.texto}"</p>
            </div>
          ))}
        </div>

        <div style={dotsWrapStyle}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir al testimonio ${i + 1}`}
              style={{
                width: i === currentIndex ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                background: i === currentIndex ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
