import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  let q = (searchParams.get('q') || '').trim().replace(/[%,()]/g, ' ')
  // Ignora un "COD"/"CÓDIGO" inicial que se suele tipear antes del código
  q = q.replace(/^\s*c[oó]d(igo)?\.?[:\s]+/i, '').trim()
  const soloDestacados = searchParams.get('destacados')

  const supabase = getAdminClient()
  let query = supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })

  if (soloDestacados) {
    // Trae TODOS los destacados sin importar antigüedad (no dependen del batch de 1000)
    query = query.eq('badge', 'DESTACADO').limit(300)
  } else if (q) {
    query = query
      .or(`nombre.ilike.%${q}%,marca.ilike.%${q}%,categoria.ilike.%${q}%,subcategoria.ilike.%${q}%`)
      .limit(300)
  } else {
    query = query.limit(1000)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('productos')
    .insert([body])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
