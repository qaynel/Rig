#!/usr/bin/env node
'use strict';

// RIG-135: ratchet against new unguarded subprocess spawns, mirroring the
// raw-registry-access pattern (scripts/check-raw-registry-access.js). Two
// violation shapes, both confirmed against real call sites in RIG-135's
// survey:
//   (a) a kill that can only ever reach the direct pid — `<child>.kill(...)`
//       (ChildProcess#kill never signals a group) or `process.kill(x.pid, ...)`
//       with a positive pid.
//   (b) `spawn`/`spawnSync`/`execSync`/`execFileSync` with a `timeout:` option
//       and no paired `detached: true` + negative-pid group kill nearby —
//       the timeout SIGTERMs the direct child only.
// Neither pattern fires on `process.kill(-x.pid, ...)` (the correct,
// group-signalling form used by scripts/review-receipt.js).

const fs = require('node:fs');
const path = require('node:path');

const HELPER_MODULE = 'rig/lib/spawn-guarded.js';
const SELF = 'scripts/check-spawn-guard.js'; // its own regex literals otherwise self-match
const SKIP_DIRS = new Set(['node_modules', '.git', '.rig', 'tests', '.context', 'wiki']);

const CHILD_KILL = /\b[\w$]+(?:\.[\w$]+)*\.kill\(/g;
const POSITIVE_PID_KILL = /process\.kill\(\s*[\w$]+(?:\.[\w$]+)*\.pid\s*,/g;
const NEGATIVE_PID_KILL_NEARBY = /process\.kill\(\s*-\s*[\w$]+(?:\.[\w$]+)*\.pid\s*,/;
const DETACHED_TRUE_NEARBY = /detached\s*:\s*true/;
const TIMEOUT_SPAWN = /\b(?:spawn|spawnSync|execSync|execFileSync)\(/g;

function parseArgs(argv) {
  const args = {
    root: path.join(__dirname, '..'),
    inventory: path.join(__dirname, '..', 'rig', 'spawn-guard-allowlist.json'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root') args.root = argv[++i];
    else if (argv[i] === '--inventory') args.inventory = argv[++i];
  }
  return args;
}

function isShebangScript(file) {
  try {
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(2);
    fs.readSync(fd, buf, 0, 2, 0);
    fs.closeSync(fd);
    return buf.toString('utf8') === '#!';
  } catch {
    return false;
  }
}

function listSource(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      listSource(path.join(dir, entry.name), acc);
    } else if (/\.(js|ts)$/.test(entry.name) && !entry.name.endsWith('.test.js') && !entry.name.endsWith('.test.ts')) {
      acc.push(path.join(dir, entry.name));
    } else if (!path.extname(entry.name) && isShebangScript(path.join(dir, entry.name))) {
      // Several plumbing/bin/* utilities (e.g. rig-brain-cache) ship as
      // extensionless executables; extension-only filtering would silently
      // skip them.
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

// A call has a `timeout:` option if that key appears before the call's
// closing paren. Balance-scan from the opening paren instead of a fixed
// character window so nested option objects don't fool the check.
function callHasTimeoutOption(source, openParenIndex) {
  let depth = 1;
  let i = openParenIndex + 1;
  while (i < source.length && depth > 0) {
    if (source[i] === '(') depth += 1;
    else if (source[i] === ')') depth -= 1;
    i += 1;
  }
  const body = source.slice(openParenIndex, i);
  return /\btimeout\s*:/.test(body);
}

function findViolations(file, root) {
  const source = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (rel === HELPER_MODULE || rel === SELF) return [];
  const violations = [];

  for (const match of source.matchAll(CHILD_KILL)) {
    if (match[0].startsWith('process.kill(')) continue; // handled by the pid-shaped patterns below
    violations.push({ kind: 'direct-kill', index: match.index, snippet: match[0] });
  }
  for (const match of source.matchAll(POSITIVE_PID_KILL)) {
    violations.push({ kind: 'positive-pid-kill', index: match.index, snippet: match[0] });
  }
  for (const match of source.matchAll(TIMEOUT_SPAWN)) {
    const openParen = match.index + match[0].length - 1;
    if (!callHasTimeoutOption(source, openParen)) continue;
    const windowEnd = Math.min(source.length, openParen + 800);
    const window = source.slice(Math.max(0, match.index - 200), windowEnd);
    if (DETACHED_TRUE_NEARBY.test(window) && NEGATIVE_PID_KILL_NEARBY.test(window)) continue; // review-receipt.js-shaped: compliant
    violations.push({ kind: 'ungrouped-timeout', index: match.index, snippet: match[0] });
  }

  if (!violations.length) return [];
  const lines = source.slice(0, Math.max(0, Math.min(...violations.map((v) => v.index)))).split('\n');
  return [{ file: rel, count: violations.length, kinds: [...new Set(violations.map((v) => v.kind))] }];
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inventory = JSON.parse(fs.readFileSync(args.inventory, 'utf8'));
  const found = new Map();
  for (const file of listSource(args.root)) {
    for (const row of findViolations(file, args.root)) found.set(row.file, row);
  }

  const violations = [];
  const allowed = new Map((inventory.sites || []).map((row) => [row.file, row]));

  for (const [file, row] of found.entries()) {
    const permitted = allowed.get(file);
    if (!permitted) {
      violations.push(`${file}: new unguarded spawn site (${row.kinds.join(', ')}) not in the allowlist`);
      continue;
    }
    for (const kind of row.kinds) {
      if (!permitted.kinds.includes(kind)) {
        violations.push(`${file}: new violation kind '${kind}' not covered by its allowlist entry`);
      }
    }
  }
  for (const [file, row] of allowed.entries()) {
    const abs = path.join(args.root, file);
    if (!fs.existsSync(abs)) {
      violations.push(`stale allowlist entry ${file} (file no longer exists)`);
      continue;
    }
    if (!found.has(file)) {
      violations.push(`stale allowlist entry ${file} (no matching violation found — helper migration complete? remove from allowlist)`);
    }
  }

  const count = (inventory.sites || []).length;
  if (found.size > count) violations.push(`spawn-guard debt increased to ${found.size} sites (was ${count})`);

  console.log(`spawn-guard debt: ${found.size} site(s)`);
  for (const violation of violations) console.log(violation);
  process.exit(violations.length ? 1 : 0);
}

main();
