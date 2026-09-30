// theme-boot.js — applique le thème choisi dans l'onglet « Apparence » du dashboard.
// Lit localStorage['lp_theme'] = { preset, mode, autoSchedule, primary } et pose les
// variables CSS (--bg/--surface/--card/--border/--text/--muted/--orange...).
// À inclure en <script src="theme-boot.js"></script> DANS le <head>, AVANT le rendu,
// pour que toutes les pages suivent la même couleur que le dashboard (pas de flash).
(function () {
  const PRESETS = {
    orange: { primary:'#E8692A', dark:{bg:'#0F0D0A',surface:'#1A1612',card:'#231E17',border:'#3A2F22',text:'#F5F0E8',muted:'#9A8A78'}, light:{bg:'#FEF9F6',surface:'#FFFFFF',card:'#FFF4EE',border:'#FDDCC8',text:'#1C1107',muted:'#8B6E5A'} },
    violet: { primary:'#7C3AED', dark:{bg:'#0A080F',surface:'#130F1E',card:'#1C1530',border:'#2D2450',text:'#F0EEFF',muted:'#8880BB'}, light:{bg:'#FAF8FF',surface:'#FFFFFF',card:'#F0EBFF',border:'#DDD0FF',text:'#1A0F2E',muted:'#7B6CA8'} },
    vert:   { primary:'#10B981', dark:{bg:'#080F0C',surface:'#0F1A14',card:'#15231B',border:'#1E3628',text:'#ECFDF5',muted:'#6B9B7A'}, light:{bg:'#F0FDF8',surface:'#FFFFFF',card:'#DCFCE7',border:'#BBF7D0',text:'#052E16',muted:'#4B7A5E'} },
    bleu:   { primary:'#3B82F6', dark:{bg:'#080C14',surface:'#0F1520',card:'#15202E',border:'#1E3048',text:'#EFF6FF',muted:'#6B8AB0'}, light:{bg:'#F0F7FF',surface:'#FFFFFF',card:'#DBEAFE',border:'#BFDBFE',text:'#0C2347',muted:'#4B6A90'} },
    rose:   { primary:'#EC4899', dark:{bg:'#0F080D',surface:'#1A0F17',card:'#251521',border:'#3D1F33',text:'#FDF2F8',muted:'#A0688A'}, light:{bg:'#FDF2F8',surface:'#FFFFFF',card:'#FCE7F3',border:'#FBCFE8',text:'#2D1224',muted:'#9D4978'} },
  };
  function hexToRgba(hex, a) {
    const h = String(hex || '').replace('#', '');
    if (h.length !== 6) return 'rgba(232,105,42,' + a + ')';
    const n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function apply() {
    let t = {};
    try { t = JSON.parse(localStorage.getItem('lp_theme') || '{}'); } catch (e) {}
    let mode = t.mode;
    if (t.autoSchedule) {
      const h = new Date().getHours();
      mode = (h >= 20 || h < 7) ? 'dark' : 'light';
    }
    mode = mode || 'light';
    const preset = PRESETS[t.preset] || PRESETS.orange;
    const colors = mode === 'light' ? preset.light : preset.dark;
    const primary = t.primary || preset.primary;
    const r = document.documentElement.style;
    r.setProperty('--bg', colors.bg);
    r.setProperty('--surface', colors.surface);
    r.setProperty('--card', colors.card);
    r.setProperty('--border', colors.border);
    r.setProperty('--text', colors.text);
    r.setProperty('--muted', colors.muted);
    r.setProperty('--orange', primary);
    r.setProperty('--orange-light', primary);
    r.setProperty('--orange-glow', hexToRgba(primary, 0.15));
    document.documentElement.setAttribute('data-theme', mode);
  }
  apply();
  // Se met à jour tout seul si l'utilisateur change la couleur dans un autre onglet,
  // et à 07:00 / 20:00 quand le mode auto est activé.
  window.addEventListener('storage', function (e) { if (e.key === 'lp_theme') apply(); });
  setInterval(apply, 60 * 1000);
})();
