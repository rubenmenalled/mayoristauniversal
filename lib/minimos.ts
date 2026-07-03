// Mínimo de compra en $ por catálogo (Opción A).
// Default para todos; override para catálogos puntuales.
export const MIN_CATALOGO_DEFAULT = 100000
export const MIN_CATALOGO_OVERRIDE: Record<string, number> = {
  'FATTZ IMPORT': 300000,
  'JUGUETERIA': 150000,
  'PELUCHES': 150000,
  'HU IMPORT': 150000,
  'LIBRERIA': 120000,
  'BAZAR Y HOGAR': 120000,
  'BELLEZA': 120000,
  'CAMPING': 200000,
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
  'M ELEVEN': 100000,
  'NEXT PARAGUAS': 120000,
  'PARAGUAS M ELEVEN': 120000,
}

export function minDeCatalogo(nombre?: string): number {
  return MIN_CATALOGO_OVERRIDE[(nombre || '').trim().toUpperCase()] ?? MIN_CATALOGO_DEFAULT
}

export function fmtPesos(n: number): string {
  return '$' + n.toLocaleString('es-AR')
}
