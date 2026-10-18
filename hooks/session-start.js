// SessionStart: inject the owner's rules + project memory context.
const fs = require('fs');
const path = require('path');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
const mem = path.join(root, '.projetmemory');
const out = [
  '[OBLIGATOIRE avant toute action dans cette conversation] La mémoire ci-dessous est déjà chargée : ' +
    'l\'appliquer dès le premier message sans que le propriétaire le demande. Si la demande touche un sujet ' +
    'des dernières conversations, lire aussi le bloc utile des fichiers .projetmemory listés, puis agir. ' +
    'Ne jamais lui demander de rappeler le contexte.\n',
];

try {
  out.push(fs.readFileSync(path.join(pluginRoot, 'RULES.md'), 'utf8').trim());
} catch {}

// Always-on skills, injected every session in every project (token-economy first, then ponytail).
for (const s of ['token-economy', 'memory-graph', 'ponytail']) {
  try {
    const body = fs.readFileSync(path.join(pluginRoot, 'skills', 'init', 'kit', s, 'SKILL.md'), 'utf8');
    out.push(`\n[Skill ${s} — actif en permanence]\n${body.replace(/^---[\s\S]*?---\s*/, '').trim()}`);
  } catch {}
}

// Required tools check: remind to install/use whatever is missing, every session.
const home = require('os').homedir();
const has = (...p) => p.some((x) => fs.existsSync(x));
const skillsDir = path.join(home, '.claude', 'skills');
const synced = (() => {
  try {
    return fs.readdirSync(path.join(skillsDir, 'synced')).map((d) => path.join(skillsDir, 'synced', d, 'ui-ux-pro-max'));
  } catch {
    return [];
  }
})();
const todo = [];
if (!has(path.join(skillsDir, 'graphify'), path.join(root, '.claude', 'skills', 'graphify'))) {
  todo.push('graphify absent : l\'installer maintenant (pipx install graphifyy puis graphify install --platform claude).');
}
if (!has(path.join(skillsDir, 'ui-ux-pro-max'), path.join(root, '.claude', 'skills', 'ui-ux-pro-max'), ...synced)) {
  todo.push('ui-ux-pro-max absent : l\'installer avant toute tâche d\'interface (/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill puis /plugin install ui-ux-pro-max@ui-ux-pro-max-skill).');
}
if (!fs.existsSync(path.join(root, 'graphify-out')) && fs.existsSync(path.join(root, '.projetmemory'))) {
  todo.push('Pas de graphe graphify dans ce projet : le construire (/graphify .) à la première tâche de code, puis graphify update . après les modifs.');
}
if (todo.length) out.push(`\n[À faire de soi-même, sans attendre le propriétaire]\n- ${todo.join('\n- ')}`);

// Owner's standing conditions: all projects, then this project.
const globalDir = path.join(require('os').homedir(), '.claude', 'vido');
const readIf = (f) => { try { return fs.readFileSync(f, 'utf8').trim(); } catch { return ''; } };
const gc = readIf(path.join(globalDir, 'consignes.md'));
if (gc) out.push(`\n[Consignes du propriétaire — tous projets : ~/.claude/vido/consignes.md]\n${gc}`);
const pc = readIf(path.join(mem, 'consignes.md'));
if (pc) out.push(`\n[Consignes du propriétaire — ce projet : .projetmemory/consignes.md]\n${pc}`);

// Last conversations (written by journal.js on Stop).
const jFile = fs.existsSync(mem)
  ? path.join(mem, 'sessions', 'journal.md')
  : path.join(globalDir, 'journal', `${path.basename(root).replace(/[^\w.-]+/g, '_')}.md`);
const blocks = readIf(jFile).match(/<!-- S:\w+ -->[\s\S]*?<!-- \/S:\w+ -->/g) || [];
if (blocks.length) {
  out.push(`\n[Dernières conversations — reprendre sans redemander]\n${blocks.slice(-3).join('\n').replace(/<!-- \/?S:\w+ -->\n?/g, '')}`);
}

if (fs.existsSync(mem)) {
  try {
    const lines = fs.readFileSync(path.join(mem, 'state.md'), 'utf8').trimEnd().split('\n');
    out.push(`\n[Fin de .projetmemory/state.md]\n${lines.slice(-25).map((l) => (l.length > 300 ? `${l.slice(0, 300)}…` : l)).join('\n')}`);
  } catch {}
  const dec = readIf(path.join(mem, 'decisions.md')).split('\n').filter((l) => l.startsWith('-'));
  if (dec.length) out.push(`\n[Dernières décisions — .projetmemory/decisions.md]\n${dec.slice(-8).join('\n')}`);
  try {
    const files = fs.readdirSync(mem).filter((f) => f.endsWith('.md'));
    out.push(`\n[Fichiers mémoire disponibles] ${files.map((f) => `.projetmemory/${f}`).join(', ')}`);
  } catch {}
  try {
    const briefs = fs.readdirSync(path.join(mem, 'audit-fix')).filter((f) => /^BRIEF.*\.md$/i.test(f)).sort();
    if (briefs.length) out.push(`\n[Briefs en cours] ${briefs.map((b) => `.projetmemory/audit-fix/${b}`).join(', ')}`);
  } catch {}
} else {
  out.push('\n[Pas de .projetmemory/ ici] Proposer en une ligne de lancer /vido:init si c\'est un vrai projet.');
}

process.stdout.write(out.join('\n') + '\n');
