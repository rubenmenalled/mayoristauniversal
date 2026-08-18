// Lógica de precio/pack compartida entre la grilla de categoría y la página
// individual de producto — extraída para que ambas muestren SIEMPRE lo mismo.

export interface PriceableProduct {
  category?: string
  subcategory?: string
  wholesalePrice: number
  minOrder: number
  badge?: string
  descripcion?: string
  name?: string
}

export function getBulkInfo(category: string, minOrder: number) {
  const cat = (category || '').toUpperCase()
  if (cat !== 'ACCESORIOS DE PELO' && cat !== 'LIBRERIA' && cat !== 'ACCESORIOS DE INVIERNO') return null
  if (minOrder <= 1) return { badge: false, sku: true, label: 'Mayorista:', badgeText: '' }
  const badgeText = minOrder >= 20
    ? `📦 PRECIO POR CAJA (x${minOrder}) DE COLORES SURTIDOS`
    : `📦 PRECIO POR PAQUETE (x${minOrder}) DE COLORES SURTIDOS`
  const label = minOrder >= 20 ? `Precio x caja (x${minOrder}):` : 'Precio x docena:'
  return { badge: true, sku: true, label, badgeText }
}

export interface PriceDisplay {
  isBulk: boolean
  titulo: string | null
  precioUnit: string | null
  extraInfo: string | null
  packLabel: string | null
  packTotal: number | null
  simpleLabel: string
  simplePrice: number
}

// Misma lógica que estaba inline en app/categorias/[nombre]/page.tsx (ver
// [[reference_categorias]] en memoria) — NO tocar sin actualizar ambos usos.
export function getPriceDisplay(p: PriceableProduct): PriceDisplay {
  const category = p.category ?? ''
  const subcategory = (p.subcategory ?? '').toUpperCase()
  const cat = category.toUpperCase()
  const bi = getBulkInfo(category, p.minOrder)

  let titulo: string | null = null
  let precioUnit: string | null = null
  let extraInfo: string | null = null

  if (p.descripcion?.startsWith('PRECIO POR')) {
    const sepIdx = p.descripcion.indexOf(') | ')
    const pricePart = sepIdx >= 0 ? p.descripcion.slice(0, sepIdx + 1) : p.descripcion
    extraInfo = sepIdx >= 0 ? p.descripcion.slice(sepIdx + 4) : null
    const match = pricePart.match(/^(PRECIO POR \d+ UNIDADES)\s*\((.+)\)$/)
    titulo = match ? match[1] : pricePart
    precioUnit = match ? `$${Math.round(p.wholesalePrice / Math.max(1, p.minOrder)).toLocaleString('es-AR')} c/u` : null
  } else if (p.badge === 'x6 UNIDADES') {
    titulo = 'PRECIO POR 6 UNIDADES'
    precioUnit = `$${Math.round(p.wholesalePrice / 6).toLocaleString('es-AR')} c/u`
  } else if (p.minOrder > 1) {
    const esDocena = subcategory === 'LENCERIA POR BULTO'
    const esCot = subcategory === 'POP IT' || subcategory === 'INFAC-TEC' || subcategory === 'TOYS.AR' ||
      ['IMPORTADORA MAX', 'IMPORTADORA COMEX', 'IMPORTADORA TREN'].includes(cat)
    if (esDocena) {
      titulo = `VENTA POR ${p.minOrder} DOCENAS`
      precioUnit = `$${p.wholesalePrice.toLocaleString('es-AR')} la docena`
    } else {
      titulo = `PRECIO POR ${p.minOrder} UNIDADES`
      const setQ = ((p.name ?? '').match(/set\s*x\s*(\d+)/i) || [])[1]
      const u = esCot ? p.wholesalePrice : Math.round(p.wholesalePrice / p.minOrder)
      precioUnit = `$${u.toLocaleString('es-AR')} ${setQ ? `por set de ${setQ}` : 'c/u'}`
    }
  }

  const isBulk = titulo !== null
  let packLabel: string | null = null
  let packTotal: number | null = null
  if (isBulk) {
    const esDoc = subcategory === 'LENCERIA POR BULTO'
    const esBulk = subcategory === 'POP IT' || subcategory === 'INFAC-TEC' || subcategory === 'TOYS.AR' ||
      ['IMPORTADORA MAX', 'IMPORTADORA COMEX', 'IMPORTADORA TREN'].includes(cat)
    packTotal = (esBulk || esDoc) ? p.wholesalePrice * p.minOrder : p.wholesalePrice
    packLabel = esDoc
      ? `EL BULTO (${p.minOrder} DOCENAS)`
      : (subcategory === 'TOYS.AR' || ['IMPORTADORA MAX', 'IMPORTADORA COMEX', 'IMPORTADORA TREN'].includes(cat))
        ? `EL BULTO X${p.minOrder}`
        : p.minOrder === 12 ? 'LA DOCENA' : `PACK X ${p.minOrder}`
  }

  return {
    isBulk,
    titulo,
    precioUnit,
    extraInfo,
    packLabel,
    packTotal,
    simpleLabel: bi?.label ?? 'Mayorista:',
    simplePrice: p.wholesalePrice,
  }
}
