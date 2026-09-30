// Thème automatique selon l'heure :
//   Jour  (clair) : 07:00 -> 20:00 inclus
//   Nuit  (sombre): 20:01 -> 06:59
(function () {
  function apply() {
    var now = new Date();
    var minutes = now.getHours() * 60 + now.getMinutes();
    var jour = minutes >= 7 * 60 && minutes <= 20 * 60; // 420..1200
    document.documentElement.setAttribute('data-theme', jour ? 'light' : 'dark');
  }
  apply();
  // Re-vérifie chaque minute pour basculer tout seul à 07:00 / 20:01
  setInterval(apply, 60 * 1000);
})();
