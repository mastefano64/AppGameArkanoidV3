class Mattoncino {
  constructor(x, y, width, height, colore, presente = true, rowIndex = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colore = colore;
    this.presente = presente; // true = mattoncino visibile, false = distrutto
    this.rowIndex = rowIndex; // indice della fila del mattoncino
  }

  distruggi() {
    this.presente = false;
  }

  draw(ctx, margine, coloreCampo) {
    if (!this.presente) return;
    // Disegna il mattoncino
    ctx.fillStyle = this.colore;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // Disegna il bordo/margine
    if (margine > 0) {
      ctx.fillStyle = coloreCampo;
      // Bordo destro
      ctx.fillRect(this.x + this.width, this.y, margine, this.height);
      // Bordo inferiore
      ctx.fillRect(this.x, this.y + this.height, this.width + margine, margine);
    }
  }
}

// Struttura dati: array 2D per le file di mattoncini
// Esempio: mattoncini[file][colonna]
// La creazione e gestione sarà fatta nel campo da gioco

export { Mattoncino };
