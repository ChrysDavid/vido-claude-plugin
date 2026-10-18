---
name: qualite
description: Exigences du propriétaire pour construire ou améliorer un projet (produit, design, mobile, tests réels, sécurité, jeux). À charger pour toute création, amélioration, refonte, correction d'interface ou campagne de tests.
---
# qualite

## Produit
- L'objectif et la logique produit ne changent jamais ; design, parcours et détails peuvent être améliorés librement si ça rend le projet plus intéressant.
- MVP : bien fait mais minimaliste. Un écran = une action principale claire, rien qui prend de la place pour rien.
- Donner envie de revenir : progression visible, célébrations sobres, états vides qui guident. Jamais de culpabilisation ni de spam de notifications.
- Tout doit être explicite pour quelqu'un qui découvre l'app pour la première fois : se demander « est-ce que je saurais quoi faire ici ? ».
- La progression de l'utilisateur ne doit jamais repartir de zéro (sauvegarde, reprise après coupure ou rafraîchissement).

## Interface
- Charger les skills de design : antislop + antislop-ui, antislop-layoutmobile, antislop-human, ui-ux-pro-max ou frontend-design.
- Responsive obligatoire, du téléphone au bureau. Aucun texte coupé, caché ou superposé ; pas de défilement inutile (pages de résultat en un écran).
- Animations premium mais sobres (transitions, micro-interactions, squelettes de chargement), respect du réglage « animations réduites ».
- États vide, chargement et erreur toujours prévus. Une erreur affiche une page propre à l'app, jamais une redirection vers un autre site.
- Fluide sur téléphone bas de gamme : animations par canvas (Phaser/Three) ou CSS, jamais par le framework à chaque image ; qualité graphique adaptative.
- Vérifier soi-même par capture d'écran avant de livrer une interface.

## Tests en conditions réelles
- Backend lancé selon la règle du stack (Django via Docker ; NestJS lancé par le propriétaire), app sur l'émulateur déjà actif ou dans le navigateur.
- Parcours complet de bout en bout avec des comptes de test fictifs (supprimés à la fin) : inscription, connexion, fonctions principales, paramètres, déconnexion.
- Boucle : tester → noter chaque bug ou anomalie → corriger la vraie cause → retester, jusqu'à ce que tout soit vert.
- Tester comme un utilisateur qui découvre le produit, et noter tout ce qui n'est pas clair.
- Dire clairement ce qui n'a pas pu être testé en vrai.

## Sécurité
- Aucun secret en dur ; secrets dans .env (non versionné) et dans les secrets GitHub/CI.
- Limites de requêtes, protection contre les doubles actions simultanées, fichiers envoyés validés (type, taille, métadonnées retirées), médias privés derrière l'authentification.
- Réglages de production durcis (Django : check --deploy propre).

## Recherche et ressources
- Libre de chercher sur internet, GitHub ou Anthropic et de télécharger composants, modèles 3D ou assets, seulement sous licence libre (CC0, MIT…), avec un fichier CREDITS.

## Jeux (mobile, WebView)
- Joystick en bas à droite, visible au repos ; aucune touche clavier mentionnée à l'écran.
- Un seul objectif à la fois, bandeau compact en haut ; seule la cible est mise en avant, avec une flèche si elle est hors champ.
- Bouton tactile de 56 px minimum près de la cible ; l'action part seulement quand on tape dessus.
- Le joueur garde toujours le contrôle : jamais de déplacement ni d'action automatique.
- Histoire compréhensible en jouant (intro courte, objectifs qui disent pourquoi, aide « ? »).
- Personnages simples et non musclés.
- Respecter les vraies règles du jeu (les chercher en ligne). En multijoueur, la partie continue quand un joueur a gagné.
