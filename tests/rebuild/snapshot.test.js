'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, sha256, product } = require('./_harness');

const lockPath = path.join(ROOT, 'rig/upstreams/lock.json');
const upstreamRoot = path.join(ROOT, 'rig/upstreams');

function fixture(root, files) {
  const upstream = { id: 'sample', repo: 'sample/sample', commit: 'a'.repeat(40), commitDate: '2026-10-01T00:00:00Z', licence: 'MIT', stars: 1000, lastPush: '2026-10-01T00:00:00Z', included: true, reason: 'fixture source', paths: [] };
  for (const [relative, value] of Object.entries(files)) {
    const bytes = Buffer.from(value.content);
    const file = write(root, `rig/upstreams/sample/${relative}`, bytes);
    if (value.executable) fs.chmodSync(file, 0o755);
    upstream.paths.push({ path: relative, sha256: sha256(bytes), bytes: bytes.length, role: 'sample-role', kind: 'hook' });
  }
  write(root, 'rig/upstreams/lock.json', JSON.stringify({ upstreams: [upstream] }));
  write(root, 'rig/upstreams/approved-executables.json', '[]');
  write(root, 'rig/upstreams/role-map.json', '{"roles":[]}');
  return upstream;
}

test('RB-SNAP-1 lock lists exactly every vendored file with matching byte count and SHA-256', () => {
  assert.ok(fs.existsSync(lockPath), 'the release snapshot must include its upstream lock');
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const lockedEntries = lock.upstreams.flatMap((u) => u.paths.map((p) => ({ upstream: u.id, ...p })));
  const lockedNames = lockedEntries.map((p) => `${p.upstream}/${p.path}`);
  assert.equal(new Set(lockedNames).size, lockedNames.length, 'lock must not duplicate a payload path');
  const listed = new Map(lockedEntries.map((p) => {
    assert.ok(!path.isAbsolute(p.path) && !p.path.split(/[\\/]/).includes('..'), `${p.upstream}/${p.path}: unsafe locked path`);
    const file = path.resolve(upstreamRoot, p.upstream, p.path);
    assert.ok(file.startsWith(`${path.resolve(upstreamRoot)}${path.sep}`), `${p.upstream}/${p.path}: path escapes upstream root`);
    return [file, p];
  }));
  const metadata = new Set(['lock.json', 'role-map.json', 'approved-executables.json']);
  const discovered = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (dir !== upstreamRoot || !metadata.has(entry.name)) discovered.push(file);
    }
  };
  walk(upstreamRoot);
  assert.ok(discovered.length > 0, 'snapshot must contain vendored payload files');
  assert.deepEqual([...listed.keys()].sort(), discovered.sort(), 'lock paths must equal discovered vendored payload paths');
  for (const [file, entry] of listed) {
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.length, entry.bytes, `${file}: byte count`);
    assert.equal(sha256(bytes), entry.sha256, file);
  }
  const { checkUpstreams } = product('scripts/check-upstreams.js');
  const result = checkUpstreams(ROOT);
  assert.equal(result.ok, true, JSON.stringify(result.failures));
});

test('RB-SNAP-2 lock validates allowed licences, inclusion flags, reasons, and excluded payload absence', () => {
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  assert.ok(lock.upstreams.length > 0);
  for (const row of lock.upstreams) {
    assert.equal(typeof row.included, 'boolean');
    assert.ok(row.reason.trim(), row.id);
    if (row.included) assert.match(row.licence, /^(MIT|Apache-2\.0|BSD-2-Clause|BSD-3-Clause|ISC)$/);
    else assert.deepEqual(row.paths, [], `${row.id}: excluded upstream must ship no payload paths`);
  }
  assert.ok(lock.upstreams.some((row) => row.included && row.paths.length > 0), 'at least one included upstream must ship payload');
});

test('RB-SNAP-3 valid locked fixture with network-bearing hook fails and names the hook path', () => {
  const { checkUpstreams } = product('scripts/check-upstreams.js');
  const root = tempDir('rig-upstream-scan-');
  fixture(root, { 'hook.js': { content: 'require("node:net").connect(80, "example.invalid");', executable: true } });
  const result = checkUpstreams(root);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.path.includes('hook.js') && /network/i.test(failure.reason)), JSON.stringify(result.failures));
});

test('RB-SNAP-4 valid locked fixture with an unapproved harmless executable fails the safety scan', () => {
  const { checkUpstreams } = product('scripts/check-upstreams.js');
  const root = tempDir('rig-upstream-allowlist-');
  fixture(root, { 'tool.js': { content: 'process.stdout.write("ok");', executable: true } });
  const result = checkUpstreams(root);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.path.includes('tool.js') && /approv/i.test(failure.reason)), JSON.stringify(result.failures));
});

test('RB-SNAP-5 size check reports measured payload plus local model bytes and cap overrun', () => {
  const { checkUpstreams, DEFAULT_MAX_BYTES } = product('scripts/check-upstreams.js');
  const root = tempDir('rig-upstream-size-');
  assert.equal(DEFAULT_MAX_BYTES, 250 * 1024 * 1024);
  fixture(root, { 'piece.txt': { content: 'xy', executable: false } });
  write(root, 'rig/catalog/baseline/assets/potion-base-2m/model.bin', Buffer.from('abc'));
  const result = checkUpstreams(root, { maxBytes: 4 });
  assert.equal(result.measuredBytes, 5);
  assert.equal(result.maxBytes, 4);
  assert.equal(result.overrunBytes, 1);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => /size|cap/i.test(failure.reason)), JSON.stringify(result.failures));
});

test('RB-SNAP-6 inventory retains upstream identity and exact pinned commits', () => {
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  assert.equal(lock.upstreams.length, 38);
  for (const upstream of lock.upstreams) assert.match(upstream.commit, /^[0-9a-f]{40}$/i, upstream.id);
});

test('RB-SNAP-7 excluded upstreams have a reason and ship no payload', () => {
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  for (const upstream of lock.upstreams) {
    assert.equal(typeof upstream.included, 'boolean', upstream.id);
    assert.ok(upstream.reason?.trim(), upstream.id);
    if (!upstream.included) {
      assert.ok(upstream.reason.length > 12, upstream.id);
      assert.deepEqual(upstream.paths, [], `${upstream.id}: excluded paths must not ship`);
    }
  }
});

test('RB-SNAP-8 included upstreams meet pin eligibility and owners carry source-grounded unique capability evidence', () => {
  const { upstreams } = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/role-map.json'), 'utf8')).roles;
  const selected = new Set();
  for (const role of roles) {
    if (role.owner?.upstream && role.owner?.path) selected.add(`${role.owner.upstream}/${role.owner.path}`);
    for (const piece of role.merged || []) selected.add(`${piece.upstream}/${piece.path}`);
  }
  for (const upstream of upstreams.filter((row) => row.included)) {
    assert.match(upstream.licence, /^(MIT|Apache-2\.0|BSD-2-Clause|BSD-3-Clause|ISC)$/);
    assert.ok(new Date(upstream.commitDate) >= new Date('2026-04-27'), `${upstream.id}: pinned commit predates cutoff`);
    assert.ok(upstream.stars >= 1000 || upstream.curatedTopList || /official benchmark list|curated top list/i.test(upstream.reason), upstream.id);
    const selectedPaths = upstream.paths.filter((entry) => entry.role);
    assert.ok(selectedPaths.length > 0, `${upstream.id}: included entry has no selected pieces`);
    for (const entry of selectedPaths) assert.ok(selected.has(`${upstream.id}/${entry.path}`), `${upstream.id}/${entry.path} missing from role map`);
  }
  for (const role of roles) {
    const owner = role.owner;
    const upstream = upstreams.find((row) => row.id === owner?.upstream && row.included);
    assert.ok(upstream, `${role.id}: owner upstream must be included`);
    const piece = upstream.paths.find((row) => row.path === owner.path && row.role === role.id);
    assert.ok(piece, `${role.id}: owner piece must be pinned to that role`);
    const evidence = owner.uniqueCapabilityEvidence;
    assert.ok(evidence?.capability?.trim() && evidence?.excerpt?.trim(), `${role.id}: missing source-grounded unique capability evidence`);
    assert.equal(evidence.sourceSha256, piece.sha256, `${role.id}: evidence must bind to pinned source bytes`);
    const source = fs.readFileSync(path.join(upstreamRoot, owner.upstream, owner.path), 'utf8');
    assert.ok(source.includes(evidence.excerpt), `${role.id}: evidence excerpt does not occur in pinned source`);
  }
});
