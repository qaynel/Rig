'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F09 — one current code seam, a stale wiki claim, a pinned upstream file, an
// incompatible licence and one compatible source.
function designRepo() {
  const repo = tempRepo('rig-design-');
  write(repo, 'src/receipt.js', 'exports.write = (bytes) => bytes.length;\n');
  write(repo, 'wiki/topics/receipts.md', 'Receipts are stored in Redis.\n');
  write(repo, 'design.md', [
    '| Component | Source | Licence |',
    '|---|---|---|',
    '| receipt store | `src/receipt.js` | n/a |',
    '| merge strategy | https://github.com/acme/tool/blob/9f2c1ab/src/merge.ts | Apache-2.0 |',
    '| planner | https://github.com/acme/planner (main) | AGPL-3.0 |',
  ].join('\n'));
  return repo;
}

test('PT-020 reviewer can trace each proposed component to current code and signed behavior', () => {
  const repo = designRepo();
  const audit = capability('design-audit').review(repo, { design: 'design.md' });

  const store = audit.components.find((c) => c.name === 'receipt store');
  assert.equal(store.seam, 'src/receipt.js');
  assert.ok(store.data_flow, 'each touched capability states its data flow');
  assert.ok(store.failure_boundary, 'each touched capability states its failure boundary');
  assert.ok(
    audit.findings.some((f) => /receipts\.md/.test(f.where) && /stale|contradict/i.test(f.problem)),
    'a wiki claim contradicted by current code is a finding, not silently accepted',
  );
});

test('PT-021 an adopted component without an immutable source pin fails design review', () => {
  const repo = designRepo();
  const audit = capability('design-audit').review(repo, { design: 'design.md' });

  const pinned = audit.components.find((c) => c.name === 'merge strategy');
  assert.equal(pinned.pin.revision, '9f2c1ab');
  assert.equal(pinned.pin.path, 'src/merge.ts');
  assert.equal(pinned.blocked, false);

  const unpinned = audit.components.find((c) => c.name === 'planner');
  assert.equal(unpinned.blocked, true);
  assert.match(unpinned.reason, /revision|pin/i, 'a branch name is not an immutable pin');
});

test('PT-022 licence or bundled-runtime ambiguity blocks adoption', () => {
  const repo = designRepo();
  const audit = capability('design-audit').review(repo, { design: 'design.md' });

  const agpl = audit.components.find((c) => c.name === 'planner');
  assert.equal(agpl.blocked, true);
  assert.ok(audit.findings.some((f) => /AGPL/.test(f.problem)), 'an incompatible licence must be named');

  const compatible = audit.components.find((c) => c.name === 'merge strategy');
  assert.equal(compatible.licence, 'Apache-2.0');
  assert.ok(compatible.notice, 'an adopted Apache-2.0 component carries its notice obligation');
  assert.ok(Array.isArray(compatible.discard_scope), 'the discard scope says what is deliberately not taken');
});
