import { getAdminClient } from '@/lib/supabase'
import { productUrl } from '@/lib/slug'
import { CHUNK_SIZE } from '@/lib/sitemapConfig'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.mayoristauniversal.com'

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function GET(_req: Request, { params }: { params: Promise<{ chunk: string }> }) {
  const { chunk } = await params
  const chunkNum = parseInt(chunk, 10)
  if (!Number.isFinite(chunkNum) || chunkNum < 0) {
    return new Response('Not found', { status: 404 })
  }

  const supabase = getAdminClient()
  const offset = chunkNum * CHUNK_SIZE
  const { data } = await supabase
    .from('productos')
    .select('id, nombre')
    .or('badge.is.null,badge.neq.OCULTO')
    .order('id', { ascending: true })
    .range(offset, offset + CHUNK_SIZE - 1)

  const urls = (data || []).map(p =>
    `<url><loc>${escapeXml(BASE_URL + productUrl(p.id, p.nombre))}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`
  ).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
