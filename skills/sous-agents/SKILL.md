---
name: sous-agents
description: Équipe de développement complète (chef de projet + développeurs + testeur) pilotée par sous-agents, économe en tokens. Seulement quand le propriétaire demande d'utiliser des agents ou une équipe.
---
# sous-agents — équipe de dev

Jamais par défaut : seulement quand le propriétaire le demande dans la conversation. Sinon, faire la tâche soi-même.

## Rôles
- **Chef de projet = toi (la conversation principale).** Tu découpes, tu attribues, tu ne codes pas toi-même sauf l'intégration. Tu testes à la fin et tu relances l'agent concerné sur chaque bug ou anomalie trouvé, jusqu'à ce que tout soit propre et opérationnel.
- **Cartographe** (agent explorer, une seule fois au début si .projetmemory/graph.md manque ou est périmé) : localise les fichiers par feature. Utiliser le skill graphify s'il est installé, sinon écrire/mettre à jour `.projetmemory/graph.md` (une ligne par module : dossier, fichiers clés, endpoints).
- **Développeurs** (un agent par domaine : backend, mobile, web…) : chacun possède ses fichiers, aucun fichier partagé entre deux agents.
- **Testeur** (agent verifier) : lance la vérification du stack (skill vido:verification) + tests en vrai quand possible, et renvoie la liste des anomalies : fichier, ligne, cause probable.

## Boucle
1. Découper en lots indépendants (fichiers séparés), lancer les développeurs en parallèle.
2. Intégrer, puis lancer le testeur une fois.
3. Pour chaque anomalie : renvoyer à l'agent propriétaire du fichier avec le skill adapté à charger (vido:correction pour un bug, ponytail pour le code, antislop-ui / frontend-design pour l'interface, ponytail-review pour une revue).
4. Retester. Répéter 3-4 jusqu'au vert. Seul le chef de projet déclare la tâche finie.

## Économie de tokens (Claude Pro) — à mettre dans chaque brief
- Modèle sonnet pour tous les agents (haiku pour une simple vérif), jamais opus.
- Brief court : objectif, fichiers exacts à lire (pris dans graph.md / stack.md), fichiers possédés, skill à charger, critère de fin.
- Lecture ciblée offset/limit, jamais relire un fichier, sorties shell filtrées, pas d'exploration large.
- Backend Django via Docker ; jamais de conteneur applicatif NestJS ; aucune commande git d'écriture.
- Rapport de 10 lignes max : fait, fichiers, résultat vérif, anomalies restantes.
- Une seule vérification complète par tour de boucle, faite par le testeur.

## Fin
Une passe de mémoire (vido:memoire) par le chef de projet, réponse de 1-2 phrases au propriétaire, ce qui n'a pas été testé en vrai dit clairement.
