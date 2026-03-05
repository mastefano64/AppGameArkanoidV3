# Documentazione Tecnica Completa

Generata con Raptor Mini

## Architettura
L'applicazione è una semplice WebApp single-page suddivisa in una serie di file `.js` che rappresentano componenti indipendenti: **app.js**, **header.js**, **footer.js**, **campodigioco.js**, **racchetta.js**, **palla.js**, **mattoncino.js**, **settings-popup.js**, **event-helper.js**, **utils.js** e una configurazione condivisa **appConfig.js**.

La struttura logica rispecchia un modello ad alberatura: un oggetto di root `App` istanzia tutti i sottosistemi e mantiene lo stato globale. I componenti inferiori (es. `CampoDiGioco`, `Racchetta`, `Palla`, ecc.) vengono creati dal `App` e comunicano verso l'alto tramite un oggetto di supporto `EventHelper` che implementa un semplice pub/sub.  

- **App** è la radice: si occupa dello startup (per DOMContentLoaded) e della gestione degli stati del gioco (`isRunning`, `state`, `score`, numero e velocità delle palle). 
- All'interno di `App._initComponents` vengono creati i sotto-oggetti passando `appConfig` e lo stesso `EventHelper`. In particolare:
  - `Header` e `Footer` gestiscono l'interfaccia utente superiore e inferiore e inviano eventi di controllo tramite callback HTML.
  - `CampoDiGioco` gestisce il canvas e l'insieme di mattoncini, palle e l'aggancio alla racchetta.
  - `Racchetta` viene instanziata con riferimenti a `campo` per conoscere dimensioni e per registrare l'evento `mousemove`.
  - `SettingsPopup` mostra e nasconde un pannello modale per modificare parametri del gioco.
- I metodi pubblico/privati nel `App` sono chiamati in cascata dai listener degli eventi: `_startGame`, `_togglePause`, `_stopGame`, `_spawnPalle`, `_gameLoop`, `_gameOver`, `_updateUI`, `bootstrapApp`, `dispose`.

### Comunicazione
tutti gli oggetti padre -> figlio invocano metodi direttamente (sinc. o async). Ad esempio `CampoDiGioco.setRacchetta(this.racchetta)` o `this.footer.setState('In corso')`.

I figli comunicano verso i genitori elevando eventi tramite `EventHelper.raise(...)`. L'`EventHelper` fornisce i metodi `add`, `remove`, `raise` e `dispose`; è riutilizzato da ogni componente che ne riceve il riferimento. In origine non esistevano eventi custom ECMAScript; essi sono definiti manualmente e associati anche ai pulsanti HTML nella sezione `_render` di `Header` e `Footer`. 

Ogni classe esportata possiede un metodo `dispose()` nel quale vengono rimosse le callback e liberate eventuali risorse (es. rimozione di listener DOM nel caso di `Racchetta` o semplicemente svuotamento del contenuto innerHTML). Questo permette un cleanup pulito quando l'applicazione viene distrutta.

### Startup
1. Una volta che l'evento `DOMContentLoaded` scatta, la funzione anonima instanzia `App` se la variabile globale `appConfig` è definita.
2. Nel costruttore `App` vengono inizializzate configurazione, `EventHelper`, stato e chiamate `_initComponents` e `_bindEvents`.
3. `_initComponents` crea i sotto-oggetti e chiama `_updateUI` che imposta l'aspetto iniziale (score=0, stato "Fermo", nasconde racchetta e campo).  
4. `_bindEvents` registra su `eventHelper` gli handler per tutte le azioni dell'interfaccia (start, pause/resume, stop, impostazioni, movimenti racchetta).  
5. L'applicazione è pronta: `bootstrapApp()` (richiamato di default dopo l'instanziamento) si limita a sincronizzare UI e stato.

La sequenza di invocazione durante lo startup crea la radice `App`, poi i figli, li collega tramite metodi setter, e imposta tutti i listener necessari per reagire ai comandi utente.

---

## Layout
L'app si compone di tre aree principali articolate in HTML: header, canvas di gioco (`campodigioco`) e footer.

- **Header** (`header.js`): un contenitore con etichette per il punteggio e lo stato e un pulsante Settings. 
  - `Header._render()` popola l'elemento DOM con gli span e il bottone; salva riferimenti a `score-label`, `state-label` e `settings-btn`. 
  - L'handler di `settingsBtn.onclick` rialza l'evento `openSettings` solo se lo stato è "Fermo".
  - Metodi pubblici `setScore` e `setState` aggiornano rispettivamente il punteggio e la visualizzazione dello stato. 

- **Campo di Gioco** (`campodigioco.js`): wrapper attorno ad un canvas con dimensioni 600x400 originali, ridimensionate dinamicamente. Contiene la logica di disegno e di gestione dei mattoncini. 
  - `_creaMattoncini()` legge parametri da `appConfig` per calcolare dimensioni e posizioni; genera una matrice 2D di oggetti `Mattoncino`.
  - `ricreaMattoncini()` viene chiamato da `App._startGame` per resettare lo schermo e lanciare un'animazione di comparsa fila-per-fila. 
  - `setRacchetta` e `setPalle` collegano riferimenti; `show` / `hide` controllano `isVisible` e invocano `_draw` / `_clear`.
  - `_draw()` disegna in ordine: mattoncini, palle e racchetta solo se visibile. 
  - L'area del gioco risponde a `resize` del browser con `_resize()` che ricalcola dimensioni e ricrea i mattoncini.

- **Footer** (`footer.js`): contiene i pulsanti di controllo (sinistra, start, pause/resume, stop, destra) e un'etichetta che mostra il numero di palle. 
  - Il layout viene generato da `_render()` e gli eventi `onclick` rialzano eventi verso `App`. 
  - `_update()` abilita/disabilita pulsanti in base allo stato del gioco e modifica il testo del pulsante pausa/resume.

- **Popup delle impostazioni** (`settings-popup.js`): dialog modale con select per numero di palle e velocità. 
  - `_render()` costruisce il contenuto HTML e imposta i listener per conferma/chiudi. 
  - `show()` e `hide()` gestiscono la visibilità del pannello e dell'overlay. 
  - `setValues()` aggiorna i valori correnti nelle select.

---

## Stati del gioco e bottoni
La variabile centrale è `isRunning` (boolean) e `state` (stringa) in `App`. 

- **Fermo** (`isRunning=false`, `state='Fermo'`): stato di partenza o dopo game over/stop.
  - `Start` abilitato, `Pause/Resume` e `Stop` disabilitati.
  - `Settings` abilitato (via `Header`), racchetta visibile? no (viene nascosta in `_updateUI`).
  - Le racchette sinistra/destra sono sempre abilitate (puntano a eventi `racchettaLeft`/`racchettaRight`).

- **In corso** (`isRunning=true`, `state='In corso'`): giocando attivamente.
  - `Start` disabilitato, `Pause/Resume` abilitato con label "Pause", `Stop` abilitato, `Settings` disabilitato.
  - La racchetta è mostrata (`racchetta.show()`), il campo è mostrato (`campo.show()`). 
  - In `_gameLoop` le palle vengono aggiornate (metodo `update` di `Palla`) e disegnate; se il numero di palle scende a zero, passa a `_gameOver` e lo stato diventa "Fermo".

- **In pausa** (`isRunning=true`, `state='In pausa'`): interruzione temporanea.
  - `Pause/Resume` rimane abilitato ma la label diventa "Resume"; il loop di gioco si ferma perché in `_gameLoop` il controllo `if (!this.isRunning || this.state !== 'In corso') return` ferma le richieste di frame.
  - `Stop` rimane abilitato e, se premuto, ricade nello stato "Fermo".
  - Racchetta e palle rimangono disegnate ma non si muovono.

Il pulsante `Pause/Resume` gestisce anche il cambio etichetta dinamico nel `Footer._update`.

### Transizioni da eventi dell'interfaccia
- **Start**: `Footer` solleva evento `startGame` → `App._startGame`.
  - `_startGame` ricrea mattoncini, resetta punteggio, imposta stato e UI, mostra racchetta/campo, poi dopo 1.2s invoca `_spawnPalle` e avvia `_gameLoop`.

- **Pause/Resume**: `Footer` solleva `pauseResume` → `App._togglePause`.
  - Se si passa da "In corso" a "In pausa", aggiorna state in `App`, header e footer e non richiama il loop.
  - Se si torna a "In corso", riaggiorna e rilancia `_gameLoop`.

- **Stop**: `Footer` solleva `stopGame` → `App._stopGame`.
  - Imposta `isRunning=false`, resetta stato/UI, nasconde racchetta ma lascia campo con mattoncini visibili, cancella palle e chiama `_draw` per pulire.

- **Settings**: `Header`->`openSettings` apre il popup; quando il popup conferma invia `settingsConferma`, gestito da `App` per aggiornare `nPalle`, `velocitaPalle` e aggiornare l'UI del footer.

- **Racchetta sinistra/destra**: generano `racchettaLeft`/`racchettaRight`, catturati da `App` che invoca i metodi `moveLeft`/`moveRight` di `Racchetta`.

### Ciclo di vita delle palle
La classe `Palla` calcola posizione e vettori di velocità all'istanziazione. Il metodo `update()`:
- Applica il movimento incrementando `x` e `y`.
- Gestisce rimbalzi contro le pareti modificando `vx`/`vy`.
- Esegue il check di collisione con ogni mattoncino presente. Usa un algoritmo rettangolo/circonferenza per determinare l'urto, chiama `m.distruggi()` sul mattoncino, invia il callback `onScore(punti)` e inverte `vy`.
- Gestisce la collisione con la racchetta controllando sovrapposizione rettangolare e cambiando l'angolo orizzontale (`vx`) in base al punto di impatto.
- Se la palla supera il bordo inferiore (`y - radius > campo.height`) segna `isActive=false` e verrà filtrata fuori dal `App._gameLoop`.

Quando una palla colpisce un mattoncino, esso si distrugge tracciando l'indice di riga nel punteggio (riga più vicina alla racchetta vale meno punti). La gestione del punteggio è delegata alla callback `onScore` passata in fase di spawn da `App`.

---

## Reference API
### `EventHelper`
- **Costruttore**: nessun parametro.
- **Metodi**:
  - `add(event, handler)` : registra un handler di callback per l'evento nominato.
  - `remove(event, handler)` : elimina un handler specifico.
  - `raise(event, ...args)` : invoca tutti gli handler registrati per l'evento passando argomenti.
  - `dispose()` : pulisce la tabella degli eventi.
- **Relazioni**: usato come meccanismo di comunicazione tra componenti; ogni sottosistema riceve lo stesso oggetto condiviso e lo usa per emettere eventi verso l'`App`.

### `App`
- **Costruttore** `(appConfig)` : configura i parametri di gioco e inizializza `eventHelper`, stato, score, numero/velocità palle; chiama `_initComponents` e `_bindEvents`.
- **Metodi principali**:
  - `_initComponents()` : crea `Header`, `Footer`, `CampoDiGioco`, `Racchetta`, `SettingsPopup`; imposta `campo.setRacchetta` e aggiorna UI iniziale.
  - `_bindEvents()` : associa gli eventi dal `eventHelper` alle azioni interne (`_startGame`, `_togglePause`, `_stopGame`, movimenti racchetta, apertura settings).
  - `_startGame()` : resetta mattoncini, stato, score; mostra UI, genera palle e avvia il loop.
  - `_togglePause()` : cambia tra gli stati "In corso" e "In pausa" aggiornando header/footer e chiamando eventualmente `_gameLoop`.
  - `_stopGame()` : ferma il gioco, pulisce palle e pannello di gioco, nasconde racchetta.
  - `_spawnPalle()` : genera un array di oggetti `Palla` centrati, calcolando un angolo random e associando la callback `onScore`.
  - `_gameLoop()` : esegue ogni frame l'aggiornamento delle palle, filtra quelle attive, aggiorna `campo` e riprogramma `requestAnimationFrame`; se più nessuna palla rimane passa a `_gameOver`.
  - `_gameOver()` : simile a `_stopGame` con etichetta "Game Over!" nel `state-label`.
  - `_updateUI()` : sincronizza header, footer, racchetta e campo con lo stato attuale.
  - `bootstrapApp()` : invocato dall'esterno per iniziare l'applicazione, chiama `_updateUI`.
  - `dispose()` : chiama `dispose()` su tutti i componenti figlio.
- **Stato/Variabili**:
  - `isRunning` (bool), `state` (string), `score`, `nPalle`, `velocitaPalle`, `palle` (array), oggetti UI.
- **Eventi/Callback**: riceve eventi tramite `eventHelper` ma non ne genera.

### `Header`
- **Costruttore** `(appConfig, eventHelper)` : memorizza config/env e imposta DOM `#header`; inizializza `score` e `state` e chiama `_render`.
- **Metodi**:
  - `_render()` : costruisce l'HTML, registra `settingsBtn.onclick` per alzare `openSettings` se stato fermo, chiama `_update`.
  - `_update()` : aggiorna testo punteggio e stato; disabilita il pulsante settings se `state !== 'Fermo'`.
  - `setScore(score)` / `setState(state)` : setter con aggiornamento UI.
  - `dispose()` : annulla onclick e svuota `innerHTML`.
- **Eventi**: genera `openSettings`.

### `Footer`
- **Costruttore** `(appConfig, eventHelper)` : simile a Header, indica `nPalle` e `state`, rende DOM `#footer`.
- **Metodi**:
  - `_render()` : imposta HTML per pulsanti e label; associa onclick a ognuno per inviare eventi `racchettaLeft`, `racchettaRight`, `startGame`, `pauseResume`, `stopGame`.
  - `_update()` : attiva/disattiva i pulsanti in base allo stato e aggiorna label del numero di palle.
  - `setState(state)` / `setNumeroPalle(n)` : setter con chiamata a `_update`.
  - `dispose()` : rimuove onclick e pulisce `innerHTML`.
- **Eventi**: genera comandi di controllo verso `App`.

### `SettingsPopup`
- **Costruttore** `(appConfig, eventHelper)` : memorizza riferimenti DOM `#settings-popup` e `#popup-overlay`; cura `selectedPalle`/`selectedVelocita` e chiama `_render()`.
- **Metodi**:
  - `_render()` : genera HTML per le select basandosi sui range definiti in `appConfig`; associa onclick dei bottoni "Conferma" e "Chiudi".
  - `show()` / `hide()` : manipolano proprietà CSS `display` e flag `visible`.
  - `setValues(palle, velocita)` : aggiorna le selezioni esistenti.
  - `dispose()` : svuota `innerHTML`.
- **Eventi**: su conferma rialza `settingsConferma` con i valori scelti.

### `CampoDiGioco`
- **Costruttore** `(appConfig, eventHelper)` : inizializza il canvas, dimensioni, array `palle` e `mattoncini`, registra `resize` su window, chiama `_creaMattoncini()` e `_resize()`.
- **Metodi**:
  - `_creaMattoncini()` : calcola dimensioni e crea `Mattoncino` per ogni cella di una griglia; legge valori come file/colonne, margini e colori da `appConfig`.
  - `ricreaMattoncini()` : ripopola la griglia e anima la visibilità riga per riga impostando `presente=false` inizialmente e poi riattivandole con un timeout.
  - `_resize()` : aggiorna larghezza/altezza del canvas in base al container, ricrea i mattoncini, ridisegna.
  - `_clear()`, `_draw()` : gestione dello sfondo e chiamata ai disegni dei mattoncini, palle (`palla.draw`) e racchetta se visibile.
  - `setRacchetta(racchetta)`, `setPalle(palle)` : setter utilizzati da `App`.
  - `show()` / `hide()` : controllano la visibilità.
- **Eventi**: non genera eventi ma fornisce accesso ai mattoncini alla palla.

### `Mattoncino`
- **Costruttore** `(x, y, width, height, colore, presente=true, rowIndex=0)` : proprietà geometriche e di stato.
- **Metodi**:
  - `distruggi()` : imposta `presente=false`.
  - `draw(ctx, margine, coloreCampo)` : disegna il mattoncino sul canvas se `presente`, con eventuale bordo.
- **Eventi/Callback**: nessuno.

### `Palla`
- **Costruttore** `(appConfig, campo, x, y, velocita, angle, onScore=null)` : inizializza posizione, raggio, velocità, vettori vx/vy, flag `isActive` e callback `onScore`.
- **Metodi**:
  - `update()` : applica la fisica di movimento; gestisce rimbalzi contro pareti, collisioni con mattoncini (calcolo rettangolo/cerchio, distruzione, punteggio, inversione vy), collisione con racchetta (rimbalzo e variazione vx in base al punto di impatto) e deattivazione fuori campo.
  - `draw(ctx)` : disegna il cerchio della palla se attiva.
- **Eventi/Callback**: utilizza la callback `onScore` per segnalare i punti guadagnati all'`App`.

### `Racchetta`
- **Costruttore** `(appConfig, eventHelper, campo)` : calcola dimensioni e posizione iniziali in base a `campo` e config, setta `speed`, e chiama `_bindEvents()`.
- **Metodi**:
  - `_parseWidth(val, total)` : se la larghezza è percentuale calcola il valore basato su `total`.
  - `show()` / `hide()` : controllano `isVisible`.
  - `moveLeft()` / `moveRight()` : spostano `x` limitando il movimento ai bordi.
  - `draw(ctx)` : disegna un rettangolo se visibile.
  - `_bindEvents()` : registra su `campo.canvas` l'evento `mousemove`, convertendo la posizione del mouse in un nuovo `x` usando `Utils.clamp`.
  - `dispose()` : rimuove il listener `mousemove`.
- **Eventi**: reagisce soltanto a eventi DOM (`mousemove`) e genera call di movimento tramite `App`.

### `Utils`
- **Metodi statici**:
  - `clamp(val, min, max)` : restringe un valore tra due estremi.
  - `randomInt(min, max)` : genera un intero casuale. 
- **Eventi/Callback**: nessuno.

---

Questa documentazione copre la totalità delle classi e delle interazioni: dalle invocazioni di metodi tra padre/figlio, alle callback degli eventi, alla gestione degli stati e del ciclo principale del gioco. Ogni componente presenta un `dispose` per pulizia e usa l'evento custom `EventHelper` quando necessario. L'interfaccia HTML è costruita dinamicamente dai moduli e ogni controllo UI invoca un evento, mantenendo separata la logica di presentazione da quella di gioco.