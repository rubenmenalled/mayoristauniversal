'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Boxes } from '@/components/ui/background-boxes'

// ⬇️ Cuando crees las redes, reemplazá el href de cada una:
const social = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/mayoristauniversal26', // ← cambiá esto
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/mayoristauniversal', // ← cambiá esto
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Canal de WhatsApp',
    href: 'https://whatsapp.com/channel/0029Vb7ugE42ER6gCX7OAr0T',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z"/>
      </svg>
    ),
  },
]

const payment = ['🏦 Transferencia', '📱 Mercado Pago']

export default function Footer() {
  return (
    <footer id="contacto" className="relative overflow-hidden"
      style={{ background: '#0B1E3F' }}>
      {/* Fondo de cajas animadas */}
      <Boxes />
      {/* Máscara radial: difumina las cajas hacia los bordes */}
      <div className="absolute inset-0 w-full h-full bg-[#0B1E3F] z-10 [mask-image:radial-gradient(transparent,#0B1E3F)] pointer-events-none" />

      {/* Gold top border */}
      <div className="relative z-20 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />


      {/* Main footer */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-16">
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
              <div className="flex items-center gap-2"><Mail  size={14} className="text-gold" /> rubenmenalled@gmail.com</div>
              <div className="flex items-start gap-2"><MapPin size={14} className="text-gold mt-0.5 shrink-0" /> <span>Oficina: Lavalle 2378, Piso 8, Of. 82<br />Once, CABA, Buenos Aires</span></div>
            </div>

            {/* Social */}
            <div className="flex gap-2 flex-wrap">
              {social.map(s => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: s.name === 'Instagram' ? 'rgba(255,0,144,0.15)' : s.name === 'Facebook' ? 'rgba(24,119,242,0.15)' : 'rgba(255,255,255,0.12)',
                    border: s.name === 'Instagram' ? '1px solid rgba(255,0,144,0.4)' : s.name === 'Facebook' ? '1px solid rgba(24,119,242,0.4)' : '1px solid rgba(255,255,255,0.3)',
                    color: s.name === 'Instagram' ? '#FF0090' : s.name === 'Facebook' ? '#1877F2' : '#ffffff',
                  }}
                  whileHover={{ scale: 1.12, y: -2 }}
                  title={s.name}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Payment methods */}
      <div className="relative z-20 border-t border-gold/10 py-6 px-4">
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
      <div className="relative z-20 border-t border-gold/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Mayorista Universal. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <a href="/terminos" className="hover:text-gold transition-colors">Términos y condiciones</a>
            <a href="/privacidad" className="hover:text-gold transition-colors">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
