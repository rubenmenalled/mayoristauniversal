import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')

    // Si se pasa categoria, filtrar SOLO las subcategorías de ese rubro
    if (categoria) {
      const { data: cats } = await supabase
        .from('categorias')
        .select('id')
        .ilike('nombre', categoria)

      if (!cats || cats.length === 0) return NextResponse.json([])

      const id = cats[0].id
      const { data } = await supabase
        .from('subcategorias')
        .select('*')
        .eq('categoria_id', id)
        .order('nombre')
      return NextResponse.json(data || [])
    }

    // Sin categoria devolver todo (solo para admin)
    const { data } = await supabase.from('subcategorias').select('*').order('nombre')
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
