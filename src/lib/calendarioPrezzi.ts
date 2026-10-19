// Calendario a mesi in cui si possono scegliere SOLO le date con un prezzo (ricerca per date di strutture e destinazioni).
// giorni: data (AAAA-MM-GG) -> prezzo piu' basso a persona. Lo stile e' in styles/calendario-prezzi.css.
export type Giorni = Map<string, number>

const MESI = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

export const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
export const dataIt = (iso: string) => iso.split('-').reverse().join('/')
export const dataLunga = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
export const maiuscola = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t)
export function sommaGiorni(iso: string, giorni: number) {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + giorni)
  return d.toISOString().slice(0, 10)
}

export function creaCalendario(contenitore: HTMLElement, giorni: Giorni, onScegli: (iso: string) => void) {
  const mesi = [...new Set([...giorni.keys()].map(d => d.slice(0, 7)))].sort()
  let mese = mesi[0] ?? ''
  let scelta = ''

  function disegna() {
    if (!mese) return
    const [anno, m] = mese.split('-').map(Number)
    const primo = new Date(Date.UTC(anno, m - 1, 1))
    const giorniMese = new Date(Date.UTC(anno, m, 0)).getUTCDate()
    const sfasamento = (primo.getUTCDay() + 6) % 7 // lunedi' = 0
    const indice = mesi.indexOf(mese)
    let celle = ''
    for (let i = 0; i < sfasamento; i++) celle += '<span class="pp__giorno pp__giorno--vuoto"></span>'
    for (let g = 1; g <= giorniMese; g++) {
      const iso = `${mese}-${String(g).padStart(2, '0')}`
      const prezzo = giorni.get(iso)
      if (prezzo != null) {
        celle += `<button type="button" class="pp__giorno pp__giorno--ok${iso === scelta ? ' pp__giorno--scelto' : ''}" data-data="${iso}" aria-label="${dataLunga(iso)}, da ${Math.round(prezzo)} euro a persona"><span class="pp__numero">${g}</span><span class="pp__prezzo">${Math.round(prezzo)}€</span></button>`
      } else {
        celle += `<span class="pp__giorno" aria-hidden="true"><span class="pp__numero">${g}</span></span>`
      }
    }
    contenitore.innerHTML = `
      <div class="pp__mese">
        <button type="button" class="pp__freccia" data-mese="-1" aria-label="Mese precedente" ${indice <= 0 ? 'disabled' : ''}>‹</button>
        <strong>${MESI[m - 1]} ${anno}</strong>
        <button type="button" class="pp__freccia" data-mese="1" aria-label="Mese successivo" ${indice >= mesi.length - 1 ? 'disabled' : ''}>›</button>
      </div>
      <div class="pp__settimana"><span>L</span><span>M</span><span>M</span><span>G</span><span>V</span><span>S</span><span>D</span></div>
      <div class="pp__griglia">${celle}</div>`
  }

  contenitore.addEventListener('click', e => {
    const bersaglio = e.target as HTMLElement
    const freccia = bersaglio.closest<HTMLButtonElement>('[data-mese]')
    if (freccia && !freccia.disabled) {
      const i = mesi.indexOf(mese) + Number(freccia.dataset.mese)
      if (mesi[i]) {
        mese = mesi[i]
        disegna()
      }
      return
    }
    const giorno = bersaglio.closest<HTMLButtonElement>('[data-data]')
    if (giorno?.dataset.data) {
      scelta = giorno.dataset.data
      disegna()
      onScegli(scelta)
    }
  })

  disegna()
  return {
    // toglie la data scelta (il calendario resta sul mese in cui e' ora)
    azzera() {
      scelta = ''
      disegna()
    },
    // sceglie una data da programma (es. arrivando dalla pagina della destinazione): vale solo se ha un prezzo
    scegli(iso: string) {
      if (!giorni.has(iso)) return false
      scelta = iso
      mese = iso.slice(0, 7)
      disegna()
      onScegli(iso)
      return true
    },
  }
}
