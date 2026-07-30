/* ------------------------------------------------------------------
   Socle commun : en-tête, pied de page, région, panier, alertes,
   cartes produit, carrousels. Chargé sur toutes les pages.
   ------------------------------------------------------------------ */

const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

const prix = (n) =>
  n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });

/* ================= Icônes (SVG inline, aucun fichier externe) ====== */
const ICONES = {
  panier: '<svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  croix: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  gauche: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  droite: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  chevron: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  cadenas: '<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  colis: '<svg viewBox="0 0 24 24"><path d="M3 8l9-4 9 4v9l-9 4-9-4V8z"/><path d="M3 8l9 4 9-4M12 12v9"/></svg>',
  retour: '<svg viewBox="0 0 24 24"><path d="M4 9h11a5 5 0 0 1 0 10h-4"/><path d="M8 5L4 9l4 4"/></svg>',
  message: '<svg viewBox="0 0 24 24"><path d="M4 5h16v12H9l-5 4V5z"/></svg>',
  perle: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6L20 10l-4 4.2.9 6-4.9-2.8L7.1 20 8 14.2 4 10l5.4-1.4L12 3z"/></svg>',
  loupe: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/></svg>',
  camion: '<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3V7z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
};

/* ================= Stockage tolérant ===============================
   Safari sur iPhone interdit localStorage aux pages ouvertes en
   file:// et lève une exception à la simple lecture. On bascule alors
   sur une mémoire de session : le site reste utilisable, seules les
   préférences ne survivent pas à la fermeture de l'onglet.          */
const Stockage = (function () {
  let disponible = false;
  try {
    localStorage.setItem("__test", "1");
    localStorage.removeItem("__test");
    disponible = true;
  } catch (e) {
    disponible = false;
  }
  const memoire = {};
  return {
    persistant: disponible,
    lire(cle) {
      try {
        if (disponible) return localStorage.getItem(cle);
      } catch (e) {
        /* ignoré : on retombe sur la mémoire */
      }
      return memoire[cle] !== undefined ? memoire[cle] : null;
    },
    ecrire(cle, valeur) {
      memoire[cle] = valeur;
      try {
        if (disponible) localStorage.setItem(cle, valeur);
      } catch (e) {
        /* ignoré */
      }
    },
  };
})();

/* ================= Régions ========================================= */
const REGIONS = {
  fr: {
    id: "fr",
    nom: "France",
    detail: "Colissimo suivi — 6,90 €",
    port: 6.9,
    delai: "2 à 4 jours ouvrés",
    franco: 150,
  },
  ue: {
    id: "ue",
    nom: "Union européenne",
    detail: "Envoi suivi — 14,90 €",
    port: 14.9,
    delai: "4 à 8 jours ouvrés",
    franco: 250,
  },
  monde: {
    id: "monde",
    nom: "Reste du monde",
    detail: "Envoi suivi — 29,90 €",
    port: 29.9,
    delai: "8 à 15 jours ouvrés",
    franco: null,
  },
};

const Region = {
  cle: "malle_region",
  actuelle() {
    return REGIONS[Stockage.lire(this.cle)] || REGIONS.fr;
  },
  definir(id) {
    if (!REGIONS[id]) return;
    Stockage.ecrire(this.cle, id);
    document.dispatchEvent(new CustomEvent("region:changee", { detail: REGIONS[id] }));
  },
};

/* ================= Panier ========================================== */
const Panier = {
  cle: "malle_panier",
  lire() {
    try {
      return JSON.parse(Stockage.lire(this.cle)) || [];
    } catch (e) {
      return [];
    }
  },
  ecrire(refs) {
    Stockage.ecrire(this.cle, JSON.stringify(refs));
    document.dispatchEvent(new Event("panier:change"));
  },
  contient(ref) {
    return this.lire().includes(ref);
  },
  ajouter(ref) {
    const refs = this.lire();
    if (refs.includes(ref)) return false; // pièce unique : jamais deux fois
    refs.push(ref);
    this.ecrire(refs);
    return true;
  },
  retirer(ref) {
    this.ecrire(this.lire().filter((r) => r !== ref));
  },
  produits() {
    return this.lire().map(produitParRef).filter(Boolean);
  },
  total() {
    return this.produits().reduce((t, p) => t + p.prix, 0);
  },
};

/* ================= Alertes « m'alerter si disponible » ============= */
const Alertes = {
  cle: "malle_alertes",
  lire() {
    try {
      return JSON.parse(Stockage.lire(this.cle)) || {};
    } catch (e) {
      return {};
    }
  },
  enregistrer(ref, email) {
    const a = this.lire();
    a[ref] = email;
    Stockage.ecrire(this.cle, JSON.stringify(a));
  },
  aDejaDemande(ref) {
    return Boolean(this.lire()[ref]);
  },
};

/* ================= Petits composants =============================== */
function etoiles(note, compte, grand) {
  if (note === null || note === undefined) return "";
  const pleines = Math.round(note);
  const glyphes = "★★★★★".slice(0, pleines) + "☆☆☆☆☆".slice(0, 5 - pleines);
  return `<span class="etoiles${grand ? " etoiles--grand" : ""}" aria-label="Note ${note} sur 5">
    <span class="etoiles__glyphes" aria-hidden="true">${glyphes}</span>
    ${compte !== undefined ? `<span class="etoiles__compte">${compte} avis</span>` : ""}
  </span>`;
}

function toast(texte) {
  let el = $(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = texte;
  requestAnimationFrame(() => el.classList.add("visible"));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("visible"), 3200);
}

/* Badge de rareté — jamais agressif, seulement informatif */
function badgesProduit(p) {
  const out = [];
  if (p.stock > 0) {
    out.push(
      `<span class="badge badge--unique">${ICONES.perle} Pièce unique — 1 seul exemplaire</span>`
    );
    if (p.coupDeCoeur) out.push(`<span class="badge badge--coup">Coup de cœur</span>`);
  } else {
    out.push(`<span class="badge badge--epuise">Pièce partie</span>`);
  }
  return out.join("");
}

function badgesCarte(p) {
  if (p.stock === 0) return `<span class="badge badge--epuise">Pièce partie</span>`;
  const b = [`<span class="badge badge--unique">${ICONES.perle} Pièce unique</span>`];
  if (p.coupDeCoeur) b.push(`<span class="badge badge--coup">Coup de cœur</span>`);
  return b.join("");
}

/** Carte produit réutilisée partout (grille, carrousels, résultats). */
function carteProduit(p) {
  const vues = galerieProduit(p);
  const note = noteMoyenne(p.ref);
  const nb = avisDuProduit(p.ref).length;
  const epuise = p.stock === 0;
  return `
  <article class="carte${epuise ? " carte--epuise" : ""}" data-ref="${p.ref}">
    <a class="carte__media" href="produit.html?ref=${p.ref}" aria-label="${p.nom}">
      <div class="badges">${badgesCarte(p)}</div>
      <img src="${vues[0]}" alt="${p.nom}" loading="lazy" width="600" height="600">
      <img class="carte__survol" src="${vues[1]}" alt="" aria-hidden="true" loading="lazy" width="600" height="600">
    </a>
    <div class="carte__corps">
      <span class="carte__ref">${p.ref} · ${universParSlug(p.univers).nom}</span>
      <a href="produit.html?ref=${p.ref}"><h3 class="carte__nom">${p.nom}</h3></a>
      ${note ? etoiles(note, nb) : ""}
      <div class="carte__prix">${prix(p.prix)}${epuise ? "" : ' <small>— frais de port à part</small>'}</div>
      ${
        epuise
          ? `<button class="btn btn--fantome btn--petit btn--bloc carte__alerte" data-alerte="${p.ref}">M'alerter si disponible</button>`
          : ""
      }
    </div>
  </article>`;
}

/* ================= En-tête et pied de page ========================= */
function pageCourante() {
  const f = location.pathname.split("/").pop() || "index.html";
  return f;
}

function construireEntete() {
  const region = Region.actuelle();
  const liensUnivers = UNIVERS.map(
    (u) => `<li><a href="boutique.html?univers=${u.slug}">${u.nom}</a></li>`
  ).join("");

  const html = `
  <div class="annonce">
    <div class="enveloppe">
      <span class="annonce__texte">Chaque pièce est unique — emballage soigné et réponse sous 24 h avant achat</span>
      <div class="region">
        <button class="region__btn" id="region-btn" aria-haspopup="true" aria-expanded="false">
          <span id="region-nom">${region.nom}</span>${ICONES.chevron}
        </button>
        <div class="region__menu" id="region-menu" role="menu">
          ${Object.values(REGIONS)
            .map(
              (r) => `<button role="menuitemradio" data-region="${r.id}" aria-checked="${
                r.id === region.id
              }">${r.nom}<small>${r.detail} · ${r.delai}</small></button>`
            )
            .join("")}
        </div>
      </div>
    </div>
  </div>

  <header class="entete">
    <div class="enveloppe">
      <div class="entete__haut">
        <div class="entete__gauche">
          <button class="icone-btn burger" id="burger" aria-label="Ouvrir le menu">${ICONES.menu}</button>
          <a class="icone-btn" href="boutique.html">${ICONES.loupe}<span>Boutique</span></a>
        </div>
        <a class="marque" href="index.html">
          <span class="marque__nom">${BOUTIQUE.nom}</span>
          <span class="marque__sous">Brocante en ligne</span>
        </a>
        <div class="entete__actions">
          <a class="icone-btn" href="a-propos.html"><span>À propos</span></a>
          <button class="icone-btn" id="ouvrir-panier" aria-label="Ouvrir le panier">
            ${ICONES.panier}<span class="pastille" id="pastille-panier">0</span>
          </button>
        </div>
      </div>
    </div>
    <nav class="nav-principale" aria-label="Univers">
      <div class="enveloppe">
        <ul>
          <li><a href="boutique.html">Tout chiner</a></li>
          ${liensUnivers}
          <li><a href="a-propos.html">L'atelier</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <div class="menu-mobile" id="menu-mobile" aria-hidden="true">
    <div class="menu-mobile__haut">
      <span class="marque__nom" style="font-size:1.1rem">${BOUTIQUE.nom}</span>
      <button class="icone-btn" id="fermer-menu" aria-label="Fermer le menu">${ICONES.croix}</button>
    </div>
    <ul>
      <li><a href="boutique.html">Tout chiner</a></li>
      ${liensUnivers}
      <li><a href="a-propos.html">L'atelier — à propos</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="livraison-et-retours.html">Livraison &amp; retours</a></li>
    </ul>
    <div class="menu-mobile__bas">
      <p>Une question avant d'acheter ?<br><a class="lien-souligne" href="contact.html">${BOUTIQUE.email}</a></p>
    </div>
  </div>`;

  const hote = document.createElement("div");
  hote.innerHTML = html;
  document.body.prepend(hote);

  /* liens actifs */
  const page = pageCourante();
  $$(".nav-principale a").forEach((a) => {
    if (a.getAttribute("href").startsWith(page) && page !== "index.html") {
      a.setAttribute("aria-current", "page");
    }
  });

  /* menu mobile */
  const menu = $("#menu-mobile");
  $("#burger").addEventListener("click", () => {
    menu.classList.add("ouvert");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
  $("#fermer-menu").addEventListener("click", () => {
    menu.classList.remove("ouvert");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });

  /* sélecteur de région */
  const btnRegion = $("#region-btn");
  const menuRegion = $("#region-menu");
  btnRegion.addEventListener("click", (e) => {
    e.stopPropagation();
    const ouvert = menuRegion.classList.toggle("ouvert");
    btnRegion.setAttribute("aria-expanded", String(ouvert));
  });
  document.addEventListener("click", () => {
    menuRegion.classList.remove("ouvert");
    btnRegion.setAttribute("aria-expanded", "false");
  });
  menuRegion.addEventListener("click", (e) => {
    const b = e.target.closest("[data-region]");
    if (!b) return;
    Region.definir(b.dataset.region);
    $$("#region-menu [data-region]").forEach((x) =>
      x.setAttribute("aria-checked", String(x === b))
    );
    $("#region-nom").textContent = REGIONS[b.dataset.region].nom;
    toast("Livraison : " + REGIONS[b.dataset.region].nom + " — " + REGIONS[b.dataset.region].detail);
  });

  $("#ouvrir-panier").addEventListener("click", ouvrirPanier);
}

function construirePied() {
  const region = Region.actuelle();
  const html = `
  <footer class="pied">
    <div class="enveloppe">
      <div class="pied__grille">
        <div>
          <span class="pied__marque">${BOUTIQUE.nom}</span>
          <p>Brocante en ligne, sans boutique physique. Je chine, je nettoie, je vérifie et je photographie chaque pièce moi-même avant de la proposer ici.</p>
          <p><a class="lien-souligne" href="contact.html">${BOUTIQUE.email}</a></p>
        </div>
        <div>
          <h3>Les univers</h3>
          <ul>${UNIVERS.map(
            (u) => `<li><a href="boutique.html?univers=${u.slug}">${u.nom}</a></li>`
          ).join("")}</ul>
        </div>
        <div>
          <h3>La maison</h3>
          <ul>
            <li><a href="a-propos.html">À propos</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="livraison-et-retours.html">Livraison &amp; retours</a></li>
            <li><a href="cgv.html">Conditions générales de vente</a></li>
            <li><a href="mentions-legales.html">Mentions légales</a></li>
            <li><a href="confidentialite.html">Données personnelles</a></li>
          </ul>
        </div>
        <div>
          <h3>Avant d'acheter</h3>
          <p>Une question sur l'état, les dimensions ou une photo supplémentaire ? Écrivez-moi : je réponds sous 24 h, du lundi au samedi.</p>
          <p style="margin-top:14px"><strong style="color:var(--blanc)">Livraison ${region.nom}</strong><br>${region.detail} · ${region.delai}</p>
        </div>
      </div>
      <div class="pied__bas">
        <span>© ${new Date().getFullYear()} ${BOUTIQUE.nom} — vente d'objets anciens entre particulier et amateurs.</span>
        <div class="pied__paiement">
          <span>Carte bancaire</span><span>Virement</span><span>PayPal</span><span>Paiement sécurisé SSL</span>
        </div>
      </div>
    </div>
  </footer>`;
  const hote = document.createElement("div");
  hote.innerHTML = html;
  document.body.appendChild(hote);
}

/* ================= Panier : tiroir ================================= */
function construirePanier() {
  const html = `
  <div class="voile" id="voile"></div>
  <aside class="tiroir" id="tiroir-panier" aria-hidden="true" aria-label="Panier">
    <div class="tiroir__haut">
      <h2>Mon panier</h2>
      <button class="icone-btn" id="fermer-panier" aria-label="Fermer le panier">${ICONES.croix}</button>
    </div>
    <div class="tiroir__corps" id="panier-corps"></div>
    <div class="tiroir__bas" id="panier-bas"></div>
  </aside>`;
  const hote = document.createElement("div");
  hote.innerHTML = html;
  document.body.appendChild(hote);

  $("#voile").addEventListener("click", fermerPanier);
  $("#fermer-panier").addEventListener("click", fermerPanier);
  document.addEventListener("panier:change", rendrePanier);
  document.addEventListener("region:changee", rendrePanier);
  rendrePanier();
}

function ouvrirPanier() {
  $("#tiroir-panier").classList.add("ouvert");
  $("#tiroir-panier").setAttribute("aria-hidden", "false");
  $("#voile").classList.add("visible");
  document.body.style.overflow = "hidden";
}
function fermerPanier() {
  $("#tiroir-panier").classList.remove("ouvert");
  $("#tiroir-panier").setAttribute("aria-hidden", "true");
  $("#voile").classList.remove("visible");
  document.body.style.overflow = "";
}

function rendrePanier() {
  const corps = $("#panier-corps");
  const bas = $("#panier-bas");
  if (!corps) return;
  const articles = Panier.produits();
  const pastille = $("#pastille-panier");
  if (pastille) {
    pastille.textContent = articles.length;
    pastille.classList.toggle("visible", articles.length > 0);
  }

  if (!articles.length) {
    corps.innerHTML = `<p style="color:var(--encre-2)">Votre panier est vide.</p>
      <p><a class="lien-souligne" href="boutique.html">Venez flâner entre mes pages →</a></p>`;
    bas.innerHTML = "";
    return;
  }

  corps.innerHTML = articles
    .map(
      (p) => `<div class="ligne-panier">
      <img src="${imageProduit(p, 0)}" alt="${p.nom}">
      <div>
        <span class="ligne-panier__ref">${p.ref}</span>
        <div class="ligne-panier__nom">${p.nom}</div>
        <div class="ligne-panier__prix">${prix(p.prix)}</div>
        <button class="ligne-panier__retirer" data-retirer="${p.ref}">Retirer</button>
      </div>
    </div>`
    )
    .join("");

  const region = Region.actuelle();
  const sousTotal = Panier.total();
  const franco = region.franco !== null && sousTotal >= region.franco;
  const port = franco ? 0 : region.port;

  bas.innerHTML = `
    <div class="total-ligne"><span>Sous-total (${articles.length} pièce${articles.length > 1 ? "s" : ""})</span><span>${prix(sousTotal)}</span></div>
    <div class="total-ligne"><span>Livraison ${region.nom}</span><span>${franco ? "Offerte" : prix(port)}</span></div>
    ${
      region.franco !== null && !franco
        ? `<div class="total-ligne" style="color:var(--or)"><span>Plus que ${prix(region.franco - sousTotal)} pour le port offert</span></div>`
        : ""
    }
    <div class="total-ligne total-ligne--fort"><span>Total</span><span>${prix(sousTotal + port)}</span></div>
    <button class="btn btn--bloc" id="commander">Passer commande</button>
    <p style="font-size:.76rem;color:var(--encre-3);margin:12px 0 0;text-align:center">Paiement sécurisé · Emballage renforcé pour les pièces fragiles</p>`;

  $("#commander").addEventListener("click", () => {
    toast("Boutique de démonstration : le paiement en ligne n'est pas branché.");
  });
  $$("[data-retirer]", corps).forEach((b) =>
    b.addEventListener("click", () => Panier.retirer(b.dataset.retirer))
  );
}

/* ================= Modale d'alerte de disponibilité ================ */
function construireModaleAlerte() {
  const html = `
  <div class="modale" id="modale-alerte" role="dialog" aria-modal="true" aria-labelledby="titre-alerte">
    <div class="modale__fond" data-fermer-modale></div>
    <div class="modale__boite">
      <button class="modale__fermer" data-fermer-modale aria-label="Fermer">×</button>
      <p class="surtitre">Disponibilité</p>
      <h2 id="titre-alerte" style="font-size:1.3rem">M'alerter si cette pièce revient</h2>
      <p style="font-size:.9rem;color:var(--encre-2)" id="alerte-objet"></p>
      <p style="font-size:.86rem;color:var(--encre-2)">Chaque objet est unique : celui-ci est parti. Il m'arrive toutefois de retrouver une pièce très proche en chinant — laissez-moi votre adresse, je vous préviens en premier.</p>
      <form id="form-alerte" novalidate>
        <label class="champ"><span>Votre adresse e-mail</span>
          <input type="email" name="email" required placeholder="prenom@exemple.fr" autocomplete="email"></label>
        <button class="btn btn--bloc" type="submit">Me prévenir</button>
      </form>
      <div id="alerte-succes"></div>
    </div>
  </div>`;
  const hote = document.createElement("div");
  hote.innerHTML = html;
  document.body.appendChild(hote);

  const modale = $("#modale-alerte");
  $$("[data-fermer-modale]", modale).forEach((b) =>
    b.addEventListener("click", () => modale.classList.remove("ouverte"))
  );
  $("#form-alerte").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      $("#alerte-succes").innerHTML =
        `<div class="message-succes" style="background:#f6e7dd;border-color:#e6cdbc;color:#8a4a2c">Merci de saisir une adresse e-mail valide.</div>`;
      return;
    }
    Alertes.enregistrer(modale.dataset.ref, email);
    $("#alerte-succes").innerHTML =
      `<div class="message-succes">${ICONES.check} C'est noté. Je vous écris dès qu'une pièce comparable rejoint la boutique.</div>`;
    e.target.reset();
    setTimeout(() => {
      modale.classList.remove("ouverte");
      $("#alerte-succes").innerHTML = "";
    }, 2600);
  });

  /* délégation : tous les boutons « m'alerter » de la page */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-alerte]");
    if (!b) return;
    e.preventDefault();
    const p = produitParRef(b.dataset.alerte);
    modale.dataset.ref = b.dataset.alerte;
    $("#alerte-objet").innerHTML = p ? `<strong>${p.nom}</strong> — réf. ${p.ref}` : "";
    $("#alerte-succes").innerHTML = Alertes.aDejaDemande(b.dataset.alerte)
      ? `<div class="message-succes">Vous êtes déjà inscrit·e à l'alerte pour cette pièce.</div>`
      : "";
    modale.classList.add("ouverte");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modale.classList.remove("ouverte");
      fermerPanier();
    }
  });
}

/* ================= Carrousel ======================================= */
function activerCarrousels(ctx) {
  $$(".carrousel", ctx).forEach((car) => {
    const piste = $(".carrousel__piste", car);
    const prec = $("[data-prec]", car);
    const suiv = $("[data-suiv]", car);
    if (!piste || !prec || !suiv) return;

    const pas = () => piste.clientWidth * 0.8;
    prec.addEventListener("click", () => piste.scrollBy({ left: -pas(), behavior: "smooth" }));
    suiv.addEventListener("click", () => piste.scrollBy({ left: pas(), behavior: "smooth" }));

    const majEtat = () => {
      const max = piste.scrollWidth - piste.clientWidth - 4;
      prec.disabled = piste.scrollLeft <= 4;
      suiv.disabled = piste.scrollLeft >= max;
    };
    piste.addEventListener("scroll", majEtat, { passive: true });
    window.addEventListener("resize", majEtat);
    majEtat();
  });
}

/* Squelette HTML d'un carrousel */
function carrousel(cartesHtml) {
  return `<div class="carrousel">
    <div class="carrousel__piste">${cartesHtml}</div>
  </div>`;
}

function flechesCarrousel() {
  return `<div class="carrousel__fleches">
    <button class="carrousel__fleche" data-prec aria-label="Voir les pièces précédentes">${ICONES.gauche}</button>
    <button class="carrousel__fleche" data-suiv aria-label="Voir les pièces suivantes">${ICONES.droite}</button>
  </div>`;
}

/* ================= Accordéons ====================================== */
function activerAccordeons(ctx) {
  $$(".accordeon__titre", ctx).forEach((t) =>
    t.addEventListener("click", () => {
      const item = t.closest(".accordeon__item");
      const ouvert = item.classList.toggle("ouvert");
      t.setAttribute("aria-expanded", String(ouvert));
    })
  );
}

/* ================= Bandeau de réassurance ========================== */
function blocReassurance(riche) {
  const items = [
    [ICONES.cadenas, "Paiement sécurisé", "Transaction chiffrée, aucune donnée bancaire conservée."],
    [ICONES.colis, "Emballage renforcé", "Papier de soie, calage mousse et double cannelure pour le fragile."],
    [ICONES.retour, "Retour sous 14 jours", "Si la pièce ne vous plaît pas, elle repart et vous êtes remboursé·e."],
    [ICONES.message, "Réponse sous 24 h", "Une question, une photo en plus ? Écrivez-moi avant d'acheter."],
  ];
  return `<section class="reassurance${riche ? " reassurance--riche" : ""}">
    <div class="enveloppe">
      <div class="reassurance__grille">
        ${items
          .map(
            ([ic, t, d]) =>
              `<div class="reassurance__item">${ic}<div><strong>${t}</strong><span>${d}</span></div></div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

/* ================= Finalisation du rendu ============================
   Appelée après chaque rendu de page : remplit les emplacements
   déclarés en HTML et branche les composants interactifs.            */
function finaliserRendu(ctx) {
  /* Le bandeau réassurance est injecté là où la page l'a demandé */
  $$("[data-reassurance]", ctx).forEach((el) => {
    el.outerHTML = blocReassurance(el.dataset.reassurance === "riche");
  });

  /* Images illustratives sur les pages statiques : data-img="REF:vue" */
  $$("img[data-img]", ctx).forEach((img) => {
    const [ref, vue] = img.dataset.img.split(":");
    const p = produitParRef(ref);
    if (p) img.src = imageProduit(p, Number(vue) || 0);
  });

  /* Sélection de pièces sur les pages statiques : data-pieces="4" */
  $$("[data-pieces]", ctx).forEach((el) => {
    const n = Number(el.dataset.pieces) || 4;
    el.innerHTML = PRODUITS.filter((p) => p.stock > 0).slice(0, n).map(carteProduit).join("");
  });

  activerCarrousels(ctx);
  activerAccordeons(ctx);
}

/* ================= Démarrage ======================================= */
document.addEventListener("DOMContentLoaded", () => {
  try {
    construireEntete();
    if (typeof window.rendrePage === "function") window.rendrePage();
    construirePied();
    construirePanier();
    construireModaleAlerte();
    finaliserRendu();
  } catch (e) {
    /* plutôt qu'une page blanche muette, on dit ce qui s'est passé */
    const zone = document.getElementById("page") || document.body;
    zone.innerHTML =
      '<div style="max-width:640px;margin:60px auto;padding:0 22px;font-family:Georgia,serif">' +
      "<h1>Le site n'a pas pu s'afficher</h1>" +
      "<p>Une erreur est survenue au chargement de cette page :</p>" +
      '<p style="font-family:monospace;font-size:.85rem;background:#f4eee3;padding:14px;border-radius:3px">' +
      String(e && e.message ? e.message : e) +
      "</p></div>";
    throw e;
  }
});
