'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'

const FOTOS: Record<string, string> = {
  BAZAR:        '/cat_bazar.jpg',
  BEBE:         'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  BEBES:        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  BELLEZA:      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
  BLANQUERIA:   '/cat_blanqueria.jpg',
  COTILLON:     'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
  ELECTRONICA:  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  FITNESS:      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  HERRAMIENTAS: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80',
  JUGUETERIA:   'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80',
  LIBRERIA:     'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  MARROQUINERIA:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  MASCOTAS:     'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&q=80',
  OPTICA:       'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
  PELUCHES:     '/cat_peluches.jpg',
  PERFUMERIA:   '/cat_perfumeria.jpg',
  RODADOS:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  HOGAR:        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  COCINA:       'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
  DEPORTES:     'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
  ROPA:         'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
  CALZADO:      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
}

interface Categoria {
  id: number
  nombre: string
  name?: string
  emoji: string
  image?: string
}

export default function CatalogoPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    fetch('/api/categorias')
      .then(r => r.json())
      .then(data => { setCategorias(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Eliminar duplicados (ej: BEBE y BEBES)
  const vistas = new Set<string>()
  const sinDuplicados = categorias.filter(c => {
    const key = (c.nombre || '').toUpperCase().replace(/S$/, '')
    if (vistas.has(key)) return false
    vistas.add(key)
    return true
  })

  const filtradas = sinDuplicados.filter(c =>
    (c.nombre || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)' }}>

      {/* Header */}
      <div style={{
        background: 'rgba(7,22,51,0.97)',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#D4AF37', fontWeight: 700, fontSize: 14,
            }}>
            <ArrowLeft size={16} /> Inicio
          </button>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 22, flex: 1 }}>
            📋 Todos los Catálogos
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>

        {/* Buscador */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: 12, padding: '10px 16px', marginBottom: 32,
        }}>
          <Search size={18} color="#D4AF37" />
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar catálogo..."
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: '#fff', fontSize: 15, flex: 1,
            }}
          />
        </div>

        {loading ? (
          <>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes shimmer {
                0%   { background-position: -800px 0; }
                100% { background-position:  800px 0; }
              }
            `}} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 'clamp(160px, 30vw, 220px)',
                    borderRadius: 12,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%)',
                    backgroundSize: '800px 100%',
                    animation: 'shimmer 1.6s infinite linear',
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </>
        ) : filtradas.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#7a8a9a', padding: 80, fontSize: 16 }}>
            No se encontraron catálogos
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {filtradas.map((c, i) => {
              const nombre = c.nombre || c.name || ''
              const foto = c.image || FOTOS[nombre.toUpperCase()] || FOTOS['BAZAR']
              return (
                <motion.div
                  key={c.id}
                  onClick={() => router.push(`/categorias/${encodeURIComponent(nombre)}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4 }}
                  style={{
                    position: 'relative', height: 220,
                    borderRadius: 12, overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto} alt={nombre}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.65) 100%)' }} />
                  <div style={{ position: 'absolute', top: 16, left: 16, color: '#fff', fontWeight: 900, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.06em', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {nombre}
                  </div>
                  <div style={{ position: 'absolute', bottom: 16, left: 16, color: '#D4AF37', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                    VER MÁS →
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
