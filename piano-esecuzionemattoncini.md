# Piano di esecuzione: Gestione mattoncini

## 1. Analisi e preparazione
- Rivedi prompt-mattoncini.md e prompt-iniziale.md per i requisiti.
- Verifica le configurazioni in appConfig (colori, dimensioni, margini).

## 2. Progettazione struttura dati
- Definisci una classe Mattoncino con proprietà: posizione, dimensioni, colore, stato (presente/distrutto).
- Definisci una struttura (array 2D) per gestire le 6 file di mattoncini.

## 3. Rendering grafico
- Implementa il disegno dei mattoncini su canvas:
  - Ogni mattoncino con il proprio colore.
  - Margine tra i mattoncini colorato come il campo da gioco.
  - Tutti i mattoncini di una fila hanno lo stesso colore.

## 4. Gestione collisioni
- Implementa la logica di collisione tra palla e mattoncini:
  - Quando la palla colpisce un mattoncino, distruggi il mattoncino e rimbalza la palla.
  - Aggiorna lo stato del mattoncino (distrutto).
  - Verifica che la palla non possa passare tra i margini.

## 5. Aggiornamento stato gioco
- Aggiorna lo stato dei mattoncini e della palla ad ogni frame.
- Gestisci la creazione di varchi e il comportamento della palla quando entra/esce dai varchi.

## 6. Test e verifica
- Verifica la corretta disposizione grafica e la separazione visiva tra i mattoncini.
- Testa la logica di distruzione, rimbalzo e varchi.
- Assicurati che le configurazioni in appConfig siano rispettate.

## 7. Refactoring e pulizia
- Ottimizza il codice per SRP e modularità.
- Aggiorna la documentazione se necessario.

## 8. Integrazione con il resto del gioco
- Assicurati che la gestione dei mattoncini non modifichi le altre funzionalità (stati, bottoni, racchetta, palla).
- Testa l’integrazione finale.

---
Segui questi step per implementare la gestione dei mattoncini secondo le specifiche del prompt.