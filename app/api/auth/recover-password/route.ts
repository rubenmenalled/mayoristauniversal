import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

  const supabase = getAdminClient()

  // Generar link de recuperación con Supabase (sin enviar email)
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mayoristauniversal.com'}/reset-password`,
    },
  })

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: 'No encontramos una cuenta con ese email.' }, { status: 400 })
  }

  const link = data.properties.action_link

  // Enviar via Resend
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'SMTP no configurado' }, { status: 500 })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Mayorista Universal <onboarding@resend.dev>',
        to: [email],
        subject: '🔐 Recuperá tu contraseña — Mayorista Universal',
        html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:520px;margin:0 auto;padding:32px 16px;">
  <div style="background:linear-gradient(135deg,#0F3460 0%,#1a4a8a 100%);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
    <div style="font-size:40px;margin-bottom:8px;">🔐</div>
    <h1 style="color:#FF6A3D;margin:0 0 4px 0;font-size:22px;font-weight:900;">Recuperar contraseña</h1>
    <p style="color:rgba(255,255,255,0.75);margin:0;font-size:13px;">Mayorista Universal</p>
  </div>
  <div style="background:#FFFFFF;padding:32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
    <p style="color:#374151;font-size:15px;margin:0 0 12px;">Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
    <p style="color:#374151;font-size:15px;margin:0 0 28px;">Hacé clic en el botón para crear una nueva contraseña:</p>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#FF6A3D,#FF8A63);color:#FFFFFF;font-weight:900;font-size:16px;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.02em;">
        CREAR NUEVA CONTRASEÑA
      </a>
    </div>
    <p style="color:#9CA3AF;font-size:12px;margin:0;text-align:center;">Este link expira en 1 hora. Si no pediste este cambio, ignorá este email.</p>
  </div>
  <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 16px 16px;padding:14px 32px;text-align:center;">
    <p style="color:#9CA3AF;font-size:11px;margin:0;">mayoristauniversal.com</p>
  </div>
</div>
</body>
</html>`,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.message || 'Error enviando email' }, { status: 500 })
    }
  } catch (e) {
    return NextResponse.json({ error: 'Error de conexión' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
