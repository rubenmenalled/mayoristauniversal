import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
    const productos = (data || []).map((p: any) => ({
      id: p.id, name: p.nombre, brand: p.marca || '',
      category: p.categoria || '', price: p.precio || 0,
      wholesalePrice: p.precio_mayorista || 0, minOrder: p.pedido_minimo || 1,
      rating: 4.8, reviews: 0, image: p.imagen || '',
      badge: p.badge || '', discount: p.descuento || 0,
      location: p.ubicacion || 'Buenos Aires',
    }))
    return NextResponse.json(productos)
  } catch {
    return NextResponse.json([])
  }
}
