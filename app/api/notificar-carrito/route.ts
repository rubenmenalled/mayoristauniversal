import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY  = process.env.RESEND_API_KEY
const FONNTE_TOKEN    = process.env.FONNTE_TOKEN || 'mDipqJjpjoe7kVLUnwq3'
const OWNER_EMAIL     = 'rubenmenalled@gmail.com'
const OWNER_WHATSAPP  = '1164660482'
const NTFY_TOPIC      = 'mayorista-ruben-pedidos-2024'

export async function POST(request: NextRequest) {
  const { items, total, metodo } = await request.json()

  if (!items?.length) return NextResponse.json({ ok: false })

  const totalFmt     = `$${Number(total).toLocaleString('es-AR')}`
  const cantUnidades = items.reduce((s: number, i: any) => s + i.quantity, 0)
  const lista        = items.map((i: any) =>
    `• ${i.name}${i.brand ? ` (${i.brand})` : ''} x${i.quantity} = $${(i.wholesalePrice * i.quantity).toLocaleString('es-AR')}`
  ).join('\n')

  // 1. ntfy
  try {
    await fetch('https://ntfy.sh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic:    NTFY_TOPIC,
        title:    `🛒 Pedido iniciado — ${metodo}`,
        message:  `TOTAL: ${totalFmt} · ${cantUnidades} unidades\n${lista}`,
        priority: 5,
        tags:     ['shopping', 'moneybag'],
      }),
    })
  } catch { /* silencioso */ }

  // 2. Email con Resend
  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    'Mayorista Universal <onboarding@resend.dev>',
          to:      [OWNER_EMAIL],
          subject: `🛒 Pedido iniciado — ${metodo} — ${totalFmt}`,
          html: `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#F0F2F5;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">
  <div style="background:linear-gradient(135deg,#0F3460,#1a4a8a);border-radius:14px 14px 0 0;padding:24px 28px;text-align:center;">
    <div style="font-size:32px;margin-bottom:6px;">🛒</div>
    <h1 style="color:#FF6A3D;margin:0;font-size:20px;font-weight:900;">PEDIDO INICIADO</h1>
    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Método: ${metodo}</p>
  </div>
  <div style="background:#fff;padding:20px 28px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
    <div style="background:#FFF8E1;border:1px solid #FF6A3D;border-radius:10px;padding:14px 18px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#7a5c1e;font-size:13px;font-weight:700;">TOTAL DEL CARRITO</span>
      <span style="color:#FF6A3D;font-size:24px;font-weight:900;">${totalFmt}</span>
    </div>
    <p style="color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px;">📦 Productos (${cantUnidades} unidades)</p>
    ${items.map((i: any) => `
    <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #f3f4f6;align-items:center;">
      ${i.image ? `<img src="${i.image}" width="52" height="52" style="border-radius:8px;object-fit:cover;border:1px solid #e5e7eb;flex-shrink:0;" />` : '<div style="width:52px;height:52px;background:#f3f4f6;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:22px;">📦</div>'}
      <div style="flex:1;">
        <div style="color:#111;font-weight:700;font-size:13px;margin-bottom:3px;">${i.name}</div>
        ${i.brand ? `<div style="color:#9ca3af;font-size:11px;text-transform:uppercase;">${i.brand}</div>` : ''}
        <div style="color:#FF6A3D;font-weight:900;font-size:14px;margin-top:4px;">$${(i.wholesalePrice * i.quantity).toLocaleString('es-AR')} <span style="color:#9ca3af;font-weight:400;font-size:11px;">(x${i.quantity})</span></div>
      </div>
    </div>`).join('')}
  </div>
  <div style="background:#0F3460;border-radius:0 0 14px 14px;padding:14px 28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:0;">Mayorista Universal · mayoristauniversal.com</p>
  </div>
</div>
</body>
</html>`,
        }),
      })
    } catch (e) { console.error('Error email:', e) }
  }

  // 3. WhatsApp via Fonnte
  if (FONNTE_TOKEN) {
    try {
      const msg =
        `🛒 *PEDIDO INICIADO - Mayorista Universal*\n` +
        `💳 Método: *${metodo}*\n` +
        `📦 ${cantUnidades} unidades\n` +
        `💰 *TOTAL: ${totalFmt}*\n\n` +
        `${lista}`
      await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': FONNTE_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: OWNER_WHATSAPP, message: msg, countryCode: '54' }),
      })
    } catch (e) { console.error('Error WA:', e) }
  }

  return NextResponse.json({ ok: true })
}
