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

    // Buscar el id de la categoría por nombre
    if (categoria) {
      const { data: cat } = await supabase
        .from('categorias')
        .select('id')
        .ilike('nombre', categoria)
        .single()

      if (cat) {
        const { data } = await supabase
          .from('subcategorias')
          .select('*')
          .eq('categoria_id', cat.id)
          .order('nombre')
        return NextResponse.json(data || [])
      }
    }

    const { data } = await supabase.from('subcategorias').select('*').order('nombre')
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
