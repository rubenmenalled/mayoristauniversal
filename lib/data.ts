import { fetchWooProductos, fetchWooCategorias } from './woocommerce'

export async function getProductos() {
  return fetchWooProductos()
}

export async function getCategorias() {
  return fetchWooCategorias()
}
