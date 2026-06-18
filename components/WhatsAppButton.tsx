'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Número y mensaje pre-armado (enfocado a compra mayorista)
const WA_NUMERO = '5491164660482'
const WA_MENSAJE =
  '¡Hola Mayorista Universal! 👋 Tengo una consulta, ¿me pueden ayudar?'
const WA_LINK = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(WA_MENSAJE)}`

// Logo oficial de WhatsApp
function WhatsAppLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  )
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)
  const [showLabel, setShowLabel] = useState(false)

  // Llamá la atención: mostrá la etiqueta a los 3s (una vez)
  useEffect(() => {
    const t = setTimeout(() => setShowLabel(true), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup card */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="glass-card rounded-2xl p-5 w-72 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(245,197,24,0.1)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <WhatsAppLogo size={22} />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Mayorista Universal</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs">En línea — respondemos al instante</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="bg-navy-light rounded-2xl rounded-tl-none p-3 mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                👋 ¡Hola! ¿Tenés alguna duda con un producto o tu pedido? Escribinos y te ayudamos al instante.
              </p>
            </div>

            <motion.a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold text-sm w-full transition-colors"
              whileTap={{ scale: 0.97 }}
            >
              <WhatsAppLogo size={18} />
              Consultanos por WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón + etiqueta */}
      <div className="flex items-center gap-2">
        {/* Etiqueta visible (llama la atención) */}
        <AnimatePresence>
          {!open && showLabel && (
            <motion.a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden sm:flex items-center bg-white text-green-700 font-bold text-sm px-4 py-2.5 rounded-full shadow-xl whitespace-nowrap"
              style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
            >
              ¿Dudas? Consultanos
            </motion.a>
          )}
        </AnimatePresence>

        {/* Botón principal (FAB) */}
        <motion.button
          onClick={() => setOpen(v => !v)}
          aria-label="Abrir WhatsApp"
          className="relative w-16 h-16 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ boxShadow: '0 0 30px rgba(34,197,94,0.6), 0 8px 25px rgba(0,0,0,0.3)' }}
          animate={open ? {} : { scale: [1, 1.08, 1] }}
          transition={open ? {} : { duration: 2.2, repeat: Infinity, repeatDelay: 3 }}
        >
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X size={26} className="text-white" />
                </motion.div>
              : <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <WhatsAppLogo size={32} />
                </motion.div>
            }
          </AnimatePresence>
          {!open && <span className="absolute inset-0 rounded-full animate-ping bg-green-500 opacity-30" />}
        </motion.button>
      </div>
    </div>
  )
}
