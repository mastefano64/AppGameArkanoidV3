// header.js
class Header {
  constructor(appConfig, eventHelper) {
    this.appConfig = appConfig;
    this.eventHelper = eventHelper;
    this.root = document.getElementById('header');
    this.score = 0;
    this.state = 'Fermo';
    this._render();
  }
  setScore(score) {
    this.score = score;
    this._update();
  }
  setState(state) {
    this.state = state;
    this._update();
  }
  _render() {
    this.root.innerHTML = `
      <span id="score-label">Punteggio: ${this.score}</span>
      <span id="state-label">Gioca</span>
      <button id="settings-btn">Setting</button>
    `;
    this.settingsBtn = document.getElementById('settings-btn');
    this.settingsBtn.onclick = () => {
      if (this.state === 'Fermo') this.eventHelper.raise('openSettings');
    };
    this._update();
  }
  _update() {
    document.getElementById('score-label').textContent = `Punteggio: ${this.score}`;
    document.getElementById('state-label').textContent =
      this.state === 'Fermo' ? 'Gioca' : (this.state === 'GameOver' ? 'Game Over!' : '');
    this.settingsBtn.disabled = this.state !== 'Fermo';
  }
  dispose() {
    this.settingsBtn.onclick = null;
    this.root.innerHTML = '';
  }
}
export { Header };
