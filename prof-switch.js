/* ══════════════════════════════════════════════════════════════
   Sélecteur « 💼 Travail / 🏫 Établissement » pour les profs qui ont
   À LA FOIS un profil prof marketplace ET une appartenance établissement.
   S'affiche en haut au centre. Ne s'affiche que si les deux espaces existent.
   ══════════════════════════════════════════════════════════════ */
(function () {
  var API = window.API_BASE;
  var token = localStorage.getItem('lp_token');
  if (!token) return;
  var here = (location.pathname.split('/').pop() || '').toLowerCase();
  var TRAVAIL = ['prof-dashboard.html', 'prof-visios.html'];
  var onTravail = TRAVAIL.indexOf(here) >= 0;

  function h(p) { return fetch(API + p, { headers: { 'Authorization': 'Bearer ' + token } }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }

  Promise.all([h('/api/prof/me'), h('/api/etablissement/me')]).then(function (res) {
    var prof = res[0], me = res[1];
    var isProf = prof && prof.id;
    if (!isProf || !me) return;   // besoin des DEUX espaces pour afficher le switch

    var perms = me.permissions || [];
    var staff = (me.role && me.role.est_proviseur) || ['gerer_roles', 'gerer_membres', 'gerer_classes'].some(function (p) { return perms.indexOf(p) >= 0; });
    var isEtabProf = ['creer_devoirs', 'corriger_devoirs'].some(function (p) { return perms.indexOf(p) >= 0; });
    var etabDest = staff ? 'proviseur-dashboard.html' : (isEtabProf ? 'prof-classes.html' : 'vie-scolaire.html');

    function pill(txt, href, active) {
      return '<a href="' + href + '" style="padding:.42rem 1.05rem;border-radius:999px;font-size:.84rem;font-weight:' +
        (active ? '700' : '600') + ';text-decoration:none;white-space:nowrap;' +
        (active ? 'background:var(--orange,#E8692A);color:#fff' : 'color:var(--muted,#9A8A78)') + '">' + txt + '</a>';
    }
    var wrap = document.createElement('div');
    wrap.id = 'prof-mode-switch';
    wrap.innerHTML = pill('💼 Travail', 'prof-dashboard.html', onTravail) + pill('🏫 Établissement', etabDest, !onTravail);
    // Sur les pages élève/établissement, on remplace le sélecteur élève « Travail / Vie scolaire »
    var ms = document.getElementById('mode-switch');
    if (ms) ms.style.display = 'none';

    var nav = document.querySelector('nav');
    if (nav) {
      // Inséré DANS la barre, juste après le logo, collé à gauche (margin-right:auto pousse le reste à droite)
      wrap.style.cssText = 'display:inline-flex;gap:.2rem;align-items:center;background:var(--card,#231E17);' +
        'border:1px solid var(--border,#3A2F22);border-radius:999px;padding:.22rem;margin:0 auto 0 .9rem;flex:0 0 auto';
      var logo = nav.querySelector('.nav-logo');
      var anchor = (logo && logo.closest('nav > *')) || nav.firstElementChild;
      if (anchor && anchor.parentNode === nav) nav.insertBefore(wrap, anchor.nextSibling);
      else nav.appendChild(wrap);
    } else {
      wrap.style.cssText = 'position:fixed;top:.55rem;left:50%;transform:translateX(-50%);z-index:500;display:flex;gap:.2rem;' +
        'background:var(--card,#231E17);border:1px solid var(--border,#3A2F22);border-radius:999px;padding:.22rem;box-shadow:0 6px 20px rgba(0,0,0,.35)';
      document.body.appendChild(wrap);
    }
  });
})();
