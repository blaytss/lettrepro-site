// sidebar.js — menu latéral partagé (desktop) injecté sur les pages hors dashboard.
// Sur mobile (< 900px) il est masqué : les pages gardent leur affichage actuel.
(function () {
  try { if (!localStorage.getItem('lp_token')) return; } catch (e) { return; }

  var page = (location.pathname.split('/').pop() || '').toLowerCase();
  var SEP = '__sep__';
  var items = [
    ['✦', 'Générer une lettre', 'dashboard.html?p=generate', 'generate'],
    ['📄', 'Créer un CV', 'cv.html', 'cv'],
    ['✏️', 'Améliorer', 'dashboard.html?p=improve', 'improve'],
    ['📚', 'Cours & Révisions', 'dashboard.html?p=study', 'study'],
    ['🔍', 'Explorer les profs', 'explorer.html', 'explorer'],
    ['👨‍🏫', 'Mes profs', 'dashboard.html?p=myprofs', 'myprofs'],
    ['🎓', 'Mes classes', 'dashboard.html?p=classes', 'classes'],
    ['📅', 'Mon planning', 'dashboard.html?p=planning', 'planning'],
    ['🎯', 'Quête du jour', 'dashboard.html?p=quete', 'quete'],
    ['🏖️', 'Cahier de vacances', 'dashboard.html?p=cahiers', 'cahiers'],
    ['📄', 'Mes lettres', 'dashboard.html?p=history', 'history'],
    ['👑', 'Ambassadeur', 'ambassadeur.html', 'ambassadeur'],
    SEP,
    ['💳', 'Crédits', 'dashboard.html?p=credits', 'credits'],
    ['⚡', 'Abonnement', 'dashboard.html?p=abonnement', 'abonnement'],
    ['🎨', 'Apparence', 'dashboard.html?p=apparence', 'apparence'],
    ['👤', 'Mon compte', 'dashboard.html?p=account', 'account']
  ];

  var activeByPage = {
    'cv.html': 'cv', 'ambassadeur.html': 'ambassadeur', 'explorer.html': 'explorer',
    'salles.html': 'salles', 'salle.html': 'salles', 'async.html': 'async'
  };
  var activeKey = activeByPage[page] || '';

  var css =
    '#lp-ss{display:none}' +
    '@media(min-width:900px){' +
      'body.lp-ss-on{padding-left:248px!important}' +
      '#lp-ss{display:flex;flex-direction:column;position:fixed;top:0;left:0;width:248px;height:100vh;overflow-y:auto;background:var(--surface,#fff);border-right:1px solid var(--border,#eee);padding:1rem .7rem;z-index:40}' +
    '}' +
    '#lp-ss .lp-ss-logo{font-family:Sora,sans-serif;font-weight:800;font-size:1.2rem;color:var(--text,#1c1107);text-decoration:none;padding:.3rem .6rem 1rem;display:block}' +
    '#lp-ss .lp-ss-logo span{color:var(--orange,#e8692a)}' +
    '#lp-ss a.lp-ss-item{display:flex;align-items:center;gap:.6rem;padding:.55rem .7rem;border-radius:10px;color:var(--text,#1c1107);text-decoration:none;font-size:.9rem;font-weight:600;margin-bottom:.12rem}' +
    '#lp-ss a.lp-ss-item:hover{background:var(--card,#fff4ee)}' +
    '#lp-ss a.lp-ss-item.active{background:var(--orange-glow,rgba(232,105,42,.15));color:var(--orange,#e8692a)}' +
    '#lp-ss a.lp-ss-item .ic{font-size:1.02rem;width:1.3rem;text-align:center;flex:0 0 auto}' +
    '#lp-ss .lp-ss-sep{height:1px;background:var(--border,#eee);margin:.6rem .3rem}';

  var html = '<a class="lp-ss-logo" href="dashboard.html">Lettre<span>Pro</span></a>';
  items.forEach(function (it) {
    if (it === SEP) { html += '<div class="lp-ss-sep"></div>'; return; }
    var active = (it[3] === activeKey) ? ' active' : '';
    html += '<a class="lp-ss-item' + active + '" href="' + it[2] + '"><span class="ic">' + it[0] + '</span>' + it[1] + '</a>';
  });

  function mount() {
    if (document.getElementById('lp-ss')) return;
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var nav = document.createElement('nav'); nav.id = 'lp-ss'; nav.innerHTML = html;
    document.body.appendChild(nav);
    document.body.classList.add('lp-ss-on');
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
