// "Prenota online": quali strutture hanno prezzi di partenza (elenco dal database, ricordato per 10 minuti).
const CHIAVE = 'strutture-prenota-online'

async function leggi(): Promise<Set<string>> {
  try {
    const salvato = sessionStorage.getItem(CHIAVE)
    if (salvato) {
      const { t, slug } = JSON.parse(salvato) as { t: number; slug: string[] }
      if (Date.now() - t < 10 * 60 * 1000) return new Set(slug)
    }
  } catch {
    /* storage non disponibile */
  }
  const url = import.meta.env.PUBLIC_SUPABASE_URL
  const chiave = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  try {
    const r = await fetch(`${url}/rest/v1/rpc/strutture_con_prezzi`, {
      method: 'POST',
      headers: { apikey: chiave, Authorization: `Bearer ${chiave}`, 'Content-Type': 'application/json' },
      body: '{}',
    })
    if (!r.ok) return new Set()
    const righe = (await r.json()) as Array<{ slug: string }>
    const slug = righe.map(x => x.slug)
    try {
      sessionStorage.setItem(CHIAVE, JSON.stringify({ t: Date.now(), slug }))
    } catch {
      /* storage non disponibile */
    }
    return new Set(slug)
  } catch {
    return new Set()
  }
}

// una sola lettura per pagina, condivisa da nastro e filtro
let lettura: Promise<Set<string>> | null = null
export function struttureConPrezzi(): Promise<Set<string>> {
  lettura ??= leggi()
  return lettura
}

export function creaNastro() {
  const n = document.createElement('span')
  n.className = 'nastro-online'
  n.setAttribute('aria-hidden', 'true')
  n.innerHTML = '<span>Prenota online</span>'
  return n
}
