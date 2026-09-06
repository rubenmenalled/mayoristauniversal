'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const IMG = 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/promos/dia-del-nino.jpg'

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
    try { window.dispatchEvent(new Event('welcome-closed')) } catch {}
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: -8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{
            position: 'fixed',
            bottom: 130,
            left: 24,
            zIndex: 9000,
            width: 'min(88vw, 260px)',
            background: 'linear-gradient(160deg,#1E7AB6,#2698E4)',
            borderRadius: 16,
            padding: 10,
            boxShadow: '0 12px 34px rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <button onClick={close} aria-label="Cerrar"
            style={{ position: 'absolute', top: -8, right: -8, zIndex: 2, background: '#fff', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="#0D2C54" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG} alt="Promo Día del Niño - Mayorista Universal"
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 10 }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
