import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const supabase = getAdminClient()
  const { searchParams } = new URL(request.url)
  const categoria_id = searchParams.get('categoria_id')

  let query = supabase.from('subcategorias').select('*').order('nombre')
  if (categoria_id) query = query.eq('categoria_id', Number(categoria_id))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from('subcategorias').insert([body]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
