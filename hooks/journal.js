// Stop: keep one journal entry per conversation (demands, skills, agents, files) so the next one can resume.
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const MAX_ENTRIES = 10;

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {}
if (!input.transcript_path || !input.session_id) process.exit(0);

const prompts = [];
const skills = new Set();
const agents = new Set();
const files = new Set();
try {
  for (const line of fs.readFileSync(input.transcript_path, 'utf8').split('\n')) {
    if (!line) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    const c = e.message && e.message.content;
    if (e.type === 'user') {
      const text = typeof c === 'string' ? c : (c || []).filter((p) => p.type === 'text').map((p) => p.text).join(' ');
      if (text && !text.trimStart().startsWith('<')) prompts.push(text.replace(/\s+/g, ' ').trim().slice(0, 220));
    } else if (e.type === 'assistant' && Array.isArray(c)) {
      for (const p of c) {
        if (p.type !== 'tool_use' || !p.input) continue;
        if (p.name === 'Skill' && p.input.skill) skills.add(p.input.skill);
        if ((p.name === 'Agent' || p.name === 'Task') && p.input.description) agents.add(p.input.description);
        if (['Edit', 'Write', 'NotebookEdit'].includes(p.name) && p.input.file_path) {
          files.add(path.relative(root, p.input.file_path).replace(/\\/g, '/'));
        }
      }
    }
  }
} catch {
  process.exit(0);
}
if (!prompts.length) process.exit(0);

const mem = path.join(root, '.projetmemory');
const journal = fs.existsSync(mem)
  ? path.join(mem, 'sessions', 'journal.md')
  : path.join(os.homedir(), '.claude', 'vido', 'journal', `${path.basename(root).replace(/[^\w.-]+/g, '_')}.md`);

const id = input.session_id.slice(0, 8);
const list = (s) => (s.size ? [...s].slice(0, 15).join(', ') : 'aucun');
const entry = [
  `<!-- S:${id} -->`,
  `## ${new Date().toISOString().slice(0, 16).replace('T', ' ')} — conversation ${id}`,
  ...prompts.slice(0, 3).map((p) => `- Demande : ${p}`),
  ...(prompts.length > 3 ? [`- Dernière demande : ${prompts[prompts.length - 1]}`] : []),
  `- Skills : ${list(skills)}`,
  `- Agents : ${list(agents)}`,
  `- Fichiers modifiés : ${list(files)}`,
  `<!-- /S:${id} -->`,
].join('\n');

let content = '';
try { content = fs.readFileSync(journal, 'utf8'); } catch {}
const re = new RegExp(`<!-- S:${id} -->[\\s\\S]*?<!-- /S:${id} -->\\n?`);
const blocks = (content.replace(re, '').match(/<!-- S:\w+ -->[\s\S]*?<!-- \/S:\w+ -->/g) || []);
blocks.push(entry);
fs.mkdirSync(path.dirname(journal), { recursive: true });
fs.writeFileSync(journal, `# Journal des conversations (auto)\n\n${blocks.slice(-MAX_ENTRIES).join('\n\n')}\n`);
