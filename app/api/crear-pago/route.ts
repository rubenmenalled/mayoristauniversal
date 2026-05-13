import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    const { items, nombre, email, telefono } = await request.json()

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    })

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: String(item.id),
          title: item.name,
          quantity: item.quantity,
          unit_price: item.wholesalePrice,
          currency_id: 'ARS',
        })),
        payer: {
          name: nombre,
          email: email,
          phone: { number: telefono },
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/pago-exitoso`,
          failure: `${process.env.NEXT_PUBLIC_URL}/pago-fallido`,
          pending: `${process.env.NEXT_PUBLIC_URL}/pago-exitoso`,
        },
        auto_return: 'approved',
        statement_descriptor: 'Mayorista Universal',
      },
    })

    return NextResponse.json({ url: result.init_point })
  } catch (error: any) {
    console.error('MP Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
