import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'mDipqJjpjoe7kVLUnwq3'
const OWNER_EMAIL = 'rubenmenalled@gmail.com'
const SITE_NAME = 'Mayorista Universal'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nombre, email, documento, whatsapp, transporte, reemplazo } = body

  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Mayorista Universal <onboarding@resend.dev>',
          to: [OWNER_EMAIL],
          subject: `🎉 Nuevo cliente registrado: ${nombre}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px;">
              <div style="background: linear-gradient(135deg,#FF6A3D,#FF8A63); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                <h2 style="margin: 0; color: #0F3460; font-size: 22px;">🎉 Nuevo Cliente Registrado</h2>
                <p style="margin: 8px 0 0; color: #0F3460; opacity: 0.8; font-size: 14px;">Mayorista Universal</p>
              </div>
              <div style="background: #fff; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-weight: 700; font-size: 13px; width: 140px;">👤 NOMBRE</td>
                    <td style="padding: 12px 0; color: #111; font-weight: 800; font-size: 15px;">${nombre}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-weight: 700; font-size: 13px;">📧 EMAIL</td>
                    <td style="padding: 12px 0; color: #111; font-size: 15px;">${email}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-weight: 700; font-size: 13px;">📄 DOCUMENTO</td>
                    <td style="padding: 12px 0; color: #111; font-size: 15px;">${documento}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-weight: 700; font-size: 13px;">📱 WHATSAPP</td>
                    <td style="padding: 12px 0; color: #111; font-size: 15px;">${whatsapp}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-weight: 700; font-size: 13px;">🚚 TRANSPORTE</td>
                    <td style="padding: 12px 0; color: #111; font-size: 15px;">${transporte}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #6b7280; font-weight: 700; font-size: 13px;">🔄 REEMPLAZO</td>
                    <td style="padding: 12px 0; color: #111; font-size: 15px;">${reemplazo === 'si' ? '✅ Sí acepta' : '❌ No acepta'}</td>
                  </tr>
                </table>
              </div>
              <p style="margin-top: 16px; color: #9ca3af; font-size: 12px; text-align: center;">Mayorista Universal — mayoristauniversal.vercel.app</p>
            </div>
          `,
        }),
      })
    } catch (e) {
      console.error('Error enviando email de registro:', e)
    }

    // Email de bienvenida al CLIENTE
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Mayorista Universal <onboarding@resend.dev>',
          to: [email],
          subject: `🎉 ¡Bienvenido/a a ${SITE_NAME}!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px;">
              <div style="background: linear-gradient(135deg,#FF6A3D,#FF8A63); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                <h2 style="margin: 0; color: #0F3460; font-size: 22px;">🎉 ¡Bienvenido/a a ${SITE_NAME}!</h2>
              </div>
              <div style="background: #fff; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb;">
                <p style="margin: 0 0 12px; color: #111; font-size: 15px;">Hola <strong>${nombre}</strong>,</p>
                <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
                  Gracias por registrarte en ${SITE_NAME} — ya podés armar tu primer pedido con precios
                  mayoristas en más de 28 categorías. Cualquier duda, escribinos por WhatsApp, estamos para ayudarte.
                </p>
              </div>
              <p style="margin-top: 16px; color: #9ca3af; font-size: 12px; text-align: center;">${SITE_NAME} — mayoristauniversal.com</p>
            </div>
          `,
        }),
      })
    } catch (e) {
      console.error('Error enviando email de bienvenida al cliente:', e)
    }
  }

  // Bienvenida automática al CLIENTE por WhatsApp
  if (FONNTE_TOKEN && whatsapp) {
    try {
      const telefonoCliente = String(whatsapp).replace(/\D/g, '')
      if (telefonoCliente) {
        const msg =
          `🎉 *¡Bienvenido/a a ${SITE_NAME}!*\n\n` +
          `Hola ${nombre}, gracias por registrarte. Ya podés armar tu primer pedido con precios ` +
          `mayoristas en más de 28 categorías. Cualquier duda, escribinos por acá, ¡estamos para ayudarte!`
        await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: { 'Authorization': FONNTE_TOKEN, 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: telefonoCliente, message: msg, countryCode: '54' }),
        })
      }
    } catch (e) {
      console.error('Error Fonnte bienvenida cliente:', e)
    }
  }

  return NextResponse.json({ ok: true })
}
