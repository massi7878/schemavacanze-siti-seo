// Date delle schede dei tour: "12 – 18 ott" (partenza e rientro). Usato sia dal server (CardTour) sia dal browser (filtri).
const MESI_BREVI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']

// prossima = data di partenza (AAAA-MM-GG); notti = notti del tour: il rientro e' la partenza + notti giorni
export function intervalloDate(prossima: string | null | undefined, notti: number): string {
  if (!prossima) return ''
  const [a, m, g] = prossima.split('-').map(Number)
  if (!a || !m || !g) return ''
  const partenza = new Date(Date.UTC(a, m - 1, g))
  const rientro = new Date(Date.UTC(a, m - 1, g + Math.max(notti || 0, 0)))
  const gp = partenza.getUTCDate()
  const gr = rientro.getUTCDate()
  const mp = MESI_BREVI[partenza.getUTCMonth()]
  const mr = MESI_BREVI[rientro.getUTCMonth()]
  if (!notti) return `${gp} ${mp}`
  return mp === mr ? `${gp} – ${gr} ${mr}` : `${gp} ${mp} – ${gr} ${mr}`
}
