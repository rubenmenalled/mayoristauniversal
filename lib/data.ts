import { fetchWooProductos } from './woocommerce'
import { getAdminClient } from './supabase'

export async function getProductos() {
  return fetchWooProductos()
}

const ORDEN_CATEGORIAS = [
  'PELUCHES',
  'PELUCHES DE PERSONAJES',
  'JUGUETERIA',
  'BEBÉ',
  'LENCERIA',
  'ARTICULOS X BULTO',
  'PERFUMERIA',
  'FATTZ IMPORT',
  'MARROQUINERIA',
  'ACCESORIOS DE INVIERNO',
  'PANTUFLAS',
  'BELLEZA',
  'ACCESORIOS DE PELO',
  'LICENCIA (BLANQUERIA Y ACCESORIOS)',
  'TODO PARA EL DEPORTE',
  'COTILLON',
  'DECO CASA',
  'DECO BAZAR',
  'ACCESORIOS PARA MASCOTAS',
  'ELECTROHOGAR',
  'LLAVEROS',
  'LIBRERIA',
  'RELOJES',
  'HU IMPORT',
  'LENTES',
  'PRODUCTOS REGIONALES',
  'BIJOUTERIE',
  'RODADOS',
  'BLANQUERIA',
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

    const mapped = await Promise.all(data.map(async (c: any) => {
      const { count } = await supabase
        .from('productos')
        .select('id', { count: 'exact', head: true })
        .ilike('categoria', c.nombre)
      return {
        id:          c.id,
        name:        c.nombre,
        nombre:      c.nombre,
        emoji:       c.emoji || '📦',
        image:       c.imagen || '',
        description: c.descripcion || '',
        count:       count ?? 0,
      }
    }))

    return sortCategorias(mapped)
  } catch { return [] }
}

