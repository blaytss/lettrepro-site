/* ------------------------------------------------------------------
   La Malle d'Automne — données de la boutique
   Tout est en dur : aucun serveur, aucune base de données.
   ------------------------------------------------------------------ */

const BOUTIQUE = {
  nom: "La Malle d'Automne",
  baseline: "Brocante en ligne — pièces uniques chinées à la main",
  email: "bonjour@lamalledautomne.fr",
  telephone: "06 12 34 56 78",
};

/* Les univers = les entrées du menu principal ------------------------ */
const UNIVERS = [
  {
    slug: "art-de-la-table",
    nom: "Art de la table",
    accroche: "Faïences, porcelaines et petites vaisselles dépareillées.",
    intro:
      "Des assiettes qui ont vu passer des générations de dimanches en famille. Je les choisis pour leur décor, leur émail craquelé, leur façon de rendre une table vivante.",
  },
  {
    slug: "le-verre",
    nom: "Le verre",
    accroche: "Verres à pied, carafes, compotiers et cristal.",
    intro:
      "Tout ce qui laisse passer la lumière : le verre soufflé un peu irrégulier, le cristal taillé qui fait des arcs-en-ciel sur la nappe.",
  },
  {
    slug: "l-argenterie",
    nom: "L'argenterie",
    accroche: "Métal argenté, couverts et accessoires de table.",
    intro:
      "Le métal argenté a cette patine douce qu'aucun neuf ne sait imiter. Ronds de serviette, passe-thé, porte-couteaux : les petits gestes du couvert d'autrefois.",
  },
  {
    slug: "les-tissus",
    nom: "Les tissus",
    accroche: "Torchons, nappes, mouchoirs et linge monogrammé.",
    intro:
      "Du linge de maison lavé, repassé, plié. Les monogrammes brodés main sont mes préférés : deux lettres, et toute une maisonnée derrière.",
  },
  {
    slug: "le-papier",
    nom: "Le papier",
    accroche: "Gravures, livres reliés, chromos et cartes postales.",
    intro:
      "Tout ce qui se trouve être en papier. Les gravures botaniques, les cartes écrites à la plume, les reliures fatiguées qui sentent la cave et le grenier.",
  },
  {
    slug: "la-decoration",
    nom: "La décoration",
    accroche: "Tableaux, miroirs, boîtes et objets de curiosité.",
    intro:
      "Les pièces qu'on pose sur une commode et qu'on regarde tous les jours sans s'en lasser. Un petit tableau, un miroir piqué, une boîte en marqueterie.",
  },
];

/* Les produits ------------------------------------------------------- */
/* stock : 1 = disponible, 0 = épuisé
   img   : { forme, teinte, motif } → sert au générateur d'images SVG   */

const PRODUITS = [
  /* ---------------- ART DE LA TABLE ---------------- */
  {
    ref: "AT-104",
    nom: "Paire de tasses à brûlot en faïence, XIXᵉ",
    univers: "art-de-la-table",
    prix: 74,
    stock: 1,
    coupDeCoeur: true,
    accroche:
      "Deux petites tasses qui ne servent plus à personne — et qui feront pourtant sensation en fin de repas, avec un café serré ou une bougie chauffe-plat glissée dedans.",
    histoire:
      "Faïence fine à décor floral peint à la main, rehaussé d'un filet ocre au pinceau. Le brûlot était l'usage normand du café arrosé d'eau-de-vie, servi brûlant dans des tasses sans anse. Émail légèrement tressailli, ce qui est normal et attendu sur cette production. Aucun éclat, aucune restauration.",
    fabricant: "Faïencerie de l'Est, non signée",
    epoque: "Fin XIXᵉ siècle",
    etat: "Très bon état d'usage — tressaillage de l'émail, pas d'éclat",
    dimensions: "H. 5,5 cm — Ø 7 cm (les deux)",
    matiere: "Faïence fine",
    img: { forme: "tasse", teinte: "creme", motif: "floral" },
  },
  {
    ref: "AT-112",
    nom: "Plat ovale Keller & Guérin, Lunéville",
    univers: "art-de-la-table",
    prix: 96,
    stock: 1,
    coupDeCoeur: true,
    accroche:
      "Le plat qui sauve les grandes tablées : assez large pour un rôti, assez beau pour rester sur la table jusqu'au dessert.",
    histoire:
      "Faïence de Lunéville, décor floral polychrome au centre et bord contourné souligné d'un filet vert. Marque en creux et cachet bleu « K&G Lunéville » sous la base. La manufacture Keller & Guérin a repris la faïencerie de Lunéville en 1788 et l'a portée à son apogée décorative au tournant du XXᵉ. Deux minuscules points d'usure sur le marli, visibles sur la dernière photo.",
    fabricant: "Keller & Guérin — Lunéville",
    epoque: "Vers 1900-1920",
    etat: "Bon état — légères usures d'usage sur le marli",
    dimensions: "L. 38 cm — l. 26 cm",
    matiere: "Faïence",
    img: { forme: "plat", teinte: "ivoire", motif: "floral" },
  },
  {
    ref: "AT-087",
    nom: "Six coquetiers vintage dépareillés",
    univers: "art-de-la-table",
    prix: 42,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Six coquetiers qui n'ont rien à voir les uns avec les autres : c'est exactement ce qui rend un petit-déjeuner joyeux.",
    histoire:
      "Lot de six coquetiers en faïence et porcelaine, chinés séparément puis réunis : deux à filet doré, un à liseré bleu, un uni jaune paille, deux à décor de fleurettes. Aucune fêlure, aucun éclat sur les six. Passent au lave-vaisselle sauf les deux dorés, à laver à la main.",
    fabricant: "Divers ateliers français",
    epoque: "1940-1970",
    etat: "Très bon état — aucun éclat",
    dimensions: "H. 4,5 à 6 cm selon les pièces",
    matiere: "Faïence et porcelaine",
    img: { forme: "coquetier", teinte: "pastel", motif: "filet" },
  },
  {
    ref: "AT-121",
    nom: "Saucière en porcelaine blanche à filet or",
    univers: "art-de-la-table",
    prix: 38,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Sortez-la pour une sauce, ou détournez-la en petit vase pour trois branches de lilas — elle est faite pour être vue.",
    histoire:
      "Porcelaine blanche de Limoges, forme à plateau attenant, anse relevée et double filet or au pinceau. L'or est légèrement estompé sur l'arête de l'anse, seule marque de son grand âge. Marque verte sous la base.",
    fabricant: "Porcelaine de Limoges",
    epoque: "Années 1930",
    etat: "Très bon état — or légèrement estompé sur l'anse",
    dimensions: "L. 21 cm — H. 9 cm",
    matiere: "Porcelaine",
    img: { forme: "sauciere", teinte: "blanc", motif: "filet" },
  },
  {
    ref: "AT-093",
    nom: "Beurrier cloche en faïence de Sarreguemines",
    univers: "art-de-la-table",
    prix: 54,
    stock: 0,
    coupDeCoeur: false,
    accroche:
      "Le beurre a droit à sa maison. Celle-ci a une cloche, un décor bleu et beaucoup plus d'allure qu'une plaquette dans son papier.",
    histoire:
      "Faïence de Sarreguemines, décor bleu au pochoir et frise de feuillage. Cloche complète avec sa prise, base à ressaut. Cachet imprimé sous la base. Une usure d'émail discrète à l'intérieur de la cloche, sans conséquence sur l'usage.",
    fabricant: "Sarreguemines",
    epoque: "Début XXᵉ siècle",
    etat: "Bon état — usure d'émail intérieure",
    dimensions: "H. 12 cm — Ø base 14 cm",
    matiere: "Faïence",
    img: { forme: "beurrier", teinte: "bleu", motif: "pochoir" },
  },
  {
    ref: "AT-130",
    nom: "Service à café en porcelaine, décor filet bleu",
    univers: "art-de-la-table",
    prix: 128,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Un service complet et intact, ça devient rare. Celui-ci attend un dimanche après-midi et une tarte encore tiède.",
    histoire:
      "Cafetière, sucrier, pot à lait et six tasses avec leurs sous-tasses. Porcelaine blanche à filet bleu de cobalt et liseré or. Aucune pièce manquante, aucun éclat, les six tasses sont d'origine et non remplacées. Marque bleue sous chaque pièce.",
    fabricant: "Porcelaine française, marque bleue",
    epoque: "Années 1950",
    etat: "Excellent état — service complet",
    dimensions: "Cafetière H. 23 cm — tasses Ø 7,5 cm",
    matiere: "Porcelaine",
    img: { forme: "cafetiere", teinte: "blanc", motif: "filet-bleu" },
  },
  {
    ref: "AT-141",
    nom: "Six assiettes plates en faïence à décor de blé",
    univers: "art-de-la-table",
    prix: 66,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Le décor d'épis de blé donne à n'importe quel plat du quotidien un petit air de repas de campagne.",
    histoire:
      "Six assiettes plates en faïence, décor imprimé d'épis de blé sur le marli et filet brun sur le bord. Deux assiettes présentent une usure de couteau au centre, ce qui prouve simplement qu'elles ont servi. Aucune fêlure, aucun éclat.",
    fabricant: "Faïencerie du Nord, cachet illisible",
    epoque: "Années 1930-1950",
    etat: "Bon état — usures de couteau sur deux pièces",
    dimensions: "Ø 24 cm",
    matiere: "Faïence",
    img: { forme: "assiette", teinte: "ivoire", motif: "ble" },
  },

  /* ---------------- LE VERRE ---------------- */
  {
    ref: "VE-058",
    nom: "Six verres à pied en cristal taillé",
    univers: "le-verre",
    prix: 88,
    stock: 1,
    coupDeCoeur: true,
    accroche:
      "Posez-les près d'une fenêtre : ils jettent des éclats sur toute la nappe. C'est le genre de détail qui transforme un dîner ordinaire.",
    histoire:
      "Cristal taillé à côtes plates et bandeau de pointes de diamant, jambe balustre. Belle sonorité au tintement, signe de la teneur en plomb. Les six sont d'un même service, sans dépareillage. Aucun éclat au buvant, à laver à la main.",
    fabricant: "Cristallerie française non signée",
    epoque: "Années 1930-1950",
    etat: "Très bon état — aucun éclat au buvant",
    dimensions: "H. 14 cm — contenance ≈ 15 cl",
    matiere: "Cristal",
    img: { forme: "verre", teinte: "cristal", motif: "taille" },
  },
  {
    ref: "VE-071",
    nom: "Carafe à liqueur et son bouchon d'origine",
    univers: "le-verre",
    prix: 62,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Une carafe de fin de repas, à remplir de prune ou de sirop de sureau selon l'heure et la compagnie.",
    histoire:
      "Verre soufflé légèrement irrégulier, panse aplatie et col annelé. Bouchon d'origine rodé à la carafe — il ne va sur aucune autre, c'est ce qui fait sa valeur. Quelques bulles dans la masse, caractéristiques du soufflage à la main.",
    fabricant: "Verrerie artisanale",
    epoque: "Fin XIXᵉ siècle",
    etat: "Très bon état — bouchon d'origine rodé",
    dimensions: "H. 24 cm avec bouchon",
    matiere: "Verre soufflé",
    img: { forme: "carafe", teinte: "cristal", motif: "lisse" },
  },
  {
    ref: "VE-064",
    nom: "Compotier sur pied en verre moulé",
    univers: "le-verre",
    prix: 46,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Trois poires, deux figues, et votre table a un centre. Le compotier sur pied fait le travail d'un bouquet, en plus gourmand.",
    histoire:
      "Verre moulé pressé à décor de godrons rayonnants, pied conique. Production française de grande diffusion mais d'un dessin très net, sans reprise ni bavure de moule. Un petit défaut de fonte sur le bord du pied, invisible une fois posé.",
    fabricant: "Verrerie française",
    epoque: "Années 1940",
    etat: "Bon état — défaut de fonte sous le pied",
    dimensions: "H. 13 cm — Ø 24 cm",
    matiere: "Verre moulé",
    img: { forme: "compotier", teinte: "cristal", motif: "godron" },
  },
  {
    ref: "VE-080",
    nom: "Vase soliflore en verre fumé",
    univers: "le-verre",
    prix: 34,
    stock: 0,
    coupDeCoeur: false,
    accroche:
      "Une seule fleur suffit. C'est tout le principe du soliflore, et c'est aussi le plus simple des luxes.",
    histoire:
      "Verre teinté dans la masse d'un gris fumé profond, col resserré et base épaisse. Aucune signature. Le fond porte une marque de pontil polie, indice d'un travail soufflé.",
    fabricant: "Non signé",
    epoque: "Années 1960-1970",
    etat: "Très bon état",
    dimensions: "H. 18 cm — Ø base 6 cm",
    matiere: "Verre teinté",
    img: { forme: "vase", teinte: "fume", motif: "lisse" },
  },
  {
    ref: "VE-089",
    nom: "Paire de coupelles en verre opalin",
    univers: "le-verre",
    prix: 29,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Pour les olives, les boutons de manchette ou les épingles à cheveux : deux petites coupelles qui trouvent leur place partout.",
    histoire:
      "Opaline blanc laiteux à reflets légèrement bleutés en transparence, bord ourlé au feu. Les opalines françaises du XIXᵉ se reconnaissent à ce reflet ambré lorsqu'on les tient devant une lampe. Les deux sont exemptes d'éclat.",
    fabricant: "Opaline française",
    epoque: "Seconde moitié du XIXᵉ",
    etat: "Très bon état — aucun éclat",
    dimensions: "Ø 11 cm — H. 3 cm",
    matiere: "Opaline",
    img: { forme: "coupelle", teinte: "opalin", motif: "lisse" },
  },

  /* ---------------- L'ARGENTERIE ---------------- */
  {
    ref: "AR-042",
    nom: "Douze ronds de serviette en métal argenté",
    univers: "l-argenterie",
    prix: 84,
    stock: 1,
    coupDeCoeur: true,
    accroche:
      "Douze ronds de serviette, douze convives, et l'impression très agréable d'avoir une maison où l'on reçoit.",
    histoire:
      "Métal argenté à décor de filets et rubans croisés, dans leur coffret d'origine gainé de papier bordeaux. Aucun monogramme gravé, ce qui les rend utilisables par tout le monde. Argenture homogène, quelques micro-rayures d'usage visibles à la lumière rasante.",
    fabricant: "Orfèvrerie française, poinçon d'orfèvre au losange",
    epoque: "Années 1920",
    etat: "Très bon état — coffret d'origine, argenture homogène",
    dimensions: "Ø 4,5 cm chacun",
    matiere: "Métal argenté",
    img: { forme: "rond-serviette", teinte: "argent", motif: "filet" },
  },
  {
    ref: "AR-055",
    nom: "Passe-thé à manche et son présentoir",
    univers: "l-argenterie",
    prix: 48,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Le thé en vrac mérite mieux qu'une boule en inox. Ce passe-thé et sa petite soucoupe font du service une petite cérémonie.",
    histoire:
      "Métal argenté, coupelle percée à motif rayonnant et manche à filets, livré avec son présentoir d'origine. Ensemble complet, ce qui est rare : le présentoir est presque toujours perdu. Poinçon partiellement lisible sous le manche.",
    fabricant: "Orfèvrerie non identifiée",
    epoque: "Début XXᵉ siècle",
    etat: "Très bon état — ensemble complet",
    dimensions: "L. 14 cm — présentoir Ø 8 cm",
    matiere: "Métal argenté",
    img: { forme: "passe-the", teinte: "argent", motif: "raie" },
  },
  {
    ref: "AR-061",
    nom: "Service à poisson à manches en ivoirine",
    univers: "l-argenterie",
    prix: 72,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Deux pièces qui font tout de suite « repas de fête », même quand il n'y a qu'une truite au menu.",
    histoire:
      "Pelle et fourchette de service, lames en métal argenté finement ciselées de rinceaux, manches en ivoirine (résine imitant l'ivoire, matériau courant dès les années 1920). Aucune fente sur les manches, ciselure nette. Dans un écrin postérieur.",
    fabricant: "Orfèvrerie française",
    epoque: "Années 1920-1930",
    etat: "Très bon état — manches sans fente",
    dimensions: "L. 30 cm et 27 cm",
    matiere: "Métal argenté et ivoirine",
    img: { forme: "couverts", teinte: "argent", motif: "cisele" },
  },
  {
    ref: "AR-070",
    nom: "Huit porte-couteaux en métal argenté",
    univers: "l-argenterie",
    prix: 56,
    stock: 0,
    coupDeCoeur: false,
    accroche:
      "Le détail qui fait la table dressée : huit petits chevalets pour poser les couteaux entre deux services.",
    histoire:
      "Modèle à barrette et sabots, métal argenté sur laiton. Huit exemplaires identiques du même service. Argenture bien conservée sur sept d'entre eux, un présente une usure au sommet laissant apparaître le laiton.",
    fabricant: "Non signé",
    epoque: "Années 1930",
    etat: "Bon état — une pièce avec usure d'argenture",
    dimensions: "L. 8 cm",
    matiere: "Métal argenté",
    img: { forme: "porte-couteau", teinte: "argent", motif: "lisse" },
  },
  {
    ref: "AR-078",
    nom: "Pelle à tarte à décor de vigne",
    univers: "l-argenterie",
    prix: 39,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Elle a probablement découpé quelques centaines de tartes aux mirabelles. Elle est prête pour les vôtres.",
    histoire:
      "Métal argenté, spatule ajourée à décor de pampres et grappes, manche à filet. La ciselure du décor de vigne est encore très lisible malgré l'usage. Poinçon d'orfèvre au dos de la spatule.",
    fabricant: "Orfèvrerie française, poinçon au losange",
    epoque: "Fin XIXᵉ siècle",
    etat: "Bon état d'usage — ciselure nette",
    dimensions: "L. 25 cm",
    matiere: "Métal argenté",
    img: { forme: "pelle", teinte: "argent", motif: "vigne" },
  },

  /* ---------------- LES TISSUS ---------------- */
  {
    ref: "TI-033",
    nom: "Trois torchons monogrammés « M.L. » en métis",
    univers: "les-tissus",
    prix: 45,
    stock: 1,
    coupDeCoeur: true,
    accroche:
      "Le linge ancien s'améliore en vieillissant : ces torchons sont plus doux aujourd'hui qu'au jour de leur broderie.",
    histoire:
      "Métis de lin et coton tissé serré, bande rouge tissée dans la lisière, monogramme « M.L. » brodé main au point de tige dans un angle. Lavés à 40°, repassés, prêts à l'emploi. Aucun accroc, aucune tache rémanente ; deux petites reprises anciennes témoignent d'un linge qu'on entretenait.",
    fabricant: "Trousseau de maison, broderie main",
    epoque: "Années 1920-1940",
    etat: "Très bon état — deux reprises anciennes",
    dimensions: "70 × 50 cm environ",
    matiere: "Métis lin et coton",
    img: { forme: "torchon", teinte: "lin", motif: "raie-rouge" },
  },
  {
    ref: "TI-041",
    nom: "Nappe damassée blanche à décor de roses",
    univers: "les-tissus",
    prix: 78,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Une vraie nappe damassée change la façon dont on s'assoit à table. Elle appelle les grandes occasions — ou le plaisir d'en inventer une.",
    histoire:
      "Damassé de coton blanc, décor de roses et de rinceaux visible en jeu de lumière selon l'angle. Ourlets d'origine à points glissés. Blancheur homogène, aucun jaunissement de pliure, aucune trace. Un accroc ancien de 1 cm réparé au fil de même couleur dans un angle, signalé sur les photos.",
    fabricant: "Tissage français",
    epoque: "Première moitié du XXᵉ",
    etat: "Bon état — une réparation ancienne dans un angle",
    dimensions: "230 × 150 cm",
    matiere: "Coton damassé",
    img: { forme: "nappe", teinte: "blanc", motif: "damasse" },
  },
  {
    ref: "TI-047",
    nom: "Lot de six mouchoirs brodés à la main",
    univers: "les-tissus",
    prix: 32,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "À offrir, à encadrer, ou à glisser dans une poche de veste : six petits carrés brodés qui ne ressemblent à rien d'industriel.",
    histoire:
      "Batiste de coton fin, jours échelle sur les bords et motifs floraux brodés au plumetis. Chaque mouchoir porte un motif différent. Deux d'entre eux comportent un monogramme discret. Lavés, repassés, sans tache ni trou.",
    fabricant: "Broderie main, ouvrage de trousseau",
    epoque: "Années 1930-1950",
    etat: "Très bon état",
    dimensions: "28 × 28 cm environ",
    matiere: "Batiste de coton",
    img: { forme: "mouchoir", teinte: "blanc", motif: "plumetis" },
  },
  {
    ref: "TI-052",
    nom: "Rideau brodé au filet, travail à la main",
    univers: "les-tissus",
    prix: 68,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Tendu sur une fenêtre de cuisine, il filtre la lumière du matin sans l'éteindre. C'est le meilleur usage qu'on puisse en faire.",
    histoire:
      "Filet de coton brodé main au point de reprise, décor géométrique de losanges et frise en bordure basse. Travail long, entièrement manuel, typique des ouvrages de veillée. Deux mailles rompues sur un bord latéral, réparables ou invisibles une fois le rideau posé.",
    fabricant: "Ouvrage domestique",
    epoque: "Début XXᵉ siècle",
    etat: "Bon état — deux mailles rompues sur un bord",
    dimensions: "160 × 90 cm",
    matiere: "Coton",
    img: { forme: "rideau", teinte: "ecru", motif: "filet-brode" },
  },
  {
    ref: "TI-059",
    nom: "Douze serviettes de table en lin épais",
    univers: "les-tissus",
    prix: 92,
    stock: 0,
    coupDeCoeur: false,
    accroche:
      "Douze serviettes de lin, c'est un investissement pour vingt ans de repas. Celles-ci en ont déjà tenu quarante.",
    histoire:
      "Lin lourd tissé main, bordures à ourlet rabattu, monogramme « B.R. » brodé au point de croix rouge. Le lin a acquis cette souplesse que seuls les lavages répétés donnent. Un léger halo sur une serviette, signalé, qui part au soleil.",
    fabricant: "Trousseau de maison",
    epoque: "Fin XIXᵉ siècle",
    etat: "Bon état — un halo léger sur une pièce",
    dimensions: "60 × 60 cm",
    matiere: "Lin",
    img: { forme: "serviette", teinte: "lin", motif: "croix-rouge" },
  },

  /* ---------------- LE PAPIER ---------------- */
  {
    ref: "PA-018",
    nom: "Gravure botanique aquarellée — Iris de jardin",
    univers: "le-papier",
    prix: 58,
    stock: 1,
    coupDeCoeur: true,
    accroche:
      "Encadrez-la au-dessus d'un bureau : une planche botanique impose immédiatement un calme de cabinet de curiosités.",
    histoire:
      "Gravure sur cuivre rehaussée à l'aquarelle à la main, légendée en latin sous le sujet et numérotée en haut à droite. Planche issue d'une flore illustrée démembrée. Papier vergé, marges d'origine conservées. Quelques rousseurs claires en marge, sans atteinte au sujet. Vendue sans cadre.",
    fabricant: "Planche de flore illustrée, atelier non identifié",
    epoque: "Milieu XIXᵉ siècle",
    etat: "Bon état — rousseurs claires en marge",
    dimensions: "34 × 24 cm (feuille)",
    matiere: "Papier vergé, aquarelle",
    img: { forme: "gravure", teinte: "papier", motif: "botanique" },
  },
  {
    ref: "PA-025",
    nom: "Lot de vingt cartes postales écrites, 1900-1930",
    univers: "le-papier",
    prix: 26,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Vingt écritures différentes, vingt petites nouvelles du monde d'avant. À lire, à encadrer en série, ou à glisser dans des livres.",
    histoire:
      "Cartes photographiques et lithographiées, vues de villages, de gares et de fêtes de village. Toutes sont écrites au recto ou au verso, la plupart timbrées et oblitérées, ce qui permet de les dater précisément. État variable selon les pièces, décrit et photographié lot par lot : quelques coins émoussés, aucune déchirure.",
    fabricant: "Éditeurs divers",
    epoque: "1900-1930",
    etat: "État variable — coins émoussés sur quelques pièces",
    dimensions: "14 × 9 cm chacune",
    matiere: "Papier",
    img: { forme: "cartes", teinte: "papier", motif: "ecriture" },
  },
  {
    ref: "PA-031",
    nom: "Recueil relié plein cuir, fables et poésies",
    univers: "le-papier",
    prix: 64,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Un livre qu'on ouvre pour l'odeur autant que pour le texte, et qu'on laisse ensuite bien en vue sur une pile.",
    histoire:
      "Reliure plein cuir fauve, dos à cinq nerfs orné de fleurons dorés, tranches jaspées. Intérieur frais, papier légèrement bruni mais sans manque ni page détachée. Coiffes frottées et coins émoussés, comme presque toujours sur ces reliures d'usage. Sans date d'édition imprimée.",
    fabricant: "Reliure d'époque, atelier non identifié",
    epoque: "Seconde moitié du XIXᵉ",
    etat: "Bon état — coiffes frottées, coins émoussés",
    dimensions: "18 × 12 cm — 320 pages environ",
    matiere: "Cuir et papier",
    img: { forme: "livre", teinte: "cuir", motif: "nerfs" },
  },
  {
    ref: "PA-036",
    nom: "Planche de chromos découpés — fleurs et oiseaux",
    univers: "le-papier",
    prix: 22,
    stock: 0,
    coupDeCoeur: false,
    accroche:
      "Les chromos étaient les images qu'on collectionnait enfant. Elles font aujourd'hui de merveilleux marque-pages ou décorations de paquets.",
    histoire:
      "Chromolithographies gaufrées et découpées, couleurs vives à dominante rose et bleue, encore reliées par les ponts de découpe d'origine. Ce détail compte : la plupart des chromos ont été séparés et collés dans des albums. Planche complète, sans manque.",
    fabricant: "Chromolithographie allemande ou française",
    epoque: "Vers 1900",
    etat: "Très bon état — planche complète",
    dimensions: "23 × 15 cm",
    matiere: "Papier chromolithographié",
    img: { forme: "chromo", teinte: "papier", motif: "chromo" },
  },

  /* ---------------- LA DÉCORATION ---------------- */
  {
    ref: "DE-012",
    nom: "Petite huile sur toile — paysage de bord de rivière",
    univers: "la-decoration",
    prix: 145,
    stock: 1,
    coupDeCoeur: true,
    accroche:
      "Un petit format qui réchauffe un mur nu mieux qu'un grand tableau : on s'en approche, et on y reste un moment.",
    histoire:
      "Huile sur toile marouflée sur carton, paysage de rivière bordée de peupliers dans une palette de verts sourds et d'ocres. Signature en bas à droite peu lisible. Cadre en bois mouluré patiné d'origine, avec quelques manques au stuc sur un angle. Toile propre, sans crevé ni repeint visible sous lumière rasante.",
    fabricant: "Peintre non identifié, signature illisible",
    epoque: "Première moitié du XXᵉ",
    etat: "Bon état — manques au stuc du cadre",
    dimensions: "Cadre 38 × 30 cm — toile 27 × 19 cm",
    matiere: "Huile sur toile, cadre bois",
    img: { forme: "tableau", teinte: "paysage", motif: "huile" },
  },
  {
    ref: "DE-019",
    nom: "Miroir de sorcière à cadre doré",
    univers: "la-decoration",
    prix: 98,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Le miroir convexe attrape toute la pièce d'un coup. Accroché face à une fenêtre, il rend la lumière deux fois.",
    histoire:
      "Miroir convexe dit « de sorcière », glace bombée dans un cadre circulaire en bois et stuc doré à décor de perles. La dorure a pris cette teinte cuivrée qu'on ne peut pas reproduire. Tain piqué par endroits, ce qui est habituel et participe du charme. Système d'accroche au dos en bon état.",
    fabricant: "Travail français",
    epoque: "Début XXᵉ siècle",
    etat: "Bon état — tain piqué, dorure patinée",
    dimensions: "Ø 32 cm",
    matiere: "Bois, stuc doré, verre",
    img: { forme: "miroir", teinte: "dore", motif: "perle" },
  },
  {
    ref: "DE-027",
    nom: "Boîte en marqueterie à couvercle étoilé",
    univers: "la-decoration",
    prix: 76,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Pour ranger les lettres, les clés d'anciennes maisons, ou rien du tout — certaines boîtes se suffisent à elles-mêmes.",
    histoire:
      "Marqueterie de bois clairs et foncés formant une étoile à huit branches sur le couvercle, filets d'encadrement sur les côtés. Intérieur garni de feutrine verte d'origine, un peu usée. Charnières laiton en bon fonctionnement, fermeture nette. Un petit soulèvement de placage sur un angle, stable.",
    fabricant: "Ébénisterie non signée",
    epoque: "Fin XIXᵉ siècle",
    etat: "Bon état — soulèvement de placage sur un angle",
    dimensions: "L. 22 cm — l. 15 cm — H. 8 cm",
    matiere: "Bois de placage, laiton",
    img: { forme: "boite", teinte: "bois", motif: "etoile" },
  },
  {
    ref: "DE-034",
    nom: "Pied de lampe en céramique émaillée verte",
    univers: "la-decoration",
    prix: 82,
    stock: 1,
    coupDeCoeur: false,
    accroche:
      "Un vert profond de mousse, une forme pleine et ronde : posez un abat-jour écru dessus et c'est toute la pièce qui s'adoucit.",
    histoire:
      "Grès émaillé vert à coulures, forme balustre, base plate. Émail épais avec les variations de bain typiques d'une cuisson en atelier. Électrification refaite à neuf (cordon textile, douille E27 aux normes), vendu sans abat-jour. Signature incisée sous la base, illisible.",
    fabricant: "Atelier de céramique, signature incisée",
    epoque: "Années 1950-1960",
    etat: "Très bon état — électrification refaite à neuf",
    dimensions: "H. 30 cm sans abat-jour — Ø base 14 cm",
    matiere: "Grès émaillé",
    img: { forme: "lampe", teinte: "vert", motif: "coulure" },
  },
  {
    ref: "DE-040",
    nom: "Paire de cadres photo en laiton ciselé",
    univers: "la-decoration",
    prix: 44,
    stock: 0,
    coupDeCoeur: false,
    accroche:
      "Deux cadres qui donnent instantanément un air d'héritage à une photo prise la semaine dernière.",
    histoire:
      "Laiton ciselé à décor de rinceaux, chevalet articulé au dos, verre d'origine sur les deux. Le laiton a une patine chaude non polie, que je n'ai volontairement pas décapée. Un chevalet légèrement souple mais fonctionnel.",
    fabricant: "Travail français",
    epoque: "Années 1920",
    etat: "Bon état — un chevalet légèrement souple",
    dimensions: "16 × 11 cm (vue 12 × 8 cm)",
    matiere: "Laiton et verre",
    img: { forme: "cadre", teinte: "laiton", motif: "rinceau" },
  },
];

/* Les avis clients ---------------------------------------------------
   refProduit : null → avis général affiché en page d'accueil          */

const AVIS = [
  {
    prenom: "Claire",
    ville: "Nantes",
    note: 5,
    date: "12 juin 2026",
    refProduit: "AT-104",
    texte:
      "Les tasses sont encore plus jolies en vrai que sur les photos, et l'emballage était impeccable — trois couches de papier de soie et du carton partout. Elles ont servi dès le dimanche suivant.",
  },
  {
    prenom: "Bertrand",
    ville: "Lyon",
    note: 5,
    date: "3 juin 2026",
    refProduit: "AT-112",
    texte:
      "J'avais posé deux questions sur les usures du marli avant d'acheter, j'ai eu une réponse détaillée avec des photos supplémentaires le jour même. Le plat correspond exactement à la description.",
  },
  {
    prenom: "Émilie",
    ville: "Bordeaux",
    note: 5,
    date: "28 mai 2026",
    refProduit: "VE-058",
    texte:
      "Six verres en cristal expédiés sans une égratignure, chacun emballé individuellement. La description mentionnait honnêtement les micro-rayures, je les cherche encore.",
  },
  {
    prenom: "Marc",
    ville: "Strasbourg",
    note: 4,
    date: "21 mai 2026",
    refProduit: "AR-042",
    texte:
      "Très beau lot, coffret d'origine en meilleur état que je ne l'espérais. Un point en moins seulement parce que j'aurais aimé une photo du dos du coffret sur la fiche.",
  },
  {
    prenom: "Sophie",
    ville: "Rennes",
    note: 5,
    date: "14 mai 2026",
    refProduit: "TI-033",
    texte:
      "Le linge est lavé et repassé à réception, c'est un vrai confort. Les torchons sont doux et le monogramme est superbe. Je reviendrai pour la nappe.",
  },
  {
    prenom: "Jean-Pierre",
    ville: "Toulouse",
    note: 5,
    date: "2 mai 2026",
    refProduit: "PA-018",
    texte:
      "Gravure conforme, expédiée à plat entre deux plaques de carton rigide dans une pochette renforcée. Les rousseurs annoncées sont bien là et bien discrètes, comme promis.",
  },
  {
    prenom: "Anne-Laure",
    ville: "Lille",
    note: 5,
    date: "24 avril 2026",
    refProduit: "DE-012",
    texte:
      "Le petit tableau est arrivé en deux jours, calé dans une caisse en carton double cannelure. J'apprécie qu'on m'ait prévenue du manque de stuc avant l'achat plutôt que de le découvrir en ouvrant.",
  },
  {
    prenom: "Camille",
    ville: "Aix-en-Provence",
    note: 5,
    date: "18 avril 2026",
    refProduit: "AT-130",
    texte:
      "Service complet et vraiment intact, ce qui est rare. J'ai posé une question un dimanche soir, réponse le lundi matin. Rien à redire.",
  },
  {
    prenom: "Hélène",
    ville: "Angers",
    note: 5,
    date: "9 avril 2026",
    refProduit: "VE-071",
    texte:
      "La carafe a un bouchon parfaitement rodé, ce qui n'était pas gagné. Belle surprise, et les bulles dans le verre lui donnent tout son cachet.",
  },
  {
    prenom: "Thierry",
    ville: "Dijon",
    note: 4,
    date: "30 mars 2026",
    refProduit: "AR-061",
    texte:
      "Service à poisson très propre, ciselure nette. L'écrin n'est pas d'origine, c'était bien précisé dans la fiche. Livraison un peu longue mais rien d'anormal.",
  },
  {
    prenom: "Nathalie",
    ville: "Caen",
    note: 5,
    date: "22 mars 2026",
    refProduit: "TI-041",
    texte:
      "La nappe est magnifique et la réparation ancienne est réellement invisible. On sent que chaque pièce est vérifiée avant de partir.",
  },
  {
    prenom: "Olivier",
    ville: "Clermont-Ferrand",
    note: 5,
    date: "11 mars 2026",
    refProduit: "AT-087",
    texte:
      "Les six coquetiers dépareillés sont une excellente idée. Mes enfants choisissent le leur chaque matin. Emballage soigné, aucun éclat.",
  },
];

/* ------------------------------------------------------------------ */
/* Petits utilitaires de données                                       */
/* ------------------------------------------------------------------ */

function universParSlug(slug) {
  return UNIVERS.find((u) => u.slug === slug) || null;
}

function produitParRef(ref) {
  return PRODUITS.find((p) => p.ref === ref) || null;
}

function produitsDeLUnivers(slug, options) {
  const opts = options || {};
  let liste = PRODUITS.filter((p) => p.univers === slug);
  if (opts.disponiblesSeulement) liste = liste.filter((p) => p.stock > 0);
  return liste;
}

/* Avis d'un produit + moyenne */
function avisDuProduit(ref) {
  return AVIS.filter((a) => a.refProduit === ref);
}

function noteMoyenne(ref) {
  const liste = avisDuProduit(ref);
  if (!liste.length) return null;
  const somme = liste.reduce((t, a) => t + a.note, 0);
  return Math.round((somme / liste.length) * 10) / 10;
}

function noteMoyenneBoutique() {
  const somme = AVIS.reduce((t, a) => t + a.note, 0);
  return Math.round((somme / AVIS.length) * 10) / 10;
}

/* Règle métier : un produit épuisé n'est jamais mis en avant. */
function coupsDeCoeur() {
  return PRODUITS.filter((p) => p.coupDeCoeur && p.stock > 0);
}

function misEnAvantPourUnivers(slug, nombre) {
  const dispo = produitsDeLUnivers(slug, { disponiblesSeulement: true });
  return nombre ? dispo.slice(0, nombre) : dispo;
}
