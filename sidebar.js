// sidebar.js — réutilise le VRAI menu latéral du dashboard (mêmes classes/CSS) sur les autres pages.
// Desktop uniquement (< 900px : masqué, les pages gardent leur affichage mobile).
(function () {
  try { if (!localStorage.getItem('lp_token')) return; } catch (e) { return; }

  var API = (window.API_BASE || '');
  var page = (location.pathname.split('/').pop() || '').toLowerCase();
  var tok = localStorage.getItem('lp_token');

  // CSS repris à l'identique du dashboard (.sidebar-item etc.), scopé sous #lp-ss.
  var css =
    '#lp-ss{display:none}' +
    '@media(min-width:900px){' +
      'body.lp-ss-on{padding-left:220px!important}' +
      '#lp-ss{display:flex!important;flex-direction:column;gap:.25rem;position:fixed;top:0;left:0;width:220px;height:100vh;overflow-y:auto;background:var(--surface,#fff);border-right:1px solid var(--border,#eee);padding:1.5rem 1rem;z-index:50}' +
    '}' +
    "#lp-ss .sidebar-item{display:flex;align-items:center;gap:.65rem;padding:.65rem .85rem;border-radius:var(--radius-sm,10px);font-size:.88rem;font-weight:500;color:var(--muted,#8b6e5a);cursor:pointer;transition:all .2s ease;text-decoration:none;border:none;background:none;width:100%;text-align:left}" +
    '#lp-ss .sidebar-item:hover{background:var(--card,#fff4ee);color:var(--text,#1c1107);transform:translateX(2px)}' +
    '#lp-ss .sidebar-item.active{background:var(--orange-glow,rgba(232,105,42,.15));color:var(--orange,#e8692a);font-weight:700;box-shadow:inset 3px 0 0 var(--orange,#e8692a)}' +
    '#lp-ss .sidebar-item .icon{font-size:1rem;width:20px;text-align:center;flex:0 0 auto}' +
    '#lp-ss .sidebar-sep{height:1px;background:var(--border,#eee);margin:.75rem 0}';

  // Markup repris du dashboard ; les onglets internes pointent vers dashboard.html?p=…
  var html =
    '<a class="sidebar-item" href="dashboard.html?p=generate"><span class="icon">✦</span> Générer une lettre</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=cv"><span class="icon">📄</span> Créer un CV</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=improve"><span class="icon">✏️</span> Améliorer</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=study"><span class="icon">📚</span> Cours &amp; Révisions</a>' +
    '<a class="sidebar-item" href="explorer.html"><span class="icon">🔍</span> Explorer les profs</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=myprofs"><span class="icon">👨‍🏫</span> Mes profs</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=classes"><span class="icon">🎓</span> Mes classes</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=planning"><span class="icon">📅</span> Mon planning</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=quete"><span class="icon">🎯</span> Quête du jour</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=cahiers"><span class="icon">🏖️</span> Cahier de vacances</a>' +
    '<a class="sidebar-item" id="lp-salles-link" href="salles.html"><span class="icon">🧑‍🤝‍🧑</span> Salles de travail</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=history"><span class="icon">📄</span> Mes lettres</a>' +
    '<a class="sidebar-item" href="ambassadeur.html"><span class="icon">👑</span> Ambassadeur</a>' +
    '<div class="sidebar-sep"></div>' +
    '<a class="sidebar-item" href="dashboard.html?p=credits"><span class="icon">💳</span> Crédits</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=abonnement"><span class="icon">⚡</span> Abonnement</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=apparence"><span class="icon">🎨</span> Apparence</a>' +
    '<a class="sidebar-item" href="dashboard.html?p=account"><span class="icon">👤</span> Mon compte</a>';

  function mount() {
    if (document.getElementById('lp-ss')) return;
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var aside = document.createElement('aside'); aside.id = 'lp-ss'; aside.innerHTML = html;
    document.body.appendChild(aside);
    document.body.classList.add('lp-ss-on');

    // Onglet actif = page courante
    aside.querySelectorAll('.sidebar-item').forEach(function (a) {
      var href = (a.getAttribute('href') || '');
      if (page && href.indexOf('dashboard.html') === -1 && href.split('?')[0] === page) a.classList.add('active');
    });

    // Lien Admin (mêmes emails que le dashboard) + solde "Salles" selon la config.
    var ADMIN_EMAILS_FRONT = ['sacha@alphabot.com'];
    fetch(API + '/api/me', { headers: { Authorization: 'Bearer ' + tok } })
      .then(function (r) { return r.json(); }).then(function (d) {
        var email = ((d.user || {}).email || '').toLowerCase();
        if (ADMIN_EMAILS_FRONT.indexOf(email) !== -1 && !document.getElementById('lp-admin-link')) {
          var link = document.createElement('a');
          link.id = 'lp-admin-link'; link.href = 'admin.html'; link.className = 'sidebar-item';
          link.innerHTML = '<span class="icon">📊</span> Admin';
          aside.insertBefore(link, aside.firstChild);
        }
      }).catch(function () {});

    fetch(API + '/api/auth/config').then(function (r) { return r.json(); }).then(function (c) {
      if (c && c.salles_enabled === false) { var s = document.getElementById('lp-salles-link'); if (s) s.style.display = 'none'; }
    }).catch(function () {});
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
