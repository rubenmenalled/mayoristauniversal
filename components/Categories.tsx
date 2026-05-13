'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Category { id: number; name: string; emoji: string; image: string; description: string; count: number }

export default function Categories({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
  }

  return (
    <section id="categorias" className="py-4 relative"
      style={{ background: 'linear-gradient(180deg, #071633 0%, #0A1D3D 100%)' }}>
      <div className="border-y border-gold/20 py-4"
        style={{ background: 'rgba(3,13,30,0.6)' }}>
        <div className="relative max-w-[1400px] mx-auto px-10">
          {/* Arrow Left */}
          <button onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass-card flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all border border-gold/30 shadow-lg">
            <ChevronLeft size={18} />
          </button>

          {/* Scroll track */}
          <div ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map((cat, i) => (
              <motion.a key={cat.id} href={`/categorias/${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
                style={{ minWidth: 100 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}>
                {/* Image box */}
                <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-white/10 group-hover:border-gold/50 transition-all"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)', background: 'rgba(7,22,51,0.8)' }}>
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="96px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {cat.emoji}
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/20 transition-colors" />
                  {/* Gold border glow */}
                  <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gold/60 transition-all" />
                </div>
                {/* Label */}
                <span className="text-gray-300 group-hover:text-gold text-xs font-bold uppercase tracking-wide transition-colors text-center">
                  {cat.name}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Arrow Right */}
          <button onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass-card flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all border border-gold/30 shadow-lg">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
