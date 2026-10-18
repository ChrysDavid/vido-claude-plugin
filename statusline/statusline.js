// Status line: model | project | context tokens used (from the last assistant usage) | session cost.
const fs = require('fs');
const path = require('path');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {}

let ctx = 0;
try {
  const lines = fs.readFileSync(input.transcript_path, 'utf8').trimEnd().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const e = JSON.parse(lines[i]);
    const u = e.type === 'assistant' && !e.isSidechain && e.message && e.message.usage;
    if (!u) continue;
    ctx = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
    break;
  }
} catch {}

const max = (input.context_window && input.context_window.context_window_size) || 200000;
const pct = Math.round((ctx / max) * 100);
const warn = pct >= 70 ? ' → /compact ou /clear' : '';
const model = (input.model && input.model.display_name) || '';
const dir = path.basename((input.workspace && input.workspace.current_dir) || input.cwd || '');
const cost = input.cost && typeof input.cost.total_cost_usd === 'number' ? ` | $${input.cost.total_cost_usd.toFixed(2)}` : '';

process.stdout.write(`${model} | ${dir} | contexte ${Math.round(ctx / 1000)}k (${pct}%)${warn}${cost}`);
