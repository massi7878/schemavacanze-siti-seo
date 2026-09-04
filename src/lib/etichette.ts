// Stessa logica di app/src/lib/etichetteSezioni.js nel gestionale: le
// etichette di alcune sezioni possono essere personalizzate per tipologia di
// struttura (es. "Cabine" invece di "Camere", "Escursioni nei porti" invece
// di "Da visitare" per le navi da crociera).

export const SEZIONI_STRUTTURA = [
  { chiave: 'caratteristiche_tecniche', defaultLabel: 'Caratteristiche tecniche' },
  { chiave: 'spiaggia', defaultLabel: 'Spiaggia' },
  { chiave: 'ristorazione', defaultLabel: 'Trattamento e ristorazione' },
  { chiave: 'intrattenimento', defaultLabel: 'Intrattenimento' },
  { chiave: 'tessera_club', defaultLabel: 'Tessera Club' },
  { chiave: 'incluso', defaultLabel: 'Incluso' },
  { chiave: 'non_incluso', defaultLabel: 'Non incluso' },
  { chiave: 'da_visitare', defaultLabel: 'Da visitare nei dintorni' },
  { chiave: 'informazioni_importanti', defaultLabel: 'Informazioni importanti' },
] as const

export function etichettaSezione(chiave: string, etichetteExtra: Record<string, string> | null | undefined): string {
  const override = etichetteExtra?.[chiave]
  if (override) return override
  return SEZIONI_STRUTTURA.find(s => s.chiave === chiave)?.defaultLabel ?? chiave
}

export function pluraleCamera(etichettaCamera: string): string {
  return etichettaCamera.replace(/a$/i, 'e')
}
