#!/usr/bin/env node
/* ------------------------------------------------------------------
   Assemble tout le site dans UN seul fichier HTML autonome.
   Utile pour l'ouvrir sur un téléphone : un seul fichier à copier,
   aucune ressource externe, aucun serveur.

   Usage :  node build-fichier-unique.js
   Sortie :  la-malle-dautomne.html
   ------------------------------------------------------------------ */

const fs = require("fs");
const path = require("path");

const racine = __dirname;
const lire = (f) => fs.readFileSync(path.join(racine, f), "utf8");

/* --- réécriture des liens vers des routes en #/… ------------------- */
const LIENS = [
  ["produit.html?ref=", "#/produit?ref="],
  ["boutique.html?univers=", "#/boutique?univers="],
  ["contact.html?ref=", "#/contact?ref="],
  ["boutique.html", "#/boutique"],
  ["a-propos.html", "#/a-propos"],
  ["contact.html", "#/contact"],
  ["livraison-et-retours.html", "#/livraison"],
  ["mentions-legales.html", "#/mentions"],
  ["confidentialite.html", "#/confidentialite"],
  ["cgv.html", "#/cgv"],
  ["index.html", "#/"],
];

function reecrireLiens(s) {
  LIENS.forEach(([de, vers]) => (s = s.split(de).join(vers)));
  return s;
}

/* --- contenu des pages statiques ---------------------------------- */
function contenuPrincipal(fichier) {
  const html = lire(fichier);
  const m = html.match(/<main id="page">([\s\S]*?)<\/main>/);
  if (!m) throw new Error("Pas de <main id=\"page\"> dans " + fichier);
  return reecrireLiens(m[1]);
}

const STATIQUES = {
  "/a-propos": contenuPrincipal("a-propos.html"),
  "/contact": contenuPrincipal("contact.html"),
  "/livraison": contenuPrincipal("livraison-et-retours.html"),
  "/cgv": contenuPrincipal("cgv.html"),
  "/mentions": contenuPrincipal("mentions-legales.html"),
  "/confidentialite": contenuPrincipal("confidentialite.html"),
};

/* --- scripts ------------------------------------------------------- */
const css = lire("assets/css/style.css");
const data = lire("assets/js/data.js");
const images = lire("assets/js/images.js");

let app = lire("assets/js/app.js");
/* la page courante vient de la route, plus du nom de fichier */
app = app.replace(
  /function pageCourante\(\)\s*\{[\s\S]*?\n\}/,
  'function pageCourante() {\n  return "#" + ROUTE.chemin;\n}'
);
app = reecrireLiens(app);

function pageScript(fichier, nom) {
  let s = lire(fichier);
  s = s.replace("window.rendrePage = function ()", "PAGES." + nom + " = function ()");
  s = s.split("location.search").join("ROUTE.query");
  return reecrireLiens(s);
}

const home = pageScript("assets/js/home.js", "accueil");

let boutique = pageScript("assets/js/boutique.js", "boutique");
/* pas d'historique d'URL en mode fichier unique : la route suffit */
boutique = boutique.replace(
  /const url = new URL\(location\.href\);[\s\S]*?history\.replaceState\(null, "", url\);/,
  'ROUTE.query = universActif === "tout" ? "" : "?univers=" + universActif;'
);

const produit = pageScript("assets/js/produit.js", "produit");

/* --- routeur ------------------------------------------------------- */
const routeur = `
/* ================= Routeur (mode fichier unique) =================== */
const ROUTE = { chemin: "/", query: "" };
const PAGES = {};
const STATIQUES = ${JSON.stringify(STATIQUES, null, 1)};

const INITS = {
  "/contact": function () {
    const params = new URLSearchParams(ROUTE.query);
    const ref = params.get("ref");
    const champ = document.getElementById("champ-ref");
    if (ref && champ) {
      champ.value = ref;
      const p = produitParRef(ref);
      if (p) {
        document.querySelector('#form-contact [name="message"]').placeholder =
          "Bonjour, j'ai une question sur « " + p.nom + " » (réf. " + p.ref + ")…";
      }
    }
    document.getElementById("form-contact").addEventListener("submit", function (e) {
      e.preventDefault();
      const f = e.target;
      const retour = document.getElementById("contact-retour");
      if (!f.prenom.value.trim() || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(f.email.value) || f.message.value.trim().length < 10) {
        retour.innerHTML = '<div class="message-succes" style="background:#f6e7dd;border-color:#e6cdbc;color:#8a4a2c">Merci de renseigner votre prénom, un e-mail valide et un message d\\'au moins dix caractères.</div>';
        return;
      }
      retour.innerHTML = '<div class="message-succes">Merci ! Votre message est bien noté — je vous réponds sous 24 h. (Maquette : aucun message n\\'est réellement envoyé.)</div>';
      f.reset();
    });
  },
};

function majNavActive() {
  const page = "#" + ROUTE.chemin;
  document.querySelectorAll(".nav-principale a").forEach((a) => {
    const h = a.getAttribute("href") || "";
    if (ROUTE.chemin !== "/" && h.startsWith(page)) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

let dejaRendu = false;

function routerRendre() {
  const brut = location.hash.replace(/^#/, "");
  const ancre = Boolean(brut) && !brut.startsWith("/");
  /* une ancre interne (#univers, #avis…) ne change pas de page —
     sauf au chargement, où il faut tout de même rendre l'accueil */
  if (ancre && dejaRendu) return;
  dejaRendu = true;

  const cible = ancre ? "" : brut;
  const i = cible.indexOf("?");
  ROUTE.chemin = (i === -1 ? cible : cible.slice(0, i)) || "/";
  ROUTE.query = i === -1 ? "" : cible.slice(i);

  const menu = document.getElementById("menu-mobile");
  if (menu) { menu.classList.remove("ouvert"); menu.setAttribute("aria-hidden", "true"); }
  document.body.style.overflow = "";
  if (document.getElementById("tiroir-panier")) fermerPanier();

  if (ROUTE.chemin === "/boutique") PAGES.boutique();
  else if (ROUTE.chemin === "/produit") PAGES.produit();
  else if (STATIQUES[ROUTE.chemin]) {
    document.getElementById("page").innerHTML = STATIQUES[ROUTE.chemin];
    if (INITS[ROUTE.chemin]) INITS[ROUTE.chemin]();
  } else PAGES.accueil();

  finaliserRendu();
  majNavActive();
  requestAnimationFrame(() => {
    const vise = ancre ? document.getElementById(brut) : null;
    if (vise) vise.scrollIntoView();
    else window.scrollTo(0, 0);
  });
}

window.addEventListener("hashchange", routerRendre);
document.addEventListener("DOMContentLoaded", routerRendre);
`;

/* --- repli si le JavaScript ne s'exécute pas -----------------------
   Certains aperçus intégrés (messageries, visionneuses de fichiers sur
   téléphone) ouvrent le HTML sans exécuter les scripts. Plutôt qu'une
   page blanche, on affiche la marche à suivre. Ce bloc est remplacé
   dès le premier rendu.                                              */
const REPLI = `
    <section class="entete-page" style="min-height:100vh;display:flex;align-items:center">
      <div class="enveloppe">
        <p class="surtitre">La Malle d'Automne</p>
        <h1>Cet aperçu n'exécute pas le JavaScript</h1>
        <p style="margin-bottom:26px">Le site s'affiche entièrement une fois le fichier ouvert dans un vrai navigateur. C'est l'affaire de quelques secondes :</p>
        <ol style="text-align:left;max-width:34em;margin:0 auto 26px;color:var(--encre-2);line-height:1.9">
          <li><strong>Enregistrez le fichier</strong> (le bouton de téléchargement, en haut à droite de cet aperçu).</li>
          <li>Ouvrez l'application <strong>Fichiers</strong> et allez dans <em>Téléchargements</em>.</li>
          <li>Appuyez sur <strong>la-malle-dautomne.html</strong> : il s'ouvre dans le navigateur, et tout apparaît.</li>
        </ol>
        <p style="font-size:.88rem;color:var(--encre-3)">Aucune connexion n'est nécessaire : le catalogue, les visuels et le style sont tous à l'intérieur du fichier.</p>
      </div>
    </section>`;

/* --- assemblage ---------------------------------------------------- */
const sortie = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>La Malle d'Automne — brocante en ligne, pièces uniques chinées à la main</title>
<meta name="description" content="Vaisselle ancienne, verrerie, argenterie, linge brodé, gravures et petite décoration. Chaque pièce est unique, vérifiée à la main avant expédition.">
<meta name="theme-color" content="#fbf8f2">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%232c2822'/%3E%3Ctext x='16' y='23' font-family='Georgia,serif' font-size='19' fill='%23f4eee3' text-anchor='middle'%3EM%3C/text%3E%3C/svg%3E">
<style>
${css}
</style>
</head>
<body>
<main id="page">${REPLI}</main>
<script>
${data}
</script>
<script>
${images}
</script>
<script>
${routeur}
</script>
<script>
${app}
</script>
<script>
${home}
</script>
<script>
${boutique}
</script>
<script>
${produit}
</script>
</body>
</html>
`;

const cible = path.join(racine, "la-malle-dautomne.html");
fs.writeFileSync(cible, sortie);
console.log(
  "Écrit : " + cible + " (" + (Buffer.byteLength(sortie) / 1024).toFixed(0) + " Ko)"
);
