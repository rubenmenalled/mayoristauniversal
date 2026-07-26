import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

const COLS = 'id,nombre,marca,categoria,subcategoria,precio,precio_mayorista,pedido_minimo,imagen,badge,descuento,ubicacion,descripcion'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoria   = searchParams.get('categoria')
  const subcategoria = searchParams.get('subcategoria')
  const q           = searchParams.get('q')
  const destacados  = searchParams.get('destacados')
  const ids         = searchParams.get('ids')
  const limit       = parseInt(searchParams.get('limit') || '0', 10)
  const page        = parseInt(searchParams.get('page') || '0', 10)
  const PAGE_SIZE   = 60

  const supabase = getAdminClient()

  const idList = ids ? ids.split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean) : []

  // Búsqueda por precio aproximado: si la query es SOLO un número (con $ o
  // separadores de miles opcionales, ej. "5000", "$5.000"), puede ser un precio O
  // un código de producto puramente numérico (ej. "80126"). Ambigüedad: se intenta
  // primero como texto (matchea nombre/ubicacion/etc) y sólo si no encuentra nada
  // se reintenta como precio ±20% — así no se pierden códigos numéricos.
  const qTrim = (q || '').trim()
  const esBusquedaPrecioCandidata = /^\$?\s?[\d.,]+$/.test(qTrim) && /\d/.test(qTrim)
  const valorPrecio = esBusquedaPrecioCandidata ? parseInt(qTrim.replace(/[^\d]/g, ''), 10) : NaN

  const buildBase = () => {
    let query = supabase
      .from('productos')
      .select(COLS, { count: 'exact' })

    // Ocultar productos inactivos/archivados (badge = 'OCULTO').
    // Incluye los que no tienen badge (null) y excluye solo los marcados OCULTO.
    query = query.or('badge.is.null,badge.neq.OCULTO')

    if (categoria)    query = query.ilike('categoria', categoria)
    if (subcategoria) query = query.ilike('subcategoria', subcategoria)
    if (destacados)   query = query.eq('badge', 'DESTACADO')
    if (idList.length) query = query.in('id', idList)
    return query
  }

  const applyTextSearch = (query: any) => {
    // Búsqueda por palabras (AND) e insensible a tildes (regex imatch).
    // Cada palabra debe aparecer en algún campo → encuentra el producto aunque
    // se pegue el texto completo ("AUTO ... CÓDIGO: 302715"). Ignora palabras de relleno.
    const ac: Record<string, string> = {
      a: '[aáà]', e: '[eéè]', i: '[iíì]', o: '[oóò]', u: '[uúùü]', n: '[nñ]',
      'á': '[aáà]', 'é': '[eéè]', 'í': '[iíì]', 'ó': '[oóò]', 'ú': '[uúùü]', 'ñ': '[nñ]',
    }
    const NOISE = new Set(['codigo', 'cod', 'sku', 'articulo', 'art', 'rubro', 'el', 'la', 'los', 'las', 'de', 'del', 'y', 'con', 'para', 'por'])
    const accentPat = (s: string) => {
      const esc = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return Array.from(esc.toLowerCase()).map(c => ac[c] || c).join('')
    }
    // Reduce un plural a su raíz singular (peluches→peluche, relojes→reloj) para que
    // la búsqueda encuentre ambas formas: la raíz siempre queda como substring de la
    // palabra completa, así que buscar por la raíz nunca pierde matches del plural,
    // solo suma los del singular que el plural completo no encontraba.
    const singularize = (t: string) => {
      const low = t.toLowerCase()
      if (low.length > 4 && low.endsWith('es')) return t.slice(0, -2)
      if (low.length > 3 && low.endsWith('s'))  return t.slice(0, -1)
      return t
    }
    const stripAcc = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    let tokens = (q as string)
      .split(/\s+/)
      .map(t => t.replace(/^[^0-9A-Za-zÁÉÍÓÚÑáéíóúñ]+|[^0-9A-Za-zÁÉÍÓÚÑáéíóúñ-]+$/g, '').trim())
      .filter(t => t.length >= 2 && !NOISE.has(stripAcc(t)))
    if (tokens.length === 0) tokens = [(q as string).trim()]
    tokens = tokens.slice(0, 8) // tope de seguridad
    for (const t of tokens) {
      const pat = accentPat(singularize(t))
      query = query.or(
        `nombre.imatch.${pat},marca.imatch.${pat},subcategoria.imatch.${pat},descripcion.imatch.${pat},ubicacion.imatch.${pat}`
      )
    }
    return query
  }

  const applyPriceSearch = (query: any) => {
    const tolerancia = 0.2
    const min = Math.round(valorPrecio * (1 - tolerancia))
    const max = Math.round(valorPrecio * (1 + tolerancia))
    return query
      .gte('precio_mayorista', min).lte('precio_mayorista', max)
      .order('precio_mayorista', { ascending: true })
      .order('id', { ascending: false })
  }

  const applyPagination = (query: any) => {
    if (destacados) return query.limit(20)
    if (idList.length) return query.limit(idList.length)
    if (limit > 0) return query.limit(limit)
    return query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
  }

  let data: any[] | null = null
  let error: any = null
  let count: number | null = null

  if (q) {
    let query = buildBase()
    query = applyTextSearch(query)
    query = query.order('created_at', { ascending: false }).order('id', { ascending: false })
    query = applyPagination(query)
    ;({ data, error, count } = await query)

    // Query puramente numérica sin match de texto → probar como precio.
    if (!error && (count ?? 0) === 0 && esBusquedaPrecioCandidata && Number.isFinite(valorPrecio) && valorPrecio >= 100) {
      let priceQuery = buildBase()
      priceQuery = applyPriceSearch(priceQuery)
      priceQuery = applyPagination(priceQuery)
      ;({ data, error, count } = await priceQuery)
    }
  } else {
    let query = buildBase()
    query = query.order('created_at', { ascending: false }).order('id', { ascending: false })
    query = applyPagination(query)
    ;({ data, error, count } = await query)
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const mapped = (data ?? []).map((p: any) => ({
    id:             p.id,
    name:           p.nombre,
    brand:          p.marca || '',
    category:       p.categoria || '',
    subcategory:    p.subcategoria || '',
    price:          p.precio ?? 0,
    wholesalePrice: p.precio_mayorista ?? p.precio ?? 0,
    minOrder:       p.pedido_minimo ?? 1,
    image:          (p.imagen || '').split('|')[0],
    images:         (p.imagen || '').split('|').filter(Boolean),
    badge:          p.badge || '',
    discount:       p.descuento ?? 0,
    location:       p.ubicacion || 'Buenos Aires',
    descripcion:    p.descripcion || '',
    rating:         4.5,
    reviews:        12,
    hasMore:        (data ?? []).length === PAGE_SIZE,
  }))

  // Si se pidieron ids específicos, respetar el orden elegido
  if (idList.length) {
    mapped.sort((a: any, b: any) => idList.indexOf(a.id) - idList.indexOf(b.id))
  }

  // Catálogo siempre fresco: los cambios de precio/stock deben verse al instante.
  // X-Total-Count = total real que coincide con el filtro (categoría/subcategoría/búsqueda),
  // más allá de la página; el front lo usa para el encabezado ("992 productos" y no "60").
  return NextResponse.json(mapped, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Total-Count': String(count ?? mapped.length),
    }
  })
}
