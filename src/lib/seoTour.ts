// SEO dei tour: titolo, descrizione e dati strutturati ricavati dai dati del tour (paese, durata, tipo di viaggio,
// guida in italiano, tappe, partenze, prezzo). Nessun testo da scrivere a mano: cambiando il tour nel gestionale
// cambiano da soli. Se nel tour sono scritti seo_titolo / seo_meta_description, quelli vincono.
import { euro } from './offerte'
import { grafoBriciole, grafoAzienda, tagliaTesto } from './seo'
import type { TourDettaglio } from './tour'

const MAX_TITOLO = 64 // compreso " | Hotellando"
const MAX_DESCRIZIONE = 158

const contiene = (testo: string, parole: string[]) => parole.some(p => testo.toLowerCase().includes(p))

// La guida come la mostra la pagina: "con guida in italiano", "guida in italiano su richiesta", "assistenza in italiano".
export function testoGuida(t: Pick<TourDettaglio, 'guida_italiano' | 'lingue'>): string | null {
  if (t.guida_italiano === 'si') return 'con guida in italiano'
  if (t.guida_italiano === 'su_richiesta') return 'guida in italiano su richiesta'
  if (t.lingue?.some(l => /ital/i.test(l)) || (t.lingue?.length ?? 0) > 0) return 'con assistenza in italiano'
  return null
}

const tipoViaggio = (t: Pick<TourDettaglio, 'tipo_viaggio'>) => (t.tipo_viaggio === 'self' ? 'viaggio in autonomia' : 'tour guidato')
const giorni = (n: number) => `${n} ${n === 1 ? 'giorno' : 'giorni'}`
const durataTesto = (t: Pick<TourDettaglio, 'durata_giorni' | 'notti'>) =>
  t.durata_giorni
    ? t.notti > 0
      ? `${giorni(t.durata_giorni)} / ${t.notti} ${t.notti === 1 ? 'notte' : 'notti'}`
      : giorni(t.durata_giorni)
    : t.notti
      ? `${t.notti} ${t.notti === 1 ? 'notte' : 'notti'}`
      : null

// Nome per i motori di ricerca: senza il numero d'ordine dei listini ("04 India Classica" diventa "India Classica").
const nomeSeo = (nome: string) => nome.replace(/\s+/g, ' ').trim().replace(/^\d{1,3}\s+(?=\p{L})/u, '')

export function titoloTour(t: TourDettaglio, prezzoMin: number | null): string {
  if (t.seo_titolo) return t.seo_titolo
  const marchio = ' | Hotellando'
  const nome = nomeSeo(t.nome)
  // dettagli utili alla ricerca, aggiunti nell'ordine di importanza finche' il titolo sta nel limite
  const extra = [
    t.durata_giorni && !contiene(nome, ['giorni', 'giorno', 'notti']) ? giorni(t.durata_giorni) : null,
    prezzoMin != null && !contiene(nome, ['€', 'da ']) ? `da ${euro(prezzoMin)}` : null,
    t.guida_italiano === 'si' && !contiene(nome, ['italiano']) ? 'guida in italiano' : null,
  ].filter((x): x is string => Boolean(x))
  let corpo = nome
  for (const e of extra) {
    const prova = corpo === nome ? `${corpo}: ${e}` : `${corpo}, ${e}`
    if (prova.length + marchio.length <= MAX_TITOLO) corpo = prova
  }
  return tagliaTesto(corpo, MAX_TITOLO - marchio.length) + marchio
}

export function descrizioneTour(t: TourDettaglio, prezzoMin: number | null, paesi: string[]): string {
  if (t.seo_meta_description) return t.seo_meta_description
  const dove = paesi.length ? ` in ${paesi.slice(0, 3).join(', ')}` : ''
  const luoghi = [...new Set(t.tappe.map(x => x.nome.split(',')[0].trim()).filter(Boolean))]
  const guida = testoGuida(t)
  const pezzi = [
    `${nomeSeo(t.nome)}: ${tipoViaggio(t)}${dove}${durataTesto(t) ? `, ${durataTesto(t)}` : ''}${guida ? `, ${guida}` : ''}.`,
    prezzoMin != null ? `Da ${euro(prezzoMin)} a persona.` : null,
    luoghi.length ? `Tappe: ${luoghi.slice(0, 6).join(', ')}.` : null,
    'Richiedi disponibilità senza impegno.',
  ].filter((x): x is string => Boolean(x))
  // si aggiungono i pezzi finche' la descrizione sta nel limite (il primo c'e' sempre)
  let testo = pezzi[0]
  for (const p of pezzi.slice(1)) if ((testo + ' ' + p).length <= MAX_DESCRIZIONE) testo += ' ' + p
  return tagliaTesto(testo, MAX_DESCRIZIONE)
}

// Dati strutturati: viaggio (con itinerario, lingua, partenze e prezzo), percorso di navigazione, azienda e sito.
export function grafoTour(opts: {
  t: TourDettaglio
  url: string
  titolo: string
  descrizione: string
  immagini: string[]
  prezzoMin: number | null
  paesi: string[]
  azienda: Parameters<typeof grafoAzienda>[0]
  sito: string | URL | undefined
}) {
  const { t, url, descrizione, immagini, prezzoMin, paesi, azienda, sito } = opts
  const base = String(sito ?? '').replace(/\/$/, '')
  const prezzi = t.partenze.map(p => Number(p.prezzo_da)).filter(n => n > 0)
  const ultima = t.partenze.length ? t.partenze[t.partenze.length - 1].data_partenza : null
  const italiano = t.guida_italiano === 'si' || t.guida_italiano === 'su_richiesta' || (t.lingue?.length ?? 0) > 0
  const viaggio: Record<string, any> = {
    '@type': 'TouristTrip',
    '@id': `${url}#viaggio`,
    name: nomeSeo(t.nome),
    description: descrizione,
    url,
    ...(immagini.length ? { image: immagini.slice(0, 6) } : {}),
    touristType: t.tipo_viaggio === 'self' ? 'Viaggiatori in autonomia (self drive)' : 'Gruppi con tour guidato',
    ...(italiano ? { inLanguage: 'it' } : {}),
    ...(paesi.length ? { areaServed: paesi.map(p => ({ '@type': 'Country', name: p })) } : {}),
    ...(t.tappe.length
      ? {
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: t.tappe.length,
            itemListElement: t.tappe.map((x, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'TouristDestination',
                name: x.nome,
                ...(x.descrizione ? { description: tagliaTesto(x.descrizione, 220) } : {}),
              },
            })),
          },
        }
      : {}),
    provider: { '@id': `${base}/#azienda` },
    ...(prezzoMin != null
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: prezzoMin,
            ...(prezzi.length ? { highPrice: Math.max(...prezzi) } : {}),
            offerCount: t.partenze.length,
            availability: 'https://schema.org/InStock',
            url,
            ...(ultima ? { priceValidUntil: ultima } : {}),
          },
        }
      : {}),
    additionalProperty: [
      ...(t.durata_giorni ? [{ '@type': 'PropertyValue', name: 'Durata', value: durataTesto(t) }] : []),
      { '@type': 'PropertyValue', name: 'Tipo di viaggio', value: t.tipo_viaggio === 'self' ? 'Self drive / in autonomia' : 'Tour guidato' },
      ...(testoGuida(t) ? [{ '@type': 'PropertyValue', name: 'Guida', value: testoGuida(t) }] : []),
    ],
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      viaggio,
      grafoBriciole(
        [
          { nome: 'Home', href: '/' },
          { nome: 'Tour', href: '/tour/' },
          { nome: nomeSeo(t.nome), href: url },
        ],
        sito
      ),
    ],
  }
}
