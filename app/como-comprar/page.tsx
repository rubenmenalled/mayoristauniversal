'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function ComoComprarPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(7,22,51,0.97)', borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#D4AF37', fontWeight: 700, fontSize: 13,
            }}>
            <ArrowLeft size={16} /> Inicio
          </button>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>¿Cómo Comprar?</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 36 }}>
          <h1 style={{ color: '#D4AF37', fontWeight: 900, fontSize: 28, marginBottom: 32, textAlign: 'center' }}>
            ¿Cómo comprar en Mayorista Universal?
          </h1>

          {/* Paso 1 */}
          <p style={{ color: '#e5e7eb', fontSize: 18, lineHeight: 1.7, marginBottom: 24 }}>
            Explorá nuestro amplio{' '}
            <a href="/catalogo"
              style={{ color: '#D4AF37', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
              catálogo de productos
            </a>
            , donde podrás buscar por categorías.
          </p>

          {/* Paso 2 */}
          <p style={{ color: '#e5e7eb', fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
            Luego, elegí el artículo de tu preferencia y hacé click en el botón{' '}
            <strong style={{ color: '#fff' }}>Añadir al carrito</strong>.
          </p>

        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => router.push('/catalogo')}
            style={{
              background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
              border: 'none', borderRadius: 12, padding: '14px 36px',
              color: '#030D1E', fontWeight: 900, fontSize: 15, cursor: 'pointer',
            }}>
            VER CATÁLOGO
          </button>
        </motion.div>
      </div>
    </div>
  )
}
