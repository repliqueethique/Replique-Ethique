// ============================================================
// ÉTAT GLOBAL
// ============================================================

let motEnCours = null;
let videos = [];
let interventions = [];
let autre = [];
let videoEnCours = null;         // { type: "videos"|"interventions"|"autre", id }
let categories = [
    {
        nom: "Arguments moraux",
        tags: ["Spécisme", "Sentience", "Considération morale"]
    },
    {
        nom: "Communication",
        tags: ["Sophisme", "Rhétorique"]
    }
];
let lexique = [
    {
        mot: "Sentience",
        definition: "Capacité à ressentir..."
    }
];
let filtreVideo = "";
let filtreIntervention = "";
let filtreAutre = "";

// ============================================================
// PERSISTANCE LOCALE
// ============================================================

function chargerLocalement() {
    const v = localStorage.getItem("replique_ethique_videos");
    const i = localStorage.getItem("replique_ethique_interventions");
    const a = localStorage.getItem("replique_ethique_autre");
    const c = localStorage.getItem("replique_ethique_categories");
    const l = localStorage.getItem("replique_ethique_lexique");

    if (v) videos        = JSON.parse(v);
    if (i) interventions = JSON.parse(i);
    if (a) autre         = JSON.parse(a);
    if (c) categories    = JSON.parse(c);
    if (l) lexique       = JSON.parse(l);
}

function sauvegarderLocalement() {
    localStorage.setItem("replique_ethique_videos",        JSON.stringify(videos));
    localStorage.setItem("replique_ethique_interventions", JSON.stringify(interventions));
    localStorage.setItem("replique_ethique_autre",         JSON.stringify(autre));
    localStorage.setItem("replique_ethique_categories",    JSON.stringify(categories));
    localStorage.setItem("replique_ethique_lexique",       JSON.stringify(lexique));
    localStorage.setItem("replique_ethique_derniere_sauvegarde", new Date().toISOString());
}

// ============================================================
// DIAGNOSTIC
// ============================================================

function diagnostiquerEtat() {
    const nbVideos  = videos.length;
    const nbTextes  = videos.filter(v => v.texte && v.texte.trim()).length;
    const nbTags    = videos.filter(v => v.tags && v.tags.length).length;
    const nbMots    = lexique.length;
    const nbInterv  = interventions.length;
    const nbAutre   = autre.length;

    console.log(
        `[Réplique Éthique] État chargé : ` +
        `${nbVideos} vidéos, ${nbTextes} avec texte, ${nbTags} avec tags, ` +
        `${nbInterv} interventions, ${nbAutre} autre, ${nbMots} mots lexique.`
    );

    const bandeau = document.getElementById("bandeauEtat");
    if (bandeau) {
        bandeau.textContent =
            `${nbVideos} vidéos — ${nbInterv} interventions — ${nbAutre} autre — ` +
            `${nbMots} mots lexique.`;
        bandeau.classList.toggle("alerte", nbVideos > 0 && nbTextes === 0);
    }
}

// ============================================================
// CHARGEMENT DEPUIS DATA.JS (si localStorage vide)
// ============================================================

function chargerVideosDepuisData() {
    videos = [];

    if (!window.titresVideos || !window.liensVideos) {
        console.error("Impossible de trouver data.js");
        return;
    }

    Object.keys(window.titresVideos).forEach(id => {
        videos.push({
            id,
            titre:    window.titresVideos[id]    || "",
            youtube:  window.liensVideos[id]     || "",
            texte:    window.textesVideos?.[id]  || "",
            tags:     window.tagsVideos?.[id]    || [],
            essentiel: false,
            cachee:   window.videosCachees?.[id] || false,
            vignette: ""
        });
    });

    // Interventions depuis data.js si présentes
    if (window.interventionsData) {
        interventions = window.interventionsData;
    }

    // Autre depuis data.js si présent
    if (window.autreData) {
        autre = window.autreData;
    }

    renderVideos();
    renderInterventions();
    renderAutre();
}

// ============================================================
// GÉNÉRATION D'ID UNIQUE POUR UNE COLLECTION
// ============================================================

function prochainId(collection) {
    if (!collection.length) return "1";
    return String(Math.max(...collection.map(v => Number(v.id) || 0)) + 1);
}

// ============================================================
// MODAL PARTAGÉE
// ============================================================

// contexteModal indique dans quelle collection on travaille
let contexteModal = "videos";

function ouvrirModal(contexte, id = null) {
    contexteModal = contexte;
    videoEnCours  = id;

    const collection = getCollection(contexte);
    const entree     = id ? collection.find(v => v.id === id) : null;

    const libelles = {
        videos:        "Vidéo",
        interventions: "Intervention",
        autre:         "Autre"
    };
    document.getElementById("modalTitre").textContent = libelles[contexte] || "Élément";

    document.getElementById("titre").value    = entree?.titre    || "";
    document.getElementById("youtube").value  = entree?.youtube  || "";
    document.getElementById("texte").value    = entree?.texte    || "";
    document.getElementById("essentiel").checked = entree?.essentiel || false;
    document.getElementById("cachee").checked    = entree?.cachee    || false;

    renderTagsSelection(entree?.tags || []);

    document.getElementById("modal").classList.remove("hidden");
}

function fermerModal() {
    document.getElementById("modal").classList.add("hidden");
}

function sauvegarderDepuisModal() {
    const donnees = {
        titre:    document.getElementById("titre").value,
        youtube:  document.getElementById("youtube").value,
        texte:    document.getElementById("texte").value,
        tags:     Array.from(
                      document.querySelectorAll("#tagsSelection input:checked")
                  ).map(cb => cb.value),
        essentiel: document.getElementById("essentiel").checked,
        cachee:    document.getElementById("cachee").checked,
    };

    const collection = getCollection(contexteModal);

    if (videoEnCours) {
        const entree = collection.find(v => v.id === videoEnCours);
        if (entree) Object.assign(entree, donnees);
    } else {
        collection.push({
            id: prochainId(collection),
            ...donnees,
            vignette: ""
        });
    }

    sauvegarderLocalement();
    renderCollection(contexteModal);
    fermerModal();
}

// ============================================================
// HELPERS : accès à la bonne collection
// ============================================================

function getCollection(contexte) {
    if (contexte === "videos")        return videos;
    if (contexte === "interventions") return interventions;
    if (contexte === "autre")         return autre;
    return videos;
}

function getFiltreCollection(contexte) {
    if (contexte === "videos")        return filtreVideo;
    if (contexte === "interventions") return filtreIntervention;
    if (contexte === "autre")         return filtreAutre;
    return "";
}

function renderCollection(contexte) {
    if (contexte === "videos")        renderVideos();
    if (contexte === "interventions") renderInterventions();
    if (contexte === "autre")         renderAutre();
}

// ============================================================
// RENDER GÉNÉRIQUE
// ============================================================

function renderListe(collection, conteneurId, contexte, filtre) {
    const conteneur = document.getElementById(conteneurId);
    if (!conteneur) return;

    conteneur.innerHTML = "";

    collection
    .filter(item => {
        const f = filtre.toLowerCase();
        return (
            (item.titre || "").toLowerCase().includes(f) ||
            (item.texte || "").toLowerCase().includes(f)
        );
    })
    .forEach(item => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
            <h3>${item.id} - ${item.titre || "(sans titre)"}</h3>
            <div class="video-status">
                <span class="${item.texte?.trim() ? 'status-ok' : 'status-missing'}">Texte</span>
                <span class="${item.youtube?.trim() ? 'status-ok' : 'status-missing'}">Youtube</span>
                <span class="${item.tags?.length ? 'status-ok' : 'status-missing'}">Tags</span>
                ${item.essentiel ? '<span class="status-ok">Essentiel</span>' : ''}
                ${item.cachee    ? '<span class="status-missing">Cachée</span>'  : ''}
            </div>
            <div class="video-tags">
                ${(item.tags || []).map(tag => `<span class="tag-badge">${tag}</span>`).join("")}
            </div>
            <div class="video-actions">
                <button class="btn-edit"
                    onclick="ouvrirModal('${contexte}', '${item.id}')">
                    Modifier
                </button>
                <button class="btn-delete"
                    onclick="supprimerElement('${contexte}', '${item.id}')">
                    Supprimer
                </button>
            </div>
        `;
        conteneur.appendChild(card);
    });
}

function renderVideos() {
    renderListe(videos, "listeVideos", "videos", filtreVideo);
}

function renderInterventions() {
    renderListe(interventions, "listeInterventions", "interventions", filtreIntervention);
}

function renderAutre() {
    renderListe(autre, "listeAutre", "autre", filtreAutre);
}

// ============================================================
// SUPPRESSION GÉNÉRIQUE
// ============================================================

function supprimerElement(contexte, id) {
    if (!confirm("Supprimer cet élément ?")) return;

    if (contexte === "videos")        videos        = videos.filter(v => v.id !== id);
    if (contexte === "interventions") interventions = interventions.filter(v => v.id !== id);
    if (contexte === "autre")         autre         = autre.filter(v => v.id !== id);

    sauvegarderLocalement();
    renderCollection(contexte);
}

// ============================================================
// TAGS SELECTION
// ============================================================

function renderTagsSelection(tagsActifs = []) {
    const container = document.getElementById("tagsSelection");
    if (!container) return;

    container.innerHTML = "";

    categories.forEach(categorie => {
        const bloc = document.createElement("div");
        bloc.className = "tags-categorie";
        bloc.innerHTML = `
            <h4>${categorie.nom}</h4>
            ${categorie.tags.map(tag => `
                <label class="tag-checkbox">
                    <input type="checkbox" value="${tag}" ${tagsActifs.includes(tag) ? "checked" : ""}>
                    ${tag}
                </label>
            `).join("")}
        `;
        container.appendChild(bloc);
    });
}

// ============================================================
// NAVIGATION SIDEBAR
// ============================================================

const menuButtons = document.querySelectorAll(".menu-btn");
menuButtons.forEach(button => {
    if (!button.dataset.section) return;
    button.addEventListener("click", () => {
        menuButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        document.querySelectorAll("[id^='section-']")
            .forEach(section => section.classList.add("hidden"));
        document.getElementById("section-" + button.dataset.section)
            .classList.remove("hidden");
    });
});

// ============================================================
// BOUTONS TOOLBAR
// ============================================================

document.getElementById("btnNouvelleVideo")
    .onclick = () => ouvrirModal("videos");

document.getElementById("btnNouvelleIntervention")
    .onclick = () => ouvrirModal("interventions");

document.getElementById("btnNouvelAutre")
    .onclick = () => ouvrirModal("autre");

document.getElementById("btnCancel")
    .onclick = fermerModal;

document.getElementById("btnSave")
    .onclick = sauvegarderDepuisModal;

document.getElementById("btnExporter")
    .onclick = exporterDataJS;

// Recherches
const rechercheVideo = document.getElementById("rechercheVideo");
if (rechercheVideo) {
    rechercheVideo.addEventListener("input", function () {
        filtreVideo = this.value;
        renderVideos();
    });
}

const rechercheIntervention = document.getElementById("rechercheIntervention");
if (rechercheIntervention) {
    rechercheIntervention.addEventListener("input", function () {
        filtreIntervention = this.value;
        renderInterventions();
    });
}

const rechercheAutre = document.getElementById("rechercheAutre");
if (rechercheAutre) {
    rechercheAutre.addEventListener("input", function () {
        filtreAutre = this.value;
        renderAutre();
    });
}

// ============================================================
// CATÉGORIES / TAGS
// ============================================================

document.getElementById("btnNouvelleCategorie")
    .onclick = ajouterCategorie;

function renderCategories() {
    const container = document.getElementById("listeCategories");
    if (!container) return;
    container.innerHTML = "";

    categories.forEach(categorie => {
        const bloc = document.createElement("div");
        bloc.className = "categorie-card";
        bloc.innerHTML = `
            <div class="categorie-header">
                <h3>${categorie.nom}</h3>
                <div>
                    <button onclick="ajouterTag('${categorie.nom}')">+ Tag</button>
                    <button onclick="renommerCategorie('${categorie.nom}')">✏</button>
                    <button onclick="supprimerCategorie('${categorie.nom}')">🗑</button>
                </div>
            </div>
            <div>
                ${categorie.tags.map(tag => `
                    <span class="tag-item">
                        ${tag}
                        <button onclick="supprimerTag('${categorie.nom}','${tag}')">×</button>
                    </span>
                `).join("")}
            </div>
        `;
        container.appendChild(bloc);
    });
}

function ajouterCategorie() {
    const nom = prompt("Nom de la catégorie");
    if (!nom) return;
    categories.push({ nom, tags: [] });
    sauvegarderLocalement();
    renderCategories();
}

function renommerCategorie(nom) {
    const cat = categories.find(c => c.nom === nom);
    if (!cat) return;
    const nouveauNom = prompt("Nouveau nom", cat.nom);
    if (!nouveauNom) return;
    cat.nom = nouveauNom;
    sauvegarderLocalement();
    renderCategories();
}

function supprimerCategorie(nom) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    categories = categories.filter(c => c.nom !== nom);
    sauvegarderLocalement();
    renderCategories();
}

function ajouterTag(nomCategorie) {
    const cat = categories.find(c => c.nom === nomCategorie);
    if (!cat) return;
    const tag = prompt("Nom du tag");
    if (!tag) return;
    cat.tags.push(tag);
    sauvegarderLocalement();
    renderCategories();
}

function supprimerTag(nomCategorie, tag) {
    const cat = categories.find(c => c.nom === nomCategorie);
    if (!cat) return;
    cat.tags = cat.tags.filter(t => t !== tag);
    sauvegarderLocalement();
    renderCategories();
}

// ============================================================
// LEXIQUE
// ============================================================

document.getElementById("btnNouveauMot").onclick  = () => ouvrirLexiqueModal();
document.getElementById("btnSaveLexique").onclick = sauvegarderLexique;
document.getElementById("btnCancelLexique").onclick = fermerLexiqueModal;
document.getElementById("btnTrierLexique").onclick  = trierLexique;

function renderLexique() {
    const container = document.getElementById("listeLexique");
    if (!container) return;
    container.innerHTML = "";

    lexique.forEach(entree => {
        const bloc = document.createElement("div");
        bloc.className = "lexique-card";
        bloc.innerHTML = `
            <h3>${entree.mot}</h3>
            <p>${(entree.definition || "").substring(0, 150)}...</p>
            <div class="lexique-actions">
                <button onclick="modifierMot('${entree.mot}')">Modifier</button>
                <button onclick="supprimerMot('${entree.mot}')">Supprimer</button>
            </div>
        `;
        container.appendChild(bloc);
    });
}

function ouvrirLexiqueModal(entree = null) {
    motEnCours = entree?.mot || null;
    document.getElementById("lexiqueTitre").textContent = entree ? "Modifier le terme" : "Nouveau terme";
    document.getElementById("lexiqueMot").value         = entree?.mot        || "";
    document.getElementById("lexiqueDefinition").value  = entree?.definition || "";
    document.getElementById("lexiqueModal").classList.remove("hidden");
}

function fermerLexiqueModal() {
    document.getElementById("lexiqueModal").classList.add("hidden");
}

function modifierMot(mot) {
    const entree = lexique.find(l => l.mot === mot);
    if (!entree) return;
    ouvrirLexiqueModal(entree);
}

function supprimerMot(mot) {
    if (!confirm("Supprimer ce terme ?")) return;
    lexique = lexique.filter(l => l.mot !== mot);
    sauvegarderLocalement();
    renderLexique();
}

function sauvegarderLexique() {
    const mot        = document.getElementById("lexiqueMot").value.trim();
    const definition = document.getElementById("lexiqueDefinition").value.trim();

    if (!mot || !definition) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    if (motEnCours) {
        const entree = lexique.find(l => l.mot === motEnCours);
        if (entree) { entree.mot = mot; entree.definition = definition; }
    } else {
        lexique.push({ mot, definition });
    }

    sauvegarderLocalement();
    renderLexique();
    fermerLexiqueModal();
}

function trierLexique() {
    lexique.sort((a, b) => a.mot.localeCompare(b.mot, "fr", { sensitivity: "base" }));
    sauvegarderLocalement();
    renderLexique();
}

// ============================================================
// EXPORT DATA.JS
// ============================================================

function exporterDataJS() {
    const nbTextes = videos.filter(v => v.texte && v.texte.trim()).length;
    const nbTags   = videos.filter(v => v.tags && v.tags.length).length;

    if (videos.length > 0 && nbTextes === 0 && nbTags === 0) {
        const continuer = confirm(
            "Attention : aucune vidéo n'a de texte ni de tags.\n\n" +
            "L'export risque d'être vide. Voulez-vous continuer quand même ?"
        );
        if (!continuer) return;
    }

    let liensVideos     = {};
    let titresVideos    = {};
    let textesVideos    = {};
    let tagsVideos      = {};
    let videosCachees   = {};
    let essentielVideos = {};

    videos.forEach(v => {
        liensVideos[v.id]     = v.youtube  || "";
        titresVideos[v.id]    = v.titre    || "";
        textesVideos[v.id]    = v.texte    || "";
        tagsVideos[v.id]      = v.tags     || [];
        videosCachees[v.id]   = v.cachee   || false;
        essentielVideos[v.id] = v.essentiel || false;
    });

    const contenu = `// BLOC JS 0 : Dictionnaire

window.liensVideos = ${JSON.stringify(liensVideos, null, 2)};

window.titresVideos = ${JSON.stringify(titresVideos, null, 2)};

window.textesVideos = ${JSON.stringify(textesVideos, null, 2)};

window.tagsVideos = ${JSON.stringify(tagsVideos, null, 2)};

window.videosCachees = ${JSON.stringify(videosCachees, null, 2)};

window.essentielVideos = ${JSON.stringify(essentielVideos, null, 2)};

window.categoriesData = ${JSON.stringify(categories, null, 2)};

window.lexiqueData = ${JSON.stringify(lexique, null, 2)};

window.interventionsData = ${JSON.stringify(interventions, null, 2)};

window.autreData = ${JSON.stringify(autre, null, 2)};
`;

    const blob = new Blob([contenu], { type: "application/javascript" });
    const lien = document.createElement("a");
    lien.href  = URL.createObjectURL(blob);
    lien.download = "data.js";
    lien.click();
}

// ============================================================
// RESET LOCAL
// ============================================================

document.getElementById("btnResetLocal").onclick = () => {
    const nbAvecContenu = videos.filter(
        v => (v.texte && v.texte.trim()) || (v.tags && v.tags.length)
    ).length;

    const message = nbAvecContenu > 0
        ? `Attention : ${nbAvecContenu} vidéo(s) contiennent du texte et/ou des tags.\n\n` +
          `Cette action effacera DÉFINITIVEMENT toutes les données locales.\n\n` +
          `Pensez à sauvegarder d'abord. Continuer quand même ?`
        : "Effacer toutes les données locales ?";

    if (!confirm(message)) return;
    localStorage.clear();
    location.reload();
};

// ============================================================
// SAUVEGARDE JSON
// ============================================================

function sauvegarderCopieJSON() {
    const contenu = JSON.stringify({
        videos, interventions, autre, categories, lexique,
        dateExport: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([contenu], { type: "application/json" });
    const lien = document.createElement("a");
    lien.href     = URL.createObjectURL(blob);
    lien.download = `replique_ethique_sauvegarde_${new Date().toISOString().slice(0, 10)}.json`;
    lien.click();
}

document.getElementById("btnSauvegardeJSON").onclick = sauvegarderCopieJSON;

// ============================================================
// IMPORT JSON
// ============================================================

function importerCopieJSON(event) {
    const fichier = event.target.files[0];
    if (!fichier) return;

    const lecteur = new FileReader();
    lecteur.onload = e => {
        try {
            const donnees = JSON.parse(e.target.result);

            if (donnees.videos)        videos        = donnees.videos;
            if (donnees.interventions) interventions = donnees.interventions;
            if (donnees.autre)         autre         = donnees.autre;
            if (donnees.categories)    categories    = donnees.categories;
            if (donnees.lexique)       lexique       = donnees.lexique;

            sauvegarderLocalement();
            renderVideos();
            renderInterventions();
            renderAutre();
            renderCategories();
            renderLexique();
            diagnostiquerEtat();

            // Pas d'alert au démarrage — message discret dans le bandeau
            const bandeau = document.getElementById("bandeauEtat");
            if (bandeau) {
                bandeau.textContent = "✔ Sauvegarde JSON importée avec succès.";
                setTimeout(() => diagnostiquerEtat(), 3000);
            }

        } catch (err) {
            alert("Erreur : fichier invalide.\n" + err.message);
        }
    };
    lecteur.readAsText(fichier);
}

document.getElementById("inputImportJSON")
    .addEventListener("change", importerCopieJSON);

// ============================================================
// IMPORT DATA.JS
// ============================================================

function importerDataJS(event) {
    const fichier = event.target.files[0];
    if (!fichier) return;

    const lecteur = new FileReader();
    lecteur.onload = e => {
        try {
            const contenu = e.target.result;
            const sandbox = {};
            const fn      = new Function("window", contenu + "\nreturn window;");
            const resultat = fn(sandbox);

            if (!resultat.titresVideos || !resultat.liensVideos) {
                alert("Le fichier ne contient pas les données attendues (titresVideos / liensVideos).");
                return;
            }

            const nouvellesVideos = [];
            Object.keys(resultat.titresVideos).forEach(id => {
                nouvellesVideos.push({
                    id,
                    titre:     resultat.titresVideos[id]    || "",
                    youtube:   resultat.liensVideos[id]     || "",
                    texte:     resultat.textesVideos?.[id]  || "",
                    tags:      resultat.tagsVideos?.[id]    || [],
                    essentiel: resultat.essentielVideos?.[id] || false,
                    cachee:    resultat.videosCachees?.[id] || false,
                    vignette: ""
                });
            });

            const nbTextes = nouvellesVideos.filter(v => v.texte && v.texte.trim()).length;
            const nbTags   = nouvellesVideos.filter(v => v.tags && v.tags.length).length;

            const message =
                `Le fichier contient ${nouvellesVideos.length} vidéo(s), ` +
                `dont ${nbTextes} avec texte et ${nbTags} avec tags.\n\n` +
                `Cela remplacera TOUTES les données actuelles (vidéos, catégories, lexique).\n\n` +
                `Continuer ?`;

            if (!confirm(message)) return;

            videos = nouvellesVideos;

            if (resultat.interventionsData) interventions = resultat.interventionsData;
            if (resultat.autreData)         autre         = resultat.autreData;
            if (resultat.categoriesData)    categories    = resultat.categoriesData;
            if (resultat.lexiqueData)       lexique       = resultat.lexiqueData;

            sauvegarderLocalement();
            renderVideos();
            renderInterventions();
            renderAutre();
            renderCategories();
            renderLexique();
            diagnostiquerEtat();

            // Message discret dans le bandeau, pas d'alert
            const bandeau = document.getElementById("bandeauEtat");
            if (bandeau) {
                const prev = bandeau.textContent;
                bandeau.textContent = "✔ data.js importé avec succès.";
                setTimeout(() => diagnostiquerEtat(), 3000);
            }

        } catch (err) {
            alert("Erreur lors de la lecture du fichier.\n" + err.message);
        }
    };
    lecteur.readAsText(fichier);
}

document.getElementById("inputImportDataJS")
    .addEventListener("change", importerDataJS);

// ============================================================
// INIT
// ============================================================

chargerLocalement();

if (videos.length === 0) {
    chargerVideosDepuisData();
} else {
    renderVideos();
    renderInterventions();
    renderAutre();
}

renderCategories();
renderLexique();
diagnostiquerEtat();