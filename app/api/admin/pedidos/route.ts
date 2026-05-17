import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id, estado } = await request.json()
    if (!id || !estado) {
      return NextResponse.json({ error: 'Faltan campos id o estado' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase
      .from('pedidos')
      .update({ estado })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
