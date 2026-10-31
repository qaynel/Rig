'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, sha256, product } = require('./_harness');

test('RB-OVL-1 all overlays apply cleanly and preserve pinned upstream bytes', () => {
  const upstreamsDir = path.join(ROOT, 'rig/upstreams');
  const overlaysDir = path.join(ROOT, 'rig/overlays');
  const patchFiles = listFiles(overlaysDir).filter((file) => file.endsWith('.patch'));
  assert.ok(patchFiles.length > 0, 'the selected snapshot must include at least one ruled overlay');
  const inputFiles = listFiles(upstreamsDir).filter((file) => !['lock.json', 'role-map.json', 'approved-executables.json'].includes(path.basename(file)) || path.dirname(file) !== upstreamsDir);
  assert.ok(inputFiles.length > 0, 'the pinned upstream payload must contain files');
  const applyOverlays = product('scripts/apply-overlays.js').applyOverlays;
  const before = new Map();
  for (const file of inputFiles) before.set(file, sha256(fs.readFileSync(file)));
  const outDir = tempDir('rig-overlay-out-');
  const result = applyOverlays({ upstreamsDir, overlaysDir, outDir });
  assert.deepEqual(result.failed, []);
  assert.deepEqual([...result.applied].sort(), patchFiles.map((file) => path.relative(overlaysDir, file)).sort());
  for (const [file, digest] of before) assert.equal(sha256(fs.readFileSync(file)), digest, file);
  const patched = new Set(patchFiles.flatMap((file) => [...fs.readFileSync(file, 'utf8').matchAll(/^\+\+\+ b\/(.+)$/gm)].map((match) => match[1])));
  const untouched = [...before.keys()].filter((file) => !patched.has(path.relative(upstreamsDir, file)));
  assert.ok(untouched.length > 0, 'fixture must include at least one unpatched pinned file');
  for (const source of untouched) {
    const rel = path.relative(upstreamsDir, source);
    const output = path.join(outDir, rel);
    assert.ok(fs.existsSync(output), `overlay output omitted untouched pinned file ${rel}`);
    assert.deepEqual(fs.readFileSync(output), fs.readFileSync(source), `overlay output changed untouched pinned file ${rel}`);
  }
});

test('RB-OVL-2 changed patched context names exactly the failing patch and source file', () => {
  const applyOverlays = product('scripts/apply-overlays.js').applyOverlays;
  const root = tempDir('rig-overlay-swap-');
  write(root, 'upstreams/sample/source.md', 'line moved\n');
  write(root, 'overlays/sample/01-change.patch', '# reason: focused wording\n# ruling: C1\n--- a/source.md\n+++ b/source.md\n@@ -1 +1 @@\n-original\n+changed\n');
  const result = applyOverlays({ upstreamsDir: path.join(root, 'upstreams'), overlaysDir: path.join(root, 'overlays'), outDir: path.join(root, 'out') });
  assert.equal(result.failed.length, 1);
  assert.equal(result.failed[0].patch, '01-change.patch');
  assert.equal(result.failed[0].file, 'source.md');
});

test('RB-OVL-3 every overlay carries a non-empty reason and a known ruling', () => {
  const register = fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/conflict-register.md'), 'utf8');
  const roleMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/role-map.json'), 'utf8'));
  const rulingIds = new Set([...register.matchAll(/\bC\d+\b/g)].map(([id]) => id));
  for (const row of roleMap.roles || []) rulingIds.add(`role-map:${row.id}`);
  const overlayFiles = listFiles(path.join(ROOT, 'rig/overlays')).filter((file) => file.endsWith('.patch'));
  assert.ok(overlayFiles.length > 0, 'the selected snapshot must include ruled overlay patches');
  for (const file of overlayFiles) {
    const header = fs.readFileSync(file, 'utf8').split('\n').slice(0, 2).join('\n');
    assert.match(header, /^# reason: .+\n# ruling: .+$/);
    assert.ok(rulingIds.has(header.match(/^# ruling: (.+)$/m)[1]), file);
  }
});

test('RB-OVL-4 every pinned file matches its lock digest', () => {
  const lockFile = path.join(ROOT, 'rig/upstreams/lock.json');
  assert.ok(fs.existsSync(lockFile), 'the release snapshot must include its upstream lock');
  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  const entries = lock.upstreams.flatMap((upstream) => upstream.paths.map((entry) => ({ upstream: upstream.id, ...entry })));
  assert.ok(entries.length > 0, 'the lock must include at least one pinned payload path');
  const actual = listFiles(path.join(ROOT, 'rig/upstreams')).filter((file) => {
    const rel = path.relative(path.join(ROOT, 'rig/upstreams'), file);
    return rel.includes(path.sep) || !['lock.json', 'role-map.json', 'approved-executables.json'].includes(path.basename(file));
  });
  const actualNames = actual.map((file) => path.relative(path.join(ROOT, 'rig/upstreams'), file)).sort();
  const lockedNames = entries.map((entry) => `${entry.upstream}/${entry.path}`).sort();
  assert.deepEqual(lockedNames, actualNames, 'the lock must enumerate exactly every pinned payload path');
  for (const entry of entries) {
    const file = path.join(ROOT, 'rig/upstreams', entry.upstream, entry.path);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.length, entry.bytes, file);
    assert.equal(sha256(bytes), entry.sha256, file);
  }
  const { checkUpstreams } = product('scripts/check-upstreams.js');
  const result = checkUpstreams(ROOT);
  assert.equal(result.ok, true, JSON.stringify(result.failures));
});

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}
