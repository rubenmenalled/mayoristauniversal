import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

function normalize(str: string) {
  return String(str || '').toLowerCase().trim()
    .replace(/['"]/g, '')           // quitar comillas
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quitar acentos
    .replace(/[-]/g, '_')           // guiones a guión bajo
    .replace(/\s+/g, '_')           // espacios a guión bajo
    .replace(/[^a-z0-9_]/g, '')     // quitar todo lo demás
}

// Detecta automáticamente el nombre del producto (primer valor que no sea URL ni número)
function smartNombre(obj: any): string {
  const vals = Object.values(obj)
  for (const v of vals) {
    const s = String(v || '').trim()
    if (s && !s.startsWith('http') && isNaN(Number(s)) && s.length > 3) return s
  }
  return ''
}

// Detecta automáticamente la imagen (primer valor que sea URL de imagen)
function smartImagen(obj: any): string {
  const vals = Object.values(obj)
  // 1er pass: URLs con extensión de imagen explícita
  for (const v of vals) {
    const s = String(v || '').trim()
    if (s.startsWith('http') && /\.(jpg|jpeg|png|webp|gif|bmp|svg)/i.test(s)) return s
  }
  // 2do pass: URLs que parecen imágenes por la ruta (sin extensión explícita)
  for (const v of vals) {
    const s = String(v || '').trim()
    if (s.startsWith('http') && /\/(imagen|imagenes|image|images|img|foto|fotos|photo|photos|upload|uploads|media|assets|static|producto|productos|product|thumbnail|thumb)/i.test(s)) return s
  }
  return ''
}

// Detecta automáticamente el precio (primer valor numérico > 0)
function smartPrecio(obj: any): number {
  const vals = Object.values(obj)
  for (const v of vals) {
    const s = String(v || '').trim()
    if (!s || s.startsWith('http')) continue
    const n = toNum(s)
    if (n > 0) return n
  }
  return 0
}

function findVal(obj: any, keys: string[]): string {
  const normObj: any = {}
  for (const k of Object.keys(obj)) normObj[normalize(k)] = obj[k]
  for (const k of keys) {
    const v = normObj[normalize(k)]
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
  }
  return ''
}

function toNum(val: any): number {
  // Si el Excel ya entregó un número, redondearlo directo
  if (typeof val === 'number') return Math.round(val)
  let s = String(val || '0').replace(/[$\s]/g, '')
  if (!s) return 0
  // Formato argentino con coma y punto: 1.500,50
  if (s.includes(',') && s.includes('.')) {
    const lastComma = s.lastIndexOf(',')
    const lastDot = s.lastIndexOf('.')
    if (lastComma > lastDot) {
      s = s.replace(/\./g, '').replace(',', '.')
    } else {
      s = s.replace(/,/g, '')
    }
  } else if (s.includes(',')) {
    const dec = s.split(',').pop() || ''
    s = dec.length === 3 ? s.replace(',', '') : s.replace(',', '.')
  }
  // Dejar pasar el punto como decimal normal
  const n = parseFloat(s.replace(/[^0-9.]/g, ''))
  return isNaN(n) ? 0 : Math.round(n)
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { productos, categoriaDefault, subcategoriaDefault } = body

  if (!Array.isArray(productos) || productos.length === 0) {
    return NextResponse.json({ error: 'No hay productos para importar' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const BATCH = 50
  let insertados = 0
  let errores: string[] = []

  for (let i = 0; i < productos.length; i += BATCH) {
    const lote = productos.slice(i, i + BATCH).map((p: any) => ({
      nombre: findVal(p, ['nombre', 'name', 'producto', 'descripcion', 'description', 'titulo', 'title', 'articulo',
        'cajas-h2_b1', 'cajas_h2_b1', 'h2_b1', 'b1', 'titulo_producto', 'product_name']) || smartNombre(p),
      marca: findVal(p, ['marca', 'brand', 'fabricante', 'manufacturer']),
      categoria: findVal(p, ['categoria', 'category', 'rubro', 'tipo', 'type']) || categoriaDefault || '',
      subcategoria: findVal(p, ['subcategoria', 'subcategory', 'sub_categoria', 'sub']) || subcategoriaDefault || '',
      precio: toNum(findVal(p, ['precio', 'precio normal', 'precio_normal', 'price', 'precio_retail', 'precio_minorista', 'retail', 'minorista', 'precio_lista', 'valor', 'costo',
        'b_presupuesto', 'presupuesto', 'cajas-h2_b4', 'cajas_h2_b4', 'precio unitario', 'precio_unitario', 'b4', 'h2_b4'])) || smartPrecio(p),
      precio_mayorista: toNum(findVal(p, ['precio_mayorista', 'mayorista', 'wholesale', 'precio_mayo', 'precio_mayor', 'precio_al_mayor', 'precio mayorista',
        'b_presupuesto', 'presupuesto', 'cajas-h2_b4', 'cajas_h2_b4', 'b4', 'h2_b4'])) ||
        toNum(findVal(p, ['precio', 'precio normal', 'precio_normal', 'price', 'valor', 'costo'])) || smartPrecio(p),
      pedido_minimo: toNum(findVal(p, ['pedido_minimo', 'minimo', 'min_order', 'cantidad_minima', 'min',
        'cajas-h2_b4 2"', 'cajas_h2_b4_2', 'unidades', 'uni', 'cantidad'])) || 1,
      imagen: findVal(p, ['imagenes', 'imagen', 'image', 'images', 'foto', 'fotos', 'photo', 'url_imagen', 'img', 'url foto', 'url imagen',
        'cajas-h2_b2 src', 'cajas_h2_b2_src', 'cajas-h2_b2 href', 'src', 'img_src', 'image_src', 'photo_url',
        'b2 src', 'b2_src', 'h2_b2_src', 'h2_b2 src', 'imagen src', 'foto src', 'img src',
        'thumbnail', 'thumb', 'picture', 'pic']) || smartImagen(p),
      badge: findVal(p, ['badge', 'etiqueta', 'label', 'tag']),
      descuento: toNum(findVal(p, ['descuento', 'discount', 'oferta', 'dto'])),
      ubicacion: findVal(p, ['ubicacion', 'location', 'ciudad', 'city', 'provincia']) || 'Buenos Aires',
    })).filter(p => p.nombre.length > 0)

    if (lote.length === 0) continue

    const { error } = await supabase.from('productos').insert(lote)
    if (error) {
      errores.push(error.message)
    } else {
      insertados += lote.length
    }
  }

  if (insertados === 0 && errores.length === 0) {
    return NextResponse.json({ error: 'No se reconocieron productos válidos en el archivo. Verificá que tenga columnas con nombres y precios.' }, { status: 400 })
  }

  return NextResponse.json({ insertados, errores })
}
