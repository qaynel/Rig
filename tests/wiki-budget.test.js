'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { audit } = require('../scripts/wiki-budget');
const { check, updateWaivers } = require('../scripts/check-wiki-budget');

const DEFAULT_CONFIG = {
  limits: { hubBytes: 100, indexRows: 5, indexBytes: 200, entryPathBytes: 500 },
  mandatoryReads: ['wiki/agent-primer.md'],
  entryPath: ['wiki/agent-primer.md'],
};

// Builds a minimal wiki tree. `files` keys are repo-root-relative paths.
// `config` is merged over DEFAULT_CONFIG at the top level.
function fixture(files, config = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-budget-'));
  const tree = {
    'wiki/agent-primer.md': '# Primer\n',
    'wiki/topics/.keep.md': '',
    'wiki/index/.keep.md': '',
    ...files,
  };
  for (const [relative, body] of Object.entries(tree)) {
    const absolute = path.join(root, relative);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, body);
  }
  fs.mkdirSync(path.join(root, 'wiki', 'reasoning'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'wiki', 'budget.json'),
    JSON.stringify({ ...DEFAULT_CONFIG, ...config }, null, 2),
  );
  return root;
}

function rules(violations) {
  return violations.map((violation) => `${violation.rule}:${violation.subject}`).sort();
}

test('a trace with no summary is a violation and a trace with one is not', () => {
  const root = fixture({
    'wiki/reasoning/2026-01-01-bare.md': '---\ndate: 2026-01-01\nstatus: historical\nsummary:\n---\n# Bare\n',
    'wiki/reasoning/2026-01-02-full.md': '---\ndate: 2026-01-02\nstatus: historical\nsummary: A real one-liner.\n---\n# Full\n',
  });
  assert.deepEqual(rules(audit(root)), ['trace-summary:wiki/reasoning/2026-01-01-bare.md']);
});

test('a pre-contract trace with no frontmatter at all is a summary violation', () => {
  const root = fixture({ 'wiki/reasoning/2026-01-03-legacy.md': '# Legacy\n\nBody only.\n' });
  assert.deepEqual(rules(audit(root)), ['trace-summary:wiki/reasoning/2026-01-03-legacy.md']);
});

test('a hub over the byte cap is a violation and reports actual and limit', () => {
  const root = fixture({ 'wiki/topics/big.md': 'x'.repeat(101) });
  const [violation] = audit(root).filter((row) => row.rule === 'hub-bytes');
  assert.equal(violation.subject, 'wiki/topics/big.md');
  assert.equal(violation.actual, 101);
  assert.equal(violation.limit, 100);
});

test('an index over the row cap and over the byte cap reports both rules', () => {
  const root = fixture({ 'wiki/index/wide.md': `${'row of text\n'.repeat(20)}` });
  assert.deepEqual(
    rules(audit(root).filter((row) => row.rule.startsWith('index-'))),
    ['index-bytes:wiki/index/wide.md', 'index-rows:wiki/index/wide.md'],
  );
});

test('generated pages are exempt from the index caps', () => {
  const root = fixture({ 'wiki/index/reasoning.md': `${'row of text\n'.repeat(20)}` });
  assert.deepEqual(audit(root).filter((row) => row.rule.startsWith('index-')), []);
});

test('README.md is not audited as a hub or an index', () => {
  const root = fixture({
    'wiki/topics/README.md': 'x'.repeat(500),
    'wiki/index/README.md': 'x'.repeat(500),
  });
  assert.deepEqual(audit(root), []);
});

test('a mandated read that links a non-current trace is a violation', () => {
  const root = fixture({
    'wiki/agent-primer.md': 'See [old](reasoning/2026-01-01-old.md) and [now](reasoning/2026-01-02-now.md).\n',
    'wiki/reasoning/2026-01-01-old.md': '---\ndate: 2026-01-01\nstatus: historical\nsummary: Old.\n---\n# Old\n',
    'wiki/reasoning/2026-01-02-now.md': '---\ndate: 2026-01-02\nstatus: current\nsummary: Now.\n---\n# Now\n',
  });
  assert.deepEqual(
    rules(audit(root).filter((row) => row.rule === 'entry-path-current-only')),
    ['entry-path-current-only:wiki/agent-primer.md -> reasoning/2026-01-01-old.md'],
  );
});

test('a mandated read may link reasoning/README.md, which is not a trace', () => {
  const root = fixture({ 'wiki/agent-primer.md': 'See [how](reasoning/README.md).\n' });
  assert.deepEqual(audit(root).filter((row) => row.rule === 'entry-path-current-only'), []);
});

test('a hub deeper than the mandated reads may cite a historical trace', () => {
  const root = fixture({
    'wiki/topics/hub.md': 'See [old](../reasoning/2026-01-01-old.md).\n',
    'wiki/reasoning/2026-01-01-old.md': '---\ndate: 2026-01-01\nstatus: historical\nsummary: Old.\n---\n# Old\n',
  });
  assert.deepEqual(audit(root).filter((row) => row.rule === 'entry-path-current-only'), []);
});

test('the entry path is capped on total bytes across its pages', () => {
  const root = fixture(
    { 'wiki/agent-primer.md': 'a'.repeat(300), 'wiki/Home.md': 'b'.repeat(300) },
    { entryPath: ['wiki/agent-primer.md', 'wiki/Home.md'] },
  );
  const [violation] = audit(root).filter((row) => row.rule === 'entry-path-bytes');
  assert.equal(violation.actual, 600);
  assert.equal(violation.limit, 500);
});

test('an entry-path page that no longer exists fails instead of being skipped', () => {
  const root = fixture({}, { entryPath: ['wiki/agent-primer.md', 'wiki/index/gone.md'] });
  assert.deepEqual(
    rules(audit(root).filter((row) => row.rule === 'entry-path-missing')),
    ['entry-path-missing:wiki/index/gone.md'],
  );
});

test('a mandated read that no longer exists fails even when it is not in the entry path', () => {
  const root = fixture(
    {},
    { mandatoryReads: ['wiki/index/gone.md'], entryPath: ['wiki/agent-primer.md'] },
  );
  assert.deepEqual(
    rules(audit(root).filter((row) => row.rule === 'entry-path-missing')),
    ['entry-path-missing:wiki/index/gone.md'],
  );
});

test('a missing page in both lists produces exactly one violation, not two', () => {
  const root = fixture(
    {},
    { mandatoryReads: ['wiki/index/gone.md'], entryPath: ['wiki/agent-primer.md', 'wiki/index/gone.md'] },
  );
  const violations = audit(root).filter((row) => row.rule === 'entry-path-missing');
  assert.equal(violations.length, 1);
  assert.equal(violations[0].subject, 'wiki/index/gone.md');
});

function waive(root, waivers) {
  fs.writeFileSync(path.join(root, 'wiki', 'budget.waivers.json'), `${JSON.stringify(waivers, null, 2)}\n`);
  return root;
}

test('a waiver at the current value suppresses the violation', () => {
  const root = waive(fixture({ 'wiki/topics/big.md': 'x'.repeat(101) }), { 'hub-bytes:wiki/topics/big.md': 101 });
  assert.deepEqual(check(root), []);
});

test('growth past a waived value fails as waiver-exceeded', () => {
  const root = waive(fixture({ 'wiki/topics/big.md': 'x'.repeat(150) }), { 'hub-bytes:wiki/topics/big.md': 101 });
  const [violation] = check(root);
  assert.equal(violation.kind, 'waiver-exceeded');
  assert.equal(violation.actual, 150);
  assert.equal(violation.limit, 101);
});

test('a waiver for a file now within budget fails as stale', () => {
  const root = waive(fixture({ 'wiki/topics/small.md': 'x'.repeat(10) }), { 'hub-bytes:wiki/topics/small.md': 101 });
  const [violation] = check(root);
  assert.equal(violation.kind, 'stale-waiver');
  assert.equal(violation.subject, 'hub-bytes:wiki/topics/small.md');
});

test('a new violation with no waiver fails as over-budget', () => {
  const root = waive(fixture({ 'wiki/topics/big.md': 'x'.repeat(101) }), {});
  const [violation] = check(root);
  assert.equal(violation.kind, 'over-budget');
});

test('a non-numeric violation is suppressed by any waiver and cannot regress', () => {
  const root = waive(
    fixture({ 'wiki/reasoning/2026-01-01-bare.md': '---\ndate: 2026-01-01\nstatus: historical\nsummary:\n---\n# Bare\n' }),
    { 'trace-summary:wiki/reasoning/2026-01-01-bare.md': 'missing' },
  );
  assert.deepEqual(check(root), []);
});

test('a missing waiver file means no waivers, not a crash', () => {
  const root = fixture({ 'wiki/topics/big.md': 'x'.repeat(101) });
  assert.equal(check(root).length, 1);
});

test('a generated page in the entry path is exempt from the byte sum but still checked for existence', () => {
  const root = fixture(
    { 'wiki/agent-primer.md': 'a'.repeat(300), 'wiki/status.md': 'b'.repeat(1000) },
    { entryPath: ['wiki/agent-primer.md', 'wiki/status.md'] },
  );
  assert.deepEqual(audit(root).filter((row) => row.rule === 'entry-path-bytes'), []);
});

test('a missing generated page in the entry path still fails as entry-path-missing', () => {
  const root = fixture(
    { 'wiki/agent-primer.md': 'a'.repeat(300) },
    { entryPath: ['wiki/agent-primer.md', 'wiki/status.md'] },
  );
  assert.deepEqual(
    rules(audit(root).filter((row) => row.rule === 'entry-path-missing')),
    ['entry-path-missing:wiki/status.md'],
  );
});

test('a numeric violation waived with a non-numeric value cannot grow past it silently', () => {
  const root = waive(fixture({ 'wiki/topics/big.md': 'x'.repeat(150) }), { 'hub-bytes:wiki/topics/big.md': 'waived' });
  const [violation] = check(root);
  assert.equal(violation.kind, 'waiver-exceeded');
  assert.equal(violation.actual, 150);
  assert.equal(violation.limit, 'waived');
});

test('a waiver recorded against a historical link fails when the link regresses further to missing', () => {
  const root = waive(
    fixture({ 'wiki/agent-primer.md': 'See [old](reasoning/2026-01-01-old.md).\n' }),
    { 'entry-path-current-only:wiki/agent-primer.md -> reasoning/2026-01-01-old.md': 'historical' },
  );
  const [violation] = check(root);
  assert.equal(violation.kind, 'waiver-exceeded');
  assert.equal(violation.actual, 'missing');
});

test('updateWaivers on a fresh fixture round-trips to a green check', () => {
  const root = fixture({ 'wiki/topics/big.md': 'x'.repeat(101) });
  updateWaivers(root);
  assert.deepEqual(check(root), []);
});

test('a second updateWaivers on an existing ledger refuses without --force', () => {
  const root = fixture({ 'wiki/topics/big.md': 'x'.repeat(101) });
  updateWaivers(root);
  assert.throws(() => updateWaivers(root), /--force/);
});

test('the committed wiki is within its budgets and waivers', () => {
  const failures = check(path.join(__dirname, '..'));
  assert.deepEqual(
    failures.map((failure) => `${failure.kind} ${failure.rule} ${failure.subject}`),
    [],
  );
});
