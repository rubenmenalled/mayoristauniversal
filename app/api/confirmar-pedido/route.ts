import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const OWNER_EMAIL = 'rubenmenalled@gmail.com'
const OWNER_WHATSAPP = '5491164660482'
const SITE_NAME = 'Mayorista Universal'

export async function POST(request: NextRequest) {
  const { nombre, email, telefono, items, total } = await request.json()

  if (!nombre || !email || !telefono || !items?.length) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  // Armar lista de productos
  const listaProductos = items.map((item: any) =>
    `• ${item.name} x${item.quantity} = $${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}`
  ).join('\n')

  const totalFormato = `$${Number(total).toLocaleString('es-AR')}`

  // Enviar email con Resend
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
          subject: `🛒 Nuevo pedido de ${nombre} - ${totalFormato}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #D4AF37;">🛒 Nuevo Pedido - ${SITE_NAME}</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0;">📋 Datos del cliente</h3>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
              </div>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0;">📦 Productos</h3>
                ${items.map((item: any) => `
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;">
                    <span>${item.name} x${item.quantity}</span>
                    <strong>$${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}</strong>
                  </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 16px 0 0 0; font-size: 20px;">
                  <strong>TOTAL</strong>
                  <strong style="color: #D4AF37;">${totalFormato}</strong>
                </div>
              </div>
              <p style="color: #666; font-size: 12px;">Pedido recibido desde ${SITE_NAME}</p>
            </div>
          `,
        }),
      })
    } catch (e) {
      console.error('Error enviando email:', e)
    }
  }

  // Mensaje para WhatsApp del dueño
  const msgWA = encodeURIComponent(
    `🛒 *NUEVO PEDIDO - ${SITE_NAME}*\n\n` +
    `👤 *Cliente:* ${nombre}\n` +
    `📧 *Email:* ${email}\n` +
    `📱 *Teléfono:* ${telefono}\n\n` +
    `📦 *Productos:*\n${listaProductos}\n\n` +
    `💰 *TOTAL: ${totalFormato}*`
  )

  const waUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${msgWA}`

  return NextResponse.json({ ok: true, waUrl })
}
