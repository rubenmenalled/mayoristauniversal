import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

const ADMIN_SECRET = process.env.ADMIN_SECRET

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token || token !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const adminClient = getAdminClient()
    const { data, error } = await adminClient.auth.admin.listUsers()
    if (error) throw error

    const clientes = data.users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      nombre: u.user_metadata?.nombre || '—',
      documento: u.user_metadata?.documento || '—',
      whatsapp: u.user_metadata?.whatsapp || '—',
      transporte: u.user_metadata?.transporte || '—',
      reemplazo: u.user_metadata?.reemplazo || '—',
    }))

    return NextResponse.json(clientes)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
