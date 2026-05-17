import { NextResponse } from 'next/server'
import { fetchWooCategorias } from '@/lib/woocommerce'

export async function GET() {
  const categorias = await fetchWooCategorias()
  // Añadir campo "nombre" para compatibilidad con Header y otros componentes
  const data = categorias.map((c: any) => ({ ...c, nombre: c.name }))
  return NextResponse.json(data)
}
