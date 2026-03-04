// racchetta.js
import { Utils } from './utils.js';
class Racchetta {
  constructor(appConfig, eventHelper, campo) {
    this.appConfig = appConfig;
    this.eventHelper = eventHelper;
    this.campo = campo;
    this.isVisible = false;
    this.width = this._parseWidth(appConfig.racchettaWidth, campo.width);
    this.height = parseInt(appConfig.racchettaHeight);
    this.x = (campo.width - this.width) / 2;
    this.y = campo.height - this.height - 10;
    this.speed = 24;
    this._bindEvents();
  }
  _parseWidth(val, total) {
    if (typeof val === 'string' && val.endsWith('%')) {
      return total * parseInt(val) / 100;
    }
    return parseInt(val);
  }
  show() {
    this.isVisible = true;
  }
  hide() {
    this.isVisible = false;
  }
  moveLeft() {
    this.x = Math.max(0, this.x - this.speed);
  }
  moveRight() {
    this.x = Math.min(this.campo.width - this.width, this.x + this.speed);
  }
  draw(ctx) {
    if (!this.isVisible) return;
    ctx.fillStyle = this.appConfig.racchettaBackground;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  _bindEvents() {
    this._onMouseMove = e => {
      const rect = this.campo.canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      this.x = Utils.clamp(mouseX - this.width / 2, 0, this.campo.width - this.width);
    };
    this.campo.canvas.addEventListener('mousemove', this._onMouseMove);
  }
  dispose() {
    this.campo.canvas.removeEventListener('mousemove', this._onMouseMove);
  }
}
export { Racchetta };
