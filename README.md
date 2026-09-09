# La Maison de l'Écaille — site vitrine (v2, Toulouse)

Site statique en HTML/CSS/JS, sans base de données ni back-office. Cette version remplace entièrement la précédente version (qui indiquait Bordeaux) : nouvelle structure, nouveau contenu, votre logo, et un petit chatbot de FAQ ("Coquillette").

## Structure des fichiers

```
index.html        → Accueil
concept.html       → Notre concept (histoire, valeurs)
carte.html         → Notre carte (huîtres, entrées, chaud, boissons — avec filtres)
plateaux.html      → Nos plateaux de fruits de mer
provenance.html    → Provenance & qualité de nos produits
emporter.html      → Commandes à emporter
evenements.html    → Événements & prestations
galerie.html       → Galerie photos
contact.html       → Horaires, adresse, carte Google Maps, formulaire
css/style.css       → Toutes les couleurs, polices, mises en page
js/main.js          → Menu mobile, effets au défilement, carrousel, filtres carte, formulaire
js/chatbot.js       → Le chatbot "Coquillette" (FAQ pré-écrite)
images/             → Vos photos + le logo
```

## Nouveautés de cette version

- **Ville corrigée** : Toulouse (Marché des Carmes, Place des Carmes, 31000 Toulouse) partout sur le site.
- **Votre logo** intégré dans la navigation et le pied de page (`images/logo.png`, fond détouré).
- **Nouvelle structure** en 9 pages, reprenant toutes les rubriques de votre brief.
- **Nouvelle carte** complète (entrées froides, chaud, plateaux, boissons) avec des filtres cliquables.
- **4 plateaux** détaillés sur leur propre page (Petit, Grand, Prestige, Dégustation).
- **Page Provenance & qualité** avec les étapes "de la mer à votre table".
- **Page Commandes à emporter**.
- **Page Événements & prestations**, qui utilise vos 3 photos de stand/marché.
- **Accents "manuscrits"** (police Caveat) pour les slogans, en plus de la police élégante et du texte courant — comme demandé dans le brief.
- **Petites illustrations dessinées** (huître, moule, bouteille, algue) en SVG, 100% originales.
- **Barre de commande fixe en bas de l'écran sur mobile** ("Commander un plateau" / "Appeler"), pour faciliter la conversion.
- **Chatbot "Coquillette"** en bas à droite : répond aux questions fréquentes (horaires, adresse, carte, plateaux, à emporter, événements, contact, Instagram) sans IA ni coût.

## Vos photos actuellement utilisées

- `huitres-plateau-1.jpg`, `comptoir-large.jpg`, `huitres-vue-dessus-1.jpg`, `huitres-vue-dessus-2.jpg`, `huitres-crevettes.jpg` → vos photos de plateaux (accueil, carte, plateaux, galerie).
- `evenement-marche-1.jpg`, `evenement-marche-2.jpg`, `evenement-marche-3.jpg` → vos photos de stand/événement (concept, plateaux, emporter, événements, galerie).

Il reste 2 emplacements "Photo à venir" dans `galerie.html` (comptoir permanent du marché des Carmes, terrasse) — à remplacer dès que vous avez ces photos, selon la méthode ci-dessous.

## Modifier le contenu vous-même

### La carte et les plateaux
Ouvrez `carte.html` ou `plateaux.html`. Chaque plat/plateau est un bloc clairement commenté (`<li class="menu-item">` ou `<div class="plateau-card">`). Copiez/collez un bloc pour ajouter, supprimez-le pour retirer, modifiez le texte pour changer un prix ou une description.

### Les photos
Remplacez le chemin dans `src="images/..."` par votre nouveau fichier, déposé dans le dossier `images/`. Pour un emplacement encore en attente (rectangle bleu/vert « Photo à venir »), remplacez le bloc `<div class="ph">...</div>` par :
```html
<div class="ph" style="overflow:hidden;"><img src="images/votre-photo.jpg" alt="Description"></div>
```

### Le logo
Le fichier `images/logo.png` est déjà détouré (fond transparent). Pour le changer, remplacez simplement ce fichier par une nouvelle version au même nom, idéalement aussi en PNG avec fond transparent.

### Horaires, adresse, téléphone
Ces informations apparaissent à plusieurs endroits (bandeau infos de chaque page + pied de page + chatbot). Le plus simple : faites une recherche globale du texte à changer (ex. « 05 61 00 00 00 ») dans tous les fichiers `.html` et `js/chatbot.js`, et remplacez-le partout.

### Le chatbot Coquillette
Ouvrez `js/chatbot.js` : la liste `FAQ` en haut du fichier contient les questions/réponses. Modifiable directement, sans toucher au reste du code.

## Formulaire de contact

Comme pour la version précédente, un site statique ne peut pas envoyer d'e-mails seul. Solution simple et gratuite :
1. Créez un compte sur [formspree.io](https://formspree.io)
2. Récupérez votre adresse (`https://formspree.io/f/abcd1234`)
3. Dans `contact.html`, remplacez `action="https://formspree.io/f/VOTRE_ID"` par votre adresse.

## Statistiques (visiteurs, clics)

Le suivi des clics (téléphone, Instagram, itinéraire, formulaire) est déjà posé via l'attribut `data-track`. Il suffit de brancher Google Analytics 4 ou Plausible :

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```
À coller avant `</head>` sur les 9 pages.

## Hébergement

Le site est 100 % statique : GitHub Pages, Netlify, ou tout hébergement classique conviennent. Voir vos échanges précédents pour la mise en ligne via GitHub Pages.
