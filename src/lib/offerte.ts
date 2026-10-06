import { supabase } from './supabase'

// Offerte pubblicate dal gestionale (tutti i tipi: struttura, pacchetto, tour, crociera,
// offerta veloce). Si legge SOLO tramite le funzioni del database `offerte_ricerca` e
// `offerta_pubblica`: sono le stesse che usa il gestionale per i filtri e non restituiscono mai
// dati interni (fornitore, prezzi netti, note).

export type TipoOfferta = 'standalone' | 'struttura' | 'pacchetto' | 'tour' | 'crociera'

export const NOME_TIPO_OFFERTA: Record<string, string> = {
  standalone: 'Offerta',
  struttura: 'Soggiorno',
  pacchetto: 'Pacchetto viaggio',
  tour: 'Tour',
  crociera: 'Crociera',
}

export const NOME_TIPO_PUNTO: Record<string, string> = {
  aeroporto: 'Aeroporto',
  porto: 'Porto',
  stazione: 'Stazione',
  bus: 'Bus',
}

export const NOME_MODO_TRASPORTO: Record<string, string> = {
  bus: 'Bus',
  treno: 'Treno',
  volo: 'Volo',
  traghetto: 'Traghetto',
  altro: 'Trasferimento',
}

export const NOME_FASE_TRASPORTO: Record<string, string> = {
  andata: 'Andata',
  ritorno: 'Ritorno',
  pre: 'Prima del viaggio',
  post: 'Dopo il viaggio',
}

export interface PartenzaElenco {
  data_partenza: string
  data_rientro: string
  prezzo_da: number | null
  stato: string
  giorni_fuori: number
}

export interface OffertaElenco {
  id: string
  codice: number
  slug: string
  tipo: TipoOfferta
  titolo: string
  immagine_url: string | null
  prezzo_da: number | null
  destinazione_id: string | null
  destinazione_nome: string | null
  area: string | null
  raggio: string | null
  durata_notti: number | null
  trasporto_incluso: boolean
  valida_dal: string | null
  valida_al: string | null
  tag: string[]
  punti: Array<{ id: string; tipo: string; nome: string; dettaglio: string | null }>
  partenze: PartenzaElenco[]
  prossima_partenza: string | null
}

export interface OffertaDettaglio {
  id: string
  codice: number
  slug: string
  tipo: TipoOfferta
  titolo: string
  testo: string | null
  immagine_url: string | null
  immagini: string[]
  prezzo_da: number | null
  prezzo_tipo: 'a_persona' | 'a_camera' | null
  raggio: string | null
  durata_notti: number | null
  valida_dal: string | null
  valida_al: string | null
  trasporto_incluso: boolean
  canali_richiesta: string[]
  dati_pubblici: Array<{ etichetta: string; valore: string }>
  aggiornata_il: string
  destinazione: { id: string; nome: string; slug: string; area: string | null } | null
  tag: string[]
  punti: Array<{ tipo: string; nome: string; dettaglio: string | null }>
  partenze: Array<{
    id: string
    data_partenza: string
    data_rientro: string
    prezzo_da: number | null
    stato: string
    prezzi: Array<{ categoria: string; occupazione: string | null; prezzo_da: number }>
  }>
  trasporti: Array<{ fase: string; modo: string; da: string | null; a: string | null; incluso: boolean; supplemento: number | null; note: string | null }>
  struttura: { slug: string; nome: string; localita: string | null; regione: string | null; stelle: number | null } | null
  soggiorno: { check_in: string | null; check_out: string | null; notti: number | null; trattamento: string | null } | null
  crociera: {
    porto_imbarco: string | null
    porto_sbarco: string | null
    soggiorno_pre_notti: number | null
    soggiorno_post_notti: number | null
    hotel_pre: string | null
    hotel_post: string | null
  } | null
  tour: {
    nome: string
    sottotitolo: string | null
    introduzione: string | null
    highlights: string[]
    paese: string | null
    partenza_da: string | null
    arrivo_a: string | null
    durata_giorni: number | null
    gruppo_max: number | null
    lingue: string[]
    incluso: string | null
    non_incluso: string | null
    cancellazione: Array<{ da_giorni: number; a_giorni: number; percentuale: number }>
    galleria: string[]
    tappe: Array<{
      giorno_da: number
      giorno_a: number | null
      nome: string
      sottonome: string | null
      destinazione: string | null
      descrizione: string | null
      foto_url: string | null
      pasti: string[]
      hotel: string | null
      latitudine: number | null
      longitudine: number | null
      escursioni: Array<{ nome: string; descrizione: string | null; prezzo: number | null; durata: string | null; a_persona: boolean }>
    }>
  } | null
}

// Le pagine delle offerte sono generate a ogni richiesta: l'elenco si riusa solo per pochi secondi
// (stessa istanza del server, stessa pagina che lo chiede piu' volte)
let cacheElenco: { quando: number; promessa: Promise<OffertaElenco[]> } | null = null

export function getOffertePubbliche(): Promise<OffertaElenco[]> {
  if (cacheElenco && Date.now() - cacheElenco.quando < 20_000) return cacheElenco.promessa
  const promessa = (async () => {
    const { data, error } = await supabase.rpc('offerte_ricerca', { p_limit: 500 })
    // Meglio far fallire il build (il sito precedente resta online) che pubblicare
    // una pagina offerte vuota per un errore temporaneo.
    if (error) throw new Error(`offerte_ricerca: ${error.message}`)
    return (data ?? []) as OffertaElenco[]
  })()
  cacheElenco = { quando: Date.now(), promessa }
  // se fallisce non resta in cache
  promessa.catch(() => {
    cacheElenco = null
  })
  return promessa
}

export async function getOffertaPubblica(slug: string): Promise<OffertaDettaglio | null> {
  const { data, error } = await supabase.rpc('offerta_pubblica', { p_slug: slug })
  if (error) throw new Error(`offerta_pubblica(${slug}): ${error.message}`)
  return (data as OffertaDettaglio | null) ?? null
}

// Valori dei filtri: solo quelli che hanno almeno un'offerta, con gli id che servono
// alla funzione di ricerca eseguita dal browser.
export async function getFiltriOfferte() {
  const offerte = await getOffertePubbliche()

  const nomiTag = new Set(offerte.flatMap(o => o.tag))
  const { data: tagTabella } = await supabase.from('tag').select('id, nome').order('nome')
  const tag = (tagTabella ?? []).filter(t => nomiTag.has(t.nome)) as Array<{ id: string; nome: string }>

  const punti = new Map<string, { id: string; tipo: string; nome: string }>()
  for (const o of offerte) for (const p of o.punti) punti.set(p.id, { id: p.id, tipo: p.tipo, nome: p.nome })

  const aree = [...new Set(offerte.map(o => o.area).filter((a): a is string => Boolean(a)))]
  const destinazioni = new Map<string, string>()
  for (const o of offerte) if (o.destinazione_id && o.destinazione_nome) destinazioni.set(o.destinazione_id, o.destinazione_nome)

  return {
    tag,
    aree,
    punti: [...punti.values()].sort((a, b) => a.tipo.localeCompare(b.tipo) || a.nome.localeCompare(b.nome)),
    destinazioni: [...destinazioni.entries()].map(([id, nome]) => ({ id, nome })).sort((a, b) => a.nome.localeCompare(b.nome)),
  }
}

export function urlOfferta(slug: string) {
  return `/offerte/${slug}/`
}

// "sab 3 ott" / "sabato 3 ott → sabato 10 ott (7 notti)"
const fmtGiorno = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' })
const fmtBreve = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const fmtCompleta = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function utc(iso: string) {
  const [a, m, g] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, g))
}

export function notti(partenza: string, rientro: string) {
  return Math.round((utc(rientro).getTime() - utc(partenza).getTime()) / 86400000)
}

export function descriviPartenza(partenza: string, rientro: string) {
  const n = notti(partenza, rientro)
  return `${fmtGiorno.format(utc(partenza))} → ${fmtGiorno.format(utc(rientro))} (${n} ${n === 1 ? 'notte' : 'notti'})`
}

export function dataBreve(iso: string) {
  return fmtBreve.format(utc(iso))
}

export function dataCompleta(iso: string) {
  return fmtCompleta.format(utc(iso))
}

export function euro(valore: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valore)
}
