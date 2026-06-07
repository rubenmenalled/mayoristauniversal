import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { urls } = await request.json() as { urls: string[] }
  if (!Array.isArray(urls)) return NextResponse.json({ error: 'urls requerido' }, { status: 400 })

  const result: Record<string, string> = {}

  await Promise.all(
    urls.filter(Boolean).map(async (url) => {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
        if (!res.ok) return
        const contentType = res.headers.get('content-type') || 'image/jpeg'
        const buffer = await res.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        result[url] = `data:${contentType};base64,${base64}`
      } catch {
        // silencioso si falla una imagen
      }
    })
  )

  return NextResponse.json(result)
}
