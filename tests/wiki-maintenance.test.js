'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { traces } = require('../scripts/build-wiki-index');
const { report, currentTraces, untaggedTraces, staleHubs } = require('../scripts/wiki-maintenance');

const repoRoot = path.join(__dirname, '..');

function fixture(traceFiles, hubFiles = {}, ticketFiles = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-maint-'));
  fs.mkdirSync(path.join(root, 'wiki', 'reasoning'), { recursive: true });
  fs.mkdirSync(path.join(root, 'wiki', 'topics'), { recursive: true });
  fs.mkdirSync(path.join(root, 'wiki', 'tickets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'wiki', 'index'), { recursive: true });
  fs.writeFileSync(path.join(root, 'wiki', 'reasoning', 'README.md'), '# Reasoning traces\n');
  fs.writeFileSync(path.join(root, 'wiki', 'Home.md'), '# Rig\n');
  fs.writeFileSync(path.join(root, 'CLAUDE.md'), 'read the wiki\n');
  fs.writeFileSync(path.join(root, 'package.json'), '{"scripts":{}}\n');
  for (const [name, body] of Object.entries(traceFiles)) {
    fs.writeFileSync(path.join(root, 'wiki', 'reasoning', name), body);
  }
  for (const [name, body] of Object.entries(hubFiles)) {
    fs.writeFileSync(path.join(root, 'wiki', 'topics', name), body);
  }
  for (const [name, body] of Object.entries(ticketFiles)) {
    fs.writeFileSync(path.join(root, 'wiki', 'tickets', name), body);
  }
  return root;
}

test('currentTraces flags close-out traces as shipped and leaves open work', () => {
  const root = fixture({
    '2026-09-01-feature-close-out.md':
      '---\ndate: 2026-09-01\nsource: agent\ntopics: safety\ndecisions: D1\nstatus: current\nsupersedes:\ntags:\nsummary: Feature X close-out.\n---\n# Done\nRIG-1 has shipped.\n',
    '2026-09-01-feature-wip.md':
      '---\ndate: 2026-09-01\nsource: agent\ntopics: safety\ndecisions:\nstatus: current\nsupersedes:\ntags:\nsummary: Feature Y underway.\n---\n# In progress\nStill open.\n',
  });
  const rows = currentTraces(root, traces(root));
  const byName = Object.fromEntries(rows.map((r) => [path.basename(r.file), r.shipped]));
  assert.equal(byName['2026-09-01-feature-close-out.md'], true);
  assert.equal(byName['2026-09-01-feature-wip.md'], false);
});

test('untaggedTraces reports traces missing status or topics frontmatter', () => {
  const root = fixture({
    '2026-08-01-old-untagged.md': '---\ndate: 2026-08-01\nsource: agent\n---\n# Old\n',
    '2026-09-02-tagged.md':
      '---\ndate: 2026-09-02\nsource: agent\ntopics: safety\ndecisions:\nstatus: historical\nsupersedes:\ntags:\nsummary:\n---\n# New\n',
  });
  const rows = untaggedTraces(root);
  assert.equal(rows.length, 1);
  assert.equal(path.basename(rows[0].file), '2026-08-01-old-untagged.md');
  assert.deepEqual(rows[0].missing.sort(), ['status', 'topics']);
});

test('staleHubs flags a hub older than its newest cited trace', () => {
  const root = fixture(
    {
      '2026-09-02-x.md':
        '---\ndate: 2026-09-02\nsource: agent\ntopics: onboarding-flow\ndecisions:\nstatus: historical\nsupersedes:\ntags:\nsummary:\n---\n# X\n',
    },
    { 'onboarding-flow.md': '# Onboarding flow\n' },
  );
  const dateOf = (rel) => ({
    'wiki/topics/onboarding-flow.md': '2026-09-01T00:00:00Z',
    'wiki/reasoning/2026-09-02-x.md': '2026-09-02T00:00:00Z',
  }[rel] || '');
  const stale = staleHubs(root, traces(root), dateOf);
  assert.equal(stale.length, 1);
  assert.equal(stale[0].slug, 'onboarding-flow');
});

test('report returns one entry per step 0..7 with a state', () => {
  const rows = report(repoRoot, traces(repoRoot));
  assert.deepEqual(rows.map((r) => r.step), [0, 1, 2, 3, 4, 5, 6, 7]);
  for (const row of rows) {
    assert.ok(['DONE', 'PENDING', 'RECURRING'].includes(row.state), `step ${row.step} state`);
  }
});

const { lintFindings } = require('../scripts/wiki-maintenance');

test('lintFindings fails on a stale hub', () => {
  const root = fixture(
    {
      '2026-09-03-y.md':
        '---\ndate: 2026-09-03\nsource: agent\ntopics: graft-mechanics\ndecisions:\nstatus: historical\nsupersedes:\ntags:\nsummary:\n---\n# Y\n',
    },
    { 'graft-mechanics.md': '# Graft mechanics\n' },
  );
  const dateOf = (rel) => ({
    'wiki/topics/graft-mechanics.md': '2026-09-01T00:00:00Z',
    'wiki/reasoning/2026-09-03-y.md': '2026-09-03T00:00:00Z',
  }[rel] || '');
  const failures = lintFindings(root, traces(root), dateOf);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /graft-mechanics/);
});

test('lintFindings fails on a post-floor trace missing frontmatter but ignores older ones', () => {
  const root = fixture({
    '2020-01-01-ancient.md': '---\ndate: 2020-01-01\nsource: agent\n---\n# Ancient\n',
    '2999-01-01-future-untagged.md': '---\ndate: 2999-01-01\nsource: agent\n---\n# Future\n',
  });
  const dateOf = () => '';
  const failures = lintFindings(root, traces(root), dateOf);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /2999-01-01-future-untagged\.md/);
});

test('lintFindings is clean when hubs are fresh and traces are tagged', () => {
  const root = fixture({
    '2026-09-02-ok.md':
      '---\ndate: 2026-09-02\nsource: agent\ntopics: safety\ndecisions:\nstatus: historical\nsupersedes:\ntags:\nsummary:\n---\n# OK\n',
  });
  assert.deepEqual(lintFindings(root, traces(root), () => ''), []);
});
