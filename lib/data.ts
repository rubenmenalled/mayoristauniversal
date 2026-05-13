import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getProductos() {
  try {
    const supabase = getClient()
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.nombre,
      brand: p.marca || '',
      category: p.categoria || '',
      price: p.precio || 0,
      wholesalePrice: p.precio_mayorista || 0,
      minOrder: p.pedido_minimo || 1,
      rating: 4.8,
      reviews: 0,
      image: p.imagen || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop',
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
    const supabase = getClient()
    const { data } = await supabase.from('categorias').select('*').order('nombre')
    return (data || []).map((c: any) => ({
      id: c.id,
      name: c.nombre,
      emoji: c.emoji || '📦',
      image: c.imagen || `https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&auto=format&fit=crop`,
      description: c.descripcion || '',
      count: c.cantidad || 0,
    }))
  } catch {
    return []
  }
}
