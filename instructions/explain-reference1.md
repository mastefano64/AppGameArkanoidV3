# Documentazione Tecnica Completa

Generata con GPT-4.1

## Architettura

L'applicazione è strutturata come una webapp modulare, suddivisa in più file JavaScript, ciascuno responsabile di una specifica funzionalità. Il file principale è app.js, che contiene la classe `App`, punto di ingresso e root dell'applicazione. All'interno di `App` vengono istanziati tutti i componenti principali: Header, Footer, CampoDiGioco, Racchetta, SettingsPopup, EventHelper e le Palle. 

La comunicazione tra i vari oggetti segue una gerarchia App => Parent => Child. I metodi di controllo (sincroni/asincroni) vengono invocati dagli oggetti superiori verso quelli inferiori. Gli oggetti child comunicano con i parent tramite eventi, gestiti dalla classe `EventHelper`, che implementa un sistema di event dispatch custom (add, remove, raise). Ogni classe implementa un metodo `dispose` per la liberazione delle risorse e la deregistrazione degli eventi.

Lo startup dell'applicazione avviene tramite la creazione dell'istanza `App`, che chiama `_initComponents()` per istanziare i componenti e `_bindEvents()` per collegare gli handler agli eventi. L'avvio del gioco parte dal metodo `_startGame()`, che ricrea i mattoncini, aggiorna lo stato, mostra i componenti grafici e avvia il game loop e la generazione delle palle.

## Layout

Il layout è suddiviso in tre sezioni principali:
- **Header**: Visualizza il punteggio, lo stato del gioco e il bottone "Setting". Aggiorna dinamicamente le informazioni tramite i metodi `setScore` e `setState`.
- **CampoDiGioco**: Area centrale dove avviene il gameplay. Contiene il canvas, i mattoncini, le palle e la racchetta. Gestisce il rendering e le collisioni.
- **Footer**: Contiene i bottoni di controllo (Start, Pause/Resume, Stop, Racchetta sinistra/destra) e la label con il numero di palle. I bottoni sono abilitati/disabilitati in base allo stato del gioco.
- **SettingsPopup**: Finestra modale per la configurazione del numero e velocità delle palle.

## Stati del gioco e bottoni

La variabile di stato principale è `isRunning` (boolean) e `state` (string: "Fermo", "In corso", "In pausa"). Gli stati determinano l'abilitazione dei bottoni:
- **Fermo**: Start e Setting abilitati, Pause/Resume e Stop disabilitati, Racchetta abilitata.
- **In corso**: Pause/Resume e Stop abilitati, Start e Setting disabilitati, Racchetta abilitata.
- **In pausa**: Pause/Resume e Stop abilitati, Start e Setting disabilitati, Racchetta abilitata.

Il bottone Pause/Resume cambia label e stato in base allo stato del gioco. Quando tutte le palle escono dal campo, il gioco termina e lo stato torna a "Fermo". La racchetta è visibile solo quando il gioco è "In corso" o "In pausa".

## Regole di gioco e implementazione classi

- **CampoDiGioco**: Gestisce il canvas, il rendering dei mattoncini (array 2D), la racchetta e le palle. Implementa la creazione, animazione e ridimensionamento dei mattoncini. Le collisioni tra palla e mattoncino sono gestite nel metodo `update` della classe Palla, che notifica la distruzione del mattoncino e aggiorna il punteggio tramite callback.
- **Mattoncino**: Oggetto che rappresenta il singolo mattoncino. Ha proprietà di posizione, dimensione, colore e stato (presente/distrutto). Il metodo `distruggi` imposta il mattoncino come non visibile.
- **Palla**: Gestisce posizione, velocità, direzione e collisioni. Quando collide con un mattoncino, lo distrugge e aggiorna il punteggio. Se esce dal campo, viene disattivata.
- **Racchetta**: Gestisce la posizione e il movimento orizzontale tramite bottoni e mouse. È visibile solo durante il gioco attivo. Il metodo `dispose` rimuove gli event listener.
- **EventHelper**: Sistema di gestione eventi custom tra classi. Permette di aggiungere, rimuovere e notificare eventi tra oggetti.

Quando viene premuto un bottone, viene sollevato un evento tramite `EventHelper`, che attiva il metodo corrispondente nella classe App (es. startGame → `_startGame()`). Da qui vengono chiamati i metodi dei child (es. ricreaMattoncini, show, setState, etc.), aggiornando lo stato e l'interfaccia.

## Reference API

### App
- **Costruttore**: `(appConfig)`
- **Metodi**:
  - `_initComponents()`: Istanzia tutti i componenti.
  - `_bindEvents()`: Collega gli handler agli eventi.
  - `_startGame()`: Avvia una nuova partita.
  - `_togglePause()`: Mette in pausa/riprende il gioco.
  - `_stopGame()`: Ferma la partita.
  - `_spawnPalle()`: Crea le palle e collega la callback punteggio.
  - `_gameLoop()`: Gestisce il ciclo di gioco.
  - `dispose()`: Libera risorse e deregistra eventi.
- **Eventi**: Gestiti tramite EventHelper.

### CampoDiGioco
- **Costruttore**: `(appConfig, eventHelper)`
- **Metodi**:
  - `_creaMattoncini()`: Crea la griglia di mattoncini.
  - `setRacchetta(racchetta)`: Collega la racchetta.
  - `setPalle(palle)`: Collega le palle.
  - `show() / hide()`: Mostra/nasconde il campo.
  - `ricreaMattoncini()`: Ricrea e anima i mattoncini.
  - `_draw()`: Renderizza il campo.
  - `_resize()`: Adatta il canvas.
  - `dispose()`: Libera risorse.

### Mattoncino
- **Costruttore**: `(x, y, width, height, colore, presente, rowIndex)`
- **Metodi**:
  - `distruggi()`: Distrugge il mattoncino.
  - `draw(ctx, margine, coloreCampo)`: Renderizza il mattoncino.

### Palla
- **Costruttore**: `(appConfig, campo, x, y, velocita, angle, onScore)`
- **Metodi**:
  - `update()`: Aggiorna posizione, gestisce collisioni e stato.
  - `draw(ctx)`: Renderizza la palla.
- **Callback**:
  - `onScore(punti)`: Aggiorna il punteggio.

### Racchetta
- **Costruttore**: `(appConfig, eventHelper, campo)`
- **Metodi**:
  - `show() / hide()`: Mostra/nasconde la racchetta.
  - `moveLeft() / moveRight()`: Muove la racchetta.
  - `draw(ctx)`: Renderizza la racchetta.
  - `dispose()`: Rimuove gli event listener.

### EventHelper
- **Costruttore**: `()`
- **Metodi**:
  - `add(event, handler)`: Aggiunge un handler per un evento.
  - `remove(event, handler)`: Rimuove un handler.
  - `raise(event, ...args)`: Solleva un evento e notifica gli handler.
  - `dispose()`: Libera risorse.

### Header
- **Costruttore**: `(appConfig, eventHelper)`
- **Metodi**:
  - `setScore(score)`: Aggiorna il punteggio.
  - `setState(state)`: Aggiorna lo stato.
  - `dispose()`: Libera risorse.

### Footer
- **Costruttore**: `(appConfig, eventHelper)`
- **Metodi**:
  - `setState(state)`: Aggiorna lo stato.
  - `setNumeroPalle(n)`: Aggiorna il numero di palle.
  - `dispose()`: Libera risorse.

### SettingsPopup
- **Costruttore**: `(appConfig, eventHelper)`
- **Metodi**:
  - `show() / hide()`: Mostra/nasconde la finestra.
  - `setValues(palle, velocita)`: Imposta i valori selezionati.
  - `dispose()`: Libera risorse.

## Iterazioni e relazioni

- App gestisce lo stato globale e coordina i componenti tramite EventHelper.
- CampoDiGioco gestisce la logica di gioco e il rendering, riceve input da Racchetta e aggiorna i mattoncini tramite Palla.
- Mattoncino viene distrutto da Palla e notifica il punteggio tramite callback.
- Racchetta riceve input da bottoni e mouse, aggiorna la posizione e interagisce con le palle.
- EventHelper gestisce la comunicazione tra componenti tramite eventi custom.
- Header e Footer aggiornano la UI in base allo stato e agli eventi.
- SettingsPopup permette la configurazione dinamica dei parametri di gioco.

Questa documentazione copre l'intera architettura, il flusso degli eventi, la gestione degli stati, le iterazioni tra le classi e la reference API completa, come richiesto dal prompt.