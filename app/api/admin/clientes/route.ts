import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const adminClient = getAdminClient()

    // 1. Clientes REGISTRADOS (Supabase Auth)
    const { data: authData, error: authError } = await adminClient.auth.admin.listUsers()
    if (authError) throw authError

    const registrados = authData.users.map(u => ({
      id: u.id,
      email: u.email || '',
      created_at: u.created_at,
      nombre: u.user_metadata?.nombre || '—',
      documento: u.user_metadata?.documento || '—',
      whatsapp: u.user_metadata?.whatsapp || '—',
      transporte: u.user_metadata?.transporte || '—',
      reemplazo: u.user_metadata?.reemplazo || '—',
      direccion: u.user_metadata?.direccion || '—',
      tipo: 'registrado' as const,
      pedidos: 0,
    }))

    // Set de emails ya registrados (normalizados) para no duplicar
    const emailsRegistrados = new Set(
      registrados.map(c => (c.email || '').trim().toLowerCase()).filter(Boolean)
    )

    // 2. Compradores INVITADOS (tabla pedidos, sin cuenta)
    const { data: pedidos, error: pedError } = await adminClient
      .from('pedidos')
      .select('nombre,email,telefono,direccion,transporte,created_at')
      .order('created_at', { ascending: true })

    if (pedError) throw pedError

    // Agrupar pedidos por email normalizado
    const invitadosMap = new Map<string, any>()
    for (const p of pedidos || []) {
      const email = (p.email || '').trim().toLowerCase()
      if (!email || emailsRegistrados.has(email)) continue // ya es cliente registrado

      const existente = invitadosMap.get(email)
      if (existente) {
        existente.pedidos += 1
        // mantener el nombre/telefono/direccion/transporte más reciente (pedidos vienen ascendente)
        if (p.nombre) existente.nombre = (p.nombre || '').trim()
        if (p.telefono) existente.whatsapp = p.telefono
        if (p.direccion) existente.direccion = p.direccion
        if (p.transporte) existente.transporte = p.transporte
      } else {
        invitadosMap.set(email, {
          id: 'guest:' + email,
          email,
          created_at: p.created_at, // primer pedido (más antiguo)
          nombre: (p.nombre || '').trim() || '—',
          documento: '—',
          whatsapp: p.telefono || '—',
          transporte: p.transporte || '—',
          reemplazo: '—',
          direccion: p.direccion || '—',
          tipo: 'invitado' as const,
          pedidos: 1,
        })
      }
    }

    const invitados = Array.from(invitadosMap.values())

    // 3. Unir: registrados + invitados, ordenado por fecha desc (más nuevos primero)
    const clientes = [...registrados, ...invitados].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json(clientes)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
