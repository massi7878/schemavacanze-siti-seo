import { dataCompleta, euro } from './offerte'
import { paesiDi, righe, type TourDettaglio } from './tour'
import { soloNumeri } from './formato'

export const MODELLI_VALIDI = ['classico', 'sofly', 'terzo'] as const
export type ModelloTour = (typeof MODELLI_VALIDI)[number]

// Tutto cio' che serve a un modello di pagina, calcolato una volta sola dai dati del tour.
// I modelli (components/tour/Modello*.astro) ricevono questo oggetto e si occupano solo dell'aspetto.
export function datiPaginaTour(
  t: TourDettaglio,
  azienda: { numero_whatsapp?: string | null; telefono?: string | null; cellulare?: string | null } | null,
  urlCanonica: string
) {
  const numeroWa = soloNumeri(azienda?.numero_whatsapp)
  const telefono = azienda?.telefono || azienda?.cellulare || null
  const immagini = [...new Set([t.immagine_url, ...(t.galleria ?? [])].filter((u): u is string => Boolean(u)))]
  const partenze = t.partenze ?? []
  const prezzoMin = partenze.length ? Math.min(...partenze.map(p => Number(p.prezzo_da))) : null
  const testoWa = (partenza?: string) =>
    `Buongiorno, vorrei informazioni sul tour "${t.nome}"${partenza ? ` in partenza il ${dataCompleta(partenza)}` : ''}.`
  return {
    t,
    urlCanonica,
    immagini,
    copertina: immagini[0] ?? null,
    partenze,
    periodi: raggruppaPartenze(partenze),
    prezzoMin,
    incluso: righe(t.incluso),
    nonIncluso: righe(t.non_incluso),
    paesi: paesiDi(t.paese),
    cancellazione: [...(t.cancellazione ?? [])].sort((a, b) => b.da_giorni - a.da_giorni),
    telefono,
    linkTel: telefono ? `tel:+39${soloNumeri(telefono)}` : null,
    numeroWa,
    linkWa: (partenza?: string) => (numeroWa ? `https://wa.me/39${numeroWa}?text=${encodeURIComponent(testoWa(partenza))}` : null),
    testoCondivisione: `${t.nome}${prezzoMin != null ? ` — da ${euro(prezzoMin)} a persona` : ''}`,
  }
}

export type DatiPaginaTour = ReturnType<typeof datiPaginaTour>

export const PASTI: Record<string, string> = { colazione: 'colazione', pranzo: 'pranzo', cena: 'cena' }
export const etichettaGiorni = (da: number, a: number | null) => (a && a > da ? `Giorni ${da}–${a}` : `Giorno ${da}`)

const MS_GIORNO = 86400000
const utc = (iso: string) => {
  const [a, m, g] = iso.split('-').map(Number)
  return Date.UTC(a, m - 1, g)
}
const fmtConAnno = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const dataBreve = (iso: string) => fmtConAnno.format(new Date(utc(iso)))
const NOMI_GIORNO = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato']

// partenza entro 14 giorni = "imminente"
export function giorniAllaPartenza(iso: string) {
  const oggi = new Date()
  return Math.round((utc(iso) - Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())) / MS_GIORNO)
}

export interface Periodo {
  tipo: 'ogni_giorno' | 'ogni_settimana' | 'date'
  dal: string
  al: string
  prezzo: number
  descrizione: string
  date: string[]
}

// Le partenze che si ripetono (ogni giorno, ogni settimana) con lo stesso prezzo diventano UNA riga:
// "Ogni giorno dal 12 ott al 30 nov · 559 €". Le altre restano date singole.
export function raggruppaPartenze(partenze: Array<{ data_partenza: string; prezzo_da: number }>): Periodo[] {
  const perPrezzo = new Map<number, string[]>()
  for (const p of [...partenze].sort((a, b) => a.data_partenza.localeCompare(b.data_partenza))) {
    const k = Number(p.prezzo_da)
    if (!perPrezzo.has(k)) perPrezzo.set(k, [])
    perPrezzo.get(k)!.push(p.data_partenza)
  }
  const periodi: Periodo[] = []
  for (const [prezzo, date] of perPrezzo) {
    let i = 0
    while (i < date.length) {
      // prova a estendere una serie con passo costante (1 o 7 giorni)
      let fine = i
      let passo = 0
      if (i + 1 < date.length) {
        passo = Math.round((utc(date[i + 1]) - utc(date[i])) / MS_GIORNO)
        if (passo === 1 || passo === 7) {
          fine = i + 1
          while (fine + 1 < date.length && Math.round((utc(date[fine + 1]) - utc(date[fine])) / MS_GIORNO) === passo) fine++
        }
      }
      const lunghezza = fine - i + 1
      if (lunghezza >= 3 && (passo === 1 || passo === 7)) {
        const dal = date[i]
        const al = date[fine]
        const giorno = NOMI_GIORNO[new Date(utc(dal)).getUTCDay()]
        periodi.push({
          tipo: passo === 1 ? 'ogni_giorno' : 'ogni_settimana',
          dal,
          al,
          prezzo,
          descrizione:
            passo === 1 ? `Ogni giorno dal ${dataBreve(dal)} al ${dataBreve(al)}` : `Ogni ${giorno} dal ${dataBreve(dal)} al ${dataBreve(al)}`,
          date: date.slice(i, fine + 1),
        })
        i = fine + 1
      } else {
        periodi.push({ tipo: 'date', dal: date[i], al: date[i], prezzo, descrizione: dataBreve(date[i]), date: [date[i]] })
        i++
      }
    }
  }
  // date singole vicine con lo stesso prezzo: una riga sola
  const ordinati = periodi.sort((a, b) => a.dal.localeCompare(b.dal))
  return ordinati
}
