'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { stats } from '@/data/mockData'

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const start    = Date.now()
    const frame = () => {
      const elapsed  = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease     = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [inView, target])

  return (
    <span ref={ref} className="font-display font-black text-5xl md:text-6xl gold-text tabular-nums">
      {current >= 1000 ? (current / 1000).toFixed(current >= 100000 ? 0 : 1) + 'K' : current}
      {suffix}
    </span>
  )
}

export default function StatsCounter() {
  return (
    <section className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #CC0000 0%, #F0F0F0 50%, #DD1111 100%)' }}>
      {/* Decorative lines */}
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />

      {/* Gold glow center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">
            Nuestros números
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">
            El marketplace mayorista más{' '}
            <span className="gold-text">grande</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl border border-gold/0 group-hover:border-gold/30 transition-all duration-300" />

              <div className="text-4xl mb-3">{stat.icon}</div>
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              <p className="text-gray-400 text-sm mt-2 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
