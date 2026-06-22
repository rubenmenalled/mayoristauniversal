// Mínimo de compra en $ por catálogo (Opción A).
// Default para todos; override para catálogos puntuales.
export const MIN_CATALOGO_DEFAULT = 80000
export const MIN_CATALOGO_OVERRIDE: Record<string, number> = {
  'FATTZ IMPORT': 300000,
}

export function minDeCatalogo(nombre?: string): number {
  return MIN_CATALOGO_OVERRIDE[(nombre || '').trim().toUpperCase()] ?? MIN_CATALOGO_DEFAULT
}

export function fmtPesos(n: number): string {
  return '$' + n.toLocaleString('es-AR')
}
