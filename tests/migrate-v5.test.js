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
const { spawnSync } = require('node:child_process');

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
