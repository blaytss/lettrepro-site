// legal-footer.js — pied de page légal commun (mentions, confidentialité, CGU/CGV, signalement DSA).
// À inclure sur toutes les pages accessibles aux utilisateurs.
(function () {
  if (document.getElementById('lp-legal-footer')) return;
  var links = [
    ['securite.html', '🛡️ Sécurité'],
    ['mentions-legales.html', 'Mentions légales'],
    ['confidentialite.html', 'Confidentialité'],
    ['cgu-cgv.html', 'CGU / CGV'],
    ['signalement.html', '⚠️ Signaler un problème']
  ];
  var muted = 'color:inherit;opacity:.85;margin:0 .55rem;text-decoration:underline;white-space:nowrap';
  var f = document.createElement('footer');
  f.id = 'lp-legal-footer';
  f.setAttribute('style',
    'margin-top:2.5rem;padding:1.4rem 1rem calc(1.4rem + env(safe-area-inset-bottom));text-align:center;' +
    'font-size:.8rem;color:#8B6E5A;border-top:1px solid rgba(140,110,90,.2);line-height:2');
  f.innerHTML = '© LettrePro' +
    links.map(function (l) { return '<a href="' + l[0] + '" style="' + muted + '">' + l[1] + '</a>'; }).join('');
  document.body.appendChild(f);
})();
