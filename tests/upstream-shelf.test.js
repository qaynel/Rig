'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const zlib = require('node:zlib');
const { sha256, fetchUpstream } = require('../rig/lib/upstream-fetch');
const { runPayload } = require('../rig/lib/payload');
const h = require('./helpers/path-b');
const { signApproval } = require('./helpers/path-b-approval');
const root = path.resolve(__dirname, '..');
const SHELF_FIXTURE = path.join(__dirname, 'fixtures/upstream/shelf.tar.gz');

function withShelfMirror(url, run) {
  const prior = process.env.RIG_UPSTREAM_MIRROR_GSTACK_SHELF;
  process.env.RIG_UPSTREAM_MIRROR_GSTACK_SHELF = url;
  try { return run(); } finally {
    if (prior === undefined) delete process.env.RIG_UPSTREAM_MIRROR_GSTACK_SHELF;
    else process.env.RIG_UPSTREAM_MIRROR_GSTACK_SHELF = prior;
  }
}

test('bootstrap stages pinned metadata and core, with optional third-party resources fetched at onboarding', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-fetch-delivery-'));
  try {
    runPayload(target, ['codex'], { activeDelivery: true });
    assert.equal(fs.existsSync(path.join(target, '.rig/runtime/rig/catalog/skills/testing/web-quality-assurance/qa/SKILL.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/plumbing/bin/rig-diff-scope')), false);
    assert.ok(fs.existsSync(path.join(target, '.rig/upstream/gstack-shelf.json')));
    assert.ok(fs.existsSync(path.join(target, '.agents/skills/rig-grilling/SKILL.md')));
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});

test('pinned full shelf fetch reproduces all 55 optional skills and shared runtime without trusting a vendored fallback', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-shelf-meta-'));
  try {
    fs.cpSync(path.join(root, 'rig/corpus/upstream'), dir, { recursive: true });
    const bytes = fs.readFileSync(path.join(__dirname, 'fixtures/upstream/shelf.tar.gz'));
    const file = path.join(dir, 'gstack-shelf.json');
    const meta = JSON.parse(fs.readFileSync(file));
    meta.archive.tar_sha256 = sha256(zlib.gunzipSync(bytes));
    fs.writeFileSync(file, JSON.stringify(meta));
    const result = await fetchUpstream('gstack-shelf', { metaDir: dir, licencePath: path.join(root, 'rig/catalog/skills/LICENSE.upstream'), fetcher: async () => bytes });
    assert.equal(result.status, 'ok', JSON.stringify(result.gaps));
    assert.equal([...result.files.keys()].filter((name) => name.endsWith('/SKILL.md')).length, 55);
    for (const [output, fetched] of result.files) {
      const source = output.startsWith('plumbing/') ? 'rig/catalog/' + output : 'rig/catalog/skills/' + output;
      assert.ok(fetched.equals(fs.readFileSync(path.join(root, source))), output);
    }
    assert.ok(result.receipt.patches.some((patch) => patch.id === 'rig-shelf-overlay'));
    const helper = result.receipt.files.find((file) => file.path === 'plumbing/bin/rig-diff-scope');
    assert.equal(helper.mode, 0o755, 'pinned executable helper modes travel with the verified receipt');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('approved installed review guidance runs its installed helper and detects mode drift', async () => {
  const archive = fs.readFileSync(SHELF_FIXTURE);
  const tarDigest = sha256(zlib.gunzipSync(archive));
  await h.withRepo((target) => {
    const metaPath = path.join(target, '.rig/upstream/gstack-shelf.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    meta.archive.tar_sha256 = tarDigest;
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

    const prepared = h.handle({ schema_version: 1, action: 'prepare', target });
    const state = h.readJson(path.join(target, '.rig/state.json'));
    const { proposed, applied } = withShelfMirror(`file://${SHELF_FIXTURE}`, () => {
      const proposed = h.handle({
        schema_version: 1,
        action: 'propose',
        target,
        expected_revision: prepared.revision,
        proposal: {
          inventory_digest: state.inventory.digest,
          catalog_digest: state.release.catalog_digest,
          capabilities: [],
          selected_skills: ['review'],
          grafts: [],
          owned_files: [],
          critical_decisions: [],
        },
        summary_markdown: h.summary(),
      });
      const applied = h.handle({
        schema_version: 1,
        action: 'apply',
        target,
        expected_revision: proposed.revision,
        approval: signApproval(target, proposed.proposal_digest),
      });
      return { proposed, applied };
    });
    assert.equal(applied.phase, 'applied');

    const guidance = path.join(target, '.agents/skills/rig-review/SKILL.md');
    const body = fs.readFileSync(guidance, 'utf8');
    const match = body.match(/source <\((\.rig\/plumbing\/bin\/rig-diff-scope) <base> 2>\/dev\/null\) \|\| true/);
    assert.ok(match, 'installed guidance names the installed helper');
    const checklist = fs.readFileSync(path.join(target, '.agents/skills/rig-review/design-checklist.md'), 'utf8');
    assert.match(checklist, /source <\(\.rig\/plumbing\/bin\/rig-diff-scope <base> 2>\/dev\/null\)/, 'installed checklist names the installed helper');
    const helper = path.join(target, match[1]);
    assert.equal(fs.existsSync(helper), true);
    assert.equal(fs.statSync(helper).mode & 0o777, 0o755, 'installed helper keeps its executable mode');

    const git = require('node:child_process').spawnSync;
    for (const args of [['branch', '-M', 'main'], ['add', 'README.md'], ['-c', 'user.name=Rig Test', '-c', 'user.email=rig-test@example.invalid', 'commit', '-m', 'base']]) {
      const result = git('git', args, { cwd: target, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
    }
    const branch = git('git', ['switch', '-c', 'work'], { cwd: target, encoding: 'utf8' });
    assert.equal(branch.status, 0, branch.stderr);
    fs.appendFileSync(path.join(target, 'README.md'), '\nchanged after base\n');
    const update = git('git', ['-c', 'user.name=Rig Test', '-c', 'user.email=rig-test@example.invalid', 'commit', '-am', 'change'], { cwd: target, encoding: 'utf8' });
    assert.equal(update.status, 0, update.stderr);
    const run = require('node:child_process').spawnSync('bash', ['-c', `${match[1]} main`], {
      cwd: target,
      encoding: 'utf8',
    });
    assert.equal(run.status, 0, run.stderr);
    assert.match(run.stdout, /^SCOPE_FRONTEND=false/m, 'the installed guidance command produced helper classification output');

    fs.chmodSync(helper, 0o644);
    const checked = h.handle({ schema_version: 1, action: 'check', target, expected_revision: applied.revision });
    assert.ok(checked.hard_failures.some((failure) => failure.path === '.rig/plumbing/bin/rig-diff-scope' && /changed mode/.test(failure.detail)), `post-install mode drift is reported: ${JSON.stringify(checked.hard_failures)}`);
  }, { install: true });
});
