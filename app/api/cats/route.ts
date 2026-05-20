import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const ORDEN_CATEGORIAS = [
  'HOGAR Y BAZAR',
  'PRODUCTOS REGIONALES',
  'PELUCHES',
  'PELUCHES ENAMORADOS',
  'BEBE',
  'ELECTRONICA',
  'ILUMINACION',
  'HERRAMIENTAS',
  'AUTOMOTOR',
  'CAMPING',
  'FITNESS',
  'JUGUETERIA',
  'LIBRERIA',
  'BELLEZA',
  'MARROQUINERIA',
  'MASCOTAS',
  'COTILLON',
  'OPTICA',
  'RODADOS',
  'BLANQUERIA',
  'PERFUMERIA',
]

const FOTOS: Record<string, string> = {
  'HOGAR Y BAZAR':       'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80',
  'PRODUCTOS REGIONALES':'https://images.unsplash.com/photo-1444157545135-c045be691b05?w=600&q=80',
  'PELUCHES':            '/cat_peluches.jpg',
  'PELUCHES ENAMORADOS': 'https://images.unsplash.com/photo-1762542523027-e44a394788b6?w=600&q=80',
  'BEBE':                'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  'ELECTRONICA':         'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  'ILUMINACION':         'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80',
  'HERRAMIENTAS':        'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80',
  'AUTOMOTOR':           'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
  'CAMPING':             'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
  'FITNESS':             'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  'JUGUETERIA':          'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80',
  'LIBRERIA':            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
  'BELLEZA':             'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
  'MARROQUINERIA':       'https://images.unsplash.com/photo-1740391768383-3b9ad0cb7b88?w=600&q=80',
  'MASCOTAS':            'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&q=80',
  'COTILLON':            'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
  'OPTICA':              'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
  'RODADOS':             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'BLANQUERIA':          '/cat_blanqueria.jpg',
  'PERFUMERIA':          '/cat_perfumeria.jpg',
}

export async function GET() {
  const supabase = getAdminClient()

  // Leer categorías únicas desde la tabla productos
  const { data, error } = await supabase
    .from('productos')
    .select('categoria')

  if (error) return NextResponse.json([], { status: 500 })

  const uniqueNames = Array.from(new Set(
    (data ?? []).map((p: any) => (p.categoria || '').trim().toUpperCase()).filter(Boolean)
  ))

  const mapped = uniqueNames.map((nombre, i) => ({
    id:    i + 1,
    name:  nombre,
    nombre: nombre,
    emoji: '📦',
    image: FOTOS[nombre] || '',
    description: '',
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
