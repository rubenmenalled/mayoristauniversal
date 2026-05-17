'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'

const social = [
  { name: 'Instagram', emoji: '📸', href: '#' },
  { name: 'Facebook',  emoji: '👥', href: '#' },
  { name: 'LinkedIn',  emoji: '💼', href: '#' },
  { name: 'YouTube',   emoji: '▶️', href: '#' },
  { name: 'TikTok',    emoji: '🎵', href: '#' },
]

const payment = ['🏦 Transferencia', '📱 Mercado Pago']

export default function Footer() {
  return (
    <footer id="contacto" className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #030D1E 0%, #020810 100%)' }}>
      {/* Gold top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />


      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex flex-col leading-none mb-6">
              <span className="font-display font-black text-3xl gold-text">MAYORISTA</span>
              <span className="font-display font-black text-3xl text-white tracking-[0.2em]">UNIVERSAL</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Los mejores precios mayoristas en todos los rubros del mercado, en toda Argentina.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2"><Phone size={14} className="text-gold" /> +54 116 4660482</div>
              <div className="flex items-center gap-2"><Mail  size={14} className="text-gold" /> info@mayoristauniversal.com.ar</div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-gold" /> Buenos Aires, Argentina</div>
            </div>

            {/* Social */}
            <div className="flex gap-2 flex-wrap">
              {social.map(s => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  className="w-9 h-9 glass-card rounded-lg flex items-center justify-center text-sm hover:border-gold/40 transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  title={s.name}
                >
                  {s.emoji}
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Payment methods */}
      <div className="border-t border-gold/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Métodos de pago:</span>
            {payment.map(m => (
              <span key={m} className="glass-card text-gray-300 text-xs px-3 py-1.5 rounded-lg">{m}</span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-xs">🔒</span>
            <span className="text-gray-500 text-xs">Sitio 100% seguro · SSL Certificate</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Mayorista Universal. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold transition-colors">Términos y condiciones</a>
            <a href="#" className="hover:text-gold transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-gold transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
