/* ------------------------------------------------------------------
   Fiche produit : galerie, badge « pièce unique », accroche puis
   détail historique, avis clients et pièces du même univers.
   ------------------------------------------------------------------ */

/* Avis laissés depuis le navigateur (démonstration, stockage local) */
const AvisLocaux = {
  cle: "malle_avis",
  tous() {
    try {
      return JSON.parse(Stockage.lire(this.cle)) || [];
    } catch (e) {
      return [];
    }
  },
  pour(ref) {
    return this.tous().filter((a) => a.refProduit === ref);
  },
  ajouter(avis) {
    const l = this.tous();
    l.unshift(avis);
    Stockage.ecrire(this.cle, JSON.stringify(l));
  },
};

function avisComplets(ref) {
  return AvisLocaux.pour(ref).concat(avisDuProduit(ref));
}

function moyenneComplete(ref) {
  const l = avisComplets(ref);
  if (!l.length) return null;
  return Math.round((l.reduce((t, a) => t + a.note, 0) / l.length) * 10) / 10;
}

window.rendrePage = function () {
  const cible = document.getElementById("page");
  const ref = new URLSearchParams(location.search).get("ref");
  const p = ref ? produitParRef(ref) : null;

  if (!p) {
    cible.innerHTML = `<div class="enveloppe"><div class="vide">
      <h1>Cette pièce n'existe pas (ou plus)</h1>
      <p>Le lien est peut-être ancien. Toutes les pièces disponibles sont dans la boutique.</p>
      <a class="btn" href="boutique.html">Retour à la boutique</a>
    </div></div>`;
    return;
  }

  document.title = `${p.nom} — ${BOUTIQUE.nom}`;
  const univers = universParSlug(p.univers);
  const vues = galerieProduit(p);
  const epuise = p.stock === 0;
  const note = moyenneComplete(p.ref);
  const region = Region.actuelle();

  const memeUnivers = produitsDeLUnivers(p.univers, { disponiblesSeulement: true })
    .filter((x) => x.ref !== p.ref)
    .slice(0, 8);
  const ailleurs = PRODUITS.filter((x) => x.stock > 0 && x.univers !== p.univers && x.coupDeCoeur).slice(0, 8);

  cible.innerHTML = `
  <div class="enveloppe">
    <nav class="fil-ariane" aria-label="Fil d'Ariane">
      <a href="index.html">Accueil</a><span>/</span>
      <a href="boutique.html?univers=${univers.slug}">${univers.nom}</a><span>/</span>
      ${p.nom}
    </nav>

    <div class="produit">
      <div>
        <div class="galerie__principale${epuise ? " galerie--epuise" : ""}">
          <img id="photo-principale" src="${vues[0]}" alt="${p.nom} — vue d'ensemble" width="600" height="600">
        </div>
        <div class="galerie__vignettes" id="vignettes">
          ${vues
            .map(
              (v, i) =>
                `<button data-vue="${i}" aria-current="${i === 0}" aria-label="Vue ${i + 1}"><img src="${v}" alt="" width="600" height="600"></button>`
            )
            .join("")}
        </div>
        <p style="font-size:.78rem;color:var(--encre-3);margin-top:10px">Trois vues de l'objet réel : vue d'ensemble, vue de trois quarts et détail. Besoin d'un autre angle ? <a class="lien-souligne" href="contact.html">Demandez-le-moi</a>.</p>
      </div>

      <div>
        <div class="produit__badges">${badgesProduit(p)}</div>
        <span class="produit__ref">Référence ${p.ref} · ${univers.nom}</span>
        <h1>${p.nom}</h1>
        ${note ? `<a href="#avis" style="display:inline-block">${etoiles(note, avisComplets(p.ref).length)}</a>` : ""}
        <div class="produit__prix">${prix(p.prix)}</div>
        <div class="produit__tva">Prix TTC — frais de port calculés selon votre région (${region.nom})</div>

        <p class="produit__accroche">${p.accroche}</p>
        <p class="produit__histoire">${p.histoire}</p>

        <div class="produit__achat">
          ${
            epuise
              ? `<div class="produit__epuise">
                   <strong>Cette pièce est partie.</strong>
                   <p>Elle n'existait qu'en un exemplaire et a trouvé preneur. Laissez-moi votre adresse : je vous préviens en premier si j'en retrouve une comparable en chinant.</p>
                   <button class="btn btn--bloc" data-alerte="${p.ref}">M'alerter si disponible</button>
                 </div>`
              : `<p class="produit__urgence"><span class="badge badge--dernier">${ICONES.perle} Dernier exemplaire disponible</span>
                   <span>Une fois parti, il ne revient pas : je ne vends que ce que je chine.</span></p>
                 <button class="btn btn--bloc" id="ajouter">Ajouter au panier — ${prix(p.prix)}</button>
                 <a class="btn btn--fantome btn--bloc" href="contact.html?ref=${p.ref}">Poser une question sur cette pièce</a>`
          }
        </div>

        <div class="livraison-note" id="note-livraison"></div>

        <div class="fiche-tech">
          <dl>
            <dt>Fabricant</dt><dd>${p.fabricant}</dd>
            <dt>Époque</dt><dd>${p.epoque}</dd>
            <dt>Matière</dt><dd>${p.matiere}</dd>
            <dt>Dimensions</dt><dd>${p.dimensions}</dd>
            <dt>État</dt><dd>${p.etat}</dd>
            <dt>Disponibilité</dt><dd>${epuise ? "Pièce partie — exemplaire unique" : "Disponible — 1 seul exemplaire"}</dd>
          </dl>
        </div>

        <div class="accordeon" style="margin-top:26px">
          <div class="accordeon__item">
            <button class="accordeon__titre" aria-expanded="false">Vérification et entretien ${ICONES.plus}</button>
            <div class="accordeon__contenu">
              <p>Chaque pièce est examinée à la main avant sa mise en ligne : bords passés au doigt, transparence contrôlée à la lumière, comptage des éléments pour les lots et les services. Les défauts constatés sont décrits ci-dessus et visibles sur les photos.</p>
              <p>Pour les faïences et porcelaines anciennes, préférez un lavage à la main à l'eau tiède. Le métal argenté se ravive au chiffon doux ; évitez les produits abrasifs qui useraient l'argenture.</p>
            </div>
          </div>
          <div class="accordeon__item">
            <button class="accordeon__titre" aria-expanded="false">Emballage et expédition ${ICONES.plus}</button>
            <div class="accordeon__contenu">
              <p>Papier de soie, calage mousse et carton double cannelure pour tout ce qui est fragile. Les verres et les cristaux partent emballés individuellement. Expédition en colis suivi sous 48 h ouvrées après commande, depuis la France.</p>
              <p>Livraison ${region.nom} : ${region.detail}, ${region.delai}.</p>
            </div>
          </div>
          <div class="accordeon__item">
            <button class="accordeon__titre" aria-expanded="false">Retours et remboursement ${ICONES.plus}</button>
            <div class="accordeon__contenu">
              <p>Vous disposez de 14 jours après réception pour changer d'avis, sans avoir à vous justifier. La pièce doit repartir dans son emballage d'origine. Le remboursement intervient sous 5 jours après réception du retour.</p>
              <p>Si un objet arrivait cassé malgré le soin de l'emballage, envoyez-moi une photo : je rembourse intégralement, transport compris.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div data-reassurance="fin"></div>

  <section class="section" id="avis">
    <div class="enveloppe">
      <div class="section__entete section__entete--ligne">
        <div>
          <p class="surtitre">Avis clients</p>
          <h2>Ce qu'en disent les acheteurs</h2>
        </div>
        ${note ? `<div>${etoiles(note, avisComplets(p.ref).length, true)}</div>` : ""}
      </div>
      <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:44px" class="avis-zone">
        <div class="avis-liste" id="avis-liste"></div>
        <div>
          <div style="background:var(--blanc);border:1px solid var(--ligne);border-radius:3px;padding:24px">
            <h3 style="font-size:1.05rem">Vous avez acheté cette pièce ?</h3>
            <p style="font-size:.86rem;color:var(--encre-2)">Votre retour aide les prochains acheteurs à se décider — surtout quand on achète un objet ancien sans pouvoir le toucher.</p>
            <form id="form-avis" novalidate>
              <label class="champ"><span>Votre prénom</span><input name="prenom" required maxlength="30" placeholder="Camille"></label>
              <label class="champ"><span>Votre note</span>
                <select name="note">
                  <option value="5">★★★★★ — Parfait</option>
                  <option value="4">★★★★☆ — Très bien</option>
                  <option value="3">★★★☆☆ — Correct</option>
                  <option value="2">★★☆☆☆ — Décevant</option>
                  <option value="1">★☆☆☆☆ — Mauvais</option>
                </select></label>
              <label class="champ"><span>Votre commentaire</span><textarea name="texte" rows="4" required maxlength="600" placeholder="L'objet correspond-il à la description ? L'emballage était-il soigné ?"></textarea></label>
              <button class="btn btn--bloc" type="submit">Publier mon avis</button>
            </form>
            <div id="avis-retour"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${
    memeUnivers.length
      ? `<section class="section section--papier">
          <div class="enveloppe">
            <div class="section__entete section__entete--ligne">
              <div>
                <p class="surtitre">Dans le même univers</p>
                <h2>${univers.nom}</h2>
              </div>
              ${flechesCarrousel()}
            </div>
            ${carrousel(memeUnivers.map(carteProduit).join(""))}
          </div>
        </section>`
      : ""
  }

  ${
    ailleurs.length
      ? `<section class="section">
          <div class="enveloppe">
            <div class="section__entete section__entete--ligne">
              <div>
                <p class="surtitre">Ailleurs dans la boutique</p>
                <h2>Mes coups de cœur du moment</h2>
              </div>
              ${flechesCarrousel()}
            </div>
            ${carrousel(ailleurs.map(carteProduit).join(""))}
          </div>
        </section>`
      : ""
  }

  <div data-reassurance="riche"></div>`;

  /* --- galerie --------------------------------------------------- */
  const photo = document.getElementById("photo-principale");
  document.getElementById("vignettes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-vue]");
    if (!b) return;
    const i = Number(b.dataset.vue);
    photo.src = vues[i];
    photo.alt = `${p.nom} — vue ${i + 1}`;
    $$("#vignettes button").forEach((x) => x.setAttribute("aria-current", String(x === b)));
  });

  /* --- panier ---------------------------------------------------- */
  const btn = document.getElementById("ajouter");
  if (btn) {
    const maj = () => {
      if (Panier.contient(p.ref)) {
        btn.textContent = "Déjà dans votre panier";
        btn.disabled = true;
      }
    };
    btn.addEventListener("click", () => {
      if (Panier.ajouter(p.ref)) {
        toast(`« ${p.nom} » a rejoint votre panier.`);
        ouvrirPanier();
      }
      maj();
    });
    document.addEventListener("panier:change", maj);
    maj();
  }

  /* --- note de livraison, suit la région choisie ------------------ */
  function majLivraison() {
    const r = Region.actuelle();
    const el = document.getElementById("note-livraison");
    if (!el) return;
    el.innerHTML = `${ICONES.camion}<div><strong>Livraison ${r.nom} — ${r.detail}</strong><br>
      Expédition sous 48 h ouvrées, ${r.delai}. Emballage renforcé pour les pièces fragiles.
      ${r.franco !== null ? `Port offert à partir de ${prix(r.franco)} d'achat.` : ""}</div>`;
  }
  document.addEventListener("region:changee", majLivraison);
  majLivraison();

  /* --- avis ------------------------------------------------------ */
  function dessinerAvis() {
    const l = avisComplets(p.ref);
    const zone = document.getElementById("avis-liste");
    if (!l.length) {
      zone.innerHTML = `<p style="color:var(--encre-2)">Aucun avis pour cette pièce — soyez la première personne à en laisser un.</p>`;
      return;
    }
    zone.innerHTML = l
      .map(
        (a) => `<article class="avis-ligne">
        <div class="avis-ligne__haut">
          ${etoiles(a.note)}
          <span class="avis-ligne__nom">${a.prenom}</span>
          ${a.ville ? `<span class="avis-ligne__date">${a.ville}</span>` : ""}
          <span class="avis-ligne__date">${a.date}</span>
          ${a.local ? "" : `<span class="avis-ligne__verifie">Achat vérifié</span>`}
        </div>
        <p>${a.texte}</p>
      </article>`
      )
      .join("");
  }

  document.getElementById("form-avis").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const prenom = f.prenom.value.trim();
    const texte = f.texte.value.trim();
    const retour = document.getElementById("avis-retour");
    if (prenom.length < 2 || texte.length < 10) {
      retour.innerHTML = `<div class="message-succes" style="background:#f6e7dd;border-color:#e6cdbc;color:#8a4a2c">Merci d'indiquer un prénom et un commentaire d'au moins dix caractères.</div>`;
      return;
    }
    AvisLocaux.ajouter({
      prenom: prenom.replace(/[<>]/g, ""),
      note: Number(f.note.value),
      texte: texte.replace(/[<>]/g, ""),
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      refProduit: p.ref,
      local: true,
    });
    f.reset();
    retour.innerHTML = `<div class="message-succes">${ICONES.check} Merci ! Votre avis est publié ci-contre.</div>`;
    dessinerAvis();
    setTimeout(() => (retour.innerHTML = ""), 4000);
  });

  dessinerAvis();
};
