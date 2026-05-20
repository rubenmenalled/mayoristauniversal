'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '@/data/mockData'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={14} className={n <= rating ? 'text-gold fill-gold' : 'text-gray-600'} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)

  const prev = () => setActive(v => (v - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive(v => (v + 1) % testimonials.length)

  const t = testimonials[active]

  return (
    <section id="testimonios" className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F0EBE0 0%, #F8F5EE 100%)' }}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 65%)' }} />

      <div className="max-w-5xl mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Lo que dicen nuestros clientes
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            <span className="gold-text">Testimonios</span> reales
          </h2>
        </motion.div>

        {/* Main testimonial */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {/* Border glow */}
              <div className="absolute inset-0 rounded-3xl"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.2)' }} />

              {/* Gold quote icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 100%)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.4)',
                }}
              >
                <Quote size={28} className="text-navy" />
              </div>

              {/* Text */}
              <p className="text-white text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex justify-center mb-6">
                <StarRating rating={t.rating} />
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
                    border: '2px solid rgba(212,175,55,0.3)',
                  }}
                >
                  {t.avatar}
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">{t.name}</div>
                  <div className="text-gray-400 text-sm">{t.role} · {t.company}</div>
                </div>
                <div
                  className="ml-4 px-3 py-1.5 rounded-full text-sm font-bold"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                  Ahorra {t.savings}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full glass-card border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full glass-card border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-gold' : 'w-2 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* All logos row */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          <span className="text-gray-600 text-sm uppercase tracking-widest mr-2">Confían en nosotros:</span>
          {['🏪', '🏬', '🏭', '🛒', '🏢', '🏗️'].map((emoji, i) => (
            <div key={i} className="glass-card rounded-xl px-5 py-2.5 text-2xl opacity-60 hover:opacity-100 transition-opacity">
              {emoji}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
