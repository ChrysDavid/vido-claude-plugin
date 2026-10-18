---
name: web
description: Conventions front web du propriétaire (Vue 3 + Vite, Next.js, Angular, jeux Three.js/Phaser). À charger pour toute tâche de front web ou de jeu web.
---
# web

Projet existant : suivre le style en place. Version de framework récente (Next, Angular) : lire la doc locale (`node_modules/<pkg>/dist/docs` ou le changelog) avant de toucher au routing ou à la config.

## Commun
- Couleurs et polices en variables CSS (tokens), jamais de couleur de marque en dur ; thème clair/sombre via ces tokens.
- Appels backend via un client unique typé (et le proxy du projet s'il existe), jamais d'appel direct depuis un composant ; clés serveur jamais exposées côté client (`NEXT_PUBLIC_`, `VITE_`).
- Responsive obligatoire ; cibles tactiles de 44-48 px minimum ; jamais d'information accessible seulement au survol (`@media (hover: hover)`) ; `touch-action: manipulation` sur les éléments tactiles.
- Écran tactile en boutique ou caisse : aucun défilement de page ; si une liste est vraiment longue, seule cette zone défile, les actions principales restent fixes.
- Vérif : `npm run lint`, `npm run build` (+ `npm test` s'il existe), puis contrôle visuel par capture.

## Vue 3
- Composition API ; Vue = UI uniquement. Moteurs (Three.js, Phaser) en TypeScript pur hors réactivité (`markRaw`), état poussé vers le store à environ 10 Hz, jamais à chaque image.

## Angular
- Composants standalone, design tokens dans `styles.css`. `cdr.detectChanges()` dans les `finally` async et les méthodes qui changent l'affichage.

## Jeux Three.js / Phaser (fluides sur toute machine)
- Profils de qualité low/medium/ultra détectés au démarrage (mobile, GPU intégré ou dédié, cœurs, RAM), jamais ultra en automatique ; choix manuel du joueur sauvegardé.
- Pixel ratio plafonné (1 en low/medium, 1,5 en ultra) ; résolution adaptative selon les fps (baisser sous 40, remonter au-dessus de 58, attendre 3 s entre deux changements).
- Pause quand l'onglet est caché, pas de temps plafonné (dt ≤ 0,1 s).
- Meshes statiques fusionnés par zone, objets lointains masqués, InstancedMesh pour les objets répétés, modèles simplifiés, textures WebP compressées (Draco/Meshopt).
- Post-traitement et ombres selon le profil ; lumières dynamiques plafonnées ; ressources lourdes chargées à la demande.
- Mesurer fps et draw calls avant/après ; dire si le test sur vrai mobile n'a pas été fait. Règles UX des jeux : skill vido:qualite.
- Tests Playwright : `--mute-audio`, son du jeu et synthèse vocale coupés.
