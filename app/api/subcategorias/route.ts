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
      // 1) Subcategorías desde productos (las que ya tienen productos asignados).
      // Paginado: una categoría puede tener >1000 productos (límite de PostgREST),
      // así que recorremos en bloques para no perder subcategorías.
      const fromProds = new Set<string>()
      for (let offset = 0; offset < 20000; offset += 1000) {
        const urlProds = `${SUPABASE_URL}/rest/v1/productos?categoria=ilike.${encodeURIComponent(categoria)}&subcategoria=neq.&select=subcategoria&offset=${offset}&limit=1000`
        const resProds = await fetch(urlProds, {
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
          cache: 'no-store',
        })
        const chunk: { subcategoria: string }[] = resProds.ok ? await resProds.json() : []
        chunk.forEach(p => { if (p.subcategoria) fromProds.add(p.subcategoria) })
        if (chunk.length < 1000) break
      }

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

      // 4) Obtener primera imagen y cantidad de cada subcategoría
      const imgBySub: Record<string, string> = {}
      const countBySub: Record<string, number> = {}
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
          // cantidad (solo productos visibles, no los ocultos)
          const urlCount = `${SUPABASE_URL}/rest/v1/productos?categoria=ilike.${encodeURIComponent(categoria)}&subcategoria=ilike.${encodeURIComponent(s.nombre)}&or=(badge.is.null,badge.neq.OCULTO)&select=id`
          const resCount = await fetch(urlCount, {
            headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'count=exact', Range: '0-0' },
            cache: 'no-store',
          })
          const cr = resCount.headers.get('content-range') || ''
          const total = cr.includes('/') ? parseInt(cr.split('/')[1], 10) : 0
          countBySub[s.nombre.toLowerCase()] = isNaN(total) ? 0 : total
        })
      )

      // Imágenes hardcodeadas para subcategorías que no tienen productos con imagen en los primeros resultados
      const HARDCODED_IMGS: Record<string, string> = {
        'peluches surtidos marca bubble': 'https://usimg.k2049.com/files/x/bb5e793a31f0477c88994b2decee6035.jpg',
      }

      // Portadas fijas elegidas a mano (tienen prioridad sobre la primera foto).
      // Clave: "CATEGORIA|subcategoria" para no pisar subcategorías con el mismo
      // nombre en otra categoría (ej. HERRAMIENTAS existe en HU IMPORT y en MULTI-POP).
      const OVERRIDE_SUB: Record<string, string> = {
        'ACCESORIOS PARA MASCOTAS|acuario': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/monce/portada-acuario-v2.jpg',
        'MARROQUINERIA|mochilas': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/uc-4e4f3a66c3356e871a17714505755368_white.webp',
        'PELUCHES|city land': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/sub-cityland.jpg?v=1',
        'PELUCHES|peluches personajes': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/banner-personajes-toystory.jpg?v=2',
        'TENDENCIAS|jugueteria': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/sub-tend-jugueteria.jpg?v=1',
        'JUGUETERIA|juguetes tendencias': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/sub-tend-jugueteria.jpg?v=1',
        'TENDENCIAS|bazar': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/sub-tend-bazar.jpg?v=1',
        'TENDENCIAS|cuidado personal': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/sub-tend-cuidado.jpg?v=2',
        // HU IMPORT — subcategorías con el banner de la categoría original
        'HU IMPORT|herramientas': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/banner-herramientas-v2.jpg?v=1',
        'HU IMPORT|camping': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/banner-camping-v2.jpg?v=1',
        'HU IMPORT|automotor': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/banner-automotor-v2.jpg?v=1',
        'HU IMPORT|iluminacion': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/banner-iluminacion-v2.jpg?v=1',
        'HU IMPORT|electronica': 'https://kdqijydsqukjvfjhgmkn.supabase.co/storage/v1/object/public/imagenes/categorias/banner-electronica-v2.jpg?v=1',
      }
      const catKey = (categoria || '').toUpperCase()

      // Orden de subcategorías: primero las más accesibles, lo más caro (gigantes) al final
      const ORDEN_SUBS: Record<string, number> = {
        'INFAC-TEC': -2,
        'PELUCHES POP': -1,
        // TENDENCIAS: orden pedido
        'CUIDADO PERSONAL': -5,
        'ELECTRODOMESTICOS': -4,
        'VARIOS': 999,
        // JUGUETERIA: JUGUETES RUBYLAND primero, luego TENDENCIAS
        'JUGUETES RUBYLAND': -4, 'JUGUETES TENDENCIAS': -3,
        'PELUCHES ALIMENTOS': 0,
        'MEDIANOS LISOS': 1, 'PELUCHES CHICOS Y MEDIANOS': 2, 'SONAJEROS': 3, 'PELUCHES X Y MAS': 4,
        'PELUCHES SURTIDOS MARCA BUBBLE': 5, 'PELUCHES ENAMORADOS': 6, 'ALMOHADAS': 7, 'MUÑECAS': 8, 'MARINOS': 9,
        'CUNEROS': 10, 'MOVIL PARA CUNA': 11, 'MOCHILAS Y CARTERAS DE PELUCHE': 12,
        'OTROS ACCESORIOS': 13, 'ACCESORIOS DE MASCOTAS': 14, 'GRANDES LISOS': 15, 'PELUCHES GRANDOTES Y GIGANTES': 16,
        // MARROQUINERIA — orden lógico
        'CARTERAS': 1, 'MOCHILAS': 2, 'BANDOLERAS': 3, 'RIÑONERAS': 4,
        'BILLETERAS': 5, 'PORTACOSMETICOS': 6, 'BOLSOS MATERNALES': 7,
        // HU IMPORT — orden de las subcategorías
        'HERRAMIENTAS': 1, 'CAMPING': 2, 'AUTOMOTOR': 3, 'ILUMINACION': 4, 'ELECTRONICA': 5,
      }
      const ordenadas = merged
        .map((s, i) => ({ s, i }))
        .sort((a, b) => {
          const oa = ORDEN_SUBS[a.s.nombre.toUpperCase()] ?? 50
          const ob = ORDEN_SUBS[b.s.nombre.toUpperCase()] ?? 50
          return oa !== ob ? oa - ob : a.i - b.i
        })
        .map(x => x.s)

      const mergedWithImg = ordenadas
        .map(s => ({
          ...s,
          preview_image: OVERRIDE_SUB[`${catKey}|${s.nombre.toLowerCase()}`] || imgBySub[s.nombre.toLowerCase()] || HARDCODED_IMGS[s.nombre.toLowerCase()] || '',
          count: countBySub[s.nombre.toLowerCase()] ?? 0,
        }))
        // Ocultar subcategorías sin productos visibles (ej. marca oculta)
        .filter(s => s.count > 0)

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
