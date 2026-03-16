import { Header } from './header.js';
import { Footer } from './footer.js';
import { CampoDiGioco } from './campodigioco.js';
import { Racchetta } from './racchetta.js';
import { SettingsPopup } from './settings-popup.js';
import { EventHelper } from './event-helper.js';
import { Palla } from './palla.js';
// app.js
class App {
  constructor(appConfig) {
    this.appConfig = appConfig;
    this.eventHelper = new EventHelper();
    this.isRunning = false; // false = "Fermo", true = "In corso"/"In pausa"
    this.state = 'Fermo';
    this.score = 0;
    this.nPalle = appConfig.numeroPalleDefault;
    this.velocitaPalle = appConfig.velocitaPalleDefault;
    this.palle = [];
    // Splash Screen
    this.splashBackdrop = document.getElementById('splash-backdrop');
    this.splashScreen = document.getElementById('splash-screen');
    this.splashCloseBtn = document.getElementById('splash-close-btn');
    this._initSplashScreen();
    this._initComponents();
    this._bindEvents();
  }

  _initSplashScreen() {
    // Applica dimensioni e colori da appConfig
    if (this.splashScreen) {
      this.splashScreen.style.minWidth = this.appConfig.splashWidth + 'px';
      this.splashScreen.style.minHeight = this.appConfig.splashHeight + 'px';
      this.splashScreen.style.background = this.appConfig.splashBg;
    }
    if (this.splashBackdrop) {
      this.splashBackdrop.style.background = this.appConfig.splashBackdrop;
    }
    if (this.splashCloseBtn) {
      this.splashCloseBtn.style.background = this.appConfig.splashBtnBg;
      this.splashCloseBtn.style.color = this.appConfig.splashBtnFg;
      this.splashCloseBtn.onmouseover = () => {
        this.splashCloseBtn.style.background = this.appConfig.splashBtnHoverBg;
      };
      this.splashCloseBtn.onmouseout = () => {
        this.splashCloseBtn.style.background = this.appConfig.splashBtnBg;
      };
      this.splashCloseBtn.onclick = () => this.hideSplashScreen();
    }
    // Mostra Splash Screen all'avvio
    this.showSplashScreen();
  }

  showSplashScreen() {
    if (this.splashBackdrop) this.splashBackdrop.style.display = 'block';
    if (this.splashScreen) this.splashScreen.style.display = 'flex';
    // Blocca tab focus sugli altri bottoni
    this._disableAllButtonsExceptSplash();
  }

  hideSplashScreen() {
    if (this.splashBackdrop) this.splashBackdrop.style.display = 'none';
    if (this.splashScreen) this.splashScreen.style.display = 'none';
    this._enableAllButtons();
  }

  _disableAllButtonsExceptSplash() {
    // Disabilita tutti i bottoni tranne quello dello splash
    this._disabledButtons = [];
    const allBtns = document.querySelectorAll('button');
    allBtns.forEach(btn => {
      if (btn.id !== 'splash-close-btn' && !btn.disabled) {
        btn.disabled = true;
        this._disabledButtons.push(btn);
      }
    });
  }

  _enableAllButtons() {
    // Riabilita i bottoni disabilitati
    if (this._disabledButtons) {
      this._disabledButtons.forEach(btn => btn.disabled = false);
      this._disabledButtons = [];
    }
  }
  _initComponents() {
    this.header = new Header(this.appConfig, this.eventHelper);
    this.footer = new Footer(this.appConfig, this.eventHelper);
    this.campo = new CampoDiGioco(this.appConfig, this.eventHelper);
    this.racchetta = new Racchetta(this.appConfig, this.eventHelper, this.campo);
    this.campo.setRacchetta(this.racchetta);
    this.settingsPopup = new SettingsPopup(this.appConfig, this.eventHelper);
    this._updateUI();
  }
  _bindEvents() {
    this.eventHelper.add('openSettings', () => {
      this.settingsPopup.setValues(this.nPalle, this.velocitaPalle);
      this.settingsPopup.show();
    });
    this.eventHelper.add('settingsConferma', (nPalle, velocita) => {
      this.nPalle = nPalle;
      this.velocitaPalle = velocita;
      this.footer.setNumeroPalle(nPalle);
    });
    this.eventHelper.add('startGame', () => this._startGame());
    this.eventHelper.add('pauseResume', () => this._togglePause());
    this.eventHelper.add('stopGame', () => this._stopGame());
    this.eventHelper.add('racchettaLeft', () => this.racchetta.moveLeft());
    this.eventHelper.add('racchettaRight', () => this.racchetta.moveRight());
  }
  _startGame() {
    if (typeof this.campo.ricreaMattoncini === 'function') {
      this.campo.ricreaMattoncini(); // Ricrea i mattoncini solo all'avvio di una nuova partita
      // Timeout per assicurare che il canvas sia pronto prima del rendering
      setTimeout(() => this.campo._draw(), 50);
    }
    this.isRunning = true;
    this.state = 'In corso';
    this.score = 0;
    this.header.setScore(this.score);
    this.header.setState('In corso');
    this.footer.setState('In corso');
    this.racchetta.show();
    this.campo.show();
    // Timeout per far partire le palle dopo l'animazione dei mattoncini
    setTimeout(() => {
      this._spawnPalle();
      this._gameLoop();
    }, 1200); // 1.2 secondi di attesa
  }
  _togglePause() {
    if (this.state === 'In corso') {
      this.state = 'In pausa';
      this.header.setState('In pausa');
      this.footer.setState('In pausa');
    } else if (this.state === 'In pausa') {
      this.state = 'In corso';
      this.header.setState('In corso');
      this.footer.setState('In corso');
      this._gameLoop();
    }
  }
  _stopGame() {
    this.isRunning = false;
    this.state = 'Fermo';
    this.header.setState('Fermo');
    this.footer.setState('Fermo');
    this.racchetta.hide();
    // this.campo.hide(); // Non nascondere il campo, lascia i mattoncini visibili
    this.palle = [];
    this.campo.setPalle([]);
    this.campo._draw(); // Aggiorna la visualizzazione
  }
  _spawnPalle() {
    this.palle = [];
    const onScore = (punti) => {
      this.score += punti;
      this.header.setScore(this.score);
    };
    for (let i = 0; i < this.nPalle; i++) {
      let angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      let p = new Palla(this.appConfig, this.campo, this.campo.width / 2, this.campo.height / 2, this.velocitaPalle, angle, onScore);
      this.palle.push(p);
    }
    this.campo.setPalle(this.palle);
  }
  _gameLoop() {
    if (!this.isRunning || this.state !== 'In corso') return;
    this.palle.forEach(p => p.update());
    this.palle = this.palle.filter(p => p.isActive);
    this.campo.setPalle(this.palle);
    this.campo._draw();
    if (this.palle.length === 0) {
      this._gameOver();
      return;
    }
    requestAnimationFrame(() => this._gameLoop());
  }
  _gameOver() {
    this.isRunning = false;
    this.state = 'Fermo';
    this.header.setState('Fermo');
    this.footer.setState('Fermo');
    // Mostra "Game Over!" nella label centrale
    const stateLabel = document.getElementById('state-label');
    if (stateLabel) stateLabel.textContent = 'Game Over!';
    this.racchetta.hide();
    // NON nascondo il campo da gioco, così i mattoncini rimangono visibili
    this.palle = [];
    this.campo.setPalle([]);
    this.campo._draw(); // Aggiorna la visualizzazione
  }
  _updateUI() {
    this.header.setScore(this.score);
    this.header.setState(this.state);
    this.footer.setState(this.state);
    this.footer.setNumeroPalle(this.nPalle);
    this.racchetta.hide();
    this.campo.hide();
  }
  bootstrapApp() {
    this._updateUI();
  }
  dispose() {
    this.header.dispose();
    this.footer.dispose();
    this.campo.dispose();
    this.racchetta.dispose();
    this.settingsPopup.dispose();
  }
}

// Istanzia l'app solo dopo che la pagina è pronta
window.addEventListener('DOMContentLoaded', () => {
  // appConfig deve essere globale (definito in appConfig.js)
  if (typeof appConfig !== 'undefined') {
    window.appArkanoid = new App(appConfig);
  } else {
    console.error('appConfig non trovato!');
  }
});
