// ============================================================
// BLOC 1 : UTILITAIRES GLOBAUX
// ============================================================

function estMobile() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function declencherEclat(x, y, couleur) {
  const couleurs = couleur ? [couleur] : ['#31bebd', '#00fffd', '#fce7ac', '#f37321', '#ffffff'];
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.className = 'particule';
    const angle = (i / 6) * 360;
    const distance = 30 + Math.random() * 30;
    const dx = Math.cos(angle * Math.PI / 180) * distance;
    const dy = Math.sin(angle * Math.PI / 180) * distance;
    const c = couleurs[Math.floor(Math.random() * couleurs.length)];
    p.style.cssText = `left:${x-4}px;top:${y-4}px;background:${c};--dx:${dx}px;--dy:${dy}px;width:${4+Math.random()*6}px;height:${4+Math.random()*6}px;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

function afficherToast(message, couleur, x, y) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed;
    left:${x !== undefined ? x+'px' : '50%'};
    top:${y !== undefined ? y+'px' : 'auto'};
    bottom:${y !== undefined ? 'auto' : '80px'};
    transform:${x !== undefined ? 'translate(-50%, -50%)' : 'translateX(-50%)'};
    color:${couleur||'#00feff'};
    font-family:'SF Sports Night', sans-serif;
    font-size:1.8em;
    -webkit-text-stroke: 3px #242422;
    paint-order: stroke fill;
    z-index:999999;
    pointer-events:none;
    animation: toastFlotte 1.2s ease-out forwards;
    white-space:nowrap;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1200);
}

function animerPop(img) {
  img.classList.remove('pop-clic');
  void img.offsetWidth;
  img.classList.add('pop-clic');
  setTimeout(() => img.classList.remove('pop-clic'), 300);
}

function animerSpin(img) {
  img.classList.remove('spin-pop');
  void img.offsetWidth;
  img.classList.add('spin-pop');
  setTimeout(() => img.classList.remove('spin-pop'), 300);
}

// ============================================================
// BLOC 2 : BARRES D'ACTION — GALERIE (desktop: bas / mobile: gauche)
// ============================================================

function creerBarreGalerie(key, estFavori, wrapper, onFavoriChange) {
  const barre = document.createElement('div');
  if (estMobile()) {
    barre.style.cssText = `position:absolute;left:0;top:0;bottom:0;width:100%;background:#242422;border-radius:10px;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly;transform:translateX(-100%);transition:transform 0.3s ease;z-index:2;`;
  } else {
    barre.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:50%;background:#242422;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly;border-radius:0 0 10px 10px;transition:transform 0.3s ease;transform:translateY(100%);z-index:2;`;
  }

  [
    { src:'icone-copier.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#00fffd');
      animerPop(e.currentTarget.querySelector('img'));
      const url=(window.liensVideos||{})[key]||'';
      const btn=e.currentTarget;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(()=>{
          btn.style.opacity='0.4';
          afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2);
          setTimeout(()=>btn.style.opacity='1',1500);
        }).catch(()=>afficherToast('Erreur copie','#f37321'));
      } else {
        const ta=document.createElement('textarea');
        ta.value=url; ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        try{ document.execCommand('copy'); afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2); }
        catch(err){ afficherToast('Erreur copie','#f37321'); }
        document.body.removeChild(ta);
      }
    }},
    { src:'icone-partager.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#fce7ac');
      animerPop(e.currentTarget.querySelector('img'));
      const url=(window.liensVideos||{})[key]||'';
      const t=(window.titresVideos||{})[key]||'';
      if(navigator.share){navigator.share({title:t,url});}
      else{navigator.clipboard.writeText(url).then(()=>afficherToast('Lien copié !','#fce7ac'));}
    }},
    { src:estFavori?'etoile.png':'etoile vide.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#f37321');
      animerSpin(e.currentTarget.querySelector('img'));
      let favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
      const estFav=favoris.includes(key);
      if(estFav){favoris=favoris.filter(f=>f!==key);}else{favoris.push(key);}
      localStorage.setItem('favoris',JSON.stringify(favoris));
      const ajout=favoris.includes(key);
      e.currentTarget.querySelector('img').src=`images/${ajout?'etoile':'etoile vide'}.png`;
      wrapper.style.outline=ajout?'3px solid #fce7ac':'none';
      wrapper.style.outlineOffset='-3px';
      if(onFavoriChange) onFavoriChange(ajout);
    }}
  ].forEach(({src,onClick})=>{
    const btn=document.createElement('button');
    btn.style.cssText='background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;height:100%;';
    const imgH = estMobile() ? '40%' : '65%';
    btn.innerHTML=`<img src="images/${src}" style="width:auto;height:${imgH};max-height:48px;min-height:16px;"/>`;
    btn.addEventListener('mouseenter',()=>btn.style.transform='scale(1.2)');
    btn.addEventListener('mouseleave',()=>btn.style.transform='scale(1)');
    btn.addEventListener('click',onClick);
    barre.appendChild(btn);
  });

  if(!estMobile()){
    wrapper.addEventListener('mouseenter',()=>{barre.style.transform='translateY(0)';wrapper.style.transform='scale(1.05)';});
    wrapper.addEventListener('mouseleave',()=>{barre.style.transform='translateY(100%)';wrapper.style.transform='scale(1)';});
  }
  return barre;
}

// ============================================================
// BLOC 3 : BARRES D'ACTION — LISTE (slide depuis la gauche)
// ============================================================

function creerBarreListe(key, estFavori, wrapper, largeur, onFavoriChange) {
  const barre = document.createElement('div');
  barre.style.cssText=`position:absolute;left:0;top:0;bottom:0;width:${largeur}px;background:#242422;border-radius:8px 0 0 8px;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly;transform:translateX(-100%);transition:transform 0.3s ease;z-index:3;`;

  [
    { src:'icone-copier.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#00fffd');
      animerPop(e.currentTarget.querySelector('img'));
      const url=(window.liensVideos||{})[key]||'';
      const btn=e.currentTarget;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(()=>{
          btn.style.opacity='0.4';
          afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2);
          setTimeout(()=>btn.style.opacity='1',1500);
        }).catch(()=>afficherToast('Erreur copie','#f37321'));
      } else {
        const ta=document.createElement('textarea');
        ta.value=url; ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        try{ document.execCommand('copy'); afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2); }
        catch(err){ afficherToast('Erreur copie','#f37321'); }
        document.body.removeChild(ta);
      }
    }},
    { src:'icone-partager.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#fce7ac');
      animerPop(e.currentTarget.querySelector('img'));
      const url=(window.liensVideos||{})[key]||'';
      const t=(window.titresVideos||{})[key]||'';
      if(navigator.share){navigator.share({title:t,url});}
      else{navigator.clipboard.writeText(url).then(()=>afficherToast('Lien copié !','#fce7ac'));}
    }},
    { src:estFavori?'etoile.png':'etoile vide.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#f37321');
      animerSpin(e.currentTarget.querySelector('img'));
      let favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
      const estFav=favoris.includes(key);
      if(estFav){favoris=favoris.filter(f=>f!==key);}else{favoris.push(key);}
      localStorage.setItem('favoris',JSON.stringify(favoris));
      const ajout=favoris.includes(key);
      e.currentTarget.querySelector('img').src=`images/${ajout?'etoile':'etoile vide'}.png`;
      wrapper.style.outline=ajout?'3px solid #fce7ac':'none';
      wrapper.style.outlineOffset='-3px';
      if(onFavoriChange) onFavoriChange(ajout);
    }}
  ].forEach(({src,onClick})=>{
    const btn=document.createElement('button');
    btn.style.cssText='background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;height:100%;';
    btn.innerHTML=`<img src="images/${src}" style="width:auto;height:60%;max-height:30px;min-height:14px;"/>`;
    btn.addEventListener('mouseenter',()=>btn.style.transform='scale(1.2)');
    btn.addEventListener('mouseleave',()=>btn.style.transform='scale(1)');
    btn.addEventListener('click',onClick);
    barre.appendChild(btn);
  });

  if(!estMobile()){
    wrapper.addEventListener('mouseenter',()=>{barre.style.transform='translateX(0)';wrapper.style.transform='scale(1.05)';});
    wrapper.addEventListener('mouseleave',()=>{barre.style.transform='translateX(-100%)';wrapper.style.transform='scale(1)';});
  }
  return barre;
}

// ============================================================
// BLOC 4 : BARRES D'ACTION FAVORIS — GALERIE (retire au clic étoile)
// ============================================================

function creerBarreGalerieFavoris(key, wrapper) {
  const barre = document.createElement('div');
  if (estMobile()) {
    barre.style.cssText = `position:absolute;left:0;top:0;bottom:0;width:100%;background:#242422;border-radius:10px;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly;transform:translateX(-100%);transition:transform 0.3s ease;z-index:2;`;
  } else {
    barre.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:50%;background:#242422;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly;border-radius:0 0 10px 10px;transition:transform 0.3s ease;transform:translateY(100%);z-index:2;`;
  }

  [
    { src:'icone-copier.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#00fffd');
      animerPop(e.currentTarget.querySelector('img'));
      const url=(window.liensVideos||{})[key]||'';
      const btn=e.currentTarget;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(()=>{
          btn.style.opacity='0.4';
          afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2);
          setTimeout(()=>btn.style.opacity='1',1500);
        }).catch(()=>afficherToast('Erreur copie','#f37321'));
      } else {
        const ta=document.createElement('textarea');
        ta.value=url; ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        try{ document.execCommand('copy'); afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2); }
        catch(err){ afficherToast('Erreur copie','#f37321'); }
        document.body.removeChild(ta);
      }
    }},
    { src:'icone-partager.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#fce7ac');
      animerPop(e.currentTarget.querySelector('img'));
      const url=(window.liensVideos||{})[key]||'';
      const t=(window.titresVideos||{})[key]||'';
      if(navigator.share){navigator.share({title:t,url});}
      else{navigator.clipboard.writeText(url).then(()=>afficherToast('Lien copié !','#fce7ac'));}
    }},
    { src:'etoile.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#f37321');
      animerSpin(e.currentTarget.querySelector('img'));
      let favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
      favoris=favoris.filter(f=>f!==key);
      localStorage.setItem('favoris',JSON.stringify(favoris));
      wrapper.remove();
      const contenu=document.getElementById('contenu-favoris');
      if(contenu&&contenu.children.length===0) afficherFavoris();
    }}
  ].forEach(({src,onClick})=>{
    const btn=document.createElement('button');
    btn.style.cssText='background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;height:100%;';
    const imgH = estMobile() ? '40%' : '65%';
    btn.innerHTML=`<img src="images/${src}" style="width:auto;height:${imgH};max-height:48px;min-height:16px;"/>`;
    btn.addEventListener('mouseenter',()=>btn.style.transform='scale(1.2)');
    btn.addEventListener('mouseleave',()=>btn.style.transform='scale(1)');
    btn.addEventListener('click',onClick);
    barre.appendChild(btn);
  });

  if(!estMobile()){
    wrapper.addEventListener('mouseenter',()=>{barre.style.transform='translateY(0)';wrapper.style.transform='scale(1.05)';});
    wrapper.addEventListener('mouseleave',()=>{barre.style.transform='translateY(100%)';wrapper.style.transform='scale(1)';});
  }
  return barre;
}

// ============================================================
// BLOC 5 : BARRES D'ACTION FAVORIS — LISTE (retire au clic étoile)
// ============================================================

function creerBarreListeFavoris(key, wrapper, largeur) {
  const barre = document.createElement('div');
  barre.style.cssText=`position:absolute;left:0;top:0;bottom:0;width:${largeur}px;background:#242422;border-radius:8px 0 0 8px;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly;transform:translateX(-100%);transition:transform 0.3s ease;z-index:3;`;

  [
    { src:'icone-copier.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#00fffd');
      animerPop(e.currentTarget.querySelector('img'));
      const url=(window.liensVideos||{})[key]||'';
      const btn=e.currentTarget;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(()=>{
          btn.style.opacity='0.4';
          afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2);
          setTimeout(()=>btn.style.opacity='1',1500);
        }).catch(()=>afficherToast('Erreur copie','#f37321'));
      } else {
        const ta=document.createElement('textarea');
        ta.value=url; ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        try{ document.execCommand('copy'); afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2); }
        catch(err){ afficherToast('Erreur copie','#f37321'); }
        document.body.removeChild(ta);
      }
    }},
    { src:'icone-partager.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#fce7ac');
      animerPop(e.currentTarget.querySelector('img'));
      const url=(window.liensVideos||{})[key]||'';
      const t=(window.titresVideos||{})[key]||'';
      if(navigator.share){navigator.share({title:t,url});}
      else{navigator.clipboard.writeText(url).then(()=>afficherToast('Lien copié !','#fce7ac'));}
    }},
    { src:'etoile.png', onClick:(e)=>{
      e.stopPropagation();
      const r=e.currentTarget.getBoundingClientRect();
      declencherEclat(r.left+r.width/2,r.top+r.height/2,'#f37321');
      animerSpin(e.currentTarget.querySelector('img'));
      let favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
      favoris=favoris.filter(f=>f!==key);
      localStorage.setItem('favoris',JSON.stringify(favoris));
      wrapper.remove();
      const contenu=document.getElementById('contenu-favoris');
      if(contenu&&contenu.children.length===0) afficherFavoris();
    }}
  ].forEach(({src,onClick})=>{
    const btn=document.createElement('button');
    btn.style.cssText='background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;height:100%;';
    btn.innerHTML=`<img src="images/${src}" style="width:auto;height:60%;max-height:30px;min-height:14px;"/>`;
    btn.addEventListener('mouseenter',()=>btn.style.transform='scale(1.2)');
    btn.addEventListener('mouseleave',()=>btn.style.transform='scale(1)');
    btn.addEventListener('click',onClick);
    barre.appendChild(btn);
  });

  if(!estMobile()){
    wrapper.addEventListener('mouseenter',()=>{barre.style.transform='translateX(0)';wrapper.style.transform='scale(1.05)';});
    wrapper.addEventListener('mouseleave',()=>{barre.style.transform='translateX(-100%)';wrapper.style.transform='scale(1)';});
  }
  return barre;
}

// ============================================================
// BLOC 6 : NAVIGATION CARROUSEL
// ============================================================

// Ordre : ghost-lexique(0) | mots-cles(1) | accueil(2) | liste(3) | essentiel(4) | lexique(5) | ghost-mots-cles(6)
const PAGES = ['lexique-ghost', 'mots-cles', 'accueil', 'liste', 'essentiel', 'lexique', 'mots-cles-ghost'];
let pageActuelle = 2;
const conteneurPages = document.getElementById('conteneur-pages');
conteneurPages.style.transition = 'none';
conteneurPages.style.transform = `translateX(-${2 * window.innerWidth}px)`;

const fondAccueil   = document.querySelector('.fond-accueil');
const fondMotsCles  = document.querySelector('.fond-mots-cles');
const fondEssentiel = document.querySelector('.fond-essentiel');
const fondLexique   = document.querySelector('.fond-lexique');
const fonds         = document.querySelectorAll('.fond');

const fondsDePage = [
  ()=>{ fonds.forEach(f=>f.classList.remove('visible')); fondLexique.classList.add('visible'); },
  ()=>{ fonds.forEach(f=>f.classList.remove('visible')); fondMotsCles.classList.add('visible'); },
  ()=>{ fonds.forEach(f=>f.classList.remove('visible')); fondAccueil.classList.add('visible'); },
  ()=>{ fonds.forEach(f=>f.classList.remove('visible')); fondAccueil.classList.add('visible'); },
  ()=>{ fonds.forEach(f=>f.classList.remove('visible')); fondEssentiel.classList.add('visible'); },
  ()=>{ fonds.forEach(f=>f.classList.remove('visible')); fondLexique.classList.add('visible'); },
  ()=>{ fonds.forEach(f=>f.classList.remove('visible')); fondMotsCles.classList.add('visible'); },
];

function animerContenuPage(index, delai) {
  if (index === 1) {
    setTimeout(() => {
      document.querySelectorAll('.contenu-mots-cles .categorie').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 80);
      });
    }, delai);
  }
  if (index === 5) {
    setTimeout(() => {
      document.querySelectorAll('.mot-lexique').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 80);
      });
    }, delai);
  }
}

function naviguerVers(index, animer=true) {
  if(index < 1) index = 5;
  if(index > 5) index = 1;

  const sw = window.innerWidth;

  fondsDePage[index]?.();
  if(index === 3) afficherListe();
  if(index === 4) genererEssentiel();

  if (!animer) {
    conteneurPages.style.transition = 'none';
    conteneurPages.style.transform = `translateX(-${index * sw}px)`;
    pageActuelle = index;
    return;
  }

  // Wrap lexique(5) → mots-clés(1) : continue vers droite via ghost-mots-clés(6)
  if (pageActuelle === 5 && index === 1) {
    conteneurPages.style.transition = 'transform 0.4s ease';
    conteneurPages.style.transform = `translateX(-${6 * sw}px)`;
    setTimeout(() => {
      conteneurPages.style.transition = 'none';
      void conteneurPages.offsetWidth; // force reflow → jump invisible
      conteneurPages.style.transform = `translateX(-${1 * sw}px)`;
      animerContenuPage(1, 50);
    }, 420);
  }
  else if (pageActuelle === 1 && index === 5) {
    conteneurPages.style.transition = 'transform 0.4s ease';
    conteneurPages.style.transform = `translateX(0px)`;
    setTimeout(() => {
      conteneurPages.style.transition = 'none';
      void conteneurPages.offsetWidth; // force reflow → jump invisible
      conteneurPages.style.transform = `translateX(-${5 * sw}px)`;
      animerContenuPage(5, 50);
    }, 420);
  }
  // Navigation normale
  else {
    conteneurPages.style.transition = 'transform 0.4s ease';
    conteneurPages.style.transform = `translateX(-${index * sw}px)`;
    animerContenuPage(index, 200);
  }

  pageActuelle = index;
}

document.getElementById('btn-mots-cles')?.addEventListener('click', ()=>naviguerVers(1));
document.getElementById('btn-liste')?.addEventListener('click',     ()=>naviguerVers(3));
document.getElementById('btn-essentiel')?.addEventListener('click', ()=>naviguerVers(4));
document.getElementById('btn-lexique')?.addEventListener('click',   ()=>naviguerVers(5));

document.getElementById('retour-accueil')?.addEventListener('click',           ()=>naviguerVers(2));
document.getElementById('retour-accueil-liste')?.addEventListener('click',     ()=>naviguerVers(2));
document.getElementById('retour-accueil-essentiel')?.addEventListener('click', ()=>naviguerVers(2));
document.getElementById('retour-accueil-lexique')?.addEventListener('click',   ()=>naviguerVers(2));

document.querySelectorAll('.bouton-categorie').forEach(b=>{
  b.addEventListener('click',()=>b.nextElementSibling?.classList.toggle('open'));
});

// ============================================================
// BLOC 7 : SWIPE UNIFIÉ (carrousel + favoris + paramètres + zone centrale)
// ============================================================

let tStartX = 0, tStartY = 0, tStartT = 0;
let vWrapper = null;
let vMiddleZone = false;
let draggingFav = false, favDragStartY = 0, favDirection = null;
let draggingParams = false, paramsDragStartY = 0, paramsDirection = null;
let gestureType = null;
let lastFavMoveY = 0;
let lastFavMoveDirection = null;
let favPassedThreshold = false;

// Listener non-passif dédié pour bloquer le scroll pendant le drag favoris/params
document.addEventListener('touchmove', (e) => {
  if (draggingFav || draggingParams) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchstart', (e) => {
  tStartX = e.touches[0].clientX;
  tStartY = e.touches[0].clientY;
  tStartT = Date.now();
  draggingFav = false;
  draggingParams = false;
  favDirection = null;
  paramsDirection = null;
  vWrapper = null;
  vMiddleZone = false;
  gestureType = null;
  lastFavMoveY = tStartY;
  lastFavMoveDirection = null;
  favPassedThreshold = false;

  const favPanel = document.getElementById('favoris-panel');
  const paramsPanel = document.getElementById('page-parametres');
  const screenH = window.innerHeight;

  if (estMobile() &&
      tStartY < screenH * 0.125 &&
      !document.getElementById('page-video') &&
      !favPanel?.classList.contains('visible') &&
      !paramsPanel?.classList.contains('visible')) {
    draggingParams = true;
    paramsDirection = 'open';
    paramsDragStartY = tStartY;
    _peuplerParametres();
    paramsPanel.style.transition = 'none';
    paramsPanel.style.transform = 'translateY(-110%)';
    return;
  }

  if (estMobile() &&
      paramsPanel?.classList.contains('visible') &&
      e.target.closest('#header-params')) {
    draggingParams = true;
    paramsDirection = 'close';
    paramsDragStartY = tStartY;
    paramsPanel.style.transition = 'none';
    return;
  }

  if (!favPanel?.classList.contains('visible') &&
      tStartY > screenH * 0.875 &&
      !document.getElementById('page-video')) {
    draggingFav = true;
    favDirection = 'open';
    favDragStartY = tStartY;
    lastFavMoveY = tStartY;
    lastFavMoveDirection = null;
    favPassedThreshold = false;
    afficherFavoris();
    favPanel.style.transition = 'none';
    favPanel.style.bottom = '-110%';
    return;
  }

  if (favPanel?.classList.contains('visible') && e.target.closest('.header-favoris')) {
    draggingFav = true;
    favDirection = 'close';
    favDragStartY = tStartY;
    lastFavMoveY = tStartY;
    lastFavMoveDirection = null;
    favPassedThreshold = false;
    favPanel.style.transition = 'none';
    return;
  }

  const w = e.target.closest('#conteneur-vignettes>div,.contenu-essentiel>div,.contenu-favoris>div,.contenu-resultats>div');
  if (w) {
    vWrapper = w;
    const rect = w.getBoundingClientRect();
    const quarter = rect.height / 4;
    const relY = tStartY - rect.top;
    vMiddleZone = relY >= quarter && relY <= quarter * 3;
  }

}, { passive: true });

document.addEventListener('touchmove', (e) => {
  const dx = e.touches[0].clientX - tStartX;
  const dy = e.touches[0].clientY - tStartY;
  const favPanel = document.getElementById('favoris-panel');
  const paramsPanel = document.getElementById('page-parametres');
  const screenH = window.innerHeight;
  const screenW = window.innerWidth;

  if (draggingParams) {
    const paramsDy = e.touches[0].clientY - paramsDragStartY;
    if (paramsDirection === 'open') {
      if (paramsDy <= 0) { paramsPanel.style.transform = 'translateY(-110%)'; return; }
      const pct = -110 + (paramsDy / screenH) * 110;
      paramsPanel.style.transform = `translateY(${Math.min(0, pct)}%)`;
    }
    if (paramsDirection === 'close') {
      if (paramsDy >= 0) { paramsPanel.style.transform = 'translateY(0)'; return; }
      const pct = (paramsDy / screenH) * 110;
      paramsPanel.style.transform = `translateY(${Math.max(-110, pct)}%)`;
    }
    return;
  }

  if (draggingFav) {
    const currentY = e.touches[0].clientY;
    if (Math.abs(currentY - lastFavMoveY) > 2) {
      lastFavMoveDirection = currentY < lastFavMoveY ? 'up' : 'down';
      lastFavMoveY = currentY;
    }
    const favDy = favDragStartY - currentY;
    if (favDirection === 'open') {
      if (favDy > screenH * 0.33) favPassedThreshold = true;
      favPanel.style.bottom = favDy <= 0 ? '-110%' : `${Math.min(0, -(screenH - favDy))}px`;
    }
    if (favDirection === 'close') {
      const favDy2 = currentY - favDragStartY;
      if (favDy2 > screenH * 0.33) favPassedThreshold = true;
      favPanel.style.bottom = favDy <= 0 ? '0' : `${Math.min(0, favDy)}px`;
    }
    return;
  }

  if (document.getElementById('page-video')) return;
  if (estMobile() ? paramsPanel?.classList.contains('visible') : paramsPanel?.style.display === 'flex') return;
  if (favPanel?.classList.contains('visible')) return;
  if (document.getElementById('info-panel')?.classList.contains('visible')) return;

  if (!gestureType && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    gestureType = Math.abs(dx) > Math.abs(dy) * 0.8 ? 'carousel' : 'vertical';
  }

  if (gestureType === 'carousel') {
    if (vWrapper && vMiddleZone && dx > 0) {
      const bar = vWrapper.querySelector('[style*="translateX"]');
      if (bar) {
        bar.style.transition = 'none';
        const ww = vWrapper.getBoundingClientRect().width;
        const pct = Math.min(0, -100 + (dx / ww) * 100);
        bar.style.transform = `translateX(${pct}%)`;
      }
    else if (!document.getElementById('panneau-resultats') || document.getElementById('panneau-resultats').style.display !== 'flex') {

      let pageVisuelle = pageActuelle;

      // Cas spécial : Lexique → Mots-clés
      if (pageActuelle === 5 && dx < 0) {
        pageVisuelle = 6;
      }

      // Cas spécial : Mots-clés → Lexique
      if (pageActuelle === 1 && dx > 0) {
        pageVisuelle = 0;
      }

      conteneurPages.style.transition = 'none';
      conteneurPages.style.transform =
        `translateX(${-(pageVisuelle * screenW) + dx}px)`;
    }
  }

}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - tStartX;
  const dy = e.changedTouches[0].clientY - tStartY;
  const dt = Date.now() - tStartT;
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const favPanel = document.getElementById('favoris-panel');
  const paramsPanel = document.getElementById('page-parametres');
  const velocity = Math.abs(dx) / dt;

  if (draggingParams) {
    const paramsDy = e.changedTouches[0].clientY - paramsDragStartY;
    paramsPanel.style.transition = 'transform 0.4s ease';
    if (paramsDirection === 'open') {
      if (paramsDy > screenH * 0.5) { paramsPanel.style.transform = 'translateY(0)'; paramsPanel.classList.add('visible'); }
      else { paramsPanel.style.transform = 'translateY(-110%)'; paramsPanel.classList.remove('visible'); }
    }
    if (paramsDirection === 'close') {
      if (paramsDy < -(screenH * 0.5)) {
        paramsPanel.style.transform = 'translateY(-110%)'; paramsPanel.classList.remove('visible');
        appliquerParametres(); afficherListe(); genererEssentiel();
      } else { paramsPanel.style.transform = 'translateY(0)'; }
    }
    draggingParams = false; paramsDirection = null;
    return;
  }

  if (draggingFav) {
    favPanel.style.transition = 'bottom 0.4s ease';
    if (favDirection === 'open') {
      if (favPassedThreshold && lastFavMoveDirection === 'up') {
        favPanel.style.bottom = '0';
        favPanel.classList.add('visible');
      } else {
        favPanel.style.bottom = '-110%';
        favPanel.classList.remove('visible');
      }
    }
    if (favDirection === 'close') {
      if (favPassedThreshold && lastFavMoveDirection === 'down') {
        favPanel.style.bottom = '-110%';
        favPanel.classList.remove('visible');
      } else {
        favPanel.style.bottom = '0';
      }
    }
    draggingFav = false; favDirection = null;
    return;
  }

   if (estMobile() && vWrapper && vMiddleZone && gestureType === 'carousel' && dx > 0) {
    conteneurPages.style.transition = 'transform 0.4s ease';
    conteneurPages.style.transform = `translateX(-${pageActuelle * screenW}px)`;
    const bar = vWrapper.querySelector('[style*="translateX"]');
    if (bar) {
      const ww = vWrapper.getBoundingClientRect().width;
      bar.style.transition = 'transform 0.3s ease';
      if (dx > ww / 2) {
        bar.style.transform = 'translateX(0)';
        setTimeout(() => {
          bar.style.transition = 'transform 0.3s ease';
          bar.style.transform = 'translateX(-100%)';
        }, 2500);
      } else {
        bar.style.transform = 'translateX(-100%)';
      }
    }
    vWrapper = null;
    gestureType = null;
    return;
  }

  // Checks de panels (après vignettes)
  if (document.getElementById('page-video')) return;
  if (estMobile() ? paramsPanel?.classList.contains('visible') : paramsPanel?.style.display === 'flex') return;
  if (document.getElementById('panneau-resultats')?.style.display === 'flex') return;
  if (favPanel?.classList.contains('visible')) return;
  if (document.getElementById('info-panel')?.classList.contains('visible')) return;

  // Navigation carrousel
  const isFlick = velocity > 0.3 && dt < 300;
  const isLargeDrag = Math.abs(dx) > screenW * 0.35;

  conteneurPages.style.transition = 'transform 0.4s ease';
  if (gestureType === 'carousel' && (isFlick || isLargeDrag)) {
    if (dx < 0) naviguerVers(pageActuelle + 1);
    else        naviguerVers(pageActuelle - 1);
  } else {
    conteneurPages.style.transform = `translateX(-${pageActuelle * screenW}px)`;
  }

  vWrapper = null;
  gestureType = null;

}, { passive: true });

// ============================================================
// BLOC 8 : ANIMATION DE LANCEMENT
// ============================================================

let conteneurVignettes;
let contenuEssentiel;

window.addEventListener('DOMContentLoaded', () => {
  conteneurVignettes = document.getElementById('conteneur-vignettes');
  contenuEssentiel   = document.querySelector('.contenu-essentiel');

  const logoFixe    = document.getElementById('logo-fixe');
  const loupeButton = document.querySelector('.search-button');
  const menuBtns    = document.querySelectorAll('.menu-buttons button');
  const footerIcons = document.querySelectorAll('.footer-bar a');
  const siteLink    = document.querySelector('.site-link');

  const params    = chargerParametres();
  const demarrage = params.demarrage || 'accueil';

  appliquerTaille(params.taille || 'petites');

  const idx = PAGES.indexOf(demarrage) >= 0 ? PAGES.indexOf(demarrage) : 2;
  naviguerVers(idx, false);

  if (demarrage !== 'accueil') {
    logoFixe.src = 'images/logo-fixe.png';
    loupeButton?.classList.remove('transition-ready');
    menuBtns.forEach(b => b.classList.remove('transition-ready'));
    footerIcons.forEach(ic => ic.querySelector('img')?.classList.remove('transition-ready'));
    siteLink?.classList.remove('transition-ready');
    document.getElementById('btn-parametres')?.querySelector('img')?.classList.remove('transition-ready');
    appliquerParametres();
  } else {
    setTimeout(() => { appliquerParametres(); }, 100);
    setTimeout(() => { if(loupeButton){ loupeButton.classList.remove('transition-ready'); loupeButton.classList.add('pop-smooth'); } }, 400);
    setTimeout(() => { menuBtns.forEach((b,i) => setTimeout(() => { b.classList.remove('transition-ready'); b.classList.add('pop-smooth'); }, i*150)); }, 600);
    setTimeout(() => { siteLink?.classList.remove('transition-ready'); siteLink?.classList.add('fade-in-up'); }, 1300);
    setTimeout(() => { footerIcons.forEach((ic,i) => { const img=ic.querySelector('img'); if(img) setTimeout(() => { img.classList.remove('transition-ready'); img.classList.add('pop-smooth'); }, i*80); }); }, 1600);
    setTimeout(() => { const bp=document.getElementById('btn-parametres'); if(bp){ const img=bp.querySelector('img'); if(img){ img.classList.remove('transition-ready'); img.classList.add('pop-smooth'); } } }, 1600);
    setTimeout(() => { logoFixe.src = 'images/logo-fixe.png'; }, 3640);
  }
});

// ============================================================
// BLOC 9 : AFFICHER LISTE
// ============================================================

function afficherListe() {
  if(!conteneurVignettes) return;
  conteneurVignettes.innerHTML = '';
  const params = chargerParametres();
  const mode = params.affichage || 'vignettes';
  if(mode==='liste') conteneurVignettes.classList.add('mode-liste');
  else conteneurVignettes.classList.remove('mode-liste');

  for(let i=1;i<=50;i++){
    const key=String(i);
    const favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
    const estFavori=favoris.includes(key);
    const wrapper=document.createElement('div');

    if(mode==='liste'){
      wrapper.style.cssText=`position:relative;display:flex;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);align-items:center;transition:transform 0.2s ease;outline:${estFavori?'3px solid #fce7ac':'none'};outline-offset:-3px;overflow:hidden;background:#fff;height:70px;width:90%;max-width:600px;margin:0 auto;`;
      const img=document.createElement('img');
      img.src=`images/vignettes/VE2M ${i} vignette YT.jpg`;
      img.style.cssText='width:124px;height:70px;object-fit:contain;background:#000;border-radius:8px 0 0 8px;flex-shrink:0;cursor:pointer;';
      const titre=document.createElement('div');
      titre.textContent=(window.titresVideos||{})[key]||`Vidéo ${i}`;
      titre.style.cssText=`font-family:'Intro';color:#242422;font-size:0.95em;padding:0 12px;flex:1;cursor:pointer;line-height:1.3;display:flex;align-items:center;height:100%;`;
      const barre=creerBarreListe(key,estFavori,wrapper,124);
      img.addEventListener('click',()=>ouvrirPageVideo(i));
      titre.addEventListener('click',()=>ouvrirPageVideo(i));
      wrapper.appendChild(img); wrapper.appendChild(titre); wrapper.appendChild(barre);
    } else {
      wrapper.style.cssText=`position:relative;display:flex;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);align-items:stretch;transition:transform 0.2s ease;outline:${estFavori?'3px solid #fce7ac':'none'};outline-offset:-3px;overflow:hidden;aspect-ratio:16/9;`;
      const img=document.createElement('img');
      img.src=`images/vignettes/VE2M ${i} vignette YT.jpg`;
      img.style.cssText='width:100%;height:100%;object-fit:cover;display:block;cursor:pointer;';
      img.addEventListener('click',()=>ouvrirPageVideo(i));
      const barre=creerBarreGalerie(key,estFavori,wrapper);
      wrapper.appendChild(img); wrapper.appendChild(barre);
    }
    conteneurVignettes.appendChild(wrapper);
  }
}

// ============================================================
// BLOC 10 : GÉNÉRER ESSENTIEL
// ============================================================

const videosEssentielles = [20,30,40,50,7,10,11,35,36,41,44,45,46];

function genererEssentiel() {
  if(!contenuEssentiel) return;
  const params=chargerParametres();
  const mode=params.affichage||'vignettes';
  contenuEssentiel.innerHTML='';
  if(mode==='liste'){
    contenuEssentiel.style.cssText='display:flex;flex-direction:column;gap:10px;width:100%;padding:20px;box-sizing:border-box;';
  } else {
    contenuEssentiel.style.cssText='';
  }

  videosEssentielles.forEach(num=>{
    const key=String(num);
    const favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
    const estFavori=favoris.includes(key);
    const wrapper=document.createElement('div');

    if(mode==='liste'){
      wrapper.style.cssText=`position:relative;display:flex;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);align-items:center;transition:transform 0.2s ease;outline:${estFavori?'3px solid #fce7ac':'none'};outline-offset:-3px;overflow:hidden;background:#fff;height:70px;width:90%;max-width:600px;margin:0 auto;`;
      const img=document.createElement('img');
      img.src=`images/vignettes/VE2M ${num} vignette YT.jpg`;
      img.style.cssText='width:124px;height:70px;object-fit:contain;background:#000;border-radius:8px 0 0 8px;flex-shrink:0;cursor:pointer;';
      const titre=document.createElement('div');
      titre.textContent=(window.titresVideos||{})[key]||`Vidéo ${num}`;
      titre.style.cssText=`font-family:'Intro';color:#242422;font-size:0.95em;padding:0 12px;flex:1;cursor:pointer;line-height:1.3;text-align:left;display:flex;align-items:center;height:100%;`;
      const barre=creerBarreListe(key,estFavori,wrapper,124);
      img.addEventListener('click',()=>ouvrirPageVideo(num));
      titre.addEventListener('click',()=>ouvrirPageVideo(num));
      wrapper.appendChild(img); wrapper.appendChild(titre); wrapper.appendChild(barre);
    } else {
      wrapper.style.cssText=`position:relative;display:flex;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);align-items:stretch;transition:transform 0.2s ease;outline:${estFavori?'3px solid #fce7ac':'none'};outline-offset:-3px;overflow:hidden;aspect-ratio:16/9;`;
      const img=document.createElement('img');
      img.src=`images/vignettes/VE2M ${num} vignette YT.jpg`;
      img.style.cssText='width:100%;height:100%;object-fit:cover;display:block;cursor:pointer;';
      img.addEventListener('click',()=>ouvrirPageVideo(num));
      const barre=creerBarreGalerie(key,estFavori,wrapper);
      wrapper.appendChild(img); wrapper.appendChild(barre);
    }
    contenuEssentiel.appendChild(wrapper);
  });
}

// ============================================================
// BLOC 11 : MOTS-CLÉS
// ============================================================

const contenuMotsCles = document.querySelector('.contenu-mots-cles');
if(contenuMotsCles){
  contenuMotsCles.innerHTML=`
    <div class="categorie"><button class="bouton-categorie">Éthique</button><div class="tags"><button class="tag">justice</button><button class="tag">droits</button><button class="tag">égalité</button></div></div>
    <div class="categorie"><button class="bouton-categorie">Écologie</button><div class="tags"><button class="tag">animaux</button><button class="tag">environnement</button><button class="tag">climat</button></div></div>
    <div class="categorie"><button class="bouton-categorie">Société</button><div class="tags"><button class="tag">féminisme</button><button class="tag">discrimination</button><button class="tag">minorités</button></div></div>
  `;
  contenuMotsCles.querySelectorAll('.tags').forEach(t=>t.classList.remove('open'));
  contenuMotsCles.querySelectorAll('.bouton-categorie').forEach(b=>{
    b.addEventListener('click',()=>b.nextElementSibling?.classList.toggle('open'));
  });
}

// ============================================================
// BLOC 12 : LEXIQUE
// ============================================================

document.querySelectorAll('.bouton-mot').forEach(b=>{
  b.addEventListener('click',()=>{ b.nextElementSibling?.classList.toggle('show'); b.classList.toggle('active'); });
});

// ============================================================
// BLOC 13 : FAVORIS
// ============================================================

const boutonFavoris = document.querySelector('.menu-buttons button:nth-child(5)');
const ongletFavoris = document.getElementById('favoris-panel');
const fermerFavoris = document.getElementById('fermer-favoris');

function afficherFavoris() {
  const contenu=document.getElementById('contenu-favoris');
  if(!contenu) return;
  const favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
  const params=chargerParametres();
  const mode=params.affichage||'vignettes';
  const taille=params.taille||'petites';
  contenu.innerHTML='';

  if(favoris.length===0){
    contenu.style.cssText='display:flex;align-items:center;justify-content:center;height:60vh;';
    contenu.innerHTML='<p style="font-family:\'SF Sports Night\';color:#fff;text-align:center;font-size:2em;line-height:1.4;max-width:300px;">Ajoutez des vidéos favorites en cliquant sur l\'étoile ★</p>';
    return;
  }

  if(mode==='liste'){
    contenu.style.cssText='display:flex;flex-direction:column;gap:10px;padding:20px;box-sizing:border-box;';
  } else {
    const cols = estMobile()
      ? (taille==='grandes' ? 'repeat(2,1fr)' : 'repeat(3,1fr)')
      : 'repeat(auto-fill,minmax(160px,1fr))';
    const gap = estMobile() ? '8px' : '20px';
    const pad = estMobile() ? '10px' : '20px';
    contenu.style.cssText=`display:grid;grid-template-columns:${cols};gap:${gap};padding:${pad};box-sizing:border-box;`;
  }

  favoris.forEach(key=>{
    const num=parseInt(key,10);
    const wrapper=document.createElement('div');
    if(mode==='liste'){
      wrapper.style.cssText=`position:relative;display:flex;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);align-items:center;transition:transform 0.2s ease;outline:3px solid #fce7ac;outline-offset:-3px;overflow:hidden;background:#fff;height:70px;width:90%;max-width:600px;margin:0 auto;`;
      const img=document.createElement('img');
      img.src=`images/vignettes/VE2M ${num} vignette YT.jpg`;
      img.style.cssText='width:124px;height:70px;object-fit:contain;background:#000;border-radius:8px 0 0 8px;flex-shrink:0;cursor:pointer;';
      const titre=document.createElement('div');
      titre.textContent=(window.titresVideos||{})[key]||`Vidéo ${num}`;
      titre.style.cssText=`font-family:'Intro';color:#242422;font-size:0.95em;padding:0 12px;flex:1;cursor:pointer;line-height:1.3;text-align:left;display:flex;align-items:center;height:100%;`;
      const barre=creerBarreListeFavoris(key,wrapper,124);
      img.addEventListener('click',()=>ouvrirPageVideo(num));
      titre.addEventListener('click',()=>ouvrirPageVideo(num));
      wrapper.appendChild(img); wrapper.appendChild(titre); wrapper.appendChild(barre);
    } else {
      wrapper.style.cssText=`position:relative;display:flex;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);align-items:stretch;transition:transform 0.2s ease;outline:3px solid #fce7ac;outline-offset:-3px;overflow:hidden;aspect-ratio:16/9;`;
      const img=document.createElement('img');
      img.src=`images/vignettes/VE2M ${num} vignette YT.jpg`;
      img.style.cssText='width:100%;height:100%;object-fit:cover;display:block;cursor:pointer;';
      img.addEventListener('click',()=>ouvrirPageVideo(num));
      const barre=creerBarreGalerieFavoris(key,wrapper);
      wrapper.appendChild(img); wrapper.appendChild(barre);
    }
    contenu.appendChild(wrapper);
  });
}

if(boutonFavoris) boutonFavoris.addEventListener('click', () => {
  afficherFavoris();
  ongletFavoris.style.transition = 'bottom 0.4s ease';
  ongletFavoris.style.bottom = '0';
  ongletFavoris.classList.add('visible');
});

if(fermerFavoris) fermerFavoris.addEventListener('click', () => {
  ongletFavoris.style.transition = 'bottom 0.4s ease';
  ongletFavoris.style.bottom = '-110%';
  ongletFavoris.classList.remove('visible');
});

// ============================================================
// BLOC 14 : PANNEAU INFO
// ============================================================

document.addEventListener('DOMContentLoaded',()=>{
  const btnInfo=document.getElementById('btn-info');
  const panel=document.getElementById('info-panel');
  const btnHome=document.getElementById('btn-info-home');
  const btnSettings=document.getElementById('btn-info-settings');
  const s2c=document.getElementById('slide-to-comment');
  const s2b=document.getElementById('slide-to-bienvenue');
  if(btnInfo) btnInfo.addEventListener('click',()=>panel.classList.add('visible'));
  if(btnHome) btnHome.addEventListener('click',()=>panel.classList.remove('visible'));
  if(s2c) s2c.addEventListener('click',()=>{ document.getElementById('contenu-bienvenue').style.display='none'; document.getElementById('contenu-comment').style.display='block'; });
  if(s2b) s2b.addEventListener('click',()=>{ document.getElementById('contenu-comment').style.display='none'; document.getElementById('contenu-bienvenue').style.display='block'; });
  if(btnSettings) btnSettings.addEventListener('click',()=>ouvrirParametres());
});

// ============================================================
// BLOC 15 : PAGE VIDÉO
// ============================================================

function ouvrirPageVideo(numero, onRetour) {
  document.getElementById('page-video')?.remove();
  const key=String(parseInt(numero,10));
  const titre=(window.titresVideos||{})[key]||'Titre introuvable';
  const url=(window.liensVideos||{})[key]||'';
  const texte=(window.textesVideos||{})[key]||'';
  const tagsVideo=(window.tagsVideos||{})[key]||[];
  const favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
  const estFavori=favoris.includes(key);
  const tagsHTML=tagsVideo.length?tagsVideo.map(t=>`<span class="tag">${t}</span>`).join(''):'<span class="tag">éthique</span><span class="tag">véganisme</span>';
  const videoId=url.includes('v=')?url.split('v=')[1]:'';
  const miniature=videoId?`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`:`images/vignettes/VE2M ${numero} vignette YT.jpg`;

  const page=document.createElement('div');
  page.id='page-video';
  page.style.cssText='position:fixed;top:0;left:0;width:100%;height:100dvh;overflow-y:auto;background:#e8e8e8;z-index:9999;box-sizing:border-box;';
  page.innerHTML=`
    <div style="max-width:960px;margin:0 auto;padding:16px;box-sizing:border-box;background:#fff;min-height:100dvh;">
      <button id="retour-page-video" class="triangle-retour gauche" style="margin-bottom:12px;"></button>
      <div id="zone-video" style="position:relative;margin-bottom:0;cursor:pointer;border-radius:10px 10px 0 0;overflow:hidden;aspect-ratio:16/9;">
        <img id="vignette-img" src="${miniature}" style="width:100%;height:100%;object-fit:cover;display:block;"/>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.2);">
          <div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;"><span style="font-size:26px;margin-left:5px;">&#9654;</span></div>
        </div>
      </div>
      <div style="display:flex;justify-content:center;gap:24px;margin-bottom:12px;background:#242422;padding:12px;border-radius:0 0 10px 10px;">
        <button id="btn-copier-video" style="background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;">
          <img src="images/icone-copier.png" style="width:40px;height:40px;"/>
        </button>
        <button id="btn-partager-video" style="background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;">
          <img src="images/icone-partager.png" style="width:40px;height:40px;"/>
        </button>
        <button id="btn-favori-video" style="background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;">
          <img id="img-favori-video" src="images/${estFavori?'etoile':'etoile vide'}.png" style="width:40px;height:40px;"/>
        </button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">${tagsHTML}</div>
      <h2 style="font-family:'Intro';color:#242422;margin-bottom:12px;">"${titre}"</h2>
      <div style="font-family:'Graphie';color:#242422;line-height:1.7;font-size:19px;white-space:pre-wrap;">${texte||'Contenu à venir.'}</div>
    </div>`;
  document.body.appendChild(page);

  page.querySelector('#retour-page-video').addEventListener('click',()=>{ page.remove(); if(typeof onRetour==='function') onRetour(); });
  page.querySelector('#zone-video').addEventListener('click',()=>{
    if(!videoId){alert('Lien introuvable.');return;}
    const zone=document.getElementById('zone-video');
    if(!zone) return;
    const iframe=document.createElement('iframe');
    iframe.src=`https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.style.cssText=`width:100%;height:${zone.offsetWidth}px;border:none;display:block;`;
    iframe.allow='autoplay;encrypted-media';
    zone.replaceWith(iframe);
  });
  page.querySelector('#btn-copier-video').addEventListener('click', function(){
    const r = this.getBoundingClientRect();
    declencherEclat(r.left+r.width/2, r.top+r.height/2, '#00fffd');
    animerPop(this.querySelector('img'));
    navigator.clipboard.writeText(url).then(()=>{
      this.style.opacity='0.4';
      afficherToast('Copié !','#00feff', r.left+r.width/2, r.top+r.height/2);
      setTimeout(()=>this.style.opacity='1', 1500);
    });
  });

  page.querySelector('#btn-partager-video').addEventListener('click', function(){
    const r = this.getBoundingClientRect();
    declencherEclat(r.left+r.width/2, r.top+r.height/2, '#fce7ac');
    animerPop(this.querySelector('img'));
    if(navigator.share){ navigator.share({title:titre, url}); }
    else{ navigator.clipboard.writeText(url).then(()=>afficherToast('Lien copié !','#fce7ac')); }
  });

  page.querySelector('#btn-favori-video').addEventListener('click', function(){
    const r = this.getBoundingClientRect();
    let fav=JSON.parse(localStorage.getItem('favoris')||'[]');
    const isF=fav.includes(key);
    if(isF){fav=fav.filter(f=>f!==key);}else{fav.push(key);}
    localStorage.setItem('favoris',JSON.stringify(fav));
    const ajout=fav.includes(key);
    declencherEclat(r.left+r.width/2, r.top+r.height/2, '#f37321');
    animerSpin(this.querySelector('img'));
    this.querySelector('img').src=`images/${ajout?'etoile':'etoile vide'}.png`;
  });
}

// ============================================================
// BLOC 16 : PARAMÈTRES
// ============================================================

const optionsParams=[
  {id:'barre-recherche',label:'barre de recherche',demarrage:false},
  {id:'mots-cles',      label:'mots-clés',          demarrage:true},
  {id:'essentiel',      label:"l'essentiel",         demarrage:true},
  {id:'lexique',        label:'lexique',             demarrage:true},
  {id:'favoris',        label:'favoris',             demarrage:true},
  {id:'liste',          label:'liste',               demarrage:true},
  {id:'barre-infos',    label:"barre d'infos",       demarrage:false},
  {id:'tutos',          label:'tutos',               demarrage:false},
];

function chargerParametres(){
  const defaut={
    accueil:{'barre-recherche':true,'mots-cles':true,'essentiel':true,'lexique':true,'favoris':true,'liste':true,'barre-infos':true,'tutos':false},
    demarrage:'accueil', affichage:'vignettes', taille:'petites', notif:false
  };
  return JSON.parse(localStorage.getItem('parametres')||'null')||defaut;
}
function sauvegarderParametres(p){ localStorage.setItem('parametres',JSON.stringify(p)); }

function appliquerParametres(){
  const p=chargerParametres();
  appliquerTaille(p.taille||'petites');
  const sb=document.querySelector('.search-bar');
  if(sb) sb.style.display=p.accueil['barre-recherche']?'flex':'none';
  ['btn-mots-cles','btn-liste','btn-essentiel','btn-lexique'].forEach((id,i)=>{
    const keys=['mots-cles','liste','essentiel','lexique'];
    const el=document.getElementById(id);
    if(el) el.style.display=p.accueil[keys[i]]?'':'none';
  });
  const bf=document.querySelector('.menu-buttons button:nth-child(5)');
  if(bf) bf.style.display=p.accueil['favoris']?'':'none';

  const fb=document.querySelector('.footer-bar');
  const bp=document.getElementById('btn-parametres');
  const spacer=fb?.querySelector('div:first-child');
  const icons=fb?.querySelector('div:nth-child(2)');
  if(fb){
    if(p.accueil['barre-infos']){
      fb.style.background='#242422'; fb.style.padding='10px 15px'; fb.style.justifyContent='center';
      if(spacer) spacer.style.display=''; if(icons) icons.style.display='flex';
      fb.querySelectorAll('a:not(#btn-parametres)').forEach(el=>el.style.display='');
    } else {
      fb.style.background='transparent'; fb.style.padding='0'; fb.style.justifyContent='flex-end';
      if(spacer) spacer.style.display='none'; if(icons) icons.style.display='none';
      fb.querySelectorAll('a:not(#btn-parametres)').forEach(el=>el.style.display='none');
    }
  }
  if(bp){bp.style.display='';bp.style.marginRight='15px';}
}

function _peuplerParametres() {
  const p = chargerParametres();
  const liste = document.getElementById('liste-options-params');
  liste.innerHTML = '';
  liste.style.cssText = 'display:grid;grid-template-columns:26px auto 26px;gap:12px;align-items:center;width:fit-content;margin:0 auto;';

  optionsParams.forEach(opt => {
    const isA = p.accueil?.[opt.id] !== false;
    const ca = document.createElement('div');
    ca.dataset.checked = isA ? 'true' : 'false';
    ca.style.cssText = `width:26px;height:26px;border-radius:6px;border:3px solid #fff;background:${isA?'#31bebd':'#242422'};cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:16px;`;
    ca.innerHTML = isA ? '✓' : '';
    ca.addEventListener('click', () => {
      const isC = ca.dataset.checked === 'true';
      ca.dataset.checked = isC ? 'false' : 'true';
      ca.style.background = isC ? '#242422' : '#31bebd';
      ca.innerHTML = isC ? '' : '✓';
      const pp = chargerParametres();
      if (!pp.accueil) pp.accueil = {};
      pp.accueil[opt.id] = !isC;
      sauvegarderParametres(pp);
    });

    const lbl = document.createElement('div');
    lbl.textContent = opt.label;
    lbl.style.cssText = "font-family:'Graphie';color:#fff;font-size:1em;text-align:center;";

    const cd = document.createElement('div');
    if (opt.demarrage) {
      const isD = p.demarrage === opt.id;
      cd.dataset.checked = isD ? 'true' : 'false';
      cd.dataset.demarrage = opt.id;
      cd.style.cssText = `width:26px;height:26px;border-radius:6px;border:3px solid #fff;background:${isD?'#31bebd':'#242422'};cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:16px;`;
      cd.innerHTML = isD ? '✓' : '';
      cd.addEventListener('click', () => {
        const wasC = cd.dataset.checked === 'true';
        liste.querySelectorAll('[data-demarrage]').forEach(c => {
          c.dataset.checked = 'false'; c.style.background = '#242422'; c.innerHTML = '';
        });
        if (!wasC) {
          cd.dataset.checked = 'true'; cd.style.background = '#31bebd'; cd.innerHTML = '✓';
          const pp = chargerParametres(); pp.demarrage = opt.id; sauvegarderParametres(pp);
        } else {
          const pp = chargerParametres(); pp.demarrage = 'accueil'; sauvegarderParametres(pp);
        }
      });
    } else {
      cd.style.cssText = 'width:26px;height:26px;';
    }

    liste.appendChild(ca); liste.appendChild(lbl); liste.appendChild(cd);
  });

  const p2 = chargerParametres();
  mettreAJourBoutonAffichage(p2.affichage || 'vignettes');
  mettreAJourBoutonTaille(p2.taille || 'petites');

  if (estMobile()) {
    document.getElementById('bloc-notification').style.display = 'flex';
    const cn = document.getElementById('check-notif');
    cn.checked = p2.notif || false;
    cn.addEventListener('change', (e) => {
      const pp = chargerParametres(); pp.notif = e.target.checked; sauvegarderParametres(pp);
    });
  }
}

function ouvrirParametres() {
  const panel = document.getElementById('page-parametres');
  _peuplerParametres();
  if (estMobile()) {
    panel.style.transition = 'transform 0.4s ease';
    panel.style.transform = 'translateY(0)';
    panel.classList.add('visible');
  } else {
    panel.style.display = 'flex';
    panel.style.zIndex = '99999';
  }
}

function fermerParametres() {
  const panel = document.getElementById('page-parametres');
  if (estMobile()) {
    panel.style.transition = 'transform 0.4s ease';
    panel.style.transform = 'translateY(-110%)';
    panel.classList.remove('visible');
  } else {
    panel.style.display = 'none';
  }
  appliquerParametres();
  afficherListe();
  genererEssentiel();
}

function reinitialiserParametres(){
  localStorage.removeItem('parametres');
  _peuplerParametres();
}

function toggleAffichage(){
  const p=chargerParametres(); const n=p.affichage==='vignettes'?'liste':'vignettes';
  p.affichage=n; sauvegarderParametres(p); mettreAJourBoutonAffichage(n);
  const btn=document.getElementById('btn-toggle-affichage');
  if(btn){btn.style.transform='scale(0.95)';setTimeout(()=>btn.style.transform='scale(1)',150);}
}
function mettreAJourBoutonAffichage(mode){
  const ic=document.getElementById('icone-affichage'); const lb=document.getElementById('label-affichage');
  if(!ic||!lb) return;
  if(mode==='vignettes'){
    ic.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:4px;width:40px;height:40px;';
    ic.innerHTML='<div style="width:18px;height:18px;background:#31bebd;border-radius:4px;"></div><div style="width:18px;height:18px;background:#31bebd;border-radius:4px;"></div><div style="width:18px;height:18px;background:#31bebd;border-radius:4px;"></div><div style="width:18px;height:18px;background:#31bebd;border-radius:4px;"></div>';
    lb.textContent='galerie';
  } else {
    ic.style.cssText='display:flex;flex-direction:column;gap:4px;width:40px;height:40px;justify-content:space-between;';
    ic.innerHTML='<div style="width:40px;height:18px;background:#31bebd;border-radius:4px;"></div><div style="width:40px;height:18px;background:#31bebd;border-radius:4px;"></div>';
    lb.textContent='liste';
  }
}

function toggleTaille(){
  const p=chargerParametres();
  const n=p.taille==='grandes'?'petites':'grandes';
  p.taille=n; sauvegarderParametres(p); mettreAJourBoutonTaille(n); appliquerTaille(n);
  const btn=document.getElementById('btn-toggle-taille');
  if(btn){btn.style.transform='scale(0.95)';setTimeout(()=>btn.style.transform='scale(1)',150);}
}
function mettreAJourBoutonTaille(taille){
  const ic=document.getElementById('icone-taille');
  const lb=document.getElementById('label-taille');
  if(!ic||!lb) return;
  if(taille==='grandes'){
    ic.innerHTML='<div style="width:32px;height:32px;background:#31bebd;border-radius:6px;"></div>';
    lb.textContent='grandes';
  } else {
    ic.innerHTML='<div style="width:20px;height:20px;background:#31bebd;border-radius:4px;"></div>';
    lb.textContent='petites';
  }
}
function appliquerTaille(taille){
  const c=document.getElementById('conteneur-vignettes');
  const e=document.querySelector('.contenu-essentiel');
  if(taille==='grandes'){
    c?.classList.add('grandes'); e?.classList.add('grandes');
    c?.classList.remove('petites'); e?.classList.remove('petites');
  } else {
    c?.classList.remove('grandes'); e?.classList.remove('grandes');
    c?.classList.add('petites'); e?.classList.add('petites');
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const bp=document.getElementById('btn-parametres');
  if(bp) bp.addEventListener('click',(e)=>{e.preventDefault();ouvrirParametres();});
});

// ============================================================
// BLOC 17 : RECHERCHE
// ============================================================

const searchInput=document.querySelector('.search-bar input');
const panneauResultats=document.createElement('div');
panneauResultats.id='panneau-resultats';
panneauResultats.style.cssText='position:fixed;top:0;left:0;width:100%;height:100dvh;background:#fff;z-index:9998;overflow-y:auto;display:none;flex-direction:column;box-sizing:border-box;';
document.body.appendChild(panneauResultats);

function rechercherVideos(query){
  if(!query||query.trim().length<2){panneauResultats.style.display='none';return;}
  const termes=query.toLowerCase().trim().split(/\s+/);
  const titres=window.titresVideos||{};
  const textes=window.textesVideos||{};
  const scores=[];
  for(let i=1;i<=50;i++){
    const key=String(i);
    const t=(titres[key]||'').toLowerCase();
    const tx=(textes[key]||'').toLowerCase();
    let score=0;
    termes.forEach(terme=>{
      if(t===terme) score+=10; else if(t.includes(terme)) score+=6;
      score+=(tx.match(new RegExp(terme,'g'))||[]).length;
    });
    if(score>0) scores.push({key,score});
  }
  scores.sort((a,b)=>b.score-a.score);
  const lex=[];
  document.querySelectorAll('.bouton-mot').forEach(btn=>{
    const mot=btn.textContent.toLowerCase();
    const def=btn.nextElementSibling?.textContent.toLowerCase()||'';
    termes.forEach(terme=>{
      if((mot.includes(terme)||def.includes(terme))&&!lex.find(r=>r.mot===btn.textContent)){
        lex.push({mot:btn.textContent,definition:btn.nextElementSibling?.textContent||''});
      }
    });
  });
  afficherResultats(scores,lex,query);
}

function afficherResultats(scores,lexique,query){
  panneauResultats.style.display='flex';
  panneauResultats.innerHTML='';
  const inner=document.createElement('div');
  inner.style.cssText='max-width:960px;margin:0 auto;padding:16px;box-sizing:border-box;width:100%;';

  const barreHaut=document.createElement('div');
  barreHaut.style.cssText='display:flex;align-items:center;gap:10px;margin-bottom:20px;';
  const btnF=document.createElement('button');
  btnF.className='triangle-retour gauche';
  btnF.style.cssText='flex-shrink:0;';
  btnF.addEventListener('click',()=>{panneauResultats.style.display='none';if(searchInput)searchInput.value='';});
  const bInput=document.createElement('div');
  bInput.style.cssText='flex:1;display:flex;align-items:center;background:#fff;border-radius:990px;padding:5px 10px;height:50px;box-shadow:0 2px 8px rgba(0,0,0,0.1);';
  const inp=document.createElement('input');
  inp.value=query;
  inp.style.cssText='flex:1;border:none;outline:none;font-family:\'MoonFlower\';font-size:1.5em;color:#31bebd;background:transparent;text-align:center;padding:0 8px;';
  inp.addEventListener('keydown',(e)=>{if(e.key==='Enter')rechercherVideos(inp.value);if(e.key==='Escape'){panneauResultats.style.display='none';if(searchInput)searchInput.value='';}});
  inp.addEventListener('focus',()=>inp.style.textAlign='left');
  inp.addEventListener('blur',()=>inp.style.textAlign='center');
  const loupe=document.createElement('button');
  loupe.style.cssText='background:none;border:none;cursor:pointer;display:flex;align-items:center;flex-shrink:0;';
  loupe.innerHTML='<img src="images/icone-loupe.png" style="width:32px;height:32px;"/>';
  loupe.addEventListener('click',()=>rechercherVideos(inp.value));
  bInput.appendChild(inp); bInput.appendChild(loupe);
  barreHaut.appendChild(btnF); barreHaut.appendChild(bInput);
  inner.appendChild(barreHaut);

  const tr=document.createElement('div');
  tr.style.cssText='font-family:\'Intro\';color:#242422;font-size:1em;margin-bottom:16px;';
  tr.textContent=`Résultats pour "${query}"`;
  inner.appendChild(tr);

  if(scores.length>0){
    const ts=document.createElement('div');
    ts.style.cssText='font-family:\'SF Sports Night\';color:#31bebd;font-size:1.4em;margin-bottom:12px;';
    ts.textContent=`Vidéos (${scores.length})`;
    inner.appendChild(ts);

    const params=chargerParametres();
    const mode=params.affichage||'vignettes';
    const taille=params.taille||'petites';

    const grille=document.createElement('div');
    grille.className='contenu-resultats';

    if(mode==='liste'){
      grille.style.cssText='display:flex;flex-direction:column;gap:10px;margin-bottom:24px;';
    } else {
      const cols = estMobile()
        ? (taille==='grandes' ? 'repeat(2,1fr)' : 'repeat(3,1fr)')
        : 'repeat(auto-fill,minmax(160px,1fr))';
      const gap = estMobile() ? '8px' : '12px';
      grille.style.cssText=`display:grid;grid-template-columns:${cols};gap:${gap};margin-bottom:24px;`;
    }

    scores.forEach(({key})=>{
      const num=parseInt(key);
      const favoris=JSON.parse(localStorage.getItem('favoris')||'[]');
      const estFavori=favoris.includes(key);
      const wrapper=document.createElement('div');

      if(mode==='liste'){
        wrapper.style.cssText=`position:relative;display:flex;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);align-items:center;transition:transform 0.2s ease;outline:${estFavori?'3px solid #fce7ac':'none'};outline-offset:-3px;overflow:hidden;background:#fff;height:70px;width:90%;max-width:600px;margin:0 auto;`;
        const img=document.createElement('img');
        img.src=`images/vignettes/VE2M ${num} vignette YT.jpg`;
        img.style.cssText='width:124px;height:70px;object-fit:contain;background:#000;border-radius:8px 0 0 8px;flex-shrink:0;cursor:pointer;';
        const titre=document.createElement('div');
        titre.textContent=(window.titresVideos||{})[key]||`Vidéo ${num}`;
        titre.style.cssText=`font-family:'Intro';color:#242422;font-size:0.95em;padding:0 12px;flex:1;cursor:pointer;line-height:1.3;display:flex;align-items:center;height:100%;`;
        const barre=creerBarreListe(key,estFavori,wrapper,124);
        img.addEventListener('click',()=>ouvrirPageVideo(num,()=>{panneauResultats.style.display='flex';}));
        titre.addEventListener('click',()=>ouvrirPageVideo(num,()=>{panneauResultats.style.display='flex';}));
        wrapper.appendChild(img); wrapper.appendChild(titre); wrapper.appendChild(barre);
      } else {
        wrapper.style.cssText=`position:relative;display:flex;border-radius:10px;box-shadow:0 0 5px rgba(0,0,0,0.2);align-items:stretch;transition:transform 0.2s ease;outline:${estFavori?'3px solid #fce7ac':'none'};outline-offset:-3px;overflow:hidden;aspect-ratio:16/9;`;
        const img=document.createElement('img');
        img.src=`images/vignettes/VE2M ${num} vignette YT.jpg`;
        img.style.cssText='width:100%;height:100%;object-fit:cover;display:block;cursor:pointer;';
        img.addEventListener('click',()=>ouvrirPageVideo(num,()=>{panneauResultats.style.display='flex';}));
        const barre=creerBarreGalerie(key,estFavori,wrapper);
        wrapper.appendChild(img); wrapper.appendChild(barre);
      }
      grille.appendChild(wrapper);
    });
    inner.appendChild(grille);
  }

  if(lexique.length>0){
    const ts=document.createElement('div');
    ts.style.cssText='font-family:\'SF Sports Night\';color:#5c205f;font-size:1.4em;margin-bottom:12px;';
    ts.textContent=`Définitions (${lexique.length})`;
    inner.appendChild(ts);
    lexique.forEach(({mot,definition})=>{
      const bloc=document.createElement('div');
      bloc.style.cssText='border-radius:10px;overflow:hidden;margin-bottom:10px;';
      const bm=document.createElement('div');
      bm.textContent=mot;
      bm.style.cssText='background:#5c205f;color:#fff;font-family:\'Intro\';padding:14px 16px;';
      const df=document.createElement('div');
      df.textContent=definition;
      df.style.cssText='background:#fff;padding:14px 16px;font-family:\'Graphie\';color:#242422;font-size:0.95em;line-height:1.6;';
      bloc.appendChild(bm); bloc.appendChild(df); inner.appendChild(bloc);
    });
  }

  if(scores.length===0&&lexique.length===0){
    const v=document.createElement('div');
    v.style.cssText='font-family:\'SF Sports Night\';color:#242422;font-size:1.8em;text-align:center;margin-top:60px;';
    v.textContent='Aucun résultat trouvé';
    inner.appendChild(v);
  }
  panneauResultats.appendChild(inner);
}

function lancerRecherche(){
  const q=searchInput?.value||'';
  if(q.trim().length<2) return;
  rechercherVideos(q);
}
const loupeBtn=document.querySelector('.search-button');
if(loupeBtn) loupeBtn.addEventListener('click',lancerRecherche);
if(searchInput){
  searchInput.addEventListener('keydown',(e)=>{
    if(e.key==='Enter') lancerRecherche();
    if(e.key==='Escape'){panneauResultats.style.display='none';searchInput.value='';}
  });
}
