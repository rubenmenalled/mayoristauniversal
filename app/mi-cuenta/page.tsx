'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ShoppingCart, User, LogOut, Package, Heart, MapPin } from 'lucide-react'

export default function MiCuentaPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setUser(data.session.user)
        setLoading(false)
      }
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: '#D4AF37', fontSize: 16 }}>Cargando...</div>
      </div>
    )
  }

  const nombre = user?.user_metadata?.nombre || user?.email || 'Usuario'
  const email = user?.email || ''
  const inicial = nombre.charAt(0).toUpperCase()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)',
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingCart size={20} color="#030D1E" />
            </div>
            <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 16, letterSpacing: '0.06em' }}>MAYORISTA UNIVERSAL</span>
          </a>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', borderRadius: 8, padding: '8px 14px',
            cursor: 'pointer', fontSize: 13, fontWeight: 700,
          }}>
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>

        {/* Avatar + Nombre */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: 20, padding: '28px 24px',
          display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 20,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 900, color: '#030D1E', flexShrink: 0,
          }}>
            {inicial}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>{nombre}</div>
            <div style={{ color: '#7a8a9a', fontSize: 14 }}>{email}</div>
            <div style={{
              marginTop: 8, display: 'inline-block',
              background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
              color: '#D4AF37', fontSize: 11, fontWeight: 800,
              padding: '3px 10px', borderRadius: 20, letterSpacing: '0.08em',
            }}>
              CLIENTE MAYORISTA
            </div>
          </div>
        </div>

        {/* Menu de opciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <a href="/catalogo" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: 14, padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)')}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(212,175,55,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Package size={22} color="#D4AF37" />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Ver catálogos</div>
                <div style={{ color: '#7a8a9a', fontSize: 13 }}>Explorá todos los productos mayoristas</div>
              </div>
              <span style={{ marginLeft: 'auto', color: '#D4AF37', fontSize: 20 }}>→</span>
            </div>
          </a>

          <a href="https://wa.me/5491164660482" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 14, padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(34,197,94,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 22 }}>📱</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Contactar por WhatsApp</div>
                <div style={{ color: '#7a8a9a', fontSize: 13 }}>Hacé tu pedido directo con nosotros</div>
              </div>
              <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: 20 }}>→</span>
            </div>
          </a>

        </div>

        <p style={{ textAlign: 'center', marginTop: 28, color: '#4b5563', fontSize: 13 }}>
          <a href="/" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Volver al inicio</a>
        </p>
      </div>
    </div>
  )
}
