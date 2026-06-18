'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const IMG = 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/promos/dia-del-nino.jpg'
const WA = 'https://wa.me/5491164660482?text=' + encodeURIComponent('¡Hola! Quiero aprovechar la promo Día del Niño y armar mi negocio. ¿Me pasás info?')

export default function WelcomePopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try { if (sessionStorage.getItem('promo_dn_seen')) return } catch {}
    const t = setTimeout(() => setOpen(true), 800)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setOpen(false)
    try { sessionStorage.setItem('promo_dn_seen', '1') } catch {}
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={close}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{ position: 'relative', maxWidth: 'min(92vw, 440px)', maxHeight: '90vh' }}
          >
            <button onClick={close} aria-label="Cerrar"
              style={{ position: 'absolute', top: -14, right: -14, zIndex: 2, background: '#fff', border: 'none', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} color="#0D2C54" />
            </button>
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG} alt="Promo Día del Niño - Mayorista Universal"
                style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.55)' }} />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
