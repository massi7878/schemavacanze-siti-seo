import type { APIRoute } from 'astro'
import sharp from 'sharp'
import { getOffertaPubblica, getOffertePubbliche } from '../../../lib/offerte'

export const prerender = true

function copertinaDi(o: { immagine_url: string | null; immagini: string[]; tour: { galleria: string[] } | null }) {
  return o.immagine_url ?? o.immagini?.[0] ?? o.tour?.galleria?.[0] ?? null
}

// Immagine 1200x630 dell'offerta (JPEG): serve come anteprima quando il link viene condiviso su
// WhatsApp/Facebook (og:image) e come immagine da scaricare per i social senza link di condivisione
// (Instagram). Generata a build dalla copertina dell'offerta (o della sua struttura): le foto sono
// su un altro dominio e non si possono leggere dal browser, quindi la copia si fa qui.
export async function getStaticPaths() {
  const elenco = await getOffertePubbliche()
  const percorsi = []
  for (const voce of elenco) {
    const o = await getOffertaPubblica(voce.slug)
    if (o && copertinaDi(o)) percorsi.push({ params: { slug: voce.slug } })
  }
  return percorsi
}

export const GET: APIRoute = async ({ params }) => {
  const offerta = await getOffertaPubblica(params.slug as string)
  const sorgente = offerta ? copertinaDi(offerta) : null

  let originale: Buffer | null = null
  if (sorgente) {
    try {
      const risposta = await fetch(sorgente)
      if (risposta.ok) originale = Buffer.from(await risposta.arrayBuffer())
    } catch {
      /* foto non raggiungibile: si usa il fondo neutro qui sotto */
    }
  }

  const base = originale
    ? sharp(originale).resize(1200, 630, { fit: 'cover', position: 'attention' })
    : sharp({ create: { width: 1200, height: 630, channels: 3, background: '#e5e4e8' } })

  const jpeg = await base.jpeg({ quality: 82, mozjpeg: true }).toBuffer()
  return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } })
}
