// Nome di un paese -> indirizzo della sua pagina tour: "Emirati Arabi Uniti" -> "emirati-arabi-uniti".
// Funzione pura: la usano sia il server (pagine, mappa del sito) sia il browser (filtri dell'elenco).
export const slugPaese = (nome: string) =>
  nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
