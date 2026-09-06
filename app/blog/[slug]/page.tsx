import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { ArrowLeft } from 'lucide-react'
import { BLOG_POSTS, getPostBySlug } from '@/lib/blogPosts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Mayorista Universal`,
    description: post.metaDescription,
    alternates: { canonical: `https://www.mayoristauniversal.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://www.mayoristauniversal.com/blog/${post.slug}`,
      type: 'article',
      siteName: 'Mayorista Universal',
      locale: 'es_AR',
      images: [{ url: post.coverImage }],
      publishedTime: post.publishedAt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: 'Mayorista Universal' },
    publisher: {
      '@type': 'Organization',
      name: 'Mayorista Universal',
      logo: { '@type': 'ImageObject', url: 'https://www.mayoristauniversal.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.mayoristauniversal.com/blog/${post.slug}` },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.mayoristauniversal.com' },
      { '@type': 'ListItem', position: 2, name: 'Guías de compra', item: 'https://www.mayoristauniversal.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.mayoristauniversal.com/blog/${post.slug}` },
    ],
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #4B5563 0%, #374151 100%)' }}>
      <Script id={`jsonld-article-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} strategy="beforeInteractive" />
      <Script id={`jsonld-breadcrumb-blog-${post.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} strategy="beforeInteractive" />

      <div style={{ background: 'rgba(13,71,161,0.95)', borderBottom: '1px solid rgba(255,106,61,0.2)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FF6A3D', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Guías de compra
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px 70px' }}>
        <nav style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginBottom: 14 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.55)' }}>Inicio</Link> / <Link href="/blog" style={{ color: 'rgba(255,255,255,0.55)' }}>Guías de compra</Link>
        </nav>

        <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(24px,4vw,34px)', fontWeight: 900, lineHeight: 1.25, marginBottom: 16 }}>{post.title}</h1>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', marginBottom: 28, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
          <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="760px" priority />
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .blog-content { color: rgba(255,255,255,0.88); font-size: 15.5px; line-height: 1.75; }
          .blog-content h2 { color: #FFFFFF; font-size: 20px; font-weight: 900; margin: 32px 0 12px; }
          .blog-content p { margin: 0 0 16px; }
          .blog-content ul { margin: 0 0 16px; padding-left: 22px; }
          .blog-content li { margin-bottom: 6px; }
          .blog-content a { color: #FF8A63; font-weight: 700; text-decoration: underline; }
        ` }} />
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.categoryLink && (
          <Link href={`/categorias/${encodeURIComponent(post.categoryLink.nombre)}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24, padding: '12px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#0D2C54', fontWeight: 900, fontSize: 14, textDecoration: 'none' }}>
            {post.categoryLink.label} →
          </Link>
        )}
      </div>
    </div>
  )
}
