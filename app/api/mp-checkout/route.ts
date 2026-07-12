import { NextRequest, NextResponse } from 'next/server'
import { catalogosConDescuento, precioUnitarioConDescuento } from '@/lib/descuentos'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { items } = await request.json()
  const accessToken = process.env.MP_ACCESS_TOKEN

  if (!accessToken) {
    return NextResponse.json({ error: 'MP_ACCESS_TOKEN no configurado' }, { status: 500 })
  }

  const catalogosDescontados = catalogosConDescuento(items)
  const mpItems = items.map((item: any) => {
    const basePrice = precioUnitarioConDescuento(item, catalogosDescontados)
    const priceWithSurcharge = Math.round(basePrice * 1.10)
    return {
      id: String(item.id),
      title: item.name,
      quantity: item.quantity,
      unit_price: priceWithSurcharge,
      currency_id: 'ARS',
      picture_url: item.image || undefined,
    }
  })

  const preference = {
    items: mpItems,
    back_urls: {
      success: 'https://mayoristauniversal.com/pago?status=success',
      failure: 'https://mayoristauniversal.com/pago?status=failure',
      pending: 'https://mayoristauniversal.com/pago?status=pending',
    },
    auto_return: 'approved',
    statement_descriptor: 'Mayorista Universal',
  }

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ init_point: data.init_point })
}
