'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const h = require('./helpers/path-b');

const STATE_KEYS = [
  'applied', 'approval', 'checks', 'inventory', 'last_error', 'phase',
  'proposal', 'release', 'revision', 'schema_version',
];

test('AT-PB-4 prepare creates the complete machine state and deterministic reports under .rig', async () => {
  await h.withRepo((target) => {
    const first = h.handle({ schema_version: 1, action: 'prepare', target });
    const statePath = path.join(target, '.rig/state.json');
    const stateText = fs.readFileSync(statePath, 'utf8');
    const state = JSON.parse(stateText);
    assert.deepEqual(Object.keys(state).sort(), STATE_KEYS);
    assert.equal(state.schema_version, 1);
    assert.equal(state.revision, 1);
    assert.equal(state.phase, 'prepared');
    assert.match(state.release.catalog_digest, /^[0-9a-f]{64}$/);
    assert.match(state.inventory.digest, /^[0-9a-f]{64}$/);
    assert.equal(state.proposal, null);
    assert.equal(state.approval, null);
    assert.deepEqual(state.applied, { proposal_digest: null, skills: [], grafts: [], owned_files: [] });
    assert.equal(state.checks, null);
    assert.equal(state.last_error, null);
    assert.equal(stateText, `${JSON.stringify(state, null, 2)}\n`);
    for (const rel of ['.rig/catalog.json', '.rig/adopted-config.md', '.rig/overlaps.md', '.rig/state.json']) {
      assert.match(first.artifacts[rel.split('/').at(-1).replace(/[-.]([a-z])/g, (_m, c) => c.toUpperCase())]?.sha256 ||
        Object.values(first.artifacts).find(({ path: artifact }) => artifact === rel)?.sha256 || '', /^[0-9a-f]{64}$/);
    }
    const reports = ['.rig/adopted-config.md', '.rig/overlaps.md'].map((rel) => fs.readFileSync(path.join(target, rel)));
    const second = h.handle({ schema_version: 1, action: 'prepare', target });
    assert.equal(second.revision, first.revision);
    assert.deepEqual(['.rig/adopted-config.md', '.rig/overlaps.md'].map((rel) => fs.readFileSync(path.join(target, rel))), reports);
  }, { install: true });
});

test('AT-PB-4 proposal state is canonical and binds the exact eight-section summary', async () => {
  await h.withRepo((target) => {
    const { proposed } = h.prepareAndPropose(target);
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(state.phase, 'proposed');
    assert.equal(state.proposal.digest, proposed.proposal_digest);
    assert.equal(state.proposal.summary_digest, h.sha256(fs.readFileSync(path.join(target, '.rig/onboarding-summary.md'))));
    const { digest, ...body } = state.proposal;
    assert.equal(digest, h.sha256(h.canonical(body)));
    assert.deepEqual(state.proposal.selected_skills, [...state.proposal.selected_skills].sort());
    assert.deepEqual(state.proposal.grafts, [...state.proposal.grafts].sort((a, b) =>
      a.path.localeCompare(b.path) || a.capability.localeCompare(b.capability)));
    assert.match(fs.readFileSync(path.join(target, '.rig/onboarding-summary.md'), 'utf8'), /^# Rig onboarding summary\n/);
  }, { install: true });
});

test('AT-PB-4 malformed summaries schemas paths and revisions are rejected without partial state', async () => {
  await h.withRepo((target) => {
    const prepared = h.handle({ schema_version: 1, action: 'prepare', target });
    const stateBefore = fs.readFileSync(path.join(target, '.rig/state.json'));
    const state = JSON.parse(stateBefore);
    const base = h.proposal(target, state);
    const badRequests = [
      { proposal: base, summary_markdown: h.summary().replace('## Reuse', '## Existing state') },
      { proposal: { ...base, unknown_key: true }, summary_markdown: h.summary() },
      { proposal: { ...base, grafts: [{ ...base.grafts[0], path: '../AGENTS.md' }] }, summary_markdown: h.summary() },
    ];
    for (const request of badRequests) {
      assert.throws(() => h.handle({
        schema_version: 1,
        action: 'propose',
        target,
        expected_revision: prepared.revision,
        ...request,
      }), /summary|heading|unknown|path|invalid|revision/i);
      assert.deepEqual(fs.readFileSync(path.join(target, '.rig/state.json')), stateBefore);
      assert.equal(fs.existsSync(path.join(target, '.rig/onboarding-summary.md')), false);
    }
    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'propose',
      target,
      expected_revision: prepared.revision + 1,
      proposal: base,
      summary_markdown: h.summary(),
    }), /revision|stale|compare/i);
  }, { install: true });
});

test('AT-PB-4 forbidden actions and transitions fail without advancing state', async () => {
  await h.withRepo((target) => {
    const prepared = h.handle({ schema_version: 1, action: 'prepare', target });
    const statePath = path.join(target, '.rig/state.json');
    const before = fs.readFileSync(statePath);
    for (const request of [
      { schema_version: 1, action: 'check', target, expected_revision: prepared.revision },
      { schema_version: 1, action: 'apply', target, expected_revision: prepared.revision, approval: h.approval('0'.repeat(64)) },
      { schema_version: 1, action: 'invented', target },
      { schema_version: 2, action: 'prepare', target },
    ]) {
      assert.throws(() => h.handle(request), /action|phase|transition|proposal|schema|version/i);
      assert.deepEqual(fs.readFileSync(statePath), before);
    }
  }, { install: true });
});

test('AT-PB-4 inventory or proposal changes advance revision and invalidate prior consent', async () => {
  await h.withRepo((target) => {
    const { proposed } = h.prepareAndPropose(target);
    const stored = h.readJson(path.join(target, '.rig/state.json')).proposal;
    const { digest: _digest, summary_digest: _summaryDigest, ...identicalProposal } = stored;
    const identical = h.handle({
      schema_version: 1,
      action: 'propose',
      target,
      expected_revision: proposed.revision,
      proposal: identicalProposal,
      summary_markdown: h.summary(),
    });
    assert.equal(identical.revision, proposed.revision);

    fs.appendFileSync(path.join(target, 'AGENTS.md'), 'Repository-owned change.\n');
    const preparedAgain = h.handle({ schema_version: 1, action: 'prepare', target });
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.ok(preparedAgain.revision > proposed.revision);
    assert.equal(state.phase, 'prepared');
    assert.equal(state.proposal, null);
    assert.equal(state.approval, null);
    assert.equal(state.checks, null);
    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: preparedAgain.revision,
      approval: h.approval(proposed.proposal_digest),
    }), /proposal|approval|stale|digest/i);
  }, { install: true });
});

test('AT-PB-4 applied Markdown projections are derived from and reconcile with state', async () => {
  await h.withRepo((target) => {
    const { checked } = h.applyAndCheck(target);
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(state.phase, 'checked');
    assert.equal(state.checks.status, 'pass');
    assert.equal(checked.phase, 'checked');
    const grafts = fs.readFileSync(path.join(target, '.rig/grafts.md'), 'utf8');
    assert.match(grafts, new RegExp(state.applied.proposal_digest));
    for (const row of state.applied.skills) {
      assert.match(grafts, new RegExp(`${row.skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*${row.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    }
    for (const row of state.applied.grafts) {
      assert.match(grafts, new RegExp(`${row.capability.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*${row.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    }
    assert.equal(h.sha256(fs.readFileSync(path.join(target, '.rig/grafts.md'))), checked.artifacts.grafts.sha256);
  }, { install: true });
});
