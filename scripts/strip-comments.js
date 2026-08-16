const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next']);

const EXT_WHITELIST = null;

function isBinary(buffer) {
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

function shouldProcess(file) {
  const base = path.basename(file);
  if (base === 'package-lock.json' || base === 'yarn.lock') return true;
  if (EXT_WHITELIST === null) return true;
  const ext = path.extname(file).toLowerCase();
  if (EXT_WHITELIST.has(ext)) return true;
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

function stripComments(src) {
  let out = '';
  let i = 0;
  const len = src.length;
  let inSingle = false, inDouble = false;
  let inLineComment = false, inBlockComment = false, inHtmlComment = false;

  while (i < len) {
    const ch = src[i];
    const next = src[i+1];

    if (inBlockComment) {
      if (ch === '*' && next === '/') { i += 2; inBlockComment = false; continue; }
      i++; continue;
    }
    if (inHtmlComment) {
      if (ch === '-' && src[i+1] === '-' && src[i+2] === '>') { i += 3; inHtmlComment = false; continue; }
      i++; continue;
    }
    if (inLineComment) {
      if (ch === '\n') { inLineComment = false; out += ch; i++; continue; }
      i++; continue;
    }

    if (!inSingle && !inDouble) {
      
      if (ch === '/' && next === '*') { inBlockComment = true; i += 2; continue; }
      if (ch === '<' && src.substr(i, 4) === '<!--') { inHtmlComment = true; i += 4; continue; }
      if (ch === '/' && next === '/') { 
        
        inLineComment = true; i += 2; continue; }
      if (ch === '/' && src.substr(i,3) === '///') { inLineComment = true; i += 3; continue; }
      if (ch === '#') {
        
        const prev = i === 0 ? '\n' : src[i-1];
        if (prev === '\n' || prev === '\r') { inLineComment = true; i++; continue; }
      }
    }

    
    if (ch === "'" && !inDouble) { out += ch; inSingle = !inSingle; i++; continue; }
    if (ch === '"' && !inSingle) { out += ch; inDouble = !inDouble; i++; continue; }
    // backticks are not treated as string delimiters here

    
    if ((inSingle || inDouble) && ch === '\\') {
      out += ch;
      if (i+1 < len) { out += src[i+1]; i += 2; continue; }
    }

    out += ch;
    i++;
  }

  return out;
}

let processed = 0;
let changed = 0;

walk(ROOT, (file) => {
  try {
    if (!shouldProcess(file)) return;
    const buf = fs.readFileSync(file);
    if (isBinary(buf)) return;
    const src = buf.toString('utf8');
    const out = stripComments(src);
    if (out !== src) {
      fs.writeFileSync(file, out, 'utf8');
      changed++;
    }
    processed++;
  } catch (e) {
    
  }
});

console.log(`Processed ${processed} files, changed ${changed} files.`);
