'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { spawnSync } = require('node:child_process');
const { buildArchive, tarEntry } = require('./build-public-archive');
const { readTar } = require('../rig/lib/tar-read');

test('public archive is deterministic, digest complete and uses portable regular entries', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-ci-archive-'));
  try {
    const fixtures = {
      'package.json': '{"version":"1.2.3"}',
      'LICENSE': 'MIT licence fixture',
      'skills/rig/SKILL.md': '# Rig',
      'rig/bootstrap.sh': '#!/bin/sh\n',
      'rig/manifest.json': '{}',
      'rig/catalog/baseline/embedding.js': 'module.exports = {};',
      'rig/catalog/baseline/assets/potion-base-2m/model.json': '{}',
      [`rig/${'long/'.repeat(30)}runtime.js`]: 'long-name bytes',
      'rig/._finder': 'skip',
      'rig/node_modules/dep/index.js': 'skip',
    };
    for (const [rel, body] of Object.entries(fixtures)) {
      fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
      fs.writeFileSync(path.join(root, rel), body);
    }
    const first = buildArchive(root);
    const bytes = fs.readFileSync(first.file);
    const bootstrap = path.join(root, 'rig/bootstrap.sh');
    fs.utimesSync(bootstrap, new Date('2000-01-01'), new Date('2000-01-01'));
    const second = buildArchive(root);
    assert.equal(second.digest, first.digest, 'source timestamps must not affect archive bytes');
    assert.deepEqual(fs.readFileSync(second.file), bytes);
    assert.equal(fs.readFileSync(`${first.file}.sha256`, 'utf8').split(' ')[0], first.digest);
    const tar = zlib.gunzipSync(bytes);
    const files = readTar(tar);
    const manifest = JSON.parse(files.get('rig-archive.json'));
    assert.equal(files.has('rig/._finder'), false);
    assert.equal(files.has('rig/node_modules/dep/index.js'), false);
    assert.deepEqual(manifest.platforms, ['darwin', 'linux', 'win32']);
    assert.equal(Object.keys(manifest.files).length, files.size - 1);
    for (const [rel, digest] of Object.entries(manifest.files)) {
      assert.equal(crypto.createHash('sha256').update(files.get(rel)).digest('hex'), digest);
      assert.equal(files.get(rel).toString(), fixtures[rel]);
    }
    for (let offset = 0; offset < tar.length - 1024;) {
      const header = tar.subarray(offset, offset + 512);
      assert.equal(header[156], 48, 'only regular files may be emitted');
      assert.equal(parseInt(header.subarray(136, 147).toString(), 8), 0);
      const size = parseInt(header.subarray(124, 135).toString(), 8);
      const checksum = parseInt(header.subarray(148, 154).toString(), 8);
      assert.equal(checksum, header.reduce((sum, byte, index) => sum + (index >= 148 && index < 156 ? 32 : byte), 0));
      offset += 512 + Math.ceil(size / 512) * 512;
    }
    assert.throws(() => tarEntry(`root/${'a'.repeat(101)}`, { bytes: Buffer.alloc(0), mode: 0o644 }), /ustar limits/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('acceptance runner executes every file and preserves a failing exit and failure list', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-ci-runner-'));
  try {
    fs.mkdirSync(path.join(root, 'scripts'));
    fs.copyFileSync(path.join(__dirname, 'run-ai-sdlc.js'), path.join(root, 'scripts/run-ai-sdlc.js'));
    fs.mkdirSync(path.join(root, 'tests/ai-sdlc'), { recursive: true });
    fs.writeFileSync(path.join(root, 'tests/ai-sdlc/first.test.js'), "require('node:test')('first', () => {});\n");
    fs.writeFileSync(path.join(root, 'tests/ai-sdlc/second.test.js'), "require('node:test')('second fails', () => { throw new Error('regression fixture'); });\n");
    // Node marks test descendants to suppress nested --test discovery; launch
    // this CLI fixture as an ordinary command, with no authentication changes.
    const { NODE_TEST_CONTEXT, ...env } = process.env;
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/run-ai-sdlc.js')], { encoding: 'utf8', env });
    assert.equal(result.status, 1);
    const summary = JSON.parse(fs.readFileSync(path.join(root, '.context/ai-sdlc/result.json'), 'utf8'));
    assert.deepEqual(summary.counts, { tests: 2, pass: 1, fail: 1, cancelled: 0, skipped: 0, todo: 0 });
    assert.deepEqual(summary.failures, ['second fails']);
    assert.equal(summary.exit_code, 1);
    assert.match(fs.readFileSync(path.join(root, '.context/ai-sdlc/acceptance.tap'), 'utf8'), /regression fixture/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
