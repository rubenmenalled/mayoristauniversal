'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Tag, Zap, Lock, MessageCircle, Package, Sparkles, ShieldCheck } from 'lucide-react'

const CANAL = 'https://whatsapp.com/channel/0029Vb7ugE42ER6gCX7OAr0T'

const BENEFICIOS = [
  { icon: Bell, titulo: 'Nuevos productos', sub: 'cada semana, primero vos' },
  { icon: Tag, titulo: 'Ofertas exclusivas', sub: 'solo para el canal' },
  { icon: Zap, titulo: 'Novedades al instante', sub: 'para que no te pierdas nada' },
]

export default function WhatsAppChannelPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
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
          onClick={close}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{ position: 'relative', width: 'min(92vw, 390px)', maxHeight: '90vh', overflowY: 'auto', background: 'linear-gradient(160deg,#0D2C54,#0B1E3F)', borderRadius: 20, padding: '26px 22px 20px', boxShadow: '0 24px 70px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <button onClick={close} aria-label="Cerrar"
              style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} color="#FFFFFF" />
            </button>

            {/* Marca */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <span style={{ color: '#FF7A3D', fontWeight: 900, fontSize: 15, letterSpacing: '0.06em' }}>MAYORISTA</span>
              <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15, letterSpacing: '0.06em' }}> UNIVERSAL</span>
            </div>

            {/* Título */}
            <h2 style={{ textAlign: 'center', color: '#FFFFFF', fontWeight: 900, fontSize: 26, lineHeight: 1.1, margin: '0 0 4px' }}>
              SUMATE A NUESTRO
            </h2>
            <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: 26, lineHeight: 1.1, margin: '0 0 16px' }}>
              <span style={{ color: '#FFFFFF' }}>CANAL DE </span><span style={{ color: '#25D366' }}>WHATSAPP</span>
            </h2>

            {/* Beneficios */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 14px', marginBottom: 16 }}>
              {BENEFICIOS.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0' }}>
                  <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#FF7A3D,#E0521F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <b.icon size={18} color="#FFFFFF" />
                  </span>
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 14, lineHeight: 1.15 }}>{b.titulo}</div>
                    <div style={{ color: '#AFC0DA', fontSize: 12 }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a href={CANAL} target="_blank" rel="noopener noreferrer" onClick={close}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', boxSizing: 'border-box', padding: '15px', borderRadius: 14, background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#FFFFFF', fontWeight: 900, fontSize: 17, textDecoration: 'none', boxShadow: '0 6px 20px rgba(37,211,102,0.45)' }}>
              <MessageCircle size={22} /> UNIRME AL CANAL
            </a>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, color: '#AFC0DA', fontSize: 12 }}>
              <Lock size={13} /> Canal exclusivo de WhatsApp
            </div>

            {/* Pie de features */}
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
              {[{ icon: Package, t: 'Venta mayorista' }, { icon: Sparkles, t: 'Novedades' }, { icon: ShieldCheck, t: 'Confianza' }].map((f, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#AFC0DA', fontSize: 10.5, textAlign: 'center' }}>
                  <f.icon size={17} color="#FF7A3D" /> {f.t}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
