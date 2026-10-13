// SEO di strutture e offerte: titoli e descrizioni costruiti dai dati (tipologia, localita', stelle, formula,
// durata, prezzo), come per i tour. Un testo scritto a mano nel gestionale ha sempre la precedenza.
import { tagliaTesto } from './seo'

const MAX_TITOLO = 60
const MAX_DESCRIZIONE = 155

const contiene = (testo: string, parola: string) => parola.length > 1 && testo.toLowerCase().includes(parola.toLowerCase())

// "CAMPANIA" -> "Campania"; "alagna valsesia" -> "Alagna Valsesia" (i nomi tutti in maiuscolo nel database si leggono male nei risultati di ricerca)
const nomeProprio = (testo: string) =>
  testo === testo.toUpperCase() || testo === testo.toLowerCase()
    ? testo.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, prima: string, lettera: string) => prima + lettera.toUpperCase())
    : testo

// "a Positano", ma "ad Alagna" davanti a una A
const aLuogo = (luogo: string) => (/^a/i.test(luogo) ? `ad ${luogo}` : `a ${luogo}`)

export function titoloStruttura(s: {
  nome: string
  tipologia?: string | null
  stelle?: number | null
  localita?: string | null
  regione?: string | null
  anno?: number | null
}): string {
  const nome = s.nome.replace(/\s+/g, ' ').trim()
  const dove = nomeProprio((s.localita ?? s.regione ?? '').trim())
  const tipologia = s.tipologia && !contiene(nome, s.tipologia.split(' ')[0]) ? `${s.tipologia.toLowerCase()} ` : ''
  const stelle = s.stelle && s.stelle >= 2 ? `${tipologia}${s.stelle} stelle` : tipologia.trim()
  const doveInNome = dove ? contiene(nome, dove) : true
  const offerte = s.anno ? ` | Offerte ${s.anno}` : ''
  // dal piu' ricco al piu' semplice: si sceglie il primo che sta nel limite
  const varianti = [
    `${nome}${stelle ? `, ${stelle}` : ''}${doveInNome ? '' : ` ${aLuogo(dove)}`}${offerte}`,
    `${nome}${doveInNome ? '' : ` ${aLuogo(dove)}`}${offerte}`,
    doveInNome ? nome : `${nome} | ${dove}`,
    nome,
  ]
  return tagliaTesto(varianti.find(v => v.length <= MAX_TITOLO) ?? nome, MAX_TITOLO)
}

export function descrizioneStruttura(s: {
  nome: string
  tipologia?: string | null
  stelle?: number | null
  localita?: string | null
  regione?: string | null
  formula?: string | null
  distanzaMareKm?: number | null
  bimbiGratis?: boolean
  anno?: number | null
}): string {
  const dove = nomeProprio((s.localita ?? '').trim())
  const regione = nomeProprio((s.regione ?? '').trim())
  const tipo = (s.tipologia ?? 'struttura').toLowerCase()
  const stelle = s.stelle && s.stelle >= 2 ? ` ${s.stelle} stelle` : ''
  const luogo = dove ? ` ${aLuogo(dove)}${regione && !contiene(dove, regione) ? ` (${regione})` : ''}` : regione ? ` in ${regione}` : ''
  const dettagli = [
    s.formula,
    s.distanzaMareKm != null ? `a ${s.distanzaMareKm} km dal mare` : null,
    s.bimbiGratis ? 'bimbi gratis' : null,
  ].filter(Boolean)
  const pezzi = [
    `${s.nome}: ${tipo}${stelle}${luogo}${dettagli.length ? `, ${dettagli.join(', ')}` : ''}.`,
    s.anno ? `Foto, servizi, camere e prezzi ${s.anno}: richiedi disponibilità senza impegno.` : 'Foto, servizi, camere e prezzi: richiedi disponibilità senza impegno.',
  ]
  let testo = pezzi[0]
  if ((testo + ' ' + pezzi[1]).length <= MAX_DESCRIZIONE) testo += ' ' + pezzi[1]
  return tagliaTesto(testo, MAX_DESCRIZIONE)
}

const giorniNotti = (n: number) => `${n} ${n === 1 ? 'notte' : 'notti'}`

export function titoloOfferta(o: { titolo: string; luogo?: string | null; notti?: number | null; prezzoDa?: string | null }): string {
  const marchio = ' | Hotellando'
  const titolo = o.titolo.replace(/\s+/g, ' ').trim()
  const extra = [
    o.luogo && !contiene(titolo, o.luogo) ? o.luogo : null,
    o.notti && !/notti|notte/i.test(titolo) ? giorniNotti(o.notti) : null,
    o.prezzoDa && !titolo.includes('€') ? `da ${o.prezzoDa}` : null,
  ].filter((x): x is string => Boolean(x))
  let corpo = titolo
  for (const e of extra) {
    const prova = corpo === titolo ? `${corpo}: ${e}` : `${corpo}, ${e}`
    if (prova.length + marchio.length <= 64) corpo = prova
  }
  return tagliaTesto(corpo, 64 - marchio.length) + marchio
}

export function descrizioneOfferta(o: {
  titolo: string
  tipo: string
  luogo?: string | null
  notti?: number | null
  prezzoDa?: string | null
  prezzoTesto: string
  testo?: string | null
}): string {
  const titoloPulito = o.titolo.replace(/\s+/g, ' ').trim()
  const luogoDa = o.luogo && !contiene(titoloPulito, o.luogo) ? o.luogo : null
  const base = `${o.tipo} ${titoloPulito}${luogoDa ? `, ${luogoDa}` : ''}${o.notti ? `, ${giorniNotti(o.notti)}` : ''}${
    o.prezzoDa ? `, da ${o.prezzoDa} ${o.prezzoTesto}` : ''
  }.`
  const estratto = o.testo ? o.testo.replace(/\s+/g, ' ').trim() : ''
  const chiusura = 'Richiedi disponibilità senza impegno.'
  let testo = base
  if (estratto && (testo + ' ' + estratto).length <= MAX_DESCRIZIONE - 5) testo += ' ' + estratto
  if ((testo + ' ' + chiusura).length <= MAX_DESCRIZIONE + 3) testo += ' ' + chiusura
  return tagliaTesto(testo, MAX_DESCRIZIONE + 3)
}
