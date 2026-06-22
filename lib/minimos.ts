// Mínimo de compra en $ por catálogo (Opción A).
// Default para todos; override para catálogos puntuales.
export const MIN_CATALOGO_DEFAULT = 90000
export const MIN_CATALOGO_OVERRIDE: Record<string, number> = {
  'FATTZ IMPORT': 300000,
  'LENCERIA': 120000,
  'PANTUFLAS': 120000,
  'MARROQUINERIA': 120000,
  'LICENCIA (BLANQUERIA Y ACCESORIOS)': 120000,
  'TODO PARA EL DEPORTE': 120000,
  'RELOJES': 120000,
  'ELECTRONICA': 120000,
  'HERRAMIENTAS': 120000,
  'AUTOMOTOR': 120000,
  'DECO CASA': 120000,
  'ILUMINACION': 120000,
}

export function minDeCatalogo(nombre?: string): number {
  return MIN_CATALOGO_OVERRIDE[(nombre || '').trim().toUpperCase()] ?? MIN_CATALOGO_DEFAULT
}

export function fmtPesos(n: number): string {
  return '$' + n.toLocaleString('es-AR')
}
