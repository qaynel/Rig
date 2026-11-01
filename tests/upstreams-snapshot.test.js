'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { checkUpstreams } = require('../scripts/check-upstreams');
const { verifyUpstreamSource } = require('../scripts/rebuild/verify-upstream-source');

test('installed immutable kit retains every included pinned source file, including templates', () => {
  const lock = JSON.parse(fs.readFileSync(path.join(__dirname, '../rig/upstreams/lock.json'), 'utf8'));
  const { entries } = require('../rig/lib/baseline-payload');
  const packaged = new Set(entries.filter((entry) => entry.to.startsWith('.rig/kit/rig/upstreams/')).map((entry) => entry.from.replace(/^(?:\.\.\/)*kit\/rig\//, '').replace(/^upstreams\//, '')));
  for (const upstream of lock.upstreams.filter((row) => row.included)) {
    for (const file of upstream.paths) assert.ok(packaged.has(`${upstream.id}/${file.path}`), `missing packaged pinned source ${upstream.id}/${file.path}`);
  }
  assert.ok(lock.upstreams.some((row) => row.included && row.paths.some((file) => file.path.endsWith('.tmpl'))));
});

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-upstream-fixture-'));
  const payload = [];
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(root, 'rig/upstreams/sample', name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    payload.push({ path: name, sha256: crypto.createHash('sha256').update(content).digest('hex'), bytes: Buffer.byteLength(content), role: 'sample-role', kind: 'hook' });
  }
  fs.mkdirSync(path.join(root, 'rig/upstreams'), { recursive: true });
  fs.writeFileSync(path.join(root, 'rig/upstreams/lock.json'), JSON.stringify({ upstreams: [{ id: 'sample', repo: 'sample/sample', commit: 'a'.repeat(40), commitDate: '2026-10-01T00:00:00Z', licence: 'MIT', stars: 1000, lastPush: '2026-10-01T00:00:00Z', included: true, reason: 'fixture', paths: payload }] }));
  fs.writeFileSync(path.join(root, 'rig/upstreams/approved-executables.json'), '[]');
  fs.writeFileSync(path.join(root, 'rig/upstreams/role-map.json'), '{"roles":[]}');
  fs.mkdirSync(path.join(root, 'rig/catalog/baseline/assets/potion-base-2m'), { recursive: true });
  return root;
}

test('checkUpstreams identifies a network-bearing executable by its vendored path', (t) => {
  const root = fixture({ 'hooks/net.js': 'require("node:net").connect(80, "invalid.example");' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'rig/upstreams/sample/hooks/net.js');
  fs.chmodSync(file, 0o755);
  const result = checkUpstreams(root);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((item) => item.path.endsWith('/hooks/net.js') && /network/i.test(item.reason)));
  assert.ok(result.failures.some((item) => item.path.endsWith('/hooks/net.js') && /approv/i.test(item.reason)));
});

test('checkUpstreams refuses a path whose bytes no longer match the locked digest', (t) => {
  const root = fixture({ 'piece.md': 'pinned bytes' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'rig/upstreams/sample/piece.md'), 'changed bytes');
  const result = checkUpstreams(root);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((item) => item.path.endsWith('/piece.md') && /sha-256/i.test(item.reason)));
});

test('checkUpstreams reports malformed lock schemas instead of throwing', (t) => {
  const root = fixture({ 'piece.md': 'pinned bytes' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'rig/upstreams/lock.json'), '{"upstreams":[null]}');
  const result = checkUpstreams(root);
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((item) => /row must be an object/.test(item.reason)));
});

test('checkUpstreams rejects an upstream path that escapes its source directory', (t) => {
  const root = fixture({ 'piece.md': 'pinned bytes' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const lockFile = path.join(root, 'rig/upstreams/lock.json');
  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  lock.upstreams[0].id = '../outside';
  fs.writeFileSync(lockFile, JSON.stringify(lock));
  const result = checkUpstreams(root);
  assert.ok(result.failures.some((item) => /unsafe upstream id/.test(item.reason)));
});

test('checkUpstreams rejects symlinked upstream files', (t) => {
  const root = fixture({ 'piece.md': 'pinned bytes' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'rig/upstreams/sample/piece.md');
  fs.rmSync(file);
  fs.symlinkSync(path.join(root, 'outside.txt'), file);
  fs.writeFileSync(path.join(root, 'outside.txt'), 'pinned bytes');
  const result = checkUpstreams(root);
  assert.ok(result.failures.some((item) => item.path.endsWith('/piece.md') && /symlink/i.test(item.reason)));
});

test('checkUpstreams validates the pinned Git blob digest when present', (t) => {
  const root = fixture({ 'piece.md': 'pinned bytes' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const lockFile = path.join(root, 'rig/upstreams/lock.json');
  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  lock.upstreams[0].paths[0].gitBlob = '0'.repeat(40);
  fs.writeFileSync(lockFile, JSON.stringify(lock));
  const result = checkUpstreams(root);
  assert.ok(result.failures.some((item) => /pinned Git blob mismatch/.test(item.reason)));
});

test('source verifier resolves a pinned parent symlink and repairs bytes from a local Git commit', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-upstream-git-fixture-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const source = path.join(temp, 'source');
  const root = path.join(temp, 'snapshot');
  fs.mkdirSync(source); fs.mkdirSync(root);
  execFileSync('git', ['init', '-q', source]);
  execFileSync('git', ['-C', source, 'config', 'user.name', 'Snapshot Test']);
  execFileSync('git', ['-C', source, 'config', 'user.email', 'snapshot@example.invalid']);
  const content = Buffer.from('source bytes from the pinned blob');
  const canonical = path.join(source, '.canonical/skills/SKILL.md');
  fs.mkdirSync(path.dirname(canonical), { recursive: true }); fs.writeFileSync(canonical, content);
  fs.symlinkSync('.canonical', path.join(source, '.opencode'), 'dir');
  execFileSync('git', ['-C', source, 'add', '.']); execFileSync('git', ['-C', source, '-c', 'core.hooksPath=/dev/null', 'commit', '-qm', 'fixture']);
  const commit = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const vendored = path.join(root, 'rig/upstreams/sample/.opencode/skills/SKILL.md');
  fs.mkdirSync(path.dirname(vendored), { recursive: true }); fs.writeFileSync(vendored, 'stale bytes');
  fs.mkdirSync(path.dirname(path.join(root, 'rig/upstreams/lock.json')), { recursive: true });
  fs.writeFileSync(path.join(root, 'rig/upstreams/lock.json'), JSON.stringify({ upstreams: [{ id: 'sample', repo: 'sample/sample', commit, included: true, paths: [{ path: '.opencode/skills/SKILL.md', bytes: 11, sha256: '0'.repeat(64) }] }] }));
  const result = verifyUpstreamSource(root, { repair: true, repositoryUrl: () => source });
  assert.equal(result.ok, true, JSON.stringify(result.failures));
  assert.deepEqual(fs.readFileSync(vendored), content);
  const locked = JSON.parse(fs.readFileSync(path.join(root, 'rig/upstreams/lock.json'), 'utf8')).upstreams[0].paths[0];
  assert.equal(locked.canonicalSourcePath, '.canonical/skills/SKILL.md');
  assert.equal(locked.sha256, crypto.createHash('sha256').update(content).digest('hex'));
});

test('source verifier rejects a lock path that could escape during repair', (t) => {
  const root = fixture({ 'piece.md': 'pinned bytes' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'rig/upstreams/lock.json');
  const lock = JSON.parse(fs.readFileSync(file, 'utf8'));
  lock.upstreams[0].paths[0].path = '../outside.txt';
  fs.writeFileSync(file, JSON.stringify(lock));
  const result = verifyUpstreamSource(root, { repositoryUrl: () => { throw new Error('unsafe lock must fail before any source access'); } });
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((item) => /unsafe locked path/.test(item.reason)));
});

