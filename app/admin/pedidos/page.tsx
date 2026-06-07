'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function playOrderSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    // Melodía alegre: Do-Mi-Sol-Do
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = ctx.currentTime + i * 0.2
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.45, t + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  } catch {}
}

const GOLD      = '#D4AF37'
const GOLD_GRAD = 'linear-gradient(135deg,#D4AF37,#F0C030)'
const NAVY2     = '#F0F0F0'

type Estado = 'pendiente' | 'confirmado' | 'enviado'

interface CartItem {
  id: number
  name: string
  brand?: string
  price: number
  wholesalePrice: number
  image: string
  quantity: number
  minOrder: number
  category?: string
}

interface Pedido {
  id: string
  user_id: string
  nombre: string
  email: string
  telefono: string
  items: CartItem[]
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
  const d    = new Date(iso)
  const dd   = String(d.getDate()).padStart(2, '0')
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh   = String(d.getHours()).padStart(2, '0')
  const min  = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function formatCurrency(n: number) {
  return `$${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// Normaliza item sin importar si viene con name/nombre, quantity/cantidad, etc.
function normItem(i: any): CartItem {
  return {
    id:             i.id ?? 0,
    name:           i.name || i.nombre || '—',
    brand:          i.brand || i.marca || '',
    price:          Number(i.price ?? i.precio ?? 0),
    wholesalePrice: Number(i.wholesalePrice ?? i.precio_mayorista ?? i.precio ?? 0),
    image:          i.image || i.imagen || '',
    quantity:       Number(i.quantity ?? i.cantidad ?? 1),
    minOrder:       Number(i.minOrder ?? i.pedido_minimo ?? 1),
    category:       i.category || i.categoria || '',
  }
}

function printPedido(pedido: Pedido) {
  const items = pedido.items.map(normItem)
  const totalUnidades = items.reduce((s, i) => s + i.quantity, 0)
  const fecha = formatDateTime(pedido.created_at)

  const filas = items.map(item => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:middle;">
        ${item.image
          ? `<img src="${item.image}" width="56" height="56" style="border-radius:8px;object-fit:cover;display:block;border:1px solid #ddd;" />`
          : `<div style="width:56px;height:56px;background:#f3f4f6;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;">📦</div>`
        }
      </td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:middle;">
        ${item.brand ? `<div style="font-size:10px;color:#D4AF37;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px;">${item.brand}</div>` : ''}
        <div style="font-weight:800;font-size:13px;color:#111;margin-bottom:3px;">${item.name}</div>
        ${item.category ? `<div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.04em;">${item.category}</div>` : ''}
      </td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:middle;text-align:center;font-size:13px;color:#444;">
        ${formatCurrency(item.wholesalePrice)}
      </td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:middle;text-align:center;font-weight:800;font-size:14px;color:#111;">
        ${item.quantity}
      </td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:middle;text-align:right;font-weight:900;font-size:15px;color:#D4AF37;">
        ${formatCurrency(item.wholesalePrice * item.quantity)}
      </td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pedido — ${pedido.nombre} — ${fecha}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 0; padding: 0; background: #fff; }
    .page { max-width: 780px; margin: 0 auto; padding: 32px 28px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page { padding: 16px; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Botón imprimir (no aparece al imprimir) -->
  <div class="no-print" style="text-align:right;margin-bottom:20px;">
    <button onclick="window.print()" style="background:#D4AF37;border:none;border-radius:8px;padding:10px 24px;font-weight:900;font-size:14px;cursor:pointer;color:#fff;">
      🖨️ Imprimir / Guardar PDF
    </button>
  </div>

  <!-- Encabezado -->
  <div style="border-bottom:3px solid #D4AF37;padding-bottom:16px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
    <div>
      <div style="font-size:22px;font-weight:900;color:#0F3460;letter-spacing:0.01em;">MAYORISTA UNIVERSAL</div>
      <div style="font-size:12px;color:#888;margin-top:2px;">mayoristauniversal.com</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:18px;font-weight:900;color:#D4AF37;letter-spacing:0.04em;">PEDIDO</div>
      <div style="font-size:11px;color:#888;margin-top:2px;">${fecha}</div>
      <div style="font-size:11px;color:#bbb;margin-top:1px;">ID: ${pedido.id.slice(0,8).toUpperCase()}</div>
    </div>
  </div>

  <!-- Datos del cliente -->
  <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:16px 20px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;">
    <div>
      <div style="font-size:10px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Cliente</div>
      <div style="font-size:15px;font-weight:800;color:#111;">${pedido.nombre}</div>
    </div>
    <div>
      <div style="font-size:10px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Email</div>
      <div style="font-size:13px;color:#2563EB;">${pedido.email}</div>
    </div>
    <div>
      <div style="font-size:10px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Teléfono / WhatsApp</div>
      <div style="font-size:13px;font-weight:700;color:#111;">${pedido.telefono}</div>
    </div>
    <div>
      <div style="font-size:10px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Estado</div>
      <div style="font-size:13px;font-weight:800;color:${pedido.estado === 'enviado' ? '#2563EB' : pedido.estado === 'confirmado' ? '#16a34a' : '#D97706'};">${ESTADO_LABELS[pedido.estado] || pedido.estado}</div>
    </div>
  </div>

  <!-- Tabla de productos -->
  <div style="font-size:12px;font-weight:800;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;padding-left:4px;">
    Productos — ${items.length} artículo${items.length !== 1 ? 's' : ''} · ${totalUnidades} unidades
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:0;">
    <thead>
      <tr style="background:#F3F4F6;">
        <th style="padding:8px;text-align:left;font-size:11px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Foto</th>
        <th style="padding:8px;text-align:left;font-size:11px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Producto</th>
        <th style="padding:8px;text-align:center;font-size:11px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">P. Unit.</th>
        <th style="padding:8px;text-align:center;font-size:11px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Cant.</th>
        <th style="padding:8px;text-align:right;font-size:11px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Subtotal</th>
      </tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>

  <!-- Total -->
  <div style="background:#0F3460;border-radius:10px;padding:16px 20px;margin-top:20px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <div style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Total del pedido</div>
      <div style="color:rgba(255,255,255,0.45);font-size:11px;margin-top:2px;">${totalUnidades} unidades · ${items.length} artículo${items.length !== 1 ? 's' : ''}</div>
    </div>
    <div style="color:#D4AF37;font-size:32px;font-weight:900;">${formatCurrency(pedido.total)}</div>
  </div>

  <!-- Pago -->
  <div style="border:1px solid #E5E7EB;border-radius:10px;padding:14px 20px;margin-top:14px;">
    <div style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Pago</div>
    <div style="font-size:13px;color:#374151;">Mercado Pago — Alias: <strong style="color:#009ee3;">ruby.mena.1972</strong> — Titular: Andres Ruben Menalled</div>
  </div>

  <div style="text-align:center;color:#D1D5DB;font-size:10px;margin-top:24px;">Mayorista Universal · mayoristauniversal.com · Pedido generado el ${fecha}</div>
</div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=860,height=900')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

type FiltroEstado = 'todos' | Estado

const FILTROS: { key: FiltroEstado; label: string }[] = [
  { key: 'todos',      label: 'Todos' },
  { key: 'pendiente',  label: 'Pendientes' },
  { key: 'confirmado', label: 'Confirmados' },
  { key: 'enviado',    label: 'Enviados' },
]

export default function PedidosPage() {
  const [pedidos,    setPedidos]    = useState<Pedido[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [filtro,     setFiltro]     = useState<FiltroEstado>('todos')
  const [search,     setSearch]     = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expanded,   setExpanded]   = useState<string | null>(null)
  const [alertaActiva, setAlertaActiva] = useState(false)
  const [nuevosIds, setNuevosIds]   = useState<string[]>([])
  const alertaRef = useRef(false)

  useEffect(() => {
    fetch('/api/admin/pedidos')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPedidos(data)
        else setError(data.error || 'Error al cargar pedidos')
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setLoading(false))
  }, [])

  // Realtime: escuchar nuevos pedidos
  useEffect(() => {
    if (!alertaActiva) return
    const channel = supabaseClient
      .channel('pedidos-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pedidos' }, (payload) => {
        const p = payload.new as Pedido
        setPedidos(prev => [p, ...prev])
        setNuevosIds(prev => [...prev, p.id])
        playOrderSound()
        if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300])
        setTimeout(() => setNuevosIds(prev => prev.filter(id => id !== p.id)), 10000)
      })
      .subscribe()
    return () => { supabaseClient.removeChannel(channel) }
  }, [alertaActiva])

  function toggleAlerta() {
    if (!alertaActiva) {
      // Desbloquear audio con gesto del usuario
      playOrderSound()
    }
    setAlertaActiva(v => !v)
  }

  const handleEstadoChange = async (id: string, nuevoEstado: Estado) => {
    setUpdatingId(id)
    try {
      const res  = await fetch('/api/admin/pedidos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      })
      const data = await res.json()
      if (data.ok) {
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
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
    const q           = search.toLowerCase()
    const matchSearch =
      !q ||
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.email  || '').toLowerCase().includes(q)
    return matchFiltro && matchSearch
  })

  // Exportar UN pedido individual a Excel/CSV
  function exportarPedidoExcel(pedido: Pedido) {
    const BOM = '﻿'
    const items = (pedido.items || []).map(normItem)
    const fecha = formatDateTime(pedido.created_at)
    const filas: string[][] = []
    filas.push(['Fecha', 'ID', 'Cliente', 'Email', 'Teléfono', 'Estado', 'Marca', 'Producto', 'Categoría', 'Cantidad', 'Precio Unit.', 'Subtotal', 'Total Pedido', 'URL Foto'])
    items.forEach((item, idx) => {
      filas.push([
        idx === 0 ? fecha : '',
        idx === 0 ? pedido.id.slice(0, 8).toUpperCase() : '',
        idx === 0 ? pedido.nombre : '',
        idx === 0 ? pedido.email : '',
        idx === 0 ? (pedido.telefono || '') : '',
        idx === 0 ? (ESTADO_LABELS[pedido.estado] || pedido.estado) : '',
        item.brand || '',
        item.name,
        item.category || '',
        String(item.quantity),
        String(item.wholesalePrice),
        String(item.wholesalePrice * item.quantity),
        idx === 0 ? String(pedido.total) : '',
        item.image ? `=IMAGE("${item.image}")` : '',
      ])
    })
    if (items.length === 0) {
      filas.push([fecha, pedido.id.slice(0, 8).toUpperCase(), pedido.nombre, pedido.email, pedido.telefono || '', ESTADO_LABELS[pedido.estado] || pedido.estado, '', '', '', '', '', '', String(pedido.total), ''])
    }
    const csv = BOM + filas.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `pedido-${pedido.nombre.replace(/\s+/g,'-')}-${pedido.id.slice(0,8)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalPedidos    = pedidos.length
  const totalPendientes = pedidos.filter(p => p.estado === 'pendiente').length

  // Exportar a CSV (abre directo en Excel)
  function exportarExcel() {
    const pedidosExport = filtered.length > 0 ? filtered : pedidos
    const BOM = '﻿' // UTF-8 BOM para que Excel muestre tildes

    // Una fila por PRODUCTO dentro de cada pedido
    const filas: string[][] = []
    filas.push(['Fecha', 'ID Pedido', 'Cliente', 'Email', 'Teléfono', 'Estado', 'Marca', 'Producto', 'Categoría', 'Cantidad', 'Precio Unit.', 'Subtotal', 'Total Pedido', 'URL Foto'])

    pedidosExport.forEach(p => {
      const items = (p.items || []).map(normItem)
      if (items.length === 0) {
        filas.push([
          formatDateTime(p.created_at), p.id.slice(0, 8).toUpperCase(),
          p.nombre, p.email, p.telefono || '', ESTADO_LABELS[p.estado] || p.estado,
          '', '', '', '', '', '', String(p.total), '',
        ])
      } else {
        items.forEach((item, idx) => {
          filas.push([
            idx === 0 ? formatDateTime(p.created_at) : '',
            idx === 0 ? p.id.slice(0, 8).toUpperCase() : '',
            idx === 0 ? p.nombre : '',
            idx === 0 ? p.email : '',
            idx === 0 ? (p.telefono || '') : '',
            idx === 0 ? (ESTADO_LABELS[p.estado] || p.estado) : '',
            item.brand || '',
            item.name,
            item.category || '',
            String(item.quantity),
            String(item.wholesalePrice),
            String(item.wholesalePrice * item.quantity),
            idx === 0 ? String(p.total) : '',
            item.image ? `=IMAGE("${item.image}")` : '',
          ])
        })
      }
    })

    const csv = BOM + filas.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')
    ).join('\r\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    const fecha = new Date().toISOString().slice(0, 10)
    a.href     = url
    a.download = `pedidos-mayorista-${fecha}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
  const totalFacturado  = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A' }}>

      {/* HEADER */}
      <div style={{
        background: '#1E293B',
        borderBottom: '1px solid rgba(212,175,55,0.3)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: GOLD_GRAD, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛒</div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15 }}>Pedidos</div>
            <div style={{ color: '#7a8a9a', fontSize: 11 }}>Mayorista Universal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Botón exportar Excel */}
          <button
            onClick={exportarExcel}
            disabled={pedidos.length === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: pedidos.length === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#16a34a,#15803d)',
              border: 'none', borderRadius: 8, padding: '8px 16px',
              color: pedidos.length === 0 ? '#4a5568' : '#FFFFFF',
              fontSize: 13, fontWeight: 900, cursor: pedidos.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            📊 Descargar Excel
          </button>
          {/* Botón alerta sonido */}
          <button
            onClick={toggleAlerta}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: alertaActiva ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#D4AF37,#F0C030)',
              border: 'none', borderRadius: 8, padding: '8px 16px',
              color: '#FFFFFF', fontSize: 13, fontWeight: 900, cursor: 'pointer',
              boxShadow: alertaActiva ? '0 0 16px rgba(34,197,94,0.5)' : 'none',
              animation: alertaActiva ? 'pulse 2s infinite' : 'none',
            }}
          >
            {alertaActiva ? '🔔 ALERTAS ACTIVAS' : '🔕 Activar alertas'}
          </button>
          <button
            onClick={() => { window.location.href = '/admin/dashboard' }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px', color: '#ccc', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            ← Volver al panel
          </button>
        </div>
        <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 16px rgba(34,197,94,0.5)} 50%{box-shadow:0 0 28px rgba(34,197,94,0.9)} }`}</style>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: 1100, margin: '0 auto' }}>

        {/* STATS */}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ color: '#7a8a9a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Total pedidos</div>
              <div style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 900, marginTop: 4 }}>{totalPedidos}</div>
            </div>
            <div style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ color: '#FACC15', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Pendientes</div>
              <div style={{ color: '#FACC15', fontSize: 28, fontWeight: 900, marginTop: 4 }}>{totalPendientes}</div>
            </div>
            <div style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ color: '#7a8a9a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Total facturado</div>
              <div style={{ color: GOLD, fontSize: 22, fontWeight: 900, marginTop: 4 }}>{formatCurrency(totalFacturado)}</div>
            </div>
          </div>
        )}

        {/* FILTROS + BÚSQUEDA */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTROS.map(f => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                style={{
                  padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  border: filtro === f.key ? `1.5px solid ${GOLD}` : '1px solid rgba(255,255,255,0.12)',
                  background: filtro === f.key ? GOLD_GRAD : 'rgba(255,255,255,0.05)',
                  color: filtro === f.key ? '#0F3460' : '#ccc',
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '9px 16px', color: '#FFFFFF', fontSize: 13, outline: 'none', minWidth: 220 }}
          />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div style={{ color: '#7a8a9a', fontSize: 15 }}>Cargando pedidos...</div>
          </div>
        )}

        {error && !loading && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '20px 24px', color: '#f87171', fontSize: 14, textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#7a8a9a' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15 }}>{pedidos.length === 0 ? 'No hay pedidos aún.' : 'Ningún pedido coincide con el filtro.'}</div>
          </div>
        )}

        {/* CARDS */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(pedido => {
              const colores    = ESTADO_COLORS[pedido.estado] || ESTADO_COLORS.pendiente
              const isUpdating = updatingId === pedido.id
              const isOpen     = expanded === pedido.id
              const isNuevo    = nuevosIds.includes(pedido.id)
              const items      = Array.isArray(pedido.items) ? pedido.items.map(normItem) : []
              const totalUnid  = items.reduce((s, i) => s + i.quantity, 0)

              return (
                <div
                  key={pedido.id}
                  style={{
                    background: isNuevo ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${isNuevo ? '#22c55e' : isOpen ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.18)'}`,
                    borderRadius: 16, overflow: 'hidden',
                    opacity: isUpdating ? 0.7 : 1,
                    transition: 'all 0.4s ease',
                    boxShadow: isNuevo ? '0 0 20px rgba(34,197,94,0.3)' : 'none',
                  }}
                >
                  {isNuevo && (
                    <div style={{ background: '#22c55e', color: '#fff', fontWeight: 900, fontSize: 12, padding: '5px 20px', letterSpacing: '0.1em', textAlign: 'center' }}>
                      🔔 NUEVO PEDIDO — ACABA DE LLEGAR
                    </div>
                  )}
                  {/* ── CABECERA DE LA CARD ── */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : pedido.id)}
                    style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>{pedido.nombre || '—'}</div>
                      <div style={{ color: '#7a8a9a', fontSize: 12, marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {pedido.email    && <span>{pedido.email}</span>}
                        {pedido.telefono && <span>· {pedido.telefono}</span>}
                        <span>· {totalUnid} ud. · {items.length} art.</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 8px', color: '#9aabb8', fontSize: 11, fontWeight: 600 }}>
                        {formatDateTime(pedido.created_at)}
                      </div>
                      <div style={{ color: GOLD, fontSize: 20, fontWeight: 900 }}>{formatCurrency(pedido.total)}</div>
                      <span style={{ background: colores.bg, border: `1px solid ${colores.border}`, color: colores.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                        {ESTADO_LABELS[pedido.estado] || pedido.estado}
                      </span>
                      <span style={{ color: '#7a8a9a', fontSize: 18 }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* ── DETALLE EXPANDIDO ── */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid rgba(212,175,55,0.2)', padding: '20px' }}>

                      {/* Thumbnails de productos */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ color: '#9aabb8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                          Productos — {totalUnid} unidades · {items.length} artículo{items.length !== 1 ? 's' : ''}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 14px' }}>
                              {/* Foto */}
                              <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#2a2a2a', position: 'relative' }}>
                                {item.image
                                  ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📦</div>
                                }
                              </div>
                              {/* Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 800, lineHeight: 1.3 }}>{item.name}</div>
                                {item.category && <div style={{ color: '#7a8a9a', fontSize: 11, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.category}</div>}
                                <div style={{ color: '#9aabb8', fontSize: 11, marginTop: 4 }}>
                                  Unitario: <strong style={{ color: '#ccc' }}>{formatCurrency(item.wholesalePrice)}</strong>
                                </div>
                              </div>
                              {/* Cantidad y subtotal */}
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ color: '#7a8a9a', fontSize: 12 }}>x<strong style={{ color: '#FFFFFF', fontSize: 15 }}>{item.quantity}</strong></div>
                                <div style={{ color: GOLD, fontWeight: 900, fontSize: 16, marginTop: 2 }}>{formatCurrency(item.wholesalePrice * item.quantity)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total + acciones */}
                      <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                        <div>
                          <div style={{ color: '#9aabb8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Total del pedido</div>
                          <div style={{ color: GOLD, fontSize: 26, fontWeight: 900 }}>{formatCurrency(pedido.total)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                          {/* Cambiar estado */}
                          <select
                            value={pedido.estado}
                            disabled={isUpdating}
                            onChange={e => handleEstadoChange(pedido.id, e.target.value as Estado)}
                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, padding: '8px 12px', color: '#e0e6f0', fontSize: 13, fontWeight: 700, cursor: isUpdating ? 'not-allowed' : 'pointer', outline: 'none' }}
                          >
                            <option value="pendiente"  style={{ background: NAVY2 }}>Pendiente</option>
                            <option value="confirmado" style={{ background: NAVY2 }}>Confirmado</option>
                            <option value="enviado"    style={{ background: NAVY2 }}>Enviado</option>
                          </select>

                          {/* Botón Excel individual */}
                          <button
                            onClick={() => exportarPedidoExcel(pedido)}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', borderRadius: 10, padding: '10px 20px', color: '#FFFFFF', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}
                          >
                            📊 Excel
                          </button>
                          {/* Botón imprimir */}
                          <button
                            onClick={() => printPedido(pedido)}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, background: GOLD_GRAD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0F3460', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}
                          >
                            🖨️ Imprimir pedido
                          </button>
                        </div>
                      </div>

                      {/* Info cliente */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px 20px' }}>
                        <div>
                          <div style={{ color: '#7a8a9a', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Email</div>
                          <div style={{ color: '#60A5FA', fontSize: 13 }}>{pedido.email}</div>
                        </div>
                        <div>
                          <div style={{ color: '#7a8a9a', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>WhatsApp</div>
                          <a href={`https://wa.me/${pedido.telefono.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4ADE80', fontSize: 13, textDecoration: 'none', fontWeight: 700 }}>
                            📱 {pedido.telefono}
                          </a>
                        </div>
                        <div>
                          <div style={{ color: '#7a8a9a', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Fecha del pedido</div>
                          <div style={{ color: '#ccc', fontSize: 13 }}>{formatDateTime(pedido.created_at)}</div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
