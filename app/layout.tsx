import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/CartContext'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mayorista Universal | Marketplace Mayorista Multirubro Argentina',
  description: 'El marketplace mayorista más grande de Argentina. Más de 500.000 productos de 15.000 proveedores verificados. Compra directa al por mayor en todos los rubros.',
  keywords: 'mayorista, marketplace, argentina, productos mayoristas, compra al por mayor, proveedores',
  openGraph: {
    title: 'Mayorista Universal | Marketplace Mayorista #1 de Argentina',
    description: 'Todos los rubros mayoristas en un solo lugar, con los mejores precios del mercado en toda Argentina.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body antialiased"><CartProvider>{children}</CartProvider></body>
    </html>
  )
}
