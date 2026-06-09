import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const COLS = 'id,nombre,marca,categoria,subcategoria,precio,precio_mayorista,pedido_minimo,imagen,badge,descuento,ubicacion,descripcion'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoria   = searchParams.get('categoria')
  const subcategoria = searchParams.get('subcategoria')
  const q           = searchParams.get('q')
  const destacados  = searchParams.get('destacados')
  const limit       = parseInt(searchParams.get('limit') || '0', 10)
  const page        = parseInt(searchParams.get('page') || '0', 10)
  const PAGE_SIZE   = 60

  const supabase = getAdminClient()

  let query = supabase
    .from('productos')
    .select(COLS)
    .order('created_at', { ascending: false })

  if (categoria)    query = query.ilike('categoria', categoria)
  if (subcategoria) query = query.ilike('subcategoria', subcategoria)
  if (destacados)   query = query.eq('badge', 'DESTACADO')

  if (q) {
    query = query.or(
      `nombre.ilike.%${q}%,marca.ilike.%${q}%,subcategoria.ilike.%${q}%,descripcion.ilike.%${q}%`
    )
  } else if (destacados) {
    query = (query as any).limit(20)
  } else if (limit > 0) {
    query = (query as any).limit(limit)
  } else {
    query = (query as any).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

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
    hasMore:        (data ?? []).length === PAGE_SIZE,
  }))

  // Los destacados cambian desde el admin y deben verse al instante → sin caché.
  // El resto del catálogo sí se cachea para cargar rápido.
  const cacheControl = destacados
    ? 'no-store, max-age=0'
    : 'public, s-maxage=180, stale-while-revalidate=600'
  return NextResponse.json(mapped, {
    headers: { 'Cache-Control': cacheControl }
  })
}
