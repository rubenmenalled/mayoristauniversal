'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, ShoppingCart, DollarSign } from 'lucide-react'

const pasos = [
  {
    icon: <Search size={28} color="#030D1E" />,
    numero: '01',
    titulo: 'Explorá el catálogo',
    texto: 'Explorá nuestro amplio catálogo de productos, donde podrás buscar por categorías.',
  },
  {
    icon: <ShoppingCart size={28} color="#030D1E" />,
    numero: '02',
    titulo: 'Elegí tu producto',
    texto: 'Elegí el artículo de tu preferencia y hacé click en el botón Añadir al carrito.',
  },
  {
    icon: <DollarSign size={28} color="#030D1E" />,
    numero: '03',
    titulo: 'Compra mínima',
    texto: 'Recordá que el mínimo de compra en nuestro sitio es de $150.000 pesos.',
  },
]

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
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
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
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ color: '#D4AF37', fontWeight: 900, fontSize: 32, marginBottom: 12 }}>
            ¿Cómo comprar en Mayorista Universal?
          </h1>
          <p style={{ color: '#7a8a9a', fontSize: 15 }}>
            Seguí estos simples pasos para realizar tu compra mayorista
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {pasos.map((paso, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: 20, padding: 32, textAlign: 'center',
              }}>
              <div style={{
                width: 64, height: 64,
                background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
                borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 24px rgba(212,175,55,0.3)',
              }}>
                {paso.icon}
              </div>
              <div style={{ color: 'rgba(212,175,55,0.4)', fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
                PASO {paso.numero}
              </div>
              <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 18, marginBottom: 12 }}>
                {paso.titulo}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6 }}>
                {paso.texto}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: 48 }}>
          <button onClick={() => router.push('/')}
            style={{
              background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
              border: 'none', borderRadius: 12, padding: '14px 36px',
              color: '#030D1E', fontWeight: 900, fontSize: 15, cursor: 'pointer',
            }}>
            VER PRODUCTOS
          </button>
        </motion.div>
      </div>
    </div>
  )
}
