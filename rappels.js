// Rappels du planning : notifications programmées sur le téléphone (appli iPhone/Android uniquement).
// Le téléphone garde les rappels lui-même : ils sonnent même sans réseau et sans ouvrir l'appli.
// Sur le site (navigateur), rien ne s'affiche.
(function () {
  var cap = window.Capacitor;
  var natif = !!(cap && cap.isNativePlatform && cap.isNativePlatform() && cap.nativePromise);
  var CLE = 'lp_rappels', MAX = 60;   // iOS garde au plus 64 notifications programmées
  var AVANCES = [['0', 'À l’heure'], ['15', '15 min avant'], ['60', '1 h avant'], ['veille', 'La veille à 18 h']];
  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var dispo = null;   // null = pas encore testé ; true/false = l'appli installée sait (ou non) programmer des rappels

  function reglages() {
    try { var r = JSON.parse(localStorage.getItem(CLE) || '{}'); return { on: !!r.on, avance: r.avance || '60' }; }
    catch (e) { return { on: false, avance: '60' }; }
  }
  function enregistre(r) { try { localStorage.setItem(CLE, JSON.stringify(r)); } catch (e) {} }

  function natifAppel(methode, options, delaiMax) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('délai dépassé')); }, delaiMax || 4000);
      cap.nativePromise('LocalNotifications', methode, options || {}).then(
        function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }
  // Les anciennes versions de l'appli n'ont pas la fonction : on teste une fois.
  function teste() {
    if (!natif) return Promise.resolve(false);
    if (dispo !== null) return Promise.resolve(dispo);
    return natifAppel('checkPermissions', {}, 2500).then(function () { return (dispo = true); }, function () { return (dispo = false); });
  }

  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  // Moment où le rappel doit sonner pour un événement.
  function moment(ev, avance) {
    var p = ev.date.split('-'), h = (ev.heure || '').split(':');
    var jour = new Date(+p[0], +p[1] - 1, +p[2]);
    if (avance === 'veille') { jour.setDate(jour.getDate() - 1); jour.setHours(18, 0, 0, 0); return jour; }
    if (h.length < 2) { jour.setHours(7, 30, 0, 0); return jour; }           // pas d'heure : le matin même
    jour.setHours(+h[0], +h[1], 0, 0);
    return new Date(jour.getTime() - (+avance || 0) * 60000);
  }
  function texte(ev) {
    var p = ev.date.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()] + (ev.heure ? ' à ' + ev.heure.replace(':', ' h ') : '');
  }

  function toutAnnuler() {
    return natifAppel('getPending').then(function (r) {
      var l = (r && r.notifications || []).map(function (n) { return { id: n.id }; });
      return l.length ? natifAppel('cancel', { notifications: l }) : null;
    });
  }

  // Remet les rappels du téléphone en accord avec le planning enregistré sur le serveur.
  function sync() {
    return teste().then(function (ok) {
      if (!ok) return 0;
      var r = reglages(), tok = localStorage.getItem('lp_token');
      if (!r.on || !tok) return toutAnnuler().then(function () { return 0; });
      var du = new Date(), au = new Date(); au.setDate(au.getDate() + 90);
      return fetch(window.API_BASE + '/api/planning?du=' + iso(du) + '&au=' + iso(au), { headers: { Authorization: 'Bearer ' + tok } })
        .then(function (x) { return x.json(); })
        .then(function (d) {
          var bientot = Date.now() + 60000;
          var liste = (d.events || []).map(function (ev) { return { ev: ev, at: moment(ev, r.avance) }; })
            .filter(function (x) { return x.at.getTime() > bientot; })
            .sort(function (a, b) { return a.at - b.at; }).slice(0, MAX)
            .map(function (x) {
              return { id: x.ev.id, title: '📅 ' + x.ev.titre, body: texte(x.ev).replace(/^./, function (c) { return c.toUpperCase(); }),
                       schedule: { at: x.at.toISOString(), allowWhileIdle: true } };
            });
          return toutAnnuler().then(function () {
            return liste.length ? natifAppel('schedule', { notifications: liste }, 8000) : null;
          }).then(function () { return liste.length; });
        });
    }).catch(function (e) { console.warn('rappels :', e && e.message); return 0; });
  }

  function activer() {
    return natifAppel('requestPermissions', {}, 60000).then(function (p) {
      if (!p || p.display !== 'granted') return false;
      var r = reglages(); r.on = true; enregistre(r);
      return true;
    });
  }

  // Barre affichée au-dessus du calendrier.
  function afficher(conteneur) {
    if (!conteneur) return;
    teste().then(function (ok) {
      var vieux = document.getElementById('pl-rappels'); if (vieux) vieux.remove();
      if (!ok) return;
      var r = reglages(), b = document.createElement('div');
      b.id = 'pl-rappels';
      b.style.cssText = 'display:flex!important;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap;margin-bottom:.9rem;padding:.7rem .9rem;border:1px solid var(--border);border-radius:12px;background:var(--surface);font-size:.88rem';
      b.innerHTML = '<span><b>🔔 Rappels</b> <span style="color:var(--muted)" id="pl-rap-etat">' + (r.on ? 'activés' : 'désactivés') + '</span></span>' +
        '<span style="display:flex;align-items:center;gap:.5rem">' +
        '<select id="pl-rap-av" style="' + (r.on ? '' : 'display:none;') + 'padding:.4rem .5rem;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);font:inherit;font-size:.84rem">' +
        AVANCES.map(function (a) { return '<option value="' + a[0] + '"' + (a[0] === r.avance ? ' selected' : '') + '>' + a[1] + '</option>'; }).join('') + '</select>' +
        '<button type="button" id="pl-rap-btn" style="padding:.45rem .9rem;border-radius:8px;font:inherit;font-size:.84rem;font-weight:700;cursor:pointer;' +
        (r.on ? 'background:transparent;border:1px solid var(--border);color:var(--text)' : 'background:var(--orange);border:1px solid var(--orange);color:#fff') + '">' + (r.on ? 'Désactiver' : 'Activer') + '</button></span>';
      conteneur.insertBefore(b, conteneur.firstChild);
      var info = function (m, type) { if (typeof window.showToast === 'function') window.showToast(m, type); };
      b.querySelector('#pl-rap-btn').onclick = function () {
        var s = reglages();
        if (s.on) { s.on = false; enregistre(s); sync().then(function () { afficher(conteneur); info('Rappels désactivés.'); }); return; }
        activer().then(function (okPerm) {
          if (!okPerm) { info('Autorise les notifications de LettrePro dans les réglages du téléphone.', 'error'); return; }
          sync().then(function (n) { afficher(conteneur); info('🔔 Rappels activés' + (n ? ' : ' + n + ' programmé' + (n > 1 ? 's' : '') + '.' : '.')); });
        }).catch(function () { info('Impossible d’activer les rappels.', 'error'); });
      };
      b.querySelector('#pl-rap-av').onchange = function () { var s = reglages(); s.avance = this.value; enregistre(s); sync(); };
    });
  }

  window.lpRappels = { sync: sync, afficher: afficher, effacer: function () { return teste().then(function (ok) { return ok ? toutAnnuler() : null; }).catch(function () {}); } };

  // À l'ouverture de l'appli : on recale les rappels (événements ajoutés depuis un autre appareil, etc.).
  if (natif && reglages().on) setTimeout(sync, 3000);
})();
