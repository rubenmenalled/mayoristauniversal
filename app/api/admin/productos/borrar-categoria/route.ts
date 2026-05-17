import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')

  if (!categoria) return NextResponse.json({ error: 'Falta categoría' }, { status: 400 })

  const supabase = getAdminClient()

  let query = supabase.from('productos')

  if (categoria === '__sin_categoria__') {
    const { error } = await query.delete().or('categoria.is.null,categoria.eq.')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await query.delete().eq('categoria', categoria)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
