'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { audit } = require('../scripts/wiki-budget');

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
