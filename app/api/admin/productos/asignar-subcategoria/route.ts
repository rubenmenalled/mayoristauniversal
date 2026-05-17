import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { ids, subcategoria } = await request.json()

  if (!Array.isArray(ids) || ids.length === 0 || !subcategoria) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { error } = await supabase
    .from('productos')
    .update({ subcategoria })
    .in('id', ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, actualizados: ids.length })
}
