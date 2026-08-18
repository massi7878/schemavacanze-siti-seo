export const ETICHETTA_FORMULA: Record<string, string> = {
  all_inclusive: 'All Inclusive',
  pensione_completa: 'Pensione Completa',
  mezza_pensione: 'Mezza Pensione',
  soft_inclusive: 'Soft Inclusive',
}

export const ETICHETTA_SPIAGGIA_TIPO: Record<string, string> = {
  sabbia: 'sabbia',
  ghiaia: 'ghiaia',
  scogli: 'scogli',
  mista: 'sabbia e ghiaia',
}

// Anno dedotto dal listino prezzi attivo piu' recente, mai scritto a mano.
export function annoDaPrezzi(prezzi: Array<{ data_fine: string }>): number | null {
  if (prezzi.length === 0) return null
  const dataMassima = prezzi.reduce((max, p) => (p.data_fine > max ? p.data_fine : max), prezzi[0].data_fine)
  return new Date(dataMassima).getFullYear()
}

export function prezzoMinimo(prezzi: Array<{ prezzo_notte: number | null; prezzo_manuale: number | null }>): number | null {
  const valori = prezzi
    .map(p => p.prezzo_manuale ?? p.prezzo_notte)
    .filter((v): v is number => v != null)
  if (valori.length === 0) return null
  return Math.min(...valori)
}

export function troncaConEllissi(testo: string, massimo: number): string {
  if (testo.length <= massimo) return testo
  return testo.slice(0, massimo - 1).trimEnd() + '…'
}

export function formattaPrezzo(valore: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valore)
}

export function formattaPeriodo(dataInizio: string, dataFine: string): string {
  const formattatore = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' })
  return `${formattatore.format(new Date(dataInizio))} – ${formattatore.format(new Date(dataFine))}`
}

interface RigaPrezzo {
  tipologie_camera: { nome: string } | null
  trattamenti: { nome: string } | null
  data_inizio: string
  data_fine: string
  prezzo_notte: number | null
  prezzo_manuale: number | null
}

export interface RigaTabellaPrezzi {
  tipologia: string
  trattamento: string | null
  periodo: string
  prezzo: number
}

// Una riga per tipologia+periodo, ordinata per data: cosi' la tabella
// prezzi rispecchia esattamente il listino salvato nel gestionale.
export function tabellaPrezzi(prezzi: RigaPrezzo[]): RigaTabellaPrezzi[] {
  return prezzi
    .map(p => ({
      tipologia: p.tipologie_camera?.nome ?? '',
      trattamento: p.trattamenti?.nome ?? null,
      periodo: formattaPeriodo(p.data_inizio, p.data_fine),
      prezzo: p.prezzo_manuale ?? p.prezzo_notte ?? 0,
    }))
    .filter(riga => riga.tipologia && riga.prezzo > 0)
}

export function etichettaRiduzione(posizioneLetto: string, etaDa: number, etaA: number, tipo: string, valore: number | null): string {
  const base = `${posizioneLetto}° letto, ${etaDa}-${etaA} anni`
  if (tipo === 'gratuito') return `${base}: gratuito`
  return `${base}: -${valore}%`
}
