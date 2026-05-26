import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const ORDEN_CATEGORIAS = [
  'INVIERNO 2026',
  'HOGAR Y BAZAR',
  'PELUCHES',
  'ACCESORIOS DE PELO',
  'BELLEZA',
  'MARROQUINERIA',
  'RELOJES',
  'LIBRERIA',
  'ELECTRONICA',
  'HERRAMIENTAS',
  'ILUMINACION',
  'JUGUETERIA',
  'AUTOMOTOR',
  'FITNESS',
  'CAMPING',
  'BEBE',
  'MASCOTAS',
  'BIJOUTERIE',
  'PRODUCTOS REGIONALES',
  'PERFUMERIA',
  'BLANQUERIA',
  'OPTICA',
  'PELUCHES ENAMORADOS',
  'LENCERIA',
]

// Todas las categorías del orden siempre aparecen aunque no tengan productos aún
const CATEGORIAS_FIJAS = ORDEN_CATEGORIAS

const FOTOS: Record<string, string> = {
  'INVIERNO 2026':    'https://images.unsplash.com/photo-1544522857-b7288ac171dd?w=800&q=90',
  'HOGAR Y BAZAR':       'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=90',
  'PRODUCTOS REGIONALES':'https://images.unsplash.com/photo-1444157545135-c045be691b05?w=800&q=90',
  'PELUCHES':            '/cat_peluches.jpg',
  'PELUCHES ENAMORADOS': 'https://images.unsplash.com/photo-1762542523027-e44a394788b6?w=800&q=90',
  'LENCERIA':            'https://images.pexels.com/photos/6879815/pexels-photo-6879815.jpeg?w=800&h=600&fit=crop',
  'BEBE':                'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=90',
  'ELECTRONICA':         'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=90',
  'ILUMINACION':         'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=90',
  'HERRAMIENTAS':        'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=90',
  'AUTOMOTOR':           'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=90',
  'CAMPING':             'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=90',
  'FITNESS':             'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=90',
  'JUGUETERIA':          'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=90',
  'LIBRERIA':            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=90',
  'BELLEZA':             'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=90',
  'MARROQUINERIA':       'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=90',
  'MASCOTAS':            'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=90',
  'COTILLON':            'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=90',
  'OPTICA':              'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=90',
  'RODADOS':             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90',
  'BLANQUERIA':          '/cat_blanqueria.jpg',
  'PERFUMERIA':          '/cat_perfumeria.jpg',
  'RELOJES':             'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=90',
  'BIJOUTERIE':          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=90',
  'ACCESORIOS DE PELO':  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=90',
}

export async function GET() {
  const supabase = getAdminClient()

  // Leer categorías únicas desde la tabla productos
  const { data, error } = await supabase
    .from('productos')
    .select('categoria')

  if (error) return NextResponse.json([], { status: 500 })

  const fromDB = Array.from(new Set(
    (data ?? []).map((p: any) => (p.categoria || '').trim().toUpperCase()).filter(Boolean)
  ))
  const uniqueNames = Array.from(new Set([...fromDB, ...CATEGORIAS_FIJAS]))

  const EMOJIS: Record<string, string> = {
    'HOGAR Y BAZAR':       '🍳',
    'BLANQUERIA':          '🛏️',
    'PELUCHES':            '🧸',
    'PELUCHES ENAMORADOS': '💕',
    'LENCERIA':            '👙',
    'BEBE':                '👶',
    'ELECTRONICA':         '📱',
    'ILUMINACION':         '💡',
    'HERRAMIENTAS':        '🔧',
    'AUTOMOTOR':           '🚗',
    'CAMPING':             '⛺',
    'FITNESS':             '💪',
    'JUGUETERIA':          '🎯',
    'LIBRERIA':            '📚',
    'BELLEZA':             '💄',
    'MARROQUINERIA':       '👜',
    'MASCOTAS':            '🐾',
    'COTILLON':            '🎉',
    'OPTICA':              '👓',
    'RODADOS':             '🛴',
    'PRODUCTOS REGIONALES':'🌿',
    'PERFUMERIA':          '🌸',
    'RELOJES':             '⌚',
    'BIJOUTERIE':          '💍',
    'ACCESORIOS DE PELO':  '💇',
  }

  const mapped = uniqueNames.map((nombre, i) => ({
    id:    i + 1,
    name:  nombre,
    nombre: nombre,
    emoji: EMOJIS[nombre] || '📦',
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
