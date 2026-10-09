import type { APIRoute } from 'astro'
import { getStruttureSitemap, getDestinazioniPerCategoria, getTipologieStruttura } from '../lib/queries'
import { getOffertePubbliche, NOME_TIPO_OFFERTA } from '../lib/offerte'

// Generata a ogni richiesta (con cache CDN di un'ora): le offerte nuove entrano subito, quelle scadute escono.
export const prerender = false

export const GET: APIRoute = async ({ site }) => {
  const [strutture, categorie, tipologie, offerte] = await Promise.all([
    getStruttureSitemap(),
    getDestinazioniPerCategoria(),
    getTipologieStruttura(),
    getOffertePubbliche(),
  ])
  const base = site?.toString().replace(/\/$/, '') ?? ''

  const righeCategorie = categorie
    .map(c => `- [${c.nome}](${base}/categoria/${c.slug}/): ${c.destinazioni.map(d => `[${d.nome}](${base}/destinazioni/${d.slug}/)`).join(', ')}`)
    .join('\n')

  const righeTipologie = tipologie.map(t => `- [${t.nome}](${base}/strutture/${t.slug}/)`).join('\n')

  const righeOfferte = offerte
    .map(o => `- [${o.titolo}](${base}/offerte/${o.slug}/) — ${NOME_TIPO_OFFERTA[o.tipo] ?? 'Offerta'}${o.destinazione_nome ? `, ${o.destinazione_nome}` : ''}${o.prezzo_da != null ? `, da ${o.prezzo_da} euro` : ''}`)
    .join('\n')

  const righeStrutture = strutture
    .map(s => `- [${s.nome}](${base}/struttura/${s.slug}/)${s.localita ? ` — ${s.localita}${s.regione ? `, ${s.regione}` : ''}` : ''}`)
    .join('\n')

  const corpo = `# Hotellando

> Villaggi turistici e strutture ricettive selezionate da un'agenzia di viaggi italiana. Ogni scheda riporta solo dati verificati dall'agenzia: nessun prezzo, servizio o distanza è generato automaticamente.

## Sezioni e destinazioni

${righeCategorie}

## Tipologie di struttura

${righeTipologie}

## Offerte

${righeOfferte || 'Nessuna offerta attiva al momento.'}

## Strutture

${righeStrutture}
`

  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
