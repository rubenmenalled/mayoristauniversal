import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')

    if (categoria) {
      // Leer subcategorías distintas de los productos para esa categoria
      const url = `${SUPABASE_URL}/rest/v1/productos?categoria=ilike.${encodeURIComponent(categoria)}&subcategoria=neq.&select=subcategoria`
      const res = await fetch(url, {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        cache: 'no-store',
      })

      if (!res.ok) return NextResponse.json([])

      const data: { subcategoria: string }[] = await res.json()
      const unique = Array.from(new Set(data.map(p => p.subcategoria).filter(Boolean) as string[]))
        .sort()
        .map((nombre, i) => ({ id: i + 1, nombre, emoji: '📦', categoria_id: 0 }))

      return NextResponse.json(unique)
    }

    // Sin categoria: devolver tabla subcategorias completa (admin)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subcategorias?order=nombre`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
      cache: 'no-store',
    })
    const data = await res.json()
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
