'use client'

import { useEffect, useState } from 'react'

interface Fila {
  id: number; titulo: string; emoji: string; subtitulo: string; categorias: string; orden: number; activo: boolean
}

const GOLD = '#D4AF37'

export default function HomeSeccionesPage() {
  const [filas, setFilas] = useState<Fila[]>([])
  const [cats, setCats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/home-filas')
      const d = await r.json()
      setFilas(Array.isArray(d) ? d : [])
    } catch {}
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
    setMsg(res.ok ? '✅ Fila guardada' : '❌ Error al guardar')
    setTimeout(() => setMsg(''), 4000)
  }

  async function agregar() {
    const res = await fetch('/api/admin/home-filas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Nueva fila', emoji: '🛍️', subtitulo: '', categorias: '', orden: (filas.at(-1)?.orden ?? 0) + 1, activo: true }),
    })
    if (res.ok) load(); else setMsg('❌ Falta crear la tabla home_filas (ver instrucciones)')
    setTimeout(() => setMsg(''), 6000)
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar esta fila de la home?')) return
    await fetch(`/api/admin/home-filas/${id}`, { method: 'DELETE' })
    load()
  }

  function toggleCat(f: Fila, cat: string) {
    const lista = f.categorias.split(',').map(s => s.trim()).filter(Boolean)
    const nueva = lista.includes(cat) ? lista.filter(c => c !== cat) : [...lista, cat]
    setLocal(f.id, { categorias: nueva.join(',') })
  }

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
        <p style={{ color: '#7a8a9a', fontSize: 13, marginTop: 0 }}>Editá las filas de productos que aparecen en la página principal. Elegí qué categorías muestra cada una (o "Destacados").</p>
        {msg && <div style={{ color: msg.startsWith('✅') ? '#4ADE80' : '#f87171', fontWeight: 700, marginBottom: 12 }}>{msg}</div>}

        {loading ? (
          <div style={{ color: '#7a8a9a', textAlign: 'center', padding: 40 }}>Cargando...</div>
        ) : filas.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14, padding: 30, color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>
            Todavía no hay filas configurables. Para activar este panel hay que crear la tabla una sola vez (te paso las instrucciones). Mientras tanto, la home usa las filas por defecto.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filas.map(f => {
              const esDest = (f.categorias || '').toUpperCase() === 'DESTACADOS'
              const seleccionadas = esDest ? [] : f.categorias.split(',').map(s => s.trim()).filter(Boolean)
              return (
                <div key={f.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
                    <input value={f.emoji} onChange={e => setLocal(f.id, { emoji: e.target.value })} placeholder="🛍️"
                      style={{ width: 56, textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 18 }} />
                    <input value={f.titulo} onChange={e => setLocal(f.id, { titulo: e.target.value })} placeholder="Título de la fila"
                      style={{ flex: 1, minWidth: 180, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 15, fontWeight: 700 }} />
                    <label style={{ color: '#cbd5e1', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      Orden <input type="number" value={f.orden} onChange={e => setLocal(f.id, { orden: Number(e.target.value) })} style={{ width: 56, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px', color: '#fff' }} />
                    </label>
                    <label style={{ color: '#cbd5e1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input type="checkbox" checked={f.activo} onChange={e => setLocal(f.id, { activo: e.target.checked })} /> Visible
                    </label>
                  </div>
                  <input value={f.subtitulo} onChange={e => setLocal(f.id, { subtitulo: e.target.value })} placeholder="Subtítulo (texto chico debajo del título)"
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px', color: '#cbd5e1', fontSize: 13, marginBottom: 12 }} />

                  <div style={{ color: GOLD, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>¿QUÉ MUESTRA ESTA FILA?</div>
                  <label style={{ color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={esDest} onChange={e => setLocal(f.id, { categorias: e.target.checked ? 'DESTACADOS' : '' })} />
                    ⭐ Mostrar los productos Destacados
                  </label>
                  {!esDest && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6, marginBottom: 12 }}>
                      {cats.map(c => (
                        <label key={c} style={{ color: '#cbd5e1', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: seleccionadas.includes(c) ? 'rgba(212,175,55,0.12)' : 'transparent', border: `1px solid ${seleccionadas.includes(c) ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 6, padding: '5px 8px' }}>
                          <input type="checkbox" checked={seleccionadas.includes(c)} onChange={() => toggleCat(f, c)} /> {c}
                        </label>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
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
