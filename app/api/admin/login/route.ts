import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

// Rate limiting: máx 5 intentos fallidos por IP en 15 minutos
const attempts = new Map<string, { count: number; until: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS    = 15 * 60 * 1000 // 15 min

function getIP(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  const now = Date.now()

  // Limpiar entradas vencidas
  const entry = attempts.get(ip)
  if (entry && now > entry.until) attempts.delete(ip)

  // Verificar si está bloqueado
  const current = attempts.get(ip)
  if (current && current.count >= MAX_ATTEMPTS) {
    const minRestantes = Math.ceil((current.until - now) / 60000)
    return NextResponse.json(
      { error: `Demasiados intentos. Esperá ${minRestantes} minuto${minRestantes !== 1 ? 's' : ''}.` },
      { status: 429 }
    )
  }

  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: 'Configuración incorrecta' }, { status: 500 })
  }

  if (password !== adminPassword) {
    // Registrar intento fallido
    const prev = attempts.get(ip) || { count: 0, until: now + WINDOW_MS }
    attempts.set(ip, { count: prev.count + 1, until: prev.until })
    const restantes = MAX_ATTEMPTS - (prev.count + 1)
    const msg = restantes > 0
      ? `Contraseña incorrecta. ${restantes} intento${restantes !== 1 ? 's' : ''} restante${restantes !== 1 ? 's' : ''}.`
      : 'Contraseña incorrecta. Cuenta bloqueada por 15 minutos.'
    return NextResponse.json({ error: msg }, { status: 401 })
  }

  // Login exitoso → limpiar intentos
  attempts.delete(ip)

  const token = await signToken()
  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 horas
    path: '/admin',
  })

  return response
}
