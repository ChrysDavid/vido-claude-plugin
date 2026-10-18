---
name: verification
description: Commandes de vérification par stack (Django, NestJS, Flutter, Vue, Angular, Next). À lancer une seule fois à la fin de toute tâche qui modifie du code.
---
# verification

Une seule vérif, à la fin, refaite jusqu'à ce que ça passe. Sortie filtrée sur error/FAIL/warning, jamais en entier.

- **Django** (toujours Docker) : `docker compose exec web python manage.py check`, tests ciblés `docker compose exec web python manage.py test apps.<nom>` (ou pytest ciblé dans le conteneur), puis `docker compose up -d --force-recreate web`.
- **NestJS** : `npm run types` ou `npx tsc --noEmit`, `npm run lint`, `npx jest src/<module>`. Ne jamais lancer ni recréer le conteneur applicatif.
- **Flutter** : `flutter analyze` (zéro warning), `flutter test test/<feature>`.
- **Vue / Next** : `npm run lint`, `npm run build`.
- **Angular** : `npm run lint` si présent, `npx ng build`.
- **Prisma** : migration seulement via `npx prisma migrate dev --name <nom>`, jamais de SQL ou dossier manuel ; jamais éditer une migration appliquée.

Toujours finir par dire si la fonctionnalité a été testée en vrai ou seulement compilée, et donner la commande pour la tester.
