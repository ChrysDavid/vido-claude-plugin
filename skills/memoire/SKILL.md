---
name: memoire
description: Continuité entre conversations via .projetmemory/. À utiliser au début de chaque tâche et à la fin, dès qu'un état ou une décision a changé.
---
# memoire

**Début de tâche** : fin de `state.md`, le BRIEF le plus récent de `audit-fix/` et ses rapports s'ils existent, section utile de `ROADMAP.md`. Reprendre le contexte seul, sans le redemander.

**Fin de tâche, en une seule passe** :
- `state.md` : une ligne (date, quoi, fichiers, résultat vérif, testé en vrai ou non) ; déplacer de « à faire » vers « fait ».
- `decisions.md` : choix technique + raison en une ligne. Décision produit → `ROADMAP.md`. Jamais aux deux.
- `stack.md` / `graph.md` : seulement si un module, une dépendance ou une intégration a été ajouté.
- `sessions/<date>-<sujet>.md` : 5 à 10 lignes, seulement après une grosse session.
- `CLAUDE.md` : seulement des règles toujours vraies, sous 150 lignes.

Jamais de secret (mots de passe, clés, contenu de .env) dans ces fichiers. Rien d'important gardé seulement dans la conversation.
