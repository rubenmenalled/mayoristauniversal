import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { CartProvider } from '@/lib/CartContext'
import AnnouncementBar from '@/components/AnnouncementBar'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import ScrollToTop from '@/components/ScrollToTop'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

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
  title: 'Mayorista Universal | Compra Mayorista Multirubro Argentina',
  description: 'Los mejores precios mayoristas en todos los rubros. Compra directa al por mayor en toda Argentina.',
  keywords: 'mayorista, argentina, productos mayoristas, compra al por mayor',
  verification: {
    google: 's3q2W7UQQi6KEELYQRfiRmI42GRRjTkE31_WoEr4QQg',
  },
  openGraph: {
    title: 'Mayorista Universal | Compra Mayorista en Argentina',
    description: 'Todos los rubros mayoristas en un solo lugar, con los mejores precios del mercado en toda Argentina.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
        <CartProvider><AnnouncementBar />{children}<ExitIntentPopup /><ScrollToTop /></CartProvider>
      </body>
    </html>
  )
}
