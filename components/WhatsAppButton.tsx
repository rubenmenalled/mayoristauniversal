'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)

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
            style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.1)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Mayorista Universal</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs">En línea ahora</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Message bubble */}
            <div className="bg-navy-light rounded-2xl rounded-tl-none p-3 mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                👋 ¡Hola! ¿En qué podemos ayudarte? Escribinos por WhatsApp y te respondemos al instante.
              </p>
            </div>

            {/* CTA */}
            <motion.a
              href="https://wa.me/5491164660482?text=Hola!%20Me%20interesa%20conocer%20m%C3%A1s%20sobre%20Mayorista%20Universal."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm w-full transition-colors"
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} />
              Chatear por WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="relative w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ boxShadow: '0 0 30px rgba(34,197,94,0.5), 0 8px 25px rgba(0,0,0,0.3)' }}
        animate={open ? {} : { scale: [1, 1.1, 1] }}
        transition={open ? {} : { duration: 2, repeat: Infinity, delay: 5 }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={22} className="text-white" />
              </motion.div>
            : <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle size={24} className="text-white" />
              </motion.div>
          }
        </AnimatePresence>

        {/* Ping ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-green-500 opacity-30" />
        )}
      </motion.button>
    </div>
  )
}
