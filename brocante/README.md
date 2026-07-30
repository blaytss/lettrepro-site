# La Malle d'Automne — maquette de brocante en ligne

Boutique statique en HTML / CSS / JavaScript vanilla. Aucun framework, aucune
dépendance, aucune requête réseau : les photos produit sont des illustrations
SVG générées à la volée par le navigateur. Le site fonctionne donc entièrement
hors ligne.

## Ouvrir le site

### Sur un ordinateur
Double-cliquez sur `index.html`. C'est tout.

### Sur votre téléphone

**Option 1 — le fichier unique (le plus simple)**
`la-malle-dautomne.html` contient tout le site : les neuf pages, le style, le
catalogue et les visuels, dans un seul fichier de 180 Ko. Envoyez-le-vous par
mail ou AirDrop, enregistrez-le, puis ouvrez-le. Aucun dossier à conserver à
côté, aucune connexion nécessaire.

Ce fichier est reconstruit à partir des sources avec :

```bash
node build-fichier-unique.js
```

**Option 2 — servir le dossier depuis l'ordinateur**
L'ordinateur et le téléphone doivent être sur le même Wi-Fi.

```bash
cd brocante
python3 -m http.server 8080
```

Relevez l'adresse IP locale de l'ordinateur (`ipconfig getifaddr en0` sur macOS,
`hostname -I` sous Linux, `ipconfig` sous Windows), puis ouvrez sur le téléphone :

```
http://192.168.x.x:8080
```

**Option 3 — publier en ligne**
Le dossier est un site statique : déposez-le tel quel sur GitHub Pages, Netlify
ou n'importe quel hébergement, et il fonctionne sans configuration.

## Structure

```
brocante/
├── la-malle-dautomne.html     TOUT le site en un seul fichier (généré)
├── build-fichier-unique.js    script qui régénère le fichier ci-dessus
├── index.html                 page d'accueil (hero, réassurance, un carrousel
│                              par univers, avis clients, à propos)
├── boutique.html              grille filtrable par univers, avec tri
├── produit.html               fiche produit (?ref=AT-104)
├── a-propos.html              storytelling + engagements de vente en ligne
├── contact.html               formulaire de question avant achat
├── livraison-et-retours.html
├── cgv.html
├── mentions-legales.html
├── confidentialite.html
└── assets/
    ├── css/style.css          toute la feuille de style
    └── js/
        ├── data.js            catalogue (31 pièces) + avis clients
        ├── images.js          générateur d'illustrations SVG
        ├── app.js             en-tête, pied de page, région, panier, alertes
        ├── home.js            rendu de la page d'accueil
        ├── boutique.js        filtres et grille
        └── produit.js         fiche produit et avis
```

## Modifier le catalogue

Tout est dans `assets/js/data.js`. Un produit ressemble à ceci :

```js
{
  ref: "AT-104",
  nom: "Paire de tasses à brûlot en faïence, XIXᵉ",
  univers: "art-de-la-table",   // slug défini dans le tableau UNIVERS
  prix: 74,
  stock: 1,                     // 0 = pièce partie (grisée, jamais mise en avant)
  coupDeCoeur: true,            // remonte dans la sélection de la home
  accroche: "…",                // phrase d'usage, émotionnelle
  histoire: "…",                // fabricant, époque, état, détail technique
  fabricant: "…", epoque: "…", etat: "…", dimensions: "…", matiere: "…",
  img: { forme: "tasse", teinte: "creme", motif: "floral" }
}
```

`forme` choisit le dessin (`assiette`, `plat`, `tasse`, `verre`, `carafe`,
`torchon`, `nappe`, `livre`, `tableau`, `miroir`, `boite`, `lampe`…) et `teinte`
la palette (`creme`, `ivoire`, `bleu`, `cristal`, `argent`, `lin`, `cuir`,
`dore`, `bois`, `vert`…). Les listes complètes sont en haut de `images.js`.

Pour remplacer les illustrations par de vraies photos, ajoutez un champ
`photos: ["assets/img/at-104-1.jpg", …]` et faites-le lire par
`galerieProduit()` dans `images.js`.

## Ce que le site fait

- **Avis clients** : moyenne et sélection en page d'accueil, liste complète sur
  chaque fiche produit, formulaire pour en déposer un (stocké dans le
  navigateur).
- **Pièces parties** : jamais dans les coups de cœur ni dans les carrousels de
  la home ; en boutique elles restent visibles, grisées, en fin de liste, avec
  un bouton « M'alerter si disponible ».
- **Région** : France / Union européenne / Reste du monde, un seul sélecteur
  discret en haut de page. Le choix met à jour le port et les délais partout.
- **Badges** : « Pièce unique » sur les vignettes, « Pièce unique — 1 seul
  exemplaire » et « Dernier exemplaire disponible » sur la fiche produit.
- **Panier** : tiroir latéral, une pièce ne peut être ajoutée qu'une fois,
  calcul du port et du franco selon la région.

Le paiement et l'envoi des messages ne sont pas branchés : c'est une maquette,
les formulaires affichent une confirmation locale.
