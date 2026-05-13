import { createClient } from '@supabase/supabase-js'

export async function getProductos() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return []

    return data.map((p: any) => ({
      id: p.id,
      name: p.nombre,
      brand: p.marca || '',
      category: p.categoria || '',
      price: p.precio || 0,
      wholesalePrice: p.precio_mayorista || 0,
      minOrder: p.pedido_minimo || 1,
      rating: 4.8,
      reviews: 0,
      image: p.imagen || '',
      badge: p.badge || '',
      discount: p.descuento || 0,
      location: p.ubicacion || 'Buenos Aires',
    }))
  } catch {
    return []
  }
}

export async function getCategorias() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre')

    if (error || !data || data.length === 0) return []

    return data.map((c: any) => ({
      id: c.id,
      name: c.nombre,
      emoji: c.emoji || '📦',
      image: c.imagen || '',
      description: c.descripcion || '',
      count: c.cantidad || 0,
    }))
  } catch {
    return []
  }
}
