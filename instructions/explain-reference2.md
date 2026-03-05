# Documentazione Tecnica Completa

Generata con GPT-5 mini

**Architettura**

Questa documentazione tecnica descrive l'architettura, il comportamento runtime, gli stati, le interazioni tra le classi e l'API di riferimento dell'applicazione Arkanoid presente nella workspace. Le informazioni sono ricavate dal codice sorgente (file .js) e spiegano: variabili di stato, flag, eventi, callback, ciclo di vita degli oggetti, e come avvengono le collisioni e il calcolo punteggio.

- Struttura file e oggetti
  - L'app è suddivisa in file modulati: [app.js](app.js), [header.js](header.js), [footer.js](footer.js), [campodigioco.js](campodigioco.js), [mattoncino.js](mattoncino.js), [palla.js](palla.js), [racchetta.js](racchetta.js), [settings-popup.js](settings-popup.js), [event-helper.js](event-helper.js), [appConfig.js](appConfig.js), [utils.js](utils.js).
  - Ogni file espone una classe che incapsula responsabilità specifiche (UI, logica di gioco, entità fisiche). L'oggetto root è `App` (in `app.js`) che istanzia e orchestra gli altri componenti.

- Pattern di comunicazione
  - Comunicazione top-down (parent → child): tramite chiamate di metodo sincrone/asincrone (es. `App` chiama `CampoDiGioco.ricreaMattoncini()` o `Racchetta.show()`).
  - Comunicazione bottom-up (child → parent): tramite eventi custom gestiti da `EventHelper` (metodi `add`, `remove`, `raise`) o direttamente eventi DOM per elementi HTML.
  - Tutte le classi custom utilizzano `EventHelper` (quando necessario) per disaccoppiare comportamenti.

- Ciclo di vita e risorse
  - Ogni classe espone `dispose()` per rimuovere listener e liberare risorse (es. `Racchetta.dispose()` rimuove `mousemove`). `App.dispose()` chiama dispose sui figli.

- Startup dell'applicazione
  - Al `DOMContentLoaded` viene creato `window.appArkanoid = new App(appConfig)` (se `appConfig` è definito).
  - `App.constructor` esegue `_initComponents()` e `_bindEvents()`:
    - `_initComponents()` istanzia `Header`, `Footer`, `CampoDiGioco`, `Racchetta`, `SettingsPopup` e collega la `Racchetta` al `CampoDiGioco` (`campo.setRacchetta(racchetta)`).
    - `_bindEvents()` registra gli handler sugli eventi custom (`openSettings`, `settingsConferma`, `startGame`, `pauseResume`, `stopGame`, `racchettaLeft`, `racchettaRight`).
  - `App.bootstrapApp()` esegue `_updateUI()` per sincronizzare stato iniziale UI/oggetti.

**Layout**

- Struttura visiva
  - `Header` ([header.js](header.js)):
    - Contiene etichetta punteggio (`#score-label`), etichetta stato (`#state-label`), bottone `Setting` (`#settings-btn`).
    - Responsabilità: mostra punteggio, stato di gioco, abilita/disabilita il bottone `Setting` in funzione dello stato.
  - `CampoDiGioco` ([campodigioco.js](campodigioco.js)):
    - Canvas principale con id `campodigioco` nel contenitore `campodigioco-container`.
    - Contiene e rende: mattoncini, palle, racchetta. Gestisce dimensioni, resize e animazioni di creazione mattoncini.
  - `Footer` ([footer.js](footer.js)):
    - Contiene i bottoni di controllo (`btn-left`, `btn-start`, `btn-pause`, `btn-stop`, `btn-right`) e la label con il numero di palle (`#n-palle`).
    - Responsabilità: emettere eventi di controllo dell'interfaccia, aggiornare abilitazione e label dei bottoni.
  - `SettingsPopup` ([settings-popup.js](settings-popup.js)):
    - Popup modale con selettori per numero palle e velocità; comandi `Conferma` e `Chiudi`.

**Stati del gioco e bottoni**

Variabili principali:
- `App.isRunning` (boolean): indica se il gioco è attivo (true) o fermo (false). Nel codice `isRunning` è usata assieme allo stato testuale `App.state`.
- `App.state` (string): valori usati: `'Fermo'`, `'In corso'`, `'In pausa'`.
- `Palla.isActive` (boolean): indica se la palla è ancora dentro il campo.

Regole di enable/disable (implementazione effettiva):
- Lo stato UI viene sincronizzato da `App._updateUI()` e dagli `App._startGame()`, `_togglePause()`, `_stopGame()`, `_gameOver()` che chiamano `header.setState()` e `footer.setState()`.
- `Footer._update()` imposta:
  - `btnStart.disabled = state !== 'Fermo'`
  - `btnPause.disabled = state === 'Fermo'`
  - `btnPause.textContent` a seconda di `state`:
    - `'In corso'` → 'Pause'
    - `'In pausa'` → 'Resume'
    - `'Fermo'` → 'Pause/Resume'
  - `btnStop.disabled = state === 'Fermo'`
- `Header._update()` disabilita `settingsBtn` quando stato !== 'Fermo'.

Visibilità racchetta:
- `Racchetta.isVisible` è gestito da `Racchetta.show()` / `Racchetta.hide()` invocate da `App` in start/stop/over. La racchetta è visibile solo con stato `'In corso'` o `'In pausa'`, nascosta in `'Fermo'`.

Terminazione della partita:
- Se una palla esce dal campo (`Palla.update()` imposta `isActive = false`), `App._gameLoop()` rimuove le palle inattive dal suo array `this.palle` e aggiorna `campo.setPalle(this.palle)`.
- Quando `this.palle.length === 0` viene chiamato `_gameOver()` che imposta stato a `'Fermo'`, aggiorna header/footer, mostra label `Game Over!` e nasconde la racchetta.
- Se l'utente preme `Stop` viene chiamato `App._stopGame()`: svuota `this.palle`, imposta stato `'Fermo'`, nasconde racchetta e aggiorna il canvas.

Cosa succede quando premi un bottone (es. `Start`)
- Click `Start` → `Footer` emette evento `startGame` tramite `EventHelper.raise('startGame')`.
- `App._bindEvents()` ha registrato `eventHelper.add('startGame', () => this._startGame())`, quindi `App._startGame()` viene eseguito:
  - Riesegue `campo.ricreaMattoncini()` per ricostruire/animare i mattoncini.
  - Imposta `isRunning = true`, `state = 'In corso'`, azzera `score` e aggiorna header/footer UI.
  - Mostra `racchetta` e `campo`.
  - Dopo delay di 1.2s chiama `_spawnPalle()` (crea `nPalle` istanze `Palla`) e lancia `_gameLoop()`.
- `_spawnPalle()` crea ogni `Palla` con callback `onScore` che aggiorna `App.score` e chiama `header.setScore()`.
- `_gameLoop()` è un loop basato su `requestAnimationFrame` che richiama `Palla.update()` su ciascuna palla, filtra le palle inattive, aggiorna il `campo` e ridisegna (`campo._draw()`); si interrompe se `!isRunning` o `state !== 'In corso'`.

**Implementazione classi e interazioni (dettagli tecnici)**

- `EventHelper` ([event-helper.js](event-helper.js))
  - Proprietà: `events: { [name]: handler[] }`.
  - Metodi: `add(event, handler)`, `remove(event, handler)`, `raise(event, ...args)`, `dispose()`.
  - Ruolo: dispatch degli eventi custom tra moduli, evita dipendenze crowed.

- `App` ([app.js](app.js))
  - Proprietà: `appConfig`, `eventHelper`, `isRunning`, `state`, `score`, `nPalle`, `velocitaPalle`, `palle[]`, `header`, `footer`, `campo`, `racchetta`, `settingsPopup`.
  - Metodi principali:
    - `constructor(appConfig)`: crea `EventHelper`, inizializza componenti e bind degli eventi.
    - `_initComponents()`: istanzia moduli, passa `eventHelper` e collega `campo.setRacchetta()`.
    - `_bindEvents()`: registra handler per comandi UI.
    - `_startGame()`: vede sopra; ricrea mattoncini, prepara UI, spawn palle, avvia loop.
    - `_togglePause()`: se `'In corso'` → `'In pausa'` e viceversa; se riattiva `In corso` richiama `_gameLoop()` (non reinizializza palle).
    - `_stopGame()`: ferma il gioco e pulisce palle.
    - `_spawnPalle()`: crea array `Palla` con callback `onScore`.
    - `_gameLoop()`: aggiornamento frame; richiede `requestAnimationFrame` se condizioni valide.
    - `_gameOver()`: setta state `'Fermo'`, mostra `Game Over!`, pulisce palle.
    - `bootstrapApp()`, `dispose()`.
  - Interazioni: coordina tutte le componenti via chiamate dirette e tramite `EventHelper` per input UI.

- `CampoDiGioco` ([campodigioco.js](campodigioco.js))
  - Proprietà: `appConfig`, `eventHelper`, `canvas`, `ctx`, `width`, `height`, `palle[]`, `racchetta`, `isVisible`, `mattoncini[][]`.
  - Metodi:
    - `constructor(appConfig, eventHelper)`: inizializza canvas, dimensioni, mattoncini tramite `_creaMattoncini()` e bind del resize.
    - `_creaMattoncini()`: costruisce array 2D `mattoncini[file][colonna]` usando `Mattoncino` con parametri calcolati (width, height, margini, colori). Usa `appConfig` per valori di default.
    - `ricreaMattoncini()`: ricrea e animazione di presentazione (mostra fila per fila via `setTimeout`).
    - `setRacchetta(racchetta)`, `setPalle(palle)`, `show()`, `hide()`.
    - `_resize()`: adatta dimensioni canvas al contenitore e ricrea mattoncini.
    - `_drawMattoncini()`, `_clear()`, `_draw()`: rendering mattoncini, palle e racchetta.
  - Interazioni:
    - Tiene riferimento a `palle[]` e `racchetta`; `App` chiama `campo.setPalle()` e `campo._draw()` per sincronizzare vista.
    - Non emette eventi custom per collisioni: la collisione viene rilevata da `Palla` consultando `campo.mattoncini` e `campo.racchetta`.

- `Mattoncino` ([mattoncino.js](mattoncino.js))
  - Proprietà: `x,y,width,height,colore,presente, rowIndex`.
  - Metodi: `distruggi()` (setta `presente=false`), `draw(ctx, margine, coloreCampo)` (disegna rettangolo e margine).
  - Ruolo: entità grafica/di stato, la logica di distruzione è eseguita dalla `Palla` che chiama `m.distruggi()`.

- `Palla` ([palla.js](palla.js))
  - Proprietà: `appConfig`, `campo`, `radius`, `x`, `y`, `velocita`, `angle`, `vx`, `vy`, `isActive`, `onScore`.
  - Costruttore: riceve `appConfig`, riferimento a `campo`, posizione iniziale `x,y`, `velocita`, `angle`, e callback `onScore`.
  - Metodi:
    - `update()`: core della fisica per frame. Opera come segue:
      - Aggiorna posizione: `x += vx`, `y += vy`.
      - Collisione con pareti (sinistra/destra/top): riposiziona e inverte componente di velocità corrispondente.
      - Collisione con mattoncini: per ogni mattoncino presente, calcola il punto più vicino (AABB vs circonferenza) e se sovrapposizione < raggio => collisione. In tale caso:
        - Esegue `m.distruggi()` (flag `presente=false`).
        - Calcola punteggio `punti = r + 1` (rowIndex relativo), invoca `onScore(punti)` se definito.
        - Inverte `vy` per rimbalzo verticale.
        - Esce dal ciclo (break outer) per evitare più distruzioni nello stesso frame.
      - Collisione con `Racchetta`: controlla sovrapposizione tra bounding-box racchetta e cerchio; se collide, posiziona la palla sopra la racchetta, inverte `vy` e modifica `vx` in base al punto di impatto (per variare angolo): `impacco = (x - centroRacchetta) / (width/2)` e `vx = velocita * impatto`.
      - Esce dal campo sotto: se `y - radius > campo.height` imposta `isActive = false`.
    - `draw(ctx)`: disegna il cerchio solo se `isActive`.
  - Interazioni:
    - Legge `campo.mattoncini` e `campo.racchetta` per collisioni; chiama `onScore` per notificare `App`.
    - Non emette eventi custom; comunica tramite callback fornita da `App`.

- `Racchetta` ([racchetta.js](racchetta.js))
  - Proprietà: `appConfig`, `eventHelper`, `campo`, `isVisible`, `width`, `height`, `x`, `y`, `speed`, `_onMouseMove`.
  - Costruttore: calcola dimensioni (supporta percentuali `racchettaWidth`), posizione iniziale basata su `campo.width` e `campo.height`, registra `mousemove` sul canvas.
  - Metodi: `show()`, `hide()`, `moveLeft()`, `moveRight()`, `draw(ctx)`, `dispose()`.
  - Event binding: `_bindEvents()` aggiunge `mousemove` all'elemento `campo.canvas` e aggiorna `x` in base alla posizione del mouse clampata con `Utils.clamp`.
  - `dispose()` rimuove il listener `mousemove`.
  - Interazioni: `Footer` emette eventi `racchettaLeft` / `racchettaRight` che `App` intercetta e chiama `racchetta.moveLeft()` / `moveRight()`.

- `Header` ([header.js](header.js))
  - Proprietà: `appConfig`, `eventHelper`, `root`, `score`, `state`, `settingsBtn`.
  - Metodi: `setScore(score)`, `setState(state)`, `_render()`, `_update()`, `dispose()`.
  - Interazioni: `_render()` crea `settingsBtn` che al click emette `openSettings` tramite `eventHelper.raise('openSettings')` SOLO se `state === 'Fermo'`.

- `Footer` ([footer.js](footer.js))
  - Proprietà: `appConfig`, `eventHelper`, `root`, `state`, `nPalle`, riferimenti bottoni.
  - Metodi: `setState(state)`, `setNumeroPalle(n)`, `_render()`, `_update()`, `dispose()`.
  - Interazioni: i bottoni eseguono `eventHelper.raise('racchettaLeft')`, `raise('startGame')`, `raise('pauseResume')`, `raise('stopGame')`, `raise('racchettaRight')`.

- `SettingsPopup` ([settings-popup.js](settings-popup.js))
  - Proprietà: `appConfig`, `eventHelper`, `root`, `overlay`, `visible`, `selectedPalle`, `selectedVelocita`, `nPalleSel`, `velSel`.
  - Metodi: `show()`, `hide()`, `_render()`, `setValues(palle, velocita)`, `dispose()`.
  - Interazioni: alla conferma esegue `eventHelper.raise('settingsConferma', selectedPalle, selectedVelocita)` e si nasconde.

- `Utils` ([utils.js](utils.js))
  - Funzioni: `clamp(val,min,max)`, `randomInt(min,max)`.
  - Utilizzata da `Racchetta` per limitare la posizione della racchetta.

**Algoritmi significativi e dettaglio tecnico**

- Collisione palla/mattoncino
  - Implementazione: test AABB contro cerchio. Per ogni mattoncino presente si calcola il punto più vicino della hitbox rettangolare rispetto al centro della palla (`closestX`, `closestY`) e si misura distanza quadrata rispetto al raggio (`dx*dx+dy*dy < r*r`). Questo evita controlli complessi di poligoni e garantisce determinismo.
  - Azioni in collisione: `m.distruggi()` (imposta `presente=false`) e `this.vy *= -1` per rimbalzare verticalmente. Il punteggio è `r + 1` (fila +1) e viene notificato tramite `onScore` callback fornita da `App`.

- Calcolo angolo su rimbalzo con racchetta
  - Quando la palla colpisce la racchetta, oltre a invertire `vy`, viene calcolato `impatto = (x - centroRacchetta)/(width/2)` che normalizza il punto di impatto in [-1,1] e viene usato per impostare `vx = velocita * impatto`, creando variazione angolare dipendente dal punto d'impatto.

- Gestione palle multiple
  - `App._spawnPalle()` crea n istanze `Palla` con angoli casuali attorno a PI/4 e le passa a `CampoDiGioco` con `campo.setPalle(this.palle)`. Il game loop itera tutte le palle e filtra quelle `isActive=false` per rimozione.

**Reference API (elenco classi e membri)**

- `App(appConfig)`
  - Costruttore: `appConfig` — oggetto configurazione globale (vedi [appConfig.js](appConfig.js)).
  - Proprietà chiave: `eventHelper`, `isRunning`, `state`, `score`, `nPalle`, `velocitaPalle`, `palle`, `header`, `footer`, `campo`, `racchetta`, `settingsPopup`.
  - Metodi pubblici:
    - `bootstrapApp()` — sincronizza UI iniziale.
    - `dispose()` — chiama dispose sui componenti.
  - Metodi interni (usati dall'app): `_startGame()`, `_togglePause()`, `_stopGame()`, `_spawnPalle()`, `_gameLoop()`, `_gameOver()`, `_updateUI()`.
  - Eventi gestiti tramite `EventHelper`: `openSettings`, `settingsConferma`, `startGame`, `pauseResume`, `stopGame`, `racchettaLeft`, `racchettaRight`.

- `EventHelper()`
  - Metodi: `add(event, handler)`, `remove(event, handler)`, `raise(event, ...args)`, `dispose()`.
  - Uso: meccanismo pub/sub per comunicazione tra moduli.

- `Header(appConfig, eventHelper)`
  - Costruttore: riceve `appConfig`, `eventHelper`.
  - Metodi: `setScore(score)`, `setState(state)`, `dispose()`.
  - Eventi emessi: `openSettings` (via `eventHelper.raise` quando `settingsBtn` cliccato e stato === 'Fermo').

- `Footer(appConfig, eventHelper)`
  - Costruttore: riceve `appConfig`, `eventHelper`.
  - Metodi: `setState(state)`, `setNumeroPalle(n)`, `dispose()`.
  - Eventi emessi: `racchettaLeft`, `startGame`, `pauseResume`, `stopGame`, `racchettaRight`.

- `CampoDiGioco(appConfig, eventHelper)`
  - Costruttore: `appConfig`, `eventHelper`.
  - Metodi: `setRacchetta(racchetta)`, `setPalle(palle)`, `show()`, `hide()`, `ricreaMattoncini()`, `_draw()` (render), `dispose()` (non implementato esplicitamente ma `App.dispose()` non lo chiama; attenzione a eventuali listener resize: l'handler di resize è registrato anonimo in costruttore — se si volesse rimuovere listener, bisognerebbe salvare la referenza e rimuoverla in `dispose`).
  - Dipendenze: usa `Mattoncino` per generare la griglia.

- `Mattoncino(x,y,width,height,colore,presente=true,rowIndex=0)`
  - Metodi: `distruggi()`, `draw(ctx, margine, coloreCampo)`.

- `Palla(appConfig, campo, x, y, velocita, angle, onScore=null)`
  - Costruttore: vedi parametri.
  - Metodi: `update()`, `draw(ctx)`.
  - Callback: `onScore(punti)` — chiamata quando la palla distrugge un mattoncino per aggiornare il punteggio.

- `Racchetta(appConfig, eventHelper, campo)`
  - Costruttore: riceve `appConfig`, `eventHelper`, `campo`.
  - Metodi: `show()`, `hide()`, `moveLeft()`, `moveRight()`, `draw(ctx)`, `dispose()`.
  - Event binding: `mousemove` sul `campo.canvas` per controllo diretto con mouse.

- `SettingsPopup(appConfig, eventHelper)`
  - Metodi: `show()`, `hide()`, `setValues(palle, velocita)`, `dispose()`.
  - Eventi emessi: `settingsConferma(nPalle, velocita)`.

**Note operative e potenziali migliorie**

- `CampoDiGioco.dispose()` non rimuove il listener `resize` registrato nel costruttore: per evitare leak è consigliabile memorizzare la funzione handler e rimuoverla su dispose.
- `App._gameLoop()` controlla contemporaneamente `isRunning` e `state === 'In corso'`. Quando si entra in `In pausa` `_togglePause()` non cancella frame pendenti; la condizione nel loop termina l'esecuzione fintanto che `state !== 'In corso'`. Questo modello è semplice ma va bene per questa scala.
- `Palla` esegue il polling diretto di `campo.mattoncini` per collisione: per grandi numeri di mattoncini si potrebbe introdurre una struttura spaziale (griglia/quad-tree) per ottimizzare i test di collisione.
- Test di regressione: simulare palle multiple e colpi su bordo/racchetta per verificare che non avvengano più distruzioni per frame.

**Conclusione**

Il sistema è progettato con un `App` orchestratore, componenti responsabili della UI (Header/Footer/Settings) e un dominio di gioco gestito principalmente da `CampoDiGioco`, `Palla`, `Mattoncino` e `Racchetta`. La comunicazione tra UI e logica passa principalmente tramite `EventHelper`, mentre la fisica e le collisioni sono implementate nelle entità `Palla` e `CampoDiGioco`.

Se vuoi, posso:
- aggiungere diagrammi di sequenza per gli scenari `Start`/`Pause`/`Stop`;
- implementare `dispose()` per `CampoDiGioco` (rimuovere `resize` listener);
- estrarre test/unitari di collisione.
