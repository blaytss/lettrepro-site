// Animation d'ouverture de l'appli : le score monte à 100 %, « +6 crédits » et confettis.
// Jouée une seule fois par ouverture (pas à chaque changement de page).
// Au lancement, l'appli enchaîne souvent 2 ou 3 pages (accueil -> connexion -> tableau de bord) :
// l'animation reprend là où elle en était sur chaque page, et n'est « finie » qu'une fois arrivée à 100 %.
// Sa durée suit la connexion : le cercle avance tant que la page et ses données chargent,
// et n'atteint 100 % que lorsque tout est prêt.
(function () {
  var t0;   // moment où l'animation a commencé (gardé d'une page à l'autre)
  try {
    if (sessionStorage.getItem('lp_splash') === 'fini') return;
    t0 = +sessionStorage.getItem('lp_splash_t0') || 0;
    if (t0 && Date.now() - t0 > 15000) { sessionStorage.setItem('lp_splash', 'fini'); return; }
    if (!t0) { t0 = Date.now(); sessionStorage.setItem('lp_splash_t0', t0); }
  } catch (e) { return; }

  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COULEURS = ['#E8692A', '#F5A462', '#C0501A', '#F5A524', '#FDDCC8', '#1C1107'];
  var TOUR = 345;            // périmètre du cercle
  var PALIER = 0.9;          // le cercle ne dépasse pas 90 % tant que ce n'est pas prêt
  var DUREE_FIN = 350;       // dernier bout jusqu'à 100 % une fois prêt
  var DUREE_FETE = 1000;     // temps laissé aux confettis avant de fermer
  var ATTENTE_MAX = 8000;    // connexion très lente : on n'attend pas plus

  var css =
    '#lp-splash{position:fixed;inset:0;z-index:99999;background:#FEF9F6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;transition:opacity .35s ease;font-family:Sora,Inter,system-ui,sans-serif}' +
    '#lp-splash.out{opacity:0;pointer-events:none}' +
    '#lp-splash .ring{position:relative;width:132px;height:132px}' +
    '#lp-splash .ring svg{display:block}' +
    '#lp-splash .fill{stroke-dasharray:' + TOUR + ';stroke-dashoffset:' + TOUR + ';transform:rotate(-90deg);transform-origin:66px 66px}' +
    '#lp-splash .num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:28px;color:#1C1107}' +
    '#lp-splash .bonus{position:absolute;right:-34px;top:-8px;background:#E8692A;color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;white-space:nowrap;transform:scale(0)}' +
    '#lp-splash.done .bonus{animation:lpsPop .45s ease-out forwards}' +
    '#lp-splash .logo{font-weight:800;font-size:24px;color:#1C1107;letter-spacing:-.01em}' +
    '#lp-splash .logo b{color:#E8692A;font-weight:800}' +
    '#lp-splash .cf{position:absolute;left:50%;top:50%;width:8px;height:12px;margin:-6px 0 0 -4px;border-radius:2px;opacity:0}' +
    '#lp-splash .cf.r{border-radius:50%;height:8px}' +
    '#lp-splash.done .cf{animation:lpsConf 1.25s cubic-bezier(.15,.6,.3,1) forwards}' +
    '@keyframes lpsPop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}' +
    '@keyframes lpsConf{0%{opacity:1;transform:translate(0,0) rotate(0)}55%{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--r))}100%{opacity:0;transform:translate(calc(var(--x)*1.15),calc(var(--y) + 150px)) rotate(calc(var(--r)*1.6))}}';

  var confettis = '';
  if (!calme) {
    for (var i = 0; i < 38; i++) {
      var angle = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 130;
      confettis += '<i class="cf' + (i % 4 === 0 ? ' r' : '') + '" style="background:' + COULEURS[i % COULEURS.length] +
        ';--x:' + Math.round(Math.cos(angle) * dist) + 'px;--y:' + Math.round(Math.sin(angle) * dist - 50) + 'px;--r:' +
        Math.round(Math.random() * 720 - 360) + 'deg;animation-delay:' + Math.round(Math.random() * 140) + 'ms"></i>';
    }
  }

  var style = document.createElement('style');
  style.textContent = css;
  var el = document.createElement('div');
  el.id = 'lp-splash';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="ring">' +
      '<svg width="132" height="132" viewBox="0 0 132 132" fill="none"><circle cx="66" cy="66" r="55" stroke="#FDDCC8" stroke-width="11"/>' +
      '<circle class="fill" cx="66" cy="66" r="55" stroke="#E8692A" stroke-width="11" stroke-linecap="round"/></svg>' +
      '<div class="num">0%</div><div class="bonus">+6 crédits</div>' + confettis +
    '</div>' +
    '<div class="logo">Lettre<b>Pro</b></div>';
  document.documentElement.appendChild(style);
  document.documentElement.appendChild(el);

  var num = el.querySelector('.num'), fill = el.querySelector('.fill');
  function affiche(p) {
    fill.style.strokeDashoffset = TOUR * (1 - p);
    num.textContent = Math.round(p * 100) + '%';
  }

  // ── « Prêt » = page chargée ET plus aucun appel au serveur en cours ──
  var pret = false, charge = document.readyState === 'complete', enCours = 0, calmeTimer = null;
  var fetchOrigine = window.fetch;
  function verifie() {
    clearTimeout(calmeTimer);
    if (pret || !charge || enCours > 0) return;
    calmeTimer = setTimeout(function () { if (enCours === 0) estPret(); }, 150);
  }
  function estPret() {
    if (pret) return;
    pret = true;
    if (fetchOrigine && window.fetch === fetchSuivi) window.fetch = fetchOrigine;
  }
  function fetchSuivi() {
    if (pret) return fetchOrigine.apply(this, arguments);
    enCours++;
    var fini = function () { enCours--; verifie(); };
    var p = fetchOrigine.apply(this, arguments);
    p.then(fini, fini);
    return p;
  }
  if (fetchOrigine) window.fetch = fetchSuivi;
  if (charge) verifie();
  else window.addEventListener('load', function () { charge = true; verifie(); });
  setTimeout(estPret, ATTENTE_MAX);

  // ── Progression : avance vers 90 % pendant le chargement, file à 100 % dès que c'est prêt ──
  var p = PALIER * (1 - Math.exp(-(Date.now() - t0) / 1200));   // reprise si on arrive d'une autre page
  var dernier = Date.now(), finDebut = 0, finDepuis = 0, ferme = false;
  affiche(p);
  function fermer() {
    if (ferme) return;
    ferme = true;
    el.classList.add('out');
    setTimeout(function () { el.remove(); style.remove(); }, 400);
  }
  function termine() {
    try { sessionStorage.setItem('lp_splash', 'fini'); } catch (e) {}
    affiche(1);
    el.classList.add('done');
    setTimeout(fermer, calme ? 400 : DUREE_FETE);
  }
  function pas() {
    var t = Date.now(), dt = t - dernier;
    dernier = t;
    if (!pret) {
      p += (PALIER - p) * (1 - Math.exp(-dt / 1200));
    } else {
      if (!finDebut) { finDebut = t; finDepuis = p; }
      var k = Math.min(1, (t - finDebut) / DUREE_FIN);
      p = finDepuis + (1 - finDepuis) * k;
      if (k >= 1) return termine();
    }
    affiche(p);
    setTimeout(pas, 16);
  }
  setTimeout(fermer, ATTENTE_MAX + 2500);   // filet de sécurité (ex. onglet en arrière-plan)
  if (calme) {
    (function attend() { if (pret) termine(); else setTimeout(attend, 100); })();
  } else {
    setTimeout(pas, 16);
  }
})();
