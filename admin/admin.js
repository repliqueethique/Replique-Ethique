let motEnCours = null;
let videos = [];
let videoEnCours = null;
let categories = [
    {
        nom: "Arguments moraux",
        tags: [
            "Spécisme",
            "Sentience",
            "Considération morale"
        ]
    },
    {
        nom: "Communication",
        tags: [
            "Sophisme",
            "Rhétorique"
        ]
    }
];
let lexique = [
    {
        mot: "Sentience",
        definition: "Capacité à ressentir..."
    }
];
let filtreVideo = "";

function chargerLocalement() {

    const videosSauvegardees =
        localStorage.getItem(
            "replique_ethique_videos"
        );

    const categoriesSauvegardees =
        localStorage.getItem(
            "replique_ethique_categories"
        );

    const lexiqueSauvegarde =
        localStorage.getItem(
            "replique_ethique_lexique"
        );

    if(videosSauvegardees){
        videos = JSON.parse(videosSauvegardees);
    }

    if(categoriesSauvegardees){
        categories = JSON.parse(categoriesSauvegardees);
    }

    if(lexiqueSauvegarde){
        lexique = JSON.parse(lexiqueSauvegarde);
    }

}

const listeVideos =
document.getElementById("listeVideos");

const modal =
document.getElementById("modal");

const btnNouvelleVideo =
document.getElementById("btnNouvelleVideo");

const btnCancel =
document.getElementById("btnCancel");

btnNouvelleVideo.onclick = ouvrirNouvelleVideo;
btnCancel.onclick = fermerModal;
document
.getElementById("btnExporter")
.onclick = exporterDataJS;
document
.getElementById("btnSave")
.onclick = sauvegarderVideo;
document
.getElementById(
    "btnNouvelleCategorie"
)
.onclick = ajouterCategorie;
document
.getElementById(
    "btnNouveauMot"
)
.onclick = ajouterMot;
document
.getElementById(
    "btnSaveLexique"
)
.onclick =
    sauvegarderLexique;

document
.getElementById(
    "btnCancelLexique"
)
.onclick =
    fermerLexiqueModal;
document
.getElementById(
    "btnTrierLexique"
)
.onclick =
    trierLexique;

const rechercheVideo =
document.getElementById(
    "rechercheVideo"
);

if(rechercheVideo){

    rechercheVideo.addEventListener(
        "input",
        function(){

            filtreVideo =
                this.value;

            renderVideos();

        }
    );

}

function ouvrirNouvelleVideo(){

    videoEnCours = null;

    document.getElementById("titre").value = "";
    document.getElementById("youtube").value = "";
    document.getElementById("texte").value = "";
    renderTagsSelection([]);
    document.getElementById("essentiel").checked = false;

    modal.classList.remove("hidden");

}

function fermerModal() {
    modal.classList.add("hidden");
}

function chargerVideosDepuisData() {

    videos = [];

    if (
        !window.titresVideos ||
        !window.liensVideos
    ) {
        console.error(
            "Impossible de trouver data.js"
        );
        return;
    }

    Object.keys(window.titresVideos)
    .forEach(id => {

        videos.push({

            id,

            titre:
                window.titresVideos[id] || "",

            youtube:
                window.liensVideos[id] || "",

            texte:
                window.textesVideos?.[id] || "",

            tags:
                [],

            essentiel:false
        });

    });

    renderVideos();
}

function renderVideos() {

    listeVideos.innerHTML = "";

    videos
    .filter(video => {

        const recherche =
            filtreVideo.toLowerCase();

        return (
            video.titre
                .toLowerCase()
                .includes(recherche)
            ||
            video.texte
                .toLowerCase()
                .includes(recherche)
        );

    })
    .forEach(video => {

        const card =
        document.createElement("div");

        card.className =
        "video-card";

        card.innerHTML = `

            <h3>

                ${video.id}

                -

                ${video.titre}

            </h3>

            <div class="video-status">

                <span class="${
                    video.texte?.trim()
                    ? 'status-ok'
                    : 'status-missing'
                }">

                    Texte

                </span>

                <span class="${
                    video.youtube?.trim()
                    ? 'status-ok'
                    : 'status-missing'
                }">

                    Youtube

                </span>

                <span class="${
                    video.tags?.length
                    ? 'status-ok'
                    : 'status-missing'
                }">

                    Tags

                </span>

            </div>

            <div class="video-tags">

                ${(video.tags || [])
                    .map(tag =>
                        `<span class="tag-badge">${tag}</span>`
                    )
                   .join("")}

            </div>

            <div class="video-actions">

                <button
                    class="btn-edit"
                    onclick="modifierVideo('${video.id}')">

                    Modifier

                </button>

                <button
                    class="btn-delete"
                    onclick="supprimerVideo('${video.id}')">

                    Supprimer

                </button>

            </div>

        `;

        listeVideos.appendChild(card);

    });

}

function modifierVideo(id){

    const video =
    videos.find(v => v.id === id);

    if(!video) return;

    videoEnCours = id;

    document.getElementById("titre").value =
        video.titre || "";

    document.getElementById("youtube").value =
        video.youtube || "";

    document.getElementById("texte").value =
        video.texte || "";

    renderTagsSelection(
        video.tags || []
    );

    document.getElementById("essentiel").checked =
        video.essentiel || false;

    modal.classList.remove("hidden");
}

function supprimerVideo(id){

    const confirmation =
    confirm(
        "Supprimer cette vidéo ?"
    );

    if(!confirmation)
        return;

    videos =
    videos.filter(
        video => video.id !== id
    );

    renderVideos();

}

chargerLocalement();

if(videos.length === 0){

    chargerVideosDepuisData();

}else{

    renderVideos();

}

function sauvegarderVideo(){

    const donnees = {

        titre:
            document.getElementById("titre").value,

        youtube:
            document.getElementById("youtube").value,

        texte:
            document.getElementById("texte").value,

        tags:
            Array.from(
                document.querySelectorAll(
                    "#tagsSelection input:checked"
                )
            )
            .map(
                checkbox => checkbox.value
            ),

        essentiel:
            document.getElementById("essentiel").checked

    };

    if(videoEnCours){

        const video =
        videos.find(
            v => v.id === videoEnCours
        );

        Object.assign(video, donnees);

    }else{

        const nouvelId =
        String(

            videos.length

                ? Math.max(
                    ...videos.map(
                        v => Number(v.id)
                    )
                ) + 1

        : 1

        );

        videos.push({

            id: nouvelId,

            ...donnees,

            vignette: ""

        });

    }

    sauvegarderLocalement();

    renderVideos();

    fermerModal();

}

function convertirVersModeleUnique(){

    return videos.map(video => ({

        id: video.id,

        titre: video.titre,

        youtube: video.youtube,

        texte: video.texte,

        tags: video.tags || [],

        essentiel: video.essentiel || false,

        vignette: ""

    }));

}

function exporterDataJS(){

    let liensVideos = {};
    let titresVideos = {};
    let textesVideos = {};
    let lexiqueData = lexique;

    videos.forEach(video => {

        liensVideos[video.id] =
            video.youtube || "";

        titresVideos[video.id] =
            video.titre || "";

        textesVideos[video.id] =
            video.texte || "";

    });

    const contenu = `
// BLOC JS 0 : Dictionnaire

window.liensVideos = ${JSON.stringify(liensVideos, null, 2)};

window.titresVideos = ${JSON.stringify(titresVideos, null, 2)};

window.textesVideos = ${JSON.stringify(textesVideos, null, 2)};

window.lexiqueData = ${JSON.stringify(lexiqueData, null, 2)};
`;

    const blob = new Blob(
        [contenu],
        {
            type:"application/javascript"
        }
    );

    const lien =
        document.createElement("a");

    lien.href =
        URL.createObjectURL(blob);

    lien.download =
        "data.js";

    lien.click();

}

const menuButtons =
document.querySelectorAll(".menu-btn");

menuButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        menuButtons.forEach(btn=>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        document
        .querySelectorAll("[id^='section-']")
        .forEach(section=>
            section.classList.add("hidden")
        );

        document
        .getElementById(
            "section-" +
            button.dataset.section
        )
        .classList.remove("hidden");

    });

});

function renderCategories(){

    const container =
    document.getElementById(
        "listeCategories"
    );

    if(!container) return;

    container.innerHTML = "";

    categories.forEach(categorie=>{

        const bloc =
        document.createElement("div");

        bloc.className =
        "categorie-card";

        bloc.innerHTML = `

            <div class="categorie-header">

                <h3>${categorie.nom}</h3>

                <div>

                    <button
                        onclick="ajouterTag('${categorie.nom}')">

                        + Tag

                    </button>

                    <button
                        onclick="renommerCategorie('${categorie.nom}')">

                        ✏

                    </button>

                    <button
                        onclick="supprimerCategorie('${categorie.nom}')">

                        🗑

                    </button>

                </div>

            </div>

            <div>

                ${categorie.tags.map(tag => `

                    <span class="tag-item">

                        ${tag}

                        <button
                            onclick="supprimerTag(
                                '${categorie.nom}',
                                '${tag}'
                            )">

                            ×

                        </button>

                    </span>

                `).join("")}

            </div>

        `;

        container.appendChild(bloc);

    });

}

renderCategories();

function ajouterCategorie(){

    const nom =
    prompt("Nom de la catégorie");

    if(!nom) return;

    categories.push({

        nom,

        tags:[]
    });

    sauvegarderLocalement();
    renderCategories();

}

function renommerCategorie(nom){

    const categorie =
    categories.find(
        c => c.nom === nom
    );

    if(!categorie) return;

    const nouveauNom =
    prompt(
        "Nouveau nom",
        categorie.nom
    );

    if(!nouveauNom) return;

    categorie.nom =
    nouveauNom;

    sauvegarderLocalement();
    renderCategories();

}

function supprimerCategorie(nom){

    if(
        !confirm(
            "Supprimer cette catégorie ?"
        )
    ) return;

    categories =
    categories.filter(
        c => c.nom !== nom
    );

    sauvegarderLocalement();
    renderCategories();

}

function ajouterTag(nomCategorie){

    const categorie =
    categories.find(
        c => c.nom === nomCategorie
    );

    if(!categorie) return;

    const tag =
    prompt("Nom du tag");

    if(!tag) return;

    categorie.tags.push(tag);

    sauvegarderLocalement();
    renderCategories();

}

function supprimerTag(
    nomCategorie,
    tag
){

    const categorie =
    categories.find(
        c => c.nom === nomCategorie
    );

    if(!categorie) return;

    categorie.tags =
    categorie.tags.filter(
        t => t !== tag
    );

    sauvegarderLocalement();
    renderCategories();

}

function renderLexique(){

    const container =
    document.getElementById(
        "listeLexique"
    );

    if(!container) return;

    container.innerHTML = "";

    lexique.forEach(entree => {

        const bloc =
        document.createElement("div");

        bloc.className =
        "lexique-card";

        bloc.innerHTML = `

            <h3>${entree.mot}</h3>

            <p>
                ${(entree.definition || "")
                    .substring(0,150)}
                ...
            </p>

            <div class="lexique-actions">

                <button
                    onclick="modifierMot('${entree.mot}')">

                    Modifier

                </button>

                <button
                    onclick="supprimerMot('${entree.mot}')">

                    Supprimer

                </button>

            </div>

        `;

        container.appendChild(bloc);

    });

}

renderLexique();

function ajouterMot(){

    ouvrirLexiqueModal();

}

function modifierMot(mot){

    const entree =
        lexique.find(
            l => l.mot === mot
        );

    if(!entree)
        return;

    ouvrirLexiqueModal(
        entree
    );

}

function supprimerMot(mot){

    if(
        !confirm(
            "Supprimer ce terme ?"
        )
    ) return;

    lexique =
    lexique.filter(
        l => l.mot !== mot
    );

    sauvegarderLocalement();
    renderLexique();

}

function renderTagsSelection(tagsActifs = []){

    const container =
    document.getElementById(
        "tagsSelection"
    );

    if(!container) return;

    container.innerHTML = "";

    categories.forEach(categorie => {

        const bloc =
        document.createElement("div");

        bloc.className =
        "tags-categorie";

        bloc.innerHTML = `

            <h4>${categorie.nom}</h4>

            ${categorie.tags.map(tag => `

                <label
                    class="tag-checkbox">

                    <input
                        type="checkbox"
                        value="${tag}"
                        ${
                            tagsActifs.includes(tag)
                            ? "checked"
                            : ""
                        }
                    >

                    ${tag}

                </label>

            `).join("")}

        `;

        container.appendChild(bloc);

    });

}

function ouvrirLexiqueModal(
    entree = null
){

    motEnCours =
        entree?.mot || null;

    document
        .getElementById(
            "lexiqueTitre"
        )
        .textContent =
            entree
                ? "Modifier le terme"
                : "Nouveau terme";

    document
        .getElementById(
            "lexiqueMot"
        )
        .value =
            entree?.mot || "";

    document
        .getElementById(
            "lexiqueDefinition"
        )
        .value =
            entree?.definition || "";

    document
        .getElementById(
            "lexiqueModal"
        )
        .classList
        .remove("hidden");

}

function fermerLexiqueModal(){

    document
        .getElementById(
            "lexiqueModal"
        )
        .classList
        .add("hidden");

}

function sauvegarderLexique(){

    const mot =
        document
        .getElementById(
            "lexiqueMot"
        )
        .value
        .trim();

    const definition =
        document
        .getElementById(
            "lexiqueDefinition"
        )
        .value
        .trim();

    if(
        !mot ||
        !definition
    ){
        alert(
            "Tous les champs sont obligatoires."
        );
        return;
    }

    if(motEnCours){

        const entree =
            lexique.find(
                l =>
                    l.mot ===
                    motEnCours
            );

        if(entree){

            entree.mot =
                mot;

            entree.definition =
                definition;

        }

    }else{

        lexique.push({

            mot,

            definition

        });

    }

    sauvegarderLocalement();
    
    renderLexique();

    fermerLexiqueModal();

}

function sauvegarderLocalement(){

    localStorage.setItem(
        "replique_ethique_videos",
        JSON.stringify(videos)
    );

    localStorage.setItem(
        "replique_ethique_categories",
        JSON.stringify(categories)
    );

    localStorage.setItem(
        "replique_ethique_lexique",
        JSON.stringify(lexique)
    );

}

document
.getElementById("btnResetLocal")
.onclick = () => {

    if(
        !confirm(
            "Effacer toutes les données locales ?"
        )
    ){
        return;
    }

    localStorage.clear();

    location.reload();

};

function trierLexique(){

    lexique.sort(
        (a, b) =>
            a.mot.localeCompare(
                b.mot,
                "fr",
                {
                    sensitivity:"base"
                }
            )
    );

    renderLexique();

}