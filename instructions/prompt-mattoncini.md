# Dinamiche dei mattoncini e del campo da gioco
Questa è una nuova funzionalità aggiunta ad un gico esistente in cui una palla colpita da una raccheta rimbalzava conto il bordo superore e i bordi laterali. Il gioco ha degli stati e dei bottoo che posso essere abilitati o non abilitati in base ad un certo stato. In fondo nella sezione "Riepilogo finale stati / bottoni, funzioni già esistenti" puo trovare un riegilogo delle funzionalità esistenti. Maggiori informaziono le trovi nel file "prompt-iniziale.md". 

**IMPORTANTE: aggiungi solo la dinamica per la gestione dei mattoncini senza modificare il resto!**

1. **Disposizione mattoncini**: I mattoncini sono disposti in n. file orizzontali nella parte alta del campo da gioco, il numero di file di mattoncini è stabilito dalla proprietà "fileMatttoncini" in appConfig, il numero di colonne di mattoncini è stabilito dalla proprietà "colonneMatttoncini" in appConfig. La fila più in alto non tocca il bordo superiore, lasciando un margine (es. 10% dell’altezza del campo). Il margine è stabilito dalla proprietà "margineFileMatttoncini" in appConfig. I mattoncini sono contenuti in una matrice.
2. **Altezza dei mattoncini**: L'altezza dei mattoncini è configurabile tramite la proprietà "mattonciniHeight" in appConfig.js (esempio: mattonciniHeight: "24"). Se non specificata, viene calcolata automaticamente in base allo spazio disponibile e al numero di file.
3. **Bordo tra i mattoncini**: Tra un mattoncino e l'altro viene lasciato un piccolo margine (ad esempio 1-2 pixel) che viene colorato con lo stesso colore del campo da gioco, il margine è stabilito dalla proprietà "margineMatttoncini" in appConfig. Questo margine non permette il passaggio della palla e serve solo come separatore visivo, dando l'effetto che tra i mattoncini si veda lo sfondo del campo da gioco.
4. **Colore delle file**: Tutti i mattoncini di una stessa fila hanno lo stesso colore, mentre il margine tra i mattoncini è sempre del colore del campo da gioco. Questo rende le file facilmente distinguibili e migliora la leggibilità della disposizione dei mattoncini. I colori devono essere messi in un array chiamato "coloreMatttoncini" in appConfig dove il numero degli elementi uguale al numero delle file. Il colore attribuito ad una fila di mattoncini non deve essere lo stesso del campo da gioco.
5. **Ostruzione**: Finché le file di mattoncini sono integre, la palla non può raggiungere il bordo superiore; i mattoncini bloccano il passaggio.
6. **Impatto e distruzione**: Quando la palla colpisce un mattoncino, il mattoncino viene distrutto e la palla rimbalza indietro.
7. **Varco tra i mattoncini**: Quando si crea un varco tra i mattoncini, la palla può attraversarlo e iniziare a rimbalzare tra il bordo superiore e la fila più alta di mattoncini rimasti, distruggendoli uno a uno.
8. **Ritorno verso il basso**: Se trova un varco per scendere, la palla torna verso il basso e la racchetta può colpirla di nuovo.
9. **Gestione dei bordi**: La palla rimbalza sui bordi laterali e superiore del campo da gioco, oltre che sulla racchetta e sui mattoncini.
10. **Stati del gioco**: Il gioco mantiene lo stato dei mattoncini (presenti/distrutti), della palla (posizione, direzione), della racchetta (posizione), e dei bordi (collisioni).
11. **Visualizzazione mattoncini**: I mattoncini vengono mostrati quando si avvia il gioco. Quando il gioco finisce, i mattoncini rimangono visibili (mostrando quelli rimasti/distrutti).
12. **Visualizzazione mattoncini**: I mattoncini vengono ricreati solo quando inizia una nuova sessione di gioco (nuova partita). Queste regole garantiscono la dinamica tipica di Arkanoid, con la progressiva distruzione dei mattoncini e la gestione dei rimbalzi e degli stati.
13. **Punteggio per fila di mattoncini**: Quando un mattoncino viene distrutto, il punteggio assegnato dipende dalla sua fila: la fila più vicina alla racchetta vale 1 punto per mattoncino, la successiva 2 punti, e così via fino alla fila più in alto che vale n punti (dove n è il numero totale di file di mattoncini). Il punteggio viene azzerato solo all'inizio di una nuova partita e visualizzato nell'header; a fine partita il valore rimane invariato.

# Riepilogo finale stati / bottoni, funzioni già esistenti
In qusta sezione viene fatto un riepilogo delle cose importanti: stati gioco, bottoni abiltati/disabilitati, etc.. Header e Footer devono essere sempre visibili, come nella versione originale. I bottoni possono essere abilitati/disabilitati, ma sono sempre presenti. La racchetta viene mostrata solo quando il gioco è "In corso" o "In pausa", e nascosta quando il gioco è "Fermo".

- La variabile di stato è chiamata isRunning:
  - isRunning = false → Stato "Fermo"
  - isRunning = true → Stato "In corso" o "In pausa".

- Stato "Fermo":
  - Start: abilitato
  - Pause/Resume: disabilitato
  - Stop: disabilitato
  - Setting: abilitato
  - Racchetta sinistra/destra: abilitati  

- Stato "In corso":
  - Start: disabilitato
  - Pause/Resume: abilitato (mostra "Pause")
  - Stop: abilitato
  - Setting: disabilitato
  - Racchetta sinistra/destra: abilitati  

- Stato "In pausa":
  - Start: disabilitato
  - Pause/Resume: abilitato (mostra "Resume")
  - Stop: abilitato
  - Setting: disabilitato
  - Racchetta sinistra/destra: abilitati  

- Nel bottone toggle "Pause/Resume", la label cambia in base allo stato del gioco:
  - Quando il gioco è "In corso": il bottone è disabilitato, la label del bottone mostra "Pause".
  - Quando il gioco è "In pausa": il bottone è disabilitato, la label del bottone mostra "Resume".
  - Quando il gioco è "Fermo": il bottone è disabilitato, la label mostra "Pause/Resume".

- Se una palla esce dal campo viene rimossa; il gioco termina quando non ci sono più palle. E' anche possibile terminare una sessione di gioco premendo il bottone "Stop" (anche se ci sono ancora palle), ed questo caso il gioco verrà fermato. In entrambi i casi lo stato da "In corso" o "in Pausa" diventerà "Fermo".

- Racchetta: quando è visibile o nascosta
  - Visibile: quando il gioco è "In corso" o "In pausa".
  - Nascosta: quando il gioco è "Fermo".

# Oggetto appConfig
Sotto viene mostrato un oggetto appConfig di base. Tu se vuoi aggiungi altri valori.

const appConfig = {
  headerHeight: "10%",
  campodigiocoHeight: "75%",
  footerHeight: "15%",
  headerBackground: "blue",
  headerForeground: "white",
  campodigiocoBackground: "blue",
  campodigiocoForeground: "white",
  footerBackground: "blue",
  footerForeground: "white",
  racchettaWidth: "20%",
  racchettaHeight: "20px",
  racchettaBackground: "white",
  numeroPalleMinimo: 1,
  numeroPalleMassimo: 10,
  numeroPalleDefault: 3,
  dimensionePalla: 8,
  velocitaPalleMinimo: 1,
  velocitaPalleMassimo: 10,
  velocitaPalleDefault: 5,
  buttonBackground: "blue",
  buttonForeground: "white",
  lableBackground: "blue",
  lableForeground: "white"  
};
