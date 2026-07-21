'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

function playOrderSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = ctx.currentTime
    // Caja registradora "cha-ching": dos campanitas brillantes ascendentes.
    // Cada "ding" se arma con varios armónicos para un timbre metálico de campana.
    const dings = [
      { start: 0.0,  freqs: [880, 1760],        dur: 0.13, gain: 0.30 }, // "cha" (corto)
      { start: 0.11, freqs: [1320, 1980, 2640], dur: 0.70, gain: 0.40 }, // "ching" (con cola)
    ]
    dings.forEach(d => {
      d.freqs.forEach((f, i) => {
        const osc  = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle' // más brillo/metal que la onda sine
        osc.frequency.value = f
        osc.connect(gain)
        gain.connect(ctx.destination)
        const t = now + d.start
        const g = d.gain / (i + 1) // armónicos superiores más suaves
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(g, t + 0.006)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + d.dur)
        osc.start(t)
        osc.stop(t + d.dur + 0.05)
      })
    })
  } catch {}
}

const GOLD      = '#FF6A3D'
const GOLD_GRAD = 'linear-gradient(135deg,#FF6A3D,#FF8A63)'
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

  const filas = items.map((item, idx) => `
    <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#fafafa'};">
      <td style="padding:12px 10px;border-bottom:1px solid #F0F0F0;vertical-align:middle;text-align:center;width:90px;">
        ${item.image
          ? `<img src="${item.image}" width="72" height="72" style="border-radius:10px;object-fit:contain;display:block;margin:auto;border:1px solid #E5E7EB;background:#fff;padding:3px;" />`
          : `<div style="width:72px;height:72px;background:#F3F4F6;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:28px;margin:auto;">📦</div>`
        }
      </td>
      <td style="padding:12px 14px;border-bottom:1px solid #F0F0F0;vertical-align:middle;">
        ${item.brand ? `<div style="font-size:9px;color:#FF6A3D;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">${item.brand}</div>` : ''}
        <div style="font-weight:800;font-size:14px;color:#111827;margin-bottom:4px;line-height:1.3;">${item.name}</div>
        ${item.category ? `<span style="display:inline-block;background:#F3F4F6;color:#6B7280;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;padding:2px 8px;border-radius:4px;">${item.category}</span>` : ''}
      </td>
      <td style="padding:12px 10px;border-bottom:1px solid #F0F0F0;vertical-align:middle;text-align:center;white-space:nowrap;">
        <div style="font-size:13px;color:#6B7280;">${formatCurrency(item.wholesalePrice)}</div>
        <div style="font-size:10px;color:#9CA3AF;margin-top:2px;">c/u</div>
      </td>
      <td style="padding:12px 10px;border-bottom:1px solid #F0F0F0;vertical-align:middle;text-align:center;">
        <div style="background:#0F3460;color:#fff;font-weight:900;font-size:16px;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:auto;">${item.quantity}</div>
        <div style="font-size:9px;color:#9CA3AF;margin-top:3px;">unid.</div>
      </td>
      <td style="padding:12px 14px;border-bottom:1px solid #F0F0F0;vertical-align:middle;text-align:right;white-space:nowrap;">
        <div style="font-weight:900;font-size:17px;color:#FF6A3D;">${formatCurrency(item.wholesalePrice * item.quantity)}</div>
      </td>
    </tr>
  `).join('')

  const estadoColor = pedido.estado === 'enviado' ? '#2563EB' : pedido.estado === 'confirmado' ? '#16a34a' : '#D97706'
  const estadoBg   = pedido.estado === 'enviado' ? '#EFF6FF' : pedido.estado === 'confirmado' ? '#F0FDF4' : '#FFFBEB'

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Pedido — ${pedido.nombre} — ${fecha}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #111827; background: #F5F5F7; }
    .page { max-width: 820px; margin: 0 auto; padding: 32px 24px 48px; }
    .card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 16px rgba(0,0,0,0.08); margin-bottom: 16px; }
    @media print {
      body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page { padding: 0; }
      .card { box-shadow: none; border: 1px solid #E5E7EB; border-radius: 10px; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Botones acción -->
  <div class="no-print" style="display:flex;gap:10px;justify-content:flex-end;margin-bottom:20px;">
    <button onclick="window.print()" style="background:linear-gradient(135deg,#FF6A3D,#FF8A63);border:none;border-radius:10px;padding:12px 28px;font-weight:900;font-size:14px;cursor:pointer;color:#fff;box-shadow:0 4px 12px rgba(255,106,61,0.4);">
      🖨️ Imprimir / Guardar PDF
    </button>
  </div>

  <!-- Header -->
  <div class="card">
    <div style="background:linear-gradient(135deg,#0F3460 0%,#1a4a8a 100%);padding:24px 28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-size:24px;font-weight:900;color:#FF6A3D;letter-spacing:0.04em;">MAYORISTA UNIVERSAL</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:3px;">mayoristauniversal.com</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.08em;">Pedido</div>
        <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:0.06em;">${pedido.id.slice(0,8).toUpperCase()}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:2px;">${fecha}</div>
      </div>
    </div>

    <!-- Datos cliente -->
    <div style="padding:20px 28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px 24px;border-bottom:1px solid #F3F4F6;">
      <div>
        <div style="font-size:9px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">👤 Cliente</div>
        <div style="font-size:16px;font-weight:800;color:#111827;">${pedido.nombre}</div>
      </div>
      <div>
        <div style="font-size:9px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">📧 Email</div>
        <div style="font-size:13px;color:#2563EB;font-weight:600;">${pedido.email}</div>
      </div>
      <div>
        <div style="font-size:9px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">📱 WhatsApp</div>
        <div style="font-size:14px;font-weight:700;color:#111827;">${pedido.telefono || '—'}</div>
      </div>
      <div>
        <div style="font-size:9px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">📦 Estado</div>
        <span style="display:inline-block;background:${estadoBg};color:${estadoColor};font-size:12px;font-weight:800;padding:4px 12px;border-radius:99px;border:1.5px solid ${estadoColor};">${ESTADO_LABELS[pedido.estado] || pedido.estado}</span>
      </div>
    </div>

    <!-- Resumen productos -->
    <div style="padding:10px 28px;background:#F9FAFB;display:flex;align-items:center;gap:8px;">
      <span style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.06em;">📦 ${items.length} artículo${items.length !== 1 ? 's' : ''} · ${totalUnidades} unidades en total</span>
    </div>
  </div>

  <!-- Tabla productos -->
  <div class="card">
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#F8F9FA;">
          <th style="padding:10px 10px;text-align:center;font-size:10px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;width:90px;">Foto</th>
          <th style="padding:10px 14px;text-align:left;font-size:10px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;">Producto</th>
          <th style="padding:10px 10px;text-align:center;font-size:10px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;width:90px;">P. Unit.</th>
          <th style="padding:10px 10px;text-align:center;font-size:10px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;width:70px;">Cant.</th>
          <th style="padding:10px 14px;text-align:right;font-size:10px;color:#6B7280;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;width:110px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
  </div>

  <!-- Total + Pago -->
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:20px 28px;background:linear-gradient(135deg,#0F3460,#1a4a8a);">
      <div>
        <div style="color:rgba(255,255,255,0.55);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Total del pedido</div>
        <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:3px;">${totalUnidades} unidades · ${items.length} artículo${items.length !== 1 ? 's' : ''}</div>
      </div>
      <div style="color:#FF6A3D;font-size:36px;font-weight:900;letter-spacing:0.02em;">${formatCurrency(pedido.total)}</div>
    </div>
    <div style="padding:16px 28px;display:flex;align-items:center;gap:10px;">
      <span style="font-size:18px;">💳</span>
      <div>
        <div style="font-size:10px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:2px;">Método de pago</div>
        <div style="font-size:13px;color:#374151;">Mercado Pago — Alias: <strong style="color:#009ee3;">ruby.mena.1972</strong> — Titular: Andres Ruben Menalled</div>
      </div>
    </div>
  </div>

  <div style="text-align:center;color:#9CA3AF;font-size:10px;margin-top:8px;">Mayorista Universal · mayoristauniversal.com · Generado el ${fecha}</div>
</div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=920')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

type Orden = 'fecha-desc' | 'fecha-asc' | 'total-desc' | 'total-asc'

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
  const [orden,      setOrden]      = useState<Orden>('fecha-desc')
  const [alertaActiva, setAlertaActiva] = useState(false)
  const [nuevosIds, setNuevosIds]   = useState<string[]>([])
  const alertaRef = useRef(false)
  const pedidosRef = useRef<Pedido[]>([])

  // Mantener una referencia siempre actualizada de los pedidos en pantalla
  useEffect(() => { pedidosRef.current = pedidos }, [pedidos])

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

  // Alerta de nuevos pedidos: chequeo periódico con la API admin (service role).
  // No usa la llave pública (anon), así que funciona con la tabla protegida por RLS.
  useEffect(() => {
    if (!alertaActiva) return
    const interval = setInterval(async () => {
      try {
        const res  = await fetch('/api/admin/pedidos')
        const data = await res.json()
        if (!Array.isArray(data)) return
        const prevIds = new Set(pedidosRef.current.map(p => p.id))
        const nuevos  = data.filter((p: Pedido) => !prevIds.has(p.id))
        setPedidos(data)
        if (nuevos.length > 0) {
          setNuevosIds(ids => [...ids, ...nuevos.map((p: Pedido) => p.id)])
          playOrderSound()
          if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300])
          nuevos.forEach((p: Pedido) =>
            setTimeout(() => setNuevosIds(ids => ids.filter(id => id !== p.id)), 10000)
          )
        }
      } catch {}
    }, 15000)
    return () => clearInterval(interval)
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

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
    setUpdatingId(id)
    try {
      const res  = await fetch('/api/admin/pedidos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.ok) {
        setPedidos(prev => prev.filter(p => p.id !== id))
      } else {
        alert('Error al eliminar: ' + (data.error || 'desconocido'))
      }
    } catch {
      alert('Error de conexión al eliminar')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = pedidos
    .filter(p => {
      const matchFiltro = filtro === 'todos' || p.estado === filtro
      const q           = search.toLowerCase()
      const matchSearch =
        !q ||
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.email  || '').toLowerCase().includes(q)
      return matchFiltro && matchSearch
    })
    .sort((a, b) => {
      if (orden === 'fecha-desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (orden === 'fecha-asc')  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (orden === 'total-desc') return Number(b.total) - Number(a.total)
      if (orden === 'total-asc')  return Number(a.total) - Number(b.total)
      return 0
    })

  // Genera HTML tabla para Excel con imágenes embebidas
  function buildExcelHTML(filas: { fecha: string; id: string; cliente: string; email: string; telefono: string; estado: string; marca: string; nombre: string; categoria: string; cantidad: number; precioUnit: number; subtotal: number; totalPedido: string; image: string }[]) {
    const th = (t: string) => `<th style="background:#0F3460;color:#FF6A3D;font-weight:bold;padding:8px 10px;border:1px solid #ccc;white-space:nowrap;">${t}</th>`
    const td = (t: string, bold = false) => `<td style="padding:6px 10px;border:1px solid #ddd;vertical-align:middle;${bold ? 'font-weight:bold;' : ''}">${t}</td>`
    const rows = filas.map(f => `<tr>
      ${td(f.fecha)}${td(f.id)}${td(f.cliente, true)}${td(f.email)}${td(f.telefono)}${td(f.estado)}${td(f.marca)}${td(f.nombre, true)}${td(f.categoria)}
      ${td(String(f.cantidad))}
      ${td(`$${f.precioUnit.toLocaleString('es-AR')}`)}
      ${td(`$${f.subtotal.toLocaleString('es-AR')}`)}
      ${td(f.totalPedido ? `$${Number(f.totalPedido).toLocaleString('es-AR')}` : '', true)}
      <td style="padding:4px;border:1px solid #ddd;text-align:center;vertical-align:middle;">${f.image ? `<img src="${f.image}" width="70" height="70" style="object-fit:contain;display:block;margin:auto;" />` : '—'}</td>
    </tr>`).join('')
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Pedidos</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
<style>table{border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;}tr:nth-child(even){background:#F9FAFB;}</style></head>
<body><table>
<thead><tr>${[th('Fecha'),th('ID'),th('Cliente'),th('Email'),th('Teléfono'),th('Estado'),th('Marca'),th('Producto'),th('Categoría'),th('Cant.'),th('P.Unit.'),th('Subtotal'),th('Total'),th('Foto')].join('')}</tr></thead>
<tbody>${rows}</tbody></table></body></html>`
  }

  // Exportar UN pedido individual a Excel con imágenes embebidas (base64)
  async function exportarPedidoExcel(pedido: Pedido) {
    const items = (pedido.items || []).map(normItem)
    const fecha = formatDateTime(pedido.created_at)

    // Obtener imágenes como base64
    const imageUrls = Array.from(new Set(items.map(i => i.image).filter(Boolean)))
    let imgMap: Record<string, string> = {}
    if (imageUrls.length > 0) {
      try {
        const res = await fetch('/api/admin/images-base64', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: imageUrls }),
        })
        if (res.ok) imgMap = await res.json()
      } catch {}
    }

    const filas = items.map((item, idx) => ({
      fecha: idx === 0 ? fecha : '',
      id: idx === 0 ? pedido.id.slice(0, 8).toUpperCase() : '',
      cliente: idx === 0 ? pedido.nombre : '',
      email: idx === 0 ? pedido.email : '',
      telefono: idx === 0 ? (pedido.telefono || '') : '',
      estado: idx === 0 ? (ESTADO_LABELS[pedido.estado] || pedido.estado) : '',
      marca: item.brand || '',
      nombre: item.name,
      categoria: item.category || '',
      cantidad: item.quantity,
      precioUnit: item.wholesalePrice,
      subtotal: item.wholesalePrice * item.quantity,
      totalPedido: idx === 0 ? String(pedido.total) : '',
      image: imgMap[item.image] || item.image || '',
    }))
    const html = buildExcelHTML(filas)
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `pedido-${pedido.nombre.replace(/\s+/g, '-')}-${pedido.id.slice(0, 8)}.xls`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalPedidos    = pedidos.length
  const totalPendientes = pedidos.filter(p => p.estado === 'pendiente').length
  const totalEnviados   = pedidos.filter(p => p.estado === 'enviado').length

  // Exportar TODOS los pedidos a Excel con imágenes embebidas (base64)
  async function exportarExcel() {
    const pedidosExport = filtered.length > 0 ? filtered : pedidos
    const filas: Parameters<typeof buildExcelHTML>[0] = []
    pedidosExport.forEach(p => {
      const items = (p.items || []).map(normItem)
      if (items.length === 0) {
        filas.push({ fecha: formatDateTime(p.created_at), id: p.id.slice(0,8).toUpperCase(), cliente: p.nombre, email: p.email, telefono: p.telefono||'', estado: ESTADO_LABELS[p.estado]||p.estado, marca:'', nombre:'', categoria:'', cantidad:0, precioUnit:0, subtotal:0, totalPedido: String(p.total), image:'' })
      } else {
        items.forEach((item, idx) => filas.push({
          fecha: idx === 0 ? formatDateTime(p.created_at) : '',
          id: idx === 0 ? p.id.slice(0,8).toUpperCase() : '',
          cliente: idx === 0 ? p.nombre : '',
          email: idx === 0 ? p.email : '',
          telefono: idx === 0 ? (p.telefono||'') : '',
          estado: idx === 0 ? (ESTADO_LABELS[p.estado]||p.estado) : '',
          marca: item.brand||'',
          nombre: item.name,
          categoria: item.category||'',
          cantidad: item.quantity,
          precioUnit: item.wholesalePrice,
          subtotal: item.wholesalePrice * item.quantity,
          totalPedido: idx === 0 ? String(p.total) : '',
          image: item.image||'',
        }))
      }
    })

    // Obtener imágenes como base64
    const imageUrls = Array.from(new Set(filas.map(f => f.image).filter(Boolean)))
    let imgMap: Record<string, string> = {}
    if (imageUrls.length > 0) {
      try {
        const res = await fetch('/api/admin/images-base64', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: imageUrls }),
        })
        if (res.ok) imgMap = await res.json()
      } catch {}
    }
    const filasConImg = filas.map(f => ({ ...f, image: imgMap[f.image] || f.image }))

    const html  = buildExcelHTML(filasConImg)
    const blob  = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const url   = URL.createObjectURL(blob)
    const a     = document.createElement('a')
    const fecha = new Date().toISOString().slice(0, 10)
    a.href      = url
    a.download  = `pedidos-mayorista-${fecha}.xls`
    a.click()
    URL.revokeObjectURL(url)
  }
  const totalFacturado  = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0)

  function enviarWhatsApp(pedido: Pedido) {
    const items = (pedido.items || []).map(normItem)
    const totalUnidades = items.reduce((s, i) => s + i.quantity, 0)
    const lineas = items.map(i =>
      `• ${i.name} x${i.quantity} — ${formatCurrency(i.wholesalePrice * i.quantity)}`
    ).join('\n')

    const msg = [
      `¡Hola ${pedido.nombre}! 👋`,
      `Te confirmamos tu pedido en *Mayorista Universal* 🛒`,
      ``,
      `📦 *Pedido #${pedido.id.slice(0,8).toUpperCase()}*`,
      `📅 ${formatDateTime(pedido.created_at)}`,
      ``,
      `*Productos:*`,
      lineas,
      ``,
      `📦 ${items.length} artículo${items.length !== 1 ? 's' : ''} · ${totalUnidades} unidades`,
      `💰 *Total: ${formatCurrency(pedido.total)}*`,
      ``,
      `💳 *Pago vía Mercado Pago*`,
      `Alias: *ruby.mena.1972*`,
      `Titular: Andres Ruben Menalled`,
      ``,
      `Ante cualquier duda estamos a tu disposición. ¡Gracias por tu compra! 🙌`,
    ].join('\n')

    const tel = pedido.telefono.replace(/\D/g, '')
    const url = `https://wa.me/${tel.startsWith('54') ? tel : '54' + tel}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A' }}>

      {/* HEADER */}
      <div style={{
        background: '#1E293B',
        borderBottom: '1px solid rgba(255,106,61,0.3)',
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
              background: alertaActiva ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#FF6A3D,#FF8A63)',
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
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,106,61,0.18)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ color: '#7a8a9a', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Total pedidos</div>
              <div style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 900, marginTop: 4 }}>{totalPedidos}</div>
            </div>
            <div style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ color: '#FACC15', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Pendientes</div>
              <div style={{ color: '#FACC15', fontSize: 28, fontWeight: 900, marginTop: 4 }}>{totalPendientes}</div>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ color: '#60A5FA', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Enviados</div>
              <div style={{ color: '#60A5FA', fontSize: 28, fontWeight: 900, marginTop: 4 }}>{totalEnviados}</div>
            </div>
            <div style={{ background: 'rgba(255,106,61,0.07)', border: '1px solid rgba(255,106,61,0.25)', borderRadius: 14, padding: '16px 20px' }}>
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
          <select
            value={orden}
            onChange={e => setOrden(e.target.value as Orden)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px', color: '#ccc', fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            <option value="fecha-desc" style={{ background: '#1E293B' }}>Más nuevos primero</option>
            <option value="fecha-asc"  style={{ background: '#1E293B' }}>Más antiguos primero</option>
            <option value="total-desc" style={{ background: '#1E293B' }}>Mayor total primero</option>
            <option value="total-asc"  style={{ background: '#1E293B' }}>Menor total primero</option>
          </select>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,106,61,0.25)', borderRadius: 10, padding: '9px 16px', color: '#FFFFFF', fontSize: 13, outline: 'none', minWidth: 220 }}
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
                    border: `2px solid ${isNuevo ? '#22c55e' : isOpen ? 'rgba(255,106,61,0.5)' : 'rgba(255,106,61,0.18)'}`,
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 8px', color: '#9aabb8', fontSize: 11, fontWeight: 600 }}>
                        {formatDateTime(pedido.created_at)}
                      </div>
                      <div style={{ color: GOLD, fontSize: 20, fontWeight: 900 }}>{formatCurrency(pedido.total)}</div>
                      <span style={{ background: colores.bg, border: `1px solid ${colores.border}`, color: colores.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                        {ESTADO_LABELS[pedido.estado] || pedido.estado}
                      </span>
                      {/* WhatsApp rápido */}
                      {pedido.telefono && (
                        <a
                          href={`https://wa.me/${pedido.telefono.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.35)', borderRadius: 8, fontSize: 16, textDecoration: 'none', flexShrink: 0 }}
                          title={`WhatsApp: ${pedido.telefono}`}
                        >
                          📱
                        </a>
                      )}
                      {/* Confirmar rápido (solo si está pendiente) */}
                      {pedido.estado === 'pendiente' && (
                        <button
                          onClick={e => { e.stopPropagation(); handleEstadoChange(pedido.id, 'confirmado') }}
                          disabled={isUpdating}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 8, padding: '5px 10px', color: '#4ADE80', fontSize: 12, fontWeight: 800, cursor: isUpdating ? 'not-allowed' : 'pointer', flexShrink: 0 }}
                          title="Confirmar pedido"
                        >
                          ✓ Confirmar
                        </button>
                      )}
                      {/* Eliminar */}
                      <button
                        onClick={e => { e.stopPropagation(); handleEliminar(pedido.id) }}
                        disabled={isUpdating}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '5px 10px', color: '#F87171', fontSize: 12, fontWeight: 800, cursor: isUpdating ? 'not-allowed' : 'pointer', flexShrink: 0 }}
                        title="Eliminar pedido"
                      >
                        🗑
                      </button>
                      <span style={{ color: '#7a8a9a', fontSize: 18 }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* ── DETALLE EXPANDIDO ── */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid rgba(255,106,61,0.2)', padding: '20px' }}>

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
                      <div style={{ background: 'rgba(255,106,61,0.08)', border: '1px solid rgba(255,106,61,0.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
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
                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,106,61,0.3)', borderRadius: 8, padding: '8px 12px', color: '#e0e6f0', fontSize: 13, fontWeight: 700, cursor: isUpdating ? 'not-allowed' : 'pointer', outline: 'none' }}
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
                          {/* Botón WhatsApp */}
                          {pedido.telefono && (
                            <button
                              onClick={() => enviarWhatsApp(pedido)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#25D366,#128C7E)', border: 'none', borderRadius: 10, padding: '10px 20px', color: '#FFFFFF', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}
                            >
                              💬 Enviar por WhatsApp
                            </button>
                          )}
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
