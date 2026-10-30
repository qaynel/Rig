'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, sha256, product } = require('./_harness');

test('RB-OVL-1 all overlays apply cleanly and preserve pinned upstream bytes', () => {
  const applyOverlays = product('scripts/apply-overlays.js').applyOverlays;
  const before = new Map();
  for (const file of listFiles(path.join(ROOT, 'rig/upstreams'))) before.set(file, sha256(fs.readFileSync(file)));
  const result = applyOverlays({ upstreamsDir: path.join(ROOT, 'rig/upstreams'), overlaysDir: path.join(ROOT, 'rig/overlays'), outDir: tempDir('rig-overlay-out-') });
  assert.deepEqual(result.failed, []);
  for (const [file, digest] of before) assert.equal(sha256(fs.readFileSync(file)), digest, file);
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
  for (const file of listFiles(path.join(ROOT, 'rig/overlays'))) {
    if (!file.endsWith('.patch')) continue;
    const header = fs.readFileSync(file, 'utf8').split('\n').slice(0, 2).join('\n');
    assert.match(header, /^# reason: .+\n# ruling: .+$/);
    assert.ok(rulingIds.has(header.match(/^# ruling: (.+)$/m)[1]), file);
  }
});

test('RB-OVL-4 every pinned file matches its lock digest', () => {
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
