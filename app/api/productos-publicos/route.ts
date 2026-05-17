import { NextResponse } from 'next/server'
import { fetchWooProductos } from '@/lib/woocommerce'

export async function GET() {
  const productos = await fetchWooProductos()
  return NextResponse.json(productos)
}
