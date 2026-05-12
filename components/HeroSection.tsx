'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="inicio" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* ── IMAGEN HERO COMPLETA ── */}
      {/* Desktop */}
      <div className="hidden md:block" style={{ position: 'relative', width: '100%', aspectRatio: '4/3', maxHeight: '90vh' }}>
        <Image
          src="/hero_nuevo.png"
          alt="Mayorista Universal - Multirubros Mayoristas"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 22%' }}
          priority
        />
      </div>

      {/* Mobile: imagen vertical con recorte CSS en la base */}
      <div className="block md:hidden" style={{ width: '100%', overflow: 'hidden', maxHeight: '85vw', lineHeight: 0 }}>
        <Image
          src="/hero_mobile_v2.png"
          alt="Mayorista Universal - Multirubros Mayoristas"
          width={426}
          height={460}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          priority
        />
      </div>

      {/* ── CTA ── */}
      <motion.div
        style={{
          background: 'rgba(3,10,28,0.97)',
          padding: 'clamp(20px,3vw,40px) 16px',
          textAlign: 'center',
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button className="btn-gold"
            style={{ display: 'flex', alignItems: 'center', gap: 8,
              padding: 'clamp(10px,1.2vw,14px) clamp(20px,2.5vw,32px)',
              borderRadius: 12, fontWeight: 900, fontSize: 'clamp(13px,1.1vw,16px)' }}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
            EXPLORAR PRODUCTOS <ArrowRight size={15} />
          </motion.button>
          <motion.button className="btn-outline-gold"
            style={{ display: 'flex', alignItems: 'center', gap: 8,
              padding: 'clamp(10px,1.2vw,14px) clamp(20px,2.5vw,32px)',
              borderRadius: 12, fontWeight: 900, fontSize: 'clamp(13px,1.1vw,16px)' }}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
            QUIERO VENDER <ArrowRight size={15} />
          </motion.button>
        </div>
      </motion.div>

      {/* ── ESTADÍSTICAS ── */}
      <div style={{
        background: 'rgba(2,8,24,0.98)',
        borderTop: '1px solid rgba(212,175,55,0.24)',
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[
            { e: '📦', n: '+25.000', l: 'Productos'   },
            { e: '🏭', n: '+8.000',  l: 'Proveedores' },
            { e: '👥', n: '+100k',   l: 'Compradores' },
            { e: '🗺️', n: '24',      l: 'Provincias'  },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: 'clamp(12px,2vw,20px) 8px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.e}</div>
              <div style={{ color: '#D4AF37', fontWeight: 900, fontSize: 'clamp(16px,1.5vw,22px)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ color: '#7a8a9a', fontSize: 11, marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
