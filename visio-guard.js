// visio-guard.js — masque toutes les entrées visio quand la fonctionnalité est désactivée.
// Marche aussi sur les liens ajoutés dynamiquement (règle CSS + attribut sur <html>).
// À inclure sur toute page qui contient un lien/bouton vers la visio.
(function () {
  var API = window.API_BASE;
  var css = document.createElement('style');
  css.textContent =
    'html[data-visio="off"] a[href*="visios.html"],' +
    'html[data-visio="off"] [data-visio]{display:none !important}';
  (document.head || document.documentElement).appendChild(css);
  fetch(API + '/api/auth/config')
    .then(function (r) { return r.json(); })
    .then(function (c) { if (!c.visio_enabled) document.documentElement.setAttribute('data-visio', 'off'); })
    .catch(function () {});
})();
