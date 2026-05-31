import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY   = process.env.RESEND_API_KEY
const OWNER_EMAIL      = 'rubenmenalled@gmail.com'
const OWNER_WHATSAPP   = '5491164660482'
const ADMIN_PASSWORD   = process.env.ADMIN_PASSWORD

// Rate limit: máx 3 solicitudes por hora (en memoria)
const solicitudes = new Map<string, { count: number; until: number }>()

function getIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}

export async function POST(request: NextRequest) {
  const ip  = getIP(request)
  const now = Date.now()

  // Limpiar entradas vencidas
  const entry = solicitudes.get(ip)
  if (entry && now > entry.until) solicitudes.delete(ip)

  const current = solicitudes.get(ip)
  if (current && current.count >= 3) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Esperá 1 hora.' },
      { status: 429 }
    )
  }

  // Registrar solicitud
  const prev = solicitudes.get(ip) || { count: 0, until: now + 60 * 60 * 1000 }
  solicitudes.set(ip, { count: prev.count + 1, until: prev.until })

  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 })
  }

  const wa = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(
    `🔐 Tu contraseña del admin de Mayorista Universal es:\n\n*${ADMIN_PASSWORD}*\n\nmayoristauniversal.com/admin`
  )}`

  // Enviar por email
  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Mayorista Universal <onboarding@resend.dev>',
          to: [OWNER_EMAIL],
          subject: '🔐 Tu contraseña del panel admin',
          html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#F9FAFB;padding:32px;border-radius:16px;">
  <div style="background:linear-gradient(135deg,#0F3460,#1a4a8a);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
    <div style="font-size:36px;margin-bottom:8px;">🔐</div>
    <h2 style="color:#D4AF37;margin:0;font-size:20px;font-weight:900;">Recuperación de contraseña</h2>
    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:6px 0 0;">Mayorista Universal — Panel Admin</p>
  </div>
  <div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:24px;text-align:center;">
    <p style="color:#6B7280;font-size:13px;margin:0 0 16px;">Tu contraseña actual es:</p>
    <div style="background:#F3F4F6;border:2px dashed #D4AF37;border-radius:10px;padding:16px 24px;display:inline-block;margin-bottom:20px;">
      <span style="font-size:24px;font-weight:900;color:#0F3460;letter-spacing:0.04em;">${ADMIN_PASSWORD}</span>
    </div>
    <p style="color:#9CA3AF;font-size:12px;margin:0 0 20px;">Accedé al panel desde:</p>
    <a href="https://mayoristauniversal.com/admin"
      style="display:inline-block;background:linear-gradient(135deg,#D4AF37,#F0C030);color:#fff;font-weight:900;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
      Ir al panel admin →
    </a>
  </div>
  <p style="color:#D1D5DB;font-size:11px;text-align:center;margin-top:16px;">
    Si no solicitaste esto, ignorá este email.
  </p>
</div>
          `,
        }),
      })
    } catch (e) {
      console.error('Error enviando email de recuperación:', e)
    }
  }

  return NextResponse.json({ ok: true, wa })
}
