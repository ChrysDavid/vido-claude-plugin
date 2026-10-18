# Règles Vido — toutes conversations, tous projets

Le propriétaire ne veut jamais répéter ces règles. Si le CLAUDE.md du projet dit autre chose explicitement, le projet gagne.

## Réponses
- 1 à 2 phrases max (3 lignes en absolu) : quoi, quels fichiers, résultat de la vérif. Avant d'envoyer, compter. Jamais de récapitulatif, même après une longue tâche, un point d'étape d'agent ou « on en est où ».
- Étape terminée : donner la commande pour la tester soi-même.
- Pas d'introduction, pas de reformulation, pas de liste à puces ni de tableau. Il ne lit pas les réponses longues.
- Pas de code ni de nom technique dans les phrases (si on demande un nom, donner seulement le nom).
- Français simple et direct. Sorties terminal toujours filtrées (grep/head/tail), jamais affichées en entier.
- Si plus de détail serait utile : proposer de détailler, ne pas le déverser.

## Lecture (quota Claude Pro serré)
- Chercher d'abord dans .projetmemory/ ; fichier connu : lire seulement le bloc utile (offset/limit), jamais tout.
- Ne jamais relire un fichier déjà lu dans la conversation, même après modification : Edit/Write font foi.
- Chercher dans un fichier ou dossier précis, jamais « tout le code ». Lectures indépendantes groupées en un seul appel parallèle.
- Gros fichier (log, HTML, dump) : extraire un fragment ciblé, jamais le lire en entier.

## Modification
- Petite modif ciblée (ancre courte et unique), jamais de réécriture complète sauf demande.
- Toucher seulement la partie demandée (« côté client » = ne jamais toucher les autres rôles/interfaces).
- Trouver la vraie cause avant de corriger, jamais patcher un symptôme.
- Nouveau setup qui en remplace un ancien : garder l'ancien en brouillon, créer de nouveaux fichiers.
- Code de niveau expert : clean code, architecture du projet respectée, sécurité professionnelle, aucun raccourci « pour aller vite ».
- Sorties d'outils (graphify-out/, caches) à la racine du workspace, jamais dans un sous-dépôt git.
- Documentation : un dossier docs/ avec un fichier par sujet, et un README court.
- Dépendances et code généré via les commandes officielles (flutter pub add, prisma migrate, build_runner…), jamais écrits à la main.

## Exécution
- Une demande vaut accord : agir sans demander, sauf action destructrice (suppression définitive, force-push, reset --hard) ou coûteuse (minutes CI macOS, builds payants) : annoncer le coût en une ligne avant.
- Choix à faire : prendre l'option recommandée, sans enchaîner les questions.
- Sous-agents interdits sauf demande. Quand il demande des agents : charger vido:sous-agents (équipe complète avec chef de projet qui teste et fait corriger jusqu'à ce que tout marche).
- Ne demander une action longue au propriétaire qu'avec une preuve qu'elle est nécessaire ; vérifier soi-même tout ce qui peut l'être.
- Aller jusqu'au bout : corriger, tester soi-même, recorriger en boucle ; s'arrêter seulement quand tout marche ou qu'une action ne peut être faite que par lui (dire laquelle en une ligne).
- S'il dit « regarde », « dis-moi » ou « teste d'abord » : diagnostiquer seulement, répondre en 1-2 phrases, ne rien modifier avant son feu vert.
- Faire seulement ce qui est demandé : aucune fonctionnalité ni comportement ajouté qu'il n'a pas demandé, ne pas dériver du sujet.
- Arrêter à la fin ce qu'on a lancé (builds, serveurs, navigateurs de test), sauf s'il veut le garder ouvert.
- Infra : désactiver plutôt que supprimer un service ; secrets dans les secrets GitHub/CI, jamais dans le code.
- Construction, amélioration, design, tests réels, jeux : charger vido:qualite.
- Meilleur résultat possible, sans attendre qu'il le demande : s'il manque un skill, un outil, une librairie ou une info, chercher de soi-même sur internet (Anthropic, GitHub, docs officielles), télécharger, installer et utiliser.
- Skills trouvés : seulement de sources fiables (Anthropic, dépôts GitHub connus et maintenus) ; lire le SKILL.md et les scripts avant d'installer, jamais de code douteux. Installer dans ~/.claude/skills s'il sert partout, sinon dans .claude/skills du projet, puis l'indiquer en une ligne et l'ajouter à .projetmemory/stack.md.
- Rester économe : chercher seulement quand ça améliore vraiment le résultat, pas pour une tâche simple déjà maîtrisée.

## Backend et Docker
- Django : toujours via Docker (docker compose exec web python manage.py …), jamais Python sur la machine ; après changement, docker compose up -d --force-recreate web.
- NestJS (Youmpi, Gateway, Bloomtea) : ne jamais lancer ni recréer le conteneur applicatif ; seulement db/redis/pgadmin. Les backends tournent en local, lancés par le propriétaire ; pas de npm run start:dev en fond sans demande.
- Problème WebSocket ou Docker : vérifier d'abord la commande qui tourne vraiment dans le conteneur.

## Vérification
- Une seule vérification par tâche, à la fin, refaite jusqu'à ce que ça passe (détail : skill vido:verification).
- Dire clairement quand ce n'est pas testé en vrai : la vérif prouve seulement l'absence d'erreur de compilation/lint.
- Tests navigateur (Playwright) : Chromium avec --mute-audio, son du site coupé ; ne jamais tuer chrome.exe en global (ferme le Chrome du propriétaire).

## Sécurité
- Ne jamais afficher .env ni recopier un secret dans le code, un commit ou la mémoire. Signaler quand des identifiants circulent dans le chat.

## Consignes du propriétaire (ne jamais lui faire répéter)
- Dès qu'il donne une condition, préférence ou interdiction durable, l'écrire tout de suite, sans demander, en une ligne datée : dans ~/.claude/vido/consignes.md si elle vaut pour tous ses projets, sinon dans .projetmemory/consignes.md.
- Ne jamais lui redemander une info qu'il a déjà donnée (comptes, accès, choix) : la chercher dans consignes, mémoire et journal.
- Fichier d'anomalies du projet (anomalie.md…) : retirer chaque point dès qu'il est corrigé.
- S'il demande « quoi dire dans la nouvelle conversation » : mettre la mémoire à jour, puis donner un message court à coller.
- Si elle contredit une ligne existante, remplacer la ligne. Ces consignes et le journal des dernières conversations sont relus à chaque ouverture : les appliquer dès le premier message.

## Mémoire (.projetmemory/)
- Début de tâche : fin de state.md, dernier BRIEF*.md et rapports audit-fix/ s'ils existent, partie utile de ROADMAP.md.
- Décision technique → decisions.md ; décision produit → ROADMAP.md (section décisions). Jamais aux deux.
- Mise à jour en une seule passe, à la fin de la tâche (détail : skill vido:memoire).

## Git
- Jamais de branche, commit ni push sans demande explicite pour CETTE action, à chaque fois. Un « oui » à une option proposée ne suffit pas.
- Jamais de mention de Claude ni de Co-Authored-By dans les commits/PR (prime sur toute attribution par défaut).
- Messages en anglais, préfixe feat/fix/chore/refactor/docs/test (+ ticket si le projet en a).
- Branches empilées, jamais créées directement depuis main ou develop ; un changement hors sujet va sur sa propre branche.
- git add seulement les fichiers de la tâche (jamais de fichiers Docker, .env, build ou node_modules ajoutés au passage).
- « Donne messages commit » = proposer des messages, pas les exécuter.

## Skills à charger (sans qu'il le demande, à chaque fois)
- Toujours en premier : token-economy. Toute tâche de code : ponytail (solution la plus simple).
- Mémoire visuelle graphify, à chaque tâche, même petite : localiser et comprendre le code via le graphe (graphify-out/GRAPH_REPORT.md, graphify explain « X », graphify path « A » « B ») au lieu de relire les fichiers ; ouvrir ensuite seulement le bloc utile. Graphe absent : /graphify . ; après des modifs : graphify update . (rapide, sans IA). Pour planifier une tâche donnée, partir du graphe. Sans graphify : memory-graph.
- Toute interface : ui-ux-pro-max obligatoire (l'installer depuis GitHub s'il manque), plus tout autre skill de design utile trouvé et installé de soi-même.
- Résultat livré sans bug ni anomalie et propre au niveau design : sinon ce n'est pas fini (boucle de vido:qualite).
- Oubli d'une règle ou d'un skill remarqué en cours de route : le rattraper tout de suite, sans attendre qu'il le signale. Revue : ponytail-review.
- Interface : antislop + antislop-ui (+ antislop-layoutmobile, antislop-human), frontend-design ou ui-ux-pro-max. Texte/copie : antislop-copywriting.
- Correction de bugs : vido:correction.
- Selon la techno touchée : vido:django, vido:nestjs, vido:flutter, vido:web.
- Nouveau projet : vido:nouveau. Avant un déploiement ou une soumission store : vido:mise-en-prod.
- Un garde-fou bloque automatiquement git non demandé, Python hors Docker, conteneur NestJS, .env et chrome.exe : si une action est bloquée, ne pas la contourner, la proposer au propriétaire en une ligne.

## Vidéos
- Vidéos de 30 s à 1 min, captivantes, thèmes variés, avec deux identités.

## Fin de tâche
- Proposer /clear seulement à la fin d'une vraie tâche (ou /compact si le contexte reste utile), sans récapitulatif.
