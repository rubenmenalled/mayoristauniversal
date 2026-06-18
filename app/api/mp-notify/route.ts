import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const OWNER_EMAIL = 'rubenmenalled@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const { items, isWholesale, total } = await request.json()

    if (!items?.length || !RESEND_API_KEY) {
      return NextResponse.json({ ok: false })
    }

    const now = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    const cantidadTotal = items.reduce((s: number, i: any) => s + i.quantity, 0)
    const totalFormato = `$${Number(total).toLocaleString('es-AR')}`
    const modo = isWholesale ? 'MAYORISTA' : 'MINORISTA'

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Mayorista Universal <onboarding@resend.dev>',
        to: [OWNER_EMAIL],
        subject: `💳 Pago recibido por MercadoPago — ${totalFormato} (${cantidadTotal} unidades)`,
        html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F2F5;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:620px;margin:0 auto;padding:24px 16px;">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#009EE3 0%,#0070BA 100%);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
    <div style="font-size:36px;margin-bottom:8px;">💳</div>
    <h1 style="color:#FFFFFF;margin:0 0 4px 0;font-size:22px;font-weight:900;">PAGO RECIBIDO</h1>
    <p style="color:rgba(255,255,255,0.8);margin:0;font-size:13px;">Mercado Pago — ${now}</p>
  </div>

  <!-- MODO -->
  <div style="background:#FFFFFF;padding:16px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;text-align:center;">
    <span style="background:${isWholesale ? '#D1FAE5' : '#DBEAFE'};color:${isWholesale ? '#065F46' : '#1E40AF'};font-size:13px;font-weight:900;padding:6px 16px;border-radius:99px;">
      Precio ${modo}
    </span>
  </div>

  <!-- PRODUCTOS -->
  <div style="background:#FFFFFF;padding:24px 32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;border-top:1px solid #F3F4F6;">
    <h2 style="color:#0F3460;font-size:14px;font-weight:900;margin:0 0 20px 0;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #FF6A3D;padding-bottom:8px;">
      📦 Productos (${cantidadTotal} unidades — ${items.length} artículo${items.length !== 1 ? 's' : ''})
    </h2>
    ${items.map((item: any, idx: number) => {
      const precio = isWholesale ? item.wholesalePrice : Math.round(item.wholesalePrice * 1.30)
      const subtotal = precio * item.quantity
      return `
      <div style="margin-bottom:${idx < items.length - 1 ? '16px' : '0'};padding-bottom:${idx < items.length - 1 ? '16px' : '0'};border-bottom:${idx < items.length - 1 ? '1px solid #F3F4F6' : 'none'};display:table;width:100%;">
        <div style="display:table-cell;vertical-align:top;width:72px;">
          ${item.image
            ? `<img src="${item.image}" alt="${item.name}" width="60" height="60" style="border-radius:8px;object-fit:cover;display:block;border:1px solid #E5E7EB;" />`
            : `<div style="width:60px;height:60px;border-radius:8px;background:#F3F4F6;text-align:center;line-height:60px;font-size:24px;">📦</div>`
          }
        </div>
        <div style="display:table-cell;vertical-align:top;padding-left:14px;">
          ${item.brand ? `<div style="color:#9CA3AF;font-size:10px;font-weight:600;text-transform:uppercase;margin-bottom:2px;">${item.brand}</div>` : ''}
          <div style="color:#111827;font-size:13px;font-weight:800;line-height:1.3;margin-bottom:6px;">${item.name}</div>
          <div style="color:#6B7280;font-size:12px;">
            $${precio.toLocaleString('es-AR')} c/u × ${item.quantity} =
            <strong style="color:#FF6A3D;font-size:14px;"> $${subtotal.toLocaleString('es-AR')}</strong>
          </div>
        </div>
      </div>`
    }).join('')}
  </div>

  <!-- TOTAL -->
  <div style="background:#0F3460;padding:20px 32px;display:table;width:100%;box-sizing:border-box;">
    <div style="display:table-cell;vertical-align:middle;">
      <span style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Total cobrado con MP (+10%)</span>
    </div>
    <div style="display:table-cell;vertical-align:middle;text-align:right;">
      <span style="color:#FF6A3D;font-size:30px;font-weight:900;">${totalFormato}</span>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:0 0 16px 16px;padding:16px 32px;text-align:center;">
    <p style="color:#9CA3AF;font-size:11px;margin:0;">Pago vía Mercado Pago en <strong>mayoristauniversal.com</strong></p>
  </div>

</div>
</body>
</html>`,
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('mp-notify error:', e)
    return NextResponse.json({ ok: false })
  }
}
