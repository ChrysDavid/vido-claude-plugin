// PreToolUse: block forbidden actions before they run (exit 2 = blocked, stderr goes back to Claude).
const fs = require('fs');
const path = require('path');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0);
}
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const tool = input.tool_name || '';
const ti = input.tool_input || {};

const block = (why) => {
  process.stderr.write(`BLOQUÉ par vido : ${why}\n`);
  process.exit(2);
};

// Last real prompt of the owner: each git write needs its own explicit request.
const lastPrompt = () => {
  try {
    const lines = fs.readFileSync(input.transcript_path, 'utf8').trimEnd().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const e = JSON.parse(lines[i]);
      if (e.type !== 'user' || e.isSidechain || !e.message) continue;
      const c = e.message.content;
      const t = typeof c === 'string' ? c : (c || []).filter((p) => p.type === 'text').map((p) => p.text).join(' ');
      if (t && !t.trimStart().startsWith('<')) return t.toLowerCase();
    }
  } catch {}
  return '';
};

// Project stack, looked up at the root and one level down.
const hasFile = (test) => {
  const dirs = [root];
  try {
    for (const d of fs.readdirSync(root, { withFileTypes: true })) {
      if (d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules') dirs.push(path.join(root, d.name));
    }
  } catch {}
  return dirs.some(test);
};
const isDjango = () => hasFile((d) => fs.existsSync(path.join(d, 'manage.py')));
const isNest = () =>
  hasFile((d) => {
    try {
      return fs.readFileSync(path.join(d, 'package.json'), 'utf8').includes('@nestjs/core');
    } catch {
      return false;
    }
  });

const isEnv = (p) => /(^|[\\/])\.env(\.(?!example|sample|template)[\w.-]+)?$/i.test(p || '');

if (tool === 'Read' || tool === 'Edit' || tool === 'Write') {
  if (isEnv(ti.file_path) && !/\.env/.test(lastPrompt())) {
    block('lecture/écriture du .env interdite sans autorisation du propriétaire dans son dernier message.');
  }
  process.exit(0);
}

if (tool !== 'Bash' && tool !== 'PowerShell') process.exit(0);
const cmd = String(ti.command || '');
const c = cmd.toLowerCase();

if (/git\s+push\b[^\n]*(--force|-f\b)/.test(c) || /git\s+reset\s+--hard/.test(c)) {
  block('force-push et reset --hard interdits : demander au propriétaire, en une ligne, avec ce qui serait perdu.');
}

const gitWrites = [
  [/\bgit\s+commit\b/, /commit/, 'commit'],
  [/\bgit\s+push\b/, /push|pousse|pousser/, 'push'],
  [/\bgit\s+(checkout\s+-b|switch\s+-c|branch\s+(?!-)[\w./-]+)/, /branche|branch/, 'création de branche'],
  [/\bgh\s+pr\s+(create|merge|close|reopen)\b|\bgit\s+merge\b/, /\bpr\b|pull request|merge|fusion/, 'action PR/merge'],
];
for (const [re, ok, name] of gitWrites) {
  if (re.test(c) && !ok.test(lastPrompt())) {
    block(`${name} sans demande explicite du propriétaire pour CETTE action. Faire le travail en local et lui proposer en une ligne.`);
  }
}

if (/manage\.py/.test(c) && !/docker(\s+compose|-compose)?\s+(exec|run)/.test(c)) {
  block('backend Django toujours via Docker : docker compose exec web python manage.py …');
}

if (/docker(\s+compose|-compose)\s+(up|start|restart|build|run|create)\b/.test(c) && isNest() && !isDjango()) {
  const services = c.replace(/.*docker(\s+compose|-compose)\s+\w+/, '').split(/\s+/).filter((w) => w && !w.startsWith('-'));
  const infra = /^(db|postgres|postgresql|redis|pgadmin|mongo|mailhog|adminer)$/;
  if (!services.length || services.some((s) => !infra.test(s))) {
    block('projet NestJS : ne lancer que db/redis/pgadmin (ex. docker compose up -d db redis), jamais le conteneur backend.');
  }
}

if (/taskkill[^\n]*chrome\.exe/.test(c) || /stop-process[^\n]*-name\s+chrome\b/.test(c)) {
  block('ne jamais tuer chrome.exe en global (ferme le Chrome du propriétaire) : fermer le navigateur de test par browser.close() ou par PID.');
}

process.exit(0);
