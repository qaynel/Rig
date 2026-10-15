'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const root = path.resolve(__dirname, '../..');
test('public installer rejects a candidate with mismatched bytes before extraction', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-artifact-'));
  try {
    const artifact = path.join(dir, 'candidate.tar.gz');
    fs.writeFileSync(artifact, 'untrusted bytes');
    const result = spawnSync('sh', [path.join(root, 'install.sh'), '--candidate-artifact', artifact, '--candidate-sha', 'a'.repeat(40), '--candidate-digest', '0'.repeat(64), '--target', dir], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /candidate archive digest mismatch/);
    assert.equal(fs.existsSync(path.join(dir, '.rig')), false);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
