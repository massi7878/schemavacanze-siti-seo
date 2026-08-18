import { createClient } from '@supabase/supabase-js'

// Chiave anon, sola lettura: legge lo stesso database del gestionale, non
// scrive mai nulla da qui. RLS su strutture/struttura_servizi/tipologie_camera/
// prezzi_camera/riduzioni_letto/sconti_periodo gia' permette la lettura
// pubblica per le righe attive (nessuna policy nuova necessaria).
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
)
