'use strict';

const test = require('node:test');
const { assert, fs, path, capability, tempRepo, write, read } = require('./_harness');

// F02 — existing repository with a working review skill and local instructions.
function existingProject() {
  const repo = tempRepo();
  write(repo, '.claude/skills/review/SKILL.md', '---\nname: review\n---\nHouse review skill.\n');
  write(repo, 'CLAUDE.md', '# House rules\n\nRun `make check` before pushing.\n');
  write(repo, 'docs/CONTRIBUTING.md', 'Conventional commits. Tests live in `spec/`.\n');
  return repo;
}

test('PT-002 proposal cites observed conventions', () => {
  const repo = existingProject();
  const onboarding = capability('onboarding');

  const proposal = onboarding.propose(repo);

  assert.ok(Array.isArray(proposal.observations) && proposal.observations.length > 0, 'the proposal must record what it observed');
  const cited = proposal.observations.map((o) => o.source);
  assert.ok(cited.includes('CLAUDE.md'), 'existing house instructions must be cited');
  assert.ok(cited.includes('docs/CONTRIBUTING.md'), 'existing contributor conventions must be cited');
  for (const change of proposal.changes) {
    assert.ok(change.because, `proposed change ${change.path} must name the observation that justifies it`);
  }
});

test('PT-003 an installed review skill yields one effective review owner', () => {
  const repo = existingProject();
  const onboarding = capability('onboarding');

  const proposal = onboarding.propose(repo);
  onboarding.apply(repo, proposal, { approved_digest: proposal.digest });

  const owners = onboarding.capabilityOwners(repo).filter((o) => o.capability === 'code-review');
  assert.equal(owners.length, 1, 'exactly one effective review owner may exist after onboarding');
  assert.equal(owners[0].source, '.claude/skills/review/SKILL.md', 'the repository’s own skill stays the owner');
  const overlap = proposal.overlaps.find((o) => o.capability === 'code-review');
  assert.ok(overlap, 'the overlap must be reported rather than silently resolved');
});

test('PT-004 changed proposal bytes cannot be applied', () => {
  const repo = existingProject();
  const onboarding = capability('onboarding');

  const proposal = onboarding.propose(repo);
  const approved = proposal.digest;
  const tampered = { ...proposal, changes: [...proposal.changes, { path: '.rig/extra.md', because: 'injected' }] };

  assert.throws(() => onboarding.apply(repo, tampered, { approved_digest: approved }), /digest|approved|changed/i);
  assert.equal(fs.existsSync(path.join(repo, '.rig', 'extra.md')), false, 'no byte from an unapproved proposal may land');
});

// F03 — repository with an absent optional tool and an unsupported host hook.
test('PT-005 no unavailable integration is marked complete', () => {
  const repo = tempRepo();
  write(repo, '.rig/host-capabilities.json', { hooks: { 'pre-commit': 'unsupported' }, tools: { ripgrep: 'absent' } });
  const onboarding = capability('onboarding');

  const report = onboarding.discoverServices(repo);

  for (const entry of report.services) {
    if (entry.available) continue;
    assert.notEqual(entry.status, 'complete', `${entry.name} is unavailable and must not be reported complete`);
    assert.ok(entry.remedy, `${entry.name} must carry setup guidance`);
  }
  const hook = report.services.find((s) => s.name === 'pre-commit');
  assert.equal(hook.status, 'unsupported', 'a vendor surface that does not exist is unsupported, never emitted');
  const tool = report.services.find((s) => s.name === 'ripgrep');
  assert.equal(tool.status, 'gap', 'a missing tool is a named gap');
});
