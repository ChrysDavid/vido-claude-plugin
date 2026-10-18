// Extract the owner's rule-like requests from all Claude Code transcripts since the last bilan.
// Usage: node bilan.js [--all]   (prints at most 80 deduplicated lines, then records today's date)
const fs = require('fs');
const os = require('os');
const path = require('path');

const base = path.join(os.homedir(), '.claude', 'projects');
const stamp = path.join(os.homedir(), '.claude', 'vido', 'last-bilan.txt');
let since = 0;
if (!process.argv.includes('--all')) {
  try { since = Date.parse(fs.readFileSync(stamp, 'utf8').trim()) || 0; } catch {}
}

const RULE = /toujours|jamais|chaque fois|à chaque|a chaque|n'oublie|arr[eê]te|je ne veux|je veux que|tu dois|il faut que|r[eè]gle|interdit|plus jamais|combien de fois|je t'ai d[eé]j[aà]|rappel|trop long|m[eé]moire|ne pas que j'ai/i;
const seen = new Set();
const out = [];

for (const d of fs.readdirSync(base)) {
  const dir = path.join(base, d);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl'))) {
    const file = path.join(dir, f);
    if (fs.statSync(file).mtimeMs < since) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      if (!line) continue;
      let e;
      try { e = JSON.parse(line); } catch { continue; }
      if (e.type !== 'user' || e.isSidechain || !e.message) continue;
      if (e.timestamp && Date.parse(e.timestamp) < since) continue;
      const c = e.message.content;
      let t = typeof c === 'string' ? c : (c || []).filter((p) => p.type === 'text').map((p) => p.text).join(' ');
      t = t.replace(/<pasted_content[\s\S]*?<\/pasted_content[^>]*>/g, '[collé]').replace(/\s+/g, ' ').trim();
      if (!t || t.startsWith('<') || t.startsWith('Base directory') || t.startsWith('Another Claude session') || !RULE.test(t)) continue;
      const key = t.slice(0, 100).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(`${d.replace(/^[a-zA-Z]--/, '').replace(/^PROJET-/, '')} | ${t.slice(0, 280)}`);
    }
  }
}

console.log(out.slice(-80).join('\n') || 'Aucune nouvelle demande de règle depuis le dernier bilan.');
console.log(`\n${out.length} demande(s) trouvée(s).`);
fs.mkdirSync(path.dirname(stamp), { recursive: true });
fs.writeFileSync(stamp, new Date().toISOString());
