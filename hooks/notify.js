// Notification + Stop: Windows notification when Claude waits for the owner, or when a long task (> 2 min) ends.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch {}
if (process.platform !== 'win32') process.exit(0);

const project = path.basename(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
let text = '';

if (input.hook_event_name === 'Notification') {
  text = input.message || 'Claude attend ta réponse.';
} else {
  // Stop: only for turns longer than 2 minutes.
  try {
    const lines = fs.readFileSync(input.transcript_path, 'utf8').trimEnd().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const e = JSON.parse(lines[i]);
      if (e.type !== 'user' || e.isSidechain || !e.timestamp) continue;
      const c = e.message && e.message.content;
      const isPrompt = typeof c === 'string' || (Array.isArray(c) && c.some((p) => p.type === 'text'));
      if (!isPrompt) continue;
      if (Date.now() - Date.parse(e.timestamp) > 120000) text = 'Tâche terminée.';
      break;
    }
  } catch {}
}
if (!text) process.exit(0);

const esc = (s) => s.replace(/'/g, "''").slice(0, 200);
const ps = [
  'Add-Type -AssemblyName System.Windows.Forms;',
  '$n = New-Object System.Windows.Forms.NotifyIcon;',
  '$n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true;',
  `$n.ShowBalloonTip(6000, 'Claude - ${esc(project)}', '${esc(text)}', 'Info');`,
  'Start-Sleep -Seconds 7; $n.Dispose()',
].join(' ');
spawn('powershell.exe', ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', ps], { detached: true, stdio: 'ignore' }).unref();
