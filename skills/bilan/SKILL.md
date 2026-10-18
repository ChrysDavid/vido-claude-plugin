---
name: bilan
description: Relit les conversations passées de tous les projets pour trouver ce que le propriétaire a dû répéter, et l'ajoute aux consignes permanentes. À lancer avec /vido:bilan (conseillé une fois par semaine).
---
# bilan

1. Lancer `node "${CLAUDE_PLUGIN_ROOT}/scripts/bilan.js"` (ajouter `--all` pour tout reprendre depuis le début). La sortie est déjà filtrée.
2. Comparer chaque demande avec RULES.md, `~/.claude/vido/consignes.md` et `.projetmemory/consignes.md` (déjà chargés en début de session).
3. Pour chaque règle durable absente ou pas respectée :
   - valable pour tous les projets → une ligne datée dans `~/.claude/vido/consignes.md` ;
   - propre à un projet → une ligne dans `.projetmemory/consignes.md` de ce projet ;
   - une ligne qui en contredit une ancienne la remplace.
4. Ignorer les demandes ponctuelles (une correction précise, une tâche du jour).
5. Réponse : 1 à 2 phrases (combien de règles ajoutées, où). Si une règle mérite d'aller dans RULES.md du plugin, le proposer en une ligne.
