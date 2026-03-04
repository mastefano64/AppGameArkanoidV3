// settings-popup.js
class SettingsPopup {
  constructor(appConfig, eventHelper) {
    this.appConfig = appConfig;
    this.eventHelper = eventHelper;
    this.root = document.getElementById('settings-popup');
    this.overlay = document.getElementById('popup-overlay');
    this.visible = false;
    this.selectedPalle = appConfig.numeroPalleDefault;
    this.selectedVelocita = appConfig.velocitaPalleDefault;
    this._render();
  }
  show() {
    this.visible = true;
    this.root.style.display = 'flex';
    if (this.overlay) this.overlay.style.display = 'block';
  }
  hide() {
    this.visible = false;
    this.root.style.display = 'none';
    if (this.overlay) this.overlay.style.display = 'none';
  }
  _render() {
    const palleOpts = Array.from({length: this.appConfig.numeroPalleMassimo - this.appConfig.numeroPalleMinimo + 1}, (_,i) => this.appConfig.numeroPalleMinimo + i)
      .map(n => `<option value="${n}">${n}</option>`).join('');
    const velOpts = Array.from({length: this.appConfig.velocitaPalleMassimo - this.appConfig.velocitaPalleMinimo + 1}, (_,i) => this.appConfig.velocitaPalleMinimo + i)
      .map(n => `<option value="${n}">${n}</option>`).join('');
    this.root.innerHTML = `
      <label>Numero palle:
        <select id="popup-npalle">${palleOpts}</select>
      </label>
      <label>Velocità palle:
        <select id="popup-velocita">${velOpts}</select>
      </label>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="popup-conferma">Conferma</button>
        <button id="popup-chiudi">Chiudi</button>
      </div>
    `;
    this.nPalleSel = document.getElementById('popup-npalle');
    this.velSel = document.getElementById('popup-velocita');
    this.nPalleSel.value = this.selectedPalle;
    this.velSel.value = this.selectedVelocita;
    document.getElementById('popup-conferma').onclick = () => {
      this.selectedPalle = parseInt(this.nPalleSel.value);
      this.selectedVelocita = parseInt(this.velSel.value);
      this.eventHelper.raise('settingsConferma', this.selectedPalle, this.selectedVelocita);
      this.hide();
    };
    document.getElementById('popup-chiudi').onclick = () => {
      this.hide();
    };
  }
  setValues(palle, velocita) {
    this.selectedPalle = palle;
    this.selectedVelocita = velocita;
    if (this.nPalleSel) this.nPalleSel.value = palle;
    if (this.velSel) this.velSel.value = velocita;
  }
  dispose() {
    this.root.innerHTML = '';
  }
}
export { SettingsPopup };
