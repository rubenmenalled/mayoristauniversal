// Mínimo de compra en $ por catálogo (Opción A).
// Default para todos; override para catálogos puntuales.
export const MIN_CATALOGO_DEFAULT = 130000
export const MIN_CATALOGO_OVERRIDE: Record<string, number> = {
  'IMPORTADORA FAZZT': 200000,
  'CAMPING': 200000,
  'LENCERIA IMPORTADA': 150000,
  'PANTUFLAS': 130000,
  'MARROQUINERIA': 130000,
  'TODO PARA EL DEPORTE': 200000,
  'PELUQUERIA Y BARBERIA': 180000,
  'ANIMÉ': 140000,
  'IMPORTADORA MCJ': 150000,
  'IMPORTADORA TOYS.AR': 200000,
  'IMPORTADORA ELEMENTOS': 200000,
  'IMPORTADORA MAX': 200000,
  'IMPORTADORA COMEX': 200000,
  'IMPORTADORA TREN': 200000,
  'IMPORTADORA HOME': 200000,
  // JUGUETERIA, PELUCHES, PELUCHES DE PERSONAJES, BEBÉ, KIKLAND, TENDENCIAS,
  // BELLEZA Y PERFUMERIA WT, MIX POP, LIBRERIA y BAZAR Y HOGAR ya NO tienen entrada
  // individual acá — comparten el mínimo de abajo vía CATEGORIA_GRUPO_OVERRIDE.
  'JUGUETES, PELUCHES Y MÁS': 150000,
}

// Mínimo por SUBCATEGORÍA (tiene prioridad sobre el de la categoría cuando aplica).
export const MIN_SUBCATEGORIA_OVERRIDE: Record<string, number> = {
  'M ELEVEN': 130000,
  'GAUCHO SANTI': 130000,
  'INDIO MOHI': 200000,
}

// Categorías que comparten UN SOLO mínimo de compra entre todas (2026-07-14, a pedido
// de Ruben). Solo afecta el mínimo de compra — el 10% OFF sigue siendo por categoría
// individual, ver catalogoDeDescuento() más abajo.
export const CATEGORIA_GRUPO_OVERRIDE: Record<string, string> = {
  'JUGUETERIA': 'JUGUETES, PELUCHES Y MÁS',
  'PELUCHES': 'JUGUETES, PELUCHES Y MÁS',
  'PELUCHES DE PERSONAJES': 'JUGUETES, PELUCHES Y MÁS',
  'BEBÉ': 'JUGUETES, PELUCHES Y MÁS',
  'KIKLAND': 'JUGUETES, PELUCHES Y MÁS',
  'TENDENCIAS': 'JUGUETES, PELUCHES Y MÁS',
  'BELLEZA Y PERFUMERIA WT': 'JUGUETES, PELUCHES Y MÁS',
  'IMPORTADORA DAG': 'JUGUETES, PELUCHES Y MÁS',
  'IMPORTADORA NC': 'JUGUETES, PELUCHES Y MÁS',
  'MIX POP': 'JUGUETES, PELUCHES Y MÁS',
  'LIBRERIA': 'JUGUETES, PELUCHES Y MÁS',
  'BAZAR Y HOGAR': 'JUGUETES, PELUCHES Y MÁS',
}

export function minDeCatalogo(nombre?: string): number {
  return MIN_CATALOGO_OVERRIDE[(nombre || '').trim().toUpperCase()] ?? MIN_CATALOGO_DEFAULT
}

// Catálogo efectivo de un producto en el carrito: su subcategoría si tiene mínimo
// propio (ej. NEXT +18, INDIO MOHI), si no el grupo de categorías al que pertenece
// (ej. JUGUETES Y PELUCHES), si no la categoría tal cual. Usado para el mínimo de
// compra (Opción A) — NO usar para el 10% OFF, ver catalogoDeDescuento().
export function catalogoDe(category?: string, subcategory?: string): string {
  const sub = (subcategory || '').trim().toUpperCase()
  if (MIN_SUBCATEGORIA_OVERRIDE[sub] != null) return sub
  const cat = (category || 'OTROS').trim().toUpperCase()
  return CATEGORIA_GRUPO_OVERRIDE[cat] || cat
}

// Igual que catalogoDe pero SIN agrupar categorías — el 10% OFF (lib/descuentos.ts)
// debe seguir calculándose por categoría individual aunque su mínimo de compra esté
// agrupado con otras (ej. PELUCHES y BEBÉ no tienen 10% OFF aunque compartan mínimo
// con JUGUETERIA/KIKLAND/PELUCHES DE PERSONAJES, que sí lo tienen).
export function catalogoDeDescuento(category?: string, subcategory?: string): string {
  const sub = (subcategory || '').trim().toUpperCase()
  if (MIN_SUBCATEGORIA_OVERRIDE[sub] != null) return sub
  return (category || 'OTROS').trim().toUpperCase()
}

export function fmtPesos(n: number): string {
  return '$' + n.toLocaleString('es-AR')
}
