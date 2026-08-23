#!/usr/bin/env node
// Target-local exact-copy checker driven by .rig/sync-map.json (impl-design §7.3).
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function inspectInside(root, rel, kind) {
  const abs = path.resolve(root, rel);
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    return { ok: false, reason: `out-of-root ${kind} path: ${rel}` };
  }
  let stat;
  try {
    stat = fs.lstatSync(abs);
  } catch {
    return { ok: false, reason: `missing ${kind}: ${rel}` };
  }
  if (stat.isSymbolicLink()) {
    const real = fs.realpathSync(abs);
    if (real !== root && !real.startsWith(root + path.sep)) {
      return { ok: false, reason: `escaping symlink: ${rel}` };
    }
  }
  return { ok: true, abs };
}

function main() {
  const root = path.resolve(__dirname, '..', '..');
  const mapPath = path.join(root, '.rig', 'sync-map.json');
  if (!fs.existsSync(mapPath)) {
    process.exit(0);
  }
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  let failed = false;
  for (const group of map.groups || []) {
    const canonical = inspectInside(root, group.canonical, 'canonical');
    if (!canonical.ok) {
      console.error(canonical.reason);
      failed = true;
      continue;
    }
    const canonBytes = fs.readFileSync(canonical.abs);
    for (const copyRel of group.copies || []) {
      const copy = inspectInside(root, copyRel, 'copy');
      if (!copy.ok) {
        console.error(copy.reason);
        failed = true;
        continue;
      }
      const copyBytes = fs.readFileSync(copy.abs);
      if (!canonBytes.equals(copyBytes)) {
        console.error(`byte drift: ${copyRel} != ${group.canonical}`);
        failed = true;
      }
    }
  }
  process.exit(failed ? 1 : 0);
}

if (require.main === module) main();
module.exports = { main };
