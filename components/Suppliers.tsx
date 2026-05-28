'use client'

import { motion } from 'framer-motion'
import { suppliers } from '@/data/mockData'
import { Star, MapPin, Package, MessageCircle, CheckCircle } from 'lucide-react'

export default function Suppliers() {
  return (
    <section id="proveedores" className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F0F0F0 0%, #5C0000 50%, #F0F0F0 100%)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.05) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Proveedores premium
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Proveedores{' '}
            <span className="gold-text">Verificados</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Conectate directamente con los mejores proveedores mayoristas de Argentina, todos auditados y verificados.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier, i) => (
            <motion.div
              key={supplier.id}
              className="group glass-card rounded-2xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
            >
              {/* Hover border */}
              <div className="absolute inset-0 rounded-2xl border border-gold/0 group-hover:border-gold/40 transition-all duration-300" />

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: 'radial-gradient(ellipse at top right, rgba(212,175,55,0.05) 0%, transparent 60%)' }} />

              {/* Card header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Logo */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                    border: '1px solid rgba(212,175,55,0.25)',
                  }}
                >
                  {supplier.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-base truncate group-hover:text-gold transition-colors">
                      {supplier.name}
                    </h3>
                    {supplier.verified && (
                      <CheckCircle size={15} className="text-electric flex-shrink-0" />
                    )}
                  </div>
                  <span className="inline-block bg-gold/10 text-gold text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {supplier.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {supplier.description}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-5 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-gold fill-gold" />
                  <span className="text-white font-semibold">{supplier.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Package size={13} />
                  <span>{supplier.products.toLocaleString()} productos</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin size={13} />
                  <span>{supplier.location}</span>
                </div>
              </div>

              {/* Action */}
              <motion.button
                className="w-full btn-gold py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle size={14} />
                Contactar proveedor
              </motion.button>

              {/* Verified badge top-right */}
              {supplier.verified && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] text-electric font-semibold">
                  <CheckCircle size={11} />
                  Verificado
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-4">¿Sos proveedor mayorista? Unite a nuestra red.</p>
          <motion.button
            className="btn-outline-gold px-10 py-3.5 rounded-full font-bold text-lg inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            🏭 Publicar mis productos
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
