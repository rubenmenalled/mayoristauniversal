import { fetchWooProductos } from './woocommerce'
import { getAdminClient } from './supabase'

export async function getProductos() {
  return fetchWooProductos()
}

const ORDEN_CATEGORIAS = [
  'PELUCHES',
  'BEBÉ',
  'TENDENCIAS',
  'NEXT MUNDO',
  'PELUCHES DE PERSONAJES',
  'JUGUETERIA',
  'MULTI-POP',
  'BAZAR KIK',
  'LENCERIA',
  'PERFUMERIA',
  'FATTZ IMPORT',
  'ARTICULOS X BULTO',
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
      // Contar solo productos VISIBLES (no los ocultos), para no mostrar
      // categorías vacías ni contadores inflados.
      const { count } = await supabase
        .from('productos')
        .select('id', { count: 'exact', head: true })
        .ilike('categoria', c.nombre)
        .or('badge.is.null,badge.neq.OCULTO')
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

    // Ocultar categorías sin productos visibles (ej. si se ocultó toda una marca)
    return sortCategorias(mapped.filter(c => c.count > 0))
  } catch { return [] }
}

// Totales en vivo para el contador del hero. Cuenta SOLO productos visibles
// (excluye los ocultos/badge OCULTO). Las categorías visibles se calculan aparte
// en la home con getCategorias().length (ya filtra las vacías).
export async function getStats() {
  try {
    const supabase = getAdminClient()
    const [allRes, dupRes] = await Promise.all([
      supabase.from('productos').select('id', { count: 'exact', head: true })
        .or('badge.is.null,badge.neq.OCULTO'),
      // Duplicados de referencia (PELUCHES > PELUCHES PERSONAJES): no cuentan en el total
      supabase.from('productos').select('id', { count: 'exact', head: true })
        .ilike('categoria', 'PELUCHES').ilike('subcategoria', 'PELUCHES PERSONAJES')
        .or('badge.is.null,badge.neq.OCULTO'),
    ])
    return {
      totalProductos: (allRes.count ?? 0) - (dupRes.count ?? 0),
    }
  } catch {
    return { totalProductos: 0 }
  }
}

