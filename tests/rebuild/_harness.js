'use strict';

// Shared fixture helpers for the isolated rebuild acceptance lane.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');

function product(relative) {
  const file = path.join(ROOT, relative);
  assert.ok(fs.existsSync(file), `missing rebuild interface: ${relative}`);
  return require(file);
}

function tempDir(prefix = 'rig-rebuild-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function write(root, relative, content) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.isBuffer(content) ? content : String(content));
  return file;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  assert.ifError(result.error);
  return result;
}

module.exports = { ROOT, assert, fs, os, path, product, tempDir, write, sha256, run };
