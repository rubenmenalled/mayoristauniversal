import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cómo Comprar al por Mayor | Mayorista Universal Argentina',
  description: 'Guía paso a paso para comprar al por mayor en Mayorista Universal. Pedido mínimo, formas de pago, envíos a todo Argentina en 3 a 7 días hábiles.',
  alternates: {
    canonical: 'https://www.mayoristauniversal.com/como-comprar',
  },
  openGraph: {
    title: 'Cómo Comprar al por Mayor | Mayorista Universal',
    description: 'Guía de compra mayorista: pedido mínimo, medios de pago y envíos a todo Argentina.',
    url: 'https://www.mayoristauniversal.com/como-comprar',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
