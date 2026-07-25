import { catalogoDeDescuento } from './minimos'

// Categorías con 10% OFF automático al llegar a $500.000 (ver DescuentoPopup.tsx,
// que avisa de esto al entrar a la categoría). Vacío = sin popup ni descuento en ningún catálogo.
export const CATEGORIAS_DESCUENTO_10: string[] = []

export const DESCUENTO_10_MIN = 500000
export const DESCUENTO_10_PCT = 0.10

export interface ItemParaDescuento {
  category?: string
  subcategory?: string
  wholesalePrice: number
  quantity: number
}

// Subtotal BRUTO (sin descuento) de cada catálogo presente en el carrito.
function subtotalesPorCatalogo(items: ItemParaDescuento[]): Map<string, number> {
  const subtotales = new Map<string, number>()
  for (const it of items) {
    const cat = catalogoDeDescuento(it.category, it.subcategory)
    subtotales.set(cat, (subtotales.get(cat) || 0) + it.wholesalePrice * it.quantity)
  }
  return subtotales
}

// Catálogos elegibles que ya llegaron a $500.000 (en base al subtotal SIN descontar,
// para que el descuento no reduzca su propio disparador).
export function catalogosConDescuento(items: ItemParaDescuento[]): Set<string> {
  const conDescuento = new Set<string>()
  subtotalesPorCatalogo(items).forEach((sub, cat) => {
    if (CATEGORIAS_DESCUENTO_10.includes(cat) && sub >= DESCUENTO_10_MIN) conDescuento.add(cat)
  })
  return conDescuento
}

// Precio unitario final de un ítem: con 10% OFF si su catálogo alcanzó el mínimo.
export function precioUnitarioConDescuento(item: ItemParaDescuento, catalogosDescontados: Set<string>): number {
  const cat = catalogoDeDescuento(item.category, item.subcategory)
  return catalogosDescontados.has(cat) ? Math.round(item.wholesalePrice * (1 - DESCUENTO_10_PCT)) : item.wholesalePrice
}
