import { getToursPubblici, paesiDi, type TourElenco } from './tour'
import { slugPaese } from './slugPaese'
import { tagliaTesto } from './seo'
import { TESTI_PAESI } from './testiPaesi'

// Pagine "Tour <paese>" (es. /tour/kenya/): un tour con piu' paesi ("Kenya, Tanzania") compare in tutti i suoi paesi.
// Le pagine con pochi tour restano raggiungibili ma non vengono fatte indicizzare (sarebbero pagine povere).
export const MIN_TOUR_INDICIZZATI = 3

export interface PaeseTour {
  nome: string
  slug: string
  tour: TourElenco[]
}

export async function getPaesiTour(): Promise<PaeseTour[]> {
  const tutti = await getToursPubblici(false)
  const perPaese = new Map<string, TourElenco[]>()
  for (const t of tutti) {
    for (const p of paesiDi(t.paese)) {
      if (!perPaese.has(p)) perPaese.set(p, [])
      perPaese.get(p)!.push(t)
    }
  }
  return [...perPaese.entries()]
    .map(([nome, tour]) => ({ nome, slug: slugPaese(nome), tour }))
    .filter(p => p.slug)
    .sort((a, b) => b.tour.length - a.tour.length || a.nome.localeCompare(b.nome, 'it'))
}

export async function getPaeseTour(slug: string): Promise<PaeseTour | null> {
  return (await getPaesiTour()).find(p => p.slug === slug) ?? null
}

const euro = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const dataLunga = (iso: string) => {
  const [a, m, g] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(a, m - 1, g)))
}

// Numeri della pagina di un paese, calcolati dai tour (niente testi scritti a mano)
export function riepilogoPaese(p: PaeseTour) {
  const tour = p.tour
  const prezzi = tour.map(t => Number(t.prezzo_min ?? 0)).filter(x => x > 0)
  const giorni = tour.map(t => t.durata_giorni ?? t.notti + 1).filter(x => x > 0)
  const guidati = tour.filter(t => t.tipo_viaggio !== 'self').length
  return {
    n: tour.length,
    da: prezzi.length ? Math.min(...prezzi) : null,
    giorniMin: giorni.length ? Math.min(...giorni) : null,
    giorniMax: giorni.length ? Math.max(...giorni) : null,
    guidati,
    self: tour.length - guidati,
    conGuida: tour.filter(t => t.guida_italiano === 'si').length,
    prossima: tour.map(t => t.prossima).filter((x): x is string => !!x).sort()[0] ?? null,
  }
}

// "Tour Kenya: 36 viaggi da 935 € | Hotellando" (forma che regge per ogni paese, senza preposizioni da accordare)
export function titoloPaese(p: PaeseTour) {
  const r = riepilogoPaese(p)
  const viaggi = `${r.n} ${r.n === 1 ? 'viaggio' : 'viaggi'}`
  const varianti = [
    `Tour ${p.nome}: ${viaggi}${r.da ? ` da ${euro(r.da)}` : ''} | Hotellando`,
    `Tour ${p.nome}: ${viaggi} | Hotellando`,
    `Tour ${p.nome} | Hotellando`,
  ]
  return tagliaTesto(varianti.find(v => v.length <= 60) ?? varianti[2], 60)
}

export function descrizionePaese(p: PaeseTour) {
  const r = riepilogoPaese(p)
  const durata = r.giorniMin && r.giorniMax ? (r.giorniMin === r.giorniMax ? `${r.giorniMin} giorni` : `da ${r.giorniMin} a ${r.giorniMax} giorni`) : ''
  const parti = [
    `${r.n} tour ${p.nome} con assistenza in italiano`,
    durata,
    r.da ? `prezzi da ${euro(r.da)} a persona` : '',
    'date di partenza reali',
  ].filter(Boolean)
  return tagliaTesto(`${parti.join(', ')}. Scegli il periodo e richiedi il preventivo.`, 155)
}

// Paragrafi sotto l'elenco: tutti ricavati dai dati, mai inventati
export function testoPaese(p: PaeseTour): string[] {
  const r = riepilogoPaese(p)
  const tipi: string[] = []
  if (r.guidati) tipi.push(`${r.guidati} ${r.guidati === 1 ? 'guidato' : 'guidati'}`)
  if (r.self) tipi.push(`${r.self} self made (viaggio libero)`)
  const durata = r.giorniMin && r.giorniMax ? (r.giorniMin === r.giorniMax ? ` di ${r.giorniMin} giorni` : `, da ${r.giorniMin} a ${r.giorniMax} giorni`) : ''
  const primo = `Su Hotellando trovi ${r.n} tour ${p.nome}${tipi.length ? `: ${tipi.join(' e ')}` : ''}${durata}${r.da ? `, con prezzi che partono da ${euro(r.da)} a persona` : ''}.`
  const secondo = [
    r.conGuida ? `${r.conGuida} ${r.conGuida === 1 ? 'tour è con guida' : 'tour sono con guida'} in italiano.` : '',
    r.prossima ? `La prima partenza disponibile è il ${dataLunga(r.prossima)}.` : '',
    'Scegli il periodo e il tipo di viaggio nei filtri, poi richiedi il preventivo: ti rispondiamo con disponibilità e prezzo definitivo.',
  ]
    .filter(Boolean)
    .join(' ')
  const nomi = p.tour.slice(0, 3).map(t => t.nome.replace(/\s+/g, ' ').trim())
  const terzo = nomi.length >= 2 ? `Tra i tour disponibili: ${nomi.slice(0, -1).join(', ')} e ${nomi[nomi.length - 1]}.` : ''
  // il testo scritto a mano (cosa vedere, quando andare) viene prima; i numeri calcolati dai tour restano sempre aggiornati
  const manuale = TESTI_PAESI[p.slug]
  return (manuale ? [manuale.cosaVedere, manuale.quandoAndare, primo, secondo, terzo] : [primo, secondo, terzo]).filter(Boolean)
}

export const haTestoManuale = (slug: string) => slug in TESTI_PAESI
