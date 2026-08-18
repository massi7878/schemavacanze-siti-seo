# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (SSG, output: static), Supabase come sorgente dati in sola lettura al build. Deploy Vercel.

## Users

Viaggiatori italiani che cercano un villaggio/resort per le vacanze, spesso partendo da una ricerca su Google o da una domanda posta a un assistente AI (ChatGPT, Perplexity, ecc.). Arrivano su una pagina struttura specifica, non sulla home, e valutano se contattare l'agenzia per un preventivo.

## Product Purpose

Sito pubblico satellite del gestionale CRM di Schema ADV S.r.l. (agenzia viaggi, Napoli), pubblicato sotto il brand "Hotellando" (dominio di test: hotellando.it, poi schemavacanze.it). Genera pagine SEO/AEO-ottimizzate per ogni struttura ricettiva già presente nel gestionale, con l'obiettivo di essere trovato ed estratto sia dai motori di ricerca tradizionali sia dai motori generativi, e di portare il visitatore a contattare l'agenzia.

## Positioning

A differenza di una landing page generica da tour operator, ogni pagina riporta solo dati reali già verificati e inseriti dagli operatori dell'agenzia nel gestionale (spiaggia, camere, formula, prezzi, FAQ) — mai prezzi o servizi generati o stimati. Nessun doppio inserimento dati: il gestionale resta l'unica fonte, il sito legge in sola lettura al momento della build.

## Operating Context

Gli operatori dell'agenzia compilano/aggiornano i dati struttura nel gestionale (form React esistente). Il sito Astro si rigenera ad ogni deploy leggendo quei dati. Non esiste (ancora) un flusso di prenotazione diretta sul sito: l'obiettivo della pagina è portare a un contatto/preventivo tramite l'agenzia.

## Capabilities and Constraints

- Contenuti generati solo da campi valorizzati nel database; una sezione senza dati viene omessa, mai riempita con placeholder o dati inventati.
- JSON-LD, sitemap, robots.txt e llms.txt generati dinamicamente dagli stessi dati, mai scritti a mano.
- Nessun flusso di autenticazione o area utente sul sito pubblico.

## Brand Commitments

- Nome del sotto-brand: **Hotellando** ("Hotellando easy booking"), non il brand "Schema Vacanze" usato nel gestionale interno. Nessun credito "by Schema" visibile sul sito pubblico.
- Logo ufficiale su disco: `C:\Users\danie\OneDrive\Documenti\Doc HOTELLANDO\documenti codici agenzia\logo hotellando.jpg` (copiato in `public/brand/hotellando-logo.jpg`) — valigia verde lime stilizzata, wordmark "Hotellando" in grigio, tagline "easy booking." in verde lime.
- Riferimento visivo esplicito indicato dall'utente per lo stile del sito: https://www.gbviaggi.it/ (agenzia/tour operator, per tono e struttura pagina, non per il colore).
- Palette da usare: verde lime + grigio del brand Hotellando, non il blu/rosso di Schema Vacanze usato altrove nel gestionale.

## Evidence on Hand

- Struttura di test con contenuti reali completi: Club Itaca Nausicaa (slug `club-itaca-nausicaa`), unica struttura con `descrizione_seo`/FAQ compilate finora.
- Nessun prezzo (`prezzi_camera`) ancora inserito per la struttura di test: la sezione prezzi va omessa finché non ci sono dati reali.

## Product Principles

1. Mai inventare dati (prezzi, servizi, distanze): campo vuoto = sezione omessa.
2. Il gestionale resta l'unica fonte di inserimento dati; il sito è sola lettura.
3. Ogni pagina deve poter essere estratta correttamente sia da un crawler SEO classico sia da un LLM (struttura H1/H2 fissa, JSON-LD coerente col contenuto visibile).
4. Il brand pubblico è Hotellando, distinto dal brand interno Schema Vacanze del gestionale.
