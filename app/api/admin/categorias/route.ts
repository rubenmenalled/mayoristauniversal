import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('categorias')
    .insert([body])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
