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
  'OPTICA',
  'PRODUCTOS REGIONALES',
  'PERFUMERIA',
  'BLANQUERIA',
  'BIJOUTERIE',
  'PELUCHES ENAMORADOS',
]

export async function GET() {
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('categorias')
    .select('*')

  if (error) return NextResponse.json([], { status: 500 })

  const mapped = (data ?? []).map((c: any) => ({
    id:          c.id,
    name:        c.nombre,
    nombre:      c.nombre,
    emoji:       c.emoji || '📦',
    image:       c.imagen || '',
    description: c.descripcion || '',
    count:       c.cantidad ?? 0,
  }))

  const sorted = [...mapped].sort((a, b) => {
    const ia = ORDEN_CATEGORIAS.indexOf(a.name.toUpperCase())
    const ib = ORDEN_CATEGORIAS.indexOf(b.name.toUpperCase())
    if (ia === -1 && ib === -1) return a.name.localeCompare(b.name)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

  return NextResponse.json(sorted, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  })
}
