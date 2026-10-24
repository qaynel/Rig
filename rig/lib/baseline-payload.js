'use strict';
// Mandatory installed baseline closure, shared by bootstrap and catalogue apply.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, '..');
const MODULES = [
  'spawn-guarded', 'sandbox', 'path-safety', 'memory-guarded-exec',
  'check-runner', 'redaction', 'lint-grade', 'lint-discovery', 'task-consent',
  'resolve', 'service-catalogue', 'journal-records',
  'evidence-artifacts', 'checks', 'git-dispatch', 'policy', 'policy-transaction',
  'policy-baseline', 'trust-root', 'enforcement', 'reports', 'inspect', 'catalog',
  'host-capabilities', 'skill-catalog', 'guard',
];
const entries = [
  ...MODULES.map(name => ({ from: `lib/${name}.js`, to: `.rig/lib/${name}.js`, mode: 0o644 })),
  { from: 'catalog/baseline/check.js', to: '.rig/bin/check.js', mode: 0o755 },
  { from: 'catalog/baseline/check-copies.js', to: '.rig/bin/check-copies.js', mode: 0o755 },
  { from: 'catalog/baseline/check-traceability.js', to: '.rig/bin/check-traceability.js', mode: 0o755 },
  { from: 'catalog/baseline/network-policy.json', to: '.rig/lib/network-policy-default.json', mode: 0o644 },
];

// The complete capability kit is mandatory data for the host agent to inspect
// and graft. Keep its canonical layout so relative dependencies and model paths
// work. Staging a kit selects no services and activates no optional runtime.
function kitTree(from, to) {
  for (const name of fs.readdirSync(path.join(ROOT, from)).sort()) {
    if (['node_modules', '__pycache__', '.DS_Store', 'TODOS-format.md', 'upstream'].includes(name)
      || name.startsWith('._') || name.endsWith('.tmpl')) continue;
    const src = `${from}/${name}`;
    const dst = `${to}/${name}`;
    const stat = fs.statSync(path.join(ROOT, src));
    if (stat.isDirectory()) kitTree(src, dst);
    else if (stat.isFile()) entries.push({ from: src, to: dst, mode: stat.mode & 0o111 ? 0o755 : 0o644 });
    else throw new Error(`rig: kit source is not a regular file: ${src}`);
  }
}
// The optional active runtime is deliberately a smaller source tree. Its
// catalogue apply path reuses the complete kit already staged beside it.
const kitFrom = fs.existsSync(path.join(ROOT, 'catalog', 'plumbing')) ? '' : '../../kit/rig/';
for (const rel of ['lib', 'corpus', 'catalog/baseline', 'catalog/plumbing']) kitTree(`${kitFrom}${rel}`, `.rig/kit/rig/${rel}`);
kitTree(`${kitFrom}../skills/rig`, '.rig/kit/skills/rig');
for (const rel of ['manifest.json', ...['catalog.json', 'families.json', 'migrations.json', 'LICENSE.upstream', 'UPSTREAM.md', 'README.md']
  .map((name) => `catalog/skills/${name}`)]) {
  entries.push({ from: `${kitFrom}${rel}`, to: `.rig/kit/rig/${rel}`, mode: 0o644 });
}
// Legacy source archives omitted root metadata. They remain installable; new
// public archives carry it so the kit's migration code can resolve its version.
for (const name of ['package.json', 'LICENSE']) {
  if (fs.existsSync(path.join(ROOT, `${kitFrom}../${name}`))) {
    entries.push({ from: `${kitFrom}../${name}`, to: `.rig/kit/${name}`, mode: 0o644 });
  }
}
module.exports = { entries };
