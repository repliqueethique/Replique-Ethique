// BLOC JS 0 : Dictionnaire
const liensVideos = {
  1: "https://www.youtube.com/watch?v=og5t19FOPPg",
  2: "https://www.youtube.com/watch?v=LwXi0NJcclM",
  3: "https://www.youtube.com/watch?v=KLNRU6aIdDA",
  4: "https://www.youtube.com/watch?v=UsT1eu2_0rg",
  5: "https://www.youtube.com/watch?v=BJBzXEnHZek",
  6: "https://www.youtube.com/watch?v=L-SetpNLt0M",
  7: "https://www.youtube.com/watch?v=zNNnnd5lgrY",
  8: "https://www.youtube.com/watch?v=PfBYVcmnaJo",
  9: "https://www.youtube.com/watch?v=7-a2JZ_fK9I",
  10: "https://www.youtube.com/watch?v=5TlbGmen-XE",
  11: "https://www.youtube.com/watch?v=K2EKzdF2g3U",
  12: "https://www.youtube.com/watch?v=oNwgrTTCzug",
  13: "https://www.youtube.com/watch?v=D_c8a06xhuM",
  14: "https://www.youtube.com/watch?v=wgm_n6zM0Hs",
  15: "https://www.youtube.com/watch?v=6qMW-Yu0B-Q",
  16: "https://www.youtube.com/watch?v=pWoHoljOtIU",
  17: "https://www.youtube.com/watch?v=qav2ZYPMtrM",
  18: "https://www.youtube.com/watch?v=6fqI9NQfPjc",
  19: "https://www.youtube.com/watch?v=kAinP118OL0",
  20: "https://www.youtube.com/watch?v=rSr0AinDXIc",
  21: "https://www.youtube.com/watch?v=Tbqr4MEe6Bk",
  22: "https://www.youtube.com/watch?v=wYUoldCXYvU",
  23: "https://www.youtube.com/watch?v=JMw_qQGqc9s",
  24: "https://www.youtube.com/watch?v=5k-eN2k4Q_I",
  25: "https://www.youtube.com/watch?v=WleLbHXPvQc",
  26: "https://www.youtube.com/watch?v=tQVxybyHBww",
  27: "https://www.youtube.com/watch?v=ArVu9q7fgVE",
  28: "https://www.youtube.com/watch?v=8XR4O1_2cqE",
  29: "https://www.youtube.com/watch?v=onN8gueWQRo",
  30: "https://www.youtube.com/watch?v=WR7XKm2-bdY",
  31: "https://www.youtube.com/watch?v=PHvbuIRC6Mc",
  32: "https://www.youtube.com/watch?v=xAlGQdmMbBY",
  33: "https://www.youtube.com/watch?v=8qSfbdR8TGk",
  34: "https://www.youtube.com/watch?v=jB7zN2Ab3tc",
  35: "https://www.youtube.com/watch?v=vzG6P6KZ7AI",
  36: "https://www.youtube.com/watch?v=7Qt-7641py8",
  37: "https://www.youtube.com/watch?v=EShuNWbiS-8",
  38: "https://www.youtube.com/watch?v=wS7bZQ64-7Y",
  39: "https://www.youtube.com/watch?v=K-vb00Jv6nk",
  40: "https://www.youtube.com/watch?v=GrxrWg5vX40",
  41: "https://www.youtube.com/watch?v=D7EAQ1dS4pI",
  42: "https://www.youtube.com/watch?v=ncKXxADuplQ",
  43: "https://www.youtube.com/watch?v=RVHxWGErbK4",
  44: "https://www.youtube.com/watch?v=7pXVRtwUSHc",
  45: "https://www.youtube.com/watch?v=NBnFklfVLeU",
  46: "https://www.youtube.com/watch?v=90DZ1aELDIQ",
  47: "https://www.youtube.com/watch?v=2AhzWbzz-rk",
  48: "https://www.youtube.com/watch?v=9yUD_3xIQEk",
  49: "https://www.youtube.com/watch?v=IetpWPUzHhs",
  50: "https://www.youtube.com/watch?v=ohzEAmPJ5os"
};


// BLOC JS 1 : Animation de lancement
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const accueil = document.getElementById('accueil');
  const logoFixe = document.getElementById('logo-fixe');
  const searchBar = document.querySelector('.search-bar');
  const loupeButton = document.querySelector('.search-button');
  const menuBtns = document.querySelectorAll('.menu-buttons button');
  const footerBar = document.querySelector('.footer-bar');
  const footerIcons = document.querySelectorAll('.footer-bar a');
  const siteLink = document.querySelector('.site-link');

  setTimeout(() => {
    splash.style.display = 'none';
    accueil.classList.remove('hidden');
    logoFixe.classList.remove('transition-ready');
    searchBar.classList.remove('transition-ready');
    searchBar.classList.add('pop-smooth');

    if (loupeButton) {
      setTimeout(() => {
        loupeButton.classList.remove('transition-ready');
        loupeButton.classList.add('pop-smooth');
      }, 400);
    }

    footerBar.classList.remove('transition-ready');
    footerIcons.forEach((icon, i) => {
      const img = icon.querySelector('img');
      setTimeout(() => {
        img.classList.remove('transition-ready');
        img.classList.add('pop-smooth');
      }, 300 + i * 100);
    });

    menuBtns.forEach((btn, i) => {
      setTimeout(() => {
        btn.classList.remove('transition-ready');
        btn.classList.add('pop-smooth');
      }, 600 + i * 150);
    });

    siteLink.classList.remove('transition-ready');
    siteLink.classList.add('fade-in-up');
  }, 5000);
});

// BLOC JS 2 : Navigation vers la page "mots-clés" + fond dynamique
const fondAccueil = document.querySelector('.fond-accueil');
const fondMotsCles = document.querySelector('.fond-mots-cles');
const pageMotsCles = document.getElementById('page-mots-cles');
const boutonMotsCles = document.getElementById('btn-mots-cles');
const pageAccueil = document.getElementById('accueil');
const boutonRetourAccueil = document.getElementById('retour-accueil');

function afficherMotsCles() {
  pageAccueil.classList.add('shifted');
  pageMotsCles.classList.add('active');
  fondAccueil.classList.remove('visible');
  fondMotsCles.classList.add('visible');
}

function retourAccueilDepuisMotsCles() {
  pageAccueil.classList.remove('shifted');
  pageMotsCles.classList.remove('active');
  fondMotsCles.classList.remove('visible');
  fondAccueil.classList.add('visible');
}

if (boutonMotsCles) {
  boutonMotsCles.addEventListener('click', afficherMotsCles);
}
if (boutonRetourAccueil) {
  boutonRetourAccueil.addEventListener('click', retourAccueilDepuisMotsCles);
}

// BLOC JS 3 : Déplier/Replier les catégories
const boutonsCategories = document.querySelectorAll('.bouton-categorie');
boutonsCategories.forEach(bouton => {
  bouton.addEventListener('click', () => {
    const tags = bouton.nextElementSibling;
    tags.classList.toggle('hidden');
  });
});

// BLOC JS 4 : Navigation vers la page "liste"
const boutonListe = document.querySelector('.menu-buttons button:nth-child(2)');
const pageListe = document.getElementById('page-liste');
const retourAccueilListe = document.getElementById('retour-accueil-liste');
const conteneurVignettes = document.getElementById('conteneur-vignettes');

function afficherListe() {
  console.log('→ appel afficherListe()');
  // déplacements visuels
  pageAccueil.classList.add('shifted-left');
  // visibilité page "liste"
  pageListe.classList.add('active');
  pageListe.style.left = '0';
  pageListe.style.zIndex = '8';
  // génération des vignettes
  conteneurVignettes.innerHTML = '';
  for (let i = 1; i <= 50; i++) {
    const img = document.createElement('img');
    img.src = `images/vignettes/VE2M ${i} vignette YT.jpg`;
    img.alt = `VE2M ${i}`;
    img.className = 'vignette';
    img.dataset.video = i;  // 🆕 IMPORTANT pour l’identification
    conteneurVignettes.appendChild(img);
  }

  activerInteractionsVignettes();
}

function retourAccueilDepuisListe() {
  console.log('→ appel retourAccueilDepuisListe()');
  pageAccueil.classList.remove('shifted-left');
  pageListe.classList.remove('active');
  pageListe.style.left = '100%';
  pageListe.style.zIndex = '';
}

if (boutonListe) {
  boutonListe.addEventListener('click', afficherListe);
}
if (retourAccueilListe) {
  retourAccueilListe.addEventListener('click', retourAccueilDepuisListe);
}


// BLOC JS 5 : Génération des 50 vignettes à chaque fois
function genererVignettes() {
  const conteneur = document.getElementById('conteneur-vignettes');
  if (!conteneur) return;

  conteneur.innerHTML = ''; // ← Réinitialise
  for (let i = 1; i <= 50; i++) {
    const img = document.createElement('img');
    img.src = `images/vignettes/VE2M ${i} vignette YT.jpg`;
    img.alt = `VE2M ${i}`;
    img.className = 'vignette';
    conteneur.appendChild(img);
  }
}

// BLOC JS 6 : Interactions avec les vignettes
function activerInteractionsVignettes() {
  const conteneur = document.getElementById('conteneur-vignettes');
  if (!conteneur) return;

  const vignettes = conteneur.querySelectorAll('.vignette');
  vignettes.forEach(vignette => {
    const numero = parseInt(vignette.dataset.video, 10);

    // Copie du lien au clic simple
    vignette.addEventListener('click', () => {
      if (liensVideos[numero]) {
        navigator.clipboard.writeText(liensVideos[numero])
          .then(() => console.log("Lien copié :", liensVideos[numero]));
      }
    });

    // Double-clic : ouvrir page vidéo
    vignette.addEventListener('dblclick', () => {
      afficherPageVideo(numero);
    });
  });
}

function afficherPageVideo(numero) {
  const videoPage = document.getElementById('page-video');
  if (!videoPage) return;

  videoPage.innerHTML = ''; // Reset

  const container = document.createElement('div');
  container.classList.add('contenu-page-video');

  const vignette = document.createElement('img');
  vignette.src = `images/vignettes/VE2M ${numero} vignette YT.jpg`;
  vignette.className = 'vignette-video';
  vignette.addEventListener('click', () => {
    if (liensVideos[numero]) {
      const iframe = document.createElement('iframe');
      iframe.src = liensVideos[numero].replace("watch?v=", "embed/") + "?autoplay=1";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.className = 'lecteur-youtube';
      vignette.replaceWith(iframe);
    }
  });

  const etoile = document.createElement('img');
  etoile.src = "images/icones/étoile vide.png";
  etoile.className = 'etoile-favori';
  etoile.addEventListener('click', () => {
    etoile.src = etoile.src.includes('vide') ?
      "images/icones/étoile.png" :
      "images/icones/étoile vide.png";
  });

  const titre = document.createElement('h2');
  titre.className = 'titre-video';
  titre.textContent = titresVideos[numero] || `Vidéo ${numero}`;

  const script = document.createElement('p');
  script.className = 'script-video';
  script.textContent = scriptsVideos[numero] || "Script en cours d'intégration.";

  container.appendChild(vignette);
  container.appendChild(etoile);
  container.appendChild(titre);
  container.appendChild(script);

  videoPage.appendChild(container);
  videoPage.classList.add('active');
  videoPage.style.zIndex = '10';
  videoPage.style.display = 'block';
}


// BLOC JS 7 : Navigation pour essentiel et lexique (corrigé)
const boutonEssentiel = document.getElementById('btn-essentiel');
const boutonLexique = document.getElementById('btn-lexique');
const pageEssentiel = document.getElementById('page-essentiel');
const pageLexique = document.getElementById('page-lexique');
const fondEssentiel = document.querySelector('.fond-essentiel');
const fondLexique = document.querySelector('.fond-lexique');
const boutonRetourEssentiel = document.getElementById('retour-accueil-essentiel');
const boutonRetourLexique = document.getElementById('retour-accueil-lexique');
const boutonRetourListe = document.getElementById('retour-accueil-liste');

// Ajout : Référence aux autres fonds pour désactivation globale
const fonds = document.querySelectorAll('.fond');

if (boutonEssentiel) {
  boutonEssentiel.addEventListener('click', () => {
    pageAccueil.classList.add('shifted-left');
    pageEssentiel.classList.add('active');
    fonds.forEach(f => f.classList.remove('visible'));
    fondEssentiel.classList.add('visible');
    pageEssentiel.style.left = '0';
  });
}

if (boutonLexique) {
  boutonLexique.addEventListener('click', () => {
    pageAccueil.classList.add('shifted-left');
    pageLexique.classList.add('active');
    fonds.forEach(f => f.classList.remove('visible'));
    fondLexique.classList.add('visible');
    pageLexique.style.left = '0';
  });
}

if (boutonRetourEssentiel) {
  boutonRetourEssentiel.addEventListener('click', () => {
    pageAccueil.classList.remove('shifted-left');
    pageEssentiel.classList.remove('active');
    fonds.forEach(f => f.classList.remove('visible'));
    fondAccueil.classList.add('visible');
    pageEssentiel.style.left = '100%';
  });
}

if (boutonRetourLexique) {
  boutonRetourLexique.addEventListener('click', () => {
    pageAccueil.classList.remove('shifted-left');
    pageLexique.classList.remove('active');
    fonds.forEach(f => f.classList.remove('visible'));
    fondAccueil.classList.add('visible');
    pageLexique.style.left = '100%';
  });
}

if (boutonRetourListe) {
  boutonRetourListe.addEventListener('click', () => {
    pageAccueil.classList.remove('shifted-left');
    pageListe.classList.remove('active');
    fonds.forEach(f => f.classList.remove('visible'));
    fondAccueil.classList.add('visible');
    pageListe.style.left = '100%';
  });
}

// BLOC JS 8 : Génération des vignettes essentielles
const contenuEssentiel = document.querySelector('.contenu-essentiel');
const videosEssentielles = [20, 30, 40, 50, 7, 10, 11, 35, 36, 41, 44, 45, 46];

if (contenuEssentiel) {
  contenuEssentiel.innerHTML = '';
  videosEssentielles.forEach(num => {
    const img = document.createElement('img');
    img.src = `images/vignettes/VE2M ${num} vignette YT.jpg`;
    img.alt = `VE2M ${num}`;
    img.className = 'vignette vignette-essentiel';
    img.dataset.video = num; // 🆕 Attribut pour identification
    img.addEventListener('dblclick', () => ouvrirPageVideo(num)); // 🆕 Interaction
    contenuEssentiel.appendChild(img);
  });
}


// BLOC JS 9 : Contenu des mots-clés
const contenuMotsCles = document.querySelector('.contenu-mots-cles');
if (contenuMotsCles) {
  contenuMotsCles.innerHTML = `
    <div class="categorie">
      <button class="bouton-categorie">Éthique</button>
      <div class="tags">
        <button class="tag">justice</button>
        <button class="tag">droits</button>
        <button class="tag">égalité</button>
      </div>
    </div>
    <div class="categorie">
      <button class="bouton-categorie">Écologie</button>
      <div class="tags">
        <button class="tag">animaux</button>
        <button class="tag">environnement</button>
        <button class="tag">climat</button>
      </div>
    </div>
    <div class="categorie">
      <button class="bouton-categorie">Société</button>
      <div class="tags">
        <button class="tag">féminisme</button>
        <button class="tag">discrimination</button>
        <button class="tag">minorités</button>
      </div>
    </div>
  `;

  // Masquer tous les blocs de tags par défaut (sans classe .open)
  const tagsContainers = contenuMotsCles.querySelectorAll('.tags');
  tagsContainers.forEach(tags => tags.classList.remove('open'));

  // Interactions dynamiques avec animation immédiate
  const boutonsCategoriesDynamiques = contenuMotsCles.querySelectorAll('.bouton-categorie');
  boutonsCategoriesDynamiques.forEach(bouton => {
    bouton.addEventListener('click', () => {
      const tags = bouton.nextElementSibling;
      tags.classList.toggle('open');
    });
  });
}

// BLOC JS 10 : Définition lexique (avec arrondi dynamique)
const boutonsLexique = document.querySelectorAll('.bouton-mot');
boutonsLexique.forEach(bouton => {
  bouton.addEventListener('click', () => {
    const def = bouton.nextElementSibling;
    def.classList.toggle('show');
    bouton.classList.toggle('active');
  });
});

// BLOC JS 11 : Onglet favoris
const boutonFavoris = document.querySelector('#btn-favoris') || document.querySelector('.menu-buttons button:nth-child(5)');
const ongletFavoris = document.getElementById('favoris-panel');
const fermerFavoris = document.getElementById('fermer-favoris');

if (boutonFavoris && ongletFavoris && fermerFavoris) {
  boutonFavoris.addEventListener('click', () => {
    ongletFavoris.classList.add('visible');
  });

  fermerFavoris.addEventListener('click', () => {
    ongletFavoris.classList.remove('visible');
  });

  // Swipe vers le haut pour ouvrir
  let startY = 0;
  window.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
  });

  window.addEventListener('touchend', e => {
    const endY = e.changedTouches[0].clientY;
    if (startY - endY > 100) {
      ongletFavoris.classList.add('visible');
    }
  });
}

// BLOC JS 12 : Onglet info
document.addEventListener('DOMContentLoaded', () => {
  const btnInfo = document.getElementById('btn-info');
  const panel = document.getElementById('info-panel');
  const btnHome = document.getElementById('btn-info-home');
  const btnSettings = document.getElementById('btn-info-settings');
  const slideToComment = document.getElementById('slide-to-comment');
  const slideToBienvenue = document.getElementById('slide-to-bienvenue');

  btnInfo.addEventListener('click', () => {
    panel.classList.add('visible');
  });

  btnHome.addEventListener('click', () => {
    panel.classList.remove('visible');
  });

  slideToComment.addEventListener('click', () => {
    document.getElementById('contenu-bienvenue').style.display = 'none';
    document.getElementById('contenu-comment').style.display = 'block';
  });

  slideToBienvenue.addEventListener('click', () => {
    document.getElementById('contenu-comment').style.display = 'none';
    document.getElementById('contenu-bienvenue').style.display = 'block';
  });

  btnSettings.addEventListener('click', () => {
    // OUVRE onglet paramètres (à ajouter)
    console.log('Onglet paramètres à venir');
  });
});

// BLOC JS 13 : Page video
function ouvrirPageVideo(numero) {
  // Supprimer toute page vidéo existante
  const anciennePage = document.getElementById('page-video');
  if (anciennePage) anciennePage.remove();

  // Création du conteneur
  const page = document.createElement('div');
  page.id = 'page-video';
  page.className = 'page';
  page.style.background = '#fff';
  page.style.zIndex = 9999;
  page.style.position = 'fixed';
  page.style.top = '0';
  page.style.left = '0';
  page.style.width = '100%';
  page.style.height = '100vh';
  page.style.overflowY = 'auto';
  page.style.padding = '20px';
  page.style.boxSizing = 'border-box';

  const url = liensVideos[numero];
  const image = `images/vignettes/VE2M ${numero} vignette YT.jpg`;

  page.innerHTML = `
    <div style="position:relative;">
      <img src="${image}" alt="Vignette vidéo" class="vignette-video" style="width:100%; border-radius:10px; cursor:pointer;">
      <img src="images/etoile vide.png" alt="Favoris" class="etoile-toggle" style="position:absolute; top:15px; left:15px; width:40px; cursor:pointer;">
    </div>

    <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:8px;">
      <span class="tag">éthique</span>
      <span class="tag">justice</span>
    </div>
    <h2 style="font-family:'Intro'; color:#000; text-align:left;">Titre de la vidéo ${numero}</h2>
    <p style="font-family:'Graphie'; color:#000; text-align:left; line-height:1.6;">
      Ceci est un exemple de contenu pour la vidéo ${numero}. Le script complet pourra être chargé dynamiquement plus tard.
    </p>
    <div class="triangle-retour gauche" id="retour-page-video"></div>
  `;

  document.body.appendChild(page);
  const vignette = page.querySelector('.vignette-video');
  vignette.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = url.replace("watch?v=", "embed/") + "?autoplay=1";
    iframe.style.width = '100%';
    iframe.style.height = '250px';
    iframe.style.borderRadius = '10px';
    iframe.style.border = 'none';
    vignette.replaceWith(iframe);
  });


  document.getElementById('retour-page-video').addEventListener('click', () => {
    page.remove();
  });

  // Comportement étoile toggle
  const etoile = page.querySelector('.etoile-toggle');
  let estFavori = false;

  etoile.addEventListener('click', () => {
    estFavori = !estFavori;
    etoile.src = estFavori ? 'images/etoile.png' : 'images/etoile vide.png';
  });
}
