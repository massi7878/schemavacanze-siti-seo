import { supabase } from './supabase'

// Tour (viaggi di gruppo/fly&drive dei fornitori esteri) mostrati nella sezione /tour/.
// Si legge SOLO tramite le funzioni del database `tour_ricerca_pubblica` e `tour_pubblico`:
// non restituiscono mai il fornitore, il netto o altri dati interni, solo il prezzo lordo in euro.

export interface TourElenco {
  id: string
  slug: string
  nome: string
  sottotitolo: string | null
  immagine_url: string | null
  paese: string | null
  durata_giorni: number | null
  notti: number
  highlights: string[]
  prezzo_min: number | null
  prossima: string | null
  n_partenze: number
  guida_italiano: 'si' | 'su_richiesta' | 'no'
}

export interface TourDettaglio {
  guida_italiano?: 'si' | 'su_richiesta' | 'no'
  id: string
  slug: string
  nome: string
  sottotitolo: string | null
  immagine_url: string | null
  introduzione: string | null
  highlights: string[]
  paese: string | null
  partenza_da: string | null
  arrivo_a: string | null
  durata_giorni: number | null
  notti: number
  gruppo_max: number | null
  lingue: string[]
  incluso: string | null
  non_incluso: string | null
  cancellazione: Array<{ da_giorni: number; a_giorni: number; percentuale: number }>
  seo_titolo: string | null
  seo_meta_description: string | null
  modello?: string
  galleria: string[]
  tappe: Array<{
    giorno_da: number
    giorno_a: number | null
    nome: string
    sottonome: string | null
    descrizione: string | null
    foto_url: string | null
    pasti: string[]
    hotel: string | null
    escursioni: Array<{ nome: string; descrizione: string | null; prezzo: number; durata: string | null; a_persona: boolean }>
  }>
  partenze: Array<{
    data_partenza: string
    data_rientro: string
    prezzo_da: number
    stato: string
    supplemento_singola: number | null
    riduzione_tripla: number | null
    riduzione_bambino: number | null
  }>
}

const cacheElenco = new Map<string, { quando: number; promessa: Promise<TourElenco[]> }>()

// Tutti i tour con almeno una partenza futura (nessun filtro): serve per l'elenco iniziale e per
// costruire i valori dei filtri. Riusato per pochi secondi dalla stessa istanza del server.
// soloGuida = solo i tour con guida in italiano (anche su richiesta), quelli con guida garantita per primi.
export function getToursPubblici(soloGuida = false): Promise<TourElenco[]> {
  const chiave = soloGuida ? 'guida' : 'tutti'
  const nota = cacheElenco.get(chiave)
  if (nota && Date.now() - nota.quando < 20_000) return nota.promessa
  const promessa = (async () => {
    const { data, error } = await supabase.rpc('tour_ricerca_pubblica', soloGuida ? { p_limit: 1000, p_guida: true } : { p_limit: 1000 })
    if (error) throw new Error(`tour_ricerca_pubblica: ${error.message}`)
    return (data ?? []) as TourElenco[]
  })()
  cacheElenco.set(chiave, { quando: Date.now(), promessa })
  promessa.catch(() => {
    cacheElenco.delete(chiave)
  })
  return promessa
}

// Testo della guida in italiano per le schede e la pagina del tour (null = niente da mostrare nelle schede)
export function etichettaGuida(valore: string | null | undefined): string | null {
  if (valore === 'si') return 'Guida in italiano'
  if (valore === 'su_richiesta') return 'Italiano su richiesta'
  return null
}

export async function getTourPubblico(slug: string): Promise<TourDettaglio | null> {
  const { data, error } = await supabase.rpc('tour_pubblico', { p_slug: slug })
  if (error) throw new Error(`tour_pubblico(${slug}): ${error.message}`)
  return (data as TourDettaglio | null) ?? null
}

export const urlTour = (slug: string) => `/tour/${slug}/`

export const MESI = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

// I paesi di un tour sono scritti "Cambogia, Laos": per il filtro si spezzano
export const paesiDi = (paese: string | null) =>
  String(paese ?? '')
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)

// Mesi di partenza proposti nel filtro: dal mese corrente per 18 mesi
export function periodiProposti() {
  const oggi = new Date()
  return Array.from({ length: 18 }, (_, i) => {
    const d = new Date(oggi.getFullYear(), oggi.getMonth() + i, 1)
    const anno = d.getFullYear()
    const mese = d.getMonth() + 1
    const ultimo = new Date(anno, mese, 0).getDate()
    const due = (n: number) => String(n).padStart(2, '0')
    return { valore: `${anno}-${due(mese)}`, etichetta: `${MESI[mese - 1]} ${anno}`, dal: `${anno}-${due(mese)}-01`, al: `${anno}-${due(mese)}-${due(ultimo)}` }
  })
}

// Righe di testo ("incluso" / "non incluso") -> elenco
export const righe = (testo: string | null) =>
  String(testo ?? '')
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)
