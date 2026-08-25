import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const ORDEN_CATEGORIAS = [
  // Grupo de mínimo compartido ($150.000), posicionadas juntas
  'JUGUETERIA',
  'LLAVEROS DE GOMA',
  'ENAMORADOS',
  'SALUD Y BIENESTAR',
  'FLORERIA ARTIFICIAL',
  'PELUCHES',
  'KIKLAND',
  'BEBÉ',
  'IMPORTADORA DAG',
  'PELUCHES DE PERSONAJES',
  'PERFUMERIA Y BELLEZA',
  'IMPORTADORA NC',
  'ACCESORIOS PARA MASCOTAS',
  'BIJOUTERIE',
  'ACCESORIOS DE TRABAJO Y MAS',
  'LENCERIA',
  'CAZA PESCA CAMPING Y MAS',
  'IMPORTADORA HS',
  'IMPORTADORA NEXT',
  'CAMPING',
  'IMPORTADORA FAZZT',
  'PRODUCTOS REGIONALES',
  'TODO PARA EL DEPORTE',
  'BAZAR Y HOGAR',
  'IMPORTADORA MCJ',
  'IMPORTADORA TOYS.AR',
  'IMPORTADORA ELEMENTOS',
  'IMPORTADORA MAX',
  'IMPORTADORA COMEX',
  'IMPORTADORA TREN',
  'IMPORTADORA HOME',
  'MIX POP',
  'LIBRERIA',
]

// Todas las categorías del orden siempre aparecen aunque no tengan productos aún
const CATEGORIAS_FIJAS = ORDEN_CATEGORIAS

const FOTOS: Record<string, string> = {

  'BAZAR Y HOGAR':       'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=90',
  'ACCESORIOS PARA MASCOTAS': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=90',
  'HOGAR Y BAZAR':       'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=90',
  'PRODUCTOS REGIONALES':'https://images.unsplash.com/photo-1444157545135-c045be691b05?w=800&q=90',
  'PELUCHES':            '/cat_peluches.jpg',
  'PELUCHES ENAMORADOS': 'https://images.unsplash.com/photo-1762542523027-e44a394788b6?w=800&q=90',
  'LENCERIA':            'https://images.pexels.com/photos/6879815/pexels-photo-6879815.jpeg?w=800&h=600&fit=crop',
  'RODADOS':             'https://images.pexels.com/photos/9168370/pexels-photo-9168370.jpeg?w=800&h=600&fit=crop',
  'BEBÉ':                'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=90',
  'ELECTRONICA':         'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=90',
  'ILUMINACION':         'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=90',
  'AUTOMOTOR':           'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=90',
  'CAMPING':             'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=90',
  'TODO PARA EL DEPORTE': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=90',
  'JUGUETERIA':          'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=90',
  'LIBRERIA':            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=90',
  'MASCOTAS':            'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=90',
  'PERFUMERIA Y BELLEZA': '/cat_perfumeria.jpg',
  'IMPORTADORA DAG':     'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=90',
  'IMPORTADORA NC':      'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=90',
  'IMPORTADORA NEXT':    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=90',
  'BIJOUTERIE':          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=90',
  'ACCESORIOS DE PELO':  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=90',

}

export async function GET() {
  const supabase = getAdminClient()

  // Leer categorías únicas con paginación para superar el límite de 1000 filas
  let allData: any[] = []
  let from = 0
  const pageSize = 1000
  while (true) {
    const { data, error } = await supabase
      .from('productos')
      .select('categoria')
      .or('badge.is.null,badge.neq.OCULTO')
      .range(from, from + pageSize - 1)
    if (error || !data || data.length === 0) break
    allData = allData.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }
  const data = allData

  if (data.length === 0 && from === 0) return NextResponse.json([], { status: 500 })

  const OCULTAS = new Set(['PELUCHES ENAMORADOS', 'RODADOS'])

  const fromDB = Array.from(new Set(
    (data ?? []).map((p: any) => (p.categoria || '').trim().toUpperCase()).filter(Boolean)
  )).filter(n => !OCULTAS.has(n))
  const uniqueNames = Array.from(new Set([...fromDB, ...CATEGORIAS_FIJAS]))

  // Imágenes personalizadas desde la tabla categorias (igual que la home),
  // para que /catalogo muestre las mismas fotos que la página principal.
  const dbImg: Record<string, string> = {}
  try {
    const { data: cats } = await supabase.from('categorias').select('nombre,imagen')
    ;(cats ?? []).forEach((c: any) => {
      const k = (c.nombre || '').trim().toUpperCase()
      if (k && c.imagen) dbImg[k] = c.imagen
    })
  } catch {}

  const EMOJIS: Record<string, string> = {
    'HOGAR Y BAZAR':       '🍳',
    'PELUCHES':            '🧸',
    'PELUCHES ENAMORADOS': '💕',
    'LENCERIA':            '👙',
    'CAZA PESCA CAMPING Y MAS': '🎣',
    'IMPORTADORA HS':      '🔌',
    'FLORERIA ARTIFICIAL': '💐',
    'RODADOS':             '🛴',
    'BEBÉ':                '👶',
    'KIKLAND':             '🍽️',
    'ELECTRONICA':         '📱',
    'ILUMINACION':         '💡',
    'AUTOMOTOR':           '🚗',
    'CAMPING':             '⛺',
    'TODO PARA EL DEPORTE': '⚽',
    'JUGUETERIA':          '🎯',
    'LLAVEROS DE GOMA':    '🔑',
    'ENAMORADOS':          '💕',
    'SALUD Y BIENESTAR':   '🧴',
    'LIBRERIA':            '📚',
    'MASCOTAS':            '🐾',
    'PRODUCTOS REGIONALES':'🌿',
    'PERFUMERIA Y BELLEZA': '🌸',
    'IMPORTADORA DAG':     '📦',
    'IMPORTADORA NC':      '📦',
    'IMPORTADORA NEXT':    '📱',
    'BIJOUTERIE':          '💍',
    'ACCESORIOS DE TRABAJO Y MAS': '🧰',
    'ACCESORIOS DE PELO':  '💇',

  'MIX POP':             '🎀',
  'IMPORTADORA MCJ':     '📦',
  'IMPORTADORA TOYS.AR': '🧸',
  'IMPORTADORA ELEMENTOS': '🏺',
  'IMPORTADORA MAX': '📦',
  'IMPORTADORA COMEX': '🎉',
  'IMPORTADORA TREN': '🏠',
  'IMPORTADORA HOME':    '🏠',
  }

  const SUBCATEGORIAS: Record<string, string[]> = {

    'HOGAR Y BAZAR':      ['Cocina', 'Baño', 'Decoración', 'Organización', 'Limpieza'],
    'PELUCHES':           ['Peluches Chicos', 'Peluches Grandes', 'Muñecos', 'Animales de Peluche', 'BUBBLE'],
    'ACCESORIOS DE PELO': ['Vinchas', 'Colitas', 'Hebillas', 'Pinches', 'Turbantes'],
    'LIBRERIA':           ['Cuadernos', 'Útiles Escolares', 'Arte y Manualidades', 'Mochilas'],
    'ELECTRONICA':        ['Accesorios Celular', 'Audio y Auriculares', 'Cargadores', 'Smartwatch'],
    'ILUMINACION':        ['Iluminación Interior', 'Iluminación Exterior', 'Tiras LED', 'Lámparas'],
    'JUGUETERIA':         ['Juguetes Bebé', 'Juguetes Niño', 'Juguetes Niña', 'Juegos Educativos'],
    'AUTOMOTOR':          ['Accesorios Auto', 'Limpieza Auto', 'Seguridad Vial', 'Electrónica Auto'],
    'TODO PARA EL DEPORTE': ['Accesorios', 'Ping Pong', 'Natacion', 'Volley', 'Basket', 'Boxeo'],
    'CAMPING':            ['TACTICO', 'ACCESORIOS CAMPING'],
    'BEBÉ':               ['Ropa de Bebé', 'Juguetes Bebé', 'Higiene Bebé', 'Accesorios Bebé'],
    'MASCOTAS':           ['Accesorios Perro', 'Accesorios Gato', 'Juguetes Mascotas', 'Higiene Mascotas'],
    'BIJOUTERIE':         ['Aros', 'Collares', 'Pulseras'],
    'PRODUCTOS REGIONALES':['Alimentos Regionales', 'Dulces y Conservas', 'Artesanías', 'Bebidas'],
    'PERFUMERIA Y BELLEZA': ['Perfumes Mujer', 'Perfumes Hombre', 'Labios', 'Ojos', 'Piel', 'Uñas'],
    'IMPORTADORA DAG':    ['ELECTRONICA', 'HOGAR', 'ILUMINACION', 'BAZAR', 'PELUQUERIA-COSMETICA-BIJOU', 'FERRETERIA', 'GRIFERIA', 'CABLES'],
    'IMPORTADORA NC':     ['BAZAR', 'ELECTRONICA', 'ACCESORIOS', 'LINTERNAS', 'MOCHILAS DE PELUCHE', 'INVIERNO'],
    'LENCERIA':           ['Ropa Interior Mujer', 'Pijamas', 'Medias y Medias Cañas', 'Camisones'],
    'RODADOS':            ['Bicicletas', 'Patines', 'Scooters', 'Accesorios Rodados'],
  }

  const mapped = uniqueNames.map((nombre, i) => ({
    id:    i + 1,
    name:  nombre,
    nombre: nombre,
    emoji: EMOJIS[nombre] || '📦',
    image: dbImg[nombre] || FOTOS[nombre] || '',
    description: '',
    subcategorias: SUBCATEGORIAS[nombre] || [],
    count: (data ?? []).filter((p: any) => (p.categoria || '').trim().toUpperCase() === nombre).length,
  }))

  const sorted = [...mapped].sort((a, b) => {
    const ia = ORDEN_CATEGORIAS.indexOf(a.name)
    const ib = ORDEN_CATEGORIAS.indexOf(b.name)
    if (ia === -1 && ib === -1) return a.name.localeCompare(b.name)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

  return NextResponse.json(sorted, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  })
}
