---
name: nestjs
description: Conventions backend NestJS + Prisma du propriétaire (Youmpi Delivery, Payment Gateway, Bloomtea, Yoomi Rent). À charger pour toute tâche dans un backend NestJS.
---
# nestjs

Projet existant : suivre le style déjà en place. Nouveau projet : ces défauts.

## Exécution
- Ne jamais lancer, recréer ni rebuild le conteneur applicatif (backend/web) : seulement db, redis, pgadmin. Le backend tourne en local, lancé par le propriétaire ; ne pas lancer `npm run start:dev` en fond sans demande.
- Port déjà pris : identifier le processus avant d'agir, ne pas tuer celui d'un autre projet.

## Structure
- Un module = `x.module.ts` + `x.controller.ts` + `x.service.ts` + `dto/` + `x.service.spec.ts` à côté. e2e dans `test/`.
- Accès base uniquement via `PrismaService`, jamais un client Prisma instancié ailleurs.
- Validation d'entrée = DTO + class-validator, jamais à la main dans le service.
- Variables d'env déclarées dans `config/env.validation.ts` + `.env.example`. Ne jamais lire `.env`.

## Règles métier
- Toute route porte un décorateur d'auth (ou guards globaux déjà actifs : ne pas les redéclarer sans raison) ; isoler les données par client/tenant.
- Argent : chaîne décimale → `Prisma.Decimal`, jamais `number`.
- Changements de statut via le service de transition, écritures comptables dans la même transaction.
- Code dupliqué entre backend et client (ex. promo) : modifier les deux.

## Prisma
- Modifier `prisma/schema.prisma` puis `npx prisma migrate dev --name <snake_case>` ; jamais de SQL ou dossier de migration écrit à la main, jamais éditer une migration appliquée.

## Vérification
- `npm run types` (ou `npx tsc --noEmit`), `npm run lint`, `npx jest src/<module>`.
