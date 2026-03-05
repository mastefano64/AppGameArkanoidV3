# Ruolo
Tu sei un agente esperto nella scrittura della documentazione tecnica. Leggi con ATTENZIONE prompt-iniziale.md e prompt-mattoncini.ms dove trovi le specifiche di progetto. Guarda con ATTENZIONE tutti i file .js per capire cosa fanno e come sono state implementate le specifiche. A questo punto, scrivi una documentazione tecnica seguendo i punti sottostanti.

**Deve essere un spiegazione molto tecnica, in cui entri in merito al codice ed alle iterazioni nelle varie classi (metodi, eventi callback). Sotto di ho dato delle indicazioi, tu devi completarla con il contenuto dei file .js. Non devi limitarti a fare copi e incolla di quello che c'è escitto sotto. Quello che c'è scritto sotto è una lista di punti da seguire. Analizza il codice. Analizza il codice. Spiegando come vengono gestite le variabili di stato, i flag, etc. (es la classeA chiama un metodo della classeB - la classeB invia un evento alla classeA).**

# Architettura
Crea una sezione "architettura". In questa sezione spiegherai l'architettura in generale oltre a prendere in considrazione i segunti punti:
- Come è organizzata l'architettura sia a livello di webapp che file .js. 
- Essendo l'applicazione spalmata su più file esitera un file ed un oggetto (di root) "App" che farà partire l'applicazione, all'interno di questo oggetto verranno instanziati tutti gli altri oggetti se necessari. Così come negli oggetti sottostanti.
- Avendo una struttura App => Parent => Child ogni oggetto sovrastante comunica con l'oggetto sottostante utilizzando dei metodi. Quasti metodi potranno essere sincroni o asincroni.
- Gli oggetti inferiori comunicano con gli oggetti superiori attraverso eventi. Se si tratta di un elemento html userai gli eventi di default di html. Per quanto riguarda gli oggetti che hai creato tu (tramite class / new), la comunicazione deve sempre avvenire per eventi, in questo caso se non è presente in javascript una funzione per gestire gli eventi, crea un event-hrlper con metodi: add, remove, raise, etc.
- Ogni classe deve avere un metodo dispose in cui vengono liberate le risorse così come l'unsubscribe ad un evento.

**Spiega come avviene lo startup del'applicazione? Attraverso quali metodi a scendere? Cosa fanno?**

# Layout
Crea una sezione "layout". In questa sezione spiegherai il layout dell'applicazione (header, campogioco, footer). Coso sono, cosa contengono, che ruolo svolgono, che funzioni hanno.

# Stati del gioco e bottoni (abilitati / disabilitati)
Crea una sezione "stati e bottoni" in cui spieghi gli stati presenti nell'applicazione e le relazioni con i bottoni e con il gioco.

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
  
Oltre ad introdurre le regole di gioco, spiega come sono implementate le classi corrispondenti (campogioco, mattoncino, palla, racchetta, etc...). Le iterazioni tra le classi (es. come viene rilevata la collisione tra palla e mattoncino - a chi viene notificata - etc...).

**Spiega cosa avviene quando premi un bottone? Quali metodi vengono chiamati a scendere? Cosa fanno?**

Deve essere un spiegazione molto tecnica, in cui entri in merito al codice e alle iterazioni nelle varie classi (metodi, eventi callback). NON fare solo copia ed incolla di quello che c'è scritto sopra. SCRIVI la documentazione guardando il codice.

# Reference API
Crea una sezione "reference api" in cui elenchi tutte le classi presenti nell'applicazione. Per ogni classe devi elencare: 1) Parametri passati nel costruttore. 2) Metodi presenti e parametri. 3) Evetuali eventi. 4) Evetuali callback.  Per ogni metodo o evento scrvi una breve descrizione spiegando cosa fa, e le iterazioni / relazioni con altre classi parent / child.

**Deve essere un spiegazione molto tecnica, in cui entri in merito al codice ed alle iterazioni nelle varie classi (metodi, eventi callback). Sopra di ho dato delle indicazioi, tu devi completarla con il contenuto dei file .js. Non devi limitarti a fare copi e incolla di quello che c'è escitto sopra. Quello che c'è scritto sopra è una lista di punti da seguire. Analizza il codice. Analizza il codice. Spiegando come vengono gestite le variabili di stato, i flag, etc. (es la classeA chiama un metodo della classeB - la classeB invia un evento alla classeA).**
  