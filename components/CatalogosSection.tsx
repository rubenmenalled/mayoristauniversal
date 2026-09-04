'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { minDeCatalogo, catalogoDe, CATEGORIA_GRUPO_OVERRIDE } from '@/lib/minimos'

const WA = 'https://wa.me/5491164660482'

const TRANSPORTES = [
  { nombre: 'Correo Argentino', emoji: '📮', desc: 'Entrega en todo el país' },
  { nombre: 'OCA', emoji: '🚛', desc: 'Puerta a puerta en 24-72hs' },
  { nombre: 'Andreani', emoji: '📦', desc: 'Seguimiento online en tiempo real' },
  { nombre: 'Via Cargo', emoji: '🏎️', desc: 'Ideal para envíos al interior' },
  { nombre: 'Expreso Zapla', emoji: '🚚', desc: 'Norte y NOA' },
  { nombre: 'Retiro en depósito', emoji: '🏭', desc: 'Coordiná por WhatsApp' },
]

// Fotos de stock por categoría (Unsplash)
const FOTOS: Record<string, string> = {
  'ACCESORIOS DE INVIERNO': 'https://images.unsplash.com/photo-1544522857-b7288ac171dd?w=800&q=90',
  BAZAR:        '/cat_bazar.jpg',
  BEBÉ:         'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=90',
  BEBES:        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=90',
  'BLANQUERIA LICENCIAS Y MAS...':   'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/cat_blanqueria_licencias.jpg',
  ELECTRONICA:  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=90',
  'TODO PARA EL DEPORTE': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=90',
  JUGUETERIA:   'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=90',
  LIBRERIA:     'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=90',
  MASCOTAS:     'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=90',
  PELUCHES:            '/cat_peluches.jpg',
  'PELUCHES ENAMORADOS':   'https://images.unsplash.com/photo-1762542523027-e44a394788b6?w=800&q=90&auto=format&fit=crop',
  'LENCERIA':              'https://images.pexels.com/photos/6879815/pexels-photo-6879815.jpeg?w=800&h=600&fit=crop',
  'RODADOS':               'https://images.pexels.com/photos/9168370/pexels-photo-9168370.jpeg?w=800&h=600&fit=crop',
  'PRODUCTOS REGIONALES':  'https://images.unsplash.com/photo-1444157545135-c045be691b05?w=800&q=90&auto=format&fit=crop',
  'PERFUMERIA Y BELLEZA': '/cat_perfumeria.jpg',
  'BAZAR Y HOGAR': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=90',
  'ACCESORIOS PARA MASCOTAS': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=90',
  HOGAR:        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=90',
  COCINA:       'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=90',
  DEPORTES:     'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=90',
  ROPA:         'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=90',
  CALZADO:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90',
  BIJOUTERIE:   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=90',
  'ACCESORIOS DE PELO': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=90',
}

interface Categoria {
  id: number
  name: string
  image: string
  emoji: string
  count: number
}

const KEYFRAMES = `
@keyframes shimmer {
  0%   { background-position: -800px 0; }
  100% { background-position:  800px 0; }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cat-glow-wrap {
  transition: transform 0.25s ease !important;
  cursor: pointer;
}
.cat-glow-wrap:hover {
  transform: translateY(-4px);
}
.cat-thumb {
  transition: box-shadow 0.25s ease, border-color 0.25s ease !important;
}
.cat-glow-wrap:hover .cat-thumb {
  box-shadow: 0 2px 6px rgba(0,0,0,0.18), 0 16px 32px rgba(0,0,0,0.28) !important;
  border-color: rgba(255,106,61,0.55) !important;
}
`

function SkeletonGrid() {
  return (
    <section style={{ background: 'linear-gradient(180deg, #0B1E3F 0%, #13294f 100%)', padding: 'clamp(16px, 3vw, 32px) 16px' }}>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Título skeleton */}
        <div style={{
          height: 28, width: 260, borderRadius: 6, marginBottom: 28,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%)',
          backgroundSize: '800px 100%',
          animation: 'shimmer 1.6s infinite linear',
        }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
          gap: 18,
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div style={{
                aspectRatio: '1 / 1',
                borderRadius: 14,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%)',
                backgroundSize: '800px 100%',
                animation: 'shimmer 1.6s infinite linear',
                animationDelay: `${i * 0.08}s`,
              }} />
              <div style={{
                height: 12, width: '70%', marginTop: 10, borderRadius: 4,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%)',
                backgroundSize: '800px 100%',
                animation: 'shimmer 1.6s infinite linear',
                animationDelay: `${i * 0.08}s`,
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function CatalogosSection({ categorias }: { categorias?: Categoria[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  if (categorias === undefined) return null
  if (categorias.length === 0) return <SkeletonGrid />

  // Eliminar duplicados solo para BEBE/BEBES
  const vistas = new Set<string>()
  const unicas = categorias.filter(cat => {
    const nombre = cat.name.toUpperCase()
    const key = nombre === 'BEBES' ? 'BEBÉ' : nombre
    if (vistas.has(key)) return false
    vistas.add(key)
    return true
  })

  const PROXIMAMENTE = new Set(['RODADOS'])

  // Separamos las categorías que comparten mínimo (grupo) del resto,
  // preservando el orden relativo original en cada lado.
  let firstGrupoIdx = -1
  unicas.forEach((c, i) => {
    if (firstGrupoIdx === -1 && CATEGORIA_GRUPO_OVERRIDE[c.name.toUpperCase()]) firstGrupoIdx = i
  })
  const esGrupo = (c: Categoria) => !!CATEGORIA_GRUPO_OVERRIDE[c.name.toUpperCase()]
  const grupo = unicas.filter(esGrupo)
  const resto = unicas.filter(c => !esGrupo(c))

  const renderCard = (cat: Categoria, ocultarMinimo = false) => {
    const esProximamente = PROXIMAMENTE.has(cat.name.toUpperCase())
    const min = minDeCatalogo(catalogoDe(cat.name))
    return (
      <div
        key={cat.id}
        onClick={() => router.push(`/categorias/${encodeURIComponent(cat.name)}`)}
        className="cat-glow-wrap"
      >
        <div
          className="cat-thumb"
          style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            borderRadius: 14,
            overflow: 'hidden',
            background: '#F0F0F0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.20)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cat.image || FOTOS[cat.name.toUpperCase()] || FOTOS['BAZAR']}
            alt={cat.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {esProximamente && (
            <div style={{
              position: 'absolute', top: 8, left: 8, right: 8,
              display: 'flex', justifyContent: 'center',
            }}>
              <span style={{
                background: 'linear-gradient(90deg, #FF4E00, #FF8C00)',
                color: '#fff', fontWeight: 900, fontSize: 9.5,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: 20,
                boxShadow: '0 3px 10px rgba(255,78,0,0.5)', whiteSpace: 'nowrap',
              }}>
                🔜 Próximamente
              </span>
            </div>
          )}
        </div>

        <div style={{ padding: '10px 2px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#FFFFFF', fontWeight: 800, fontSize: 13,
            lineHeight: 1.3,
          }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>{cat.emoji}</span>
            <span>{cat.name}</span>
          </div>

          {cat.count >= 10 && (
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
              {cat.count.toLocaleString('es-AR')} artículos
            </div>
          )}

          {ocultarMinimo ? (
            <div style={{
              color: '#FFD13C', fontWeight: 900, fontSize: 9.5,
              letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4,
            }}>
              Catálogo combinable
            </div>
          ) : min > 0 && (
            <div style={{ color: '#FFD13C', fontWeight: 800, fontSize: 11.5, marginTop: 4 }}>
              Mín. ${min.toLocaleString('es-AR')}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
    <section id="catalogos" style={{ background: 'linear-gradient(180deg, #0B1E3F 0%, #13294f 100%)', padding: '4px clamp(16px, 2.5vw, 40px) 24px' }}>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div style={{ maxWidth: 2200, margin: '0 auto' }}>

        {/* Barra envíos — fondo blanco */}
        <style dangerouslySetInnerHTML={{ __html: `
          .envios-hide-mobile { display: inline; }
          .envios-mp { display: flex; }
          @media (max-width: 520px) {
            .envios-hide-mobile { display: none; }
            .envios-mp { display: none; }
          }
        `}} />
        <div
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(4px, 2vw, 10px)',
            padding: '6px 10px', marginBottom: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.97)',
            borderRadius: 8,
            border: '1px solid rgba(255,106,61,0.2)',
            overflow: 'hidden',
          }}
        >
          <span style={{ color: '#0B1E3F', fontWeight: 900, fontSize: 'clamp(10px,2.5vw,13px)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            IMPORTADOR DIRECTO
          </span>
          <div style={{ width: 1, height: 14, background: 'rgba(0,0,0,0.15)', flexShrink: 0 }} />
          <span style={{ fontSize: 'clamp(14px,3.5vw,18px)', flexShrink: 0 }}>🚚</span>
          <span style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 'clamp(10px,2.5vw,13px)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            ENVÍOS A TODO EL PAÍS
          </span>
          <span className="envios-hide-mobile" style={{ color: '#7a8a9a', fontSize: 10, whiteSpace: 'nowrap' }}>· Tocá aquí</span>
          <span style={{ fontSize: 'clamp(12px,3vw,16px)', flexShrink: 0 }}>🇦🇷</span>
          <div className="envios-mp" style={{ alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.12)' }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mp-logo.png" alt="Mercado Pago" style={{ height: 16, objectFit: 'contain', display: 'block', marginLeft: 4 }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '2px solid rgba(255,106,61,0.3)', paddingBottom: 12 }}>
          <h2 style={{
            color: '#FF6A3D', fontWeight: 900, fontSize: 'clamp(20px, 2.5vw, 28px)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            margin: 0,
          }}>
            📋 Nuestros Catálogos
          </h2>
          <a href="/como-comprar" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)',
            color: '#FFFFFF', fontWeight: 900,
            fontSize: 'clamp(10px,1.4vw,12px)',
            padding: '7px 14px', borderRadius: 8,
            textDecoration: 'none', whiteSpace: 'nowrap',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            ❓ Cómo Comprar
          </a>
        </div>

        {/* Caja de categorías combinables — comparten el mínimo entre todas */}
        {grupo.length > 0 && (
          <div style={{
            marginBottom: 22,
            borderRadius: 16,
            border: '2px solid rgba(255,209,60,0.5)',
            background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
            padding: 'clamp(14px, 2vw, 20px)',
          }}>
            <div className="cat-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
              gap: 18,
            }}>
              {grupo.map(cat => renderCard(cat, true))}
            </div>
          </div>
        )}

        <div className="cat-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
          gap: 18,
        }}>
          {resto.map(cat => renderCard(cat))}
        </div>
      </div>
    </section>

    {/* Modal de envíos */}
    {modalOpen && (
      <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)', border: '1px solid rgba(255,106,61,0.35)', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ color: '#FF6A3D', fontWeight: 900, fontSize: 20 }}>🚚 ENVÍOS A TODO EL PAÍS</div>
              <div style={{ color: '#7a8a9a', fontSize: 13, marginTop: 4 }}>Trabajamos con los principales transportes</div>
            </div>
            <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(0,0,0,0.08)', border: 'none', color: '#333', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
          <div style={{ background: 'rgba(255,106,61,0.08)', border: '1px solid rgba(255,106,61,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ color: '#FF6A3D', fontWeight: 800, fontSize: 13, marginBottom: 8 }}>¿Cómo funciona?</div>
            <div style={{ color: '#555', fontSize: 13, lineHeight: 1.7 }}>
              1️⃣ Hacé tu pedido desde el catálogo<br />
              2️⃣ Te contactamos por WhatsApp para coordinar pago y envío<br />
              3️⃣ Elegís el transporte de tu preferencia<br />
              4️⃣ Tu pedido llega a cualquier provincia 🇦🇷
            </div>
          </div>
          <div style={{ background: 'rgba(0,158,227,0.08)', border: '1px solid rgba(0,158,227,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⏱️</span>
            <span style={{ color: '#555', fontSize: 13, lineHeight: 1.5 }}>
              <strong style={{ color: '#333' }}>Demoras de entrega:</strong> pueden tardar de <strong style={{ color: '#C01515' }}>1 a 7 días hábiles</strong> aproximadamente.
            </span>
          </div>
          <div style={{ color: '#333', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', marginBottom: 12 }}>TRANSPORTES DISPONIBLES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {TRANSPORTES.map(t => (
              <div key={t.nombre} style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(255,106,61,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{t.emoji}</div>
                <div style={{ color: '#333', fontWeight: 800, fontSize: 13 }}>{t.nombre}</div>
                <div style={{ color: '#7a8a9a', fontSize: 11, marginTop: 3 }}>{t.desc}</div>
              </div>
            ))}
          </div>
          <a href={`${WA}?text=${encodeURIComponent('¡Hola! Quiero consultar sobre opciones de envío y transporte.')}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg,#16a34a,#15803d)', borderRadius: 14, padding: 16, width: '100%', color: '#FFFFFF', fontWeight: 900, fontSize: 16, textDecoration: 'none', boxShadow: '0 4px 20px rgba(22,163,74,0.4)' }}>
            <span style={{ fontSize: 22 }}>💬</span> Consultar por WhatsApp
          </a>
          <div style={{ color: '#7a8a9a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>Respondemos en el momento · Lun a Sab 9 a 18hs</div>
        </div>
      </div>
    )}
    </>
  )
}
