import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blogPosts'

export const metadata: Metadata = {
  title: 'Guías de compra al por mayor | Mayorista Universal',
  description: 'Guías prácticas para revendedores: cómo elegir mercadería, calcular márgenes y armar tu surtido en juguetería, peluches, bijouterie, bazar, perfumería y más.',
  alternates: { canonical: 'https://www.mayoristauniversal.com/blog' },
  openGraph: {
    title: 'Guías de compra al por mayor | Mayorista Universal',
    description: 'Guías prácticas para revendedores: cómo elegir mercadería, calcular márgenes y armar tu surtido por rubro.',
    url: 'https://www.mayoristauniversal.com/blog',
    type: 'website',
    siteName: 'Mayorista Universal',
    locale: 'es_AR',
  },
}

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1877F2 0%, #1465D8 100%)' }}>
      <div style={{ background: 'rgba(13,71,161,0.95)', borderBottom: '1px solid rgba(255,106,61,0.2)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FF6A3D', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Inicio
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 60px' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(24px,4vw,34px)', fontWeight: 900, marginBottom: 8 }}>Guías de compra al por mayor</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 32, maxWidth: 680 }}>
          Consejos prácticos para revendedores, jugueterías, kioscos y tiendas online: cómo elegir mercadería, calcular márgenes y armar el surtido que mejor rota en cada rubro.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{ background: '#FFFFFF', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: 160, background: '#F0F0F0' }}>
                  <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 640px) 100vw, 320px" />
                </div>
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ color: '#0D2C54', fontSize: 15.5, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>{post.title}</h2>
                  <p style={{ color: '#6B7280', fontSize: 12.5, lineHeight: 1.5, flex: 1 }}>{post.excerpt}</p>
                  <span style={{ color: '#FF6A3D', fontSize: 12, fontWeight: 800, marginTop: 10 }}>Leer guía →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
