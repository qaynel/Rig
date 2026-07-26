#!/usr/bin/env node
// Target-local exact-copy checker driven by .rig/sync-map.json (impl-design §7.3).
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function main() {
  const root = path.resolve(__dirname, '..', '..');
  const mapPath = path.join(root, '.rig', 'sync-map.json');
  if (!fs.existsSync(mapPath)) {
    process.exit(0);
  }
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  let failed = false;
  for (const group of map.groups || []) {
    const canonical = path.resolve(root, group.canonical);
    if (!canonical.startsWith(root + path.sep) && canonical !== root) {
      console.error(`out-of-root canonical path: ${group.canonical}`);
      failed = true;
      continue;
    }
    if (!fs.existsSync(canonical)) {
      console.error(`missing canonical: ${group.canonical}`);
      failed = true;
      continue;
    }
    const canonBytes = fs.readFileSync(canonical);
    for (const copyRel of group.copies || []) {
      const copy = path.resolve(root, copyRel);
      if (!copy.startsWith(root + path.sep) && copy !== root) {
        console.error(`out-of-root copy path: ${copyRel}`);
        failed = true;
        continue;
      }
      if (fs.lstatSync(copy).isSymbolicLink()) {
        const real = fs.realpathSync(copy);
        if (!real.startsWith(root + path.sep)) {
          console.error(`escaping symlink: ${copyRel}`);
          failed = true;
          continue;
        }
      }
      if (!fs.existsSync(copy)) {
        console.error(`missing copy: ${copyRel}`);
        failed = true;
        continue;
      }
      const copyBytes = fs.readFileSync(copy);
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
