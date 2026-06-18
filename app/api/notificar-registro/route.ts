import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const OWNER_EMAIL = 'rubenmenalled@gmail.com'

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
              <div style="background: linear-gradient(135deg,#F5C518,#FFE45C); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
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
  }

  return NextResponse.json({ ok: true })
}
