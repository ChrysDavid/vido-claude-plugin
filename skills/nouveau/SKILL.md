---
name: nouveau
description: Crée un nouveau projet propre (Django + Docker, NestJS + Prisma, Flutter Clean Architecture, Vue 3 + Vite) déjà configuré avec les règles du propriétaire. À lancer avec /vido:nouveau <stack> <nom>.
---
# nouveau

Toujours avec les commandes officielles, jamais de fichier de config écrit à la main quand une commande existe. Créer dans le dossier courant, chaque partie dans son dossier nommé `<nom>_backend/`, `<nom>_frontend/`, `<nom>_web/`.

## Django (`<nom>_backend/`, tout dans Docker)
1. Créer le squelette sans Python sur la machine : `docker run --rm -v "$PWD/<nom>_backend":/app -w /app python:3.12-slim sh -c "pip install django && django-admin startproject config ."`.
2. Ajouter `templates/django/` de ce skill : Dockerfile, docker-compose.yml (web, db PostGIS, redis, worker), requirements.txt, .env.example, .dockerignore.
3. Settings scindés `config/settings/{base,dev,prod}.py`, secrets via .env, DRF + simplejwt + CORS, `apps/` vide, `docs/` + README court.
4. `docker compose up -d --build`, puis `docker compose exec web python manage.py migrate` et `check`.

## NestJS (`<nom>_backend/`)
1. `npx @nestjs/cli new <nom>_backend --package-manager npm --skip-git`, puis `npm i @prisma/client class-validator class-transformer @nestjs/config joi` et `npm i -D prisma`, `npx prisma init`.
2. docker-compose.yml avec seulement db (Postgres) et redis ; le backend tourne en local (`npm run start:dev`, lancé par le propriétaire).
3. `PrismaModule` + `PrismaService`, `config/env.validation.ts`, ValidationPipe global, `.env.example`.

## Flutter (`<nom>_frontend/`)
1. `flutter create --org <domaine inversé> <nom>_frontend`.
2. `flutter pub add flutter_riverpod riverpod_annotation go_router dio freezed_annotation json_annotation flutter_secure_storage` et `flutter pub add -d build_runner riverpod_generator freezed json_serializable mocktail`.
3. Arborescence `lib/core/...` + `lib/features/` du skill vido:flutter, `main.dart` minimal, thème centralisé, environnement par `--dart-define=ENV=dev|prod`.
4. `flutter analyze` sans warning.

## Vue 3 (`<nom>_web/`)
1. `npm create vue@latest <nom>_web -- --typescript --router --pinia --eslint --prettier`, puis `npm install`.
2. Tokens CSS (couleurs, polices) dans un fichier unique, client API unique, `docs/` + README court.
3. `npm run lint` et `npm run build`.

## Ensuite, toujours
- Lancer vido:init (mémoire, CLAUDE.md, permissions, skills obligatoires), puis `/graphify .`.
- Ne pas créer de dépôt git distant ni committer sans demande explicite.
- Réponse : 1 à 2 phrases, avec la commande pour lancer le projet.
