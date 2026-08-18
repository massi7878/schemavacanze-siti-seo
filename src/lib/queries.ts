import { supabase } from './supabase'

// Nessun dato qui viene inventato: ogni campo che manca nel database resta
// null/vuoto e la pagina omette semplicemente quella sezione, invece di
// riempirla con un valore finto.

export async function getAzienda() {
  const { data } = await supabase
    .from('azienda')
    .select('ragione_sociale, nome_commerciale, telefono, cellulare, numero_whatsapp, sito_web, indirizzo')
    .eq('attiva', true)
    .maybeSingle()
  return data
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

export async function getStrutturaCompleta(slug: string) {
  const { data: struttura } = await supabase
    .from('strutture')
    .select('*, destinazioni(nome, slug)')
    .eq('slug', slug)
    .eq('attiva', true)
    .maybeSingle()
  if (!struttura) return null

  const [{ data: servizi }, { data: camere }, { data: prezzi }, { data: riduzioni }] = await Promise.all([
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
  ])

  const righeServizi = (servizi ?? [])
    .map(r => r.servizi_struttura)
    .filter((s): s is { nome: string; categoria: string | null } => Boolean(s))
  const nomiServizi = new Set(righeServizi.map(s => s.nome))
  const serviziBambini = righeServizi.filter(s => s.categoria === 'Bambini e ragazzi').map(s => s.nome)
  // Un prezzo puo' arrivare con tipologie_camera nullo se il filtro embedded
  // di Supabase (eq su relazione) non ha corrispondenze dirette: escludiamo
  // le righe orfane per sicurezza.
  const prezziValidi = (prezzi ?? []).filter(p => p.tipologie_camera)

  return {
    struttura,
    servizi: nomiServizi,
    animaliAmmessi: nomiServizi.has('Animali ammessi'),
    animazione: nomiServizi.has('Animazione'),
    spiaggiaPrivata: nomiServizi.has('Spiaggia privata'),
    serviziBambini,
    camere: camere ?? [],
    prezzi: prezziValidi,
    riduzioni: riduzioni ?? [],
  }
}
