import type { Metadata, Viewport } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { CartProvider } from '@/lib/CartContext'
import AnnouncementBar from '@/components/AnnouncementBar'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import WelcomePopup from '@/components/WelcomePopup'
import ScrollToTop from '@/components/ScrollToTop'
import WhatsAppButton from '@/components/WhatsAppButton'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const GTM_ID = 'GTM-549CX2X6'

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
  metadataBase: new URL('https://www.mayoristauniversal.com'),
  title: 'Mayorista Universal | Compra Mayorista Multirubro Argentina',
  description: 'Los mejores precios mayoristas en todos los rubros. Más de 20 categorías: indumentaria, bazar, juguetes, electrónica y más. Compra al por mayor en toda Argentina.',
  keywords: 'mayorista argentina, compra al por mayor, productos mayoristas, mayorista multirubro, venta mayorista argentina',
  verification: {
    google: 'lDQe0hIh43G49tCwjNSEswlsKxwFQDQKjfnEDPq2Glk',
  },
  openGraph: {
    title: 'Mayorista Universal | Compra Mayorista en Argentina',
    description: 'Todos los rubros mayoristas en un solo lugar, con los mejores precios del mercado en toda Argentina.',
    type: 'website',
    url: 'https://www.mayoristauniversal.com',
    siteName: 'Mayorista Universal',
    locale: 'es_AR',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mayorista Universal · Compra Mayorista en Argentina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mayorista Universal | Compra Mayorista en Argentina',
    description: 'Todos los rubros mayoristas en un solo lugar, con los mejores precios del mercado en toda Argentina.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.mayoristauniversal.com',
  },
}

// Fija el viewport para que el pinch-zoom no descoloque la página en el celular
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.mayoristauniversal.com/#organization',
      name: 'Mayorista Universal',
      url: 'https://www.mayoristauniversal.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mayoristauniversal.com/logo.png',
        width: 512,
        height: 512,
      },
      image: 'https://www.mayoristauniversal.com/logo.png',
      description: 'Distribuidora mayorista multirubro en Argentina. Más de 20 categorías: indumentaria, bazar, juguetes, electrónica y más.',
      areaServed: { '@type': 'Country', name: 'Argentina' },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'Spanish',
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.mayoristauniversal.com/#website',
      url: 'https://www.mayoristauniversal.com',
      name: 'Mayorista Universal',
      description: 'Compra mayorista multirubro en Argentina',
      publisher: { '@id': 'https://www.mayoristauniversal.com/#organization' },
      inLanguage: 'es-AR',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.mayoristauniversal.com/buscar?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
        <Script
          id="jsonld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
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
        <CartProvider><AnnouncementBar />{children}<WelcomePopup /><ExitIntentPopup /><ScrollToTop /><WhatsAppButton /></CartProvider>
      </body>
    </html>
  )
}
