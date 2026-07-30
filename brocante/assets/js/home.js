/* ------------------------------------------------------------------
   Page d'accueil : un aperçu de chaque univers, jamais de pièce
   épuisée en avant, avis clients et bloc « à propos ».
   ------------------------------------------------------------------ */

window.rendrePage = function () {
  const cible = document.getElementById("page");
  const dispo = PRODUITS.filter((p) => p.stock > 0);

  /* --- Hero ---------------------------------------------------- */
  const vitrine = [
    produitParRef("AT-104"),
    produitParRef("VE-058"),
    produitParRef("TI-033"),
    produitParRef("DE-012"),
  ].filter(Boolean);

  const hero = `
  <section class="hero">
    <div class="enveloppe">
      <div class="hero__grille">
        <div class="hero__texte">
          <p class="surtitre">Brocante en ligne · pièces uniques</p>
          <h1>Venez flâner <em>entre mes pages</em></h1>
          <p>Des faïences dépareillées, du linge monogrammé, un peu d'argenterie et quelques gravures : tout ce que je rapporte des déballages du dimanche, nettoyé, vérifié et photographié pièce par pièce.</p>
          <div class="hero__actions">
            <a class="btn" href="boutique.html">Découvrir les pièces du moment</a>
            <a class="btn btn--fantome" href="#univers">Parcourir les univers</a>
          </div>
          <div class="hero__note">
            ${etoiles(noteMoyenneBoutique(), AVIS.length)}
            <span>· ${dispo.length} pièces disponibles aujourd'hui</span>
          </div>
        </div>
        <div class="hero__collage">
          ${vitrine
            .map(
              (p) =>
                `<a href="produit.html?ref=${p.ref}"><img src="${imageProduit(p, 0)}" alt="${p.nom}" width="600" height="600"></a>`
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>`;

  /* --- Coups de cœur (uniquement des pièces disponibles) -------- */
  const coups = coupsDeCoeur();
  const sectionCoups = `
  <section class="section section--serre">
    <div class="enveloppe">
      <div class="section__entete section__entete--ligne">
        <div>
          <p class="surtitre">Mes coups de cœur</p>
          <h2>Les pièces que j'ai eu du mal à mettre en vente</h2>
          <p>Toutes disponibles à l'instant où vous lisez ces lignes : je retire aussitôt ce qui est parti.</p>
        </div>
        ${flechesCarrousel()}
      </div>
      ${carrousel(coups.map(carteProduit).join(""))}
    </div>
  </section>`;

  /* --- Mosaïque : un aperçu de chaque univers ------------------- */
  const mosaique = `
  <section class="section section--papier" id="univers">
    <div class="enveloppe">
      <div class="section__entete centre">
        <p class="surtitre">Six univers</p>
        <h2>De la table au grenier</h2>
        <hr class="filet">
        <p>Je ne me limite pas à une seule famille d'objets : chaque semaine, la boutique mélange vaisselle, verrerie, argenterie, linge ancien, papiers et petite décoration.</p>
      </div>
      <div class="mosaique-univers">
        ${UNIVERS.map((u) => {
          const p = misEnAvantPourUnivers(u.slug, 1)[0];
          const nb = produitsDeLUnivers(u.slug, { disponiblesSeulement: true }).length;
          return `<a class="tuile" href="boutique.html?univers=${u.slug}">
            <img src="${imageProduit(p, 1)}" alt="${u.nom}" loading="lazy" width="600" height="600">
            <div class="tuile__legende">
              <strong>${u.nom}</strong>
              <span>${nb} pièce${nb > 1 ? "s" : ""} disponible${nb > 1 ? "s" : ""}</span>
            </div>
          </a>`;
        }).join("")}
      </div>
    </div>
  </section>`;

  /* --- Un carrousel par univers -------------------------------- */
  const blocsUnivers = UNIVERS.map((u, i) => {
    const liste = misEnAvantPourUnivers(u.slug, 8);
    return `
    <section class="section ${i % 2 ? "section--blanc" : ""} univers-bloc">
      <div class="enveloppe">
        <div class="section__entete section__entete--ligne">
          <div>
            <p class="surtitre">${u.nom}</p>
            <div class="univers-titre"><h2>${u.accroche}</h2></div>
            <p style="max-width:56ch;margin-top:8px">${u.intro}</p>
          </div>
          ${flechesCarrousel()}
        </div>
        ${carrousel(liste.map(carteProduit).join(""))}
        <p style="margin-top:6px"><a class="section__lien" href="boutique.html?univers=${u.slug}">Voir tout l'univers ${u.nom} →</a></p>
      </div>
    </section>`;
  }).join("");

  /* --- Avis clients -------------------------------------------- */
  const selection = AVIS.slice(0, 6);
  const sectionAvis = `
  <section class="section section--papier">
    <div class="enveloppe">
      <div class="section__entete centre">
        <p class="surtitre">Avis vérifiés</p>
        <h2>Ce qu'en disent nos clients</h2>
        <hr class="filet">
        <div class="avis-resume">
          <span class="avis-resume__note">${noteMoyenneBoutique().toString().replace(".", ",")}/5</span>
          <div class="avis-resume__detail">
            ${etoiles(noteMoyenneBoutique(), undefined, true)}<br>
            Moyenne sur ${AVIS.length} avis d'acheteurs, tous rattachés à une commande expédiée.
          </div>
        </div>
      </div>
      <div class="avis-grille">
        ${selection
          .map((a) => {
            const p = produitParRef(a.refProduit);
            return `<article class="avis-carte">
              ${etoiles(a.note)}
              <p class="avis-carte__texte">${a.texte}</p>
              <div class="avis-carte__pied">
                <strong>${a.prenom}</strong> · ${a.ville} · ${a.date}
                ${p ? `<a class="avis-carte__objet" href="produit.html?ref=${p.ref}">À propos de : ${p.nom}</a>` : ""}
              </div>
            </article>`;
          })
          .join("")}
      </div>
    </div>
  </section>`;

  /* --- À propos ------------------------------------------------ */
  const photosAtelier = [
    produitParRef("AR-042"),
    produitParRef("PA-018"),
    produitParRef("AT-112"),
    produitParRef("DE-019"),
  ].filter(Boolean);

  const sectionApropos = `
  <section class="section">
    <div class="enveloppe">
      <div class="apropos">
        <div class="apropos__images">
          ${photosAtelier.map((p, i) => `<img src="${imageProduit(p, i % 2 ? 2 : 0)}" alt="" loading="lazy" width="600" height="600">`).join("")}
        </div>
        <div>
          <p class="surtitre">À propos</p>
          <h2>Chineuse le samedi, emballeuse le lundi</h2>
          <hr class="filet gauche">
          <p>Je m'appelle Émilie. Je chine depuis quinze ans, d'abord pour ma propre maison, puis pour le plaisir de trouver à ces objets quelqu'un qui les regardera. Déballages de campagne à l'aube, ventes de succession, greniers vidés à la hâte : c'est là que je trouve les faïences dépareillées, le linge brodé au prénom d'une aïeule et les gravures oubliées dans un carton.</p>
          <p>Il n'y a pas de boutique à pousser : tout se passe ici, en ligne. C'est pour cela que je m'astreins à une règle simple — vous devez pouvoir acheter aussi sereinement que si vous teniez l'objet en main.</p>
          <ul class="liste-verif">
            <li>${ICONES.check}<span><strong>Chaque pièce est vérifiée à la main</strong> avant d'être mise en ligne : je passe le doigt sur les bords, je tiens les verres à la lumière, je compte les pièces des services.</span></li>
            <li>${ICONES.check}<span><strong>Les photos montrent l'objet réel</strong>, sous plusieurs angles, y compris les défauts — un éclat, une usure d'émail, une reprise ancienne.</span></li>
            <li>${ICONES.check}<span><strong>La description dit l'état honnêtement.</strong> Vous ne trouverez jamais « parfait état » sur une pièce qui a cent ans et qui a servi.</span></li>
            <li>${ICONES.check}<span><strong>Vous pouvez me demander une photo de plus</strong> avant d'acheter. Je réponds sous 24 h, du lundi au samedi.</span></li>
            <li>${ICONES.check}<span><strong>L'emballage est fait pour le fragile :</strong> papier de soie, calage, double cannelure, et le tout expédié en suivi.</span></li>
          </ul>
          <p class="apropos__signature">« Un objet qui repart chez quelqu'un, c'est un objet sauvé. »</p>
          <a class="btn btn--fantome" href="a-propos.html">Lire toute l'histoire</a>
        </div>
      </div>
    </div>
  </section>`;

  /* --- Réassurance finale -------------------------------------- */
  const finale = `
  <section class="section section--papier centre">
    <div class="enveloppe">
      <p class="surtitre">Une question avant d'acheter ?</p>
      <h2>Écrivez-moi, je réponds sous 24 h</h2>
      <hr class="filet">
      <p style="max-width:52ch;margin:0 auto 24px;color:var(--encre-2)">Dimensions exactes, photo d'un détail, précision sur un poinçon ou sur une usure : posez la question avant de commander, c'est toujours mieux que de découvrir en ouvrant le colis.</p>
      <a class="btn" href="contact.html">Poser ma question</a>
    </div>
  </section>`;

  cible.innerHTML =
    hero +
    `<div data-reassurance="fin"></div>` +
    sectionCoups +
    mosaique +
    blocsUnivers +
    sectionAvis +
    sectionApropos +
    finale +
    `<div data-reassurance="riche"></div>`;
};
