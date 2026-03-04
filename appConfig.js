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
};
window.appConfig = appConfig;