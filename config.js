// config.js — configuration du front LettrePro (PROD). À charger AVANT les autres scripts.
// En local (localhost) : backend local. En ligne : backend Railway.
(function () {
  var host = location.hostname;
  if (window.LETTREPRO_API) {
    window.API_BASE = window.LETTREPRO_API;
  } else if (host === 'localhost' || host === '127.0.0.1' || host === '') {
    window.API_BASE = 'http://' + (host || 'localhost') + ':5099';
  } else {
    window.API_BASE = 'https://lettrepro-production.up.railway.app';
  }

  // Parrainage : capturer ?ref= et le mémoriser 30 jours (cookie 1re partie)
  try {
    var m = location.search.match(/[?&]ref=([A-Za-z0-9]{4,12})/);
    if (m && m[1]) {
      var code = m[1].toUpperCase();
      var exp = new Date(Date.now() + 30 * 864e5).toUTCString();
      document.cookie = 'lp_ref=' + code + '; expires=' + exp + '; path=/; SameSite=Lax';
      try { localStorage.setItem('lp_ref', code); } catch (e) {}
    }
  } catch (e) {}
  window.getRefCode = function () {
    var c = (document.cookie.match(/(?:^|;\s*)lp_ref=([A-Za-z0-9]+)/) || [])[1];
    if (c) return c;
    try { return localStorage.getItem('lp_ref') || ''; } catch (e) { return ''; }
  };
})();
