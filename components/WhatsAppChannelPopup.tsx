'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'

const CANAL = 'https://whatsapp.com/channel/0029Vb7ugE42ER6gCX7OAr0T'

export default function WhatsAppChannelPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth <= 768) return
    try { if (sessionStorage.getItem('wa_channel_seen')) return } catch {}
    let shown = false
    const show = () => { if (shown) return; shown = true; setTimeout(() => setOpen(true), 400) }
    // Si el primer popup ya se cerró (o no está pendiente), mostrar; si no, esperar a que se cierre.
    try { if (sessionStorage.getItem('promo_dn_seen')) show() } catch { show() }
    const onClosed = () => show()
    window.addEventListener('welcome-closed', onClosed)
    const fallback = setTimeout(show, 6000) // por si el primer popup no aparece
    return () => { window.removeEventListener('welcome-closed', onClosed); clearTimeout(fallback) }
  }, [])

  const close = () => {
    setOpen(false)
    try { sessionStorage.setItem('wa_channel_seen', '1') } catch {}
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
            bottom: 24,
            left: 24,
            zIndex: 9000,
            width: 'min(88vw, 300px)',
            background: 'linear-gradient(160deg,#1E7AB6,#2698E4)',
            borderRadius: 16,
            padding: '14px 14px 14px 16px',
            boxShadow: '0 12px 34px rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#25D366,#128C7E)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
            <MessageCircle size={17} color="#FFFFFF" />
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 13, lineHeight: 1.25, marginBottom: 2 }}>
              Sumate a nuestro canal de WhatsApp
            </div>
            <div style={{ color: '#AFC0DA', fontSize: 11.5, lineHeight: 1.3, marginBottom: 8 }}>
              Ofertas y productos nuevos, primero ahí.
            </div>
            <a href={CANAL} target="_blank" rel="noopener noreferrer" onClick={close}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#FFFFFF', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}>
              Unirme <MessageCircle size={13} />
            </a>
          </div>

          <button onClick={close} aria-label="Cerrar"
            style={{ flexShrink: 0, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
            <X size={12} color="#FFFFFF" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
