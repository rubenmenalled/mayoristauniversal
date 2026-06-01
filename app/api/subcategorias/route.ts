import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

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
        const urlSubs = `${SUPABASE_URL}/rest/v1/subcategorias?categoria_id=eq.${catId}&order=id`
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

      // 4) Obtener primera imagen de cada subcategoría — una query por subcategoría para evitar el límite de 1000 filas
      const imgBySub: Record<string, string> = {}
      await Promise.all(
        merged.map(async (s) => {
          const urlImg = `${SUPABASE_URL}/rest/v1/productos?categoria=ilike.${encodeURIComponent(categoria)}&subcategoria=ilike.${encodeURIComponent(s.nombre)}&imagen=neq.&select=imagen&limit=1`
          const resImg = await fetch(urlImg, {
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
            cache: 'no-store',
          })
          const imgData: { imagen: string }[] = resImg.ok ? await resImg.json() : []
          if (imgData.length > 0 && imgData[0].imagen) {
            imgBySub[s.nombre.toLowerCase()] = imgData[0].imagen.split('|')[0]
          }
        })
      )

      // Imágenes hardcodeadas para subcategorías que no tienen productos con imagen en los primeros resultados
      const HARDCODED_IMGS: Record<string, string> = {
        'bubble': 'https://usimg.k2049.com/files/x/bb5e793a31f0477c88994b2decee6035.jpg',
      }

      const mergedWithImg = merged.map(s => ({
        ...s,
        preview_image: imgBySub[s.nombre.toLowerCase()] || HARDCODED_IMGS[s.nombre.toLowerCase()] || '',
      }))

      return NextResponse.json(mergedWithImg, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      })
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
