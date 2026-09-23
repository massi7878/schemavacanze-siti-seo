import type { APIRoute } from 'astro'
import { getStruttureSitemap, getDestinazioniPerCategoria, getTipologieStruttura } from '../lib/queries'

export const prerender = true

export const GET: APIRoute = async ({ site }) => {
  const [strutture, categorie, tipologie] = await Promise.all([
    getStruttureSitemap(),
    getDestinazioniPerCategoria(),
    getTipologieStruttura(),
  ])
  const base = site?.toString().replace(/\/$/, '') ?? ''

  const righeCategorie = categorie
    .map(c => `- [${c.nome}](${base}/categoria/${c.slug}/): ${c.destinazioni.map(d => `[${d.nome}](${base}/destinazioni/${d.slug}/)`).join(', ')}`)
    .join('\n')

  const righeTipologie = tipologie.map(t => `- [${t.nome}](${base}/strutture/${t.slug}/)`).join('\n')

  const righeStrutture = strutture
    .map(s => `- [${s.nome}](${base}/villaggi/${s.slug}/)${s.localita ? ` — ${s.localita}${s.regione ? `, ${s.regione}` : ''}` : ''}`)
    .join('\n')

  const corpo = `# Hotellando

> Villaggi turistici e strutture ricettive selezionate da un'agenzia di viaggi italiana. Ogni scheda riporta solo dati verificati dall'agenzia: nessun prezzo, servizio o distanza è generato automaticamente.

## Sezioni e destinazioni

${righeCategorie}

## Tipologie di struttura

${righeTipologie}

## Strutture

${righeStrutture}
`

  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
