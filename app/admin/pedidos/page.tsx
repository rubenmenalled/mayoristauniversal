'use client'

import { useEffect, useState } from 'react'

const GOLD = '#D4AF37'
const GOLD_GRAD = 'linear-gradient(135deg,#D4AF37,#F0C030)'
const NAVY = '#030D1E'
const NAVY2 = '#071633'

type Estado = 'pendiente' | 'confirmado' | 'enviado'

interface ItemPedido {
  nombre: string
  cantidad: number
  precio?: number
}

interface Pedido {
  id: string
  user_id: string
  nombre: string
  email: string
  telefono: string
  items: ItemPedido[]
  total: number
  estado: Estado
  created_at: string
}

const ESTADO_COLORS: Record<Estado, { bg: string; border: string; color: string }> = {
  pendiente:  { bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.4)',  color: '#FACC15' },
  confirmado: { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.35)', color: '#4ADE80' },
  enviado:    { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)', color: '#60A5FA' },
}

const ESTADO_LABELS: Record<Estado, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
}

function formatDateTime(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const dd   = String(d.getDate()).padStart(2, '0')
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh   = String(d.getHours()).padStart(2, '0')
  const min  = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function formatItems(items: ItemPedido[]) {
  if (!Array.isArray(items) || items.length === 0) return '—'
  return items.map(i => `${i.nombre} x${i.cantidad}`).join(' · ')
}

function formatCurrency(n: number) {
  return `$${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

type FiltroEstado = 'todos' | Estado

const FILTROS: { key: FiltroEstado; label: string }[] = [
  { key: 'todos',     label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'confirmado', label: 'Confirmados' },
  { key: 'enviado',   label: 'Enviados' },
]

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState<FiltroEstado>('todos')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/pedidos')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPedidos(data)
        } else {
          setError(data.error || 'Error al cargar pedidos')
        }
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setLoading(false))
  }, [])

  const handleEstadoChange = async (id: string, nuevoEstado: Estado) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/admin/pedidos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      })
      const data = await res.json()
      if (data.ok) {
        setPedidos(prev =>
          prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p)
        )
      } else {
        alert('Error al actualizar: ' + (data.error || 'desconocido'))
      }
    } catch {
      alert('Error de conexión al actualizar')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = pedidos.filter(p => {
    const matchFiltro = filtro === 'todos' || p.estado === filtro
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q)
    return matchFiltro && matchSearch
  })

  const totalPedidos   = pedidos.length
  const totalPendientes = pedidos.filter(p => p.estado === 'pendiente').length
  const totalFacturado  = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%)` }}>

      {/* ── HEADER ── */}
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
          }}>🛒</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>Pedidos</div>
            <div style={{ color: '#7a8a9a', fontSize: 11 }}>Mayorista Universal</div>
          </div>
        </div>

        <button
          onClick={() => { window.location.href = '/admin/dashboard' }}
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

      {/* ── CONTENT ── */}
      <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>

        {/* ── STATS ── */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 24,
          }}>
            {/* Total pedidos */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.18)',
              borderRadius: 14,
              padding: '16px 20px',
            }}>
              <div style={{ color: '#7a8a9a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Total pedidos</div>
              <div style={{ color: '#fff', fontSize: 28, fontWeight: 900, marginTop: 4 }}>{totalPedidos}</div>
            </div>

            {/* Pendientes */}
            <div style={{
              background: 'rgba(234,179,8,0.07)',
              border: '1px solid rgba(234,179,8,0.25)',
              borderRadius: 14,
              padding: '16px 20px',
            }}>
              <div style={{ color: '#FACC15', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Pendientes</div>
              <div style={{ color: '#FACC15', fontSize: 28, fontWeight: 900, marginTop: 4 }}>{totalPendientes}</div>
            </div>

            {/* Total facturado */}
            <div style={{
              background: 'rgba(212,175,55,0.07)',
              border: `1px solid rgba(212,175,55,0.25)`,
              borderRadius: 14,
              padding: '16px 20px',
            }}>
              <div style={{ color: '#7a8a9a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Total facturado</div>
              <div style={{ color: GOLD, fontSize: 22, fontWeight: 900, marginTop: 4 }}>{formatCurrency(totalFacturado)}</div>
            </div>
          </div>
        )}

        {/* ── FILTROS + BÚSQUEDA ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 20,
        }}>
          {/* Botones de filtro */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTROS.map(f => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: filtro === f.key
                    ? `1.5px solid ${GOLD}`
                    : '1px solid rgba(255,255,255,0.12)',
                  background: filtro === f.key
                    ? GOLD_GRAD
                    : 'rgba(255,255,255,0.05)',
                  color: filtro === f.key ? NAVY : '#ccc',
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Input búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: 10,
              padding: '9px 16px',
              color: '#fff',
              fontSize: 13,
              outline: 'none',
              minWidth: 220,
            }}
          />
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div style={{ color: '#7a8a9a', fontSize: 15 }}>Cargando pedidos...</div>
          </div>
        )}

        {/* ── ERROR ── */}
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

        {/* ── EMPTY ── */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#7a8a9a' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15 }}>
              {pedidos.length === 0
                ? 'No hay pedidos aún 📭'
                : 'Ningún pedido coincide con el filtro.'}
            </div>
          </div>
        )}

        {/* ── CARDS ── */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(pedido => {
              const colores = ESTADO_COLORS[pedido.estado] || ESTADO_COLORS.pendiente
              const isUpdating = updatingId === pedido.id

              return (
                <div
                  key={pedido.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(212,175,55,0.18)',
                    borderRadius: 16,
                    padding: '18px 22px',
                    position: 'relative',
                    opacity: isUpdating ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {/* Fila superior: fecha + badge estado */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 14,
                  }}>
                    {/* Datos cliente */}
                    <div>
                      <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>
                        {pedido.nombre || '—'}
                      </div>
                      <div style={{ color: '#7a8a9a', fontSize: 12, marginTop: 3, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {pedido.email && <span>{pedido.email}</span>}
                        {pedido.telefono && <span>· {pedido.telefono}</span>}
                      </div>
                    </div>

                    {/* Fecha arriba a la derecha */}
                    <div style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      padding: '4px 10px',
                      color: '#9aabb8',
                      fontSize: 11,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>
                      {formatDateTime(pedido.created_at)}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#b0c0d0',
                    fontSize: 13,
                    marginBottom: 14,
                    lineHeight: 1.6,
                  }}>
                    {formatItems(pedido.items)}
                  </div>

                  {/* Fila inferior: total + badge + select */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}>
                    {/* Total */}
                    <div style={{ color: GOLD, fontSize: 22, fontWeight: 900 }}>
                      {formatCurrency(pedido.total)}
                    </div>

                    {/* Badge + dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Badge estado */}
                      <span style={{
                        background: colores.bg,
                        border: `1px solid ${colores.border}`,
                        color: colores.color,
                        borderRadius: 20,
                        padding: '4px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        {ESTADO_LABELS[pedido.estado] || pedido.estado}
                      </span>

                      {/* Select cambiar estado */}
                      <select
                        value={pedido.estado}
                        disabled={isUpdating}
                        onChange={e => handleEstadoChange(pedido.id, e.target.value as Estado)}
                        style={{
                          background: 'rgba(255,255,255,0.07)',
                          border: '1px solid rgba(212,175,55,0.3)',
                          borderRadius: 8,
                          padding: '6px 10px',
                          color: '#e0e6f0',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                          outline: 'none',
                        }}
                      >
                        <option value="pendiente"  style={{ background: NAVY2 }}>Pendiente</option>
                        <option value="confirmado" style={{ background: NAVY2 }}>Confirmado</option>
                        <option value="enviado"    style={{ background: NAVY2 }}>Enviado</option>
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
