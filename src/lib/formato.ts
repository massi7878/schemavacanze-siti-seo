// Stessa funzione usata nel gestionale (PreventivoPubblico) per costruire
// link tel:/wa.me da un numero scritto con spazi.
export function soloNumeri(valore?: string | null) {
  return (valore ?? '').replace(/\D/g, '')
}

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

// Nel gestionale questi campi si compilano "una voce per riga": qui li
// spezziamo per riga per renderli come elenco, senza aggiungere nulla.
export function righeDaTesto(testo: string): string[] {
  return testo.split('\n').map(r => r.trim()).filter(Boolean)
}

const ACCENTI: Record<string, string> = { à: 'a', á: 'a', è: 'e', é: 'e', ì: 'i', í: 'i', ò: 'o', ó: 'o', ù: 'u', ú: 'u' }

export function slugifica(testo: string): string {
  return testo
    .trim()
    .toLowerCase()
    .replace(/[àáèéìíòóùú]/g, c => ACCENTI[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Normalizza varianti di maiuscole/minuscole e spazi della stessa regione
// (es. "CALABRIA" / "Calabria " / "calabria") sotto un'unica etichetta.
export function nomeRegioneNormalizzato(regione: string): string {
  return regione.trim().replace(/\s+/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

// Stessa logica di scurisci() in app/src/lib/colori.js nel gestionale, cosi'
// il colore primario dell'azienda genera qui le stesse sfumature usate li'.
export function scurisci(hex: string, percentuale = 15): string {
  const valore = hex.replace('#', '')
  const numero = parseInt(valore, 16)
  const fattore = 1 - percentuale / 100
  const r = Math.max(0, Math.round(((numero >> 16) & 0xff) * fattore))
  const g = Math.max(0, Math.round(((numero >> 8) & 0xff) * fattore))
  const b = Math.max(0, Math.round((numero & 0xff) * fattore))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function schiarisci(hex: string, percentuale = 85): string {
  const valore = hex.replace('#', '')
  const numero = parseInt(valore, 16)
  const r = Math.min(255, Math.round(((numero >> 16) & 0xff) + (255 - ((numero >> 16) & 0xff)) * (percentuale / 100)))
  const g = Math.min(255, Math.round(((numero >> 8) & 0xff) + (255 - ((numero >> 8) & 0xff)) * (percentuale / 100)))
  const b = Math.min(255, Math.round((numero & 0xff) + (255 - (numero & 0xff)) * (percentuale / 100)))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Testo bianco o inchiostro scuro sopra `hex`, a seconda di quale garantisce
// piu' contrasto (formula di luminanza relativa standard WCAG).
export function testoLeggibileSu(hex: string): string {
  const valore = hex.replace('#', '')
  const numero = parseInt(valore, 16)
  const r = (numero >> 16) & 0xff
  const g = (numero >> 8) & 0xff
  const b = numero & 0xff
  const luminanza = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminanza > 0.6 ? '#26291f' : '#ffffff'
}
