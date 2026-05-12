'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Send } from 'lucide-react'
import { useState } from 'react'

const links = {
  'Marketplace': ['Todos los rubros', 'Ofertas del día', 'Proveedores destacados', 'Nuevos productos', 'Más vendidos'],
  'Para Compradores': ['Cómo comprar', 'Mínimos de compra', 'Formas de pago', 'Envíos y logística', 'Protección al comprador'],
  'Para Proveedores': ['Publicar productos', 'Planes y precios', 'Cómo funciona', 'Centro de vendedores', 'Estadísticas'],
  'Información': ['Sobre nosotros', 'Contacto', 'Trabaja con nosotros', 'Blog mayorista', 'Prensa'],
}

const social = [
  { name: 'Instagram', emoji: '📸', href: '#' },
  { name: 'Facebook',  emoji: '👥', href: '#' },
  { name: 'LinkedIn',  emoji: '💼', href: '#' },
  { name: 'YouTube',   emoji: '▶️', href: '#' },
  { name: 'TikTok',    emoji: '🎵', href: '#' },
]

const payment = ['💳 Tarjetas', '🏦 Transferencia', '📱 Mercado Pago', '💵 Efectivo', '📄 Cheque']

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <footer id="contacto" className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #030D1E 0%, #020810 100%)' }}>
      {/* Gold top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Newsletter banner */}
      <div className="py-12 px-4 border-b border-gold/10"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.02) 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-display font-black text-2xl md:text-3xl text-white mb-2">
            Recibí las mejores <span className="gold-text">ofertas mayoristas</span>
          </h3>
          <p className="text-gray-400 mb-6">Suscribite y accedé a descuentos exclusivos y nuevos proveedores cada semana.</p>
          <form onSubmit={handleNewsletter} className="flex max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 bg-navy-light border border-gold/30 focus:border-gold/60 text-white placeholder-gray-500 rounded-l-full px-5 py-3 outline-none text-sm transition-colors"
            />
            <motion.button
              type="submit"
              className="btn-gold px-6 py-3 rounded-r-full flex items-center gap-2 text-sm font-bold flex-shrink-0"
              whileTap={{ scale: 0.97 }}
            >
              {submitted ? '✅ Listo!' : <><Send size={14} /> Suscribirse</>}
            </motion.button>
          </form>
        </div>
      </div>

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
              El marketplace mayorista más grande de Argentina, con los mejores precios en todos los rubros del mercado.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2"><Phone size={14} className="text-gold" /> +54 11 5555-0000</div>
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

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
