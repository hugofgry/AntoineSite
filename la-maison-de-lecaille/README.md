# La Maison de l'Écaille — site vitrine

Site statique en HTML/CSS/JS, sans base de données ni back-office : léger, rapide, et modifiable directement dans les fichiers avec un éditeur de texte simple (Bloc-notes, VS Code, etc.).

## Structure des fichiers

```
index.html        → Accueil
carte.html         → La carte (huîtres, fruits de mer, plateaux, boissons)
histoire.html      → Notre histoire + équipe
galerie.html       → Galerie photos
contact.html       → Infos pratiques, carte Google Maps, formulaire
css/style.css       → Toutes les couleurs, polices, mises en page
js/main.js          → Menu mobile, effets au défilement, carrousel, formulaire, statistiques
```

## Ce que vous pouvez modifier vous-même

### La carte (menu et tarifs)
Ouvrez `carte.html`. Chaque plat est un bloc :
```html
<li class="menu-item">
  <span><span class="menu-item-name">Fine de claire n°3</span><span class="menu-item-desc">Bassin d'Arcachon</span></span>
  <span class="menu-item-price">15 €</span>
</li>
```
- Changer un prix ou un nom : modifiez le texte entre les balises.
- Ajouter un produit : copiez un bloc `<li class="menu-item">…</li>` entier, collez-le juste après, puis changez son contenu.
- Supprimer un produit : supprimez le bloc en entier.

### Les horaires et l'adresse
Ils apparaissent à trois endroits : `index.html` (section infos pratiques et pied de page), `contact.html` et le pied de page de chaque page. Cherchez le texte des horaires (ex. « Mardi – Samedi ») et remplacez-le partout où il apparaît.

### Les photos
Chaque photo est actuellement un rectangle bleu/vert temporaire (« Photo à venir »), qui indique clairement où placer vos vraies photos :
```html
<div class="ph" style="--ar:4/3;"><span class="ph-label">Huîtres</span></div>
```
Pour remplacer par une vraie photo, remplacez ce bloc par :
```html
<img src="images/nom-du-fichier.jpg" alt="Description de la photo">
```
Placez vos fichiers dans un dossier `images/` à créer à la racine du site. Conseil : des photos d'au moins 1200 px de large, au format `.jpg` compressé (~200–400 Ko chacune) pour un chargement rapide.

### Le logo
Vous avez déjà un logo : remplacez le texte « La Maison de l'Écaille » dans le bloc `.logo` (en haut de chaque page) par une image, par exemple :
```html
<a class="logo" href="index.html"><img src="images/logo.svg" alt="La Maison de l'Écaille" style="height:40px;"></a>
```

## Formulaire de contact

Le formulaire (`contact.html`) est prêt mais doit être connecté à un service d'envoi, car un site statique ne peut pas envoyer d'e-mails par lui-même. Solution la plus simple, gratuite jusqu'à 50 messages/mois :

1. Créez un compte sur [formspree.io](https://formspree.io)
2. Créez un formulaire, vous obtenez une adresse du type `https://formspree.io/f/abcd1234`
3. Dans `contact.html`, remplacez :
   ```html
   <form id="contact-form" class="form-grid" action="https://formspree.io/f/VOTRE_ID" method="POST">
   ```
   par votre propre adresse.

Tant que ce n'est pas fait, le formulaire affiche un message clair au lieu d'échouer silencieusement.

## Statistiques (visiteurs, pages vues, clics)

Le site est déjà équipé pour suivre : le nombre de visiteurs, les pages les plus consultées, et les clics sur le téléphone, l'Instagram, l'itinéraire et l'envoi du formulaire (attribut `data-track` déjà posé sur ces éléments). Il ne manque qu'un outil de mesure — deux options :

**Option simple et gratuite : Google Analytics 4**
1. Créez une propriété sur [analytics.google.com](https://analytics.google.com), récupérez votre identifiant `G-XXXXXXX`.
2. Collez ce code juste avant `</head>` sur les 5 pages :
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXX');
   </script>
   ```
3. Les clics suivis remonteront automatiquement dans Analytics sous les noms `clic_telephone`, `clic_instagram`, `clic_itineraire`, `envoi_formulaire`.

**Option respectueuse de la vie privée (sans bandeau cookies) : Plausible**
Payant (~9€/mois), mais plus simple à lire et conforme RGPD sans configuration. Suivez leur script d'installation sur [plausible.io](https://plausible.io) — il suffit de coller leur balise `<script>` dans `<head>`, le suivi des clics fonctionne alors automatiquement grâce à `js/main.js`.

## Hébergement

Le site est 100 % statique : il peut être déposé tel quel sur n'importe quel hébergement (Netlify, Vercel, OVH, o2switch…) ou sur un nom de domaine dédié. Aucune base de données ni serveur applicatif n'est nécessaire.

## Aller plus loin

Si la mise à jour de la carte ou des photos devient fréquente et que l'édition de fichiers HTML est contraignante, il est possible d'ajouter par la suite une interface d'administration simple (ex. Netlify CMS) pour éditer ces contenus depuis un formulaire web, sans toucher au code.
