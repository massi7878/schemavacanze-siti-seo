import type { APIRoute } from 'astro'
import { getAzienda, getStruttureSitemap } from '../lib/queries'

export const prerender = true

export const GET: APIRoute = async ({ site }) => {
  const azienda = await getAzienda()
  const strutture = await getStruttureSitemap()
  const base = site?.toString().replace(/\/$/, '') ?? ''
  const nome = azienda?.nome_commerciale ?? azienda?.ragione_sociale ?? 'Schema Vacanze'

  const righeStrutture = strutture
    .map(s => `- [${s.nome}](${base}/villaggi/${s.slug}/)${s.localita ? ` — ${s.localita}${s.regione ? `, ${s.regione}` : ''}` : ''}`)
    .join('\n')

  const corpo = `# ${nome}

> Villaggi turistici e strutture ricettive selezionate da un'agenzia di viaggi italiana. Ogni scheda riporta solo dati verificati dall'agenzia: nessun prezzo, servizio o distanza è generato automaticamente.

## Strutture

${righeStrutture}
`

  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
