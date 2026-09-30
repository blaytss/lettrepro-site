/* ══════════════════════════════════════════════════════════════
   Connexion sociale : bouton Google officiel (fiable) + bouton Apple.
   S'injecte dans #social-auth (login.html + inscription.html).
   Google : actif dès que GOOGLE_CLIENT_ID est défini côté serveur.
   Apple  : bouton présent, activation = compte Apple Developer requis.
   ══════════════════════════════════════════════════════════════ */
(function () {
  var API = window.API_BASE;
  var box = document.getElementById('social-auth');
  if (!box) return;

  var gLogo = '<svg width="18" height="18" viewBox="0 0 48 48" style="flex:0 0 auto"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.6 34.9 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5C40.9 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>';
  var aLogo = '<svg width="16" height="18" viewBox="0 0 384 512" fill="currentColor" style="flex:0 0 auto"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';

  var st = document.createElement('style');
  st.textContent =
    '.social-divider{display:flex;align-items:center;gap:.8rem;color:var(--muted,#9A8A78);font-size:.8rem;margin:1.2rem 0}' +
    '.social-divider::before,.social-divider::after{content:"";flex:1;height:1px;background:var(--border,#E7DCCB)}' +
    '#gsi-button{display:flex;justify-content:center;margin-bottom:.6rem;min-height:44px}' +
    '.social-btn{display:flex;align-items:center;justify-content:center;gap:.65rem;width:100%;padding:.7rem 1rem;margin-bottom:.6rem;' +
    'border:1px solid var(--border,#D8C9B2);border-radius:11px;background:#fff;color:#1f2328;font-family:inherit;font-weight:600;' +
    'font-size:.92rem;cursor:pointer;transition:filter .15s,border-color .15s}' +
    '.social-btn:hover{border-color:#888}' +
    '.social-btn.apple{background:#000;color:#fff;border-color:#000}';
  document.head.appendChild(st);

  box.innerHTML =
    '<div class="social-divider"><span>ou</span></div>' +
    '<div id="gsi-button"></div>' +
    '<button type="button" class="social-btn apple" id="btn-apple">' + aLogo + '<span>Continuer avec Apple</span></button>';

  function success(token) {
    localStorage.setItem('lp_token', token);
    if (typeof window.routeAfterLogin === 'function') return window.routeAfterLogin(token);
    window.location.href = 'dashboard.html';
  }

  // ── Google (bouton officiel) ──
  fetch(API + '/api/auth/config').then(function (r) { return r.json(); }).then(function (cfg) {
    var cid = cfg && cfg.google_client_id;
    var slot = document.getElementById('gsi-button');
    if (!cid) {
      slot.innerHTML = '<button type="button" class="social-btn" onclick="alert(\'Connexion Google à configurer : GOOGLE_CLIENT_ID côté serveur.\')">' + gLogo + '<span>Continuer avec Google</span></button>';
      return;
    }
    // Bouton custom + flux POPUP (OAuth2) : n'utilise PAS FedCM (fiable sur localhost/Opera).
    slot.innerHTML = '<button type="button" class="social-btn" id="btn-google">' + gLogo + '<span>Continuer avec Google</span></button>';
    var s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true;
    s.onload = function () {
      var tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: cid,
        scope: 'openid email profile',
        callback: function (resp) {
          if (!resp || !resp.access_token) { alert('Connexion Google annulée.'); return; }
          fetch(API + '/api/auth/google', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: resp.access_token, ref: (window.getRefCode ? window.getRefCode() : '') })
          }).then(function (r) { return r.json(); }).then(function (d) {
            if (d.token) success(d.token); else alert(d.error || 'Échec de la connexion Google');
          }).catch(function () { alert('Serveur injoignable.'); });
        }
      });
      document.getElementById('btn-google').onclick = function () { tokenClient.requestAccessToken(); };
    };
    s.onerror = function () { slot.innerHTML = '<div style="color:var(--muted);font-size:.82rem;text-align:center">Google indisponible (bloqueur ?)</div>'; };
    document.head.appendChild(s);
  }).catch(function () {});

  // ── Apple (à activer avec un compte Apple Developer) ──
  document.getElementById('btn-apple').onclick = function () {
    alert('Connexion Apple bientôt disponible — elle nécessite un compte Apple Developer (configuration en cours).');
  };
})();
