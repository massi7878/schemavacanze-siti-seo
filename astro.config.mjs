// @ts-check
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'

// Sito statico (strutture, destinazioni, sezioni) con l'adattatore Vercel solo per le pagine
// delle OFFERTE, generate al momento della richiesta (prerender = false) e tenute in cache dalla
// rete di Vercel: un'offerta salvata nel gestionale compare entro pochi istanti, senza
// ripubblicare tutto il sito (un build completo richiede minuti).
// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://hotellando.it',
})
