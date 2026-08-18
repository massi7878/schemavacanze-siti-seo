import type { APIRoute } from 'astro'
import { getStruttureSitemap } from '../lib/queries'

export const prerender = true

export const GET: APIRoute = async ({ site }) => {
  const strutture = await getStruttureSitemap()
  const base = site?.toString().replace(/\/$/, '') ?? ''

  const urls = [
    { loc: `${base}/`, lastmod: null },
    ...strutture.map(s => ({
      loc: `${base}/villaggi/${s.slug}/`,
      lastmod: s.data_aggiornamento_contenuti ?? s.updated_at ?? null,
    })),
  ]

  const corpo = urls
    .map(u => `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : ''}\n  </url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${corpo}\n</urlset>\n`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
