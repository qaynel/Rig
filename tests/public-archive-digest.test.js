'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const verifier = path.join(root, 'scripts/verify-public-archive-digest.js');

test('real-download evidence requires an independently configured digest before writing its sidecar', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-public-archive-'));
  try {
    const archive = path.join(dir, 'release.tar.gz');
    const bytes = Buffer.from('downloaded release bytes');
    fs.writeFileSync(archive, bytes);
    const expected = crypto.createHash('sha256').update(bytes).digest('hex');
    const run = (digest) => spawnSync(process.execPath, [verifier, archive], {
      encoding: 'utf8', env: { ...process.env, RIG_PUBLIC_ARCHIVE_SHA256: digest },
    });

    const missing = run('');
    assert.equal(missing.status, 2);
    assert.equal(fs.existsSync(`${archive}.sha256`), false);

    const mismatch = run('0'.repeat(64));
    assert.equal(mismatch.status, 1);
    assert.match(mismatch.stderr, /digest mismatch/);
    assert.equal(fs.existsSync(`${archive}.sha256`), false);

    const verified = run(expected);
    assert.equal(verified.status, 0, verified.stderr);
    assert.equal(fs.readFileSync(`${archive}.sha256`, 'utf8'), `${expected}  release.tar.gz\n`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
