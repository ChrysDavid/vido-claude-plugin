---
name: django
description: Conventions backend Django + DRF du propriétaire (BabiKiss, Kokowa, Vido Track). À charger pour toute tâche dans un backend Django.
---
# django

Projet existant : suivre d'abord le style dominant de l'app modifiée (ne pas imposer un autre style DRF). Nouveau projet : ces défauts.

## Exécution
- Toujours via Docker : `docker compose exec web python manage.py <cmd>`, jamais Python sur la machine. Après changement : `docker compose up -d --force-recreate web`.
- Docker/WebSocket : vérifier la commande effective du conteneur (runserver, daphne, uvicorn) avant de diagnostiquer.

## Structure
- `apps/<nom>/` : models, serializers, views, urls, permissions, admin, apps, `services.py` (logique métier, jamais dans les vues), `tests/` (ou `tests.py` si l'app l'a déjà).
- Settings scindés `settings/{base,dev,prod}.py` ; valeurs d'environnement via `.env` (decouple/environ), jamais en dur.
- PostgreSQL (+ PostGIS si géo) partout, jamais SQLite. Redis + worker (Celery) pour l'asynchrone ; Channels pour le temps réel.
- Utilisateur : toujours `settings.AUTH_USER_MODEL` / `get_user_model()`.

## API
- REST versionnée (`/api/v1/`), JWT simplejwt (rotation + blacklist).
- Vues `generics.*View` + `path()` explicites ; nommage `<Action><Ressource>View` ; `permission_classes` toujours explicite, même `AllowAny`.
- Un serializer par usage : `XxxList`, `XxxDetail`, `XxxCreate`, `XxxUpdate`, `XxxStatus`. Champs enrichis via `SerializerMethodField`.
- Clés exposées en UUID (`<uuid:pk>`), routes nommées en kebab-case.
- Appels externes (IA, paiement, push) dans un service dédié, mockés en test ; webhooks avec vérification de signature.
- Emails via templates, jamais de texte en dur.

## Sécurité et qualité
- Throttling, verrous contre les doubles actions (`select_for_update`), uploads validés (Pillow, ré-encodage, EXIF retiré), médias privés derrière une vue authentifiée.
- Prod : DEBUG=False, HTTPS forcé, CORS restreint, `check --deploy` propre.
- Fonctions courtes, pas de duplication, commentaires seulement pour le « pourquoi ».
- Tests : `docker compose exec web python manage.py test apps.<nom>` (ou pytest ciblé dans le conteneur).
