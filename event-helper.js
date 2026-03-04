// event-helper.js
// Gestione eventi custom tra classi
class EventHelper {
  constructor() {
    this.events = {};
  }
  add(event, handler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
  }
  remove(event, handler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(h => h !== handler);
  }
  raise(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(handler => handler(...args));
  }
  dispose() {
    this.events = {};
  }
}
export { EventHelper };
