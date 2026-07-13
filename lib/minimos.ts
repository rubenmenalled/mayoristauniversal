// Mínimo de compra en $ por catálogo (Opción A).
// Default para todos; override para catálogos puntuales.
export const MIN_CATALOGO_DEFAULT = 130000
export const MIN_CATALOGO_OVERRIDE: Record<string, number> = {
  'FATTZ IMPORT': 300000,
  'JUGUETERIA': 130000,
  'PELUCHES': 150000,
  'LIBRERIA': 130000,
  'BAZAR Y HOGAR': 130000,
  'BELLEZA': 130000,
  'CAMPING': 200000,
  'ARTICULOS X BULTO': 0,
  'LENCERIA': 130000,
  'PANTUFLAS': 130000,
  'MARROQUINERIA': 130000,
  'TODO PARA EL DEPORTE': 130000,
  'RELOJES': 130000,
  'DECO CASA': 130000,
  'PERFUMERIA': 130000,
  'PELUQUERIA Y BARBERIA': 180000,
  'ADULTOS': 150000,
  'ANIMÉ': 150000,
}

// Mínimo por SUBCATEGORÍA (tiene prioridad sobre el de la categoría cuando aplica).
export const MIN_SUBCATEGORIA_OVERRIDE: Record<string, number> = {
  'M ELEVEN': 130000,
  'NEXT PARAGUAS': 130000,
  'PARAGUAS M ELEVEN': 130000,
  'GAUCHO SANTI': 130000,
  'INDIO MOHI': 200000,
  'NEXT +18': 150000,
  'HU +18': 150000,
}

export function minDeCatalogo(nombre?: string): number {
  return MIN_CATALOGO_OVERRIDE[(nombre || '').trim().toUpperCase()] ?? MIN_CATALOGO_DEFAULT
}

// Catálogo efectivo de un producto en el carrito: su subcategoría si tiene mínimo
// propio (ej. NEXT +18, INDIO MOHI), si no la categoría. Misma regla para el mínimo
// de compra y para el descuento por volumen (lib/descuentos.ts) — son "el mismo catálogo".
export function catalogoDe(category?: string, subcategory?: string): string {
  const sub = (subcategory || '').trim().toUpperCase()
  if (MIN_SUBCATEGORIA_OVERRIDE[sub] != null) return sub
  return (category || 'OTROS').trim().toUpperCase()
}

export function fmtPesos(n: number): string {
  return '$' + n.toLocaleString('es-AR')
}
