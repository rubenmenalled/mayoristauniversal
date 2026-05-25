import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password, nombre, documento, transporte, reemplazo, whatsapp } = await req.json()

  const supabase = getAdminClient()

  // Crear usuario con email ya confirmado (sin necesidad de confirmar por mail)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre, documento, transporte, reemplazo, whatsapp },
  })

  if (error) {
    const msg = error.message.includes('already been registered') || error.message.includes('already registered')
      ? 'Este email ya está registrado.'
      : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json({ ok: true, userId: data.user?.id })
}
