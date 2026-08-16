const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next']);

function isBinary(buffer) {
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

function walk(dir, cb) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    if (SKIP_DIRS.has(it.name)) continue;
    const full = path.join(dir, it.name);
    if (it.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

let processed = 0;
let changed = 0;

walk(ROOT, (file) => {
  try {
    const buf = fs.readFileSync(file);
    if (isBinary(buf)) return;
    const src = buf.toString('utf8');
    let out = src;
    out = out.replace(/\/\*[\s\S]*?\*\//g, '');
    out = out.replace(//g, '');
    out = out.replace(/^\s*\/\/.*$/gm, '');
    out = out.replace(/\n{3,}/g, '\n\n');
    out = out.replace(/^\s*#.*$/gm, '');

    if (out !== src) {
      fs.writeFileSync(file, out, 'utf8');
      changed++;
    }
    processed++;
  } catch (e) {
  }
});

console.log(`Processed ${processed} files, changed ${changed} files.`);
