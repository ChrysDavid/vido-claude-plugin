<div align="center">

# 🧠 Vido Plugin

**Mes règles de travail, ma mémoire projet et mes garde-fous, appliqués par Claude Code dans tous mes projets, sans jamais les répéter.**

![Claude Code](https://img.shields.io/badge/Claude_Code-plugin-D97757?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-2ea44f?style=flat-square)
![Langue](https://img.shields.io/badge/langue-français-0055A4?style=flat-square)
![Plateforme](https://img.shields.io/badge/Windows-11-0078D6?style=flat-square)

[Installation](#-installation) · [Ce qu'il fait](#-ce-quil-fait) · [Commandes](#-commandes) · [Structure](#-structure)

</div>

---

## 💬 En clair

Ce plugin apprend à Claude ma façon de travailler, une fois pour toutes.
Je n'ai plus besoin de lui répéter mes règles à chaque nouvelle conversation : il les connaît dès l'ouverture.
Il se souvient de ce qui a été fait dans le projet la dernière fois et reprend là où on s'était arrêté.
Il répond court, en français simple, et va droit au but.
Il lit seulement ce dont il a besoin, ce qui coûte moins cher et va plus vite.
Il m'empêche de faire des bêtises, comme envoyer du code sur GitHub sans que je l'aie demandé ou toucher aux fichiers de mots de passe.
Il vérifie son travail avant de me dire que c'est fini, et me dit clairement ce qui n'a pas été testé en vrai.
Il m'envoie une notification sur Windows quand il a besoin de moi ou quand une longue tâche est terminée.
Il sait démarrer un nouveau projet proprement, et préparer une mise en production sans rien oublier.
Avec le temps, il repère ce que j'ai dû lui répéter et l'ajoute à ses consignes pour ne plus l'oublier.

## ✨ Ce qu'il fait

| | Fonction | Comment |
|---|---|---|
| 📜 | **Règles toujours actives** | [RULES.md](RULES.md) injecté à chaque session : réponses courtes, lecture ciblée, une seule vérif, git sur demande |
| 🪙 | **Économie de tokens** | token-economy + ponytail + graphify chargés en permanence, rappel à chaque message |
| 🧩 | **Mémoire entre conversations** | consignes, journal des 3 dernières conversations et fin de `state.md` relus à l'ouverture |
| 🛡️ | **Garde-fou** | bloque git non demandé, force-push, Python hors Docker, conteneur NestJS, `.env`, `taskkill chrome` |
| 🔔 | **Notifications Windows** | quand Claude t'attend, ou à la fin d'une tâche de plus de 2 min |
| 📊 | **Barre d'état** | tokens de contexte utilisés, alerte à 70 % |
| 👥 | **Équipe d'agents** | sur demande : chef de projet, développeurs et testeur, en sonnet, jusqu'à zéro bug |

## 🚀 Installation

Dans Claude Code, une seule fois :

```text
/plugin marketplace add D:/PROJET/VIDO/Vido_Plugin
/plugin install vido@vido-skills
```

Puis, dans chaque nouveau projet :

```text
/vido:init
```

Détails et mise à jour : [docs/installation.md](docs/installation.md).

## 🧰 Commandes

| Commande | Rôle |
|---|---|
| `/vido:init` | Prépare le projet : `.projetmemory/`, CLAUDE.md court, permissions, skills obligatoires |
| `/vido:nouveau <stack> <nom>` | Crée un projet propre : Django + Docker, NestJS + Prisma, Flutter, Vue |
| `/vido:mise-en-prod` | Liste de vérification avant déploiement et stores |
| `/vido:bilan` | Relit les conversations et ajoute ce que j'ai dû répéter aux consignes |

Skills chargés automatiquement selon la tâche : `memoire`, `verification`, `correction`, `qualite`, `sous-agents`, `django`, `nestjs`, `flutter`, `web`.

## 🗂️ Structure

```text
Vido_Plugin/
├── .claude-plugin/      plugin.json + marketplace.json
├── RULES.md             règles injectées à chaque session
├── hooks/               démarrage, rappel, garde-fou, journal, notifications, compaction
├── skills/              init, nouveau, mise-en-prod, bilan, qualite, conventions…
│   └── init/kit/        skills copiés dans chaque projet (token-economy, memory-graph, ponytail)
├── agents/              explorer, verifier
├── scripts/bilan.js     extraction des règles répétées
├── statusline/          barre d'état des tokens
└── docs/                documentation
```

## 📁 Fichiers créés en dehors du plugin

| Emplacement | Contenu |
|---|---|
| `~/.claude/vido/consignes.md` | Mes consignes valables pour tous les projets |
| `<projet>/.projetmemory/` | `state.md`, `decisions.md`, `stack.md`, `consignes.md`, `sessions/journal.md` |
| `~/.claude/vido/journal/` | Journal des projets sans `.projetmemory/` |

## ✏️ Modifier une règle

Éditer [RULES.md](RULES.md) ou le skill concerné, puis mettre à jour `vido` depuis `/plugin`.

<div align="center">
<sub>Fait par <b>Chrys David</b></sub>
</div>
