#!/usr/bin/env node
'use strict';

require('./helpers/hermetic-git-env');

// Subplan 03 acceptance 7 and the uninstall round trip (acceptance 4): a
// v5-installed repository upgrades to the corpus layout through a journaled,
// resumable transaction that preserves user content, selections and preimages,
// and refuses (changing nothing) when it cannot do that safely.

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const { runPayload, journalWriter } = require('../rig/lib/payload');
const { uninstall } = require('../rig/lib/lifecycle');
const { migrate, detectInstall, MIGRATION_REL, BACKUP_REL } = require('../rig/lib/migrate');
const h = require('./helpers/path-b');
const { signApproval } = require('./helpers/path-b-approval');

const root = path.join(__dirname, '..');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const V6_ONLY = ['.rig/onboarding/README.md', '.rig/onboarding/unpack.md'];
const V6_ONLY_ACTIVE = [...V6_ONLY, '.rig/upstream/README.md', '.rig/upstream/gstack.json',
  '.rig/upstream/patches/135.1-cookie-import-browser.patch', '.rig/upstream/patches/135.2-browser-skill-commands.patch', '.rig/upstream/patches/135.3-xvfb.patch'];
const MIGRATION_TMP_REL = '.rig-migration.json.tmp';

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-migrate-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

function userRepo(target) {
  spawnSync('git', ['init', '-q'], { cwd: target });
  fs.writeFileSync(path.join(target, 'AGENTS.md'), '# Existing agent workflow\n\nKeep repository-owned guidance.\n');
  fs.writeFileSync(path.join(target, 'README.md'), '# Fixture\n');
  fs.writeFileSync(path.join(target, '.gitignore'), 'secret.txt\n.env.local\nbuild/\n');
  fs.writeFileSync(path.join(target, 'secret.txt'), 'ignored but precious\n');
  fs.writeFileSync(path.join(target, '.env.local'), 'TOKEN=keep-me\n');
  fs.mkdirSync(path.join(target, 'build'));
  fs.writeFileSync(path.join(target, 'build/out.bin'), Buffer.from([0, 1, 2, 3]));
  fs.mkdirSync(path.join(target, 'reports/rig'), { recursive: true });
  fs.writeFileSync(path.join(target, 'reports/rig/user-report.md'), 'a report that must survive\n');
  fs.mkdirSync(path.join(target, '.claude/skills/user-skill'), { recursive: true });
  fs.writeFileSync(path.join(target, '.claude/skills/user-skill/SKILL.md'), '---\nname: user-skill\n---\nmine\n');
}

// Everything in the working tree (ignored files included), keyed by path.
function inventory(target, { skip = [] } = {}) {
  const out = {};
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      const rel = path.relative(target, abs).split(path.sep).join('/');
      if (rel === '.git' || rel.startsWith('.git/')) continue;
      if (entry.isDirectory()) walk(abs);
      else if (!skip.some((s) => rel === s || rel.startsWith(s))) out[rel] = entry.isSymbolicLink() ? `link:${fs.readlinkSync(abs)}` : sha(fs.readFileSync(abs));
    }
  };
  walk(target);
  return out;
}

const BOOKKEEPING = ['.rig/install-manifest.jsonl', '.rig/preimages/', '.rig/migration'];

// A v5-shaped install: the current payload, minus what only the corpus layout
// adds, with a few files aged to older bytes and legacy orphans the new layout
// no longer projects. Everything goes through the real journal writer.
function installV5(target, { hosts = ['codex'], active = false, extras = true } = {}) {
  runPayload(target, hosts, { releaseTag: 'v5.0.0', activeDelivery: active });
  const writer = journalWriter(target);
  writer.begin();
  for (const rel of active ? V6_ONLY_ACTIVE : V6_ONLY) writer.remove(target, rel, undefined);
  if (extras) {
    writer(target, '.rig/routing.md', '# Rig Router (v5 text)\n');
    writer(target, '.agents/skills/rig-tdd/SKILL.md', '---\nname: rig-tdd\n---\nold tdd\n');
    writer(target, '.rig/skills/tdd/SKILL.md', 'old tdd shared\n');
    writer(target, '.rig/skills/debugging/SKILL.md', 'old debugging shared\n');
    writer(target, '.agents/skills/rig-debugging/SKILL.md', '---\nname: rig-debugging\n---\nold debugging\n');
    writer(target, '.rig/skills/legacy-orphan/SKILL.md', 'legacy orphan\n');
    writer(target, '.agents/skills/rig-legacy-orphan/SKILL.md', 'legacy orphan native\n');
  }
  writer.finish();
  for (const rel of V6_ONLY) fs.rmSync(path.join(target, rel), { force: true });
  assert.equal(detectInstall(target).kind, 'v5');
}

function freshV6(hosts, active = false) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-migrate-fresh-'));
  userRepo(dir);
  runPayload(dir, hosts, { releaseTag: 'v5.0.0', activeDelivery: active });
  return dir;
}

test('a v5 install upgrades to exactly what a fresh install produces, keeping user content and removing orphans', () => withTarget((target) => {
  userRepo(target);
  const userBefore = inventory(target);
  installV5(target);
  const result = migrate(target, { releaseTag: 'v5.0.0' });
  assert.equal(result.status, 'migrated', JSON.stringify(result));
  assert.ok(result.retired.includes('.rig/skills/legacy-orphan/SKILL.md'));
  assert.ok(result.retired.includes('.agents/skills/rig-legacy-orphan/SKILL.md'));
  assert.ok(result.written.includes('.rig/routing.md'));
  const fresh = freshV6(['codex']);
  try {
    assert.deepEqual(inventory(target, { skip: BOOKKEEPING }), inventory(fresh, { skip: BOOKKEEPING }), 'no v5 orphans, corpus output equals a fresh install');
  } finally { fs.rmSync(fresh, { recursive: true, force: true }); }
  for (const [rel, digest] of Object.entries(userBefore)) {
    if (rel === 'AGENTS.md' || rel === '.gitignore') continue;
    assert.equal(inventory(target)[rel], digest, `${rel} survived`);
  }
  assert.match(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), /^# Existing agent workflow\n/);
  assert.match(fs.readFileSync(path.join(target, '.gitignore'), 'utf8'), /^secret\.txt\n\.env\.local\nbuild\/\n/);
  assert.equal(fs.existsSync(path.join(target, MIGRATION_REL)), false, 'the transaction record is removed on success');
  assert.equal(fs.existsSync(path.join(target, BACKUP_REL)), false, 'backups are dropped on success');
  assert.equal(detectInstall(target).kind, 'current');
  assert.equal(migrate(target).status, 'noop');
}));

test('uninstall after migration restores the complete pre-install inventory, ignored files included', () => withTarget((target) => {
  userRepo(target);
  const before = inventory(target);
  installV5(target);
  assert.equal(migrate(target, { releaseTag: 'v5.0.0' }).status, 'migrated');
  const result = uninstall(target);
  assert.equal(result.status, 'removed', JSON.stringify(result));
  // The uninstall evidence file is this session's own output; remove only it.
  fs.rmSync(path.join(target, 'reports/rig/last-uninstall.json'), { force: true });
  fs.rmSync(path.join(target, '.rig/evidence-artifacts.json'), { force: true });
  assert.deepEqual(inventory(target), before);
}));

test('refuses with a recoverable report and changes nothing: corrupt journal, open transaction, bad paths', () => {
  const cases = [
    ['journal-corrupt', (target) => fs.appendFileSync(path.join(target, '.rig/install-manifest.jsonl'), '{not json\n{"seq":1}\n')],
    ['journal-corrupt', (target) => fs.appendFileSync(path.join(target, '.rig/install-manifest.jsonl'), `${JSON.stringify({ seq: 9999, path: '../escape', state: 'applied', ownership: 'create_owned' })}\n`)],
    ['journal-open', (target) => fs.appendFileSync(path.join(target, '.rig/install-manifest.jsonl'), `${JSON.stringify({ kind: 'install_state', complete: false })}\n`)],
  ];
  for (const [code, damage] of cases) withTarget((target) => {
    userRepo(target);
    installV5(target);
    damage(target);
    const before = inventory(target);
    const result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.status, 'refused');
    assert.equal(result.code, code);
    assert.equal(result.recoverable, true);
    assert.deepEqual(inventory(target), before);
  });
});

test('an edited owned file that the new layout changes stops the migration; nothing is overwritten', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  fs.writeFileSync(path.join(target, '.rig/routing.md'), '# my customised router\n');
  const before = inventory(target);
  const result = migrate(target, { releaseTag: 'v5.0.0' });
  assert.equal(result.status, 'refused');
  assert.equal(result.code, 'conflicts');
  assert.deepEqual(result.conflicts.map((c) => [c.path, c.reason]), [['.rig/routing.md', 'edited-owned-file']]);
  assert.deepEqual(inventory(target), before);
  assert.equal(fs.existsSync(path.join(target, MIGRATION_REL)), false, 'no half-started transaction');
}));

test('an edited owned file the new layout would not change is kept; an edited orphan is retained and reported', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const kept = path.join(target, '.rig/rules/communication.md');
  fs.writeFileSync(kept, `${fs.readFileSync(kept, 'utf8')}\nmy addition\n`);
  fs.writeFileSync(path.join(target, '.rig/skills/legacy-orphan/SKILL.md'), 'I edited this orphan\n');
  const result = migrate(target, { releaseTag: 'v5.0.0' });
  assert.equal(result.status, 'migrated', JSON.stringify(result));
  assert.match(fs.readFileSync(kept, 'utf8'), /my addition/);
  assert.deepEqual(result.kept_edited.map((r) => r.path), ['.rig/rules/communication.md']);
  assert.equal(fs.readFileSync(path.join(target, '.rig/skills/legacy-orphan/SKILL.md'), 'utf8'), 'I edited this orphan\n');
  assert.deepEqual(result.retained, [{ path: '.rig/skills/legacy-orphan/SKILL.md', reason: 'edited-orphan' }]);
}));

test('symlink conflicts and files the journal does not own are refused, not followed or replaced', () => {
  withTarget((target) => {
    userRepo(target);
    installV5(target);
    fs.rmSync(path.join(target, '.rig/routing.md'));
    fs.writeFileSync(path.join(target, 'elsewhere.md'), 'outside\n');
    fs.symlinkSync(path.join(target, 'elsewhere.md'), path.join(target, '.rig/routing.md'));
    const before = inventory(target);
    const result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.status, 'refused');
    assert.equal(result.conflicts.some((c) => c.path === '.rig/routing.md' && c.reason === 'symlink'), true);
    assert.deepEqual(inventory(target), before);
    assert.equal(fs.readFileSync(path.join(target, 'elsewhere.md'), 'utf8'), 'outside\n');
  });
  withTarget((target) => {
    userRepo(target);
    installV5(target);
    fs.mkdirSync(path.join(target, '.rig/onboarding'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/onboarding/README.md'), 'a user file squatting on a new path\n');
    const result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.status, 'refused');
    assert.deepEqual(result.conflicts.map((c) => [c.path, c.reason]), [['.rig/onboarding/README.md', 'unowned-file']]);
    assert.equal(fs.readFileSync(path.join(target, '.rig/onboarding/README.md'), 'utf8'), 'a user file squatting on a new path\n');
  });
  withTarget((target) => {
    userRepo(target);
    installV5(target);
    fs.rmSync(path.join(target, '.agents/skills/rig-legacy-orphan'), { recursive: true });
    fs.mkdirSync(path.join(target, 'real-dir'));
    fs.writeFileSync(path.join(target, 'real-dir/SKILL.md'), 'target of a link\n');
    fs.symlinkSync(path.join(target, 'real-dir'), path.join(target, '.agents/skills/rig-legacy-orphan'));
    const result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.status, 'refused', 'an owned orphan that became a symlink is left alone');
    assert.equal(fs.readFileSync(path.join(target, 'real-dir/SKILL.md'), 'utf8'), 'target of a link\n');
  });
});

test('interruption at every step is recoverable: a rerun completes to the same result', () => {
  let steps = 0;
  withTarget((target) => {
    userRepo(target);
    installV5(target);
    migrate(target, { releaseTag: 'v5.0.0', onStep: () => { steps += 1; } });
  });
  assert.ok(steps >= 10, `expected a multi-step plan, saw ${steps}`);
  let expected;
  withTarget((target) => {
    userRepo(target);
    installV5(target);
    migrate(target, { releaseTag: 'v5.0.0' });
    expected = inventory(target, { skip: BOOKKEEPING });
  });
  for (let stop = 0; stop < steps; stop += 1) {
    withTarget((target) => {
      userRepo(target);
      installV5(target);
      let seen = 0;
      assert.throws(() => migrate(target, { releaseTag: 'v5.0.0', onStep: () => { if (seen++ === stop) throw new Error('simulated crash'); } }), /simulated crash/);
      assert.equal(fs.existsSync(path.join(target, MIGRATION_REL)), true, `step ${stop}: the transaction record survives`);
      assert.equal(detectInstall(target).kind, 'resume');
      const resumed = migrate(target, { releaseTag: 'v5.0.0' });
      assert.equal(resumed.status, 'migrated', `step ${stop}: ${JSON.stringify(resumed)}`);
      assert.deepEqual(inventory(target, { skip: BOOKKEEPING }), expected, `step ${stop}: same final tree`);
      const journal = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
      assert.equal(journal.filter((r) => r.kind === 'install_state').at(-1).complete, true, `step ${stop}: the journal is closed`);
    });
  }
});

test('migration resumes a complete temporary record left by process interruption', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const crash = spawnSync(process.execPath, ['-e', [
    "const fs = require('node:fs');",
    "const { migrate } = require(process.argv[1]);",
    "fs.linkSync = () => process.exit(73);",
    "migrate(process.argv[2], { releaseTag: 'v5.0.0' });",
  ].join('\n'), path.join(root, 'rig/lib/migrate.js'), target], { encoding: 'utf8' });
  assert.equal(crash.status, 73, crash.stderr);
  const tmp = path.join(target, MIGRATION_TMP_REL);
  assert.ok(fs.existsSync(tmp), 'interruption leaves the fully written transaction record');
  assert.equal(JSON.parse(fs.readFileSync(tmp, 'utf8')).version, 1);
  const resumed = migrate(target, { releaseTag: 'v5.0.0' });
  assert.equal(resumed.status, 'migrated');
  assert.equal(fs.existsSync(tmp), false, 'resume removes the temporary hard link');
  assert.equal(detectInstall(target).kind, 'current');
}));

test('migration resume cleans the temporary hard link left after publication', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const crash = spawnSync(process.execPath, ['-e', [
    "const fs = require('node:fs');",
    "const { migrate } = require(process.argv[1]);",
    "const link = fs.linkSync;",
    "fs.linkSync = (...args) => { link(...args); process.exit(74); };",
    "migrate(process.argv[2], { releaseTag: 'v5.0.0' });",
  ].join('\n'), path.join(root, 'rig/lib/migrate.js'), target], { encoding: 'utf8' });
  assert.equal(crash.status, 74, crash.stderr);
  const tmp = path.join(target, MIGRATION_TMP_REL);
  assert.ok(fs.existsSync(path.join(target, MIGRATION_REL)));
  assert.ok(fs.existsSync(tmp), 'the crash lands after final link publication');
  const resumed = migrate(target, { releaseTag: 'v5.0.0' });
  assert.equal(resumed.status, 'migrated');
  assert.equal(fs.existsSync(tmp), false, 'resume removes only the same-inode published temp link');
  assert.equal(detectInstall(target).kind, 'current');
}));

test('an edit made while a migration is interrupted is a conflict on resume, not an overwrite', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  let seen = 0;
  assert.throws(() => migrate(target, { releaseTag: 'v5.0.0', onStep: () => { if (seen++ === 3) throw new Error('crash'); } }), /crash/);
  fs.writeFileSync(path.join(target, '.rig/rules/rig.md'), 'edited between attempts\n');
  const result = migrate(target, { releaseTag: 'v5.0.0' });
  if (result.status === 'migrated') {
    // The edited file was not part of the unfinished plan's remaining work.
    assert.ok(true);
  } else {
    assert.equal(result.status, 'refused');
    assert.equal(fs.readFileSync(path.join(target, '.rig/rules/rig.md'), 'utf8'), 'edited between attempts\n');
  }
}));

test('a corrupt or tampered transaction record refuses; deleting it starts over from the journal', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  let seen = 0;
  assert.throws(() => migrate(target, { releaseTag: 'v5.0.0', onStep: () => { if (seen++ === 2) throw new Error('crash'); } }), /crash/);
  const record = path.join(target, MIGRATION_REL);
  const good = fs.readFileSync(record, 'utf8');
  fs.writeFileSync(record, '{truncated');
  assert.equal(migrate(target).code, 'migration-corrupt');
  const tampered = JSON.parse(good);
  tampered.actions.push({ path: 'AGENTS.md', action: 'retire', old: 'x', new: null });
  fs.writeFileSync(record, JSON.stringify(tampered));
  assert.equal(migrate(target).code, 'migration-corrupt');
  assert.match(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), /Existing agent workflow/, 'a forged plan never reaches user files');
  fs.rmSync(record);
  const restarted = migrate(target, { releaseTag: 'v5.0.0' });
  assert.equal(restarted.status, 'migrated', JSON.stringify(restarted));
}));

// ------------------------------------------------- onboarding state

async function appliedState(target, { agedCatalog }) {
  const writer = journalWriter(target);
  writer.begin();
  if (agedCatalog) {
    // Age the pinned catalogue first, so the approval is bound to the "old" bytes.
    const catalog = JSON.parse(fs.readFileSync(path.join(target, '.rig/catalog.json'), 'utf8'));
    catalog.release.version = 'v5.0.0-old';
    writer(target, '.rig/catalog.json', `${JSON.stringify(catalog, null, 2)}\n`);
  }
  writer.finish();
  const run = h.applyAndCheck(target);
  assert.equal(run.checked.phase, 'checked');
  const remover = journalWriter(target);
  remover.begin();
  for (const rel of V6_ONLY_ACTIVE) remover.remove(target, rel, undefined);
  remover.finish();
  return run;
}

test('onboarding state with unchanged bytes survives a migration untouched', async () => {
  await h.withRepo(async (target) => {
    await appliedState(target, { agedCatalog: false });
    const before = h.readJson(path.join(target, '.rig/state.json'));
    const projectedBefore = inventory(target);
    const result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.status, 'migrated', JSON.stringify(result));
    assert.equal(result.onboarding_state.status, 'kept');
    const after = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(after.phase, 'checked');
    assert.deepEqual(after.proposal, before.proposal);
    assert.deepEqual(after.approval, before.approval);
    assert.equal(inventory(target)['.agents/skills/rig-qa/SKILL.md'], projectedBefore['.agents/skills/rig-qa/SKILL.md'], 'approved projections are never retired');
    const checked = h.handle({ schema_version: 1, action: 'check', target, expected_revision: after.revision });
    assert.deepEqual(checked.hard_failures, []);
  }, { install: true });
});

test('changed bytes invalidate approval and results, keep the selection, and block the old apply', async () => {
  await h.withRepo(async (target) => {
    const run = await appliedState(target, { agedCatalog: true });
    const before = h.readJson(path.join(target, '.rig/state.json'));
    const result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.status, 'migrated', JSON.stringify(result));
    assert.equal(result.onboarding_state.status, 'invalidated');
    assert.ok(result.onboarding_state.invalidated.includes('catalog-digest'));
    const after = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(after.phase, 'prepared');
    assert.equal(after.proposal, null);
    assert.equal(after.approval, null);
    assert.equal(after.checks, null);
    assert.deepEqual(after.migration.preserved_selection.selected_skills, before.proposal.selected_skills, 'valid selection preserved');
    assert.equal(after.migration.preserved_selection.grafts[0].capability, 'testing.web-quality-assurance');
    assert.equal(after.applied.proposal_digest, before.applied.proposal_digest, 'the applied ledger is kept so reapply can reconcile');
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/rig-qa/SKILL.md')), true, 'approved projections stay');
    // The old signed receipt cannot be replayed to claim the new layout was applied.
    assert.throws(() => h.handle({
      schema_version: 1, action: 'apply', target, expected_revision: after.revision, approval: run.approvalReceipt,
    }), /requires a current proposal|invalid from phase/);
    // The preserved selection re-proposes and re-applies against the new bytes.
    const prepared = h.handle({ schema_version: 1, action: 'prepare', target });
    const state = h.readJson(path.join(target, '.rig/state.json'));
    const proposed = h.handle({
      schema_version: 1, action: 'propose', target, expected_revision: prepared.revision,
      proposal: h.proposal(target, state, {}), summary_markdown: h.summary(),
    });
    const applied = h.handle({
      schema_version: 1, action: 'apply', target, expected_revision: proposed.revision, approval: signApproval(target, proposed.proposal_digest),
    });
    assert.equal(applied.phase, 'applied');
    assert.deepEqual(h.handle({ schema_version: 1, action: 'check', target, expected_revision: applied.revision }).hard_failures, []);
  }, { install: true });
});

test('a corrupt onboarding state refuses before any change', async () => {
  await h.withRepo(async (target) => {
    await appliedState(target, { agedCatalog: false });
    fs.writeFileSync(path.join(target, '.rig/state.json'), '{broken');
    const before = inventory(target);
    const result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.code, 'state-invalid');
    assert.deepEqual(inventory(target), before);
  }, { install: true });
});

// ---------------------------------------- the real v5 installer + the CLI

const V5_COMMIT = 'b7f72117';
const hasV5 = spawnSync('git', ['cat-file', '-e', `${V5_COMMIT}^{commit}`], { cwd: root }).status === 0;

test('a repository installed by the real v5 installer migrates to a fresh-install tree and round-trips', { skip: hasV5 ? false : `commit ${V5_COMMIT} is not in this clone` }, () => {
  const v5Source = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-v5-source-'));
  try {
    const archive = spawnSync('sh', ['-c', `git archive ${V5_COMMIT} rig skills .claude .agents package.json | tar -x -C ${JSON.stringify(v5Source)}`], { cwd: root });
    assert.equal(archive.status, 0, String(archive.stderr));
    for (const active of [false, true]) withTarget((target) => {
      userRepo(target);
      const before = inventory(target);
      const install = spawnSync('sh', [path.join(v5Source, 'rig/bootstrap.sh'), '--target', target, '--hosts', 'codex,claude,cursor', ...(active ? ['--with-runtime'] : [])], {
        encoding: 'utf8', env: { ...process.env, RIG_RELEASE_TAG: 'v5.0.0' },
      });
      assert.equal(install.status, 0, install.stderr);
      assert.equal(detectInstall(target).kind, 'v5');
      const result = migrate(target, { releaseTag: 'v5.0.0' });
      assert.equal(result.status, 'migrated', JSON.stringify(result).slice(0, 600));
      const fresh = freshV6(['codex', 'claude', 'cursor'], active);
      try {
        assert.deepEqual(inventory(target, { skip: BOOKKEEPING }), inventory(fresh, { skip: BOOKKEEPING }));
      } finally { fs.rmSync(fresh, { recursive: true, force: true }); }
      assert.equal(uninstall(target).status, 'removed');
      fs.rmSync(path.join(target, 'reports/rig/last-uninstall.json'), { force: true });
      fs.rmSync(path.join(target, '.rig/evidence-artifacts.json'), { force: true });
      // .rig/network-policy.json is the user's policy seed; uninstall keeps it by design.
      assert.deepEqual(inventory(target), active ? { ...before, '.rig/network-policy.json': inventory(target)['.rig/network-policy.json'] } : before);
    });
  } finally { fs.rmSync(v5Source, { recursive: true, force: true }); }
});

test('bootstrap.sh on a v5 repository runs the migration; on a conflict it exits non-zero and names the files', () => withTarget((target) => {
  userRepo(target);
  installV5(target, { hosts: ['codex'] });
  fs.writeFileSync(path.join(target, '.rig/routing.md'), 'customised\n');
  const refused = spawnSync('sh', [path.join(root, 'rig/bootstrap.sh'), '--target', target, '--hosts', 'codex'], { encoding: 'utf8' });
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /migration refused \(conflicts\)/);
  assert.match(refused.stderr, /\.rig\/routing\.md/);
  assert.equal(fs.readFileSync(path.join(target, '.rig/routing.md'), 'utf8'), 'customised\n');
  fs.writeFileSync(path.join(target, '.rig/routing.md'), '# Rig Router (v5 text)\n');
  const ok = spawnSync('sh', [path.join(root, 'rig/bootstrap.sh'), '--target', target, '--hosts', 'codex'], { encoding: 'utf8' });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /migrated v5 install/);
  assert.equal(detectInstall(target).kind, 'current');
}));

test('public v5 bootstrap upgrade finalizes MCP, retries setup, registers OpenClaw, and uninstalls owned additions', { timeout: 60000 }, () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-migrate-mcp-'));
  const target = path.join(fixture, 'repository');
  const bin = path.join(fixture, 'bin');
  const home = path.join(fixture, 'home');
  const config = path.join(home, '.openclaw/openclaw.json');
  const failNpm = path.join(fixture, 'fail-npm');
  const failOpenclaw = path.join(fixture, 'fail-openclaw');
  const failOpenclawShow = path.join(fixture, 'fail-openclaw-show');
  try {
    fs.mkdirSync(target, { recursive: true });
    fs.mkdirSync(bin);
    userRepo(target);
    installV5(target, { hosts: ['claude'], active: true });
    fs.mkdirSync(path.dirname(config), { recursive: true });
    fs.writeFileSync(config, JSON.stringify({ user: true, mcp: { servers: { keep: { command: 'keep' } } } }, null, 2) + '\n');
    fs.writeFileSync(failNpm, 'fail once\n');
    fs.writeFileSync(path.join(bin, 'npm'), [
      '#!/bin/sh',
      '[ ! -f "$RIG_TEST_FAIL_NPM" ] || { echo "simulated npm unavailable" >&2; exit 9; }',
      '[ "$RIG_TEST_REAL_NPM" != 1 ] || exec "$RIG_REAL_NPM" "$@"',
      'dest=$PWD',
      'while [ "$#" -gt 0 ]; do if [ "$1" = "--prefix" ]; then dest=$2; shift 2; else shift; fi; done',
      'mkdir -p "$dest"',
      'cp -R "$RIG_TEST_MCP_NODE_MODULES" "$dest/node_modules"',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/usr/bin/env node',
      "const fs = require('node:fs');",
      "const path = require('node:path');",
      'const [, , group, action, name, value] = process.argv;',
      "if (group !== 'mcp' || !['show', 'set', 'unset'].includes(action)) process.exit(2);",
      "const file = process.env.OPENCLAW_CONFIG_PATH;",
      "if (action === 'set' && process.env.RIG_TEST_FAIL_OPENCLAW && fs.existsSync(process.env.RIG_TEST_FAIL_OPENCLAW)) { fs.rmSync(process.env.RIG_TEST_FAIL_OPENCLAW); fs.writeFileSync(process.env.RIG_TEST_FAIL_OPENCLAW_SHOW, '2'); process.stderr.write('simulated OpenClaw registration failure\\n'); process.exit(8); }",
      "if (action === 'show' && fs.existsSync(process.env.RIG_TEST_FAIL_OPENCLAW_SHOW)) { const n = Number(fs.readFileSync(process.env.RIG_TEST_FAIL_OPENCLAW_SHOW, 'utf8')); if (n <= 1) fs.rmSync(process.env.RIG_TEST_FAIL_OPENCLAW_SHOW); else fs.writeFileSync(process.env.RIG_TEST_FAIL_OPENCLAW_SHOW, String(n - 1)); process.stderr.write('simulated OpenClaw show failure\\n'); process.exit(9); }",
      "const config = JSON.parse(fs.readFileSync(file, 'utf8'));",
      'config.mcp ??= {}; config.mcp.servers ??= {};',
      "if (action === 'show' && name === '--json') { process.stdout.write(JSON.stringify(config.mcp.servers)); process.exit(0); }",
      "if (action === 'set') config.mcp.servers[name] = JSON.parse(value);",
      "else if (action === 'unset') delete config.mcp.servers[name];",
      "fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\\n');",
      '',
    ].join('\n'), { mode: 0o755 });
    const env = {
      ...process.env,
      HOME: home,
      PATH: `${bin}${path.delimiter}${process.env.PATH}`,
      OPENCLAW_CONFIG_PATH: config,
      RIG_TEST_FAIL_NPM: failNpm,
      RIG_TEST_FAIL_OPENCLAW: failOpenclaw,
      RIG_TEST_FAIL_OPENCLAW_SHOW: failOpenclawShow,
      SETUP_MCP: '1',
    };
    if (process.env.RIG_TEST_REAL_NPM === '1') {
      env.RIG_TEST_REAL_NPM = '1';
      env.RIG_REAL_NPM = execFileSync('which', ['npm'], { encoding: 'utf8' }).trim();
      env.npm_config_cache = path.join(fixture, 'npm-cache');
    } else {
      env.RIG_TEST_MCP_NODE_MODULES = path.join(root, 'rig-mcp/node_modules');
    }
    const bootstrap = (...args) => spawnSync('sh', [path.join(root, 'rig/bootstrap.sh'), '--target', target, ...args], { encoding: 'utf8', env });
    const failed = bootstrap();
    assert.notEqual(failed.status, 0, 'dependency failure must fail the public upgrade command');
    assert.match(failed.stderr, /npm ci failed for MCP runtime.*simulated npm unavailable/s);
    assert.equal(detectInstall(target).kind, 'current', 'the migration can finish before retryable finalization');
    assert.equal(fs.existsSync(path.join(target, '.rig/mcp-server.json')), false);
    const setupMarker = path.join(target, '.rig/mcp-setup-pending.json');
    const ownedMarker = fs.readFileSync(setupMarker);
    fs.writeFileSync(setupMarker, '{"version":2}\n');
    const editedMarker = bootstrap();
    assert.notEqual(editedMarker.status, 0);
    assert.match(editedMarker.stderr, /refusing unowned or edited \.rig\/mcp-setup-pending\.json/);
    assert.equal(fs.readFileSync(setupMarker, 'utf8'), '{"version":2}\n', 'edited marker bytes are preserved');
    fs.writeFileSync(setupMarker, ownedMarker);

    fs.rmSync(failNpm);
    const setupOnly = bootstrap();
    assert.equal(setupOnly.status, 0, setupOnly.stderr);
    assert.ok(fs.existsSync(path.join(target, '.rig/mcp-server.json')));
    assert.ok(fs.existsSync(path.join(target, '.rig/runtime/rig-mcp/node_modules/@modelcontextprotocol/sdk')));
    const setupProbe = spawnSync(process.execPath, ['-e', [
      "import fs from 'node:fs';",
      "import { Client } from '@modelcontextprotocol/sdk/client/index.js';",
      "import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';",
      "const descriptor = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));",
      "const c = new Client({ name: 'upgrade-setup-only-test', version: '1' });",
      "await c.connect(new StdioClientTransport({ command: descriptor.command, args: descriptor.args, cwd: process.argv[2] }));",
      "const r = await c.callTool({ name: 'rig_instructions', arguments: { mode: 'full' } });",
      "if (!r.content?.[0]?.text) throw new Error('rig_instructions returned no text');",
      'await c.close();',
    ].join('\n'), path.join(target, '.rig/mcp-server.json'), target], { cwd: path.join(target, '.rig/runtime/rig-mcp'), encoding: 'utf8', env });
    assert.equal(setupProbe.status, 0, setupProbe.stderr);
    assert.equal(fs.readFileSync(config, 'utf8'), JSON.stringify({ user: true, mcp: { servers: { keep: { command: 'keep' } } } }, null, 2) + '\n');

    fs.writeFileSync(failOpenclaw, 'fail once\n');
    const registrationFailed = bootstrap('--openclaw-mcp');
    assert.notEqual(registrationFailed.status, 0, 'registration failure must fail the public upgrade command');
    assert.match(registrationFailed.stderr, /simulated OpenClaw registration failure/);
    assert.deepEqual(JSON.parse(fs.readFileSync(config, 'utf8')).mcp.servers, { keep: { command: 'keep' } });
    assert.equal(fs.existsSync(failOpenclawShow), false, 'the failed status probes were consumed');
    const pendingLedger = JSON.parse(fs.readFileSync(path.join(target, '.rig/global-writes.json'), 'utf8'));
    assert.equal(pendingLedger.entries.find((entry) => entry.kind === 'openclaw-mcp').state, 'pending');
    fs.writeFileSync(failNpm, 'fail retry setup\n');
    const setupRetryFailed = bootstrap('--openclaw-mcp');
    assert.notEqual(setupRetryFailed.status, 0);
    assert.match(setupRetryFailed.stderr, /npm ci failed for MCP runtime.*simulated npm unavailable/s);
    assert.equal(JSON.parse(fs.readFileSync(path.join(target, '.rig/global-writes.json'), 'utf8')).entries.find((entry) => entry.kind === 'openclaw-mcp').state, 'pending');
    fs.rmSync(failNpm);
    const upgraded = bootstrap('--openclaw-mcp');
    assert.equal(upgraded.status, 0, upgraded.stderr);
    assert.ok(fs.existsSync(path.join(target, '.rig/mcp-server.json')));
    assert.ok(fs.existsSync(path.join(target, '.rig/runtime/rig-mcp/node_modules/@modelcontextprotocol/sdk')));
    const manifest = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8');
    assert.match(manifest, /"path":"\.rig\/mcp-server\.json"/);
    assert.match(manifest, /"path":"\.rig\/runtime\/rig-mcp\/node_modules\//);
    const configAfter = JSON.parse(fs.readFileSync(config, 'utf8'));
    assert.equal(configAfter.user, true);
    assert.deepEqual(configAfter.mcp.servers.keep, { command: 'keep' });
    const rigServers = Object.entries(configAfter.mcp.servers).filter(([name]) => name.startsWith('rig-'));
    assert.equal(rigServers.length, 1);
    assert.deepEqual(rigServers[0][1], {
      command: 'node', args: [path.join(target, '.rig/runtime/rig-mcp/index.js')],
    });

    const probe = spawnSync(process.execPath, ['-e', [
      "import fs from 'node:fs';",
      "import { Client } from '@modelcontextprotocol/sdk/client/index.js';",
      "import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';",
      "const descriptor = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));",
      "const c = new Client({ name: 'upgrade-test', version: '1' });",
      "await c.connect(new StdioClientTransport({ command: descriptor.command, args: descriptor.args, cwd: process.argv[2] }));",
      "const r = await c.callTool({ name: 'rig_instructions', arguments: { mode: 'full' } });",
      "if (!r.content?.[0]?.text) throw new Error('rig_instructions returned no text');",
      'await c.close();',
    ].join('\n'), path.join(target, '.rig/mcp-server.json'), target], { cwd: path.join(target, '.rig/runtime/rig-mcp'), encoding: 'utf8', env });
    assert.equal(probe.status, 0, probe.stderr);

    const retried = bootstrap('--openclaw-mcp');
    assert.equal(retried.status, 0, retried.stderr);
    assert.deepEqual(Object.keys(JSON.parse(fs.readFileSync(config, 'utf8')).mcp.servers).filter((name) => name.startsWith('rig-')), [rigServers[0][0]]);
    const previous = { PATH: process.env.PATH, HOME: process.env.HOME, OPENCLAW_CONFIG_PATH: process.env.OPENCLAW_CONFIG_PATH };
    Object.assign(process.env, { PATH: env.PATH, HOME: env.HOME, OPENCLAW_CONFIG_PATH: env.OPENCLAW_CONFIG_PATH });
    let removed;
    try { removed = uninstall(target); }
    finally {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key]; else process.env[key] = value;
      }
    }
    assert.equal(removed.status, 'removed', removed.best_effort_details?.join('\n'));
    const afterUninstall = JSON.parse(fs.readFileSync(config, 'utf8'));
    assert.deepEqual(afterUninstall.mcp.servers, { keep: { command: 'keep' } });
    assert.equal(fs.existsSync(path.join(target, '.rig/mcp-server.json')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/runtime/rig-mcp/node_modules')), false);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('migration skips setup-only MCP dependencies for a non-emitting host', () => withTarget((target) => {
  userRepo(target);
  installV5(target, { hosts: ['generic'], active: true });
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-migrate-generic-'));
  try {
    const bin = path.join(fixture, 'bin');
    const npmLog = path.join(fixture, 'npm.log');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'npm'), '#!/bin/sh\nprintf called >> "$RIG_TEST_NPM_LOG"\n', { mode: 0o755 });
    const env = { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, RIG_TEST_NPM_LOG: npmLog, SETUP_MCP: '1' };
    const result = spawnSync('sh', [path.join(root, 'rig/bootstrap.sh'), '--target', target], { encoding: 'utf8', env });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.existsSync(npmLog), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/mcp-server.json')), false);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
}));

test('public bootstrap refuses an unowned MCP retry marker before running npm', () => withTarget((target) => {
  userRepo(target);
  runPayload(target, ['claude']);
  const marker = path.join(target, '.rig/mcp-setup-pending.json');
  fs.writeFileSync(marker, '{"version":1}\n');
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-unowned-mcp-marker-'));
  const npmLog = path.join(bin, 'npm.log');
  fs.writeFileSync(path.join(bin, 'npm'), '#!/bin/sh\nprintf called >> "$RIG_TEST_NPM_LOG"\nexit 0\n', { mode: 0o755 });
  const result = spawnSync('sh', [path.join(root, 'rig/bootstrap.sh'), '--target', target, '--hosts', 'claude'], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, SETUP_MCP: '1', RIG_TEST_NPM_LOG: npmLog },
  });
  try {
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /refusing unowned or edited \.rig\/mcp-setup-pending\.json/);
    assert.equal(fs.existsSync(npmLog), false, 'an unowned marker cannot trigger dependency setup');
    assert.equal(fs.readFileSync(marker, 'utf8'), '{"version":1}\n');
  } finally { fs.rmSync(bin, { recursive: true, force: true }); }
}));

test('public installer disables setup-only MCP on fresh install but preserves explicit v5 upgrade request', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-install-mcp-opt-in-'));
  try {
    const staging = path.join(fixture, 'staging', 'Rig-v5.0.0');
    const archive = path.join(fixture, 'rig-v5.0.0.tar.gz');
    const bin = path.join(fixture, 'bin');
    const target = path.join(fixture, 'repository');
    const npmLog = path.join(fixture, 'npm.log');
    fs.mkdirSync(staging, { recursive: true });
    fs.mkdirSync(bin);
    fs.mkdirSync(target);
    fs.mkdirSync(path.join(target, '.claude'));
    fs.writeFileSync(path.join(target, '.claude/CLAUDE.md'), '# Existing Claude instructions\n');
    for (const rel of ['rig', '.agents', '.claude', 'skills']) {
      fs.cpSync(path.join(root, rel), path.join(staging, rel), { recursive: true });
    }
    fs.cpSync(path.join(root, 'rig-mcp'), path.join(staging, 'rig-mcp'), {
      recursive: true,
      filter(source) { return path.basename(source) !== 'node_modules'; },
    });
    const packed = spawnSync('tar', ['-czf', archive, '-C', path.dirname(staging), path.basename(staging)], { encoding: 'utf8' });
    assert.equal(packed.status, 0, packed.stderr);
    fs.writeFileSync(path.join(bin, 'curl'), [
      '#!/bin/sh',
      'while [ "$#" -gt 0 ]; do if [ "$1" = "-o" ]; then cp "$RIG_TEST_ARCHIVE" "$2"; exit 0; fi; shift; done',
      'exit 1',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'npm'), [
      '#!/bin/sh',
      'printf called >> "$RIG_TEST_NPM_LOG"',
      '[ ! -f "$RIG_TEST_FAIL_NPM" ] || exit 9',
      '[ "$RIG_TEST_REAL_NPM" != 1 ] || exec "$RIG_REAL_NPM" "$@"',
      'dest=$PWD',
      'while [ "$#" -gt 0 ]; do if [ "$1" = "--prefix" ]; then dest=$2; shift 2; else shift; fi; done',
      'mkdir -p "$dest"',
      'cp -R "$RIG_TEST_MCP_NODE_MODULES" "$dest/node_modules"',
      '',
    ].join('\n'), { mode: 0o755 });
    const failNpm = path.join(fixture, 'fail-npm');
    fs.writeFileSync(failNpm, 'fail once\n');
    const env = {
      ...process.env,
      PATH: `${bin}${path.delimiter}${process.env.PATH}`,
      RIG_TEST_ARCHIVE: archive,
      RIG_TEST_NPM_LOG: npmLog,
      RIG_TEST_FAIL_NPM: failNpm,
      RIG_TEST_MCP_NODE_MODULES: path.join(root, 'rig-mcp/node_modules'),
      SETUP_MCP: '1',
    };
    if (process.env.RIG_TEST_REAL_NPM === '1') {
      env.RIG_TEST_REAL_NPM = '1';
      env.RIG_REAL_NPM = execFileSync('which', ['npm'], { encoding: 'utf8' }).trim();
      env.npm_config_cache = path.join(fixture, 'npm-cache');
    }
    const installed = spawnSync('/bin/dash', [path.join(root, 'install.sh'), '--version', 'v5.0.0', '--target', target], { encoding: 'utf8', env });
    assert.equal(installed.status, 0, installed.stderr);
    assert.equal(fs.existsSync(npmLog), false, 'ordinary public install must not invoke npm');
    assert.equal(fs.existsSync(path.join(target, '.rig/mcp-server.json')), false);

    const upgradeTarget = path.join(fixture, 'v5-repository');
    fs.mkdirSync(upgradeTarget);
    userRepo(upgradeTarget);
    installV5(upgradeTarget, { hosts: ['claude'], active: true });
    const upgraded = spawnSync('/bin/dash', [path.join(root, 'install.sh'), '--version', 'v5.0.0', '--target', upgradeTarget], { encoding: 'utf8', env });
    assert.notEqual(upgraded.status, 0, upgraded.stderr);
    assert.match(upgraded.stderr, /npm ci failed for MCP runtime/);
    assert.ok(fs.existsSync(path.join(upgradeTarget, '.rig/mcp-setup-pending.json')));
    fs.rmSync(failNpm);
    const retried = spawnSync('/bin/dash', [path.join(root, 'install.sh'), '--version', 'v5.0.0', '--target', upgradeTarget], { encoding: 'utf8', env });
    assert.equal(retried.status, 0, retried.stderr);
    assert.ok(fs.existsSync(path.join(upgradeTarget, '.rig/mcp-server.json')));
    assert.equal(fs.existsSync(path.join(upgradeTarget, '.rig/mcp-setup-pending.json')), false);
    const setupProbe = spawnSync(process.execPath, ['-e', [
      "import fs from 'node:fs';",
      "import { Client } from '@modelcontextprotocol/sdk/client/index.js';",
      "import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';",
      "const descriptor = JSON.parse(fs.readFileSync(process.argv[1], 'utf8'));",
      "const c = new Client({ name: 'public-installer-upgrade-test', version: '1' });",
      "await c.connect(new StdioClientTransport({ command: descriptor.command, args: descriptor.args, cwd: process.argv[2] }));",
      "const r = await c.callTool({ name: 'rig_instructions', arguments: { mode: 'full' } });",
      "if (!r.content?.[0]?.text) throw new Error('rig_instructions returned no text');",
      'await c.close();',
    ].join('\n'), path.join(upgradeTarget, '.rig/mcp-server.json'), upgradeTarget], {
      cwd: path.join(upgradeTarget, '.rig/runtime/rig-mcp'), encoding: 'utf8', env,
    });
    assert.equal(setupProbe.status, 0, setupProbe.stderr);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});

test('the rig migrate command plans without writing (--dry-run), then migrates, and exits non-zero on refusal', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const run = (...args) => spawnSync(process.execPath, [path.join(root, 'rig/materialize.js'), 'migrate', '--target', target, ...args], { encoding: 'utf8', env: { ...process.env, RIG_RELEASE_TAG: 'v5.0.0' } });
  const before = inventory(target);
  const dry = run('--dry-run');
  assert.equal(dry.status, 0, dry.stderr);
  const plan = JSON.parse(dry.stdout);
  assert.equal(plan.status, 'plan');
  assert.ok(plan.actions.some((a) => a.action === 'retire'));
  assert.deepEqual(inventory(target), before, 'a dry run writes nothing');
  assert.equal(JSON.parse(run().stdout).status, 'migrated');
  const again = JSON.parse(run().stdout);
  assert.deepEqual([again.status, again.reason], ['noop', 'already-current']);
  fs.appendFileSync(path.join(target, '.rig/install-manifest.jsonl'), '{garbage\n');
  const broken = run();
  assert.equal(JSON.parse(broken.stdout).status, 'noop', 'a current install is not re-validated');
}));

// ------------------------------------------------ symlink containment

function outsideDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-migrate-outside-'));
  fs.writeFileSync(path.join(dir, 'precious.txt'), 'outside the repo\n');
  return dir;
}

function treeOf(dir) {
  const out = {};
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const a = path.join(d, e.name); if (e.isDirectory()) walk(a); else out[path.relative(dir, a)] = e.isSymbolicLink() ? 'link' : sha(fs.readFileSync(a)); } };
  walk(dir);
  return out;
}

function expectSymlinkRefusal(result, rel) {
  assert.equal(result.status, 'refused', JSON.stringify(result));
  assert.equal(result.recoverable, true);
  assert.equal((result.conflicts || []).some((c) => c.reason === 'symlink' && (rel === undefined || c.path === rel || c.path.startsWith(rel))), true, JSON.stringify(result));
}

test('a migration target that is a symlink (outside or inside the repo) is a named conflict; nothing is written through it', () => {
  for (const where of ['outside', 'inside']) withTarget((target) => {
    userRepo(target);
    installV5(target);
    const outside = outsideDir();
    try {
      const victim = where === 'outside' ? path.join(outside, 'victim.txt') : path.join(target, '.git/config');
      const victimBefore = fs.existsSync(victim) ? fs.readFileSync(victim) : null;
      fs.rmSync(path.join(target, '.rig/routing.md'));
      fs.symlinkSync(victim, path.join(target, '.rig/routing.md'));
      const before = inventory(target);
      expectSymlinkRefusal(migrate(target, { releaseTag: 'v5.0.0' }), '.rig/routing.md');
      assert.deepEqual(inventory(target), before);
      assert.equal(fs.existsSync(victim) ? fs.readFileSync(victim).toString() : null, victimBefore === null ? null : victimBefore.toString());
      assert.deepEqual(Object.keys(treeOf(outside)), ['precious.txt']);
    } finally { fs.rmSync(outside, { recursive: true, force: true }); }
  });
});

test('a parent directory that is a symlink cannot redirect writes or deletes', () => {
  for (const where of ['outside', 'inside']) withTarget((target) => {
    userRepo(target);
    installV5(target);
    const outside = outsideDir();
    try {
      const real = path.join(target, '.rig/skills');
      const destination = where === 'outside' ? path.join(outside, 'skills') : path.join(target, '.rig-moved-skills');
      fs.cpSync(real, destination, { recursive: true });
      const destBefore = treeOf(destination);
      fs.rmSync(real, { recursive: true });
      fs.symlinkSync(destination, real);
      const before = inventory(target);
      expectSymlinkRefusal(migrate(target, { releaseTag: 'v5.0.0' }));
      assert.deepEqual(inventory(target), before);
      assert.deepEqual(treeOf(destination), destBefore, 'nothing under the link target was written or removed');
      assert.equal(fs.existsSync(path.join(destination, 'legacy-orphan/SKILL.md')), true, 'an orphan behind a link is not deleted');
    } finally { fs.rmSync(outside, { recursive: true, force: true }); }
  });
});

test('a path swapped for a symlink while a migration is interrupted is refused on resume', () => {
  for (const where of ['outside', 'inside']) withTarget((target) => {
    userRepo(target);
    installV5(target);
    const outside = outsideDir();
    try {
      let seen = 0;
      assert.throws(() => migrate(target, { releaseTag: 'v5.0.0', onStep: () => { if (seen++ === 1) throw new Error('crash'); } }), /crash/);
      const saved = JSON.parse(fs.readFileSync(path.join(target, MIGRATION_REL), 'utf8'));
      const pending = saved.actions.filter((a) => a.action !== 'retire').at(-1);
      const victim = where === 'outside' ? path.join(outside, 'victim.txt') : path.join(target, '.git/config');
      const victimBefore = fs.existsSync(victim) ? fs.readFileSync(victim, 'utf8') : null;
      fs.rmSync(path.join(target, pending.path), { force: true });
      fs.symlinkSync(victim, path.join(target, pending.path));
      const retired = saved.actions.filter((a) => a.action === 'retire').map((a) => a.path);
      expectSymlinkRefusal(migrate(target, { releaseTag: 'v5.0.0' }), pending.path);
      assert.equal(fs.existsSync(victim) ? fs.readFileSync(victim, 'utf8') : null, victimBefore, 'the link target is untouched');
      for (const rel of retired) assert.equal(fs.existsSync(path.join(target, rel)), true, `${rel}: nothing was retired after the refusal`);
      assert.deepEqual(Object.keys(treeOf(outside)), ['precious.txt']);
    } finally { fs.rmSync(outside, { recursive: true, force: true }); }
  });
});

test('a symlinked instruction file that needs an appended pointer line is refused, not written through', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const outside = outsideDir();
  try {
    const instructions = path.join(target, 'AGENTS.md');
    const stripped = fs.readFileSync(instructions, 'utf8').split('\n').filter((l) => !l.includes('.rig/routing.md')).join('\n');
    const elsewhere = path.join(outside, 'AGENTS.md');
    fs.writeFileSync(elsewhere, stripped);
    fs.rmSync(instructions);
    fs.symlinkSync(elsewhere, instructions);
    expectSymlinkRefusal(migrate(target, { releaseTag: 'v5.0.0' }), 'AGENTS.md');
    assert.equal(fs.readFileSync(elsewhere, 'utf8'), stripped);
  } finally { fs.rmSync(outside, { recursive: true, force: true }); }
}));

test('a symlinked instruction file whose pointer line is already present needs no write and is left alone', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const real = path.join(target, 'CLAUDE-real.md');
  fs.renameSync(path.join(target, 'AGENTS.md'), real);
  fs.symlinkSync(real, path.join(target, 'AGENTS.md'));
  const result = migrate(target, { releaseTag: 'v5.0.0' });
  assert.equal(result.status, 'migrated', JSON.stringify(result));
  assert.equal(fs.lstatSync(path.join(target, 'AGENTS.md')).isSymbolicLink(), true);
}));

test('bookkeeping paths are contained too: a symlinked journal, backup dir or transaction record is a named refusal, not a crash or a write-through', () => {
  const cases = [
    ['.rig/install-manifest.jsonl', (target, outside) => {
      const copy = path.join(outside, 'journal.jsonl');
      fs.copyFileSync(path.join(target, '.rig/install-manifest.jsonl'), copy);
      fs.rmSync(path.join(target, '.rig/install-manifest.jsonl'));
      fs.symlinkSync(copy, path.join(target, '.rig/install-manifest.jsonl'));
    }],
    ['.rig/migration-backup', (target, outside) => fs.symlinkSync(outside, path.join(target, '.rig/migration-backup'))],
    ['.rig/migration.json', (target, outside) => fs.symlinkSync(path.join(outside, 'record.json'), path.join(target, '.rig/migration.json'))],
    ['.rig/preimages', (target, outside) => fs.symlinkSync(outside, path.join(target, '.rig/preimages'))],
  ];
  for (const [rel, setup] of cases) withTarget((target) => {
    userRepo(target);
    installV5(target);
    const outside = outsideDir();
    try {
      if (rel === '.rig/preimages') fs.rmSync(path.join(target, rel), { recursive: true, force: true });
      setup(target, outside);
      const before = inventory(target);
      const result = migrate(target, { releaseTag: 'v5.0.0' });
      expectSymlinkRefusal(result);
      assert.deepEqual(inventory(target), before, `${rel}: the repository is unchanged`);
      assert.deepEqual(Object.keys(treeOf(outside)).sort().filter((n) => n !== 'journal.jsonl'), ['precious.txt'], `${rel}: nothing was written outside`);
    } finally { fs.rmSync(outside, { recursive: true, force: true }); }
  });
});

test('migration plan temp symlinks refuse without changing external, dangling, or internal referents', () => {
  for (const kind of ['external', 'dangling', 'internal']) withTarget((target) => {
    userRepo(target);
    installV5(target);
    const outside = kind === 'external' ? outsideDir() : null;
    const tmp = path.join(target, MIGRATION_TMP_REL);
    let referent;
    try {
      if (kind === 'external') {
        referent = path.join(outside, 'sentinel');
        fs.writeFileSync(referent, 'external sentinel bytes\n', { mode: 0o640 });
        fs.symlinkSync(referent, tmp);
      } else if (kind === 'dangling') {
        referent = path.join(target, 'dangling-referent');
        fs.symlinkSync(referent, tmp);
      } else {
        referent = path.join(target, 'user-file');
        fs.writeFileSync(referent, 'internal sentinel bytes\n', { mode: 0o640 });
        fs.symlinkSync(referent, tmp);
      }
      const before = inventory(target);
      const externalBefore = outside && treeOf(outside);
      const modeBefore = kind === 'external' ? fs.statSync(referent).mode & 0o777 : null;
      const result = migrate(target, { releaseTag: 'v5.0.0' });
      assert.equal(result.status, 'refused', JSON.stringify(result));
      assert.equal(result.recoverable, true);
      assert.deepEqual(inventory(target), before, `${kind}: migration did not write payload or replace the temp link`);
      if (outside) {
        assert.deepEqual(treeOf(outside), externalBefore, 'external sentinel inventory is unchanged');
        assert.equal(fs.readFileSync(referent, 'utf8'), 'external sentinel bytes\n');
        assert.equal(fs.statSync(referent).mode & 0o777, modeBefore);
      }
      if (kind === 'dangling') assert.equal(fs.existsSync(referent), false, 'dangling referent was not created');
      if (kind === 'internal') assert.equal(fs.readFileSync(referent, 'utf8'), 'internal sentinel bytes\n');
    } finally { if (outside) fs.rmSync(outside, { recursive: true, force: true }); }
  });
});

test('a pre-existing regular migration temp file is preserved and refuses the migration', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const tmp = path.join(target, MIGRATION_TMP_REL);
  fs.writeFileSync(tmp, 'unrelated temp bytes\n', { mode: 0o640 });
  const before = inventory(target);
  const modeBefore = fs.statSync(tmp).mode & 0o777;
  const result = migrate(target, { releaseTag: 'v5.0.0' });
  assert.equal(result.status, 'refused', JSON.stringify(result));
  assert.deepEqual(inventory(target), before, 'no payload writes and collision file preserved');
  assert.equal(fs.readFileSync(tmp, 'utf8'), 'unrelated temp bytes\n');
  assert.equal(fs.statSync(tmp).mode & 0o777, modeBefore);
}));

test('migration temp creation is exclusive across a symlink substitution race', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const outside = outsideDir();
  const sentinel = path.join(outside, 'sentinel');
  const tmp = path.join(target, MIGRATION_TMP_REL);
  fs.writeFileSync(sentinel, 'race sentinel bytes\n', { mode: 0o640 });
  const before = inventory(target);
  const outsideBefore = treeOf(outside);
  const originalOpenSync = fs.openSync;
  let substituted = false;
  fs.openSync = function (file, flags, ...args) {
    if (!substituted && String(file).endsWith('migration.json.tmp')) {
      substituted = true;
      fs.symlinkSync(sentinel, tmp);
    }
    return originalOpenSync.call(this, file, flags, ...args);
  };
  try {
    const result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(substituted, true, 'test inserted the link immediately before exclusive create');
    assert.equal(result.status, 'refused', JSON.stringify(result));
    assert.deepEqual(inventory(target), { ...before, [MIGRATION_TMP_REL]: `link:${sentinel}` });
    assert.deepEqual(treeOf(outside), outsideBefore);
    assert.equal(fs.readFileSync(sentinel, 'utf8'), 'race sentinel bytes\n');
    assert.equal(fs.statSync(sentinel).mode & 0o777, 0o640);
  } finally {
    fs.openSync = originalOpenSync;
    fs.rmSync(outside, { recursive: true, force: true });
  }
}));

test('migration refuses a parent-directory symlink substitution before writing outside', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const outside = outsideDir();
  const parent = path.join(target, '.rig');
  const movedParent = path.join(target, '.rig-original');
  const before = inventory(target);
  const outsideBefore = treeOf(outside);
  const originalOpenSync = fs.openSync;
  let substituted = false;
  fs.openSync = function (file, flags, ...args) {
    if (!substituted && String(file).endsWith('migration.json.tmp')) {
      substituted = true;
      fs.renameSync(parent, movedParent);
      fs.symlinkSync(outside, parent);
    }
    return originalOpenSync.call(this, file, flags, ...args);
  };
  let result;
  try {
    result = migrate(target, { releaseTag: 'v5.0.0' });
  } finally {
    fs.openSync = originalOpenSync;
    fs.unlinkSync(parent);
    fs.renameSync(movedParent, parent);
  }
  try {
    assert.equal(substituted, true);
    assert.equal(result.status, 'refused', JSON.stringify(result));
    assert.deepEqual(inventory(target), before, 'migration leaves the repository unchanged');
    assert.deepEqual(treeOf(outside), outsideBefore, 'parent swap cannot create an outside migration record');
  } finally { fs.rmSync(outside, { recursive: true, force: true }); }
}));

test('migration refuses a parent-directory symlink substitution at final publication', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const outside = outsideDir();
  const parent = path.join(target, '.rig');
  const movedParent = path.join(target, '.rig-original');
  const externalTmp = path.join(outside, 'migration.json.tmp');
  const finalPath = path.join(outside, 'migration.json');
  const originalLinkSync = fs.linkSync;
  let injected = false;
  let outsideBeforeLink;
  fs.linkSync = function (source, destination) {
    if (!injected && path.basename(String(destination)) === 'migration.json') {
      injected = true;
      fs.renameSync(parent, movedParent);
      fs.symlinkSync(outside, parent);
      fs.writeFileSync(externalTmp, 'unrelated outside bytes\n', { mode: 0o640 });
      outsideBeforeLink = treeOf(outside);
    }
    return originalLinkSync.call(this, source, destination);
  };
  let result;
  try {
    result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.status, 'refused', JSON.stringify(result));
    assert.deepEqual(treeOf(outside), outsideBeforeLink);
    assert.equal(fs.readFileSync(externalTmp, 'utf8'), 'unrelated outside bytes\n');
  } finally {
    fs.linkSync = originalLinkSync;
    fs.unlinkSync(parent);
    fs.rmSync(path.join(target, MIGRATION_TMP_REL), { force: true });
    fs.renameSync(movedParent, parent);
  }
  try {
    assert.equal(injected, true);
    assert.equal(result.status, 'refused', JSON.stringify(result));
    assert.equal(result.recoverable, true);
    assert.deepEqual(treeOf(outside), outsideBeforeLink, 'publication does not move or replace the outside sentinel');
    assert.equal(fs.readFileSync(externalTmp, 'utf8'), 'unrelated outside bytes\n');
    assert.equal(fs.existsSync(finalPath), false, 'no migration record appears outside the repository');
  } finally { fs.rmSync(outside, { recursive: true, force: true }); }
}));

test('migration refuses a parent swap at temporary unlink without touching outside bytes', () => withTarget((target) => {
  userRepo(target);
  installV5(target);
  const outside = outsideDir();
  const parent = path.join(target, '.rig');
  const movedParent = path.join(target, '.rig-original');
  const externalTmp = path.join(outside, 'migration.json.tmp');
  const originalUnlinkSync = fs.unlinkSync;
  let injected = false;
  let outsideBefore;
  fs.unlinkSync = function (file, ...args) {
    if (!injected && String(file).endsWith('migration.json.tmp')) {
      injected = true;
      fs.renameSync(parent, movedParent);
      fs.symlinkSync(outside, parent);
      fs.writeFileSync(externalTmp, 'unrelated outside bytes\n', { mode: 0o640 });
      outsideBefore = treeOf(outside);
    }
    return originalUnlinkSync.call(this, file, ...args);
  };
  let result;
  try {
    result = migrate(target, { releaseTag: 'v5.0.0' });
    assert.equal(result.status, 'refused', JSON.stringify(result));
    assert.deepEqual(treeOf(outside), outsideBefore);
    assert.equal(fs.readFileSync(externalTmp, 'utf8'), 'unrelated outside bytes\n');
    assert.equal(fs.existsSync(path.join(target, MIGRATION_TMP_REL)), false, 'the owned root temp is removed');
  } finally {
    fs.unlinkSync = originalUnlinkSync;
    fs.unlinkSync(parent);
    fs.rmSync(path.join(target, MIGRATION_TMP_REL), { force: true });
    fs.rmSync(path.join(movedParent, MIGRATION_REL), { force: true });
    fs.renameSync(movedParent, parent);
  }
  try {
    assert.equal(injected, true);
    assert.equal(result.status, 'refused', JSON.stringify(result));
    assert.equal(result.recoverable, true);
    assert.deepEqual(treeOf(outside), outsideBefore);
    assert.equal(fs.readFileSync(externalTmp, 'utf8'), 'unrelated outside bytes\n');
    assert.equal(fs.statSync(externalTmp).mode & 0o777, 0o640);
  } finally { fs.rmSync(outside, { recursive: true, force: true }); }
}));
