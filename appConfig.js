// Configurazione principale dell'applicazione
const appConfig = {
  headerHeight: "10%",
  campodigiocoHeight: "75%",
  footerHeight: "15%",
  headerBackground: "blue",
  headerForeground: "white",
  campodigiocoBackground: "blue",
  campodigiocoForeground: "white",
  footerBackground: "blue",
  footerForeground: "white",
  racchettaWidth: "20%",
  racchettaHeight: "20px",
  racchettaBackground: "white",
  numeroPalleMinimo: 1,
  numeroPalleMassimo: 10,
  numeroPalleDefault: 3,
  dimensionePalla: 8,
  velocitaPalleMinimo: 1,
  velocitaPalleMassimo: 10,
  velocitaPalleDefault: 5,
  buttonBackground: "blue",
  buttonForeground: "white",
  lableBackground: "blue",
  lableForeground: "white",
  // Proprietà mattoncini
  fileMatttoncini: 6, // numero di file di mattoncini
  colonneMatttoncini: 30, // numero di colonne di mattoncini
  margineFileMatttoncini: 0.1, // margine superiore (percentuale campo da gioco)
  margineMatttoncini: 2, // margine tra mattoncini (px)
  coloreMatttoncini: ["red", "orange", "yellow", "green", "magenta", "purple"], // colori per ogni fila
  mattonciniHeight: "24" // altezza mattoncini in pixel
  , splashWidth: 800 // larghezza splash screen in px (default)
  , splashHeight: 460 // altezza splash screen in px (default)
  , splashBg: "#102040" // colore di sfondo splash screen
  , splashBtnBg: "#1976d2" // colore bottone chiudi
  , splashBtnFg: "#fff" // colore testo bottone chiudi
  , splashBtnHoverBg: "#1565c0" // colore hover bottone chiudi
  , splashBackdrop: "rgba(10,20,40,0.65)" // colore backdrop splash
};
window.appConfig = appConfig;