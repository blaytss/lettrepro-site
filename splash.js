// Animation d'ouverture de l'appli : le score monte à 100 %, « +6 crédits » et confettis.
// Jouée une seule fois par ouverture (pas à chaque changement de page).
(function () {
  try {
    if (sessionStorage.getItem('lp_splash')) return;
    sessionStorage.setItem('lp_splash', '1');
  } catch (e) { return; }

  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COULEURS = ['#E8692A', '#F5A462', '#C0501A', '#F5A524', '#FDDCC8', '#1C1107'];
  var DUREE_SCORE = 1100, DUREE_MIN = calme ? 700 : 2300, DUREE_MAX = 5000;

  var css =
    '#lp-splash{position:fixed;inset:0;z-index:99999;background:#FEF9F6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;transition:opacity .35s ease;font-family:Sora,Inter,system-ui,sans-serif}' +
    '#lp-splash.out{opacity:0;pointer-events:none}' +
    '#lp-splash .ring{position:relative;width:132px;height:132px}' +
    '#lp-splash .ring svg{display:block}' +
    '#lp-splash .fill{stroke-dasharray:345;stroke-dashoffset:345;transform:rotate(-90deg);transform-origin:66px 66px;animation:lpsFill ' + DUREE_SCORE + 'ms ease-in-out forwards}' +
    '#lp-splash .num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:28px;color:#1C1107}' +
    '#lp-splash .bonus{position:absolute;right:-34px;top:-8px;background:#E8692A;color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;white-space:nowrap;transform:scale(0);animation:lpsPop .45s ease-out ' + DUREE_SCORE + 'ms forwards}' +
    '#lp-splash .logo{font-weight:800;font-size:24px;color:#1C1107;letter-spacing:-.01em}' +
    '#lp-splash .logo b{color:#E8692A;font-weight:800}' +
    '#lp-splash .cf{position:absolute;left:50%;top:50%;width:8px;height:12px;margin:-6px 0 0 -4px;border-radius:2px;opacity:0;animation:lpsConf 1.25s cubic-bezier(.15,.6,.3,1) ' + DUREE_SCORE + 'ms forwards}' +
    '#lp-splash .cf.r{border-radius:50%;height:8px}' +
    '@keyframes lpsFill{to{stroke-dashoffset:0}}' +
    '@keyframes lpsPop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}' +
    '@keyframes lpsConf{0%{opacity:1;transform:translate(0,0) rotate(0)}55%{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--r))}100%{opacity:0;transform:translate(calc(var(--x)*1.15),calc(var(--y) + 150px)) rotate(calc(var(--r)*1.6))}}';

  var confettis = '';
  if (!calme) {
    for (var i = 0; i < 38; i++) {
      var angle = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 130;
      confettis += '<i class="cf' + (i % 4 === 0 ? ' r' : '') + '" style="background:' + COULEURS[i % COULEURS.length] +
        ';--x:' + Math.round(Math.cos(angle) * dist) + 'px;--y:' + Math.round(Math.sin(angle) * dist - 50) + 'px;--r:' +
        Math.round(Math.random() * 720 - 360) + 'deg;animation-delay:' + (DUREE_SCORE + Math.round(Math.random() * 140)) + 'ms"></i>';
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

  var num = el.querySelector('.num'), debut = Date.now();
  if (calme) {
    num.textContent = '100%';
    el.querySelector('.fill').style.cssText = 'animation:none;stroke-dashoffset:0';
    el.querySelector('.bonus').style.cssText = 'animation:none;transform:scale(1)';
  } else {
    (function compte() {
      var p = Math.min(1, (Date.now() - debut) / DUREE_SCORE);
      num.textContent = Math.round(p * 100) + '%';
      if (p < 1) requestAnimationFrame(compte);
    })();
  }

  var ferme = false;
  function fermer() {
    if (ferme) return;
    ferme = true;
    el.classList.add('out');
    setTimeout(function () { el.remove(); style.remove(); }, 400);
  }
  function quandPret() { setTimeout(fermer, Math.max(0, DUREE_MIN - (Date.now() - debut))); }
  if (document.readyState === 'complete') quandPret();
  else window.addEventListener('load', quandPret);
  setTimeout(fermer, DUREE_MAX);
})();
