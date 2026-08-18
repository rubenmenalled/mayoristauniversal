// Genera la URL /producto/<id>-<slug> de un producto — el id al principio es
// la única parte que importa para resolver el producto (ver app/producto/[id]/page.tsx),
// el resto del slug es solo para que la URL sea legible/amigable para buscadores.
export function slugify(text: string): string {
  return (text || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // saca acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function productUrl(id: number, name: string): string {
  const slug = slugify(name)
  return `/producto/${id}${slug ? '-' + slug : ''}`
}

// Extrae el id numérico del principio del segmento de URL ("75363-nombre-del-producto" → 75363).
export function parseProductId(segment: string): number | null {
  const match = segment.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : null
}
