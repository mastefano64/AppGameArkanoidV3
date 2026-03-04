// footer.js
class Footer {
  constructor(appConfig, eventHelper) {
    this.appConfig = appConfig;
    this.eventHelper = eventHelper;
    this.root = document.getElementById('footer');
    this.state = 'Fermo';
    this.nPalle = appConfig.numeroPalleDefault;
    this._render();
  }
  setState(state) {
    this.state = state;
    this._update();
  }
  setNumeroPalle(n) {
    this.nPalle = n;
    this._update();
  }
  _render() {
    this.root.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
        <button id="btn-left">⟵</button>
        <button id="btn-start">Start</button>
        <button id="btn-pause">Pause/Resume</button>
        <button id="btn-stop">Stop</button>
        <button id="btn-right">⟶</button>
      </div>
      <div class="label-palle">Stai giocando con <span id="n-palle">${this.nPalle}</span> palla/e</div>
    `;
    this.btnLeft = document.getElementById('btn-left');
    this.btnRight = document.getElementById('btn-right');
    this.btnStart = document.getElementById('btn-start');
    this.btnPause = document.getElementById('btn-pause');
    this.btnStop = document.getElementById('btn-stop');
    this.btnLeft.onclick = () => this.eventHelper.raise('racchettaLeft');
    this.btnRight.onclick = () => this.eventHelper.raise('racchettaRight');
    this.btnStart.onclick = () => this.eventHelper.raise('startGame');
    this.btnPause.onclick = () => this.eventHelper.raise('pauseResume');
    this.btnStop.onclick = () => this.eventHelper.raise('stopGame');
    this._update();
  }
  _update() {
    this.btnStart.disabled = this.state !== 'Fermo';
    this.btnPause.disabled = this.state === 'Fermo';
    this.btnPause.textContent = this.state === 'In corso' ? 'Pause' : (this.state === 'In pausa' ? 'Resume' : 'Pause/Resume');
    this.btnStop.disabled = this.state === 'Fermo';
    document.getElementById('n-palle').textContent = this.nPalle;
  }
  dispose() {
    this.btnLeft.onclick = null;
    this.btnRight.onclick = null;
    this.btnStart.onclick = null;
    this.btnPause.onclick = null;
    this.btnStop.onclick = null;
    this.root.innerHTML = '';
  }
}
export { Footer };
