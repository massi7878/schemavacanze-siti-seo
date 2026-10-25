// Testi delle pagine "Tour <paese>" (es. /tour/kenya/): per ogni paese, cosa vedere (con le tappe che i nostri tour toccano davvero)
// e quando andare. Si legano all'indirizzo della pagina (slug). Un paese senza testo qui usa solo i paragrafi automatici
// ricavati dai dati (vedi tourPaesi.ts), quindi i paesi nuovi funzionano subito.
export interface TestoPaese {
  cosaVedere: string
  quandoAndare: string
}

export const TESTI_PAESI: Record<string, TestoPaese> = {
  indonesia: {
    cosaVedere:
      "L'Indonesia dei nostri tour è soprattutto Bali e Giava. A Bali le risaie a terrazze di Tegallalang e Jatiluwih, i templi in riva al lago come quello di Beratan, il tramonto sul tempio di Uluwatu, la foresta delle scimmie di Ubud e le cascate come Tegenungan; a Giava Yogyakarta, con il palazzo del Sultano e due giganti dell'architettura sacra: il tempio buddhista di Borobudur e il complesso induista di Prambanan. Sono escursioni e piccoli itinerari da 1 a 6 giorni, comodi da aggiungere a una vacanza di mare a Bali o a Lombok.",
    quandoAndare:
      "Il periodo più comodo va da maggio a settembre, nella stagione secca, con meno pioggia e cieli più limpidi. Tra novembre e marzo piove di più ma la natura è al massimo del verde: conviene lasciare un po' di margine nel programma. Nei siti più visitati, come Borobudur e Uluwatu, la mattina presto è il momento migliore.",
  },
  tailandia: {
    cosaVedere:
      "In Tailandia si passa dal fermento di Bangkok, tra templi dorati e mercati sull'acqua come Damnoen Saduak, alla Thailandia antica di Ayutthaya e Sukhothai, fino al nord di Chiang Mai e Chiang Rai con i loro templi, i mercati e il Triangolo d'Oro. Non manca la Kanchanaburi della ferrovia sul fiume Kwai, né il mercato ferroviario di Maeklong. Per il mare ci sono Phuket, Krabi e le isole Phi Phi. Molti tour hanno guide locali che parlano italiano e gruppi ridotti, fino a un massimo di 20 persone.",
    quandoAndare:
      "Da novembre a febbraio è la stagione più fresca e asciutta, ideale per Bangkok e il nord. Sulla costa delle Andamane (Phuket e Krabi) il mare è al suo meglio da novembre ad aprile. Tra maggio e ottobre arrivano i monsoni: più pioggia, ma anche meno turisti e prezzi spesso più bassi.",
  },
  vietnam: {
    cosaVedere:
      "Il Vietnam si percorre da nord a sud: Hanoi con il suo quartiere vecchio, la baia di Ha Long con le isole di roccia calcarea, la città imperiale di Hue, le lanterne di Hoi An e, in fondo, Ho Chi Minh City e il Delta del Mekong tra canali e mercati sull'acqua. Molti itinerari proseguono in Cambogia e in Laos, con i templi di Angkor a Siem Reap. Le partenze sono tutto l'anno e molti tour hanno guide locali che parlano italiano, con pasti inclusi in diverse formule.",
    quandoAndare:
      "Il paese è lungo e il clima cambia da una regione all'altra: il nord (Hanoi e Ha Long) è più piacevole da ottobre ad aprile, il centro (Hue e Hoi An) da febbraio ad agosto, il sud da dicembre ad aprile. Per un itinerario completo, marzo-aprile e ottobre-novembre sono un buon compromesso.",
  },
  grecia: {
    cosaVedere:
      "La Grecia dei nostri tour unisce la Grecia classica e le isole. Atene con il Partenone e il Museo dell'Acropoli, poi Delfi, Epidauro, Micene e Olimpia lungo il Peloponneso, e le Meteore con i monasteri sospesi sulla roccia. Per il mare ci sono Mykonos, Santorini, Paros e Creta, con Heraklion. Molte proposte sono self made, cioè viaggi liberi senza guida, da costruire al proprio ritmo; altre sono tour guidati di gruppo con un programma già definito.",
    quandoAndare:
      "Da maggio a ottobre il clima è ideale per le isole. Luglio e agosto sono i mesi più caldi e affollati, mentre giugno e settembre uniscono mare caldo e meno folla. Per il giro archeologico meglio la primavera o l'autunno: nelle ore centrali dell'estate i siti sono molto caldi.",
  },
  giappone: {
    cosaVedere:
      "Il Giappone dei nostri itinerari parte da Tokyo e arriva a Kyoto e Osaka passando per Hakone, con la vista sul Monte Fuji nelle giornate limpide. Poi Hiroshima e l'isola di Miyajima, Kanazawa, Takayama e, in alcuni programmi, Fukuoka e Naha, a Okinawa. Molti viaggi prevedono una notte in un ryokan, la locanda tradizionale, con cena tipica: è uno dei modi migliori per capire il Giappone, insieme ai templi, ai giardini e ai quartieri moderni di Tokyo.",
    quandoAndare:
      "Le stagioni migliori sono la primavera, con la fioritura dei ciliegi tra fine marzo e inizio aprile, e l'autunno, tra ottobre e novembre, con i colori delle foglie. L'estate è calda e umida; l'inverno è asciutto e sereno a Tokyo e a Kyoto, e freddo sulle montagne.",
  },
  kenya: {
    cosaVedere:
      "In Kenya la vera protagonista è la natura: i parchi come Tsavo, Amboseli e le colline Taita offrono incontri con i famosi elefanti dal manto rossastro, leoni, rinoceronti e altri dei «cinque grandi», con safari al mattino e nel tardo pomeriggio. Si parte spesso da Nairobi, ma ci sono anche proposte dalla costa, da Watamu, Mombasa e Diani Beach, per unire i giorni nel parco a qualche giorno di mare sull'Oceano Indiano. Quasi tutti i tour sono guidati, molti anche con guida in italiano.",
    quandoAndare:
      "Le stagioni più asciutte, da giugno a ottobre e tra gennaio e febbraio, sono le migliori per il safari: gli animali si concentrano vicino ai punti d'acqua e si vedono meglio. Da luglio a ottobre, nel Masai Mara, si assiste alla grande migrazione. Aprile e maggio sono i mesi delle piogge lunghe, con meno turisti ma strade più difficili.",
  },
  italia: {
    cosaVedere:
      "Anche l'Italia ha i suoi itinerari: le città d'arte come Roma, Firenze, Venezia, Pisa e Siena, le colline del Chianti con il vino, il Sud con Napoli, Sorrento, Capri e Ischia fino a Lecce e Palermo, e le terme di Montecatini. Sono soluzioni comode per un fine settimana lungo o per una settimana tra le città d'arte, con partenze fisse e prezzi chiari; molte sono self made, cioè viaggi liberi senza guida.",
    quandoAndare:
      "Primavera e autunno sono i momenti migliori per le città d'arte: clima mite e meno code. Sul mare e nelle isole la stagione va da giugno a settembre; ad agosto le località più famose sono molto affollate. Natale e inverno sono perfetti per Roma, Firenze e per le terme.",
  },
  cambogia: {
    cosaVedere:
      "In Cambogia il cuore è Siem Reap, porta d'ingresso ai templi di Angkor, dove si arriva all'alba per vedere Angkor Wat con la luce più bella, e Phnom Penh, la capitale sul Mekong. Molti itinerari la uniscono al Vietnam e al Laos, in viaggi da 3 a 16 giorni, con partenze tutto l'anno e guide locali che parlano italiano.",
    quandoAndare:
      "Il periodo migliore è la stagione secca, da novembre a marzo, con cieli sereni e temperature più sopportabili. Tra aprile e maggio fa molto caldo; da giugno a ottobre piove spesso, ma il paesaggio è verdissimo e ai templi c'è meno gente.",
  },
  spagna: {
    cosaVedere:
      "La Spagna dei nostri tour mette insieme Madrid con il Prado e il Palazzo Reale, le città del cuore del paese come Toledo, Segovia, Avila e Salamanca e l'Andalusia di Siviglia e Granada, con i giardini del Generalife e il quartiere dell'Albaicín. Sulla costa ci sono Valencia, con la Città delle Arti e delle Scienze e la paella, Málaga e Benidorm; nel nord Bilbao. Quasi tutte le proposte sono self made, per muoversi al proprio ritmo.",
    quandoAndare:
      "Primavera (aprile e maggio) e autunno sono i periodi migliori per le città, perché si cammina bene. L'estate è molto calda in Andalusia e nell'interno, ideale invece per la costa. In inverno Madrid è fredda ma vivace, mentre in Andalusia il clima resta mite.",
  },
  croazia: {
    cosaVedere:
      "La costa dalmata è la grande attrazione: Dubrovnik con le sue mura, Spalato con il palazzo di Diocleziano, Trogir e le isole di Hvar e Korčula; verso l'interno Zagabria e il Parco nazionale dei laghi di Plitvice, a nord l'Istria con Pola. Alcuni itinerari proseguono in Bosnia, a Mostar con il suo ponte e a Sarajevo. Sono viaggi in gran parte self made, da 2 a 15 giorni.",
    quandoAndare:
      "Da maggio a ottobre è la stagione del mare e delle isole; giugno e settembre sono i mesi ideali, con acqua calda e meno folla di luglio e agosto. Plitvice è bellissimo in primavera, con le cascate piene d'acqua, e in autunno per i colori.",
  },
  india: {
    cosaVedere:
      "L'India dei tour parte quasi sempre da Delhi: la città vecchia con la Jama Masjid e Chandni Chowk, il Qutub Minar, India Gate. Da qui il classico Triangolo d'Oro con Agra e il Taj Mahal, Fatehpur Sikri e Jaipur con il Forte Amber e l'Hawa Mahal, fino al Rajasthan dei forti e dei palazzi, e verso Varanasi e Sarnath. Per chi ha più giorni ci sono itinerari lunghi, fino a 24 giorni, anche verso il Sud, con partenze da Chennai e Kochi.",
    quandoAndare:
      "Il periodo migliore va da ottobre a marzo, con giornate più miti e cielo sereno. Tra aprile e giugno il caldo è molto forte, soprattutto in Rajasthan; da luglio a settembre c'è il monsone. A dicembre e gennaio la mattina a Delhi e ad Agra può essere nebbiosa: conviene portare un golf per le prime ore.",
  },
  oman: {
    cosaVedere:
      "L'Oman è l'Arabia più autentica: Mascate con la Grande Moschea del Sultano Qaboos, il palazzo Al Alam e il suo souk; l'entroterra con il forte di Nizwa, il castello di Jabrin e il villaggio di Al Hamra; il canyon del Jebel Shams, le dune del deserto di Wahiba Sands e le piscine naturali del Wadi Bani Khalid e del Bimmah Sinkhole. Tutti i tour sono guidati, con partenze da Mascate.",
    quandoAndare:
      "Da ottobre ad aprile, quando le temperature sono piacevoli, anche nel deserto. L'estate è molto calda; da giugno a settembre, a sud, la regione di Salalah vive il monsone khareef, con verde e pioggia leggera.",
  },
  laos: {
    cosaVedere:
      "Il Laos è il paese più tranquillo dell'Indocina: Luang Prabang, Patrimonio dell'umanità, con i suoi templi, il Mekong e le vicine cascate di Kuang Si; Vientiane, la capitale, quieta e facile da visitare. Quasi tutte le proposte sono self made e si combinano con Cambogia e Vietnam, con partenze quasi tutto l'anno e guide locali che parlano italiano.",
    quandoAndare:
      "Da novembre a febbraio il clima è fresco e asciutto, il più comodo per girare. Tra marzo e aprile fa molto caldo; da maggio a ottobre è stagione delle piogge, con paesaggi verdissimi e meno visitatori.",
  },
  "emirati-arabi-uniti": {
    cosaVedere:
      "Gli Emirati sono un contrasto tra futuro e tradizione: a Dubai il Burj Khalifa, la Marina, la Palm Jumeirah e il Burj Al Arab, ma anche il quartiere storico di Bastakiya e il museo Al Shindagha, con il safari nel deserto e le dune in fuoristrada; ad Abu Dhabi la Grande Moschea Sheikh Zayed, l'Emirates Palace e il Louvre. Si parte quasi sempre da Dubai, a volte con un'estensione in Oman.",
    quandoAndare:
      "Da ottobre ad aprile il clima è piacevole; da giugno ad agosto le temperature superano spesso i 40 gradi e si vive soprattutto al chiuso. Dicembre e gennaio sono ottimi per la città e per il deserto, ma sono anche i mesi più richiesti: conviene prenotare con anticipo.",
  },
  egitto: {
    cosaVedere:
      "L'Egitto è il viaggio nella storia per eccellenza: l'altopiano di Giza con le piramidi, il Cairo con i suoi souk, Luxor con i templi di Karnak e Madinet Habu e il Colosso di Memnon, e il Nilo da scoprire con una crociera, in felucca o a bordo di una dahabiya, la tradizionale barca a vela. Alcune proposte sono di lusso, altre più semplici: ci sono itinerari da 5 a 15 giorni.",
    quandoAndare:
      "Da ottobre ad aprile, quando il caldo è sopportabile anche nelle ore centrali. Al sud, a Luxor e Assuan, tra giugno e agosto le temperature sono altissime. Dicembre e gennaio hanno giornate soleggiate e sere fresche.",
  },
  "corea-del-sud": {
    cosaVedere:
      "La Corea del Sud sorprende per la combinazione di tecnologia e tradizione: Seul, con i palazzi reali e i mercati; Busan, la città di mare; Gyeongju, l'antica capitale del regno di Silla, spesso chiamata «museo senza pareti»; e Jeonju, dove si può dormire in un hanok, la casa tradizionale coreana. Molti itinerari si combinano con il Giappone, in un viaggio unico tra due paesi e due culture.",
    quandoAndare:
      "Primavera (aprile e maggio, con i ciliegi) e autunno (da settembre a novembre, con i colori delle foglie) sono i periodi migliori. L'estate è calda e piovosa; l'inverno è freddo e secco, bello per chi ama la neve.",
  },
  messico: {
    cosaVedere:
      "Il Messico dei nostri tour è soprattutto la penisola dello Yucatán: le piramidi maya di Chichén Itzá e Uxmal, Tulum sul mare, le città coloniali di Mérida, Valladolid e Campeche, i cenotes, la laguna di Bacalar e i fenicotteri di Río Lagartos. Altri itinerari partono da Città del Messico, con Teotihuacán, o dalla Baja California, tra La Paz, Loreto e Cabo San Lucas. Da 8 a 14 giorni, con partenze da Cancún e da Città del Messico.",
    quandoAndare:
      "Da novembre ad aprile, con clima asciutto e temperature gradevoli. Da giugno a ottobre è la stagione delle piogge e, sui Caraibi, degli uragani; in Yucatán fa molto caldo e umido anche in primavera.",
  },
  giordania: {
    cosaVedere:
      "In Giordania il grande protagonista è Petra, la città scavata nella roccia, a cui si dedicano spesso due giornate, con la vicina Piccola Petra. Poi Wadi Rum, il deserto dei beduini con i suoi paesaggi rossi, Jerash, una delle città romane meglio conservate, il Monte Nebo, la riserva di Dana, il Mar Morto per un bagno in cui si galleggia e Aqaba sul Mar Rosso. Ci sono formule con autista privato e con auto a noleggio.",
    quandoAndare:
      "Primavera (marzo-maggio) e autunno (settembre-novembre) sono ideali: giornate calde ma non estreme per camminare a Petra. In estate fa molto caldo, soprattutto nel sud; l'inverno è fresco, con notti fredde nel deserto.",
  },
  argentina: {
    cosaVedere:
      "L'Argentina è fatta di distanze e contrasti: Buenos Aires con il tango, a sud la Patagonia con El Calafate e il ghiacciaio Perito Moreno, Ushuaia e il Parco nazionale della Terra del Fuoco, a ovest Mendoza e le cantine di Maipú, a nord le cascate dell'Iguazú con la Gola del Diavolo. I tour sono brevi, da 3 a 10 giorni, pensati per scegliere una zona alla volta.",
    quandoAndare:
      "Per la Patagonia e Ushuaia la stagione va da ottobre ad aprile, con giornate lunghe e clima più mite. Mendoza è bella a marzo e aprile, nel periodo della vendemmia; le cascate dell'Iguazú si visitano tutto l'anno, ma fa più fresco da maggio ad agosto.",
  },
  portogallo: {
    cosaVedere:
      "Il Portogallo ha più volti: il nord con Porto e Guimarães, culla della nazione, l'Alentejo di Évora, Lisbona e l'Algarve, con le scogliere di Sagres e il Capo San Vincenzo, dove finisce l'Europa. Per chi cerca mare e natura ci sono le Azzorre, con l'isola di Terceira e l'osservazione delle balene. Sono quasi tutti viaggi self made: ognuno costruisce il proprio ritmo.",
    quandoAndare:
      "Primavera e inizio autunno per le città; da giugno a settembre per il mare dell'Algarve, anche se l'Atlantico resta fresco. Alle Azzorre il clima è mite tutto l'anno, ma le giornate di sole sono più probabili da maggio a ottobre; le balene si osservano soprattutto in primavera ed estate.",
  },
  tunisia: {
    cosaVedere:
      "In Tunisia puoi mettere insieme mare e cultura: Tunisi con la medina, Sidi Bou Said con le case bianche e blu, Kairouan, città santa, e l'anfiteatro romano di El Djem. Sul mare ci sono Hammamet, Sousse e l'isola di Djerba; per chi vuole il deserto, Tozeur, porta del Sahara. Gli itinerari sono brevi, da 2 a 8 giorni, e partono soprattutto da Tunisi e dalla costa.",
    quandoAndare:
      "Primavera e autunno per i tour culturali, con temperature piacevoli; da giugno a settembre per il mare. Nel deserto di Tozeur l'estate è molto calda, mentre d'inverno le notti sono fredde.",
  },
  "sri-lanka": {
    cosaVedere:
      "Lo Sri Lanka concentra in un'isola piccola templi, natura e mare: la fortezza di Sigiriya, le grotte di Dambulla, il Tempio del Dente a Kandy, i giardini delle spezie, il Forte di Galle e il parco di Minneriya, famoso per i raduni di elefanti. I tour vanno da 6 a 17 giorni e a volte si combinano con l'India.",
    quandoAndare:
      "Le coste sud e ovest sono al meglio da dicembre a marzo; il centro culturale (Sigiriya, Kandy) si visita tutto l'anno, con più sole da gennaio ad aprile. La costa est è bella da maggio a settembre.",
  },
  malta: {
    cosaVedere:
      "Malta è piccola ma ricca di storia: La Valletta con le sue fortificazioni e le chiese barocche, Mdina, la «città silenziosa», le Tre Città, il porto di Marsaxlokk con le barche colorate e la Grotta Azzurra. In traghetto si arriva a Gozo, più verde e tranquilla. Sono soggiorni da 5 a 8 giorni, in buona parte self made.",
    quandoAndare:
      "Da aprile a giugno e da settembre a ottobre: clima mite, mare gradevole e meno gente. Luglio e agosto sono molto caldi e affollati; l'inverno è dolce, perfetto per le visite.",
  },
  tanzania: {
    cosaVedere:
      "I safari in Tanzania toccano alcuni dei parchi più belli dell'Africa: il Serengeti, le pianure infinite della migrazione; il cratere di Ngorongoro, una caldera piena di animali; Tarangire con i suoi baobab e gli elefanti; il lago Manyara; la gola di Olduvai, culla dell'umanità; e le visite ai villaggi masai. Si parte da Arusha, con itinerari guidati da 3 a 13 giorni.",
    quandoAndare:
      "La stagione secca, da giugno a ottobre, è la migliore per i safari; tra luglio e settembre gli animali della grande migrazione attraversano il nord del Serengeti. Gennaio e febbraio sono ottimi per vedere i piccoli nel sud. Aprile e maggio sono i mesi delle grandi piogge.",
  },
  marocco: {
    cosaVedere:
      "Il Marocco dei nostri itinerari parte da Marrakech, con la piazza Jemaa el-Fna, i souk e i giardini; poi si va verso sud, attraverso le montagne dell'Atlante, fino a Ouarzazate, la «porta del deserto», e alle dune. Sono tour self made da 6 a 9 giorni: la libertà di scegliere quanto fermarsi.",
    quandoAndare:
      "Primavera (marzo-maggio) e autunno (settembre-novembre) sono i periodi ideali. In estate Marrakech e il sud sono molto caldi; in inverno le giornate sono miti ma le notti nel deserto sono fredde.",
  },
  mauritius: {
    cosaVedere:
      "Mauritius è soprattutto mare: spiagge di sabbia bianca e lagune turchesi, con Grand Baie sulla costa nord, vivace e comoda per le escursioni, e Balaclava, più tranquilla, nel nord-ovest. Chi vuole uscire dal resort trova cascate, piantagioni di tè e le famose terre dei sette colori. Sono soggiorni da 6 a 8 giorni.",
    quandoAndare:
      "Da maggio a dicembre è la stagione più fresca e secca, la migliore per il mare. Da gennaio ad aprile è più caldo e umido, con possibilità di cicloni, ma i prezzi sono più bassi.",
  },
  irlanda: {
    cosaVedere:
      "In Irlanda il viaggio parte da Dublino: la Guinness Storehouse, il Trinity College, il quartiere di Temple Bar, la distilleria Jameson e la cattedrale di San Patrizio; poi si va verso Waterford e Cork, tra castelli come quello di Birr, e verso ovest fino all'abbazia di Kylemore. Sono viaggi self made, da 4 a 11 giorni, ideali per il fai da te.",
    quandoAndare:
      "Da maggio a settembre, quando le giornate sono lunghe e il clima più mite. Ma in Irlanda può piovere tutto l'anno: meglio portare sempre un impermeabile. Marzo, con la festa di San Patrizio, è il momento più vivace a Dublino.",
  },
  "bosnia-erzegovina": {
    cosaVedere:
      "La Bosnia-Erzegovina è un viaggio tra Oriente e Occidente: Mostar con il suo Ponte Vecchio e Sarajevo con il bazar ottomano e le tracce della storia recente. I nostri itinerari la combinano con la Croazia, partendo da Spalato o da Dubrovnik e passando per Zagabria, e durano da 8 a 11 giorni.",
    quandoAndare:
      "Primavera e inizio autunno, con temperature miti. In estate Mostar è molto calda; in inverno Sarajevo è fredda e può nevicare.",
  },
  finlandia: {
    cosaVedere:
      "La Finlandia dei nostri tour è la Lapponia d'inverno: Rovaniemi con il Villaggio di Babbo Natale e il Circolo Polare Artico, le slitte trainate dagli husky, le renne, lo Ranua Zoo, la motoslitta, la crociera rompighiaccio e, per chi vuole sognare, una notte in un igloo di vetro per cercare l'aurora boreale. In alcune proposte c'è anche Helsinki e il Capodanno a bordo.",
    quandoAndare:
      "La stagione va da dicembre a marzo, con neve sicura e tante attività invernali; l'aurora boreale si può vedere da settembre a marzo, nelle notti limpide. Dicembre, con il clima natalizio, è il mese più richiesto: conviene prenotare con anticipo.",
  },
  peru: {
    cosaVedere:
      "Il Perù è il paese dell'impero inca: Machu Picchu è la tappa che tutti sognano, con Cusco e Ollantaytambo, da cui parte il treno; poi il lago Titicaca, Arequipa e la Valle del Colca, dove vola il condor, il deserto con le linee di Nazca e le Isole Ballestas. A nord, il mare di Máncora. Lima è la porta d'ingresso, famosa per la cucina. Itinerari da 4 a 13 giorni.",
    quandoAndare:
      "Da maggio a settembre è la stagione secca sulle Ande, la migliore per Machu Picchu e per il Titicaca, anche se le notti sono fredde. Da novembre a marzo piove spesso in montagna; la costa è bella tra dicembre e aprile.",
  },
  nepal: {
    cosaVedere:
      "In Nepal l'esperienza è spirituale e naturale: Kathmandu con Durbar Square, la stupa di Swayambhunath, detta anche «dei macachi», e quella di Boudhanath, cuore del buddismo tibetano. Molti nostri itinerari lo uniscono all'India, con Delhi, Agra e il Taj Mahal, e arrivano fino a 24 giorni.",
    quandoAndare:
      "Ottobre-novembre e marzo-maggio sono i mesi migliori, con cielo limpido e viste sulle montagne. Da giugno a settembre c'è il monsone; l'inverno è freddo in quota ma sereno.",
  },
  "costa-rica": {
    cosaVedere:
      "Il Costa Rica è la natura in primo piano: il vulcano Arenal con le sue terme, la foresta nebulosa di Monteverde con i ponti sospesi, il parco di Manuel Antonio dove vivono scimmie e bradipi, e Tamarindo, spiaggia amata dai surfisti sul Pacifico. Sono itinerari self made da 7 e 8 giorni, con partenza da San José.",
    quandoAndare:
      "La stagione secca va da dicembre ad aprile e permette di muoversi meglio. Da maggio a novembre piove di più, di solito nel pomeriggio, ma il paesaggio è più verde e ci sono meno turisti.",
  },
  turchia: {
    cosaVedere:
      "In Turchia i nostri tour sono dedicati alla costa turchese, tra Licia e Caria: Kemer e l'area di Olimpo, Kekova con la sua città sommersa, Fethiye, Marmaris, Bodrum e il golfo di Gökova. Sono vacanze di una settimana, self made, per chi ama il mare e le escursioni in barca.",
    quandoAndare:
      "Da maggio a ottobre. Giugno e settembre sono i mesi più equilibrati, con mare caldo e temperature sopportabili; luglio e agosto sono i più caldi.",
  },
  bulgaria: {
    cosaVedere:
      "In Bulgaria il Mar Nero e la storia vanno insieme: Varna, capitale del litorale, Nessebar, città antica sul mare, Plovdiv, una delle città più antiche d'Europa, Veliko Tărnovo, ex capitale medievale, e Sofia. Sono itinerari self made da 3 a 8 giorni.",
    quandoAndare:
      "Da maggio a settembre per il mare; primavera e autunno per le città. In inverno Sofia è fredda e innevata, con le montagne vicine.",
  },
  svezia: {
    cosaVedere:
      "In Svezia i nostri programmi sono quelli della Lapponia svedese, con partenza da Luleå, la crociera rompighiaccio, le escursioni in motoslitta e la notte di Capodanno a bordo; in alcuni itinerari si arriva anche a Stoccolma e a Helsinki, in Finlandia. Sono viaggi da 4 e 5 giorni.",
    quandoAndare:
      "Da dicembre a marzo, con neve e notti lunghe; l'aurora boreale è più probabile da settembre a marzo. A Stoccolma l'estate è piacevole, con giornate lunghissime tra giugno e agosto.",
  },
  filippine: {
    cosaVedere:
      "Nelle Filippine i tour uniscono la città di Cebu e l'isola di Bohol, con le colline di cioccolato e i tarsi, e soprattutto il mare: spot di immersione e snorkeling straordinari. Sono viaggi lunghi, da 12 a 15 giorni, con partenza da Manila o da Cebu City.",
    quandoAndare:
      "La stagione secca va da dicembre a maggio; da giugno a novembre è più piovoso, con possibili tifoni, soprattutto tra agosto e ottobre. Per il mare, marzo-maggio è un ottimo periodo.",
  },
  maldive: {
    cosaVedere:
      "Le Maldive dei nostri itinerari sono la parte finale di un viaggio più lungo: si comincia dall'India, con Delhi, Agra e il Taj Mahal, si prosegue in Sri Lanka tra Sigiriya e Dambulla e si chiude con il mare. Durano da 10 a 17 giorni: una buona soluzione per vedere un po' di cultura e poi riposarsi.",
    quandoAndare:
      "La stagione secca va da dicembre ad aprile, con mare calmo e cielo sereno. Tra maggio e novembre ci sono più piogge e vento, ma i prezzi sono più bassi.",
  },
  islanda: {
    cosaVedere:
      "In Islanda ci si muove tra paesaggi da altro pianeta: il Circolo d'Oro con il parco di Thingvellir, la cascata di Gullfoss e il geyser Strokkur; la costa sud con Seljalandsfoss, Skógafoss, il parco di Skaftafell e la laguna dei ghiacciai di Jökulsárlón; e il nord con il lago Mývatn, Goðafoss e Dettifoss. Reykjavík è il punto di partenza dei nostri itinerari da 6 e 8 giorni.",
    quandoAndare:
      "Da giugno ad agosto le strade sono libere e le giornate lunghissime, con il sole di mezzanotte. Da settembre a marzo si può vedere l'aurora boreale, ma con meno ore di luce e condizioni di guida più difficili.",
  },
  sudafrica: {
    cosaVedere:
      "Il Sudafrica dei nostri tour mette insieme safari e città: il Parco Kruger, che si attraversa dal sud (Mountain-en-Dal) fino al centro (Skukuza e Satara) e al nord (Letaba), la riserva privata di Kapama, e poi la Provincia del Capo Occidentale con Città del Capo. Sono viaggi self made da 9 a 12 giorni.",
    quandoAndare:
      "Per il safari nel Kruger da maggio a settembre, nell'inverno secco: la vegetazione è più bassa e gli animali si vedono meglio. Città del Capo è più bella tra novembre e marzo, con giornate lunghe e calde.",
  },
  namibia: {
    cosaVedere:
      "In Namibia si gira tra deserti e fauna: le dune rosse di Sossusvlei e il Sesriem Canyon, il Kalahari, Swakopmund sulla costa atlantica e il Parco nazionale di Etosha, uno dei migliori d'Africa per osservare gli animali attorno alle pozze d'acqua. Si parte da Windhoek, con itinerari self made da 5 a 10 giorni.",
    quandoAndare:
      "La stagione secca, da maggio a ottobre, è la migliore, soprattutto per Etosha: gli animali si radunano alle pozze. Le notti nel deserto sono fredde. Da novembre ad aprile è caldo e può piovere.",
  },
  norvegia: {
    cosaVedere:
      "In Norvegia ci si sposta nell'Artico norvegese: Tromsø, tra le città più famose per l'aurora boreale, con la salita al monte Storsteinen, il Museo Polare, i cani husky, la motoslitta e l'allevamento di renne; una crociera con cena per inseguire l'aurora e, per chi ha più giorni, le isole Lofoten con il museo vichingo.",
    quandoAndare:
      "L'aurora boreale si vede da settembre a marzo, con le notti più buie e le migliori occasioni tra ottobre e febbraio. Dicembre e gennaio hanno la neve; a fine inverno le giornate si allungano e i prezzi sono più bassi.",
  },
  albania: {
    cosaVedere:
      "L'Albania è il viaggio on the road per chi cerca luoghi poco battuti: i nostri itinerari di 11 giorni, con auto a noleggio, partono da Tirana e uniscono due paesi, tra mare e montagna, borghi e un patrimonio storico ancora poco conosciuto, fino alle Meteore, in Grecia, con i monasteri sospesi sulle rocce.",
    quandoAndare:
      "Da maggio a ottobre per il mare e le strade di montagna; giugno e settembre sono i mesi più comodi. In inverno le zone interne possono essere innevate.",
  },
  taiwan: {
    cosaVedere:
      "Taiwan è un'isola a misura di viaggio: Taipei, tra grattacieli e mercati notturni, il Lago del Sole e della Luna, il Parco nazionale di Kenting, sulla punta sud, e la distilleria Kavalan, famosa per il suo whisky. Il tour guidato dura 8 giorni, con partenza da Taipei.",
    quandoAndare:
      "Ottobre-dicembre e marzo-aprile sono i mesi migliori, con clima gradevole. Da giugno a settembre è caldo e umido e c'è il rischio di tifoni.",
  },
  "arabia-saudita": {
    cosaVedere:
      "L'Arabia Saudita si sta aprendo al turismo: l'itinerario di 8 giorni, guidato in italiano, parte da Gedda e tocca anche Medina, AlUla, Tabuk e Riad. AlUla, con le tombe nabatee scavate nella roccia di Hegra, patrimonio UNESCO, e i paesaggi del deserto, è la tappa più sorprendente.",
    quandoAndare:
      "Da ottobre a marzo, quando le temperature sono sopportabili; tra giugno e settembre il caldo è estremo. Ti consigliamo di verificare sempre i requisiti d'ingresso aggiornati prima di partire.",
  },
  montenegro: {
    cosaVedere:
      "Il Montenegro è un paese piccolo e ancora selvaggio, con la baia di Cattaro, le montagne e la costa adriatica. Il nostro itinerario di 8 giorni parte da Dubrovnik, in Croazia, ed è self made: un viaggio per chi ama muoversi in libertà.",
    quandoAndare:
      "Da maggio a ottobre per il mare; giugno e settembre sono i mesi ideali. In primavera e in autunno le montagne sono bellissime per camminare.",
  },
  "capo-verde": {
    cosaVedere:
      "Capo Verde è un arcipelago per chi ama camminare e la musica: l'itinerario di 8 giorni tocca São Vicente, l'isola di Mindelo e della morna di Cesária Évora, e Santo Antão, con Ribeira Grande, Ponta do Sol e la verdissima valle di Paul, tra le più belle per i sentieri. È un viaggio self made.",
    quandoAndare:
      "Il clima è mite tutto l'anno; da novembre a giugno è più secco e ventoso, il momento migliore per camminare. Tra agosto e ottobre fa più caldo e può piovere.",
  },
  "hong-kong": {
    cosaVedere:
      "Hong Kong, in 4 giorni, è un concentrato di contrasti: i grattacieli sul porto di Victoria, il Peak, i templi tra i palazzi, i mercati e la cucina di strada. È un viaggio self made, ideale come prolungamento di un tour in Asia.",
    quandoAndare:
      "Da ottobre a dicembre, con cielo sereno e clima asciutto; marzo e aprile sono piacevoli. Da maggio a settembre è caldo e umido e possono arrivare i tifoni.",
  },
  cipro: {
    cosaVedere:
      "Cipro mette insieme mare e storia: Paphos, con i mosaici romani e le tombe dei re, Nicosia, capitale divisa in due, e Larnaca, con la sua costa e il lago salato. L'itinerario di 8 giorni è self made, con partenza da Paphos.",
    quandoAndare:
      "Da aprile a giugno e da settembre a ottobre: mare caldo e clima mite. Luglio e agosto sono molto caldi; l'inverno è dolce, ideale per le visite.",
  },
  slovenia: {
    cosaVedere:
      "La Slovenia è un paese piccolo e verdissimo: i luoghi più amati sono Lubiana, la capitale a misura d'uomo, il lago di Bled con la sua isoletta e le grotte di Postumia. Il nostro itinerario di 8 giorni, self made, parte da Pola, in Istria.",
    quandoAndare:
      "Da maggio a settembre per laghi e montagne; l'autunno ha i colori più belli. In inverno Lubiana è molto suggestiva con i mercatini, mentre in montagna fa freddo.",
  },
}
