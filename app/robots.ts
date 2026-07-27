import { MetadataRoute } from 'next'

const DISALLOW = ['/admin/', '/api/', '/login', '/mi-cuenta', '/checkout', '/reset-password']

// Bots de IA permitidos explícitamente (además del '*' genérico de abajo, que ya
// los cubre) — da una señal más clara a cada crawler de que puede indexar/citar
// el sitio para respuestas de IA (ChatGPT, Claude, Perplexity, Gemini, etc.).
const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'cohere-ai',
  'Amazonbot',
  'Meta-ExternalAgent',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    sitemap: 'https://www.mayoristauniversal.com/sitemap.xml',
  }
}
