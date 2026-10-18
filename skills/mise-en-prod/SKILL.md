---
name: mise-en-prod
description: Liste de vérification avant mise en production d'un backend et publication d'une app sur Play Store / App Store. À lancer avec /vido:mise-en-prod avant tout déploiement ou soumission store.
---
# mise-en-prod

Passer chaque point, corriger ce qui manque, puis donner en 1 à 2 phrases ce qui est prêt et ce que seul le propriétaire peut faire. Comptes Apple Developer et Google Play : déjà possédés, ne jamais redemander. Builds CI payants (macOS) : annoncer le coût avant de lancer, et seulement la plateforme demandée.

## Backend
- Django : `check --deploy` propre, DEBUG=False, HTTPS forcé, HSTS, cookies sécurisés, CORS et ALLOWED_HOSTS restreints, ASGI si temps réel. NestJS : variables validées, CORS restreint, helmet, throttling.
- Aucun secret dans le code ni l'historique git ; secrets dans les secrets GitHub/CI ou du serveur.
- Migrations appliquées sans erreur sur une copie de la base ; sauvegarde de la base prévue.
- Limites de requêtes, verrous anti-double action, uploads validés, médias privés derrière l'authentification.
- Logs sans donnée personnelle, monitoring des erreurs branché.
- Vraie suppression de compte côté backend (pas seulement un drapeau).

## App mobile
- Signature release : clé d'upload locale, key.properties hors git ; appbundle et IPA qui buildent.
- Build obfusqué, aucune URL de dev, environnement prod choisi par `--dart-define`.
- Permissions minimales ; textes de permission iOS en français et justifiés.
- Icône, nom et écran de démarrage définitifs (flutter_launcher_icons, flutter_native_splash).
- Pages Confidentialité, CGU et Suppression de compte accessibles depuis l'app et en ligne.
- Classification d'âge correcte (18+ pour une app de rencontre).
- Captures d'écran réelles (vrai simulateur ou émulateur), jamais truquées.
- Fiche store : titre, description courte et longue, mots-clés, catégorie, contact.

## Tests finaux
- Parcours complet en conditions réelles sur la version release (inscription, fonctions principales, paiement si présent, déconnexion, suppression de compte).
- Mode avion / réseau lent : messages d'erreur propres, pas de crash.
- Écrire le résultat dans `docs/STORE_RELEASE.md` (ou `docs/DEPLOIEMENT.md`) et dans `.projetmemory/state.md`.
