/* ------------------------------------------------------------------
   Page boutique : filtres par univers, tri, grille de pièces.
   Les pièces parties restent consultables mais toujours en fin de
   liste, grisées, avec une alerte de disponibilité.
   ------------------------------------------------------------------ */

window.rendrePage = function () {
  const cible = document.getElementById("page");
  const params = new URLSearchParams(location.search);
  let universActif = params.get("univers") || "tout";
  if (universActif !== "tout" && !universParSlug(universActif)) universActif = "tout";
  let tri = "defaut";
  let masquerParties = false;

  const u = universParSlug(universActif);

  cible.innerHTML = `
  <section class="entete-page">
    <div class="enveloppe">
      <p class="surtitre">La boutique</p>
      <h1 id="titre-boutique">${u ? u.nom : "Toutes les pièces"}</h1>
      <p id="intro-boutique">${u ? u.intro : "Chaque objet présenté ici existe en un seul exemplaire. Quand il est parti, il ne revient pas — mais il m'arrive d'en retrouver un cousin."}</p>
    </div>
  </section>

  <div class="enveloppe">
    <div class="barre-filtres">
      <div class="puces" id="puces">
        <button class="puce" data-univers="tout" aria-pressed="${universActif === "tout"}">Tout chiner</button>
        ${UNIVERS.map(
          (x) =>
            `<button class="puce" data-univers="${x.slug}" aria-pressed="${x.slug === universActif}">${x.nom}</button>`
        ).join("")}
      </div>
      <div class="tri">
        <label style="display:flex;align-items:center;gap:7px;white-space:nowrap">
          <input type="checkbox" id="masquer-parties"> Masquer les pièces parties
        </label>
        <label for="tri-select">Trier</label>
        <select id="tri-select">
          <option value="defaut">Sélection de la maison</option>
          <option value="prix-croissant">Prix croissant</option>
          <option value="prix-decroissant">Prix décroissant</option>
          <option value="note">Les mieux notées</option>
        </select>
      </div>
    </div>
    <p class="compteur" id="compteur"></p>
    <div class="grille-produits" id="grille"></div>
    <div class="vide" id="vide" hidden>
      <p>Aucune pièce ne correspond à cette recherche pour l'instant.</p>
      <a class="btn btn--fantome" href="boutique.html">Voir toutes les pièces</a>
    </div>
  </div>

  <div style="height:60px"></div>
  <div data-reassurance="riche"></div>`;

  const grille = document.getElementById("grille");
  const compteur = document.getElementById("compteur");
  const vide = document.getElementById("vide");

  function liste() {
    let l = universActif === "tout" ? PRODUITS.slice() : PRODUITS.filter((p) => p.univers === universActif);
    if (masquerParties) l = l.filter((p) => p.stock > 0);

    if (tri === "prix-croissant") l.sort((a, b) => a.prix - b.prix);
    else if (tri === "prix-decroissant") l.sort((a, b) => b.prix - a.prix);
    else if (tri === "note") l.sort((a, b) => (noteMoyenne(b.ref) || 0) - (noteMoyenne(a.ref) || 0));
    else l.sort((a, b) => (b.coupDeCoeur ? 1 : 0) - (a.coupDeCoeur ? 1 : 0));

    /* règle constante : le disponible d'abord, l'épuisé en fin de liste */
    l.sort((a, b) => (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0));
    return l;
  }

  function dessiner() {
    const l = liste();
    grille.innerHTML = l.map(carteProduit).join("");
    const nbDispo = l.filter((p) => p.stock > 0).length;
    const nbPartis = l.length - nbDispo;
    compteur.textContent =
      `${nbDispo} pièce${nbDispo > 1 ? "s" : ""} disponible${nbDispo > 1 ? "s" : ""}` +
      (nbPartis ? ` · ${nbPartis} déjà partie${nbPartis > 1 ? "s" : ""}` : "");
    vide.hidden = l.length > 0;
    grille.hidden = l.length === 0;

    const titre = document.getElementById("titre-boutique");
    const intro = document.getElementById("intro-boutique");
    const uu = universParSlug(universActif);
    titre.textContent = uu ? uu.nom : "Toutes les pièces";
    intro.textContent = uu
      ? uu.intro
      : "Chaque objet présenté ici existe en un seul exemplaire. Quand il est parti, il ne revient pas — mais il m'arrive d'en retrouver un cousin.";
  }

  document.getElementById("puces").addEventListener("click", (e) => {
    const b = e.target.closest("[data-univers]");
    if (!b) return;
    universActif = b.dataset.univers;
    $$("#puces .puce").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const url = new URL(location.href);
    if (universActif === "tout") url.searchParams.delete("univers");
    else url.searchParams.set("univers", universActif);
    history.replaceState(null, "", url);
    dessiner();
  });

  document.getElementById("tri-select").addEventListener("change", (e) => {
    tri = e.target.value;
    dessiner();
  });

  document.getElementById("masquer-parties").addEventListener("change", (e) => {
    masquerParties = e.target.checked;
    dessiner();
  });

  dessiner();
};
