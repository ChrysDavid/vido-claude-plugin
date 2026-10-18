# Installation

Une seule fois, dans Claude Code (n'importe quel projet) :

```
/plugin marketplace add D:/PROJET/VIDO/Vido_Plugin
/plugin install vido@vido-skills
```

Ensuite, à chaque session et dans tous les projets :
- `RULES.md` est injecté au démarrage, avec la fin de `.projetmemory/state.md` et les briefs en cours ;
- un rappel d'une ligne accompagne chaque message ;
- avant une compaction, un instantané (branche, fichiers modifiés, dernières demandes) est écrit dans `state.md`.

Nouveau projet : lancer `/vido:init` (crée `.projetmemory/`, un CLAUDE.md court et les permissions).

Modifier une règle : éditer `RULES.md`, puis `/plugin` → mettre à jour `vido` (ou relancer Claude Code).

Skills inclus : `vido:init`, `vido:memoire`, `vido:verification`, `vido:correction`, `vido:sous-agents`, `vido:qualite`, `vido:bilan`, `vido:django`, `vido:nestjs`, `vido:flutter`, `vido:web`. Agents : `explorer`, `verifier`.

Nouveau projet : `/vido:nouveau <stack> <nom>`. Avant production ou stores : `/vido:mise-en-prod`.
Garde-fou (`hooks/guard.js`) : bloque git non demandé, force-push, Python hors Docker, conteneur backend NestJS, .env, taskkill chrome.
Notifications Windows (`hooks/notify.js`) : quand Claude attend une réponse, et à la fin d'une tâche de plus de 2 minutes.

Barre d'état (tokens de contexte utilisés) : `statusline/statusline.js`, branchée dans `~/.claude/settings.json`.
Bilan hebdomadaire : `/vido:bilan` relit les conversations et ajoute les règles répétées à `~/.claude/vido/consignes.md`.
Les skills externes (ponytail, antislop, frontend-design, ui-ux-pro-max…) restent installés dans `~/.claude/skills` et sont appelés par RULES.md.
