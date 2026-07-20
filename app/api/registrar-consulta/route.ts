import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { telefono, pagina } = await request.json()

  if (!telefono || !String(telefono).trim()) {
    return NextResponse.json({ error: 'Falta teléfono' }, { status: 400 })
  }

  try {
    const admin = getAdminClient()
    await admin.from('consultas').insert({
      telefono: String(telefono).trim(),
      pagina: pagina || null,
    })
  } catch (e) {
    console.error('Error guardando consulta:', e)
  }

  return NextResponse.json({ ok: true })
}
