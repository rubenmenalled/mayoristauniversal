import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')

    const supabase = getAdminClient()

    if (categoria) {
      // Obtener subcategorías distintas directamente de los productos
      // para que siempre coincidan con los productos reales
      const { data, error } = await supabase
        .from('productos')
        .select('subcategoria')
        .ilike('categoria', categoria)
        .not('subcategoria', 'is', null)
        .neq('subcategoria', '')

      if (error || !data) return NextResponse.json([])

      // Deduplicar y armar el formato que espera el frontend
      const unique = [...new Set(data.map((p: any) => p.subcategoria as string))]
        .sort()
        .map((nombre, i) => ({ id: i + 1, nombre, emoji: '📦', categoria_id: 0 }))

      return NextResponse.json(unique)
    }

    // Sin categoria: devolver todo (uso interno/admin)
    const { data } = await supabase.from('subcategorias').select('*').order('nombre')
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
