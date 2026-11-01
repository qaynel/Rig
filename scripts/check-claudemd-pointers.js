#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const policy = require('../rig/catalog/baseline/policy-checks');

function check(root = process.cwd()) {
  const text = fs.readFileSync(path.join(root, 'CLAUDE.md'), 'utf8');
  const pointer = policy.claudeMdPointersOnly(text);
  const diff = spawnSync('git', ['diff', '--name-only', 'HEAD'], { cwd: root, encoding: 'utf8' });
  const files = diff.status === 0 ? diff.stdout.split(/\r?\n/).filter(Boolean) : [];
  const changes = spawnSync('git', ['diff', '--no-ext-diff', 'HEAD'], { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  // wiki/ is ignored locally. Read its real dated trace files instead of pretending they appear in git diff.
  const traceDir = path.join(root, 'wiki/reasoning');
  const localTraces = [];
  try {
    const latestSourceEdit = Math.max(0, ...files.filter((f) => /^(rig\/corpus\/(rules|standards)\/|wiki\/specs\/)/.test(f)).map((f) => {
      try { return fs.statSync(path.join(root, f)).mtimeMs; } catch { return 0; }
    }));
    for (const name of fs.readdirSync(traceDir)) {
      const rel = `wiki/reasoning/${name}`;
      if (!/^wiki\/reasoning\/\d{4}-\d{2}-\d{2}-.+\.md$/.test(rel)) continue;
      const stat = fs.statSync(path.join(traceDir, name));
      if (stat.isFile() && stat.size > 0 && stat.mtimeMs >= latestSourceEdit) localTraces.push(rel);
    }
  } catch { /* an absent local wiki cannot provide an authoring-time trace */ }
  const trace = policy.decisionHasTrace(files, changes.status === 0 ? changes.stdout : '', localTraces);
  const errors = [
    ...pointer.offending.map((row) => `CLAUDE.md:${row.line}: ${row.reason}`),
    ...trace.missing,
  ];
  return { errors, files, localTraces };
}

if (require.main === module) {
  const { errors } = check();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log('CLAUDE.md pointers and decision traces: ok');
}
module.exports = { check };
