'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export const WHOLESALE_MIN = 90000
export const RETAIL_MIN = 40000            // mínimo para compra minorista
export const RETAIL_MARKUP = 1.30
export const EXPENSIVE_THRESHOLD = 100000  // productos > este precio tienen su propia regla
export const EXPENSIVE_MIN_QTY = 2         // necesitan 2+ unidades para precio mayorista

export interface CartItem {
  id: number
  name: string
  brand?: string
  price: number
  wholesalePrice: number
  image: string
  quantity: number
  minOrder: number
  category?: string
}

// Determina si un producto puntual está en modo mayorista
export function itemIsWholesale(item: CartItem, globalIsWholesale: boolean): boolean {
  return globalIsWholesale
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  total: number
  count: number
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  wholesaleTotal: number
  isWholesale: boolean
  displayTotal: number
  retailProgress: number
  faltaMayorista: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.minOrder } : i)
      }
      return [...prev, { ...item, quantity: item.minOrder }]
    })
    setCartOpen(true)
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateQty(id: number, qty: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  function clearCart() {
    setItems([])
  }

  const wholesaleTotal = items.reduce((sum, i) => sum + i.wholesalePrice * i.quantity, 0)
  const isWholesale = wholesaleTotal >= WHOLESALE_MIN

  // displayTotal: suma por producto según su regla individual
  const displayTotal = items.reduce((sum, i) => {
    const ws = itemIsWholesale(i, isWholesale)
    return sum + (ws ? i.wholesalePrice : Math.round(i.wholesalePrice * RETAIL_MARKUP)) * i.quantity
  }, 0)

  const total = wholesaleTotal
  const retailProgress = Math.min((wholesaleTotal / WHOLESALE_MIN) * 100, 100)
  const faltaMayorista = Math.max(0, WHOLESALE_MIN - wholesaleTotal)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      total, count, cartOpen, setCartOpen,
      wholesaleTotal, isWholesale, displayTotal, retailProgress, faltaMayorista,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
