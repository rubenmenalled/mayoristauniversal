'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Check, FileSpreadsheet, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

interface Producto {
  id?: number
  nombre: string
  marca: string
  categoria: string
  subcategoria: string
  precio: number
  precio_mayorista: number
  pedido_minimo: number
  imagen: string
  badge: string
  descuento: number
  ubicacion: string
}

const EMPTY: Producto = {
  nombre: '', marca: '', categoria: '', subcategoria: '', precio: 0,
  precio_mayorista: 0, pedido_minimo: 1,
  imagen: '', badge: '', descuento: 0, ubicacion: 'Buenos Aires',
}

const GOLD = 'linear-gradient(135deg,#FF6A3D,#FF8A63)'

export default function ProductosAdmin() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [soloDestacados, setSoloDestacados] = useState(false)
  const [resultados, setResultados] = useState<Producto[]>([])
  const [destacados, setDestacados] = useState<Producto[]>([])
  const [buscando, setBuscando] = useState(false)
  const [categorias, setCategorias] = useState<{id: number, nombre: string}[]>([])
  const [subcategorias, setSubcategorias] = useState<{id: number, nombre: string, categoria_id: number}[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Producto>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [msg, setMsg] = useState('')
  const [importing, setImporting] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importPreview, setImportPreview] = useState<any[]>([])
  const [importCategoria, setImportCategoria] = useState('')
  const [importSubcategoria, setImportSubcategoria] = useState('')
  const [importSubcategorias, setImportSubcategorias] = useState<{id: number, nombre: string}[]>([])
  const [showBorrarModal, setShowBorrarModal] = useState(false)
  const [borrarCat, setBorrarCat] = useState('')
  const [borrarSubcat, setBorrarSubcat] = useState('')
  const [borrarMode, setBorrarMode] = useState<'cat'|'subcat'>('cat')
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set())
  const [showAsignarModal, setShowAsignarModal] = useState(false)
  const [asignarCat, setAsignarCat] = useState('')
  const [asignarSubcats, setAsignarSubcats] = useState<{id: number, nombre: string}[]>([])
  const [asignarSubcat, setAsignarSubcat] = useState('')
  const [asignarSelec, setAsignarSelec] = useState<Set<number>>(new Set())
  const fileRef = useRef<HTMLInputElement>(null)
  const csvRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadProductos(); loadCategorias(); loadDestacados() }, [])

  // Búsqueda en el servidor (toda la base, no solo lo cargado)
  useEffect(() => {
    const q = busqueda.trim()
    if (q.length < 2) { setResultados([]); setBuscando(false); return }
    setBuscando(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/productos?q=' + encodeURIComponent(q))
        const data = await res.json()
        setResultados(Array.isArray(data) ? data : [])
      } catch { setResultados([]) }
      setBuscando(false)
    }, 350)
    return () => clearTimeout(t)
  }, [busqueda])

  async function loadCategorias() {
    const res = await fetch('/api/admin/categorias')
    if (res.ok) setCategorias(await res.json())
  }

  async function loadSubcategorias(categoria_id: number) {
    const res = await fetch(`/api/admin/subcategorias?categoria_id=${categoria_id}`)
    if (res.ok) setSubcategorias(await res.json())
    else setSubcategorias([])
  }

  async function loadDestacados() {
    const res = await fetch('/api/admin/productos?destacados=1')
    if (res.ok) setDestacados(await res.json())
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
      // Reemplaza la foto PRINCIPAL conservando las demás de la galería (formato foto1|foto2|...)
      setForm(f => {
        const resto = (f.imagen || '').split('|').filter(Boolean).slice(1)
        return { ...f, imagen: [url, ...resto].join('|') }
      })
    }
    setUploadingImg(false)
  }

  function parseCSVManual(text: string): any[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim())
    if (lines.length < 2) return []
    // Detectar delimitador
    const delimiters = [',', ';', '\t', '|']
    const counts = delimiters.map(d => (lines[0].match(new RegExp(`\\${d === '|' ? '\\|' : d}`, 'g')) || []).length)
    const delim = delimiters[counts.indexOf(Math.max(...counts))]

    // Parser RFC 4180 que maneja "" como comilla escapada dentro de campos
    function parseLine(line: string): string[] {
      const values: string[] = []
      let cur = '', inQ = false, i = 0
      while (i < line.length) {
        const ch = line[i]
        if (ch === '"') {
          if (inQ && line[i + 1] === '"') { cur += '"'; i += 2 } // "" → comilla literal
          else { inQ = !inQ; i++ }
        } else if (ch === delim && !inQ) {
          values.push(cur.trim()); cur = ''; i++
        } else {
          cur += ch; i++
        }
      }
      values.push(cur.trim())
      return values
    }

    const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, ''))
    return lines.slice(1).map(line => {
      const values = parseLine(line)
      const obj: any = {}
      headers.forEach((h, idx) => { obj[h] = (values[idx] || '').replace(/^"|"$/g, '') })
      return obj
    }).filter(o => Object.values(o).some(v => v))
  }

  function handleCSVFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const isCSV = file.name.toLowerCase().endsWith('.csv')
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        if (isCSV) {
          // CSV siempre con parser manual (maneja "" y delimitadores raros)
          const text = new TextDecoder().decode(ev.target?.result as ArrayBuffer)
          const rows = parseCSVManual(text)
          setImportPreview(rows)
          setShowImport(true)
        } else {
          // Excel .xlsx con XLSX
          const data = new Uint8Array(ev.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })
          setImportPreview(rows)
          setShowImport(true)
        }
      } catch {
        setMsg('❌ No se pudo leer el archivo. Asegurate que sea CSV o Excel (.xlsx)')
        setTimeout(() => setMsg(''), 4000)
      }
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  function downloadTemplate() {
    const header = 'nombre,marca,categoria,precio,precio_mayorista,pedido_minimo,imagen,badge,descuento,ubicacion'
    const example = 'Auriculares Bluetooth,Samsung,Electrónica,15000,9500,6,https://url-foto.com/foto.jpg,NUEVO,10,Buenos Aires'
    const blob = new Blob([header + '\n' + example], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'template_productos.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport() {
    if (importPreview.length === 0) return
    setImporting(true)
    try {
      const res = await fetch('/api/admin/productos/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productos: importPreview, categoriaDefault: importCategoria, subcategoriaDefault: importSubcategoria }),
      })
      const data = await res.json()
      if (res.ok && data.insertados > 0) {
        setMsg(`✅ Se importaron ${data.insertados} productos correctamente${data.errores?.length ? ` (${data.errores.length} errores)` : ''}`)
        setShowImport(false)
        setImportPreview([])
        loadProductos()
      } else if (res.status === 401) {
        setMsg('❌ Sesión expirada. Cerrá sesión y volvé a entrar.')
      } else {
        const detalle = data.errores?.join(', ') || data.error || 'Error desconocido'
        setMsg(`❌ No se pudieron subir: ${detalle}`)
      }
    } catch (err) {
      setMsg('❌ Error de conexión. Intentá de nuevo.')
    }
    setImporting(false)
    setTimeout(() => setMsg(''), 8000)
  }

  async function handleSave() {
    setSaving(true)
    const isEdit = !!form.id
    const url = isEdit ? `/api/admin/productos/${form.id}` : '/api/admin/productos'
    const method = isEdit ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setMsg(isEdit ? '✅ Producto actualizado' : '✅ Producto agregado')
        setShowForm(false)
        setForm(EMPTY)
        loadProductos()
      } else {
        setMsg(`❌ Error: ${data.error || JSON.stringify(data)}`)
      }
    } catch (e: any) {
      setMsg(`❌ Error de conexión: ${e.message}`)
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 8000)
  }

  async function toggleDestacado(p: Producto) {
    const nuevo = p.badge === 'DESTACADO' ? '' : 'DESTACADO'
    setProductos(prev => prev.map(x => x.id === p.id ? { ...x, badge: nuevo } : x)) // optimista
    setResultados(prev => prev.map(x => x.id === p.id ? { ...x, badge: nuevo } : x))
    setDestacados(prev => nuevo === 'DESTACADO'
      ? (prev.some(x => x.id === p.id) ? prev : [{ ...p, badge: nuevo }, ...prev])
      : prev.filter(x => x.id !== p.id))
    try {
      await fetch(`/api/admin/productos/${p.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badge: nuevo }),
      })
    } catch {
      setProductos(prev => prev.map(x => x.id === p.id ? { ...x, badge: p.badge } : x)) // revertir si falla
      setResultados(prev => prev.map(x => x.id === p.id ? { ...x, badge: p.badge } : x))
      setDestacados(prev => nuevo === 'DESTACADO'
        ? prev.filter(x => x.id !== p.id)
        : (prev.some(x => x.id === p.id) ? prev : [{ ...p }, ...prev]))
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Borrar este producto?')) return
    await fetch(`/api/admin/productos/${id}`, { method: 'DELETE' })
    loadProductos()
  }

  function handleEdit(p: Producto) {
    setForm(p)
    setShowForm(true)
    // Cargar subcategorías de la categoría del producto
    const cat = categorias.find(c => c.nombre === p.categoria)
    if (cat) loadSubcategorias(cat.id)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A' }}>
      {/* Header */}
      <div style={{
        background: '#1E293B',
        borderBottom: '1px solid rgba(255,106,61,0.3)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <button onClick={() => router.push('/admin/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF6A3D', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 }}>
          <ArrowLeft size={16} /> Volver
        </button>
        <h1 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 18, margin: 0 }}>📦 Productos</h1>
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

        {/* Botones */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {/* Template */}
          <button onClick={downloadTemplate}
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 10, padding: '10px 16px', color: '#ccc', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
            <Download size={15} /> Bajar plantilla CSV
          </button>
          {/* Importar CSV */}
          <input type="file" ref={csvRef} onChange={handleCSVFile} accept=".csv,.xlsx,.xls" style={{ display: 'none' }} />
          <button onClick={() => csvRef.current?.click()}
            style={{
              background: 'rgba(99,179,237,0.15)', border: '1px solid rgba(99,179,237,0.4)',
              borderRadius: 10, padding: '10px 16px', color: '#90cdf4', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
            <FileSpreadsheet size={15} /> Importar CSV / Excel
          </button>
          {/* Borrar por categoría */}
          {productos.length > 0 && (
            <select
              onChange={e => {
                const cat = e.target.value
                if (!cat) return
                e.target.value = ''
                const prods = cat === '__sin_categoria__'
                  ? productos.filter(p => !p.categoria)
                  : productos.filter(p => p.categoria === cat)
                setBorrarCat(cat)
                setBorrarSubcat('')
                setBorrarMode('cat')
                setSeleccionados(new Set(prods.map(p => p.id!)))
                setShowBorrarModal(true)
              }}
              defaultValue=""
              style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: '10px 16px', color: '#f87171', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', outline: 'none',
              }}>
              <option value="">🗑️ Borrar por categoría</option>
              {Array.from(new Set(productos.map(p => p.categoria).filter(Boolean))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__sin_categoria__">— Sin categoría —</option>
            </select>
          )}
          {/* Borrar por subcategoría */}
          {productos.length > 0 && (
            <select
              onChange={e => {
                const sub = e.target.value
                if (!sub) return
                e.target.value = ''
                const prods = productos.filter(p => p.subcategoria === sub)
                setBorrarSubcat(sub)
                setBorrarCat('')
                setBorrarMode('subcat')
                setSeleccionados(new Set(prods.map(p => p.id!)))
                setShowBorrarModal(true)
              }}
              defaultValue=""
              style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: '10px 16px', color: '#f87171', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', outline: 'none',
              }}>
              <option value="">🗑️ Borrar por subcategoría</option>
              {Array.from(new Set(productos.map(p => p.subcategoria).filter(Boolean))).sort().map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}
          {/* Asignar subcategoría */}
          {productos.length > 0 && (
            <select
              onChange={async e => {
                const cat = e.target.value
                if (!cat) return
                e.target.value = ''
                const catObj = categorias.find(c => c.nombre === cat)
                if (!catObj) return
                const res = await fetch(`/api/admin/subcategorias?categoria_id=${catObj.id}`)
                const subs = res.ok ? await res.json() : []
                setAsignarCat(cat)
                setAsignarSubcats(subs)
                setAsignarSubcat('')
                setAsignarSelec(new Set(productos.filter(p => p.categoria === cat).map(p => p.id!)))
                setShowAsignarModal(true)
              }}
              defaultValue=""
              style={{
                background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.3)',
                borderRadius: 10, padding: '10px 16px', color: '#90cdf4', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', outline: 'none',
              }}>
              <option value="">📂 Asignar subcategoría</option>
              {Array.from(new Set(productos.map(p => p.categoria).filter(Boolean))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
          {/* Borrar todos */}
          {productos.length > 0 && (
            <button onClick={async () => {
              if (!confirm(`¿Borrar los ${productos.length} productos existentes para reimportar?`)) return
              const res = await fetch('/api/admin/productos/borrar-todos', { method: 'DELETE' })
              if (res.ok) { setMsg('🗑️ Productos borrados. Ahora importá el archivo.'); loadProductos() }
              else setMsg('❌ Error al borrar')
              setTimeout(() => setMsg(''), 5000)
            }}
              style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: '10px 16px', color: '#f87171', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}>
              🗑️ Borrar todos
            </button>
          )}
          {/* Agregar uno */}
          <button
            onClick={() => { setForm(EMPTY); setShowForm(true) }}
            style={{
              background: GOLD, border: 'none', borderRadius: 10,
              padding: '10px 20px', color: '#FFFFFF', fontWeight: 900, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
            <Plus size={16} /> Agregar Producto
          </button>
        </div>

        {/* Modal Borrar productos de categoría */}
        {/* Modal Asignar Subcategoría */}
        {showAsignarModal && (() => {
          const lista = productos.filter(p => p.categoria === asignarCat)
          const todos = lista.every(p => asignarSelec.has(p.id!))
          return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 16 }}>
              <div style={{ background: '#0a1628', border: '1px solid rgba(99,179,237,0.4)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ color: '#90cdf4', margin: 0, fontWeight: 900, fontSize: 17 }}>
                    📂 Asignar subcategoría en "{asignarCat}"
                  </h2>
                  <button onClick={() => setShowAsignarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a9a' }}>
                    <X size={22} />
                  </button>
                </div>
                {/* Selector subcategoría */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#90cdf4', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>SUBCATEGORÍA A ASIGNAR</div>
                  {asignarSubcats.length === 0
                    ? <div style={{ color: '#f87171', fontSize: 13, padding: '10px 0' }}>Esta categoría no tiene subcategorías creadas. Creálas primero en Admin → Categorías.</div>
                    : <select value={asignarSubcat} onChange={e => setAsignarSubcat(e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(99,179,237,0.4)', borderRadius: 8, padding: '10px 12px', color: asignarSubcat ? '#fff' : '#7a8a9a', fontSize: 14, outline: 'none' }}>
                        <option value="">-- Elegí una subcategoría --</option>
                        {asignarSubcats.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                      </select>
                  }
                </div>
                {/* Seleccionar todos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <input type="checkbox" checked={todos} onChange={() => {
                    if (todos) setAsignarSelec(new Set())
                    else setAsignarSelec(new Set(lista.map(p => p.id!)))
                  }} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <span style={{ color: '#ccc', fontWeight: 700, fontSize: 13 }}>Seleccionar todos ({lista.length})</span>
                  <span style={{ marginLeft: 'auto', color: '#90cdf4', fontSize: 12, fontWeight: 700 }}>{asignarSelec.size} seleccionados</span>
                </div>
                {/* Lista */}
                <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {lista.map(p => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: asignarSelec.has(p.id!) ? 'rgba(99,179,237,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${asignarSelec.has(p.id!) ? 'rgba(99,179,237,0.3)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer' }}>
                      <input type="checkbox" checked={asignarSelec.has(p.id!)} onChange={() => {
                        setAsignarSelec(prev => {
                          const next = new Set(prev)
                          if (next.has(p.id!)) next.delete(p.id!); else next.add(p.id!)
                          return next
                        })
                      }} style={{ width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }} />
                      <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, flex: 1, lineHeight: 1.3 }}>{p.nombre}</span>
                      {p.subcategoria && <span style={{ color: '#FF6A3D', fontSize: 11, flexShrink: 0 }}>{p.subcategoria}</span>}
                    </label>
                  ))}
                </div>
                {/* Botones */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowAsignarModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, color: '#ccc', fontWeight: 700, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button
                    disabled={asignarSelec.size === 0 || !asignarSubcat}
                    onClick={async () => {
                      const ids = Array.from(asignarSelec)
                      const res = await fetch('/api/admin/productos/asignar-subcategoria', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ids, subcategoria: asignarSubcat }),
                      })
                      if (res.ok) {
                        setMsg(`✅ Subcategoría "${asignarSubcat}" asignada a ${ids.length} productos.`)
                        setShowAsignarModal(false)
                        loadProductos()
                      } else setMsg('❌ Error al asignar')
                      setTimeout(() => setMsg(''), 5000)
                    }}
                    style={{ flex: 2, background: asignarSelec.size === 0 || !asignarSubcat ? 'rgba(99,179,237,0.2)' : 'rgba(99,179,237,0.8)', border: 'none', borderRadius: 10, padding: 12, color: '#FFFFFF', fontWeight: 900, cursor: asignarSelec.size === 0 || !asignarSubcat ? 'not-allowed' : 'pointer', fontSize: 14 }}>
                    ✅ ASIGNAR A {asignarSelec.size} PRODUCTOS
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

        {showBorrarModal && (() => {
          const lista = borrarMode === 'subcat'
            ? productos.filter(p => p.subcategoria === borrarSubcat)
            : borrarCat === '__sin_categoria__'
              ? productos.filter(p => !p.categoria)
              : productos.filter(p => p.categoria === borrarCat)
          const todos = lista.length > 0 && lista.every(p => seleccionados.has(p.id!))
          const modalTitle = borrarMode === 'subcat'
            ? `🗑️ Borrar subcategoría "${borrarSubcat}"`
            : `🗑️ Borrar de "${borrarCat === '__sin_categoria__' ? 'Sin categoría' : borrarCat}"`
          return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 16 }}>
              <div style={{ background: '#0a1628', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ color: '#f87171', margin: 0, fontWeight: 900, fontSize: 17 }}>
                    {modalTitle}
                  </h2>
                  <button onClick={() => setShowBorrarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a9a' }}>
                    <X size={22} />
                  </button>
                </div>
                {/* Seleccionar todos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <input type="checkbox" checked={todos} onChange={() => {
                    if (todos) setSeleccionados(new Set())
                    else setSeleccionados(new Set(lista.map(p => p.id!)))
                  }} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <span style={{ color: '#ccc', fontWeight: 700, fontSize: 13 }}>
                    Seleccionar todos ({lista.length})
                  </span>
                  <span style={{ marginLeft: 'auto', color: '#f87171', fontSize: 12, fontWeight: 700 }}>
                    {seleccionados.size} seleccionados
                  </span>
                </div>
                {/* Lista */}
                <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {lista.map(p => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: seleccionados.has(p.id!) ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${seleccionados.has(p.id!) ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer' }}>
                      <input type="checkbox" checked={seleccionados.has(p.id!)} onChange={() => {
                        setSeleccionados(prev => {
                          const next = new Set(prev)
                          if (next.has(p.id!)) next.delete(p.id!)
                          else next.add(p.id!)
                          return next
                        })
                      }} style={{ width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }} />
                      <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, flex: 1, lineHeight: 1.3 }}>{p.nombre}</span>
                      {p.precio_mayorista > 0 && <span style={{ color: '#FF6A3D', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>${p.precio_mayorista.toLocaleString('es-AR')}</span>}
                    </label>
                  ))}
                </div>
                {/* Botones */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowBorrarModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, color: '#ccc', fontWeight: 700, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button
                    disabled={seleccionados.size === 0}
                    onClick={async () => {
                      if (!confirm(`¿Borrar ${seleccionados.size} productos seleccionados?`)) return
                      const ids = Array.from(seleccionados)
                      const res = await fetch('/api/admin/productos/borrar-ids', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ids }),
                      })
                      if (res.ok) {
                        setMsg(`🗑️ ${ids.length} productos borrados.`)
                        setShowBorrarModal(false)
                        loadProductos()
                      } else setMsg('❌ Error al borrar')
                      setTimeout(() => setMsg(''), 5000)
                    }}
                    style={{ flex: 2, background: seleccionados.size === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.8)', border: 'none', borderRadius: 10, padding: 12, color: '#FFFFFF', fontWeight: 900, cursor: seleccionados.size === 0 ? 'not-allowed' : 'pointer', fontSize: 14 }}>
                    🗑️ BORRAR {seleccionados.size} PRODUCTOS
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Modal Importar CSV */}
        {showImport && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}>
            <div style={{
              background: '#0a1628', border: '1px solid rgba(255,106,61,0.3)',
              borderRadius: 20, padding: 28, width: '100%', maxWidth: 700,
              maxHeight: '85vh', overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: '#FFFFFF', margin: 0, fontWeight: 900, fontSize: 18 }}>
                  📊 Importar {importPreview.length} productos
                </h2>
                <button onClick={() => { setShowImport(false); setImportPreview([]); setImportCategoria(''); setImportSubcategoria(''); setImportSubcategorias([]) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a9a' }}>
                  <X size={22} />
                </button>
              </div>

              {/* Columnas detectadas */}
              {importPreview.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#7a8a9a', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>COLUMNAS DETECTADAS EN TU ARCHIVO:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {Object.keys(importPreview[0]).map(col => (
                      <span key={col} style={{
                        background: 'rgba(255,106,61,0.15)', border: '1px solid rgba(255,106,61,0.3)',
                        borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#FF6A3D', fontWeight: 700,
                      }}>{col}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Categoría + Subcategoría por defecto */}
              <div style={{ marginBottom: 20, background: 'rgba(255,106,61,0.08)', border: '1px solid rgba(255,106,61,0.3)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ color: '#FF6A3D', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                  📂 CATEGORÍA Y SUBCATEGORÍA PARA ESTOS PRODUCTOS
                </div>
                <div style={{ color: '#7a8a9a', fontSize: 11, marginBottom: 12 }}>
                  Se asignan a todos los productos del archivo que no tengan categoría propia.
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {/* Categoría */}
                  <select
                    value={importCategoria}
                    onChange={async e => {
                      const cat = e.target.value
                      setImportCategoria(cat)
                      setImportSubcategoria('')
                      setImportSubcategorias([])
                      if (!cat) return
                      const catObj = categorias.find(c => c.nombre === cat)
                      if (!catObj) return
                      const res = await fetch(`/api/admin/subcategorias?categoria_id=${catObj.id}`)
                      if (res.ok) setImportSubcategorias(await res.json())
                    }}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,106,61,0.4)', borderRadius: 8,
                      padding: '10px 12px', color: importCategoria ? '#fff' : '#7a8a9a', fontSize: 14, outline: 'none',
                    }}>
                    <option value="">-- Elegí una categoría --</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.nombre}>{c.nombre}</option>
                    ))}
                  </select>
                  {/* Subcategoría */}
                  {importCategoria && (
                    <select
                      value={importSubcategoria}
                      onChange={e => setImportSubcategoria(e.target.value)}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,106,61,0.25)', borderRadius: 8,
                        padding: '10px 12px', color: importSubcategoria ? '#fff' : '#7a8a9a', fontSize: 14, outline: 'none',
                      }}>
                      <option value="">-- Subcategoría (opcional) --</option>
                      {importSubcategorias.map(s => (
                        <option key={s.id} value={s.nombre}>{s.nombre}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Vista previa */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: '#FF6A3D', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                  VISTA PREVIA (primeros 3)
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {importPreview.slice(0, 3).map((p, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.05)', borderRadius: 10,
                      padding: '10px 14px', fontSize: 11, overflowX: 'auto',
                    }}>
                      {Object.entries(p).map(([k, v]) => (
                        <div key={k} style={{ color: '#ccc', marginBottom: 2 }}>
                          <span style={{ color: '#7a8a9a' }}>{k}:</span> <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  {importPreview.length > 3 && (
                    <div style={{ color: '#7a8a9a', fontSize: 12, textAlign: 'center', padding: 8 }}>
                      ...y {importPreview.length - 3} productos más
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setShowImport(false); setImportPreview([]); setImportCategoria(''); setImportSubcategoria(''); setImportSubcategorias([]) }}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, padding: 12, color: '#ccc', fontWeight: 700, cursor: 'pointer',
                  }}>
                  Cancelar
                </button>
                <button onClick={handleImport} disabled={importing}
                  style={{
                    flex: 2, background: GOLD, border: 'none', borderRadius: 10, padding: 12,
                    color: '#FFFFFF', fontWeight: 900, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: importing ? 0.7 : 1,
                  }}>
                  <Upload size={16} />
                  {importing ? `Importando ${importPreview.length} productos...` : `IMPORTAR ${importPreview.length} PRODUCTOS`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: 16,
          }}>
            <div style={{
              background: '#0a1628', border: '1px solid rgba(255,106,61,0.3)',
              borderRadius: 20, padding: 28, width: '100%', maxWidth: 560,
              maxHeight: '90vh', overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#FFFFFF', margin: 0, fontWeight: 900 }}>
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
                    <label style={{ color: '#FF6A3D', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      {label.toUpperCase()}
                    </label>
                    <input
                      type={type}
                      value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,106,61,0.25)',
                        borderRadius: 8, padding: '10px 12px',
                        color: '#FFFFFF', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}

                {/* Categoría dropdown */}
                <div>
                  <label style={{ color: '#FF6A3D', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    CATEGORÍA
                  </label>
                  <select
                    value={form.categoria}
                    onChange={e => {
                      const cat = categorias.find(c => c.nombre === e.target.value)
                      setForm(f => ({ ...f, categoria: e.target.value, subcategoria: '' }))
                      if (cat) loadSubcategorias(cat.id)
                      else setSubcategorias([])
                    }}
                    style={{ width: '100%', background: '#0a1628', border: '1px solid rgba(255,106,61,0.25)', borderRadius: 8, padding: '10px 12px', color: form.categoria ? '#fff' : '#7a8a9a', fontSize: 14, outline: 'none' }}>
                    <option value="">Seleccioná una categoría</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.nombre}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategoría dropdown */}
                <div>
                  <label style={{ color: '#FF6A3D', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    SUBCATEGORÍA <span style={{ color: '#7a8a9a', fontWeight: 400 }}>(opcional)</span>
                  </label>
                  <select
                    value={form.subcategoria}
                    onChange={e => setForm(f => ({ ...f, subcategoria: e.target.value }))}
                    style={{ width: '100%', background: '#0a1628', border: '1px solid rgba(255,106,61,0.25)', borderRadius: 8, padding: '10px 12px', color: '#FFFFFF', fontSize: 14, outline: 'none' }}>
                    <option value="">Sin subcategoría</option>
                    {subcategorias.map(s => (
                      <option key={s.id} value={s.nombre}>{s.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Badge */}
                <div>
                  <label style={{ color: '#FF6A3D', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    ETIQUETA
                  </label>
                  <select
                    value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                    style={{
                      width: '100%', background: '#0a1628',
                      border: '1px solid rgba(255,106,61,0.25)',
                      borderRadius: 8, padding: '10px 12px',
                      color: '#FFFFFF', fontSize: 14, outline: 'none',
                    }}>
                    <option value="">Sin etiqueta</option>
                    <option value="DESTACADO">⭐ DESTACADO (sale en la home)</option>
                    <option value="OFERTA">OFERTA</option>
                    <option value="NUEVO">NUEVO</option>
                    <option value="HOT">HOT</option>
                    <option value="TOP">TOP</option>
                  </select>
                </div>

                {/* Imagen */}
                <div>
                  <label style={{ color: '#FF6A3D', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    FOTO DEL PRODUCTO
                  </label>
                  {form.imagen && (
                    <img src={(form.imagen || '').split('|')[0]} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                  )}
                  <input type="file" ref={fileRef} onChange={handleUploadImage} accept="image/*" style={{ display: 'none' }} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingImg}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.07)',
                      border: '1px dashed rgba(255,106,61,0.4)',
                      borderRadius: 8, padding: '12px',
                      color: '#FF6A3D', fontSize: 13, fontWeight: 700,
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
                <button
                  type="button"
                  onClick={async () => {
                    setSaving(true)
                    try {
                      const isEdit = !!form.id
                      const url = isEdit ? `/api/admin/productos/${form.id}` : '/api/admin/productos'
                      const method = isEdit ? 'PUT' : 'POST'
                      const payload = {
                        nombre: form.nombre,
                        marca: form.marca,
                        categoria: form.categoria,
                        subcategoria: form.subcategoria || '',
                        precio: form.precio,
                        precio_mayorista: form.precio_mayorista,
                        pedido_minimo: form.pedido_minimo,
                        imagen: form.imagen,
                        badge: form.badge,
                        descuento: form.descuento,
                        ubicacion: form.ubicacion,
                      }
                      const res = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      })
                      const data = await res.json()
                      if (res.ok) {
                        setMsg('✅ Producto guardado correctamente')
                        setShowForm(false)
                        setForm(EMPTY)
                        loadProductos()
                      } else {
                        setMsg(`❌ Error: ${data.error || JSON.stringify(data)}`)
                      }
                    } catch (e: any) {
                      setMsg(`❌ Error: ${e.message}`)
                    }
                    setSaving(false)
                    setTimeout(() => setMsg(''), 8000)
                  }}
                  disabled={saving}
                  style={{
                    flex: 2, background: GOLD,
                    border: 'none', borderRadius: 10, padding: 12,
                    color: '#FFFFFF', fontWeight: 900, cursor: 'pointer',
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

        {/* Botón ver solo destacados */}
        {!loading && productos.length > 0 && (
          <button
            onClick={() => setSoloDestacados(v => !v)}
            style={{
              width: '100%', boxSizing: 'border-box', marginBottom: 12, cursor: 'pointer',
              borderRadius: 10, padding: '12px 16px', fontSize: 15, fontWeight: 900,
              border: soloDestacados ? '1px solid #FF6A3D' : '1px solid rgba(255,106,61,0.3)',
              background: soloDestacados ? 'linear-gradient(135deg,#FF6A3D,#FF8A63)' : 'rgba(255,106,61,0.1)',
              color: soloDestacados ? '#0F3460' : '#FF6A3D',
            }}>
            {soloDestacados
              ? '⭐ Viendo destacados — tocá para ver todos'
              : (destacados.length > 0
                  ? `⭐ Ver los ${destacados.length} destacados`
                  : '⭐ Ver / poner destacados (no hay todavía)')}
          </button>
        )}

        {/* Buscador */}
        {!loading && productos.length > 0 && (
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar producto por nombre o código..."
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,106,61,0.35)', borderRadius: 10, padding: '12px 16px', color: '#FFFFFF', fontSize: 15, outline: 'none', marginBottom: 14 }}
          />
        )}

        {/* Lista de productos */}
        {loading ? (
          <div style={{ color: '#7a8a9a', textAlign: 'center', padding: 60 }}>Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,106,61,0.15)',
            borderRadius: 16, padding: 60, textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 18, marginBottom: 8 }}>No hay productos todavía</div>
            <div style={{ color: '#7a8a9a', fontSize: 13 }}>Hacé clic en "Agregar Producto" para empezar</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {(() => {
              const q = busqueda.trim()
              const buscandoServer = q.length >= 2
              let filtrados = buscandoServer
                ? resultados
                : (soloDestacados ? destacados : productos)
              if (buscando) {
                return <div style={{ color: '#7a8a9a', textAlign: 'center', padding: 40 }}>Buscando “{busqueda}”...</div>
              }
              if (filtrados.length === 0) {
                return <div style={{ color: '#7a8a9a', textAlign: 'center', padding: 40 }}>{buscandoServer ? `Sin resultados para “${busqueda}”` : 'No hay productos destacados todavía. Marcá productos con ☆ Destacar.'}</div>
              }
              return filtrados.map(p => (
              <div key={p.id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,106,61,0.15)',
                borderRadius: 14, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                {p.imagen && (
                  <img src={p.imagen} alt={p.nombre}
                    style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 15, marginBottom: 2 }}>{p.nombre}</div>
                  <div style={{ color: '#7a8a9a', fontSize: 12 }}>
                    {p.marca} · {p.categoria} · Mayorista: <span style={{ color: '#FF6A3D', fontWeight: 700 }}>${p.precio_mayorista?.toLocaleString('es-AR')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => toggleDestacado(p)}
                    title={p.badge === 'DESTACADO' ? 'Quitar de Destacados' : 'Poner en Destacados (home)'}
                    style={{
                      background: p.badge === 'DESTACADO' ? 'linear-gradient(135deg,#FF6A3D,#FF8A63)' : 'rgba(255,255,255,0.06)',
                      border: p.badge === 'DESTACADO' ? '1px solid #FF6A3D' : '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 8, padding: '8px 12px',
                      color: p.badge === 'DESTACADO' ? '#0F3460' : '#9aabb8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800,
                    }}>
                    {p.badge === 'DESTACADO' ? '✕ Quitar de destacados' : '☆ Destacar'}
                  </button>
                  <button onClick={() => handleEdit(p)}
                    style={{
                      background: 'rgba(255,106,61,0.15)', border: '1px solid rgba(255,106,61,0.3)',
                      borderRadius: 8, padding: '8px 12px',
                      color: '#FF6A3D', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700,
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
              ))
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
