'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Check } from 'lucide-react'

interface Producto {
  id?: number
  nombre: string
  marca: string
  categoria: string
  precio: number
  precio_mayorista: number
  pedido_minimo: number
  imagen: string
  badge: string
  descuento: number
  ubicacion: string
}

const EMPTY: Producto = {
  nombre: '', marca: '', categoria: '', precio: 0,
  precio_mayorista: 0, pedido_minimo: 1,
  imagen: '', badge: '', descuento: 0, ubicacion: 'Buenos Aires',
}

const GOLD = 'linear-gradient(135deg,#D4AF37,#F0C030)'

export default function ProductosAdmin() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<{id: number, nombre: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Producto>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadProductos(); loadCategorias() }, [])

  async function loadCategorias() {
    const res = await fetch('/api/admin/categorias')
    if (res.ok) setCategorias(await res.json())
  }

  async function loadProductos() {
    setLoading(true)
    const res = await fetch('/api/admin/productos')
    if (res.ok) setProductos(await res.json())
    setLoading(false)
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'productos')
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
    const url = isEdit ? `/api/admin/productos/${form.id}` : '/api/admin/productos'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setMsg(isEdit ? '✅ Producto actualizado' : '✅ Producto agregado')
      setShowForm(false)
      setForm(EMPTY)
      loadProductos()
    } else {
      setMsg('❌ Error al guardar')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Borrar este producto?')) return
    await fetch(`/api/admin/productos/${id}`, { method: 'DELETE' })
    loadProductos()
  }

  function handleEdit(p: Producto) {
    setForm(p)
    setShowForm(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#030D1E 0%,#071633 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <button onClick={() => router.push('/admin/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 }}>
          <ArrowLeft size={16} /> Volver
        </button>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: 0 }}>📦 Productos</h1>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
        {/* Toast */}
        {msg && (
          <div style={{
            background: msg.startsWith('✅') ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${msg.startsWith('✅') ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            color: msg.startsWith('✅') ? '#86efac' : '#f87171', fontWeight: 700,
          }}>{msg}</div>
        )}

        {/* Botón agregar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button
            onClick={() => { setForm(EMPTY); setShowForm(true) }}
            style={{
              background: GOLD, border: 'none', borderRadius: 10,
              padding: '10px 20px', color: '#030D1E', fontWeight: 900, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
            <Plus size={16} /> Agregar Producto
          </button>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}>
            <div style={{
              background: '#0a1628', border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: 20, padding: 28, width: '100%', maxWidth: 560,
              maxHeight: '90vh', overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#fff', margin: 0, fontWeight: 900 }}>
                  {form.id ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a9a' }}>
                  <X size={22} />
                </button>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                {[
                  { label: 'Nombre del producto', key: 'nombre', type: 'text' },
                  { label: 'Marca', key: 'marca', type: 'text' },
                  { label: 'Precio minorista ($)', key: 'precio', type: 'number' },
                  { label: 'Precio mayorista ($)', key: 'precio_mayorista', type: 'number' },
                  { label: 'Pedido mínimo (unidades)', key: 'pedido_minimo', type: 'number' },
                  { label: 'Descuento (%)', key: 'descuento', type: 'number' },
                  { label: 'Ubicación', key: 'ubicacion', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      {label.toUpperCase()}
                    </label>
                    <input
                      type={type}
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: 8, padding: '10px 12px',
                        color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}

                {/* Categoría dropdown */}
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    CATEGORÍA
                  </label>
                  <select
                    value={form.categoria}
                    onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                    style={{
                      width: '100%', background: '#0a1628',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: 8, padding: '10px 12px',
                      color: form.categoria ? '#fff' : '#7a8a9a', fontSize: 14, outline: 'none',
                    }}>
                    <option value="">Seleccioná una categoría</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.nombre}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Badge */}
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    ETIQUETA
                  </label>
                  <select
                    value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                    style={{
                      width: '100%', background: '#0a1628',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: 8, padding: '10px 12px',
                      color: '#fff', fontSize: 14, outline: 'none',
                    }}>
                    <option value="">Sin etiqueta</option>
                    <option value="OFERTA">OFERTA</option>
                    <option value="NUEVO">NUEVO</option>
                    <option value="HOT">HOT</option>
                    <option value="TOP">TOP</option>
                  </select>
                </div>

                {/* Imagen */}
                <div>
                  <label style={{ color: '#D4AF37', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    FOTO DEL PRODUCTO
                  </label>
                  {form.imagen && (
                    <img src={form.imagen} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                  )}
                  <input type="file" ref={fileRef} onChange={handleUploadImage} accept="image/*" style={{ display: 'none' }} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingImg}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.07)',
                      border: '1px dashed rgba(212,175,55,0.4)',
                      borderRadius: 8, padding: '12px',
                      color: '#D4AF37', fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                    <Upload size={16} />
                    {uploadingImg ? 'Subiendo foto...' : form.imagen ? 'Cambiar foto' : 'Subir foto'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={() => setShowForm(false)}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, padding: 12,
                    color: '#ccc', fontWeight: 700, cursor: 'pointer',
                  }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{
                    flex: 2, background: GOLD,
                    border: 'none', borderRadius: 10, padding: 12,
                    color: '#030D1E', fontWeight: 900, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: saving ? 0.7 : 1,
                  }}>
                  <Check size={16} />
                  {saving ? 'Guardando...' : 'GUARDAR PRODUCTO'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        {loading ? (
          <div style={{ color: '#7a8a9a', textAlign: 'center', padding: 60 }}>Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: 16, padding: 60, textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 18, marginBottom: 8 }}>No hay productos todavía</div>
            <div style={{ color: '#7a8a9a', fontSize: 13 }}>Hacé clic en "Agregar Producto" para empezar</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {productos.map(p => (
              <div key={p.id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: 14, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                {p.imagen && (
                  <img src={p.imagen} alt={p.nombre}
                    style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 900, fontSize: 15, marginBottom: 2 }}>{p.nombre}</div>
                  <div style={{ color: '#7a8a9a', fontSize: 12 }}>
                    {p.marca} · {p.categoria} · Mayorista: <span style={{ color: '#D4AF37', fontWeight: 700 }}>${p.precio_mayorista?.toLocaleString('es-AR')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => handleEdit(p)}
                    style={{
                      background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                      borderRadius: 8, padding: '8px 12px',
                      color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700,
                    }}>
                    <Pencil size={13} /> Editar
                  </button>
                  <button onClick={() => handleDelete(p.id!)}
                    style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 8, padding: '8px 12px',
                      color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700,
                    }}>
                    <Trash2 size={13} /> Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
