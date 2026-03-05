
# Ruolo
Tu sei un agente esperto nella scrittura di codice. Voglio creare un semplice gioco in stile Arkanoid con html, css, canvas, javascript. 
Pertanto deve essere una webapp. Per provarla la puoi hostare un light web server (in vscode). Prima di scrivere il codice leggi tutto il prompt fino in fondo. Dopo aver letto tutto inizia e "procedi step by step".

#Architettura
Come detto è un applicazione contenuta in unica pagina html.

- Cerca di utilizzare i principi SOLID, in particolar modo il "Single Responsibility Principle (SRP)", in modo da non scrivere 
tutto in un unico file, ma suddividerlo in più file **coesi e disaccoppiati per reponsabilità**.
- Visto che UTILIZZI javascript e NON typescript, non c'è webpack o altre utility per creare bundle o minificare.
- Ogni oggetto javascript deve essere creato utilizzando il costrutto "class" è l'operatore new per creare l'oggetto.
- Essendo l'applicazione spalmata su più file esitera un file ed un oggetto (di root) "App" che farà partire l'applicazione, all'interno di questo oggetto verranno instanziati tutti gli altri oggetti se necessari. Così come negli oggetti sottostanti.
- Avendo una struttura App => Parent => Child ogni oggetto sovrastante comunica con l'oggetto sottostante utilizzando dei metodi. Quasti metodi potranno essere sincroni o asincroni (usa gli asincroni solo se necessario - async/await).
- Gli oggetti inferiori comunicano con gli oggetti superiori attraverso eventi. Se si tratta di un elemento html userai gli eventi di default di html. Per quanto riguarda gli oggetti che hai creato tu (tramite class / new), la comunicazione deve sempre avvenire per eventi, in questo caso se non è presente in javascript una funzione per gestire gli eventi, crea un event-hrlper con metodi: add, remove, raise, etc.
- Ogni classe deve avere un metodo dispose in cui vengono liberate le risorse così come l'unsubscribe ad un evento.
- Per rendere agevole la modifica dei css, crea delle variabili d'ambiente per i valori principali (es. dimensioni colori, size, etc...), quando non specificate nell'oggetto appConfig. Dai la precedenza all'oggetto appConfig.

- Essendo l'applicazione spalmata su più file esiterà un file ed un oggetto "App" che farà partire l'applicazione. Nel costruttore verrà passato un oggetto AppConfig (che conterrà parametri di configurazione), l'oggetto AppConfig verrà poi passato nel costruttore di ogni classe che verrà creata.

- Applica alle classi i nomi e le responsabilità che vuoi tu ma non fare tutto in un unico file. Sotto vedi una lista di tag script che caricano dei file .js ma era sono un esempio. Devi invece implementare le funzionalità descritte nel prompt.

- Tutti i file creati devono essere in root, non creare sottocartelle js o altro!

Esempio (i nomi sono inventati, tu devi basarti su ciò che è scritto sotto)

appConfig = {
  p1: 1,
  p2: 2,
  p3: 3
}

<script src="appConfig.js"></script>
<script src="event-helper.js"></script>
<script src="utils.js"></script>
<script src="header.js"></script>
<script src="settings-popup.js"></script>
<script src="racchetta.js"></script>
<script src="palla.js"></script>
<script src="campodigioco.js"></script>
<script src="footer.js"></script>
<script src="app.js"></script>
<script language="javascript">
window.onload = function(e){ 
  const app = new App(appConfig);  
  app.bootstrapApp()
}
</script>

- **Crea una variabile interna "isRunning" che indica se il gioco è: "Fermo", "In corso", "In pausa". Questa variabile è usata anche per gestire lo "stato". La pressione di un bottone potrebbe provocare un cambio di stato di conseguenza impostare ad un valore diverso la variabile "isRunning" (true/false). Se una partita viene avviata o termina, questo causa un cambio di stato e di conseguenza imposta un valore diverso la variabile "isRunning" (true/false). Così come abilitare o disabilitare un bottoni. Vedi dettagli sotto.**

# Layout
- Lo schermo contiene 3 aree: header, campo di gioco, footer (disposte a pila).

- L'header occupa un 10% dello schermo (questi valori sono impostati nell oggetto appConfig). 
- Nel header vengono posizionati le lables ed il bottone "Setting".
- Il campo di gioco occupa il 75% dello schermo (questi valori sono impostati nell oggetto appConfig). 
- Al cemtro c'è un campo da gioco in cui un piccolo rettangolo (la palla) rimbalza contro la parete superiore e le pareti laterali laterali. Nella parte inferiore del campo di gioco c'è una racchetta che viene usata per colpire la palla. 
- Il footer occupa un 15% dello schermo (questi valori sono impostati nell oggetto appConfig). 
- Nel footer vengono posizionati "i controlli utente".

- header, campo di gioco, footer devono avere un margine bianco di 10px, in modo che le palle non battono contro il bordo dello schermo, ma contro il margine del campo di gioco.

- Lo sfondo dello schermo e delle singole aree deve essere blu ed i bottoni bianchi con un bordo bianco (questi valori sono mdificabili nell'oggetto appConfig). Nella forma descrittiva è stata usata l'espressione "campo di gioco” nelle proprietà invece "campodigioco", sono la stessa cosa.

- Nell'header 
 -- Sulla sinistra c'è la lable che mostra il punteggio (testo e valore es. Punteggio: 40) deve essere sempre visibile. Il valore del 
puntenggio viene azzerato ogni volta che avvio una nuova sessione di gioco. Quando il gioco finisce il punteggio rimane visibile.
 -- In centro c'è una lable che mostra: "Gioca" o "GameOver!". "GameOver!" compare quando il gioco finisce. "Gioca" compare la prima volta
che avvio il gioco o quando avvio una nuova sessione di gioco. 
 -- Sulla destra c'è il un bottone "Setting" che apre un popup in cui si confgurano le impostazioni di gioco. Questo bottone è abilitato solo quando il gioco è "Fermo". Quando il gioco "In corso" o "In pausa" il pulsante "Setting" sarà disabilitato.

- Campo da gioco
- Nella forma descrittiva è stata usata l'espressione "campo di gioco” nelle proprietà invece "campodigioco", sono la stessa cosa.
- Un campo gioco è formato da un piccoli rettangoli (le palle) che rimbalzano contro la parete superiore e le pareti laterali laterali, le palle vengono colpite da una racchetta (un rettangolo) che viene fatta muovere attraverso il mouse. Oltre che dal mouse la racchetta viene anche fatta nuovere anche da 2 bottoni situati nell'area adibita ai controlli utente. 
- E' possibile giocare con 1 o n. palle. Il numero di palle con cui è possibile giocare conteporaneamente viene impostato/modificato nel popup "Setting". Quando si avvia il gioco viene preso il valore di default.
- E' possibile impostare la velocità della palla con un valore che va da 1 o n. viene impostato/modificato nel popup "Setting". Quando si avvia il gioco viene preso il valore di default.
- La racchetta è posizionata nella parte inferiore del campo di gioco, dimensione e colore della racchetta (un rettangolo) sono in appConfig: racchettaWidth: "20%", racchettaHeight: "20px", racchettaBackground: "white". Di default è imposta una larghezza racchetta pari al 20% della larghezza del campo da gioco. La racchetta compare quando il gioco viene avviato, scompare quando il gioco termina.
- Se una palla esce dal campo viene rimossa; il gioco termina quando non ci sono più palle. E' anche possibile terminare una sessione di gioco premendo il bottone "Stop" (anche se ci sono ancora palle), ed questo caso il gioco verrà fermato. In entrambi i casi lo stato da "In corso" o "in Pausa" diventerà "Fermo".
- Se il gioco è nello stato "Fermo" la racchetta non si vede, Si vede solo se lo stato è "In corso" o "in Pausa".
- Maggiori informazioni in: "Stati del gioco e bottoni (abilitati / disabilitati)".

- Nell'footer 
 -- C'è un area adibita ai controlli utente e ci sono i seguenti bottoni:
2 bottoni che controllano la racchetta (oltre al controllo del mouse), 1 bottone "start", 1 bottone toggle "pause/resume", 1 bottone "stop". Per un totale di 5 bottoni. Nell'area adibita ai controlli utente i bottoni vengono disposti nel seguente ordine: "racchetta a sinistra", "start", toggle "pause/resume", "stop", "racchetta a destra". Sotto i bottoni compare anche una lable che mostra con quante palle si stà giocando.

# Stati del gioco e bottoni (abilitati / disabilitati)
- Il gioco puo avere 3 stati (ogni stato esclude gli altri): "Fermo", "In corso", "In pausa".

- Fermo: Nessuna palla si muove. Variabile "isRunning" (false), bottone "Start" è abilitato, bottone toggle "Pause/Resume" disabilitato, bottone "Stop" disabilitato. 

- Premendo il bottone "Start" inizia una nuova partita e lo stato passa a in "In corso". Variabile "isRunning" (true), bottone "Start" è disabilitato, bottone toggle "Pause/Resume" abilitato, bottone "Stop" abilitato. 

- In corso/In pausa: Almeno una palla attiva o in pausa. Variabile "isRunning" (true), bottone "Start" è disabilitato, bottone toggle "Pause/Resume" abilitato, bottone "Stop" abilitato. Quando il gioco è "In corso" premendo il bottone toggle "Pause/Resume" posso sospendere/pause il gioco e le palle si fermano nel punto in cui si trovavano, lo stato diventa "In pausa". Quando il gioco è "In pausa" premendo il bottone toggle "Pause/Resume" posso riprendere/resume e le palle iniziano nuovamente a muoversi dal punto in cui si trovavano, lo stato diventa "In corso". IMPORTANTE: non viene fatto nessun reset dei contatori "isRunning" rimane a (true). 
- Nel bottone toggle "Pause/Resume", la label cambia in base allo stato del gioco: Quando il gioco è "In corso": la label del bottone mostra "Pause". Quando il gioco è "In pausa": la label del bottone mostra "Resume". Quando il gioco è "Fermo": il bottone è disabilitato e la label mostra "Pause/Resume", e non è cliccabile.

- Se una palla esce dal campo, viene rimossa; il gioco termina quando non ci sono più palle. Il bottone "Start" è abilitato, il bottone toggle "Pause/Resume" è disabilitato, il bottone "Stop" è disabilitato. In questo caso la stato del gioco sarà "Fermo" e la variabile "isRunning" (false).

- Quando premo il bottone "Stop" la partita viene arrestata anche se ci sono palle. Il bottone "Start" è abilitato, il bottone toggle "Pause/Resume" è disabilitato, il bottone "Stop" è disabilitato. In questo caso la stato del gioco sarà "Fermo" e la variabile "isRunning" (false). 

# Casi d'uso, funzioni gioco 
- La gestione degli eventi garantisce che la scritta centrale sia sempre coerente con lo stato del gioco.
- La scritta centrale "Gioca" e "Game Over!", sempre visibile e aggiornata in base allo stato del gioco ("In corso"/"In pausa", "Fermo").
- Quando la palla rimbalza deve farlo con un minimo di realismo, così come quando viane colpita dalla racchetta.
- Se l'utente riesce a colpire la palla, con la racchetta mossa tramite il mouse (o i bottoni) e posizionata nel limite inferiore del campo di gioco, la palla rimbalza contro le pareti laterali o la parete superiore, in base all'angolazione.
- Se l'utente non riesce a colpire la palla, la palla finirà fuori campo (in basso), verrà pertanto rimossa dal gioco e l'utente continuerà a giocare con meno palle (es. l'utente gioca con 4 palle, non riesce a colpire una palla, ora giocherà con 3 palle).

# Logica popup "Setting" 
- Quando l'utente preme sul bottone di "Setting" (che è abilitato solo quando lo stato e "Fermo"), viene aperto un popup tramite il quale l'utente sceglie le regole di gioco. In questo popup sono presenti due combobox e 2 bottoni "Conferma" e "Chiudi".
- Il popup contiene due combobox. Numero palle (da 1 a 10, configurabile). Velocità palle (da 1 a 10, configurabile).

- La combobox numeroPalle mostra i valori presi dall'oggetto di configurazione appConfig (numero di palle minimo=1, numero di palle massimo=n.). Importante, se per esempio numero di palle minimo=1 e numero di palle massimo=5, la combobox conterrà i seguenti valori: 1,2,3,4,5. In questo modo l'utente può selezionare un valore dalla combobox in modo da giocare con un certo numero di palle. contemporaneamente. 

- La combobox velocitaPalle mostra i valori presi dall'oggetto di configurazione appConfig (velocita palle minimo=1, velocita palle massimo=n.). Importante, se per esempio velocita palle minimo=1 e velocita massimo=5, la combobox conterrà i seguenti valori: 1,2,3,4,5.
In questo modo l'utente può selezionare un valore dalla combobox in modo da stabilire la velocità delle palle.

- Due bottoni: "Conferma" (applica le impostazioni), "Chiudi" (non applica le impostazioni).
- Le impostazioni selezionate vengono "momorizzate" ed applicate al gioco e UI al prossimo riavvio, solo se è stato premuto "Conferma", nel caso venga premuto "Chiudi" le impostazioni vengono scartate.

- Nell'area adibita ai controlli utente sotto ai bottoni c'è una piccola lable che indica con quante palle si sta giocando contemporaneamente in questo momemto. Inizialmete viene mostrato il valere di default, se l'utente apre il popup tramite il bottone "Setting", seleziona un valore nella combobox, e preme il bottone "Conferma"; il valore selezionato verrà mostrato nella lable posta sotto ai bottoni (es. stai giocando con 3 palle). Il bottone "Setting" è abilitato solo nello stato "Fermo" in altri stati è "Disabilitato".

- In ogni caso la pressione dei bottoni "Conferma" o "Chiudi" fa si che il popup venga chiuso. 

# Eventi e comunicazione
- EventHelper gestisce eventi custom tra oggetti JS. 
- Ogni classe ha un metodo `dispose` per liberare risorse e fare unsubscribe.

# Stili
- Stili CSS dinamici, bottoni uniformi, popup ben visibile e differenziato.
- Tutti i valori principali sono modificabili tramite `appConfig`.
- Tutti i bottoni devono avere un bordo.
- Il colore di background dei bottoni deve essere una tonalità di blu diversa da quella del campo.
- Quando passi sopra ad un bottone deve avere un hightlight.
- Quando apri il popup, il popup deve avere un colore di background diverso da quello del campo.
- Crea delle variabili CSS ma tieni conto che molti valori sono presenti in appConfig.

# Riepilogo finale (visione sintetica)
In qusta sezione viene fatto un riepilogo delle cose importanti: stati gioco, bottoni abiltati/disabilitati, etc..

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
  lableForeground: "white",
};
