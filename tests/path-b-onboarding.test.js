'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const h = require('./helpers/path-b');

function stripGrafts(body) {
  return body.replace(/<!-- rig:graft capability="[^"]+" version="1" begin -->\r?\n[\s\S]*?<!-- rig:graft capability="[^"]+" end -->\r?\n?/g, '');
}

test('AT-PB-5 prepare supplies bounded context without making semantic choices or repo writes', async () => {
  await h.withRepo((target) => {
    const before = fs.readFileSync(path.join(target, 'AGENTS.md'));
    const response = h.handle({ schema_version: 1, action: 'prepare', target });
    assert.equal(response.schema_version, 1);
    assert.equal(response.action, 'prepare');
    assert.equal(response.phase, 'prepared');
    assert.equal(response.next_action, 'inspect-repository');
    assert.match(response.context.playbook, /Understand[\s\S]*Discover[\s\S]*Catalogue-read[\s\S]*Delta[\s\S]*Propose[\s\S]*Summarise[\s\S]*Apply on approval/);
    assert.equal(response.context.catalog.catalog_kind, 'skill-shelf');
    assert.match(response.context.adopted_config, /structural inventory/i);
    assert.match(response.context.overlaps, /hints/i);
    assert.equal(response.context.catalog.skills.some(({ selected, disposition }) => selected || disposition), false);
    assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), before);
    assert.equal(fs.existsSync(path.join(target, '.rig/onboarding-summary.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/grafts.md')), false);
  }, { install: true });
});

test('AT-PB-5 propose records agent judgment but cannot mutate repository-owned targets', async () => {
  await h.withRepo((target) => {
    const before = fs.readFileSync(path.join(target, 'AGENTS.md'));
    const { proposed } = h.prepareAndPropose(target);
    assert.equal(proposed.phase, 'proposed');
    assert.equal(proposed.next_action, 'obtain-approval');
    assert.match(proposed.proposal_digest, /^[0-9a-f]{64}$/);
    assert.deepEqual(proposed.critical_decisions, []);
    assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), before);
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/rig-qa')), false);
    assert.equal(h.walk(path.join(target, '.rig')).some((file) => /approval/i.test(path.basename(file))), false);
  }, { install: true });
});

test('AT-PB-5 unresolved consequential decisions and self-made approval both block apply', async () => {
  await h.withRepo((target) => {
    const prepared = h.handle({ schema_version: 1, action: 'prepare', target });
    const state = h.readJson(path.join(target, '.rig/state.json'));
    const unresolved = h.proposal(target, state, {
      critical_decisions: [{
        id: 'replace-existing-review',
        question: 'Replace the repository review authority?',
        consequence: 'Existing review behavior would lose authority.',
        recommendation: 'Preserve it and graft only the missing guarantee.',
        status: 'unresolved',
        resolution: null,
        authority: 'user',
      }],
    });
    const proposed = h.handle({
      schema_version: 1,
      action: 'propose',
      target,
      expected_revision: prepared.revision,
      proposal: unresolved,
      summary_markdown: h.summary({ 'Important decisions': 'The replacement decision is unresolved.' }),
    });
    assert.equal(proposed.phase, 'needs-decision');
    assert.equal(proposed.next_action, 'resolve-critical-decisions');
    assert.equal(proposed.critical_decisions.length, 1);
    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: proposed.revision,
      approval: h.approval(proposed.proposal_digest),
    }), /decision|unresolved|approval/i);
    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: proposed.revision,
      approval: { method: 'host-native', verified: true },
    }), /approval|receipt|digest/i);
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/rig-qa')), false);
  }, { install: true });
});

test('AT-PB-5 approval binds the exact proposal and summary and never carries to a change', async () => {
  await h.withRepo((target) => {
    const { proposed } = h.prepareAndPropose(target);
    const oldApproval = h.approval(proposed.proposal_digest);
    const state = h.readJson(path.join(target, '.rig/state.json'));
    const { digest: _digest, summary_digest: _summaryDigest, ...proposalBody } = state.proposal;
    const changed = h.handle({
      schema_version: 1,
      action: 'propose',
      target,
      expected_revision: proposed.revision,
      proposal: proposalBody,
      summary_markdown: h.summary({ 'Expected user experience': 'A materially different reviewed outcome.' }),
    });
    assert.notEqual(changed.proposal_digest, proposed.proposal_digest);
    assert.throws(() => h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: changed.revision,
      approval: oldApproval,
    }), /approval|digest|stale|summary/i);
  }, { install: true });
});

test('AT-PB-5 approved apply selectively projects one skill and writes only a marked graft', async () => {
  await h.withRepo((target) => {
    const before = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
    const { applied, checked } = h.applyAndCheck(target);
    assert.equal(applied.phase, 'applied');
    assert.equal(applied.next_action, 'check');
    assert.equal(checked.phase, 'checked');
    assert.equal(checked.next_action, 'complete');
    assert.deepEqual(checked.hard_failures, []);
    const after = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
    assert.equal(stripGrafts(after), before);
    assert.match(after, /<!-- rig:graft capability="testing\.web-quality-assurance" version="1" begin -->/);
    assert.match(after, /<!-- rig:graft capability="testing\.web-quality-assurance" end -->/);
    const projected = path.join(target, '.agents/skills/rig-qa/SKILL.md');
    assert.equal(fs.existsSync(projected), true);
    assert.match(fs.readFileSync(projected, 'utf8'), /^name: rig-qa$/m);
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/rig-qa-only')), false);
    assert.equal(h.readJson(path.join(target, '.rig/state.json')).applied.skills.length, 1);
  }, { install: true });
});

test('AT-PB-5 identical approved apply is idempotent and resumes the same proposal', async () => {
  await h.withRepo((target) => {
    const { proposed } = h.applyAndCheck(target);
    const before = new Map(h.walk(target).map((file) => [path.relative(target, file), h.sha256(fs.readFileSync(file))]));
    const revision = h.readJson(path.join(target, '.rig/state.json')).revision;
    const repeated = h.handle({
      schema_version: 1,
      action: 'apply',
      target,
      expected_revision: revision,
      approval: h.approval(proposed.proposal_digest),
    });
    assert.ok(['applied', 'checked'].includes(repeated.phase));
    const after = new Map(h.walk(target).map((file) => [path.relative(target, file), h.sha256(fs.readFileSync(file))]));
    assert.deepEqual(after, before);
    assert.equal((fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8').match(/rig:graft capability="testing\.web-quality-assurance" version=/g) || []).length, 1);
  }, { install: true });
});

test('AT-PB-5 installed CLI is a JSON adapter over the same onboarding domain', async () => {
  await h.withRepo((target) => {
    const request = { schema_version: 1, action: 'prepare', target };
    const requestPath = path.join(target, 'request.json');
    h.writeJson(requestPath, request);
    const rig = path.join(target, '.rig/bin/rig');
    const cli = spawnSync(rig, ['onboarding', '--input', requestPath], { encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr || cli.stdout);
    const cliResponse = JSON.parse(cli.stdout);
    const directResponse = h.handle(request);
    assert.deepEqual(cliResponse, directResponse);
    assert.equal(cliResponse.action, 'prepare');
    assert.equal(cliResponse.next_action, 'inspect-repository');
  }, { install: true });
});
