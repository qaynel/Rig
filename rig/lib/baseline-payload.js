'use strict';
// Mandatory installed baseline closure, shared by bootstrap and catalogue apply.
const MODULES = [
  'spawn-guarded', 'sandbox', 'path-safety', 'memory-guarded-exec',
  'check-runner', 'redaction', 'lint-grade', 'lint-discovery', 'task-consent',
  'evidence-artifacts', 'checks', 'git-dispatch', 'policy', 'policy-transaction',
  'policy-baseline', 'trust-root', 'enforcement', 'reports', 'inspect', 'catalog',
  'host-capabilities', 'skill-catalog', 'guard',
];
const entries = [
  ...MODULES.map(name => ({ from: `lib/${name}.js`, to: `.rig/lib/${name}.js`, mode: 0o644 })),
  { from: 'catalog/baseline/check.js', to: '.rig/bin/check.js', mode: 0o755 },
  { from: 'catalog/baseline/check-copies.js', to: '.rig/bin/check-copies.js', mode: 0o755 },
  { from: 'catalog/baseline/network-policy.json', to: '.rig/lib/network-policy-default.json', mode: 0o644 },
];
module.exports = { entries };
