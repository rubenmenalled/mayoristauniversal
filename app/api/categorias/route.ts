import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data, error } = await supabase.from('categorias').select('*').order('nombre')
    if (error) console.error('Supabase error:', error)
    return NextResponse.json(data || [])
  } catch (e) {
    console.error(e)
    return NextResponse.json([])
  }
}
