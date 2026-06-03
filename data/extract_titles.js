// extract_titles.js
const fs = require('fs');

// Charge les données JSON
const data = JSON.parse(fs.readFileSync('api.json', 'utf8'));

// Crée un dictionnaire index → titre
const videoTitles = data.items.reduce((obj, item, idx) => {
  obj[idx + 1] = item.snippet.title;
  return obj;
}, {});

// Affiche ce dictionnaire dans la console
console.log(JSON.stringify(videoTitles, null, 2));
