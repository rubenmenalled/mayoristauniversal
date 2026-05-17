import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id')
  if (!userId) return NextResponse.json([])

  try {
    const admin = getAdminClient()
    const { data, error } = await admin
      .from('pedidos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pedidos:', error)
      return NextResponse.json([])
    }
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
