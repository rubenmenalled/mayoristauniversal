import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const q = searchParams.get('q')

  const supabase = getAdminClient()

  const subcategoria = searchParams.get('subcategoria')

  // Cuando hay búsqueda por texto (q), no aplicar rango para buscar en toda la DB
  let query = supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })

  if (!q) query = (query as any).range(0, 4999)

  if (categoria) query = query.ilike('categoria', categoria)
  if (subcategoria) query = query.ilike('subcategoria', subcategoria)
  if (q) query = query.ilike('nombre', `%${q}%`)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mapear campos de español (Supabase) a inglés (frontend)
  const mapped = (data ?? []).map((p: any) => ({
    id:             p.id,
    name:           p.nombre,
    brand:          p.marca || '',
    category:       p.categoria || '',
    subcategory:    p.subcategoria || '',
    price:          p.precio ?? 0,
    wholesalePrice: p.precio_mayorista ?? p.precio ?? 0,
    minOrder:       p.pedido_minimo ?? 1,
    image:          (p.imagen || '').split('|')[0],
    images:         (p.imagen || '').split('|').filter(Boolean),
    badge:          p.badge || '',
    discount:       p.descuento ?? 0,
    location:       p.ubicacion || 'Buenos Aires',
    descripcion:    p.descripcion || '',
    rating:         4.5,
    reviews:        12,
  }))

  return NextResponse.json(mapped, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
  })
}
