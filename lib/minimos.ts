// Mínimo de compra en $ por catálogo (Opción A).
// Default para todos; override para catálogos puntuales.
export const MIN_CATALOGO_DEFAULT = 90000
export const MIN_CATALOGO_OVERRIDE: Record<string, number> = {
  'FATTZ IMPORT': 300000,
  'HU IMPORT': 150000,
  'ARTICULOS X BULTO': 0,
  'LENCERIA': 120000,
  'PANTUFLAS': 120000,
  'MARROQUINERIA': 120000,
  'LICENCIA (BLANQUERIA Y ACCESORIOS)': 120000,
  'TODO PARA EL DEPORTE': 120000,
  'RELOJES': 120000,
  'DECO CASA': 120000,
  'PERFUMERIA': 120000,
}

// Mínimo por SUBCATEGORÍA (tiene prioridad sobre el de la categoría cuando aplica).
export const MIN_SUBCATEGORIA_OVERRIDE: Record<string, number> = {
  'FITTZ MASCOTAS': 300000,
}

export function minDeCatalogo(nombre?: string): number {
  return MIN_CATALOGO_OVERRIDE[(nombre || '').trim().toUpperCase()] ?? MIN_CATALOGO_DEFAULT
}

export function fmtPesos(n: number): string {
  return '$' + n.toLocaleString('es-AR')
}
