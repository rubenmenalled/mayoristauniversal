import { fetchWooProductos } from './woocommerce'
import { getAdminClient } from './supabase'

export async function getProductos() {
  return fetchWooProductos()
}

export async function getCategorias() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre')

    if (error || !data) return []

    return data.map((c: any) => ({
      id:          c.id,
      name:        c.nombre,
      nombre:      c.nombre,
      emoji:       c.emoji || '📦',
      image:       c.imagen || '',
      description: c.descripcion || '',
      count:       c.cantidad ?? 0,
    }))
  } catch { return [] }
}
