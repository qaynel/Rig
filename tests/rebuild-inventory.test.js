'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const script = path.resolve(__dirname, '../scripts/rebuild/inventory.js');

function write(root, relativePath, content) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

test('inventory lists pieces with hashes and rejects unknown licences', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-inventory-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const fork = path.join(temp, 'fork');
  const zips = path.join(temp, 'zips');
  fs.mkdirSync(fork);
  fs.mkdirSync(zips);

  const mit = path.join(fork, 'skills', 'alice__mitpack');
  write(mit, 'LICENSE', 'MIT License\n\nPermission is hereby granted, free of charge, to any person obtaining a copy.');
  write(mit, 'skills/hello/SKILL.md', '---\nname: hello\ndescription: Says hello\n---\nDo the thing.\n');
  write(mit, 'agents/x.md', '# Agent X\n');
  write(mit, '.claude/settings.json', '{"hooks":{"PreToolUse":[{"matcher":"*","hooks":[{"type":"command","command":"echo hi"}]}]}}\n');

  const unknown = path.join(fork, 'skills', 'bob__unknownpack');
  write(unknown, 'LICENSE', 'All rights reserved.\n');
  write(unknown, 'README.md', 'Not a liftable piece.\n');

  const zip = path.join(zips, 'mitpack-main.zip');
  execFileSync('zip', ['-qr', zip, '.'], { cwd: mit });
  execFileSync('zip', ['-z', zip], { input: '0123456789abcdef0123456789abcdef01234567\n' });
  const unknownZip = path.join(zips, 'unknownpack-main.zip');
  execFileSync('zip', ['-qr', unknownZip, '.'], { cwd: unknown });
  execFileSync('zip', ['-z', unknownZip], { input: '89abcdef0123456789abcdef0123456789abcdef\n' });

  const out = path.join(temp, 'inventory.json');
  const result = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const inventory = JSON.parse(fs.readFileSync(out, 'utf8'));
  const pack = inventory.upstreams.find((upstream) => upstream.id === 'alice__mitpack');
  assert.ok(pack);
  assert.equal(pack.licence, 'MIT');
  assert.equal(pack.commit, '0123456789abcdef0123456789abcdef01234567');
  assert.deepEqual(pack.pieces.map((piece) => piece.kind).sort(), ['agent', 'hook', 'skill']);
  for (const piece of pack.pieces) {
    const file = path.join(mit, piece.path);
    assert.equal(piece.sha256, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
    assert.equal(piece.bytes, fs.statSync(file).size);
  }
  assert.equal(inventory.upstreams.find((upstream) => upstream.id === 'bob__unknownpack').licence, 'UNKNOWN');
});

test('inventory rejects an unpinned zip comment and a zip reused by two upstreams', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-inventory-invalid-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const fork = path.join(temp, 'fork');
  const zips = path.join(temp, 'zips');
  fs.mkdirSync(zips);
  const first = path.join(fork, 'one', 'alice__shared');
  const second = path.join(fork, 'two', 'bob__shared');
  write(first, 'README.md', 'first');
  write(second, 'README.md', 'second');
  const zip = path.join(zips, 'shared-main.zip');
  execFileSync('zip', ['-qr', zip, '.'], { cwd: first });
  execFileSync('zip', ['-z', zip], { input: '0123456789abcdef0123456789abcdef01234567\n' });

  const out = path.join(temp, 'inventory.json');
  const reused = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.notEqual(reused.status, 0);
  assert.match(reused.stderr, /more than one upstream/);

  fs.rmSync(path.join(fork, 'two'), { recursive: true, force: true });
  execFileSync('zip', ['-z', zip], { input: '\n' });
  const missingPin = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.notEqual(missingPin.status, 0);
  assert.match(missingPin.stderr, /40-character commit/);
});
