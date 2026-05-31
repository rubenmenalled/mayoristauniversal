import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'mDipqJjpjoe7kVLUnwq3'
const OWNER_EMAIL = 'rubenmenalled@gmail.com'
const OWNER_WHATSAPP = '541164660482'
const SITE_NAME = 'Mayorista Universal'
const NTFY_TOPIC = 'mayorista-ruben-pedidos-2024'

export async function POST(request: NextRequest) {
  const { nombre, email, telefono, items, total, user_id, metodoPago } = await request.json()

  if (!nombre || !email || !telefono || !items?.length) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  // Armar lista de productos
  const listaProductos = items.map((item: any) =>
    `• ${item.brand ? `[${item.brand}] ` : ''}${item.name} x${item.quantity} = $${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}`
  ).join('\n')

  const totalFormato = `$${Number(total).toLocaleString('es-AR')}`

  // Fecha y hora del pedido
  const now = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', dateStyle: 'full', timeStyle: 'short' })
  const cantidadTotal = items.reduce((s: number, i: any) => s + i.quantity, 0)

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
          subject: `🛒 Nuevo pedido de ${nombre} — ${totalFormato} (${cantidadTotal} unidades)`,
          html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:620px;margin:0 auto;padding:24px 16px;">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#0F3460 0%,#1a4a8a 100%);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
    <div style="font-size:36px;margin-bottom:8px;">🛒</div>
    <h1 style="color:#D4AF37;margin:0 0 4px 0;font-size:22px;font-weight:900;letter-spacing:0.02em;">NUEVO PEDIDO</h1>
    <p style="color:rgba(255,255,255,0.75);margin:0;font-size:13px;">Mayorista Universal — ${now}</p>
  </div>

  <!-- DATOS DEL CLIENTE -->
  <div style="background:#FFFFFF;padding:24px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
    <h2 style="color:#0F3460;font-size:14px;font-weight:900;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #D4AF37;padding-bottom:8px;">👤 Datos del cliente</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;color:#6B7280;font-size:12px;font-weight:700;width:120px;text-transform:uppercase;letter-spacing:0.05em;">Nombre</td>
        <td style="padding:8px 0;color:#111827;font-size:15px;font-weight:800;">${nombre}</td>
      </tr>
      <tr style="border-top:1px solid #F3F4F6;">
        <td style="padding:8px 0;color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Email</td>
        <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#2563EB;font-size:14px;font-weight:700;text-decoration:none;">${email}</a></td>
      </tr>
      <tr style="border-top:1px solid #F3F4F6;">
        <td style="padding:8px 0;color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">WhatsApp</td>
        <td style="padding:8px 0;"><a href="https://wa.me/${telefono.replace(/\D/g,'')}" style="color:#25D366;font-size:14px;font-weight:700;text-decoration:none;">📱 ${telefono}</a></td>
      </tr>
    </table>
  </div>

  <!-- PRODUCTOS -->
  <div style="background:#FFFFFF;padding:24px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;border-top:1px solid #F3F4F6;">
    <h2 style="color:#0F3460;font-size:14px;font-weight:900;margin:0 0 20px 0;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #D4AF37;padding-bottom:8px;">📦 Productos (${cantidadTotal} unidades — ${items.length} artículo${items.length !== 1 ? 's' : ''})</h2>

    ${items.map((item: any, idx: number) => `
    <div style="display:table;width:100%;margin-bottom:${idx < items.length - 1 ? '16px' : '0'};padding-bottom:${idx < items.length - 1 ? '16px' : '0'};border-bottom:${idx < items.length - 1 ? '1px solid #F3F4F6' : 'none'};">
      <div style="display:table-cell;vertical-align:top;width:72px;">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}" width="64" height="64" style="border-radius:10px;object-fit:cover;display:block;border:1px solid #E5E7EB;" />`
          : `<div style="width:64px;height:64px;border-radius:10px;background:#F3F4F6;display:flex;align-items:center;justify-content:center;font-size:28px;text-align:center;line-height:64px;">📦</div>`
        }
      </div>
      <div style="display:table-cell;vertical-align:top;padding-left:14px;">
        <div style="color:#111827;font-size:14px;font-weight:800;line-height:1.3;margin-bottom:4px;">${item.name}</div>
        ${item.category ? `<div style="color:#9CA3AF;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">${item.category}</div>` : ''}
        <div style="display:table;width:100%;">
          <div style="display:table-cell;color:#6B7280;font-size:12px;">Unitario: <strong style="color:#374151;">$${Number(item.wholesalePrice).toLocaleString('es-AR')}</strong></div>
          <div style="display:table-cell;text-align:center;color:#6B7280;font-size:12px;">Cant: <strong style="color:#374151;">x${item.quantity}</strong></div>
          <div style="display:table-cell;text-align:right;"><strong style="color:#D4AF37;font-size:15px;font-weight:900;">$${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}</strong></div>
        </div>
      </div>
    </div>
    `).join('')}
  </div>

  <!-- TOTAL -->
  <div style="background:#0F3460;padding:20px 32px;display:table;width:100%;box-sizing:border-box;">
    <div style="display:table-cell;vertical-align:middle;">
      <span style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Total del pedido</span><br>
      <span style="color:rgba(255,255,255,0.5);font-size:11px;">${cantidadTotal} unidades · ${items.length} artículo${items.length !== 1 ? 's' : ''}</span>
    </div>
    <div style="display:table-cell;vertical-align:middle;text-align:right;">
      <span style="color:#D4AF37;font-size:30px;font-weight:900;">${totalFormato}</span>
    </div>
  </div>

  <!-- PAGO -->
  <div style="background:#FFFFFF;padding:20px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;border-top:1px solid #F3F4F6;">
    <h2 style="color:#0F3460;font-size:14px;font-weight:900;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #D4AF37;padding-bottom:8px;">💳 Pago</h2>
    <p style="color:#374151;font-size:13px;margin:0 0 6px 0;">Método: <strong>Mercado Pago (transferencia)</strong></p>
    <p style="color:#374151;font-size:13px;margin:0;">Alias: <strong style="color:#009ee3;">ruby.mena.1972</strong> — Titular: Andres Ruben Menalled</p>
  </div>

  <!-- FOOTER -->
  <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;">
    <p style="color:#9CA3AF;font-size:11px;margin:0;">Pedido recibido en <strong>mayoristauniversal.com</strong> · ${now}</p>
  </div>

</div>
</body>
</html>
          `,
        }),
      })
    } catch (e) {
      console.error('Error enviando email:', e)
    }
  }

  // Guardar pedido en Supabase
  try {
    const admin = getAdminClient()
    await admin.from('pedidos').insert({
      user_id: user_id || null,
      nombre,
      email,
      telefono,
      items,
      total: Number(total),
      estado: 'pendiente',
    })
  } catch (e) {
    console.error('Error guardando pedido en Supabase:', e)
  }

  // Mensaje para WhatsApp del cliente → dueño
  const msgWA = encodeURIComponent(
    `🛒 *NUEVO PEDIDO - ${SITE_NAME}*\n\n` +
    `👤 *Cliente:* ${nombre}\n` +
    `📧 *Email:* ${email}\n` +
    `📱 *Teléfono:* ${telefono}\n\n` +
    `📦 *Productos:*\n${listaProductos}\n\n` +
    `💰 *TOTAL: ${totalFormato}*\n\n` +
    `💙 *Pago:* Mercado Pago (alias: ruby.mena.1972)\n` +
    `📎 Adjunto el comprobante de transferencia.`
  )

  const waUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${msgWA}`

  // Notificación push via ntfy.sh (primero para asegurar entrega)
  try {
    await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: NTFY_TOPIC,
        title: `Nuevo pedido de ${nombre}`,
        message: `TOTAL: ${totalFormato} - ${cantidadTotal} unidades\nTel: ${telefono}\nEmail: ${email}`,
        priority: 5,
        tags: ['shopping', 'moneybag'],
      }),
    })
  } catch (e) {
    console.error('Error ntfy:', e)
  }

  // Notificación automática al dueño por WhatsApp via Fonnte
  if (FONNTE_TOKEN) {
    try {
      const msgDueno =
        `🛒 *NUEVO PEDIDO - ${SITE_NAME}*\n` +
        `👤 ${nombre} | 📱 ${telefono}\n` +
        `📧 ${email}\n` +
        `📦 ${cantidadTotal} unidades\n` +
        `💰 *TOTAL: ${totalFormato}*\n\n` +
        `${listaProductos}`
      await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': FONNTE_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: '1164660482',
          message: msgDueno,
          countryCode: '54',
        }),
      })
    } catch (e) {
      console.error('Error Fonnte:', e)
    }
  }

  return NextResponse.json({ ok: true, waUrl })
}
