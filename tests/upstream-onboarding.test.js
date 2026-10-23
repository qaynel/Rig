#!/usr/bin/env node
'use strict';

// Onboarding applies a pinned third-party fetch only after approval, refuses
// the whole apply on any named gap, and records a receipt that check enforces.
// The mirror is a file:// fixture archive; no real network.

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const zlib = require('node:zlib');

const h = require('./helpers/path-b');
const { signApproval } = require('./helpers/path-b-approval');

const root = path.join(__dirname, '..');
const FIXTURE = path.join(__dirname, 'fixtures/upstream/gstack-subset.tar.gz');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const fixtureTar = sha(zlib.gunzipSync(fs.readFileSync(FIXTURE)));
const SHELF = path.join(root, 'rig/catalog/skills');

// Installed metadata is pinned to the real revision; point it at the fixture's
// digest so the offline archive verifies, as a real mirror of the real archive would.
function pinFixture(target, tarDigest = fixtureTar) {
  const file = path.join(target, '.rig/upstream/gstack.json');
  const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
  meta.archive.tar_sha256 = tarDigest;
  fs.writeFileSync(file, JSON.stringify(meta, null, 2));
  return meta;
}

function propose(target, tar) {
  const prepared = h.handle({ schema_version: 1, action: 'prepare', target });
  const state = h.readJson(path.join(target, '.rig/state.json'));
  return h.handle({
    schema_version: 1,
    action: 'propose',
    target,
    expected_revision: prepared.revision,
    proposal: h.proposal(target, state, {
      capabilities: [], selected_skills: [], grafts: [], owned_files: [], upstream_fetch: [{ id: 'gstack', tar_sha256: tar }],
    }),
    summary_markdown: h.summary(),
  });
}

function apply(target, proposed) {
  return h.handle({
    schema_version: 1, action: 'apply', target, expected_revision: proposed.revision, approval: signApproval(target, proposed.proposal_digest),
  });
}

function withMirror(url, fn) {
  const prior = process.env.RIG_UPSTREAM_MIRROR_GSTACK;
  process.env.RIG_UPSTREAM_MIRROR_GSTACK = url;
  try { return fn(); } finally {
    if (prior === undefined) delete process.env.RIG_UPSTREAM_MIRROR_GSTACK; else process.env.RIG_UPSTREAM_MIRROR_GSTACK = prior;
  }
}

test('the pinned metadata and patches install with the corpus', async () => {
  await h.withRepo((target) => {
    for (const rel of ['gstack.json', 'patches/135.1-cookie-import-browser.patch', 'patches/135.2-browser-skill-commands.patch', 'patches/135.3-xvfb.patch']) {
      assert.ok(fs.existsSync(path.join(target, '.rig/upstream', rel)), rel);
    }
    assert.ok(fs.existsSync(path.join(target, '.rig/skills/LICENSE.upstream')), 'the licence notice is installed');
  }, { install: true });
});

test('a proposal cannot ask for a revision other than the pinned one', async () => {
  await h.withRepo((target) => {
    assert.throws(() => propose(target, 'a'.repeat(64)), /pinned to a different archive digest/);
    assert.throws(() => h.handle({ schema_version: 1, action: 'prepare', target }) && propose(target, 'not-a-digest'), /not a SHA-256 digest/);
  }, { install: true });
});

test('approved apply fetches, verifies, patches, journals the bytes, and check enforces the receipt', async () => {
  await h.withRepo((target) => {
    pinFixture(target);
    withMirror(`file://${FIXTURE}`, () => {
      const proposed = propose(target, fixtureTar);
      assert.equal(fs.existsSync(path.join(target, '.rig/fetched')), false, 'proposing fetches nothing');
      const applied = apply(target, proposed);
      assert.equal(applied.phase, 'applied');
      const xvfb = 'browser-and-research/browser-automation/browse/src/xvfb.ts';
      assert.ok(fs.readFileSync(path.join(target, '.rig/fetched/gstack', xvfb)).equals(fs.readFileSync(path.join(SHELF, xvfb))), 'fetched+patched bytes equal the shipped patched bytes');
      const receipt = h.readJson(path.join(target, '.rig/fetched/gstack/receipt.json'));
      assert.equal(receipt.tar_sha256, fixtureTar);
      assert.deepEqual(receipt.patches.map((patch) => patch.id), ['RIG-135.2', 'RIG-135.3', 'RIG-135.1']);
      const journal = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8');
      assert.match(journal, /\.rig\/fetched\/gstack\/receipt\.json/);
      const checked = h.handle({ schema_version: 1, action: 'check', target, expected_revision: applied.revision });
      assert.deepEqual(checked.hard_failures, []);
      fs.writeFileSync(path.join(target, '.rig/fetched/gstack/receipt.json'), 'not json\n');
      const receiptFailed = h.handle({ schema_version: 1, action: 'check', target, expected_revision: checked.revision });
      assert.equal(receiptFailed.hard_failures.some((failure) => failure.path.endsWith('/receipt.json')), true, 'a malformed upstream receipt is a checked failure');
      fs.writeFileSync(path.join(target, '.rig/fetched/gstack/receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
      fs.appendFileSync(path.join(target, '.rig/fetched/gstack', xvfb), '// tampered\n');
      const failed = h.handle({ schema_version: 1, action: 'check', target, expected_revision: receiptFailed.revision });
      assert.equal(failed.hard_failures.some((failure) => failure.path.endsWith('xvfb.ts')), true);
    });
  }, { install: true });
});

test('an invalid digest or unavailable upstream refuses the whole apply and writes nothing', async () => {
  await h.withRepo((target) => {
    pinFixture(target);
    const proposed = propose(target, fixtureTar);
    const before = fs.readdirSync(path.join(target, '.rig')).sort();
    const bad = path.join(target, 'bad.tgz');
    fs.writeFileSync(bad, zlib.gzipSync(Buffer.from('x'.repeat(2048))));
    withMirror(`file://${bad}`, () => assert.throws(() => apply(target, proposed), /upstream fetch refused \(digest-mismatch\)/));
    withMirror('file:///no/such/mirror.tgz', () => assert.throws(() => apply(target, proposed), /upstream fetch refused \(upstream-unavailable\).*RIG_UPSTREAM_MIRROR_/));
    withMirror('http://insecure.invalid/x.tgz', () => assert.throws(() => apply(target, proposed), /upstream fetch refused \(upstream-unavailable\)/));
    assert.deepEqual(fs.readdirSync(path.join(target, '.rig')).sort(), before, 'no fetched tree or receipt was written');
    assert.equal(fs.existsSync(path.join(target, '.rig/fetched')), false);
    assert.equal(h.readJson(path.join(target, '.rig/state.json')).phase, 'proposed');
  }, { install: true });
});

test('an edited fetched file is a conflict on re-apply, not an overwrite', async () => {
  await h.withRepo((target) => {
    pinFixture(target);
    const proposed = propose(target, fixtureTar);
    fs.mkdirSync(path.join(target, '.rig/fetched/gstack/browser-and-research/browser-automation/browse/src'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/fetched/gstack/browser-and-research/browser-automation/browse/src/xvfb.ts'), 'user edit\n');
    withMirror(`file://${FIXTURE}`, () => assert.throws(() => apply(target, proposed), /conflicts with repository-owned path/));
  }, { install: true });
});
