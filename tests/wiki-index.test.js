'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { render } = require('../scripts/build-wiki-index');
const repositoryRoot = path.join(__dirname, '..');

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-index-'));
  fs.mkdirSync(path.join(root, 'wiki', 'reasoning'), { recursive: true });
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(root, 'wiki', 'reasoning', name), body);
  }
  return root;
}

test('wiki summary shows current traces while retaining superseded traces in the index', () => {
  const root = fixture({
    '2026-08-29-old.md': '---\ndate: 2026-08-29\nsource: agent\ntopics: safety\ndecisions: D1\nstatus: superseded\nsupersedes: D2\ntags: trap\n---\n# Old\n',
    '2026-08-30-current.md': '---\ndate: 2026-08-30\nsource: intent owner\ntopics: safety\ndecisions: D2\nstatus: current\nsupersedes: D1\ntags: interdependency\nsummary: Current choice.\n---\n# Current\n',
  });
  const output = render(root);
  assert.match(output['wiki/status.md'], /Current choice\./);
  assert.doesNotMatch(output['wiki/status.md'], /2026-08-29-old/);
  assert.match(output['wiki/index/reasoning.md'], /2026-08-29-old/);
  assert.match(output['wiki/index/reasoning.md'], /superseded → D2/);
  assert.match(output['wiki/index/reasoning.md'], /current → D1/);
});

test('wiki summary rejects traces with neither a frontmatter nor filename date', () => {
  const root = fixture({
    'bad.md': '---\nsource: agent\ntopics: safety\n---\n# Bad\n',
  });
  assert.throws(() => render(root), /missing a date and dated filename/);
});

test('committed generated wiki files match immutable trace frontmatter', () => {
  for (const [relative, expected] of Object.entries(render(repositoryRoot))) {
    assert.equal(fs.readFileSync(path.join(repositoryRoot, relative), 'utf8'), expected, relative);
  }
});
