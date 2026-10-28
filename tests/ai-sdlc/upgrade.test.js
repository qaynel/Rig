'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write, read } = require('./_harness');

// F28 — a prior supported version with user-owned text and an index built by an
// older model revision; upgrade, query, then follow install/repair/removal docs.
function priorInstall() {
  const repo = tempRepo('rig-upgrade-');
  write(repo, '.rig/release.json', { tag: 'v1.0.0' });
  write(repo, '.rig/memory/records.json', { records: [{ id: 'own', source: 'notes/a.md', value: 'Rotate the deploy credential monthly.' }] });
  write(repo, '.rig/memory/index.json', { model_revision: 'old-revision', dims: 256, vectors: { own: [0.1, 0.2] } });
  write(repo, 'notes/a.md', 'Rotate the deploy credential monthly.\n');
  return repo;
}

test('PT-069 prior supported state migrates or stops with a repair report', () => {
  const repo = priorInstall();
  const upgrade = capability('upgrade');

  const result = upgrade.run(repo, { to: 'v2.0.0' });

  assert.equal(read(repo, 'notes/a.md'), 'Rotate the deploy credential monthly.\n', 'user-owned bytes are preserved exactly');
  if (result.migrated) {
    assert.ok(result.migrated.includes('.rig/memory/index.json'));
  } else {
    assert.equal(result.stopped, true);
    assert.ok(result.repair_report, 'incompatible state stops with a repair report');
  }
});

test('PT-079 an upgraded index returns cited results without mixing incompatible vectors', () => {
  const repo = priorInstall();
  const upgrade = capability('upgrade');
  upgrade.run(repo, { to: 'v2.0.0' });

  const index = JSON.parse(read(repo, '.rig/memory/index.json'));
  assert.notEqual(index.model_revision, 'old-revision', 'vectors from an incompatible revision are invalidated or rebuilt');
  for (const vector of Object.values(index.vectors || {})) {
    assert.equal(vector.length, index.dims, 'no vector of the old dimensionality survives');
  }
  const hits = capability('memory').recall(repo, 'how often is the signing secret changed');
  assert.ok(hits.length > 0);
  assert.equal(hits[0].source, 'notes/a.md', 'results stay cited after the upgrade');
});

test('PT-070 a cold user follows docs through install, first task, troubleshooting and removal', () => {
  const repo = priorInstall();
  const docs = capability('upgrade').documentation(repo);

  for (const stage of ['install', 'first-task', 'troubleshooting', 'removal']) {
    const page = docs.find((d) => d.stage === stage);
    assert.ok(page, `public instructions must cover ${stage}`);
    assert.ok(page.commands.length > 0, `${stage} gives the user something to run`);
  }
  const removal = docs.find((d) => d.stage === 'removal');
  const result = capability('upgrade').remove(repo);
  assert.equal(result.removed_rig, true);
  assert.equal(read(repo, 'notes/a.md'), 'Rotate the deploy credential monthly.\n', 'removal preserves user bytes');
  assert.ok(removal.commands.some((c) => result.commands_run.includes(c)), 'the documented commands are the ones that work');
});
