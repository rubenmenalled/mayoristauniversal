import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'mDipqJjpjoe7kVLUnwq3'
const SITE_NAME = 'Mayorista Universal'

const MENSAJES: Record<string, { asunto: string; whatsapp: string; emailTitulo: string; emailTexto: string }> = {
  confirmado: {
    asunto: `✅ Confirmamos tu pedido — ${SITE_NAME}`,
    whatsapp: '✅ *¡Confirmamos tu pedido!*\n\nHola {nombre}, tu pedido de {SITE_NAME} por *{total}* ya está confirmado y lo estamos preparando para el envío. Te avisamos apenas salga. 📦',
    emailTitulo: '¡CONFIRMAMOS TU PEDIDO!',
    emailTexto: 'Tu pedido ya está confirmado y lo estamos preparando para el envío. Te avisamos apenas salga.',
  },
  enviado: {
    asunto: `🚚 Tu pedido ya salió — ${SITE_NAME}`,
    whatsapp: '🚚 *¡Tu pedido ya salió!*\n\nHola {nombre}, despachamos tu pedido de {SITE_NAME} por *{total}*. En breve lo vas a estar recibiendo. ¡Gracias por tu compra! 🙌',
    emailTitulo: '¡TU PEDIDO YA SALIÓ!',
    emailTexto: 'Despachamos tu pedido. En breve lo vas a estar recibiendo — ¡gracias por tu compra!',
  },
}

async function notificarCliente(pedido: { nombre: string; email: string; telefono: string; total: number }, estado: string) {
  const cfg = MENSAJES[estado]
  if (!cfg) return
  const totalFormato = `$${Number(pedido.total).toLocaleString('es-AR')}`
  const now = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', dateStyle: 'full', timeStyle: 'short' })

  if (RESEND_API_KEY && pedido.email) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Mayorista Universal <onboarding@resend.dev>',
          to: [pedido.email],
          subject: cfg.asunto,
          html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">
  <div style="background:linear-gradient(135deg,#0F3460 0%,#1a4a8a 100%);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
    <h1 style="color:#FF6A3D;margin:0 0 4px 0;font-size:20px;font-weight:900;letter-spacing:0.02em;">${cfg.emailTitulo}</h1>
    <p style="color:rgba(255,255,255,0.75);margin:0;font-size:13px;">${SITE_NAME} — ${now}</p>
  </div>
  <div style="background:#FFFFFF;padding:24px 32px;border:1px solid #E5E7EB;border-top:none;">
    <p style="color:#111827;font-size:15px;margin:0 0 14px 0;">Hola <strong>${pedido.nombre}</strong>,</p>
    <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 14px 0;">${cfg.emailTexto}</p>
    <p style="color:#374151;font-size:14px;margin:0;">Total del pedido: <strong style="color:#FF6A3D;">${totalFormato}</strong></p>
  </div>
  <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;">
    <p style="color:#9CA3AF;font-size:11px;margin:0;">Cualquier consulta, escribinos por WhatsApp · <strong>mayoristauniversal.com</strong></p>
  </div>
</div>
</body>
</html>
          `,
        }),
      })
    } catch (e) {
      console.error('Error enviando email al cliente:', e)
    }
  }

  if (FONNTE_TOKEN && pedido.telefono) {
    try {
      const telefonoCliente = pedido.telefono.replace(/\D/g, '')
      if (telefonoCliente) {
        const msg = cfg.whatsapp
          .replace('{nombre}', pedido.nombre)
          .replace('{SITE_NAME}', SITE_NAME)
          .replace('{total}', totalFormato)
        await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: { 'Authorization': FONNTE_TOKEN, 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: telefonoCliente, message: msg, countryCode: '54' }),
        })
      }
    } catch (e) {
      console.error('Error Fonnte cliente:', e)
    }
  }
}

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

    const { data: pedido } = await supabase
      .from('pedidos')
      .select('nombre,email,telefono,total')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('pedidos')
      .update({ estado })
      .eq('id', id)

    if (error) throw error

    if (pedido) {
      await notificarCliente(pedido, estado)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Falta campo id' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
