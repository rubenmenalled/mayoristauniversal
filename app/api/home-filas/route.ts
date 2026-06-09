import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('home_filas')
      .select('*')
      .order('orden', { ascending: true })
    if (error || !data) return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } })
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } })
  }
}
