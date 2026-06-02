import { fetchWooProductos } from './woocommerce'
import { getAdminClient } from './supabase'

export async function getProductos() {
  return fetchWooProductos()
}

const ORDEN_CATEGORIAS = [
  'LENCERIA',
  'INVIERNO 2026',
  'ELECTROHOGAR',
  'DECO CASA',
  'DECO BAZAR',
  'PELUCHES',
  'ACCESORIOS DE PELO',
  'BELLEZA',
  'JUGUETERIA',
  'RELOJES',
  'LIBRERIA',
  'ELECTRONICA',
  'TODO PARA EL DEPORTE',
  'LLAVEROS',
  'MARROQUINERIA',
  'LENTES',
  'HERRAMIENTAS',
  'CAMPING',
  'BEBE',
  'ACCESORIOS PARA MASCOTAS',
  'ILUMINACION',
  'BIJOUTERIE',
  'PRODUCTOS REGIONALES',
  'PERFUMERIA',
  'BLANQUERIA',
  'AUTOMOTOR',
  'RODADOS',
]

function sortCategorias(cats: any[]) {
  return [...cats].sort((a, b) => {
    const ia = ORDEN_CATEGORIAS.indexOf(a.name.toUpperCase())
    const ib = ORDEN_CATEGORIAS.indexOf(b.name.toUpperCase())
    if (ia === -1 && ib === -1) return a.name.localeCompare(b.name)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
}

export async function getCategorias() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('categorias')
      .select('*')

    if (error || !data) return []

    const mapped = data.map((c: any) => ({
      id:          c.id,
      name:        c.nombre,
      nombre:      c.nombre,
      emoji:       c.emoji || '📦',
      image:       c.imagen || '',
      description: c.descripcion || '',
      count:       c.cantidad ?? 0,
    }))

    return sortCategorias(mapped)
  } catch { return [] }
}
