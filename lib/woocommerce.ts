function getAuth() {
  const key = process.env.WC_KEY || ''
  const secret = process.env.WC_SECRET || ''
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
}

function getUrl() {
  return process.env.WC_URL || ''
}

function mapProducto(p: any) {
  const getMeta = (key: string) => p.meta_data?.find((m: any) => m.key === key)?.value || ''
  const badges = ['NUEVO', 'OFERTA', 'HOT', 'TOP']
  const badgeTag = p.tags?.find((t: any) => badges.includes(t.name?.toUpperCase()))
  return {
    id: p.id,
    name: p.name || '',
    brand: '',
    category: p.categories?.[0]?.name || '',
    subcategory: p.tags?.find((t: any) => !badges.includes(t.name?.toUpperCase()))?.name || '',
    price: parseFloat(p.regular_price || '0') || 0,
    wholesalePrice: parseFloat(getMeta('_precio_mayorista') || p.regular_price || '0') || 0,
    minOrder: parseInt(getMeta('_pedido_minimo') || '1') || 1,
    rating: 4.8,
    reviews: 0,
    image: p.images?.[0]?.src || '',
    badge: badgeTag?.name || '',
    discount: parseFloat(p.meta_data?.find((m: any) => m.key === '_descuento')?.value || '0') || 0,
    location: 'Buenos Aires',
  }
}

export async function fetchWooProductos() {
  try {
    const url = getUrl()
    const auth = getAuth()
    let page = 1
    let all: any[] = []
    while (true) {
      const res = await fetch(
        `${url}/wp-json/wc/v3/products?per_page=100&page=${page}&status=publish`,
        { headers: { Authorization: auth }, cache: 'no-store' }
      )
      if (!res.ok) break
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) break
      all = all.concat(data)
      if (data.length < 100) break
      page++
    }
    return all.map(mapProducto)
  } catch { return [] }
}

const EMOJIS: Record<string, string> = {
  BAZAR: '🏪', BEBES: '👶', BEBÉ: '👶',BLANQUERIA: '🛏️',
ELECTRONICA: '💻', FITNESS: '🏋️', HERRAMIENTAS: '🔧',
  JUGUETERIA: '🚗', LIBRERIA: '📚', MARROQUINERIA: '👜', MASCOTAS: '🐾',
  PELUCHES: '🧸', PERFUMERIA: '🏺', RODADOS: '🛴',
  ROPA: '👕', CALZADO: '👟', HOGAR: '🏠', COCINA: '🍳', DEPORTES: '⚽',
}

export async function fetchWooCategorias() {
  try {
    const url = getUrl()
    const auth = getAuth()
    const res = await fetch(
      `${url}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=false`,
      { headers: { Authorization: auth }, cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data as any[])
      .filter((c: any) => c.parent === 0 && c.name !== 'Uncategorized')
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        emoji: EMOJIS[c.name?.toUpperCase()] || '📦',
        image: c.image?.src || '',
        description: c.description || '',
        count: c.count || 0,
      }))
  } catch { return [] }
}
