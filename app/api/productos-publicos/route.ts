import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const q = searchParams.get('q')

  const supabase = getAdminClient()

  let query = supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })

  if (categoria) query = query.ilike('categoria', categoria)
  if (q) query = query.ilike('nombre', `%${q}%`)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
