'use client'

import { useEffect, useState } from 'react'

const GOLD = '#D4AF37'
const GOLD_GRAD = 'linear-gradient(135deg,#D4AF37,#F0C030)'
const NAVY = '#614830'
const NAVY2 = '#6B543E'

interface Cliente {
  id: string
  email: string
  created_at: string
  nombre: string
  documento: string
  whatsapp: string
  transporte: string
  reemplazo: string
}

function formatDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function ReemplazoCell({ value }: { value: string }) {
  const yes = value === 'true' || value === 'sí' || value === 'si' || value === '1'
  return (
    <span style={{ fontWeight: 700 }}>
      {yes ? '✅ Sí' : '❌ No'}
    </span>
  )
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetch('/api/admin/clientes')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClientes(data)
        } else {
          setError(data.error || 'Error al cargar clientes')
        }
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = clientes.filter(c => {
    const q = search.toLowerCase()
    return (
      c.nombre.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%)` }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            background: GOLD_GRAD,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>👥</div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15 }}>Clientes registrados</div>
            <div style={{ color: '#7a8a9a', fontSize: 11 }}>Mayorista Universal</div>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/admin/dashboard'}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '8px 16px',
            color: '#ccc', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          ← Volver al panel
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Search + count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: GOLD_GRAD,
              color: NAVY,
              borderRadius: 20,
              padding: '4px 14px',
              fontWeight: 900,
              fontSize: 14,
            }}>
              {loading ? '...' : `${filtered.length} cliente${filtered.length !== 1 ? 's' : ''}`}
            </span>
            {!loading && search && filtered.length !== clientes.length && (
              <span style={{ color: '#7a8a9a', fontSize: 13 }}>
                de {clientes.length} total
              </span>
            )}
          </div>

          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid rgba(212,175,55,0.25)`,
              borderRadius: 10,
              padding: '10px 16px',
              color: '#FFFFFF',
              fontSize: 14,
              outline: 'none',
              width: isMobile ? '100%' : 300,
            }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div style={{ color: '#7a8a9a', fontSize: 15 }}>Cargando clientes...</div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            padding: '20px 24px',
            color: '#f87171',
            fontSize: 14,
            textAlign: 'center',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            color: '#7a8a9a',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15 }}>
              {clientes.length === 0 ? 'No hay clientes registrados aún.' : 'Ningún cliente coincide con la búsqueda.'}
            </div>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !error && filtered.length > 0 && !isMobile && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 13,
                color: '#e0e6f0',
              }}>
                <thead>
                  <tr style={{
                    background: 'rgba(212,175,55,0.1)',
                    borderBottom: '1px solid rgba(212,175,55,0.2)',
                  }}>
                    {['Nombre', 'Email', 'Documento', 'WhatsApp', 'Transporte', 'Reemplazo', 'Fecha registro'].map(h => (
                      <th key={h} style={{
                        padding: '13px 16px',
                        textAlign: 'left',
                        fontWeight: 800,
                        color: GOLD,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)')}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#FFFFFF' }}>{c.nombre}</td>
                      <td style={{ padding: '12px 16px', color: '#a0b0c0' }}>{c.email || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>{c.documento}</td>
                      <td style={{ padding: '12px 16px' }}>{c.whatsapp}</td>
                      <td style={{ padding: '12px 16px' }}>{c.transporte}</td>
                      <td style={{ padding: '12px 16px' }}><ReemplazoCell value={c.reemplazo} /></td>
                      <td style={{ padding: '12px 16px', color: '#7a8a9a', whiteSpace: 'nowrap' }}>{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && filtered.length > 0 && isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(c => (
              <div
                key={c.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.18)',
                  borderRadius: 14,
                  padding: '16px 18px',
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>{c.nombre}</div>
                    <div style={{ color: '#7a8a9a', fontSize: 12, marginTop: 2 }}>{c.email || '—'}</div>
                  </div>
                  <div style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: `1px solid rgba(212,175,55,0.25)`,
                    borderRadius: 8,
                    padding: '3px 10px',
                    color: GOLD,
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    {formatDate(c.created_at)}
                  </div>
                </div>

                {/* Card rows */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px 12px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: 12,
                }}>
                  {[
                    { label: 'Documento', value: c.documento },
                    { label: 'WhatsApp', value: c.whatsapp },
                    { label: 'Transporte', value: c.transporte },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ color: '#7a8a9a', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{label}</div>
                      <div style={{ color: '#e0e6f0', fontSize: 13, marginTop: 2 }}>{value}</div>
                    </div>
                  ))}
                  <div>
                    <div style={{ color: '#7a8a9a', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Reemplazo</div>
                    <div style={{ fontSize: 13, marginTop: 2 }}><ReemplazoCell value={c.reemplazo} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
