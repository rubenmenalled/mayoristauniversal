'use client'

import { promoMessages } from '@/data/mockData'

export default function PromoBanner() {
  const doubled = [...promoMessages, ...promoMessages]

  return (
    <div className="relative overflow-hidden py-3 border-y border-gold/20"
      style={{ background: 'linear-gradient(135deg, #0A1D3D 0%, #1A3A6B 50%, #0A1D3D 100%)' }}>
      {/* Left & right fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #1A3A6B, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #1A3A6B, transparent)' }} />

      <div className="ticker-track flex gap-0">
        {doubled.map((msg, i) => (
          <span key={i} className="flex items-center flex-shrink-0">
            <span className="text-gray-200 text-sm font-medium whitespace-nowrap px-6">{msg}</span>
            <span className="text-gold/40 flex-shrink-0">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
