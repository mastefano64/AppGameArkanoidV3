// utils.js
// Funzioni di utilità generiche
const Utils = {
  clamp: (val, min, max) => Math.max(min, Math.min(max, val)),
  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};
export { Utils };
