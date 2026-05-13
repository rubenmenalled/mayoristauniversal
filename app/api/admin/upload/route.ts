import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const folder = (formData.get('folder') as string) || 'productos'

  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const supabase = getAdminClient()
  const { error } = await supabase.storage
    .from('imagenes')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('imagenes')
    .getPublicUrl(fileName)

  return NextResponse.json({ url: publicUrl })
}
