'use client'

import { Package, Grid3X3, LogOut, ArrowRight, Globe } from 'lucide-react'

const GOLD = 'linear-gradient(135deg,#F5C518,#FFE45C)'

export default function Dashboard() {

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin'
  }

  const cards = [
    {
      icon: '📦',
      title: 'Productos',
      desc: 'Agregar, editar y borrar productos del catálogo',
      href: '/admin/productos',
      color: '#1a4a8c',
    },
    {
      icon: '🗂️',
      title: 'Categorías / Rubros',
      desc: 'Gestionar los rubros y sus imágenes',
      href: '/admin/categorias',
      color: '#1a6a3c',
    },
    {
      icon: '👥',
      title: 'Clientes',
      desc: 'Ver clientes registrados, documentos, WhatsApp y transporte',
      href: '/admin/clientes',
      color: '#6a3a1a',
    },
    {
      icon: '🧾',
      title: 'Pedidos',
      desc: 'Ver y gestionar todos los pedidos recibidos con sus estados',
      href: '/admin/pedidos',
      color: '#2a1a6a',
    },
    {
      icon: '🏠',
      title: 'Filas de la Home',
      desc: 'Editar las filas de productos de la página principal (títulos y categorías)',
      href: '/admin/home-secciones',
      color: '#6a1a4a',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A' }}>
      {/* Header */}
      <div style={{
        background: '#1E293B',
        borderBottom: '1px solid rgba(245,197,24,0.3)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            background: GOLD,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🛒</div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15 }}>Panel Admin</div>
            <div style={{ color: '#7a8a9a', fontSize: 11 }}>Mayorista Universal</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => window.open('/', '_blank')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '8px 14px',
              color: '#ccc', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
            <Globe size={14} /> Ver página
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '8px 14px',
              color: '#f87171', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
          Bienvenido 👋
        </h1>
        <p style={{ color: '#7a8a9a', fontSize: 14, marginBottom: 40 }}>
          Desde acá podés administrar todo el contenido de la página.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 20 }}>
          {cards.map(card => (
            <button
              key={card.href}
              onClick={() => window.location.href = card.href}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(245,197,24,0.2)',
                borderRadius: 16,
                padding: 28,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,197,24,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,197,24,0.2)')}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{card.icon}</div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 18 }}>{card.title}</span>
                <ArrowRight size={18} color="#F5C518" />
              </div>
              <p style={{ color: '#7a8a9a', fontSize: 13, margin: 0 }}>{card.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
