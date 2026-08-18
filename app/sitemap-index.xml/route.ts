import { getAdminClient } from '@/lib/supabase'
import { CHUNK_SIZE } from '@/lib/sitemapConfig'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.mayoristauniversal.com'

export async function GET() {
  const supabase = getAdminClient()
  const { count } = await supabase
    .from('productos')
    .select('id', { count: 'exact', head: true })
    .or('badge.is.null,badge.neq.OCULTO')

  const totalChunks = Math.max(1, Math.ceil((count || 0) / CHUNK_SIZE))
  const now = new Date().toISOString()

  const productSitemaps = Array.from({ length: totalChunks }, (_, i) =>
    `<sitemap><loc>${BASE_URL}/sitemap-products/${i}</loc><lastmod>${now}</lastmod></sitemap>`
  ).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${BASE_URL}/sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>${productSitemaps}</sitemapindex>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
