/**
 * Path safety tests for containedPath function
 * Verifies protection against path traversal attacks
 * Related: RP-06 from second-round design review
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { containedPath } = require('../rig/lib/path-safety.js');

test('containedPath rejects parent directory traversal', (t) => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-path-test-'));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));

  assert.throws(
    () => containedPath(repo, '../../../etc/passwd'),
    /escapes target/i,
    'Should reject path escaping via parent directory references'
  );
});

test('containedPath rejects absolute path', (t) => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-path-test-'));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));

  assert.throws(
    () => containedPath(repo, '/absolute/path'),
    /unsafe repository path/i,
    'Should reject absolute path that escapes repo boundary'
  );
});

test('containedPath resolves legitimate nested path', (t) => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-path-test-'));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));

  const result = containedPath(repo, 'a/b/../../c');
  // containedPath uses fs.realpathSync internally, so compare using realpath
  const expected = path.join(fs.realpathSync(repo), 'c');
  assert.strictEqual(
    result,
    expected,
    'Should correctly resolve legitimate path with parent refs that stay within boundary'
  );
});
