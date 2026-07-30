/* ------------------------------------------------------------------
   Générateur d'illustrations produit.
   Tout est dessiné en SVG à la volée : aucune image externe, aucune
   requête réseau. Le site fonctionne donc hors ligne, y compris en
   ouvrant simplement le fichier index.html depuis un téléphone.
   ------------------------------------------------------------------ */

const TEINTES = {
  creme:   { base: "#F0E6D2", clair: "#FBF5E9", fonce: "#D6C3A2", trait: "#8C7A5E", deco: "#9A6B58" },
  ivoire:  { base: "#F5EEE2", clair: "#FDF9F1", fonce: "#DCCFB8", trait: "#8A7B63", deco: "#6E7F63" },
  blanc:   { base: "#F8F5F0", clair: "#FFFFFF", fonce: "#E0D9CD", trait: "#8B8378", deco: "#B08D4E" },
  pastel:  { base: "#EFE3D6", clair: "#FBF3E9", fonce: "#D8C4AE", trait: "#8A7660", deco: "#7C8871" },
  bleu:    { base: "#EAEFF3", clair: "#F8FBFD", fonce: "#C4D2DE", trait: "#5E7186", deco: "#41637F" },
  cristal: { base: "#EDF1F0", clair: "#FBFDFC", fonce: "#CEDAD8", trait: "#7C8B8A", deco: "#A9B8B6" },
  fume:    { base: "#CFCAC6", clair: "#E5E1DD", fonce: "#A49D98", trait: "#6B635D", deco: "#8A817B" },
  opalin:  { base: "#F4F1EA", clair: "#FFFFFF", fonce: "#DCD6C9", trait: "#8C8677", deco: "#B9C3C6" },
  argent:  { base: "#DAD8D3", clair: "#F1F0EC", fonce: "#AEACA5", trait: "#6E6B64", deco: "#8E8B83" },
  lin:     { base: "#E7DDCB", clair: "#F4EDE0", fonce: "#CBBBA0", trait: "#8A7A60", deco: "#A5453C" },
  ecru:    { base: "#EFE7D8", clair: "#F9F4EA", fonce: "#D5C8B0", trait: "#8B7C64", deco: "#9C8C72" },
  papier:  { base: "#F1E9D9", clair: "#FAF5EA", fonce: "#DACDB4", trait: "#8B7C61", deco: "#6E7F63" },
  cuir:    { base: "#9A6B45", clair: "#B98A62", fonce: "#6E482B", trait: "#4A2F1B", deco: "#C9A45E" },
  paysage: { base: "#8E9A78", clair: "#C7CBA9", fonce: "#5E6A52", trait: "#4A4436", deco: "#A98A5C" },
  dore:    { base: "#C6A365", clair: "#E3CA96", fonce: "#9A7B41", trait: "#6B5227", deco: "#EFE4C8" },
  bois:    { base: "#B08E63", clair: "#CDAE85", fonce: "#7E6039", trait: "#54402A", deco: "#EADFC6" },
  vert:    { base: "#6E8163", clair: "#8FA283", fonce: "#4C5B44", trait: "#39412F", deco: "#C6D0B4" },
  laiton:  { base: "#C4A567", clair: "#DDC391", fonce: "#96793F", trait: "#665028", deco: "#F2E9D4" },
};

const FOND = { haut: "#F6F1E7", bas: "#EDE5D6", ombre: "#D9CDB8" };

function _teinte(nom) {
  return TEINTES[nom] || TEINTES.creme;
}

/* --- petits helpers de dessin ------------------------------------- */

function _ombrePortee(cx, cy, rx, ry) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#ombre)"/>`;
}

function _filet(d, couleur, epaisseur) {
  return `<path d="${d}" fill="none" stroke="${couleur}" stroke-width="${epaisseur || 2}" stroke-linecap="round"/>`;
}

/* Semis de petites fleurs / points, utilisé pour les décors peints */
function _semis(cx, cy, rayon, couleur, nb, graine) {
  let out = "";
  let s = graine || 7;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < (nb || 6); i++) {
    const a = rnd() * Math.PI * 2;
    const r = rayon * (0.35 + rnd() * 0.6);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.85;
    const t = 3 + rnd() * 4;
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" opacity="0.75">`;
    for (let p = 0; p < 5; p++) {
      const ang = (p / 5) * 360;
      out += `<ellipse cx="0" cy="${-t}" rx="${(t * 0.55).toFixed(1)}" ry="${t.toFixed(1)}" fill="${couleur}" transform="rotate(${ang})"/>`;
    }
    out += `<circle r="${(t * 0.4).toFixed(1)}" fill="${FOND.haut}"/></g>`;
  }
  return out;
}

/* --- les formes ---------------------------------------------------- */

const FORMES = {
  /* ---- céramiques rondes ---- */
  assiette(t, m) {
    return (
      _ombrePortee(300, 400, 175, 26) +
      `<circle cx="300" cy="300" r="185" fill="${t.base}"/>` +
      `<circle cx="300" cy="300" r="185" fill="none" stroke="${t.fonce}" stroke-width="3"/>` +
      `<circle cx="300" cy="292" r="168" fill="${t.clair}"/>` +
      `<circle cx="300" cy="292" r="120" fill="none" stroke="${t.fonce}" stroke-width="1.5" opacity="0.7"/>` +
      `<circle cx="300" cy="292" r="150" fill="none" stroke="${t.deco}" stroke-width="3" opacity="0.8"/>` +
      (m === "ble" ? _epis(300, 292, 135, t.deco) : _semis(300, 292, 95, t.deco, 7, 11)) +
      `<path d="M180 200 A 170 170 0 0 1 330 138" fill="none" stroke="#FFFFFF" stroke-width="16" opacity="0.35" stroke-linecap="round"/>`
    );
  },
  plat(t, m) {
    return (
      _ombrePortee(300, 415, 200, 24) +
      `<ellipse cx="300" cy="300" rx="230" ry="160" fill="${t.base}"/>` +
      `<ellipse cx="300" cy="294" rx="230" ry="160" fill="${t.clair}" stroke="${t.fonce}" stroke-width="3"/>` +
      `<ellipse cx="300" cy="294" rx="188" ry="122" fill="none" stroke="${t.deco}" stroke-width="3" opacity="0.85"/>` +
      `<ellipse cx="300" cy="294" rx="150" ry="92" fill="none" stroke="${t.fonce}" stroke-width="1.5" opacity="0.6"/>` +
      _semis(300, 294, 78, t.deco, 8, 5) +
      `<path d="M120 240 A 200 130 0 0 1 260 170" fill="none" stroke="#FFFFFF" stroke-width="18" opacity="0.35" stroke-linecap="round"/>`
    );
  },
  coupelle(t) {
    return (
      _ombrePortee(300, 392, 140, 20) +
      `<ellipse cx="300" cy="330" rx="150" ry="52" fill="${t.fonce}"/>` +
      `<path d="M150 330 Q300 430 450 330 Z" fill="${t.base}"/>` +
      `<ellipse cx="300" cy="318" rx="150" ry="52" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      `<ellipse cx="300" cy="318" rx="118" ry="38" fill="none" stroke="${t.deco}" stroke-width="2" opacity="0.6"/>` +
      `<ellipse cx="252" cy="222" rx="120" ry="26" fill="#FFFFFF" opacity="0.28" transform="rotate(-12 252 222)"/>` +
      `<ellipse cx="300" cy="380" rx="150" ry="46" fill="none" stroke="${t.fonce}" stroke-width="2" opacity="0.35"/>`
    );
  },
  compotier(t) {
    return (
      _ombrePortee(300, 470, 130, 20) +
      `<path d="M255 340 L245 445 L355 445 L345 340 Z" fill="${t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="447" rx="86" ry="22" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<path d="M130 250 Q300 400 470 250 Z" fill="${t.base}"/>` +
      `<ellipse cx="300" cy="250" rx="170" ry="58" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      _godrons(300, 250, 170, 58, t.fonce) +
      `<ellipse cx="250" cy="238" rx="95" ry="20" fill="#FFFFFF" opacity="0.3" transform="rotate(-10 250 238)"/>`
    );
  },

  /* ---- pièces à anse ---- */
  tasse(t, m) {
    return (
      _ombrePortee(300, 432, 155, 22) +
      `<ellipse cx="300" cy="415" rx="165" ry="42" fill="${t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="404" rx="165" ry="42" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="404" rx="118" ry="28" fill="none" stroke="${t.deco}" stroke-width="2" opacity="0.55"/>` +
      `<path d="M425 230 q58 22 0 76" fill="none" stroke="${t.fonce}" stroke-width="16" stroke-linecap="round"/>` +
      `<path d="M425 230 q58 22 0 76" fill="none" stroke="${t.clair}" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M195 215 q10 150 32 168 q73 20 146 0 q22 -18 32 -168 Z" fill="${t.base}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      `<ellipse cx="300" cy="215" rx="105" ry="34" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      `<ellipse cx="300" cy="215" rx="88" ry="26" fill="${t.fonce}" opacity="0.25"/>` +
      (m === "floral" ? _semis(300, 300, 62, t.deco, 6, 3) : _filet("M206 262 q94 26 188 0", t.deco, 3)) +
      `<path d="M222 250 q-4 100 14 128" fill="none" stroke="#FFFFFF" stroke-width="14" opacity="0.35" stroke-linecap="round"/>`
    );
  },
  coquetier(t) {
    let out = _ombrePortee(300, 452, 190, 22);
    const pos = [
      { x: 150, y: 300, s: 0.92 },
      { x: 300, y: 285, s: 1.0 },
      { x: 452, y: 302, s: 0.9 },
    ];
    const tons = [t.clair, t.base, t.fonce];
    pos.forEach((p, i) => {
      const c = tons[i % tons.length];
      out +=
        `<g transform="translate(${p.x} ${p.y}) scale(${p.s})">` +
        `<ellipse cx="0" cy="148" rx="52" ry="16" fill="${t.fonce}" opacity="0.5"/>` +
        `<path d="M-30 60 L-38 140 L38 140 L30 60 Z" fill="${c}" stroke="${t.trait}" stroke-width="2"/>` +
        `<ellipse cx="0" cy="142" rx="42" ry="12" fill="${c}" stroke="${t.trait}" stroke-width="2"/>` +
        `<path d="M-56 -10 q0 70 26 72 q30 8 60 0 q26 -2 26 -72 Z" fill="${c}" stroke="${t.trait}" stroke-width="2"/>` +
        `<ellipse cx="0" cy="-10" rx="56" ry="18" fill="${t.clair}" stroke="${t.trait}" stroke-width="2"/>` +
        `<ellipse cx="0" cy="-14" rx="40" ry="12" fill="${t.deco}" opacity="0.35"/>` +
        _filet("M-52 22 q52 16 104 0", t.deco, 2.5) +
        `</g>`;
    });
    return out;
  },
  sauciere(t) {
    return (
      _ombrePortee(300, 430, 175, 22) +
      `<ellipse cx="300" cy="408" rx="185" ry="40" fill="${t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="398" rx="185" ry="40" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<path d="M160 250 q6 120 40 138 q100 22 200 0 q34 -18 40 -138 Z" fill="${t.base}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      `<path d="M160 250 q140 44 280 0 l-14 -16 q-126 34 -252 0 Z" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<path d="M150 244 l-52 -34 q-8 22 18 40 Z" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<path d="M440 236 q76 -46 46 60" fill="none" stroke="${t.fonce}" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M440 236 q76 -46 46 60" fill="none" stroke="${t.deco}" stroke-width="6" stroke-linecap="round"/>` +
      _filet("M172 298 q128 34 256 0", t.deco, 3) +
      `<path d="M188 286 q6 82 24 100" fill="none" stroke="#FFFFFF" stroke-width="14" opacity="0.35" stroke-linecap="round"/>`
    );
  },
  beurrier(t) {
    return (
      _ombrePortee(300, 448, 165, 22) +
      `<ellipse cx="300" cy="424" rx="172" ry="38" fill="${t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="414" rx="172" ry="38" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<path d="M155 400 q-4 -190 145 -190 q149 0 145 190 Z" fill="${t.base}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      `<ellipse cx="300" cy="400" rx="145" ry="34" fill="${t.clair}" opacity="0.6"/>` +
      `<circle cx="300" cy="192" r="26" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      _filet("M172 330 q128 40 256 0", t.deco, 4) +
      _filet("M164 300 q136 42 272 0", t.deco, 2) +
      _semis(300, 350, 60, t.deco, 5, 17) +
      `<path d="M198 268 q-14 70 -8 120" fill="none" stroke="#FFFFFF" stroke-width="16" opacity="0.35" stroke-linecap="round"/>`
    );
  },
  cafetiere(t) {
    return (
      _ombrePortee(300, 470, 150, 22) +
      `<ellipse cx="300" cy="448" rx="112" ry="28" fill="${t.fonce}"/>` +
      `<path d="M198 180 q-16 240 4 268 q98 22 196 0 q20 -28 4 -268 Z" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<path d="M395 240 q78 30 6 116" fill="none" stroke="${t.trait}" stroke-width="16" stroke-linecap="round"/>` +
      `<path d="M395 240 q78 30 6 116" fill="none" stroke="${t.clair}" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M200 214 l-56 -34 q-12 26 18 48 Z" fill="${t.clair}" stroke="${t.trait}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="180" rx="102" ry="26" fill="${t.clair}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<path d="M212 172 q88 -78 176 0 Z" fill="${t.clair}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<circle cx="300" cy="108" r="16" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      _filet("M204 262 q96 24 192 0", t.deco, 4) +
      _filet("M202 420 q98 22 196 0", t.deco, 3) +
      `<path d="M226 232 q-12 120 -4 190" fill="none" stroke="#FFFFFF" stroke-width="16" opacity="0.35" stroke-linecap="round"/>`
    );
  },

  /* ---- verrerie ---- */
  verre(t, m) {
    return (
      _ombrePortee(300, 486, 120, 18) +
      `<ellipse cx="300" cy="470" rx="98" ry="24" fill="${t.base}" stroke="${t.trait}" stroke-width="2" opacity="0.9"/>` +
      `<path d="M292 300 L292 462 L308 462 L308 300 Z" fill="${t.base}" opacity="0.85" stroke="${t.trait}" stroke-width="1.5"/>` +
      `<ellipse cx="300" cy="356" rx="26" ry="26" fill="${t.clair}" stroke="${t.trait}" stroke-width="1.5" opacity="0.9"/>` +
      `<path d="M186 132 q0 190 114 190 q114 0 114 -190 Z" fill="${t.base}" opacity="0.7" stroke="${t.trait}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="132" rx="114" ry="30" fill="${t.clair}" stroke="${t.trait}" stroke-width="2"/>` +
      (m === "taille" ? _tailleDiamant(300, 200, 100, t.trait) : "") +
      `<path d="M214 168 q6 116 62 146" fill="none" stroke="#FFFFFF" stroke-width="14" opacity="0.55" stroke-linecap="round"/>` +
      `<path d="M370 174 q-4 96 -34 128" fill="none" stroke="#FFFFFF" stroke-width="7" opacity="0.4" stroke-linecap="round"/>`
    );
  },
  carafe(t) {
    return (
      _ombrePortee(300, 486, 135, 20) +
      `<path d="M270 176 L270 236 q-108 56 -108 152 q0 84 138 84 q138 0 138 -84 q0 -96 -108 -152 L330 176 Z" fill="${t.base}" opacity="0.75" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<ellipse cx="300" cy="470" rx="112" ry="22" fill="${t.clair}" opacity="0.5"/>` +
      `<rect x="268" y="150" width="64" height="16" rx="6" fill="${t.clair}" stroke="${t.trait}" stroke-width="2"/>` +
      `<path d="M262 150 q38 -70 76 0 Z" fill="${t.clair}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<circle cx="300" cy="86" r="30" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5" opacity="0.85"/>` +
      `<circle cx="290" cy="78" r="10" fill="#FFFFFF" opacity="0.7"/>` +
      `<path d="M198 320 q-10 92 62 128" fill="none" stroke="#FFFFFF" stroke-width="16" opacity="0.5" stroke-linecap="round"/>` +
      `<circle cx="352" cy="330" r="6" fill="#FFFFFF" opacity="0.5"/>` +
      `<circle cx="330" cy="382" r="4" fill="#FFFFFF" opacity="0.45"/>`
    );
  },
  vase(t) {
    return (
      _ombrePortee(300, 478, 96, 18) +
      `<path d="M262 130 q-8 90 -32 150 q-22 56 -6 100 q30 84 76 84 q46 0 76 -84 q16 -44 -6 -100 q-24 -60 -32 -150 Z" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<ellipse cx="300" cy="130" rx="38" ry="12" fill="${t.fonce}" stroke="${t.trait}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="126" rx="28" ry="8" fill="${t.trait}" opacity="0.5"/>` +
      `<path d="M252 300 q-24 96 22 150" fill="none" stroke="#FFFFFF" stroke-width="18" opacity="0.32" stroke-linecap="round"/>` +
      `<path d="M276 168 q-6 60 -18 96" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.4" stroke-linecap="round"/>`
    );
  },
  lampe(t) {
    return (
      _ombrePortee(300, 486, 118, 20) +
      `<ellipse cx="300" cy="470" rx="104" ry="26" fill="${t.fonce}" stroke="${t.trait}" stroke-width="2"/>` +
      `<path d="M258 180 q-14 66 -46 116 q-40 62 -18 122 q26 62 106 62 q80 0 106 -62 q22 -60 -18 -122 q-32 -50 -46 -116 Z" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<ellipse cx="300" cy="180" rx="42" ry="13" fill="${t.clair}" stroke="${t.trait}" stroke-width="2"/>` +
      `<rect x="288" y="96" width="24" height="88" rx="8" fill="${t.fonce}" stroke="${t.trait}" stroke-width="2"/>` +
      `<rect x="270" y="72" width="60" height="30" rx="10" fill="${t.clair}" stroke="${t.trait}" stroke-width="2"/>` +
      `<path d="M242 300 q-40 92 12 150" fill="none" stroke="${t.clair}" stroke-width="22" opacity="0.45" stroke-linecap="round"/>` +
      `<path d="M340 262 q34 84 8 148" fill="none" stroke="${t.fonce}" stroke-width="14" opacity="0.5" stroke-linecap="round"/>`
    );
  },

  /* ---- métal argenté ---- */
  "rond-serviette"(t) {
    let out = _ombrePortee(300, 432, 190, 22);
    const pos = [
      { x: 196, y: 330, r: 92 },
      { x: 404, y: 330, r: 92 },
      { x: 300, y: 218, r: 100 },
    ];
    pos.forEach((p) => {
      out +=
        `<ellipse cx="${p.x}" cy="${p.y}" rx="${p.r}" ry="${p.r * 0.94}" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
        `<ellipse cx="${p.x}" cy="${p.y}" rx="${p.r * 0.7}" ry="${p.r * 0.66}" fill="${FOND.haut}" stroke="${t.trait}" stroke-width="2"/>` +
        `<ellipse cx="${p.x}" cy="${p.y}" rx="${p.r * 0.86}" ry="${p.r * 0.81}" fill="none" stroke="${t.clair}" stroke-width="3"/>` +
        `<path d="M${p.x - p.r * 0.72} ${p.y - p.r * 0.4} a ${p.r} ${p.r} 0 0 1 ${p.r * 0.8} ${-p.r * 0.36}" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.6" stroke-linecap="round"/>`;
    });
    return out;
  },
  "passe-the"(t) {
    return (
      _ombrePortee(300, 430, 170, 22) +
      `<ellipse cx="300" cy="400" rx="150" ry="42" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<ellipse cx="300" cy="392" rx="150" ry="42" fill="${t.clair}" stroke="${t.trait}" stroke-width="2"/>` +
      `<ellipse cx="300" cy="392" rx="110" ry="28" fill="none" stroke="${t.deco}" stroke-width="2"/>` +
      `<g transform="translate(268 240) rotate(-18)">` +
      `<rect x="60" y="-9" width="180" height="18" rx="9" fill="${t.base}" stroke="${t.trait}" stroke-width="2"/>` +
      `<circle cx="0" cy="0" r="84" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<circle cx="0" cy="0" r="66" fill="${t.clair}" stroke="${t.trait}" stroke-width="1.5"/>` +
      _perforations(0, 0, 56, t.trait) +
      `<path d="M-60 -46 a 78 78 0 0 1 62 -30" fill="none" stroke="#FFFFFF" stroke-width="9" opacity="0.6" stroke-linecap="round"/>` +
      `</g>`
    );
  },
  couverts(t) {
    return (
      _ombrePortee(300, 470, 175, 22) +
      `<g transform="translate(228 300) rotate(-9)">` +
      `<path d="M-22 -180 q40 -34 44 0 q10 90 -18 118 l-8 0 q-28 -28 -18 -118 Z" fill="${t.base}" stroke="${t.trait}" stroke-width="2"/>` +
      `<rect x="-11" y="-64" width="22" height="220" rx="9" fill="${t.deco}" stroke="${t.trait}" stroke-width="2"/>` +
      `<circle cx="0" cy="-140" r="7" fill="${t.clair}" opacity="0.7"/>` +
      `</g>` +
      `<g transform="translate(372 300) rotate(9)">` +
      `<path d="M-34 -180 q34 -26 68 0 q6 78 -22 96 l-24 0 q-28 -18 -22 -96 Z" fill="${t.base}" stroke="${t.trait}" stroke-width="2"/>` +
      `<path d="M-20 -170 l0 60 M0 -176 l0 66 M20 -170 l0 60" stroke="${t.trait}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<rect x="-11" y="-88" width="22" height="240" rx="9" fill="${t.deco}" stroke="${t.trait}" stroke-width="2"/>` +
      `</g>` +
      `<path d="M206 130 q22 -20 40 -4" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="0.6" stroke-linecap="round"/>`
    );
  },
  "porte-couteau"(t) {
    let out = _ombrePortee(300, 400, 190, 20);
    const pos = [
      { x: 176, y: 322, s: 0.78 },
      { x: 300, y: 246, s: 0.84 },
      { x: 424, y: 322, s: 0.78 },
    ];
    pos.forEach((p) => {
      out +=
        `<g transform="translate(${p.x} ${p.y}) scale(${p.s})">` +
        `<ellipse cx="0" cy="66" rx="82" ry="13" fill="${t.trait}" opacity="0.22"/>` +
        `<circle cx="-62" cy="44" r="22" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
        `<circle cx="62" cy="44" r="22" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
        `<path d="M-62 22 q62 -92 124 0 q-14 8 -22 4 q-40 -58 -80 0 q-8 4 -22 -4 Z" fill="${t.clair}" stroke="${t.trait}" stroke-width="2.5" stroke-linejoin="round"/>` +
        `<path d="M-34 -6 q34 -40 68 0" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="0.7" stroke-linecap="round"/>` +
        `</g>`;
    });
    return out;
  },
  pelle(t) {
    return (
      _ombrePortee(300, 458, 150, 20) +
      `<g transform="translate(300 300) rotate(-14)">` +
      `<path d="M-90 -190 q90 -46 180 0 q10 96 -50 132 l-80 0 q-60 -36 -50 -132 Z" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<path d="M-56 -140 q56 -26 112 0" fill="none" stroke="${t.trait}" stroke-width="2.5"/>` +
      _vigne(0, -100, t.trait) +
      `<rect x="-14" y="-62" width="28" height="270" rx="12" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<path d="M-6 -40 l0 230" stroke="#FFFFFF" stroke-width="7" opacity="0.55" stroke-linecap="round"/>` +
      `<circle cx="0" cy="196" r="16" fill="${t.clair}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `</g>`
    );
  },

  /* ---- textiles ---- */
  torchon(t, m) {
    return (
      _ombrePortee(300, 476, 190, 20) +
      `<g transform="translate(300 300) rotate(-3)">` +
      `<rect x="-210" y="-176" width="420" height="352" rx="8" fill="${t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
      _trameLin(-210, -176, 420, 352, t.fonce) +
      (m === "raie-rouge"
        ? `<rect x="-210" y="-104" width="420" height="26" fill="${t.deco}" opacity="0.85"/>
           <rect x="-210" y="-64" width="420" height="10" fill="${t.deco}" opacity="0.6"/>`
        : "") +
      `<path d="M-210 60 q108 -34 210 0 q104 32 210 0" fill="none" stroke="${t.fonce}" stroke-width="2" opacity="0.5"/>` +
      `<g transform="translate(96 116)" fill="none" stroke="${t.deco}" stroke-width="4" stroke-linecap="round">` +
      `<path d="M-34 22 l0 -44 l18 32 l18 -32 l0 44"/><path d="M22 -22 l0 44 l30 0"/></g>` +
      `<path d="M-190 -160 q30 340 0 320" fill="none" stroke="#FFFFFF" stroke-width="14" opacity="0.3"/>` +
      `</g>`
    );
  },
  nappe(t) {
    return (
      _ombrePortee(300, 486, 205, 20) +
      `<path d="M92 128 q208 -40 416 0 l0 350 q-208 40 -416 0 Z" fill="${t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
      `<path d="M92 128 q208 -40 416 0" fill="none" stroke="${t.fonce}" stroke-width="2" opacity="0.6"/>` +
      _damasse(120, 150, 360, 300, t.fonce) +
      `<path d="M124 140 q0 350 0 340 M188 132 q0 356 0 348 M412 132 q0 356 0 348 M476 140 q0 344 0 336" fill="none" stroke="${t.fonce}" stroke-width="1.2" opacity="0.35"/>` +
      `<path d="M150 150 q22 330 4 320" fill="none" stroke="#FFFFFF" stroke-width="26" opacity="0.45"/>` +
      `<path d="M380 146 q-16 336 2 324" fill="none" stroke="${t.fonce}" stroke-width="10" opacity="0.16"/>`
    );
  },
  mouchoir(t) {
    let out = _ombrePortee(300, 462, 180, 20);
    const pos = [
      { x: 226, y: 268, r: -12 },
      { x: 378, y: 250, r: 9 },
      { x: 300, y: 366, r: -3 },
    ];
    pos.forEach((p, i) => {
      out +=
        `<g transform="translate(${p.x} ${p.y}) rotate(${p.r})">` +
        `<rect x="-124" y="-124" width="248" height="248" rx="6" fill="${i === 2 ? t.clair : t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
        `<rect x="-104" y="-104" width="208" height="208" fill="none" stroke="${t.fonce}" stroke-width="1.5" stroke-dasharray="6 5" opacity="0.7"/>` +
        _semis(-56, -50, 42, t.deco, 4, 9 + i * 4) +
        `</g>`;
    });
    return out;
  },
  rideau(t) {
    return (
      `<rect x="118" y="96" width="364" height="408" rx="4" fill="${t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
      _filetBrode(130, 108, 340, 384, t.fonce) +
      `<path d="M130 430 l340 0" stroke="${t.fonce}" stroke-width="3" opacity="0.6"/>` +
      `<path d="M140 452 l14 26 l14 -26 M180 452 l14 26 l14 -26 M220 452 l14 26 l14 -26 M260 452 l14 26 l14 -26 M300 452 l14 26 l14 -26 M340 452 l14 26 l14 -26 M380 452 l14 26 l14 -26 M420 452 l14 26 l14 -26" fill="none" stroke="${t.fonce}" stroke-width="2.5"/>` +
      `<path d="M160 100 q20 200 -4 400" fill="none" stroke="#FFFFFF" stroke-width="26" opacity="0.35"/>`
    );
  },
  serviette(t, m) {
    let out = _ombrePortee(300, 466, 180, 20);
    const pos = [
      { x: 300, y: 350, s: 1 },
      { x: 300, y: 250, s: 0.94 },
      { x: 300, y: 162, s: 0.88 },
    ];
    pos.reverse().forEach((p, i) => {
      out +=
        `<g transform="translate(${p.x} ${p.y}) scale(${p.s})">` +
        `<rect x="-176" y="-58" width="352" height="116" rx="6" fill="${i % 2 ? t.clair : t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
        _trameLin(-176, -58, 352, 116, t.fonce) +
        `<path d="M-176 -34 l352 0 M-176 34 l352 0" stroke="${t.fonce}" stroke-width="1.2" opacity="0.4"/>` +
        (m === "croix-rouge"
          ? `<g transform="translate(112 0)" stroke="${t.deco}" stroke-width="4" fill="none" stroke-linecap="round">
               <path d="M-18 14 l0 -28 M-18 -14 l16 28 l16 -28 M14 -14 l0 28"/></g>`
          : "") +
        `</g>`;
    });
    return out;
  },

  /* ---- papier & cadres ---- */
  gravure(t) {
    return (
      `<rect x="118" y="76" width="364" height="448" rx="3" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2"/>` +
      _rousseurs(118, 76, 364, 448) +
      `<rect x="150" y="108" width="300" height="384" fill="none" stroke="${t.fonce}" stroke-width="1" opacity="0.5"/>` +
      _iris(300, 300, t) +
      `<path d="M212 470 l176 0" stroke="${t.trait}" stroke-width="1.5" opacity="0.5"/>` +
      `<text x="300" y="492" font-family="Georgia, serif" font-style="italic" font-size="19" fill="${t.trait}" text-anchor="middle" opacity="0.75">Iris germanica</text>` +
      `<text x="452" y="100" font-family="Georgia, serif" font-size="15" fill="${t.trait}" text-anchor="end" opacity="0.6">Pl. XIV</text>`
    );
  },
  cartes(t) {
    let out = _ombrePortee(300, 470, 180, 20);
    const pos = [
      { x: 214, y: 296, r: -11 },
      { x: 386, y: 274, r: 8 },
      { x: 300, y: 372, r: -2 },
    ];
    pos.forEach((p, i) => {
      out +=
        `<g transform="translate(${p.x} ${p.y}) rotate(${p.r})">` +
        `<rect x="-118" y="-78" width="236" height="156" rx="4" fill="${i === 2 ? t.clair : t.base}" stroke="${t.fonce}" stroke-width="2"/>` +
        `<rect x="-108" y="-68" width="122" height="136" fill="${t.fonce}" opacity="0.3"/>` +
        `<path d="M-104 34 q30 -44 58 -8 q22 -34 44 14 l0 24 l-102 0 Z" fill="${t.trait}" opacity="0.35"/>` +
        `<circle cx="-72" cy="-32" r="12" fill="${t.clair}" opacity="0.6"/>` +
        `<path d="M28 -46 l80 0 M28 -26 l72 0 M28 -6 l84 0 M28 14 l60 0 M28 34 l76 0" stroke="${t.trait}" stroke-width="2" opacity="0.45" stroke-linecap="round"/>` +
        `<rect x="72" y="-64" width="34" height="26" fill="none" stroke="${t.deco}" stroke-width="1.5" opacity="0.6"/>` +
        `</g>`;
    });
    return out;
  },
  livre(t) {
    return (
      _ombrePortee(300, 470, 178, 22) +
      `<g transform="translate(300 300) rotate(-4)">` +
      `<path d="M-158 -180 l276 0 q26 0 26 26 l0 300 q0 26 -26 26 l-276 0 Z" fill="${t.base}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      `<path d="M-158 -180 q-26 176 0 352" fill="${t.fonce}" stroke="${t.fonce}" stroke-width="2.5"/>` +
      `<path d="M118 -174 l0 340" stroke="${t.deco}" stroke-width="10" opacity="0.5"/>` +
      `<path d="M-128 -180 l0 352 M-98 -180 l0 352" stroke="${t.fonce}" stroke-width="2" opacity="0.7"/>` +
      `<g stroke="${t.deco}" stroke-width="2.5" fill="none">` +
      `<path d="M-146 -110 q-14 6 0 12 M-146 -30 q-14 6 0 12 M-146 50 q-14 6 0 12 M-146 130 q-14 6 0 12"/></g>` +
      `<rect x="-70" y="-118" width="150" height="52" rx="4" fill="none" stroke="${t.deco}" stroke-width="2.5" opacity="0.8"/>` +
      `<path d="M-52 -100 l112 0 M-52 -84 l86 0" stroke="${t.deco}" stroke-width="3" opacity="0.7" stroke-linecap="round"/>` +
      _fleuron(4, 40, t.deco) +
      `<path d="M-120 -150 q-8 160 0 300" fill="none" stroke="#FFFFFF" stroke-width="12" opacity="0.18"/>` +
      `</g>`
    );
  },
  chromo(t) {
    let out = _ombrePortee(300, 462, 170, 20);
    out += `<rect x="146" y="112" width="308" height="376" rx="4" fill="${t.clair}" stroke="${t.fonce}" stroke-width="2"/>`;
    out += _rousseurs(146, 112, 308, 376);
    const fleurs = [
      { x: 226, y: 196, c: "#C4788C" },
      { x: 376, y: 208, c: "#7E93B8" },
      { x: 214, y: 330, c: "#D0A05C" },
      { x: 382, y: 348, c: "#8FA37C" },
      { x: 300, y: 434, c: "#B96F72" },
    ];
    fleurs.forEach((f, i) => {
      out += `<g transform="translate(${f.x} ${f.y})">`;
      for (let p = 0; p < 6; p++) {
        out += `<ellipse cx="0" cy="-30" rx="17" ry="30" fill="${f.c}" opacity="0.85" transform="rotate(${(p / 6) * 360})"/>`;
      }
      out += `<circle r="13" fill="${t.base}"/><circle r="13" fill="none" stroke="${f.c}" stroke-width="2"/>`;
      out += `<path d="M0 32 q${i % 2 ? 22 : -22} 34 0 58" fill="none" stroke="#7E8F6A" stroke-width="4"/></g>`;
    });
    out += `<rect x="164" y="130" width="272" height="340" fill="none" stroke="${t.fonce}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.7"/>`;
    return out;
  },
  tableau(t) {
    const cadre = TEINTES.dore;
    return (
      _ombrePortee(300, 496, 180, 18) +
      `<rect x="96" y="92" width="408" height="400" rx="4" fill="${cadre.base}" stroke="${cadre.trait}" stroke-width="3"/>` +
      `<rect x="112" y="108" width="376" height="368" fill="none" stroke="${cadre.clair}" stroke-width="6"/>` +
      `<rect x="136" y="132" width="328" height="320" fill="${cadre.fonce}" stroke="${cadre.trait}" stroke-width="2"/>` +
      `<rect x="146" y="142" width="308" height="300" fill="${t.clair}"/>` +
      /* ciel */
      `<rect x="146" y="142" width="308" height="150" fill="${t.clair}"/>` +
      `<ellipse cx="250" cy="196" rx="86" ry="26" fill="#FFFFFF" opacity="0.55"/>` +
      `<ellipse cx="370" cy="176" rx="60" ry="18" fill="#FFFFFF" opacity="0.4"/>` +
      /* rivière */
      `<path d="M146 292 q154 -28 308 8 l0 142 l-308 0 Z" fill="${t.fonce}"/>` +
      `<path d="M146 320 q154 -22 308 10 l0 112 l-308 0 Z" fill="${t.base}"/>` +
      `<path d="M170 372 l90 0 M240 396 l120 0 M180 414 l70 0" stroke="#FFFFFF" stroke-width="4" opacity="0.45" stroke-linecap="round"/>` +
      /* peupliers */
      `<path d="M196 300 q-16 -84 8 -118 q24 34 8 118 Z" fill="${t.fonce}"/>` +
      `<path d="M228 300 q-12 -66 6 -92 q18 26 6 92 Z" fill="${t.trait}" opacity="0.8"/>` +
      `<path d="M398 302 q-18 -96 10 -134 q28 38 10 134 Z" fill="${t.fonce}"/>` +
      `<path d="M146 292 q154 -26 308 6" fill="none" stroke="${t.trait}" stroke-width="3" opacity="0.7"/>` +
      `<path d="M330 428 q-40 -18 -70 4" fill="none" stroke="${t.deco}" stroke-width="5" opacity="0.8"/>` +
      `<text x="440" y="432" font-family="Georgia, serif" font-style="italic" font-size="15" fill="${t.trait}" text-anchor="end" opacity="0.7">…rd</text>`
    );
  },
  miroir(t) {
    return (
      _ombrePortee(300, 486, 150, 18) +
      `<circle cx="300" cy="292" r="200" fill="${t.base}" stroke="${t.trait}" stroke-width="3"/>` +
      _perles(300, 292, 200, t.clair, t.trait) +
      `<circle cx="300" cy="292" r="164" fill="${t.fonce}" stroke="${t.trait}" stroke-width="2"/>` +
      `<circle cx="300" cy="292" r="150" fill="#CFD4CE"/>` +
      `<circle cx="300" cy="292" r="150" fill="url(#bombe)"/>` +
      `<path d="M186 214 a 150 150 0 0 1 122 -58 l-40 42 a 110 110 0 0 0 -60 34 Z" fill="#FFFFFF" opacity="0.5"/>` +
      `<circle cx="256" cy="340" r="7" fill="#B9AE9C" opacity="0.7"/>` +
      `<circle cx="344" cy="256" r="5" fill="#B9AE9C" opacity="0.6"/>` +
      `<circle cx="318" cy="386" r="4" fill="#B9AE9C" opacity="0.6"/>`
    );
  },
  boite(t) {
    return (
      _ombrePortee(300, 452, 190, 20) +
      `<path d="M120 236 l180 -96 l180 96 l-180 96 Z" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
      _etoileMarqueterie(300, 236, 96, t) +
      `<path d="M120 236 l0 84 l180 96 l0 -84 Z" fill="${t.fonce}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<path d="M480 236 l0 84 l-180 96 l0 -84 Z" fill="${t.clair}" stroke="${t.trait}" stroke-width="2.5"/>` +
      `<path d="M136 254 l0 62 M148 262 l0 62" stroke="${t.deco}" stroke-width="2" opacity="0.6"/>` +
      `<path d="M464 254 l0 62 M452 262 l0 62" stroke="${t.deco}" stroke-width="2" opacity="0.5"/>` +
      `<rect x="286" y="322" width="28" height="14" rx="3" fill="${TEINTES.laiton.base}" stroke="${t.trait}" stroke-width="1.5"/>`
    );
  },
  cadre(t) {
    let out = _ombrePortee(300, 470, 180, 20);
    const pos = [
      { x: 216, y: 300, r: -7, s: 0.96 },
      { x: 388, y: 288, r: 6, s: 1 },
    ];
    pos.forEach((p) => {
      out +=
        `<g transform="translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s})">` +
        `<rect x="-104" y="-146" width="208" height="292" rx="6" fill="${t.base}" stroke="${t.trait}" stroke-width="2.5"/>` +
        `<rect x="-86" y="-128" width="172" height="256" fill="${TEINTES.papier.clair}" stroke="${t.trait}" stroke-width="1.5"/>` +
        `<rect x="-104" y="-146" width="208" height="292" rx="6" fill="none" stroke="${t.clair}" stroke-width="4" opacity="0.7"/>` +
        _rinceaux(0, -146, 208, t.fonce) +
        _rinceaux(0, 146, 208, t.fonce) +
        `<ellipse cx="0" cy="-30" rx="42" ry="52" fill="${t.trait}" opacity="0.18"/>` +
        `<path d="M-52 100 q52 -66 104 0 Z" fill="${t.trait}" opacity="0.18"/>` +
        `<path d="M-92 -130 l0 250" stroke="#FFFFFF" stroke-width="7" opacity="0.5"/>` +
        `</g>`;
    });
    return out;
  },
};

/* --- motifs auxiliaires -------------------------------------------- */

function _epis(cx, cy, r, c) {
  let out = "";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = cx + Math.cos(a) * r * 0.78;
    const y = cy + Math.sin(a) * r * 0.78;
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((a * 180) / Math.PI + 90).toFixed(0)})" stroke="${c}" stroke-width="2.5" fill="none" opacity="0.8">
      <path d="M0 26 L0 -26"/>
      <path d="M0 -18 q10 -8 6 -18 M0 -18 q-10 -8 -6 -18 M0 -4 q11 -8 7 -18 M0 -4 q-11 -8 -7 -18 M0 10 q11 -8 7 -18 M0 10 q-11 -8 -7 -18"/></g>`;
  }
  return out;
}

function _godrons(cx, cy, rx, ry, c) {
  let out = "";
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * rx * 0.42;
    const y1 = cy + Math.sin(a) * ry * 0.42 + 8;
    const x2 = cx + Math.cos(a) * rx * 0.97;
    const y2 = cy + Math.sin(a) * ry * 0.97 + 26;
    out += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${c}" stroke-width="2" opacity="0.45"/>`;
  }
  return out;
}

function _tailleDiamant(cx, cy, w, c) {
  let out = "";
  for (let i = -3; i <= 3; i++) {
    out += `<path d="M${cx + i * 32} ${cy - 60} l0 120" stroke="${c}" stroke-width="1.6" opacity="0.5"/>`;
  }
  for (let i = 0; i < 6; i++) {
    out += `<path d="M${cx - 100 + i * 34} ${cy - 46} l17 20 l-17 20 l-17 -20 Z" fill="none" stroke="${c}" stroke-width="1.6" opacity="0.55"/>`;
  }
  return out;
}

function _perforations(cx, cy, r, c) {
  let out = "";
  for (let ring = 1; ring <= 3; ring++) {
    const rr = (r / 3.4) * ring;
    const n = ring * 8;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      out += `<circle cx="${(cx + Math.cos(a) * rr).toFixed(1)}" cy="${(cy + Math.sin(a) * rr).toFixed(1)}" r="3.2" fill="${c}" opacity="0.55"/>`;
    }
  }
  return out;
}

function _vigne(cx, cy, c) {
  return `<g transform="translate(${cx} ${cy})" stroke="${c}" fill="none" stroke-width="2.5" opacity="0.8">
    <path d="M-46 30 q28 -40 46 -34 q20 -8 46 34"/>
    <circle cx="-16" cy="6" r="7"/><circle cx="0" cy="18" r="7"/><circle cx="16" cy="6" r="7"/>
    <circle cx="-8" cy="-8" r="7"/><circle cx="8" cy="-8" r="7"/>
    <path d="M34 -12 q16 -18 30 -6 M-34 -12 q-16 -18 -30 -6"/></g>`;
}

function _trameLin(x, y, w, h, c) {
  let out = `<g opacity="0.22" stroke="${c}" stroke-width="1">`;
  for (let i = 10; i < w; i += 14) out += `<path d="M${x + i} ${y} l0 ${h}"/>`;
  for (let j = 10; j < h; j += 14) out += `<path d="M${x} ${y + j} l${w} 0"/>`;
  return out + "</g>";
}

function _damasse(x, y, w, h, c) {
  let out = `<g opacity="0.5" fill="none" stroke="${c}" stroke-width="2.2">`;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const cx = x + 36 + i * (w / 5);
      const cy = y + 30 + j * (h / 5);
      out += `<g transform="translate(${cx.toFixed(0)} ${cy.toFixed(0)})">
        <circle r="13"/><circle r="5"/>
        <path d="M-13 0 q-16 -16 -2 -26 M13 0 q16 16 2 26 M0 -13 q16 -16 26 -2 M0 13 q-16 16 -26 2"/></g>`;
    }
  }
  return out + "</g>";
}

function _filetBrode(x, y, w, h, c) {
  let out = `<g opacity="0.55" stroke="${c}" stroke-width="1.6" fill="none">`;
  for (let i = 0; i <= w; i += 20) out += `<path d="M${x + i} ${y} l0 ${h}"/>`;
  for (let j = 0; j <= h; j += 20) out += `<path d="M${x} ${y + j} l${w} 0"/>`;
  out += "</g>";
  out += `<g opacity="0.8" stroke="${c}" stroke-width="3.5" fill="none">`;
  for (let i = 0; i < 4; i++) {
    const cx = x + 62 + i * 80;
    const cy = y + 150;
    out += `<path d="M${cx} ${cy - 40} l40 40 l-40 40 l-40 -40 Z"/>`;
    out += `<path d="M${cx} ${cy + 130} l24 24 l-24 24 l-24 -24 Z"/>`;
  }
  return out + "</g>";
}

function _rousseurs(x, y, w, h) {
  let s = 3;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let out = `<g fill="#C6A87C" opacity="0.3">`;
  for (let i = 0; i < 26; i++) {
    out += `<circle cx="${(x + rnd() * w).toFixed(0)}" cy="${(y + rnd() * h).toFixed(0)}" r="${(1.5 + rnd() * 3.5).toFixed(1)}"/>`;
  }
  return out + "</g>";
}

function _iris(cx, cy, t) {
  return `<g transform="translate(${cx} ${cy})">
    <path d="M6 190 q-16 -140 -6 -190" fill="none" stroke="#7C8B62" stroke-width="7"/>
    <path d="M0 90 q-56 22 -74 96" fill="none" stroke="#7C8B62" stroke-width="6"/>
    <path d="M0 60 q52 30 62 110" fill="none" stroke="#7C8B62" stroke-width="6"/>
    <path d="M-8 -20 q-70 26 -52 96 q34 26 60 -22 Z" fill="#8E7FAE" opacity="0.85" stroke="#6B5F8C" stroke-width="2"/>
    <path d="M10 -20 q70 26 52 96 q-34 26 -60 -22 Z" fill="#8E7FAE" opacity="0.85" stroke="#6B5F8C" stroke-width="2"/>
    <path d="M0 -10 q-30 60 0 96 q30 -36 0 -96 Z" fill="#A899C4" opacity="0.9" stroke="#6B5F8C" stroke-width="2"/>
    <path d="M-4 -24 q-52 -40 -28 -96 q34 -18 42 42 Z" fill="#A899C4" opacity="0.8" stroke="#6B5F8C" stroke-width="2"/>
    <path d="M6 -24 q52 -40 28 -96 q-34 -18 -42 42 Z" fill="#A899C4" opacity="0.8" stroke="#6B5F8C" stroke-width="2"/>
    <path d="M0 -30 q-14 -70 2 -104 q18 34 4 104 Z" fill="#BFB2D6" opacity="0.9" stroke="#6B5F8C" stroke-width="2"/>
    <path d="M-14 34 q14 12 28 0" fill="none" stroke="#D8B45C" stroke-width="5"/>
  </g>`;
}

function _perles(cx, cy, r, clair, trait) {
  let out = "";
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2;
    out += `<circle cx="${(cx + Math.cos(a) * (r - 16)).toFixed(1)}" cy="${(cy + Math.sin(a) * (r - 16)).toFixed(1)}" r="9" fill="${clair}" stroke="${trait}" stroke-width="1.2"/>`;
  }
  return out;
}

function _etoileMarqueterie(cx, cy, r, t) {
  let out = "";
  for (let i = 0; i < 8; i++) {
    const a1 = (i / 8) * Math.PI * 2;
    const a2 = ((i + 0.5) / 8) * Math.PI * 2;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + (Math.sin(a1) * r) / 1.9;
    const x2 = cx + Math.cos(a2) * (r * 0.42);
    const y2 = cy + (Math.sin(a2) * (r * 0.42)) / 1.9;
    out += `<path d="M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${i % 2 ? t.clair : t.fonce}" stroke="${t.trait}" stroke-width="1.2"/>`;
  }
  out += `<ellipse cx="${cx}" cy="${cy}" rx="14" ry="7" fill="${t.deco}" stroke="${t.trait}" stroke-width="1.2"/>`;
  return out;
}

function _fleuron(cx, cy, c) {
  return `<g transform="translate(${cx} ${cy})" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.85">
    <path d="M0 -18 q18 18 0 36 q-18 -18 0 -36"/>
    <path d="M-18 0 q18 -18 36 0 q-18 18 -36 0"/>
    <circle r="4"/></g>`;
}

function _rinceaux(cx, cy, w, c) {
  let out = `<g stroke="${c}" fill="none" stroke-width="2" opacity="0.65">`;
  for (let i = -2; i <= 2; i++) {
    out += `<path d="M${cx + i * 36 - 14} ${cy} q14 -14 28 0 q-14 14 -28 0"/>`;
  }
  return out + "</g>";
}

/* --- assemblage ---------------------------------------------------- */

/**
 * Retourne une data-URI SVG représentant le produit.
 * @param {object} produit
 * @param {number} variante 0 = vue de face, 1 = vue trois-quarts, 2 = détail
 */
function imageProduit(produit, variante) {
  const v = variante || 0;
  const t = _teinte(produit.img.teinte);
  const dessin = FORMES[produit.img.forme] || FORMES.assiette;
  const corps = dessin(t, produit.img.motif);

  const transforms = [
    "translate(300 308) scale(1.05) translate(-300 -300)",
    "translate(300 306) rotate(-5) scale(0.9) translate(-300 -300)",
    "translate(300 300) scale(1.55) translate(-300 -318)",
  ];

  const lumiere =
    v === 1
      ? `<ellipse cx="180" cy="140" rx="300" ry="230" fill="#FFFFFF" opacity="0.3"/>`
      : v === 2
      ? `<ellipse cx="420" cy="460" rx="320" ry="260" fill="${FOND.ombre}" opacity="0.28"/>`
      : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img">
  <defs>
    <linearGradient id="fond" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="${FOND.haut}"/><stop offset="1" stop-color="${FOND.bas}"/>
    </linearGradient>
    <radialGradient id="ombre" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${FOND.ombre}" stop-opacity="0.75"/>
      <stop offset="1" stop-color="${FOND.ombre}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bombe" cx="0.36" cy="0.3" r="0.75">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="0.55" stop-color="#E4E7E0" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#8E948A" stop-opacity="0.55"/>
    </radialGradient>
    <pattern id="toile" width="7" height="7" patternUnits="userSpaceOnUse">
      <path d="M0 0 L0 7 M0 0 L7 0" stroke="#C9BCA4" stroke-width="0.6" opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="600" height="600" fill="url(#fond)"/>
  <rect width="600" height="600" fill="url(#toile)"/>
  ${lumiere}
  <g transform="${transforms[v]}">${corps}</g>
  <rect width="600" height="600" fill="none" stroke="#D9CDB8" stroke-width="1"/>
</svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.replace(/\s+/g, " "));
}

/** Trois vues par produit, comme une petite galerie photo. */
function galerieProduit(produit) {
  return [0, 1, 2].map((v) => imageProduit(produit, v));
}
