// SEO: titoli, descrizioni e dati strutturati (JSON-LD) costruiti dai dati del database, non scritti a mano.
// Se nel gestionale qualcuno scrive a mano titolo o descrizione di una pagina, quello ha la precedenza.

// Taglia un testo alla parola intera, aggiungendo i puntini solo se serve.
export function tagliaTesto(testo: string, massimo: number): string {
  const pulito = testo.replace(/\s+/g, ' ').trim()
  if (pulito.length <= massimo) return pulito
  const taglio = pulito.slice(0, massimo - 1)
  const spazio = taglio.lastIndexOf(' ')
  return `${(spazio > massimo * 0.6 ? taglio.slice(0, spazio) : taglio).replace(/[\s,;:.\-–—]+$/, '')}…`
}

export interface Briciola {
  nome: string
  href: string
}

// Percorso "Home > Sezione > Pagina" per Google. `href` puo' essere relativo: si completa con il sito.
export function grafoBriciole(percorso: Briciola[], sito: string | URL | undefined) {
  const base = String(sito ?? '').replace(/\/$/, '')
  return {
    '@type': 'BreadcrumbList',
    itemListElement: percorso.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.nome,
      item: b.href.startsWith('http') ? b.href : `${base}${b.href}`,
    })),
  }
}

interface AziendaSeo {
  ragione_sociale?: string | null
  nome_commerciale?: string | null
  telefono?: string | null
  cellulare?: string | null
  sito_web?: string | null
  indirizzo?: string | null
  logo_png_url?: string | null
  logo_orizzontale_url?: string | null
}

// "Via Giovanni Porzio 4, Isola G1, 80143 Napoli (NA)" -> via, CAP, citta', provincia (se il testo non ha questa forma resta tutto nella via)
function indirizzoPostale(testo: string) {
  const m = testo.match(/^(.*?),?\s*(\d{5})\s+([^,(]+?)\s*(?:\(([A-Za-z]{2})\))?\s*$/)
  if (!m) return { '@type': 'PostalAddress', streetAddress: testo, addressCountry: 'IT' }
  return {
    '@type': 'PostalAddress',
    streetAddress: m[1],
    postalCode: m[2],
    addressLocality: m[3].trim(),
    ...(m[4] ? { addressRegion: m[4].toUpperCase() } : {}),
    addressCountry: 'IT',
  }
}

// Identita' dell'azienda per i motori di ricerca: agenzia di viaggi con telefono e indirizzo, e il sito.
// Presente in tutte le pagine (una volta sola, nel layout).
export function grafoAzienda(azienda: AziendaSeo | null, sito: string | URL | undefined) {
  const base = String(sito ?? '').replace(/\/$/, '')
  const nome = azienda?.nome_commerciale || azienda?.ragione_sociale || 'Hotellando'
  const telefono = (azienda?.telefono || azienda?.cellulare || '').replace(/\s+/g, ' ').trim()
  const logo = azienda?.logo_png_url || azienda?.logo_orizzontale_url || null
  return [
    {
      '@type': 'TravelAgency',
      '@id': `${base}/#azienda`,
      name: nome,
      url: `${base}/`,
      ...(logo ? { logo, image: logo } : {}),
      ...(telefono ? { telephone: telefono.startsWith('+') ? telefono : `+39 ${telefono}` } : {}),
      ...(azienda?.indirizzo ? { address: indirizzoPostale(azienda.indirizzo) } : {}),
      alternateName: 'Hotellando',
      areaServed: 'IT',
      knowsLanguage: 'it',
    },
    {
      '@type': 'WebSite',
      '@id': `${base}/#sito`,
      url: `${base}/`,
      name: nome,
      alternateName: 'Hotellando',
      inLanguage: 'it-IT',
      publisher: { '@id': `${base}/#azienda` },
    },
  ]
}

// Elenco di pagine (tour, strutture...) per le pagine che raccolgono altre pagine.
export function grafoElenco(nome: string, url: string, voci: Array<{ nome: string; url: string; immagine?: string | null }>) {
  return {
    '@type': 'CollectionPage',
    name: nome,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: voci.length,
      itemListElement: voci.map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: v.url,
        name: v.nome,
        ...(v.immagine ? { image: v.immagine } : {}),
      })),
    },
  }
}
