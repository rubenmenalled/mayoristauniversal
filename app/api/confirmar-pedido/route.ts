import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { catalogosConDescuento, precioUnitarioConDescuento } from '@/lib/descuentos'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'mDipqJjpjoe7kVLUnwq3'
const OWNER_EMAIL = 'rubenmenalled@gmail.com'
const OWNER_WHATSAPP = '541164660482'
const SITE_NAME = 'Mayorista Universal'
const NTFY_TOPIC = 'mayorista-ruben-pedidos-2024'

export async function POST(request: NextRequest) {
  const { nombre, email, telefono, items: itemsRecibidos, total, user_id, metodoPago } = await request.json()

  if (!nombre || !email || !telefono || !itemsRecibidos?.length) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  // Precio unitario ya con el 10% OFF aplicado (si el catálogo llegó a $500.000),
  // para que el desglose de productos coincida con el `total` que llega del carrito.
  const catalogosDescontados = catalogosConDescuento(itemsRecibidos)
  const items = itemsRecibidos.map((item: any) => ({
    ...item,
    wholesalePrice: precioUnitarioConDescuento(item, catalogosDescontados),
  }))

  // Armar lista de productos
  const listaProductos = items.map((item: any) =>
    `• ${item.brand ? `*${item.brand}* — ` : ''}${item.name} x${item.quantity} = $${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}`
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
    <h1 style="color:#FF6A3D;margin:0 0 4px 0;font-size:22px;font-weight:900;letter-spacing:0.02em;">NUEVO PEDIDO</h1>
    <p style="color:rgba(255,255,255,0.75);margin:0;font-size:13px;">Mayorista Universal — ${now}</p>
  </div>

  <!-- DATOS DEL CLIENTE -->
  <div style="background:#FFFFFF;padding:24px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
    <h2 style="color:#0F3460;font-size:14px;font-weight:900;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #FF6A3D;padding-bottom:8px;">👤 Datos del cliente</h2>
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
    <h2 style="color:#0F3460;font-size:14px;font-weight:900;margin:0 0 20px 0;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #FF6A3D;padding-bottom:8px;">📦 Productos (${cantidadTotal} unidades — ${items.length} artículo${items.length !== 1 ? 's' : ''})</h2>

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
        ${item.brand ? `<div style="margin-bottom:5px;"><span style="display:inline-block;background:#FFF1EC;color:#FF6A3D;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;padding:2px 8px;border-radius:6px;border:1px solid #FFD9CC;">Marca: ${item.brand}</span></div>` : ''}
        ${item.category ? `<div style="color:#9CA3AF;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">${item.category}</div>` : ''}
        <div style="display:table;width:100%;">
          <div style="display:table-cell;color:#6B7280;font-size:12px;">Unitario: <strong style="color:#374151;">$${Number(item.wholesalePrice).toLocaleString('es-AR')}</strong></div>
          <div style="display:table-cell;text-align:center;color:#6B7280;font-size:12px;">Cant: <strong style="color:#374151;">x${item.quantity}</strong></div>
          <div style="display:table-cell;text-align:right;"><strong style="color:#FF6A3D;font-size:15px;font-weight:900;">$${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}</strong></div>
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
      <span style="color:#FF6A3D;font-size:30px;font-weight:900;">${totalFormato}</span>
    </div>
  </div>

  <!-- PAGO -->
  <div style="background:#FFFFFF;padding:20px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;border-top:1px solid #F3F4F6;">
    <h2 style="color:#0F3460;font-size:14px;font-weight:900;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #FF6A3D;padding-bottom:8px;">💳 Pago</h2>
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

    // Email de confirmación al CLIENTE
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
          subject: `✅ Recibimos tu pedido — ${SITE_NAME}`,
          html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">

  <div style="background:linear-gradient(135deg,#0F3460 0%,#1a4a8a 100%);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
    <div style="font-size:36px;margin-bottom:8px;">✅</div>
    <h1 style="color:#FF6A3D;margin:0 0 4px 0;font-size:20px;font-weight:900;letter-spacing:0.02em;">¡RECIBIMOS TU PEDIDO!</h1>
    <p style="color:rgba(255,255,255,0.75);margin:0;font-size:13px;">${SITE_NAME} — ${now}</p>
  </div>

  <div style="background:#FFFFFF;padding:24px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
    <p style="color:#111827;font-size:15px;margin:0 0 14px 0;">Hola <strong>${nombre}</strong>, ¡gracias por tu compra!</p>
    <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;">
      Ya recibimos tu pedido de <strong>${cantidadTotal} unidades</strong> por un total de
      <strong style="color:#FF6A3D;">${totalFormato}</strong>. Lo vamos a revisar y te contactamos por
      WhatsApp para coordinar el pago y el envío.
    </p>
  </div>

  <div style="background:#FFFFFF;padding:20px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;border-top:1px solid #F3F4F6;">
    <h2 style="color:#0F3460;font-size:13px;font-weight:900;margin:0 0 14px 0;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #FF6A3D;padding-bottom:8px;">📦 Tu pedido</h2>
    ${items.map((item: any, idx: number) => `
    <div style="display:table;width:100%;margin-bottom:${idx < items.length - 1 ? '10px' : '0'};padding-bottom:${idx < items.length - 1 ? '10px' : '0'};border-bottom:${idx < items.length - 1 ? '1px solid #F3F4F6' : 'none'};">
      <div style="display:table-cell;color:#374151;font-size:13px;">${item.brand ? `<strong>${item.brand}</strong> — ` : ''}${item.name} x${item.quantity}</div>
      <div style="display:table-cell;text-align:right;color:#111827;font-size:13px;font-weight:800;white-space:nowrap;">$${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}</div>
    </div>
    `).join('')}
  </div>

  <div style="background:#0F3460;padding:16px 32px;display:table;width:100%;box-sizing:border-box;">
    <div style="display:table-cell;vertical-align:middle;color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Total</div>
    <div style="display:table-cell;vertical-align:middle;text-align:right;color:#FF6A3D;font-size:22px;font-weight:900;">${totalFormato}</div>
  </div>

  <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;">
    <p style="color:#9CA3AF;font-size:11px;margin:0;">Cualquier consulta, respondé este mail o escribinos por WhatsApp · <strong>mayoristauniversal.com</strong></p>
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
    const primeraFoto = items.find((i: any) => i.image)?.image
    const ntfyPayload: Record<string, any> = {
      topic: NTFY_TOPIC,
      title: `🛒 Nuevo pedido de ${nombre}`,
      message: `💰 TOTAL: ${totalFormato} — ${cantidadTotal} unidades\n📱 Tel: ${telefono}\n📧 ${email}\n\n${listaProductos}`,
      priority: 5,
      tags: ['shopping', 'moneybag'],
    }
    if (primeraFoto) {
      ntfyPayload.attach = primeraFoto
      ntfyPayload.icon = primeraFoto
    }
    await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ntfyPayload),
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

    // Enviar la FOTO de cada producto al dueño (Fonnte soporta media con 'url')
    try {
      const conFoto = items.filter((i: any) => i.image).slice(0, 25)
      await Promise.allSettled(conFoto.map((item: any) =>
        fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: { 'Authorization': FONNTE_TOKEN, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target: '1164660482',
            countryCode: '54',
            url: item.image,
            message:
              `${item.brand ? `*${item.brand}*\n` : ''}` +
              `${item.name}\n` +
              `x${item.quantity} · $${(item.wholesalePrice * item.quantity).toLocaleString('es-AR')}`,
          }),
        })
      ))
    } catch (e) {
      console.error('Error Fonnte fotos:', e)
    }

    // Confirmación automática al CLIENTE por WhatsApp
    try {
      const telefonoCliente = telefono.replace(/\D/g, '')
      if (telefonoCliente) {
        const msgCliente =
          `✅ *¡Recibimos tu pedido!*\n\n` +
          `Hola ${nombre}, ya nos llegó tu pedido de ${SITE_NAME} por *${totalFormato}* (${cantidadTotal} unidades).\n\n` +
          `Lo estamos revisando y en breve te contactamos por acá mismo para coordinar el pago y el envío. ¡Gracias por tu compra! 🙌`
        await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: { 'Authorization': FONNTE_TOKEN, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target: telefonoCliente,
            message: msgCliente,
            countryCode: '54',
          }),
        })
      }
    } catch (e) {
      console.error('Error Fonnte cliente:', e)
    }
  }

  return NextResponse.json({ ok: true, waUrl })
}
