import type { APIRoute } from 'astro'
import { getStruttureSitemap, getDestinazioniPerCategoria, getTipologieStruttura, getOfferte } from '../lib/queries'

export const prerender = true

// La sitemap deve elencare tutte le pagine "hub" (destinazioni, sezioni,
// tipologie, offerte), non solo le schede struttura: sono le pagine che
// raccolgono e collegano le strutture, quelle che un motore di ricerca deve
// trovare per prime per poi scoprire tutto il resto.
export const GET: APIRoute = async ({ site }) => {
  const [strutture, categorie, tipologie, offerte] = await Promise.all([
    getStruttureSitemap(),
    getDestinazioniPerCategoria(),
    getTipologieStruttura(),
    getOfferte(),
  ])
  const base = site?.toString().replace(/\/$/, '') ?? ''

  const urls = [
    { loc: `${base}/`, lastmod: null },
    ...(offerte.length > 0 ? [{ loc: `${base}/offerte/`, lastmod: null }] : []),
    ...categorie.map(c => ({ loc: `${base}/categoria/${c.slug}/`, lastmod: null })),
    ...categorie.flatMap(c => c.destinazioni.map(d => ({ loc: `${base}/destinazioni/${d.slug}/`, lastmod: null }))),
    ...tipologie.map(t => ({ loc: `${base}/strutture/${t.slug}/`, lastmod: null })),
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
