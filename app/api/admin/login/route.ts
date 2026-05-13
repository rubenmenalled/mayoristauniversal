import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const adminPassword = process.env.ADMIN_PASSWORD || 'mayorista2024'

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const token = await signToken()

  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  })

  return response
}
