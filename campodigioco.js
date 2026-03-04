// campodigioco.js
import { Mattoncino } from './mattoncino.js';
class CampoDiGioco {
    _drawMattoncini() {
      // Disegna tutti i mattoncini
      for (const fila of this.mattoncini) {
        for (const mattoncino of fila) {
          if (mattoncino.presente) {
            mattoncino.draw(this.ctx);
          }
        }
      }
    }
  constructor(appConfig, eventHelper) {
    this.appConfig = appConfig;
    this.eventHelper = eventHelper;
    this.canvas = document.getElementById('campodigioco');
    this.ctx = this.canvas.getContext('2d');
    this.width = 600;
    this.height = 400;
    this.palle = [];
    this.racchetta = null;
    this.isVisible = false;
    // Mattoncini
    this.mattoncini = [];
    this._creaMattoncini();
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }
  // ...existing code...
  _creaMattoncini() {
    // Leggi configurazione
    const nFile = this.appConfig.fileMatttoncini || 6;
    const margineFile = this.appConfig.margineFileMatttoncini || 0.1; // percentuale
    const margineMattoncini = this.appConfig.margineMatttoncini || 2;
    const colori = this.appConfig.coloreMatttoncini || ["red","orange","yellow","green","blue","purple"];
    const nColonne = this.appConfig.colonneMatttoncini || 10;
    const campoW = this.width;
    const campoH = this.height;
    const hMattoncino = this.appConfig.mattonciniHeight ? parseInt(this.appConfig.mattonciniHeight) : Math.floor((campoH * (1 - margineFile)) / nFile) - margineMattoncini;
    const yStart = Math.floor(campoH * margineFile);
    const wMattoncino = Math.floor((campoW - (nColonne + 1) * margineMattoncini) / nColonne);
    this.mattoncini = [];
    for (let r = 0; r < nFile; r++) {
      const fila = [];
      for (let c = 0; c < nColonne; c++) {
        const x = margineMattoncini + c * (wMattoncino + margineMattoncini);
        const y = yStart + r * (hMattoncino + margineMattoncini);
        fila.push(new Mattoncino(x, y, wMattoncino, hMattoncino, colori[r % colori.length], true, r));
      }
      this.mattoncini.push(fila);
    }
  }
  setRacchetta(racchetta) {
    this.racchetta = racchetta;
  }
  setPalle(palle) {
    this.palle = palle;
  }
  show() {
    this.isVisible = true;
    this._draw();
  }
  hide() {
    this.isVisible = false;
    this._clear();
  }
  ricreaMattoncini() {
    this._creaMattoncini();
    // Animazione: mostra una fila alla volta
    if (this.mattoncini && this.mattoncini.length > 0) {
      // Nascondi temporaneamente tutte le file
      for (const fila of this.mattoncini) {
        for (const m of fila) m.presente = false;
      }
      this._draw();
      let filaCorrente = 0;
      const mostraFila = () => {
        if (filaCorrente < this.mattoncini.length) {
          for (const m of this.mattoncini[filaCorrente]) m.presente = true;
          this._draw();
          filaCorrente++;
          setTimeout(mostraFila, 70); // velocità animazione (ms)
        }
      };
      setTimeout(mostraFila, 100);
    } else {
      this._draw();
    }
  }
  _resize() {
    // Adatta il canvas al contenitore
    const container = document.getElementById('campodigioco-container');
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this._creaMattoncini();
    this._draw();
  }
  _clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  _draw() {
    if (!this.isVisible) {
      this._clear();
      return;
    }
    this._clear();
    // Disegna mattoncini
    this._drawMattoncini();
    // Disegna palle
    this.palle.forEach(palla => palla.draw(this.ctx));
    // Disegna racchetta
    if (this.racchetta && this.racchetta.isVisible) {
      this.racchetta.draw(this.ctx);
    }
  }
}
export { CampoDiGioco };
