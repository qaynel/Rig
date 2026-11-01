#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function checkRetirements(root = process.cwd(), { release = false } = {}) {
  root = path.resolve(root);
  const ledger = JSON.parse(fs.readFileSync(path.join(root, 'rig/retirements.json'), 'utf8'));
  const errors = [];
  const tracked = spawnSync('git', ['-C', root, 'ls-files', '-z'], { encoding: 'utf8' }).stdout.split('\0').filter(Boolean);
  let manifest = null;
  try { manifest = JSON.parse(fs.readFileSync(path.join(root, 'rig/manifest.json'), 'utf8')); } catch { /* reported for release */ }
  for (const row of (ledger.rows || []).filter((item) => item.closed)) for (const item of row.paths || []) {
    if (typeof item !== 'string' || !item || path.isAbsolute(item) || item.split(/[\\/]/).includes('..')) continue;
    if ((manifest?.payload || []).some((entry) => entry.from === item || entry.from?.startsWith(`${item}/`))) errors.push(`closed-path-shipped: ${item} remains in rig/manifest.json`);
    for (const file of tracked.filter((name) => !name.startsWith('wiki/') && !name.startsWith('tests/rebuild/') && name !== 'rig/retirements.json')) {
      try { if (fs.readFileSync(path.join(root, file), 'utf8').includes(item)) errors.push(`closed-path-referenced: ${file} references ${item}`); }
      catch { /* Ignore non-text tracked files. */ }
    }
  }
  for (const row of ledger.rows || []) {
    if (!row.deleteIn) errors.push(`overdue: row has no deleteIn: ${(row.paths || []).join(', ')}`);
    for (const item of row.paths || []) {
      if (typeof item !== 'string' || !item || path.isAbsolute(item) || item.split(/[\\/]/).includes('..')) {
        errors.push(`invalid-path: retirement row contains an unsafe path: ${item}`);
        continue;
      }
      if ((ledger.merged || []).includes(row.deleteIn)) {
        if (fs.existsSync(path.join(root, item))) errors.push(`overdue: ${item} remains after ${row.deleteIn} merged`);
      }
    }
    if (release && row.closed && row.wikiPhrases) for (const file of tracked.filter((name) => name.startsWith('wiki/') && !name.startsWith('wiki/archive/') && !name.startsWith('wiki/reasoning/'))) {
      const body = fs.readFileSync(path.join(root, file), 'utf8');
      for (const phrase of row.wikiPhrases) if (body.includes(phrase)) errors.push(`stale-wiki: ${file} still says ${phrase}`);
    }
  }
  if (release) {
    if (!manifest) errors.push('unreachable: rig/manifest.json is missing or invalid');
    for (const row of ledger.rows || []) if (!row.closed && (!row.laterRelease || !row.ownerReason)) errors.push(`open-row: ${row.deleteIn || 'unscheduled'} needs laterRelease and ownerReason`);
    if (manifest) {
      const reached = new Set();
      const queue = [];
      const add = (rel) => {
        if (!rel || typeof rel !== 'string' || path.isAbsolute(rel) || rel.split(/[\\/]/).includes('..')) return;
        const absolute = path.join(root, rel);
        if (!fs.existsSync(absolute)) return;
        if (fs.statSync(absolute).isDirectory()) {
          for (const file of tracked) if (file.startsWith(`${rel.replace(/\/$/, '')}/`)) reached.add(file);
        } else if (!reached.has(rel)) { reached.add(rel); queue.push(rel); }
      };
      add(manifest.corpus);
      for (const entry of manifest.payload || []) add(entry.from);
      for (const rel of ['rig/bootstrap.sh', 'rig/materialize.js', 'rig/bin', 'rig/manifest.json', 'rig/retirements.json', 'rig/raw-registry-access.json', 'rig/spawn-guard-allowlist.json']) add(rel);
      while (queue.length) {
        const file = queue.pop();
        if (!/\.(?:c?js|mjs)$/.test(file)) continue;
        let source; try { source = fs.readFileSync(path.join(root, file), 'utf8'); } catch { continue; }
        for (const match of source.matchAll(/require\(['"](\.[^'"]+)['"]\)|from\s+['"](\.[^'"]+)['"]/g)) {
          const request = match[1] || match[2]; const base = path.posix.normalize(path.posix.join(path.posix.dirname(file), request));
          const candidate = [base, `${base}.js`, `${base}.json`, `${base}.mjs`, `${base}/index.js`].find((name) => fs.existsSync(path.join(root, name)) && fs.statSync(path.join(root, name)).isFile());
          if (candidate && !reached.has(candidate)) { reached.add(candidate); queue.push(candidate); }
        }
      }
      for (const file of tracked.filter((name) => name.startsWith('rig/'))) if (!reached.has(file)) errors.push(`unreachable: ${file} is tracked under rig/ but no payload or code reaches it`);
    }
  }
  return { errors };
}

if (require.main === module) {
  const args = process.argv.slice(2); const rootIndex = args.indexOf('--root');
  const root = path.resolve(rootIndex >= 0 && args[rootIndex + 1] ? args[rootIndex + 1] : process.cwd());
  const result = checkRetirements(root, { release: args.includes('--release') });
  if (result.errors.length) { console.error(result.errors.join('\n')); process.exit(1); }
  console.log('retirement ledger: ok');
}
module.exports = { checkRetirements };
