'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section id="inicio" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* ── IMAGEN HERO COMPLETA ── */}
      {/* Desktop */}
      <a href="/catalogo" className="hidden md:block" style={{ position: 'relative', cursor: 'pointer', width: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/portada_desktop.png"
          alt="Mayorista Universal - Multirubros Mayoristas"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
          color: '#030D1E', fontWeight: 900, fontSize: 15,
          padding: '12px 32px', borderRadius: 12,
          boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
          whiteSpace: 'nowrap',
        }}>
          📋 VER TODOS LOS CATÁLOGOS
        </div>
      </a>

      {/* Mobile: imagen vertical completa (imagen original portrait) */}
      <a href="/catalogo" className="block md:hidden" style={{ cursor: 'pointer', position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/portada_backup.jpeg"
          alt="Mayorista Universal - Multirubros Mayoristas"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
          color: '#030D1E', fontWeight: 900, fontSize: 13,
          padding: '10px 24px', borderRadius: 10,
          boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
          whiteSpace: 'nowrap',
        }}>
          📋 VER TODOS LOS CATÁLOGOS
        </div>
      </a>


      {/* ── ENVÍOS ── */}
      <div style={{
        background: 'rgba(2,8,24,0.98)',
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
  )
}
