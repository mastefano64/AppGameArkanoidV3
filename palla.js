// palla.js
class Palla {
  constructor(appConfig, campo, x, y, velocita, angle, onScore = null) {
    this.appConfig = appConfig;
    this.campo = campo;
    this.radius = appConfig.dimensionePalla;
    this.x = x;
    this.y = y;
    this.velocita = velocita;
    this.angle = angle;
    this.vx = velocita * Math.cos(angle);
    this.vy = -velocita * Math.sin(angle);
    this.isActive = true;
    this.onScore = onScore; // callback per aggiornare il punteggio
  }
  update() {
    if (!this.isActive) return;
    this.x += this.vx;
    this.y += this.vy;
    // Collisione con pareti
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx *= -1;
    }
    if (this.x + this.radius > this.campo.width) {
      this.x = this.campo.width - this.radius;
      this.vx *= -1;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy *= -1;
    }
    // Collisione con mattoncini
    if (this.campo.mattoncini) {
      const nFile = this.campo.mattoncini.length;
      outer: for (let r = 0; r < nFile; r++) {
        for (let c = 0; c < this.campo.mattoncini[r].length; c++) {
          const m = this.campo.mattoncini[r][c];
          if (!m.presente) continue;
          // Controllo collisione rettangolo/circonferenza
          const closestX = Math.max(m.x, Math.min(this.x, m.x + m.width));
          const closestY = Math.max(m.y, Math.min(this.y, m.y + m.height));
          const dx = this.x - closestX;
          const dy = this.y - closestY;
          if ((dx * dx + dy * dy) < this.radius * this.radius) {
            // Collisione!
            m.distruggi();
            // Calcola punteggio in base alla fila (la più vicina alla racchetta vale 1 punto)
            let punti = r + 1;
            if (typeof this.onScore === 'function') {
              this.onScore(punti);
            }
            // Rimbalzo: inverti direzione verticale
            this.vy *= -1;
            break outer;
          }
        }
      }
    }
    // Collisione con racchetta
    if (this.campo.racchetta && this.campo.racchetta.isVisible) {
      const r = this.campo.racchetta;
      if (
        this.y + this.radius >= r.y &&
        this.x + this.radius >= r.x &&
        this.x - this.radius <= r.x + r.width &&
        this.y + this.radius <= r.y + r.height
      ) {
        this.y = r.y - this.radius;
        this.vy *= -1;
        // Cambia angolo in base al punto di impatto
        let impatto = (this.x - (r.x + r.width / 2)) / (r.width / 2);
        this.vx = this.velocita * impatto;
      }
    }
    // Esce dal campo
    if (this.y - this.radius > this.campo.height) {
      this.isActive = false;
    }
  }
  draw(ctx) {
    if (!this.isActive) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.appConfig.campodigiocoForeground;
    ctx.fill();
    ctx.closePath();
  }
}
export { Palla };
