'use client'

import { useEffect, useState } from 'react'

interface Fila {
  id: number; titulo: string; emoji: string; subtitulo: string; categorias: string; orden: number; activo: boolean
}

const GOLD = '#D4AF37'

/* ── Selector de productos a mano (buscar + elegir) ── */
function ManualPicker({ value, onChange }: { value: string; onChange: (ids: string) => void }) {
  // value = "IDS:642,643"
  const ids = value.slice(4).split(',').map(s => s.trim()).filter(Boolean)
  const [term, setTerm] = useState('')
  const [resultados, setResultados] = useState<any[]>([])
  const [nombres, setNombres] = useState<Record<string, string>>({})
  const [buscando, setBuscando] = useState(false)

  // resolver nombres de los ya elegidos
  useEffect(() => {
    const faltan = ids.filter(id => !nombres[id])
    if (faltan.length === 0) return
    fetch('/api/productos-publicos?ids=' + faltan.join(','))
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setNombres(prev => ({ ...prev, ...Object.fromEntries(d.map((p: any) => [String(p.id), p.name])) })) })
      .catch(() => {})
  }, [value])

  // buscar
  useEffect(() => {
    const q = term.trim()
    if (q.length < 2) { setResultados([]); setBuscando(false); return }
    setBuscando(true)
    const t = setTimeout(async () => {
      try {
        const r = await fetch('/api/admin/productos?q=' + encodeURIComponent(q))
        const d = await r.json()
        setResultados(Array.isArray(d) ? d.slice(0, 12) : [])
      } catch { setResultados([]) }
      setBuscando(false)
    }, 350)
    return () => clearTimeout(t)
  }, [term])

  function agregar(p: any) {
    if (ids.includes(String(p.id))) return
    setNombres(prev => ({ ...prev, [String(p.id)]: p.nombre }))
    onChange('IDS:' + [...ids, String(p.id)].join(','))
  }
  function quitar(id: string) {
    onChange('IDS:' + ids.filter(x => x !== id).join(','))
  }

  return (
    <div>
      {/* Elegidos */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {ids.length === 0 && <span style={{ color: '#7a8a9a', fontSize: 12 }}>Todavía no elegiste productos. Buscalos abajo 👇</span>}
        {ids.map(id => (
          <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 12 }}>
            {nombres[id] || `#${id}`}
            <button onClick={() => quitar(id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 900 }}>✕</button>
          </span>
        ))}
      </div>
      {/* Buscador */}
      <input value={term} onChange={e => setTerm(e.target.value)} placeholder="🔍 Buscar producto por nombre o código para agregar..."
        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13 }} />
      {buscando && <div style={{ color: '#7a8a9a', fontSize: 12, marginTop: 6 }}>Buscando...</div>}
      {resultados.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, maxHeight: 220, overflowY: 'auto' }}>
          {resultados.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '5px 8px' }}>
              {p.imagen && <img src={(p.imagen || '').split('|')[0]} alt="" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4 }} />}
              <span style={{ flex: 1, color: '#cbd5e1', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</span>
              <button onClick={() => agregar(p)} disabled={ids.includes(String(p.id))}
                style={{ background: ids.includes(String(p.id)) ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 6, padding: '5px 10px', color: ids.includes(String(p.id)) ? '#7a8a9a' : '#0F3460', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                {ids.includes(String(p.id)) ? '✓' : '+ Agregar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HomeSeccionesPage() {
  const [filas, setFilas] = useState<Fila[]>([])
  const [cats, setCats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try { const r = await fetch('/api/admin/home-filas'); const d = await r.json(); setFilas(Array.isArray(d) ? d : []) } catch {}
    setLoading(false)
  }
  useEffect(() => {
    load()
    fetch('/api/cats').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setCats(d.map((c: any) => (c.name || c.nombre || '').toUpperCase()).filter(Boolean))
    }).catch(() => {})
  }, [])

  function setLocal(id: number, patch: Partial<Fila>) {
    setFilas(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f))
  }
  async function guardar(f: Fila) {
    const res = await fetch(`/api/admin/home-filas/${f.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: f.titulo, emoji: f.emoji, subtitulo: f.subtitulo, categorias: f.categorias, orden: f.orden, activo: f.activo }),
    })
    setMsg(res.ok ? '✅ Fila guardada' : '❌ Error al guardar'); setTimeout(() => setMsg(''), 4000)
  }
  async function agregar() {
    const res = await fetch('/api/admin/home-filas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Nueva fila', emoji: '🛍️', subtitulo: '', categorias: '', orden: (filas.at(-1)?.orden ?? 0) + 1, activo: true }),
    })
    if (res.ok) load(); else setMsg('❌ Falta crear la tabla home_filas'); setTimeout(() => setMsg(''), 6000)
  }
  async function eliminar(id: number) {
    if (!confirm('¿Eliminar esta fila de la home?')) return
    await fetch(`/api/admin/home-filas/${id}`, { method: 'DELETE' }); load()
  }
  function toggleCat(f: Fila, cat: string) {
    const lista = f.categorias.split(',').map(s => s.trim()).filter(Boolean)
    const nueva = lista.includes(cat) ? lista.filter(c => c !== cat) : [...lista, cat]
    setLocal(f.id, { categorias: nueva.join(',') })
  }

  const ModeBtn = ({ active, onClick, children }: any) => (
    <button onClick={onClick} style={{ borderRadius: 8, padding: '7px 12px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
      border: active ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.15)',
      background: active ? 'linear-gradient(135deg,#D4AF37,#F0C030)' : 'rgba(255,255,255,0.05)',
      color: active ? '#0F3460' : '#cbd5e1' }}>{children}</button>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', padding: '20px 16px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 10 }}>
          <h1 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 22, margin: 0 }}>🏠 Filas de la Home</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => (window.location.href = '/admin/dashboard')} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', color: '#ccc', fontWeight: 700, cursor: 'pointer' }}>← Panel</button>
            <button onClick={agregar} style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C030)', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#0F3460', fontWeight: 900, cursor: 'pointer' }}>+ Agregar fila</button>
          </div>
        </div>
        <p style={{ color: '#7a8a9a', fontSize: 13, marginTop: 0 }}>Editá las filas de la página principal. Cada fila puede mostrar categorías enteras, los destacados, o productos que elegís a mano.</p>
        {msg && <div style={{ color: msg.startsWith('✅') ? '#4ADE80' : '#f87171', fontWeight: 700, marginBottom: 12 }}>{msg}</div>}

        {loading ? (
          <div style={{ color: '#7a8a9a', textAlign: 'center', padding: 40 }}>Cargando...</div>
        ) : filas.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14, padding: 30, color: '#cbd5e1', fontSize: 14 }}>
            Todavía no hay filas. Si recién creaste la tabla, recargá la página.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filas.map(f => {
              const c = (f.categorias || '').toUpperCase()
              const modo = c === 'DESTACADOS' ? 'dest' : c.startsWith('IDS:') ? 'ids' : 'cat'
              const seleccionadas = modo === 'cat' ? f.categorias.split(',').map(s => s.trim()).filter(Boolean) : []
              return (
                <div key={f.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
                    <input value={f.emoji} onChange={e => setLocal(f.id, { emoji: e.target.value })} placeholder="🛍️" style={{ width: 56, textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 18 }} />
                    <input value={f.titulo} onChange={e => setLocal(f.id, { titulo: e.target.value })} placeholder="Título" style={{ flex: 1, minWidth: 180, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 15, fontWeight: 700 }} />
                    <label style={{ color: '#cbd5e1', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>Orden <input type="number" value={f.orden} onChange={e => setLocal(f.id, { orden: Number(e.target.value) })} style={{ width: 56, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px', color: '#fff' }} /></label>
                    <label style={{ color: '#cbd5e1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><input type="checkbox" checked={f.activo} onChange={e => setLocal(f.id, { activo: e.target.checked })} /> Visible</label>
                  </div>
                  <input value={f.subtitulo} onChange={e => setLocal(f.id, { subtitulo: e.target.value })} placeholder="Subtítulo" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px', color: '#cbd5e1', fontSize: 13, marginBottom: 12 }} />

                  <div style={{ color: GOLD, fontSize: 12, fontWeight: 800, marginBottom: 8 }}>¿QUÉ MUESTRA ESTA FILA?</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                    <ModeBtn active={modo === 'cat'} onClick={() => setLocal(f.id, { categorias: '' })}>📂 Categorías</ModeBtn>
                    <ModeBtn active={modo === 'dest'} onClick={() => setLocal(f.id, { categorias: 'DESTACADOS' })}>⭐ Destacados</ModeBtn>
                    <ModeBtn active={modo === 'ids'} onClick={() => setLocal(f.id, { categorias: 'IDS:' })}>✋ Productos a mano</ModeBtn>
                  </div>

                  {modo === 'cat' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6, marginBottom: 12 }}>
                      {cats.map(cat => (
                        <label key={cat} style={{ color: '#cbd5e1', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: seleccionadas.includes(cat) ? 'rgba(212,175,55,0.12)' : 'transparent', border: `1px solid ${seleccionadas.includes(cat) ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, padding: '5px 8px' }}>
                          <input type="checkbox" checked={seleccionadas.includes(cat)} onChange={() => toggleCat(f, cat)} /> {cat}
                        </label>
                      ))}
                    </div>
                  )}
                  {modo === 'dest' && <div style={{ color: '#7a8a9a', fontSize: 12, marginBottom: 12 }}>Muestra los productos marcados con ⭐ en la sección Productos.</div>}
                  {modo === 'ids' && <div style={{ marginBottom: 12 }}><ManualPicker value={f.categorias} onChange={(v) => setLocal(f.id, { categorias: v })} /></div>}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => guardar(f)} style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>✓ Guardar</button>
                    <button onClick={() => eliminar(f.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 16px', color: '#f87171', fontWeight: 700, cursor: 'pointer' }}>🗑️ Eliminar</button>
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
