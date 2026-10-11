// REGOLA PRIMARIA DEI DATARI (backoffice e sito pubblico): nei datari di una coppia "da / a"
// (check-in e check-out, dal e al, partenza e rientro, data inizio e data fine...) il calendario della seconda
// data parte SEMPRE dalla prima data scelta, mai dalla data di oggi, e non permette date precedenti.
//
// Una sola volta, per tutta l'app: si riconoscono i campi data dal testo dell'etichetta, si cerca per ogni "data di fine" la
// "data di inizio" che la precede nello stesso modulo e si imposta `min` (il calendario si apre da li').
// Copia per il sito pubblico: travelgo/app/src/lib/collegaDatari.js (tenere allineate).

const INIZIO = /check[\s_-]?in|\bdal\b|\bda\b|inizio|partenza|andata|\bfrom\b/i
const FINE = /check[\s_-]?out|^\s*al\b|\bal\b|\bfine\b|rientro|ritorno|\bfino\b|\bto\b/i

function testoCampo(input: HTMLInputElement) {
  const etichetta = input.labels?.[0]?.textContent ?? ''
  return `${etichetta} ${input.getAttribute('aria-label') ?? ''} ${input.name ?? ''} ${input.id ?? ''} ${input.placeholder ?? ''}`.replace(/\s+/g, ' ').trim()
}

// senza etichetta: due datari affiancati nello stesso contenitore sono "da" e "a" (es. validita' dal / al)
function ruoloPerPosizione(input: HTMLInputElement): string | null {
  const fratelli = [...(input.parentElement?.children ?? [])].filter(e => e instanceof HTMLInputElement && e.type === 'date')
  if (fratelli.length !== 2) return null
  if (fratelli.some(f => ruoloDaTesto(f) !== null)) return null
  return fratelli[0] === input ? 'inizio' : 'fine'
}

function ruolo(input: HTMLInputElement): string | null {
  return ruoloDaTesto(input) ?? ruoloPerPosizione(input)
}

function ruoloDaTesto(input: HTMLInputElement): string | null {
  const t = testoCampo(input)
  // "Data rientro" e' una fine anche se contiene "data"; si controlla la fine prima dell'inizio per i casi come "Partenza al"
  if (FINE.test(t) && !/check[\s_-]?in/i.test(t)) return 'fine'
  if (INIZIO.test(t)) return 'inizio'
  return null
}

function campiData(input: HTMLInputElement): HTMLInputElement[] {
  const radice = input.closest('form') ?? document
  return [...radice.querySelectorAll<HTMLInputElement>('input[type="date"]')]
}

// la "data di inizio" che precede una "data di fine" (la piu' vicina, cosi' ogni riga di un preventivo ha la sua coppia)
function inizioDi(fine: HTMLInputElement): HTMLInputElement | null {
  const tutti = campiData(fine)
  for (let i = tutti.indexOf(fine) - 1; i >= 0; i--) {
    const r = ruolo(tutti[i])
    if (r === 'inizio') return tutti[i]
    if (r === 'fine') return null
  }
  return null
}

// le "date di fine" che seguono una "data di inizio" (fino alla prossima data di inizio)
function fineDi(inizio: HTMLInputElement): HTMLInputElement[] {
  const tutti = campiData(inizio)
  const fine: HTMLInputElement[] = []
  for (let i = tutti.indexOf(inizio) + 1; i < tutti.length; i++) {
    const r = ruolo(tutti[i])
    if (r === 'inizio') break
    if (r === 'fine') {
      fine.push(tutti[i])
      break
    }
  }
  return fine
}

function applicaMinimo(fine: HTMLInputElement | null, inizio: HTMLInputElement | null) {
  if (!fine || !inizio) return
  const minimo = inizio.value
  if (minimo && /^\d{4}-\d{2}-\d{2}$/.test(minimo)) {
    // un "min" gia' impostato dal modulo (es. validita' di un'offerta) resta se e' piu' alto
    const originale = fine.dataset.minOriginale ?? fine.getAttribute('min') ?? ''
    if (fine.dataset.minOriginale === undefined) fine.dataset.minOriginale = originale
    fine.min = originale && originale > minimo ? originale : minimo
  } else if (fine.dataset.minOriginale !== undefined) {
    if (fine.dataset.minOriginale) fine.min = fine.dataset.minOriginale
    else fine.removeAttribute('min')
  }
}

export function installaCollegamentoDatari(): void {
  if (typeof document === 'undefined' || (window as any).__datariCollegati) return
  (window as any).__datariCollegati = true

  // appena si sceglie la data di inizio, la data di fine non puo' partire prima
  const alCambio = (e: Event) => {
    const el = e.target
    if (!(el instanceof HTMLInputElement) || el.type !== 'date') return
    if (ruolo(el) === 'inizio') fineDi(el).forEach(f => applicaMinimo(f, el))
  }
  document.addEventListener('input', alCambio, true)
  document.addEventListener('change', alCambio, true)

  // prima che si apra il calendario della data di fine: parte dalla data di inizio
  const alFuoco = (e: Event) => {
    const el = e.target
    if (!(el instanceof HTMLInputElement) || el.type !== 'date') return
    if (ruolo(el) === 'fine') applicaMinimo(el, inizioDi(el))
  }
  document.addEventListener('focusin', alFuoco, true)
  document.addEventListener('pointerdown', alFuoco, true)
}
