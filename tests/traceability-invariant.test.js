'use strict';

// Rig's permanent one-to-one traceability invariant, checked on this repository
// and on mutated copies. This file is in the main gate: the invariant itself
// must always hold. The new programme's acceptance lane lives in
// `tests/ai-sdlc/` and is deliberately outside this glob.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const graph = require('../scripts/check-traceability');

const CONTRACT = path.join(__dirname, '..', 'wiki', 'specs', 'ai-sdlc-harness');

function mutatedCopy(mutate) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-trace-mutate-'));
  for (const name of fs.readdirSync(CONTRACT)) {
    if (name.endsWith('.md')) fs.copyFileSync(path.join(CONTRACT, name), path.join(dir, name));
  }
  mutate(dir);
  return graph.validate(graph.parse(dir));
}

test('the authored contract graph is complete', () => {
  const parsed = graph.parse(CONTRACT);
  assert.deepEqual(graph.validate(parsed), []);
  assert.equal(parsed.requirements.size, 84);
  assert.equal(parsed.journeys.size, 20);
  assert.equal(parsed.fixtures.size, 30);
  assert.equal(parsed.packages.size, 11);
});

test('every proving test named in the manifest exists and declares its PT id', () => {
  const manifest = fs.readFileSync(path.join(CONTRACT, '16-test-manifest.md'), 'utf8');
  const homes = [...new Set(manifest.match(/tests\/ai-sdlc\/[a-z-]+\.test\.js/g))];
  assert.ok(homes.length > 0);
  const declared = new Set();
  for (const home of homes) {
    const file = path.join(__dirname, '..', home);
    assert.ok(fs.existsSync(file), `planned proving-test home is missing: ${home}`);
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/test\('(PT-\d{3})/g)) declared.add(m[1]);
  }
  for (const r of graph.parse(CONTRACT).requirements.values()) {
    assert.ok(declared.has(`PT-${r.num}`), `no proving test declares PT-${r.num}`);
  }
});

test('a renumbered primary criterion breaks the one-to-one mapping', () => {
  const errors = mutatedCopy((dir) => {
    const file = path.join(dir, '15-gate1-contract.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('| AC-010:', '| AC-011:'));
  });
  assert.ok(errors.some((e) => /R010 primary criterion is AC-011/.test(e)), errors.join('\n'));
  assert.ok(errors.some((e) => /AC-011 is claimed as primary by both/.test(e)), errors.join('\n'));
});

test('a duplicated requirement row is rejected', () => {
  const errors = mutatedCopy((dir) => {
    const file = path.join(dir, '15-gate1-contract.md');
    const text = fs.readFileSync(file, 'utf8');
    const row = text.split('\n').find((line) => line.startsWith('| R040 '));
    fs.writeFileSync(file, text.replace(row, `${row}\n${row}`));
  });
  assert.ok(errors.some((e) => /duplicate ID R040/.test(e)), errors.join('\n'));
});

test('a deleted journey orphans the requirements that cite it', () => {
  const errors = mutatedCopy((dir) => {
    const file = path.join(dir, '17-customer-lifecycle.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').split('\n').filter((l) => !l.startsWith('| J07 |')).join('\n'));
  });
  assert.ok(errors.some((e) => /references unknown journey J07/.test(e)), errors.join('\n'));
});

test('a deleted work package leaves requirements unplanned', () => {
  const errors = mutatedCopy((dir) => {
    const file = path.join(dir, '19-work-packages-and-public-roadmap.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').split('\n').filter((l) => !l.startsWith('| **WP05')).join('\n'));
  });
  assert.ok(errors.some((e) => /R025 is in no work package/.test(e)), errors.join('\n'));
});

test('every default install ships the validator', () => {
  const source = path.join(__dirname, '..', 'rig', 'catalog', 'baseline', 'check-traceability.js');
  assert.ok(fs.existsSync(source), 'the validator must live in the installed baseline, not only in scripts/');
  const entry = require('../rig/lib/baseline-payload').entries
    .find((e) => e.from === 'catalog/baseline/check-traceability.js');
  assert.ok(entry, 'the validator must be in the mandatory baseline closure, not the optional runtime');
  assert.equal(entry.to, '.rig/bin/check-traceability.js');
  assert.equal(entry.mode, 0o755, 'the shipped check must be runnable');
});

test('the shipped standard and router point at the installed validator', () => {
  for (const rel of ['rig/corpus/standards/traceability.md', 'rig/corpus/routing.md']) {
    const text = fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
    assert.match(text, /\.rig\/bin\/check-traceability\.js/, `${rel} must name the installed path`);
  }
});
