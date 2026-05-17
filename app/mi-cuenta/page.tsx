'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ShoppingCart, LogOut, Package, FileText, Truck, RefreshCw, Phone } from 'lucide-react'

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

  const meta = user?.user_metadata || {}
  const nombre = meta.nombre || user?.email || 'Usuario'
  const email = user?.email || ''
  const documento = meta.documento || '—'
  const transporte = meta.transporte || '—'
  const reemplazo = meta.reemplazo === 'si' ? '✅ Sí acepta' : meta.reemplazo === 'no' ? '❌ No acepta' : '—'
  const whatsapp = meta.whatsapp || '—'
  const inicial = nombre.charAt(0).toUpperCase()

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: 14, padding: '16px 20px',
    display: 'flex', alignItems: 'center', gap: 14,
  }

  const iconBoxStyle: React.CSSProperties = {
    width: 42, height: 42, borderRadius: 11, flexShrink: 0,
    background: 'rgba(212,175,55,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #030D1E 0%, #071633 100%)',
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingCart size={18} color="#030D1E" />
            </div>
            <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: 14, letterSpacing: '0.06em' }}>MAYORISTA UNIVERSAL</span>
          </a>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#fca5a5', borderRadius: 8, padding: '8px 14px',
            cursor: 'pointer', fontSize: 13, fontWeight: 700,
          }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>

        {/* Avatar + Nombre */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: 20, padding: '24px 22px',
          display: 'flex', alignItems: 'center', gap: 18,
          marginBottom: 16,
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: 'linear-gradient(135deg,#D4AF37,#F0C030)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 900, color: '#030D1E', flexShrink: 0,
          }}>
            {inicial}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 20, marginBottom: 3 }}>{nombre}</div>
            <div style={{ color: '#7a8a9a', fontSize: 13, marginBottom: 8 }}>{email}</div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
              color: '#D4AF37', fontSize: 11, fontWeight: 800,
              padding: '3px 10px', borderRadius: 20, letterSpacing: '0.08em',
            }}>
              CLIENTE MAYORISTA
            </div>
          </div>
        </div>

        {/* Datos del cliente */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ color: '#D4AF37', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 4 }}>
            MIS DATOS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            <div style={cardStyle}>
              <div style={iconBoxStyle}><FileText size={19} color="#D4AF37" /></div>
              <div>
                <div style={{ color: '#7a8a9a', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>DOCUMENTO</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{documento}</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconBoxStyle}><Phone size={19} color="#D4AF37" /></div>
              <div>
                <div style={{ color: '#7a8a9a', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>WHATSAPP</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{whatsapp}</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconBoxStyle}><Truck size={19} color="#D4AF37" /></div>
              <div>
                <div style={{ color: '#7a8a9a', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>TRANSPORTE</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{transporte}</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconBoxStyle}><RefreshCw size={19} color="#D4AF37" /></div>
              <div>
                <div style={{ color: '#7a8a9a', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>REEMPLAZO DE PRODUCTOS</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{reemplazo}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Acciones */}
        <div style={{ marginTop: 20 }}>
          <div style={{ color: '#D4AF37', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 4 }}>
            ACCIONES RÁPIDAS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            <a href="/catalogo" style={{ textDecoration: 'none' }}>
              <div style={{
                ...cardStyle, cursor: 'pointer', transition: 'border-color 0.2s',
                borderColor: 'rgba(212,175,55,0.15)',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)')}>
                <div style={iconBoxStyle}><Package size={19} color="#D4AF37" /></div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Ver catálogos</div>
                  <div style={{ color: '#7a8a9a', fontSize: 12 }}>Explorá todos los productos mayoristas</div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#D4AF37', fontSize: 18 }}>→</span>
              </div>
            </a>

            <a href={`https://wa.me/5491164660482?text=Hola! Soy ${encodeURIComponent(nombre)}, quiero hacer un pedido.`}
              target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{
                ...cardStyle, cursor: 'pointer',
                border: '1px solid rgba(34,197,94,0.2)',
              }}>
                <div style={{ ...iconBoxStyle, background: 'rgba(34,197,94,0.12)' }}>
                  <span style={{ fontSize: 20 }}>📱</span>
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Hacer un pedido por WhatsApp</div>
                  <div style={{ color: '#7a8a9a', fontSize: 12 }}>Te abre directo con tu nombre</div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: 18 }}>→</span>
              </div>
            </a>

          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 28, color: '#4b5563', fontSize: 13 }}>
          <a href="/" style={{ color: '#D4AF37', textDecoration: 'none' }}>← Volver al inicio</a>
        </p>
      </div>
    </div>
  )
}
