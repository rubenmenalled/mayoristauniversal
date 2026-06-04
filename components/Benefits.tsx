'use client'

import { motion } from 'framer-motion'
import { benefits } from '@/data/mockData'

export default function BenefitsBar() {
  return (
    <section className="py-3 border-y border-gold/15"
      style={{ background: 'linear-gradient(135deg, #D4C5A9 0%, #F0F0F0 50%, #D4C5A9 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {benefits.map((b, i) => (
            <motion.div key={b.title}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gold/5 transition-colors group"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}>
              <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">{b.icon}</span>
              <div className="min-w-0">
                <div className="text-white text-xs font-bold leading-tight truncate group-hover:text-gold transition-colors">{b.title}</div>
                <div className="text-gray-500 text-[10px] leading-tight truncate">{b.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
