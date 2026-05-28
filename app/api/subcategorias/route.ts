import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Fallback estático para categorías que aún no tienen subcategorías en la DB
const STATIC_SUBS: Record<string, string[]> = {
  'PELUCHES': [
    'Personajes Disney',
    'Personajes Anime',
    'Animales',
    'Peluches Gigantes',
    'Peluches Bebé',
    'Muñecos de Tela',
  ],
  'BEBE': [
    'Sonajeros',
    'Cuneros y Móviles',
    'Mordillos',
    'Juguetes de Baño',
    'Accesorios Bebé',
    'Ropa de Bebé',
  ],
  'JUGUETERIA': [
    'Muñecas y Accesorios',
    'Autos y Vehículos',
    'Juguetes Educativos',
    'Juegos de Mesa',
    'Figuras y Coleccionables',
    'Juguetes de Exterior',
    'Construcción y Armado',
    'Peluches y Muñecos',
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')

    if (categoria) {
      // 1) Subcategorías desde productos (las que ya tienen productos asignados)
      const urlProds = `${SUPABASE_URL}/rest/v1/productos?categoria=ilike.${encodeURIComponent(categoria)}&subcategoria=neq.&select=subcategoria`
      const resProds = await fetch(urlProds, {
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
        cache: 'no-store',
      })
      const prodsData: { subcategoria: string }[] = resProds.ok ? await resProds.json() : []
      const fromProds = new Set(prodsData.map(p => p.subcategoria).filter(Boolean) as string[])

      // 2) Subcategorías desde la tabla subcategorias (aunque no tengan productos aún)
      const urlCat = `${SUPABASE_URL}/rest/v1/categorias?nombre=ilike.${encodeURIComponent(categoria)}&select=id`
      const resCat = await fetch(urlCat, {
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
        cache: 'no-store',
      })
      const catData: { id: number }[] = resCat.ok ? await resCat.json() : []
      let fromTable: { id: number; nombre: string; emoji: string; categoria_id: number }[] = []
      if (catData.length > 0) {
        const catId = catData[0].id
        const urlSubs = `${SUPABASE_URL}/rest/v1/subcategorias?categoria_id=eq.${catId}&order=nombre`
        const resSubs = await fetch(urlSubs, {
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
          cache: 'no-store',
        })
        fromTable = resSubs.ok ? await resSubs.json() : []
      }

      // 3) Merge: priorizar los de la tabla, agregar los de productos si no están
      const merged = [...fromTable]
      fromProds.forEach(nombre => {
        if (!merged.find(s => s.nombre.toLowerCase() === nombre.toLowerCase())) {
          merged.push({ id: merged.length + 100, nombre, emoji: '📦', categoria_id: 0 })
        }
      })

      // 4) Si no hay nada en DB, usar fallback estático
      if (merged.length === 0) {
        const catKey = (categoria || '').trim().toUpperCase()
        const staticList = STATIC_SUBS[catKey] || []
        const staticMapped = staticList.map((nombre, i) => ({ id: 900 + i, nombre, emoji: '📦', categoria_id: 0 }))
        return NextResponse.json(staticMapped)
      }

      return NextResponse.json(merged)
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
