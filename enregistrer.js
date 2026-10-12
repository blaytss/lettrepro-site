// Onglet « Enregistrer un cours » : on enregistre (ou on importe) l'audio d'un cours, le serveur le transcrit
// morceau par morceau, puis crée une prise de notes, un résumé et un quiz rangés dans « Mes cours ».
// L'audio n'est jamais conservé. Coût : 10 crédits, débités seulement quand le résultat est créé.
(function () {
  var COUT = 10;
  var SEGMENT_MS = 4 * 60 * 1000;          // un morceau toutes les 4 minutes (envoyé et transcrit au fur et à mesure)
  var IMPORT_MAX = 25 * 1024 * 1024;       // taille maximale d'un audio importé
  var E = { etat: 'accueil', dispo: null, sid: null, stream: null, rec: null, mime: '', morceaux: [], debutSeg: 0,
            debut: 0, tic: null, tSeg: null, file: [], envoiEnCours: false, envoyes: 0, rates: 0, secondes: 0,
            arret: false, verrou: null, resultat: null };

  function $(id) { return document.getElementById(id); }
  function esc(t) { return (typeof escapeHtml === 'function') ? escapeHtml(t) : String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function info(m, type) { if (typeof showToast === 'function') showToast(m, type); }
  function jeton() { return localStorage.getItem('lp_token'); }
  function duree(s) { s = Math.max(0, Math.floor(s)); var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); }

  function appel(methode, chemin, corps) {
    return fetch(window.API_BASE + chemin, {
      method: methode, headers: { Authorization: 'Bearer ' + jeton(), 'Content-Type': 'application/json' },
      body: corps ? JSON.stringify(corps) : undefined
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Erreur'); return j; }); });
  }

  // ───────── Affichage ─────────
  function rendre() {
    var el = $('enr-zone'); if (!el) return;
    if (E.etat === 'accueil') {
      var dossiers = (window._dossiers || []).slice().sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr'); });
      var bloque = E.dispo === false;
      el.innerHTML =
        (bloque ? '<div class="enr-note">🚧 Cette fonction arrive très bientôt.</div>' : '') +
        '<div class="enr-card">' +
          '<h2 class="enr-h2">Comment ça marche</h2>' +
          '<ol class="enr-etapes"><li>Pose ton téléphone près du professeur et lance l’enregistrement.</li>' +
          '<li>À la fin du cours, appuie sur « Terminer ».</li>' +
          '<li>Tu reçois une <b>prise de notes complète</b>, un <b>résumé</b> et un <b>quiz de 10 questions</b>, rangés dans « Mes cours ».</li></ol>' +
          '<label class="enr-label">Titre du cours (facultatif)</label>' +
          '<input class="enr-in" id="enr-titre" maxlength="120" placeholder="Ex : La Révolution française — séance 2"/>' +
          '<label class="enr-label">Ranger dans</label>' +
          '<select class="enr-in" id="enr-dossier"><option value="">Sans dossier</option>' +
            dossiers.map(function (d) { return '<option value="' + d.id + '">' + esc(d.nom) + '</option>'; }).join('') +
            '<option value="__new__">➕ Nouveau dossier…</option></select>' +
          '<input class="enr-in" id="enr-dossier-new" placeholder="Nom du nouveau dossier" style="display:none;margin-top:.5rem"/>' +
          '<label class="enr-accord"><input type="checkbox" id="enr-accord"/> <span>Mon professeur est d’accord pour que j’enregistre ce cours. ' +
          'L’enregistrement sert uniquement à créer mes notes : <b>l’audio n’est pas conservé</b>.</span></label>' +
          '<div class="enr-btns">' +
            '<button class="enr-btn plein" id="enr-go"' + (bloque ? ' disabled' : '') + '>🎙 Démarrer l’enregistrement</button>' +
            '<button class="enr-btn" id="enr-import"' + (bloque ? ' disabled' : '') + '>📁 Importer un audio</button>' +
            '<input type="file" id="enr-fichier" accept="audio/*,video/mp4,.m4a,.mp3,.wav,.ogg,.webm" style="display:none"/>' +
          '</div>' +
          '<p class="enr-petit">Coût : <b>' + COUT + ' crédits</b>, débités seulement quand tes notes sont prêtes. ' +
          'Sur téléphone, garde l’écran allumé pendant l’enregistrement. Astuce : tu peux aussi enregistrer avec le dictaphone du téléphone, ' +
          'puis importer le fichier (25 Mo maximum, environ 45 minutes).</p>' +
        '</div>';
      $('enr-dossier').onchange = function () { $('enr-dossier-new').style.display = this.value === '__new__' ? 'block' : 'none'; };
      $('enr-go').onclick = demarrer;
      $('enr-import').onclick = function () { if (verifier()) $('enr-fichier').click(); };
      $('enr-fichier').onchange = function () { if (this.files[0]) importer(this.files[0]); this.value = ''; };
    } else if (E.etat === 'enregistre') {
      el.innerHTML =
        '<div class="enr-card enr-centre">' +
          '<div class="enr-rond"><span></span></div>' +
          '<div class="enr-chrono" id="enr-chrono">0:00</div>' +
          '<div class="enr-etat" id="enr-etat">Enregistrement en cours…</div>' +
          '<div class="enr-btns" style="justify-content:center">' +
            '<button class="enr-btn plein" id="enr-fin">⏹ Terminer et créer mes notes</button>' +
            '<button class="enr-btn" id="enr-annule">Annuler</button>' +
          '</div>' +
          '<p class="enr-petit">Garde cette page ouverte et l’écran allumé. Si tu quittes l’appli, l’enregistrement s’arrête.</p>' +
        '</div>';
      $('enr-fin').onclick = terminer;
      $('enr-annule').onclick = function () { if (confirm('Annuler cet enregistrement ? Rien ne sera gardé et aucun crédit ne sera débité.')) annuler(); };
    } else if (E.etat === 'travail') {
      el.innerHTML =
        '<div class="enr-card enr-centre">' +
          '<div class="enr-tourne"></div>' +
          '<div class="enr-etat" id="enr-etat" style="font-size:1rem;color:var(--text);font-weight:600">Préparation…</div>' +
          '<p class="enr-petit">Cela peut prendre 1 à 3 minutes. Reste sur cette page.</p>' +
        '</div>';
    } else if (E.etat === 'fini') {
      var r = E.resultat || {};
      el.innerHTML =
        '<div class="enr-card">' +
          '<div style="font-size:2.2rem">🎉</div>' +
          '<h2 class="enr-h2" style="margin:.3rem 0 .2rem">' + esc(r.titre || 'Ton cours') + '</h2>' +
          '<p class="enr-petit" style="margin:0 0 1rem">' + esc(r.matiere || '') + (r.minutes ? ' · ' + r.minutes + ' min de cours' : '') + ' · rangé dans « Mes cours »</p>' +
          '<div class="enr-btns">' +
            '<button class="enr-btn plein" id="enr-voir">📝 Voir la prise de notes</button>' +
            '<button class="enr-btn plein" id="enr-quiz">🎯 Faire le quiz</button>' +
            '<button class="enr-btn" id="enr-encore">🎙 Enregistrer un autre cours</button>' +
          '</div>' +
          '<h3 class="enr-h3">Résumé</h3><div class="enr-resume">' + mettreEnForme((r.result || {}).resume || '') + '</div>' +
        '</div>';
      $('enr-voir').onclick = function () { ouvrirCours(function () { if (typeof viewFiche === 'function') viewFiche(r.ficheId); }); };
      $('enr-quiz').onclick = function () { ouvrirCours(function () { if (typeof openQuizFromLibrary === 'function') openQuizFromLibrary(r.quizId); }); };
      $('enr-encore').onclick = function () { E.etat = 'accueil'; E.resultat = null; rendre(); };
    }
  }
  function mettreEnForme(t) {
    return esc(t).replace(/^\s*-{3,}\s*$/gm, '').replace(/^\s*&gt;\s?/gm, '').replace(/\n{3,}/g, '\n\n').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/^\s*[-•*]\s+/gm, '• ').replace(/^#+\s*(.+)$/gm, '<b>$1</b>').replace(/\n/g, '<br>');
  }
  function ouvrirCours(suite) {
    if (typeof showPage === 'function') showPage('study', document.querySelector('[data-page=study]'));
    setTimeout(suite, 150);
  }
  function etat(t) { var e = $('enr-etat'); if (e) e.textContent = t; }

  // ───────── Vérifications avant de commencer ─────────
  function verifier() {
    if (!$('enr-accord').checked) { info('Coche la case : ton professeur doit être d’accord.', 'error'); return false; }
    if (typeof currentUser !== 'undefined' && currentUser && (currentUser.credits || 0) < COUT) { info('Il te faut ' + COUT + ' crédits pour enregistrer un cours.', 'error'); return false; }
    return true;
  }
  function choix() {
    var sel = $('enr-dossier'), neuf = $('enr-dossier-new');
    return { titre: ($('enr-titre').value || '').trim(),
             dossier_id: (sel.value && sel.value !== '__new__') ? sel.value : null,
             nouveau_dossier: sel.value === '__new__' ? (neuf.value || '').trim() : '' };
  }

  // ───────── Enregistrement en direct ─────────
  function typeAudio() {
    var c = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    for (var i = 0; i < c.length; i++) if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c[i])) return c[i];
    return '';
  }
  function extension(mime) { return /mp4/.test(mime) ? 'm4a' : /ogg/.test(mime) ? 'ogg' : /wav/.test(mime) ? 'wav' : /mpeg|mp3/.test(mime) ? 'mp3' : 'webm'; }

  function demarrer() {
    if (!verifier()) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      info('Ton appareil ne permet pas d’enregistrer ici. Utilise « Importer un audio ».', 'error'); return;
    }
    E.choix = choix();
    $('enr-go').disabled = true;
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true } }).then(function (stream) {
      E.stream = stream;
      return appel('POST', '/api/enregistrement/start', { autorisation: true });
    }).then(function (d) {
      E.sid = d.id; E.max = d.max_secondes || 10800; E.mime = typeAudio();
      E.file = []; E.envoyes = 0; E.rates = 0; E.secondes = 0; E.arret = false; E.debut = Date.now();
      E.etat = 'enregistre'; rendre(); lancerSegment(); garderEcran();
      E.tic = setInterval(function () {
        var s = (Date.now() - E.debut) / 1000, c = $('enr-chrono'); if (c) c.textContent = duree(s);
        if (s >= E.max) { info('Durée maximale atteinte (3 heures).'); terminer(); }
      }, 500);
    }).catch(function (e) {
      couper();
      var b = $('enr-go'); if (b) b.disabled = false;
      info(e && e.name === 'NotAllowedError' ? 'Autorise le micro pour LettrePro dans les réglages.' : ((e && e.message) || 'Impossible de démarrer l’enregistrement.'), 'error');
    });
  }
  function lancerSegment() {
    var options = { audioBitsPerSecond: 32000 }; if (E.mime) options.mimeType = E.mime;
    var rec; try { rec = new MediaRecorder(E.stream, options); } catch (e) { rec = new MediaRecorder(E.stream); }
    var morceaux = [], debut = Date.now();
    rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) morceaux.push(ev.data); };
    rec.onstop = function () {
      var blob = new Blob(morceaux, { type: rec.mimeType || E.mime || 'audio/webm' });
      E.file.push({ blob: blob, duree: (Date.now() - debut) / 1000, essais: 0 });
      envoyer();
      if (!E.arret) lancerSegment();          // on enchaîne tout de suite sur le morceau suivant
    };
    rec.start();
    E.rec = rec;
    clearTimeout(E.tSeg);
    E.tSeg = setTimeout(function () { if (rec.state === 'recording') rec.stop(); }, SEGMENT_MS);
  }
  function envoyer() {
    if (E.envoiEnCours || !E.file.length) return;
    E.envoiEnCours = true;
    var seg = E.file[0], f = new FormData();
    f.append('audio', seg.blob, 'cours.' + extension(seg.blob.type || E.mime));
    f.append('duree', String(Math.round(seg.duree)));
    fetch(window.API_BASE + '/api/enregistrement/' + E.sid + '/segment', { method: 'POST', headers: { Authorization: 'Bearer ' + jeton() }, body: f })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Erreur'); return j; }); })
      .then(function (j) {
        E.file.shift(); E.envoyes++; if (j.secondes) E.secondes = j.secondes;
        if (E.etat === 'enregistre') etat('Enregistrement en cours… ' + Math.round(E.secondes / 60) + ' min déjà transcrites');
      })
      .catch(function () {
        seg.essais++;
        if (seg.essais >= 3) { E.file.shift(); E.rates++; }     // on abandonne ce morceau après 3 essais
      })
      .then(function () { E.envoiEnCours = false; if (E.file.length) setTimeout(envoyer, 1500); });
  }
  function couper() {
    clearInterval(E.tic); clearTimeout(E.tSeg);
    if (E.stream) { E.stream.getTracks().forEach(function (t) { t.stop(); }); E.stream = null; }
    if (E.verrou) { try { E.verrou.release(); } catch (e) {} E.verrou = null; }
  }
  function garderEcran() {
    if (navigator.wakeLock && navigator.wakeLock.request) navigator.wakeLock.request('screen').then(function (v) { E.verrou = v; }).catch(function () {});
  }
  document.addEventListener('visibilitychange', function () { if (E.etat === 'enregistre' && document.visibilityState === 'visible') garderEcran(); });
  window.addEventListener('beforeunload', function (e) { if (E.etat === 'enregistre' || E.etat === 'travail') { e.preventDefault(); e.returnValue = ''; } });

  function attendreEnvois() {
    return new Promise(function (ok) {
      (function voir() { if (!E.file.length && !E.envoiEnCours) ok(); else { etat('Transcription des derniers passages…'); setTimeout(voir, 600); } })();
    });
  }
  function terminer() {
    if (E.etat !== 'enregistre') return;
    E.arret = true; E.etat = 'travail';
    var rec = E.rec;
    var fini = new Promise(function (ok) {
      if (rec && rec.state === 'recording') { var ancien = rec.onstop; rec.onstop = function () { ancien(); ok(); }; rec.stop(); } else ok();
    });
    clearInterval(E.tic); clearTimeout(E.tSeg);
    rendre();
    fini.then(function () { couper(); return attendreEnvois(); }).then(creer);
  }
  function annuler() {
    E.arret = true; E.file = [];
    try { if (E.rec && E.rec.state === 'recording') { E.rec.onstop = null; E.rec.stop(); } } catch (e) {}
    couper();
    if (E.sid) appel('DELETE', '/api/enregistrement/' + E.sid).catch(function () {});
    E.sid = null; E.etat = 'accueil'; rendre();
  }

  // ───────── Import d'un fichier audio ─────────
  function importer(fichier) {
    if (fichier.size > IMPORT_MAX) { info('Ce fichier est trop lourd : 25 Mo maximum (environ 45 minutes).', 'error'); return; }
    E.choix = choix(); E.arret = true;
    var dureeFichier = new Promise(function (ok) {
      try { var a = new Audio(); a.preload = 'metadata'; a.onloadedmetadata = function () { ok(isFinite(a.duration) ? a.duration : 0); }; a.onerror = function () { ok(0); };
        a.src = URL.createObjectURL(fichier); setTimeout(function () { ok(0); }, 4000); } catch (e) { ok(0); }
    });
    E.etat = 'travail'; rendre(); etat('Envoi et transcription de ton audio…');
    appel('POST', '/api/enregistrement/start', { autorisation: true }).then(function (d) {
      E.sid = d.id;
      return dureeFichier;
    }).then(function (s) {
      var f = new FormData();
      f.append('audio', fichier, fichier.name || ('cours.' + extension(fichier.type)));
      f.append('duree', String(Math.round(s)));
      return fetch(window.API_BASE + '/api/enregistrement/' + E.sid + '/segment', { method: 'POST', headers: { Authorization: 'Bearer ' + jeton() }, body: f })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Erreur'); return j; }); });
    }).then(creer).catch(function (e) {
      info((e && e.message) || 'L’import a échoué.', 'error');
      E.etat = 'accueil'; rendre();
    });
  }

  // ───────── Création des notes, du résumé et du quiz ─────────
  function creer() {
    etat('Rédaction de ta prise de notes, du résumé et du quiz…');
    return appel('POST', '/api/enregistrement/' + E.sid + '/terminer', E.choix || {}).then(function (r) {
      E.resultat = r; E.sid = null; E.etat = 'fini'; rendre();
      if (typeof currentUser !== 'undefined' && currentUser && typeof r.creditsLeft === 'number') { currentUser.credits = r.creditsLeft; if (typeof refreshUI === 'function') refreshUI(); }
      if (typeof histAfterGeneration === 'function') histAfterGeneration(r);
      if (typeof loadStudyDossiers === 'function') loadStudyDossiers();
      info('Tes notes sont prêtes ✓' + (E.rates ? ' (un passage n’a pas pu être transcrit)' : ''), 'success');
    }).catch(function (e) {
      info((e && e.message) || 'La création des notes a échoué.', 'error');
      if (E.sid) appel('DELETE', '/api/enregistrement/' + E.sid).catch(function () {});
      E.sid = null; E.etat = 'accueil'; rendre();
    });
  }

  // ───────── Entrée : appelée quand on ouvre l'onglet ─────────
  window.enrInit = function () {
    if (E.etat !== 'accueil') { rendre(); return; }           // ne pas casser un enregistrement en cours
    var p = (typeof loadStudyDossiers === 'function') ? Promise.resolve(loadStudyDossiers()).catch(function () {}) : Promise.resolve();
    p.then(function () { rendre(); });
    if (E.dispo === null) {
      fetch(window.API_BASE + '/api/auth/config').then(function (r) { return r.json(); })
        .then(function (c) { E.dispo = !!(c && c.enregistrement_enabled); if (E.etat === 'accueil') rendre(); }).catch(function () {});
    }
  };
  window.enrEnCours = function () { return E.etat === 'enregistre' || E.etat === 'travail'; };
})();
