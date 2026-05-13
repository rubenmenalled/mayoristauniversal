import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('categorias')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabase = getAdminClient()
  const { error } = await supabase.from('categorias').delete().eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
