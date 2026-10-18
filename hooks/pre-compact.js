// PreCompact: snapshot critical state into .projetmemory/state.md before compaction.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const stateFile = path.join(root, '.projetmemory', 'state.md');
if (!fs.existsSync(path.dirname(stateFile))) process.exit(0);

const START = '<!-- AUTO-SNAPSHOT:START -->';
const END = '<!-- AUTO-SNAPSHOT:END -->';

const sh = (cmd) => {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {}

const lastPrompts = [];
try {
  const lines = fs.readFileSync(input.transcript_path, 'utf8').trim().split('\n');
  for (let i = lines.length - 1; i >= 0 && lastPrompts.length < 3; i--) {
    const entry = JSON.parse(lines[i]);
    if (entry.type !== 'user' || !entry.message) continue;
    const c = entry.message.content;
    const text = typeof c === 'string' ? c : (c || []).filter((p) => p.type === 'text').map((p) => p.text).join(' ');
    if (text && !text.startsWith('<')) lastPrompts.unshift(text.replace(/\s+/g, ' ').slice(0, 200));
  }
} catch {}

const changed = sh('git status --short')
  .split('\n')
  .filter((l) => l && !/node_modules|dist\//.test(l))
  .slice(0, 25);

const snapshot = [
  START,
  `## Auto-snapshot (${new Date().toISOString().slice(0, 16)}, ${input.trigger || 'compact'})`,
  `- Branche : \`${sh('git branch --show-current') || 'hors git'}\``,
  `- Derniers commits : ${sh('git log --oneline -3').split('\n').join(' | ') || 'aucun'}`,
  `- Fichiers modifiés : ${changed.length ? changed.map((l) => l.trim()).join(', ') : 'aucun'}`,
  ...lastPrompts.map((p) => `- Demande récente : ${p}`),
  END,
].join('\n');

let content = fs.existsSync(stateFile) ? fs.readFileSync(stateFile, 'utf8') : '# État du projet\n';
const re = new RegExp(`${START}[\\s\\S]*?${END}`);
content = re.test(content) ? content.replace(re, snapshot) : `${content.trimEnd()}\n\n${snapshot}\n`;
fs.writeFileSync(stateFile, content);
