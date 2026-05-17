'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Check, ChevronDown, ChevronRight } from 'lucide-react'

interface Categoria {
  id?: number
  nombre: string
  emoji: string
  descripcion: string
  imagen: string
  cantidad: number
}

interface Subcategoria {
  id?: number
  nombre: string
  emoji: string
  categoria_id: number
}

const EMPTY_CAT: Categoria = { nombre: '', emoji: '📦', descripcion: '', imagen: '', cantidad: 0 }
const GOLD = 'linear-gradient(135deg,#D4AF37,#F0C030)'
const EMOJIS = ['📦','💻','💄','🧸','🎮','🏺','🛏️','👜','📚','👓','👗','🌸','🛴','🎉','🐾','🔧','🏋️','🍔','🚗','🌿','🪆','🎒','🧦','🪴','🎨','🧴','🍭','🚿','🪑','🏠']

export default function CategoriasAdmin() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [subcategorias, setSubcategorias] = useState<Record<number, Subcategoria[]>>({})
  const [expandedCat, setExpandedCat] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Categoria>(EMPTY_CAT)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Subcategoria form
  const [showSubForm, setShowSubForm] = useState(false)
  const [subForm, setSubForm] = useState<Subcategoria>({ nombre: '', emoji: '📦', categoria_id: 0 })
  const [savingSub, setSavingSub] = useState(false)

  useEffect(() => { loadCategorias() }, [])

  async function loadCategorias() {
    setLoading(true)
    const res = await fetch('/api/admin/categorias')
    if (res.ok) setCategorias(await res.json())
    setLoading(false)
  }

  async function loadSubcategorias(categoria_id: number) {
    const res = await fetch(`/api/admin/subcategorias?categoria_id=${categoria_id}`)
    if (res.ok) {
      const data = await res.json()
      setSubcategorias(prev => ({ ...prev, [categoria_id]: data }))
    }
  }

  function toggleExpand(id: number) {
    if (expandedCat === id) {
      setExpandedCat(null)
    } else {
      setExpandedCat(id)
      loadSubcategorias(id)
    }
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'categorias')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setForm(f => ({ ...f, imagen: url }))
    }
    setUploadingImg(false)
  }

  async function handleSave() {
    setSaving(true)
    const isEdit = !!form.id
    const url = isEdit ? `/api/admin/categorias/${form.id}` : '/api/admin/categorias'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      setMsg(isEdit ? '✅ Categoría actualizada' : '✅ Categoría agregada')
      setShowForm(false)
      setForm(EMPTY_CAT)
      loadCategorias()
    } else {
      setMsg('❌ Error al guardar')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Borrar esta categoría y sus subcategorías?')) return
    await fetch(`/api/admin/categorias/${id}`, { method: 'DELETE' })
    loadCategorias()
  }

  async function handleSaveSub() {
    setSavingSub(true)
    const isEdit = !!subForm.id
    const url = isEdit ? `/api/admin/subcategorias/${subForm.id}` : '/api/admin/subcategorias'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subForm) })
    if (res.ok) {
      setMsg('✅ Subcategoría guardada')
      setShowSubForm(false)
      loadSubcategorias(subForm.categoria_id)
    } else {
      setMsg('❌ Error al guardar subcategoría')
    }
    setSavingSub(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleDeleteSub(sub: Subcategoria) {
    if (!confirm('¿Borrar esta subcategoría?')) return
    await fetch(`/api/admin/subcategorias/${sub.id}`, { method: 'DELETE' })
    loadSubcategorias(sub.categoria_id)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#030D1E 0%,#071633 100%)' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(212,175,55,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.push('/admin/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 }}>
          <ArrowLeft size={16} /> Volver
        </button>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: 0 }}>🗂️ Categorías / Rubros</h1>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        {msg && (
          <div style={{
            background: msg.startsWith('✅') ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${msg.startsWith('✅') ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            color: msg.startsWith('✅') ? '#86efac' : '#f87171', fontWeight: 700,
          }}>{msg}</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button onClick={() => { setForm(EMPTY_CAT); setShowForm(true) }}
            style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#030D1E', fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Agregar Rubro
          </button>
        </div>

        {/* Modal Categoría */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
            <div style={{ background: '#0a1628', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#fff', margin: 0, fontWeight: 900 }}>{form.id ? 'Editar Rubro' : 'Nuevo Rubro'}</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a9a' }}><X size={22} /></button>
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>NOMBRE</label>
                  <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="Ej: Juguetes" />
                </div>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 8 }}>EMOJI</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {EMOJIS.map(e => (
                      <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                        style={{ fontSize: 22, padding: '6px 8px', borderRadius: 8, cursor: 'pointer', background: form.emoji === e ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.07)', border: form.emoji === e ? '2px solid #D4AF37' : '1px solid transparent' }}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>DESCRIPCIÓN</label>
                  <input value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="Ej: Muñecos y peluches" />
                </div>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>FOTO DEL RUBRO</label>
                  {form.imagen && <img src={form.imagen} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                  <input type="file" ref={fileRef} onChange={handleUploadImage} accept="image/*" style={{ display: 'none' }} />
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploadingImg}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px dashed rgba(212,175,55,0.4)', borderRadius: 8, padding: '12px', color: '#D4AF37', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Upload size={16} />{uploadingImg ? 'Subiendo...' : form.imagen ? 'Cambiar foto' : 'Subir foto'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, color: '#ccc', fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#030D1E', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
                  <Check size={16} />{saving ? 'Guardando...' : 'GUARDAR RUBRO'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Subcategoría */}
        {showSubForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
            <div style={{ background: '#0a1628', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 400 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#fff', margin: 0, fontWeight: 900 }}>{subForm.id ? 'Editar Subcategoría' : 'Nueva Subcategoría'}</h2>
                <button onClick={() => setShowSubForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a9a' }}><X size={22} /></button>
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>NOMBRE</label>
                  <input value={subForm.nombre} onChange={e => setSubForm(f => ({ ...f, nombre: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="Ej: Peluches" />
                </div>
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 8 }}>EMOJI</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {EMOJIS.map(e => (
                      <button key={e} onClick={() => setSubForm(f => ({ ...f, emoji: e }))}
                        style={{ fontSize: 20, padding: '5px 7px', borderRadius: 8, cursor: 'pointer', background: subForm.emoji === e ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.07)', border: subForm.emoji === e ? '2px solid #D4AF37' : '1px solid transparent' }}>{e}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={() => setShowSubForm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, color: '#ccc', fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleSaveSub} disabled={savingSub} style={{ flex: 2, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#030D1E', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: savingSub ? 0.7 : 1 }}>
                  <Check size={16} />{savingSub ? 'Guardando...' : 'GUARDAR'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista categorías */}
        {loading ? (
          <div style={{ color: '#7a8a9a', textAlign: 'center', padding: 60 }}>Cargando...</div>
        ) : categorias.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 16, padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗂️</div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>No hay rubros todavía</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {categorias.map(c => (
              <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 14, overflow: 'hidden' }}>
                {/* Fila categoría */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                  {c.imagen && <img src={c.imagen} alt={c.nombre} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />}
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{c.emoji}</span>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 15, flex: 1 }}>{c.nombre}</span>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => toggleExpand(c.id!)}
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 12px', color: '#ccc', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {expandedCat === c.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Subcategorías
                    </button>
                    <button onClick={() => { setForm(c); setShowForm(true) }}
                      style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, padding: '7px 12px', color: '#D4AF37', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Pencil size={12} /> Editar
                    </button>
                    <button onClick={() => handleDelete(c.id!)}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '7px 12px', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Trash2 size={12} /> Borrar
                    </button>
                  </div>
                </div>

                {/* Subcategorías expandidas */}
                {expandedCat === c.id && (
                  <div style={{ borderTop: '1px solid rgba(212,175,55,0.1)', background: 'rgba(0,0,0,0.2)', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ color: '#7a8a9a', fontSize: 12, fontWeight: 700 }}>SUBCATEGORÍAS DE {c.nombre.toUpperCase()}</span>
                      <button
                        onClick={() => { setSubForm({ nombre: '', emoji: '📦', categoria_id: c.id! }); setShowSubForm(true) }}
                        style={{ background: GOLD, border: 'none', borderRadius: 8, padding: '6px 12px', color: '#030D1E', fontWeight: 900, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Plus size={12} /> Agregar
                      </button>
                    </div>

                    {!subcategorias[c.id!] ? (
                      <div style={{ color: '#7a8a9a', fontSize: 12, padding: '8px 0' }}>Cargando...</div>
                    ) : subcategorias[c.id!].length === 0 ? (
                      <div style={{ color: '#7a8a9a', fontSize: 12, padding: '8px 0' }}>No hay subcategorías. Hacé clic en + Agregar.</div>
                    ) : (
                      <div style={{ display: 'grid', gap: 6 }}>
                        {subcategorias[c.id!].map(sub => (
                          <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px' }}>
                            <span style={{ fontSize: 16 }}>{sub.emoji}</span>
                            <span style={{ color: '#ccc', fontWeight: 700, fontSize: 13, flex: 1 }}>{sub.nombre}</span>
                            <button onClick={() => { setSubForm(sub); setShowSubForm(true) }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', padding: 4 }}>
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => handleDeleteSub(sub)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 4 }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
