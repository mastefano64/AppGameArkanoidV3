# Piano di esecuzione Arkanoid Webapp

---

**1. Analisi e suddivisione responsabilità**
- Applicazione single-page, suddivisa in più file JS, ciascuno con una classe responsabile (SRP/SOLID).
- File root: app.js (classe App), appConfig.js (configurazione), più file per ogni componente (header, campo di gioco, racchetta, palla, footer, popup settings, event-helper, utils).

**2. Struttura dei file**
- appConfig.js: oggetto di configurazione.
- event-helper.js: gestione eventi custom tra classi.
- utils.js: funzioni di utilità.
- header.js: gestione header (score, stato, bottone settings).
- settings-popup.js: popup impostazioni (numero palle, velocità palle).
- racchetta.js: gestione racchetta (movimento, eventi).
- palla.js: gestione palla/e (movimento, collisioni).
- campodigioco.js: gestione campo, rendering canvas, logica gioco.
- footer.js: gestione controlli utente (bottoni, label palle).
- app.js: classe root, istanzia e collega tutte le componenti.

**3. Logica di stato**
- Variabile isRunning: "Fermo", "In corso", "In pausa".
- Gestione abilitazione/disabilitazione bottoni e visibilità racchetta/popup in base allo stato.

**4. Layout e UI**
- Tre aree: header (10%), campo di gioco (75%), footer (15%), margine bianco 10px.
- Stili CSS dinamici, bottoni uniformi, popup ben visibile, variabili CSS e valori da appConfig.

**5. Gestione eventi**
- Event-helper per comunicazione tra classi.
- Eventi HTML per interazione utente.
- Ogni classe ha metodo dispose.

**6. Funzionalità principali**
- Movimento racchetta (mouse e bottoni).
- Movimento e rimbalzo palle (realismo base).
- Gestione punteggio, game over, start/stop/pause/resume.
- Popup settings: modifica numero palle e velocità, applicazione al prossimo avvio.

**7. Step di sviluppo**
- Creazione file e classi base.
- Implementazione event-helper.
- Implementazione appConfig.
- Layout HTML/CSS.
- Implementazione header, footer, campo di gioco.
- Logica racchetta e palla.
- Gestione popup settings.
- Gestione stato e eventi.
- Test e refactoring.

---

Procedere step by step, iniziando dalla creazione dei file base e della struttura HTML.