---
name: init
description: Prépare le projet courant aux règles Vido (mémoire .projetmemory/, CLAUDE.md court, permissions). À lancer avec /vido:init à l'ouverture d'un nouveau projet ou d'un projet pas encore configuré.
---
# init

But : après ce skill, le propriétaire n'a plus rien à répéter dans ce projet. Ne jamais écraser un fichier existant.

0. **Installer les skills obligatoires, avant tout le reste** : copier chaque dossier de `kit/` de ce skill (token-economy, memory-graph, ponytail, ponytail-review, ponytail-audit, ponytail-debt, ponytail-gain, ponytail-help) dans `.claude/skills/` du projet, sans écraser un dossier existant (une seule commande cp en shell). Puis charger token-economy, ensuite ponytail, et les appliquer pour toute la suite.
1. **Détecter le stack** (un seul Glob ciblé à la racine et au niveau 1) : manage.py → Django ; pubspec.yaml → Flutter ; package.json avec @nestjs → NestJS, vue → Vue, @angular → Angular, next → Next.js ; docker-compose.yml.
2. **.projetmemory/** : créer ce qui manque à partir de `templates/` de ce skill (state.md, decisions.md, stack.md, graph.md vide, dossier sessions/). Remplir stack.md avec le stack détecté (une ligne par composant). Ajouter `.projetmemory/` au .gitignore s'il y a un dépôt git et que la ligne manque.
3. **CLAUDE.md** :
   - absent → le créer depuis `templates/CLAUDE.md` (moins de 60 lignes) : nom du projet, commandes de vérif du stack détecté, architecture en une phrase par composant, règles propres au projet ;
   - présent → ne pas le réécrire. Ajouter seulement en tête la ligne « Règles générales : plugin vido (RULES.md), chargées à chaque session. » si elle manque. Si de longs blocs dupliquent RULES.md, proposer en une ligne de les retirer, sans le faire.
4. **.claude/settings.json** : fusionner (sans écraser) les permissions de `templates/settings.json` adaptées au stack (garder seulement les commandes du stack détecté).
5. **Réponse** : 1 à 2 phrases, fichiers créés ou modifiés, rien d'autre.
