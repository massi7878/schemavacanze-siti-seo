import { supabase } from './supabase'
import { nomeRegioneNormalizzato, slugifica } from './formato'

// Nessun dato qui viene inventato: ogni campo che manca nel database resta
// null/vuoto e la pagina omette semplicemente quella sezione, invece di
// riempirla con un valore finto.

export async function getAzienda() {
  const { data } = await supabase
    .from('azienda')
    .select(
      'ragione_sociale, nome_commerciale, telefono, cellulare, numero_whatsapp, sito_web, indirizzo, colore_primario, colore_secondario, slideshow_copertina_attivo'
    )
    .eq('attiva', true)
    .maybeSingle()
  return data
}

export async function getCopertinaHomepage() {
  const { data } = await supabase.from('homepage_copertina').select('url').order('ordine')
  return (data ?? []).map(r => r.url as string)
}

export async function getSlugStruttureAttive() {
  const { data } = await supabase
    .from('strutture')
    .select('slug')
    .eq('attiva', true)
    .not('slug', 'is', null)
  return (data ?? []).map(r => r.slug as string)
}

export async function getStruttureSitemap() {
  const { data } = await supabase
    .from('strutture')
    .select('slug, nome, localita, regione, data_aggiornamento_contenuti, updated_at')
    .eq('attiva', true)
    .not('slug', 'is', null)
  return data ?? []
}

export async function getStruttureElenco() {
  const { data } = await supabase
    .from('strutture')
    .select('id, slug, nome, localita, regione, stelle, formula')
    .eq('attiva', true)
    .not('slug', 'is', null)
  return conCopertine(data ?? [])
}

// Non filtriamo per struttura_id qui: con centinaia di strutture la lista
// di ID in un `.in()` genera un URL troppo lungo e la query fallisce in
// silenzio (nessun errore visibile, solo dati vuoti). Le righe con
// copertina=true sono comunque poche, prendiamo tutte e le smistiamo qui.
async function conCopertine<T extends { id: string }>(strutture: T[]): Promise<(T & { copertina: string | null })[]> {
  if (strutture.length === 0) return []
  const { data: copertine } = await supabase.from('struttura_media').select('struttura_id, url').eq('copertina', true)
  const copertinaPerStruttura = new Map((copertine ?? []).map(c => [c.struttura_id, c.url]))
  return strutture.map(s => ({ ...s, copertina: copertinaPerStruttura.get(s.id) ?? null }))
}

export async function getRegioni() {
  const { data } = await supabase
    .from('strutture')
    .select('regione')
    .eq('attiva', true)
    .not('regione', 'is', null)
  const conteggio = new Map<string, number>()
  for (const riga of data ?? []) {
    const nome = nomeRegioneNormalizzato(riga.regione as string)
    conteggio.set(nome, (conteggio.get(nome) ?? 0) + 1)
  }
  return Array.from(conteggio, ([nome, totale]) => ({ nome, slug: slugifica(nome), totale }))
    .sort((a, b) => b.totale - a.totale)
}

export async function getStruttureRegione(regioneSlug: string) {
  const regioni = await getRegioni()
  const regione = regioni.find(r => r.slug === regioneSlug)
  if (!regione) return { regione: null, strutture: [] }

  const { data } = await supabase
    .from('strutture')
    .select('id, slug, nome, localita, regione, stelle, formula')
    .eq('attiva', true)
    .not('slug', 'is', null)
    .not('regione', 'is', null)
  const filtrate = (data ?? []).filter(s => nomeRegioneNormalizzato(s.regione as string) === regione.nome)
  return { regione, strutture: await conCopertine(filtrate) }
}

// La tabella destinazioni non e' leggibile in anonimo (RLS: solo utenti
// autenticati del gestionale). L'unico accesso pubblico e' questa RPC
// (security definer), la stessa gia' usata dal modulo WhatsApp: qui e'
// stata estesa per restituire anche lo slug, che prima non esponeva.
async function destinazioniPubbliche() {
  const { data } = await supabase.rpc('destinazioni_pubbliche')
  return (data ?? []) as { id: string; nome: string; slug: string | null; parent_id: string | null; categoria_nome: string }[]
}

const ORDINE_CATEGORIE_DESTINAZIONE = ['Mare Italia', 'Estero', 'Crociere']

export async function getDestinazioniPerCategoria() {
  const destinazioni = await destinazioniPubbliche()
  const nomiCategorie = [...new Set(destinazioni.map(d => d.categoria_nome))].sort((a, b) => {
    const ia = ORDINE_CATEGORIE_DESTINAZIONE.indexOf(a)
    const ib = ORDINE_CATEGORIE_DESTINAZIONE.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })

  return nomiCategorie.map(nome => ({
    nome,
    destinazioni: destinazioni.filter(d => d.categoria_nome === nome && d.parent_id === null && d.slug),
  }))
}

export async function getSlugDestinazioni() {
  const destinazioni = await destinazioniPubbliche()
  return destinazioni.map(d => d.slug).filter((s): s is string => Boolean(s))
}

export async function getStruttureDestinazione(slug: string) {
  const destinazioni = await destinazioniPubbliche()
  const destinazione = destinazioni.find(d => d.slug === slug)
  if (!destinazione) return { destinazione: null, strutture: [] }

  const { data } = await supabase
    .from('strutture')
    .select('id, slug, nome, localita, regione, stelle, formula')
    .eq('attiva', true)
    .eq('destinazione_id', destinazione.id)
    .not('slug', 'is', null)
  return { destinazione, strutture: await conCopertine(data ?? []) }
}

export async function getStrutturaCompleta(slug: string) {
  const { data: struttura } = await supabase
    .from('strutture')
    .select('*')
    .eq('slug', slug)
    .eq('attiva', true)
    .maybeSingle()
  if (!struttura) return null

  // destinazioni non e' leggibile in anonimo (vedi destinazioniPubbliche
  // sopra): risolviamo nome/slug della destinazione da li', non con un
  // embed diretto sulla tabella che tornerebbe sempre null.
  const tutteDestinazioni = await destinazioniPubbliche()
  const destinazioneStruttura = struttura.destinazione_id
    ? tutteDestinazioni.find(d => d.id === struttura.destinazione_id) ?? null
    : null
  const strutturaConDestinazione = {
    ...struttura,
    destinazioni: destinazioneStruttura ? { nome: destinazioneStruttura.nome, slug: destinazioneStruttura.slug } : null,
  }

  const [{ data: servizi }, { data: camere }, { data: prezzi }, { data: riduzioni }, { data: media }] = await Promise.all([
    supabase
      .from('struttura_servizi')
      .select('servizi_struttura(nome, categoria)')
      .eq('struttura_id', struttura.id),
    supabase
      .from('tipologie_camera')
      .select('id, nome, capienza_max, note')
      .eq('struttura_id', struttura.id)
      .eq('attiva', true)
      .order('ordine'),
    supabase
      .from('prezzi_camera')
      .select('id, data_inizio, data_fine, prezzo_notte, prezzo_manuale, tipologie_camera!inner(nome, struttura_id), trattamenti(nome)')
      .eq('tipologie_camera.struttura_id', struttura.id)
      .order('data_inizio'),
    supabase
      .from('riduzioni_letto')
      .select('posizione_letto, eta_da, eta_a, tipo_riduzione, valore, note')
      .eq('struttura_id', struttura.id),
    supabase
      .from('struttura_media')
      .select('url, copertina, ordine')
      .eq('struttura_id', struttura.id)
      .eq('tipo', 'immagine')
      .order('copertina', { ascending: false })
      .order('ordine'),
  ])

  const righeServizi = (servizi ?? [])
    .map(r => r.servizi_struttura)
    .filter((s): s is { nome: string; categoria: string | null } => Boolean(s))
  const nomiServizi = new Set(righeServizi.map(s => s.nome))
  const serviziBambini = righeServizi.filter(s => s.categoria === 'Bambini e ragazzi').map(s => s.nome)

  // Stesso raggruppamento per categoria usato nel form del gestionale
  // (EditStrutturaForm), cosi' la pagina pubblica mostra esattamente le
  // stesse categorie di servizi, nello stesso ordine.
  const ORDINE_CATEGORIE = ['Struttura', 'Camere', 'Spiaggia', 'Bambini e ragazzi']
  const perCategoria = new Map<string, string[]>()
  for (const s of righeServizi) {
    const categoria = s.categoria ?? 'Altro'
    if (!perCategoria.has(categoria)) perCategoria.set(categoria, [])
    perCategoria.get(categoria)!.push(s.nome)
  }
  const serviziPerCategoria = [...perCategoria.entries()]
    .sort(([a], [b]) => {
      const ia = ORDINE_CATEGORIE.indexOf(a)
      const ib = ORDINE_CATEGORIE.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    })
    .map(([categoria, nomi]) => ({ categoria, nomi: nomi.sort((a, b) => a.localeCompare(b, 'it')) }))

  // Un prezzo puo' arrivare con tipologie_camera nullo se il filtro embedded
  // di Supabase (eq su relazione) non ha corrispondenze dirette: escludiamo
  // le righe orfane per sicurezza.
  const prezziValidi = (prezzi ?? []).filter(p => p.tipologie_camera)

  return {
    struttura: strutturaConDestinazione,
    servizi: nomiServizi,
    serviziPerCategoria,
    animaliAmmessi: nomiServizi.has('Animali ammessi'),
    animazione: nomiServizi.has('Animazione'),
    spiaggiaPrivata: nomiServizi.has('Spiaggia privata'),
    serviziBambini,
    camere: camere ?? [],
    prezzi: prezziValidi,
    riduzioni: riduzioni ?? [],
    galleria: (media ?? []).map(m => m.url),
  }
}

interface RigaOfferta {
  id: string
  titolo: string
  immagine_url: string | null
  prezzo_da: number | null
  valida_dal: string | null
  valida_al: string | null
  timer_scadenza: string | null
  // Relazione 1:1 (dettaglio_offerta_struttura non ha una propria chiave
  // primaria: offerta_id la fa da chiave), quindi PostgREST la restituisce
  // come oggetto singolo, non come array.
  dettaglio_offerta_struttura: {
    struttura_id: string
    check_in: string | null
    check_out: string | null
    notti: number | null
    trattamento: string | null
    strutture: {
      slug: string | null
      nome: string
      localita: string | null
      regione: string | null
      formula: string | null
    } | null
  } | null
}

async function offerteConDettagli() {
  const { data } = await supabase
    .from('offerte')
    .select(
      `id, titolo, immagine_url, prezzo_da, valida_dal, valida_al, timer_scadenza,
       dettaglio_offerta_struttura!inner(struttura_id, check_in, check_out, notti, trattamento,
         strutture(slug, nome, localita, regione, formula))`
    )
    .eq('attiva', true)
    .order('created_at', { ascending: false })

  const righe = (data ?? []) as unknown as RigaOfferta[]
  const strutturaIds = righe
    .map(r => r.dettaglio_offerta_struttura?.struttura_id)
    .filter((id): id is string => Boolean(id))

  const { data: bambiniGratisRighe } = strutturaIds.length
    ? await supabase
        .from('riduzioni_letto')
        .select('struttura_id')
        .in('struttura_id', strutturaIds)
        .eq('tipo_riduzione', 'gratuito')
    : { data: [] }
  const strutturaConBambiniGratis = new Set((bambiniGratisRighe ?? []).map(r => r.struttura_id))

  return righe
    .map(r => {
      const dettaglio = r.dettaglio_offerta_struttura
      const struttura = dettaglio?.strutture
      if (!dettaglio || !struttura?.slug) return null
      return {
        id: r.id,
        titolo: r.titolo,
        immagine: r.immagine_url,
        prezzoDa: r.prezzo_da,
        validaDal: r.valida_dal,
        validaAl: r.valida_al,
        timerScadenza: r.timer_scadenza,
        checkIn: dettaglio.check_in,
        checkOut: dettaglio.check_out,
        notti: dettaglio.notti,
        trattamento: dettaglio.trattamento,
        strutturaSlug: struttura.slug,
        strutturaNome: struttura.nome,
        localita: struttura.localita,
        regione: struttura.regione ? nomeRegioneNormalizzato(struttura.regione) : null,
        formula: struttura.formula,
        bambiniGratis: strutturaConBambiniGratis.has(dettaglio.struttura_id),
      }
    })
    .filter((o): o is NonNullable<typeof o> => o !== null)
}

export async function getOfferte() {
  return offerteConDettagli()
}

export async function getOffertaStruttura(strutturaSlug: string) {
  const offerte = await offerteConDettagli()
  return offerte.find(o => o.strutturaSlug === strutturaSlug) ?? null
}
