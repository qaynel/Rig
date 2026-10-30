'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, sha256, product } = require('./_harness');

const lockPath = path.join(ROOT, 'rig/upstreams/lock.json');

test('RB-SNAP-1 lock lists every vendored file and its matching SHA-256', () => {
  const { checkUpstreams } = product('scripts/check-upstreams.js');
  const result = checkUpstreams(ROOT);
  assert.equal(result.ok, true, JSON.stringify(result.failures));
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const listed = new Map(lock.upstreams.flatMap((u) => u.paths.map((p) => [path.join(ROOT, 'rig/upstreams', u.id, p.path), p.sha256])));
  for (const [file, expected] of listed) assert.equal(sha256(fs.readFileSync(file)), expected, file);
});

test('RB-SNAP-2 every upstream lock row has an allowed licence, inclusion flag, and reason', () => {
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  assert.ok(lock.upstreams.length > 0);
  for (const row of lock.upstreams) {
    assert.match(row.licence, /^(MIT|Apache-2\.0|BSD-2-Clause|BSD-3-Clause|ISC)$/);
    assert.equal(row.included, true);
    assert.ok(row.reason.trim(), row.id);
  }
});

test('RB-SNAP-3 network-bearing fixture hook fails with the hook path named', () => {
  const { checkUpstreams } = product('scripts/check-upstreams.js');
  const root = tempDir('rig-upstream-scan-');
  write(root, 'rig/upstreams/sample/hook.js', 'require("node:net").connect(80, "example.invalid");');
  write(root, 'rig/upstreams/lock.json', JSON.stringify({ upstreams: [] }));
  write(root, 'rig/upstreams/approved-executables.json', '[]');
  const result = checkUpstreams(root);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.path.includes('hook.js') && /network/i.test(failure.reason)), JSON.stringify(result.failures));
});

test('RB-SNAP-4 an unapproved harmless executable fails the supply-chain scan', () => {
  const { checkUpstreams } = product('scripts/check-upstreams.js');
  const root = tempDir('rig-upstream-allowlist-');
  write(root, 'rig/upstreams/sample/tool.js', 'process.stdout.write("ok");');
  write(root, 'rig/upstreams/lock.json', JSON.stringify({ upstreams: [] }));
  write(root, 'rig/upstreams/approved-executables.json', '[]');
  const result = checkUpstreams(root);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.path.includes('tool.js') && /approv/i.test(failure.reason)), JSON.stringify(result.failures));
});

test('RB-SNAP-5 size check reports the measured total and any cap overrun', () => {
  const { checkUpstreams } = product('scripts/check-upstreams.js');
  const root = tempDir('rig-upstream-size-');
  write(root, 'rig/upstreams/lock.json', JSON.stringify({ upstreams: [{ paths: [{ path: 'large.bin', bytes: 250 * 1024 * 1024 + 1, sha256: 'x' }] }] }));
  write(root, 'rig/upstreams/sample/large.bin', Buffer.from('x'));
  write(root, 'rig/upstreams/approved-executables.json', '[]');
  const result = checkUpstreams(root);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => /250|size|cap/i.test(failure.reason)), JSON.stringify(result.failures));
});

test('RB-SNAP-6 inventory retains downloaded upstream identity and exact pinned commit', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, '.context/rebuild/inventory.json'), 'utf8'));
  assert.equal(inventory.upstreams.length, 38);
  for (const upstream of inventory.upstreams) assert.match(upstream.commit, /^[0-9a-f]{40}$/i, upstream.id);
});

test('RB-SNAP-7 excluded or ineligible upstreams have a concrete written reason', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, '.context/rebuild/inventory.json'), 'utf8'));
  for (const upstream of inventory.upstreams) {
    assert.ok(typeof upstream.included === 'boolean', upstream.id);
    assert.ok(upstream.reason?.trim(), upstream.id);
    if (!upstream.included) assert.ok(upstream.reason.length > 12, upstream.id);
  }
});

test('RB-SNAP-8 included upstreams meet the recency, licence, and distinct-feature bar', () => {
  const { upstreams } = JSON.parse(fs.readFileSync(path.join(ROOT, '.context/rebuild/inventory.json'), 'utf8'));
  for (const upstream of upstreams.filter((row) => row.included)) {
    assert.match(upstream.licence, /^(MIT|Apache-2\.0|BSD-2-Clause|BSD-3-Clause|ISC)$/);
    assert.ok(new Date(upstream.lastPush) >= new Date('2026-04-27'), upstream.id);
    assert.ok(upstream.stars >= 1000 || upstream.curatedTopList, upstream.id);
    assert.ok(upstream.distinctFeature?.trim(), upstream.id);
  }
});
