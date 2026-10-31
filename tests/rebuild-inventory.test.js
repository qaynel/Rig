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
  write(mit, 'LICENSE', 'MIT License\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.');
  write(mit, 'skills/hello/SKILL.md', '---\nname: hello\ndescription: Says hello\n---\nDo the thing.\n');
  write(mit, 'skills/test-driven-development/SKILL.md', '---\nname: test-driven-development\ndescription: Test-first development\n---\n');
  write(mit, 'tests/fixtures/test-skill/SKILL.md', '---\nname: test-fixture\ndescription: Fixture only\n---\n');
  write(mit, 'agents/x.md', '# Agent X\n');
  write(mit, '.claude/settings.json', '{"hooks":{"PreToolUse":[{"matcher":"*","hooks":[{"type":"command","command":"echo hi"}]}]}}\n');

  const unknown = path.join(fork, 'skills', 'bob__unknownpack');
  write(unknown, 'LICENSE', 'All rights reserved.\n');
  write(unknown, 'components/example/LICENSE', 'MIT License\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.');
  write(unknown, 'README.md', 'Not a liftable piece.\n');

  const falseMit = path.join(fork, 'skills', 'charlie__falsemitpack');
  write(falseMit, 'LICENSE', 'MIT License\nAll rights reserved.\n');
  write(falseMit, 'README.md', 'A title is not a licence grant.\n');

  const zip = path.join(zips, 'mitpack-main.zip');
  execFileSync('zip', ['-qr', zip, '.'], { cwd: mit });
  execFileSync('zip', ['-z', zip], { input: '0123456789abcdef0123456789abcdef01234567\n' });
  const unknownZip = path.join(zips, 'unknownpack-main.zip');
  execFileSync('zip', ['-qr', unknownZip, '.'], { cwd: unknown });
  execFileSync('zip', ['-z', unknownZip], { input: '89abcdef0123456789abcdef0123456789abcdef\n' });
  const falseMitZip = path.join(zips, 'falsemitpack-main.zip');
  execFileSync('zip', ['-qr', falseMitZip, '.'], { cwd: falseMit });
  execFileSync('zip', ['-z', falseMitZip], { input: 'fedcba9876543210fedcba9876543210fedcba98\n' });

  const out = path.join(temp, 'inventory.json');
  const result = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const inventory = JSON.parse(fs.readFileSync(out, 'utf8'));
  const pack = inventory.upstreams.find((upstream) => upstream.id === 'alice__mitpack');
  assert.ok(pack);
  assert.equal(pack.licence, 'MIT');
  assert.equal(pack.commit, '0123456789abcdef0123456789abcdef01234567');
  assert.deepEqual(pack.pieces.map((piece) => piece.kind).sort(), ['agent', 'hook', 'skill']);
  assert.ok(!pack.pieces.some((piece) => piece.name === 'test-driven-development'));
  assert.ok(!pack.pieces.some((piece) => piece.name === 'test-fixture'));
  for (const piece of pack.pieces) {
    const file = path.join(mit, piece.path);
    assert.equal(piece.sha256, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
    assert.equal(piece.bytes, fs.statSync(file).size);
  }
  assert.equal(inventory.upstreams.find((upstream) => upstream.id === 'bob__unknownpack').licence, 'UNKNOWN');
  assert.equal(inventory.upstreams.find((upstream) => upstream.id === 'charlie__falsemitpack').licence, 'UNKNOWN');
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
  for (const comment of ['', 'not-a-commit', '0123456789abcdef0123456789abcdef01234567\n89abcdef0123456789abcdef0123456789abcdef']) {
    execFileSync('zip', ['-z', zip], { input: `${comment}\n` });
    const invalidPin = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
    assert.notEqual(invalidPin.status, 0);
    assert.match(invalidPin.stderr, /40-character commit/);
  }
});

test('inventory follows only upstream-confined symlinks and rejects symlinked roots', (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-inventory-symlink-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const fork = path.join(temp, 'fork');
  const zips = path.join(temp, 'zips');
  const repo = path.join(fork, 'skills', 'alice__symlinkpack');
  fs.mkdirSync(zips, { recursive: true });
  write(repo, 'LICENSE', 'All rights reserved.\n');
  write(repo, 'hook-source.sh', 'printf hook\n');
  write(repo, 'docs/CLAUDE.md', '# linked rule\n');
  fs.mkdirSync(path.join(repo, 'hooks'), { recursive: true });
  fs.symlinkSync('../hook-source.sh', path.join(repo, 'hooks', 'pre-commit.sh'));
  fs.symlinkSync('docs', path.join(repo, 'rules'));
  const zip = path.join(zips, 'symlinkpack-main.zip');
  execFileSync('zip', ['-qr', zip, '.'], { cwd: repo });
  execFileSync('zip', ['-z', zip], { input: '0123456789abcdef0123456789abcdef01234567\n' });

  const out = path.join(temp, 'inventory.json');
  const confined = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.equal(confined.status, 0, confined.stderr || confined.stdout);
  const hook = JSON.parse(fs.readFileSync(out, 'utf8')).upstreams[0].pieces.find((piece) => piece.path === 'hooks/pre-commit.sh');
  assert.equal(hook.kind, 'hook');
  assert.equal(hook.sha256, crypto.createHash('sha256').update('printf hook\n').digest('hex'));
  assert.ok(JSON.parse(fs.readFileSync(out, 'utf8')).upstreams[0].pieces.some((piece) => piece.path === 'rules/CLAUDE.md' && piece.kind === 'rule'));

  fs.symlinkSync('..', path.join(repo, 'docs', 'cycle'));
  const cycle = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.notEqual(cycle.status, 0);
  assert.match(cycle.stderr, /Symlink cycle inside upstream/);
  fs.unlinkSync(path.join(repo, 'docs', 'cycle'));

  const outside = path.join(temp, 'outside.sh');
  fs.writeFileSync(outside, 'do not read\n');
  fs.symlinkSync(outside, path.join(repo, 'hooks', 'escape.sh'));
  const escaped = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.notEqual(escaped.status, 0);
  assert.match(escaped.stderr, /Symlink escapes upstream: hooks\/escape\.sh/);
  fs.unlinkSync(path.join(repo, 'hooks', 'escape.sh'));

  const linkedCategory = path.join(fork, 'linked-category');
  fs.symlinkSync(path.join(fork, 'skills'), linkedCategory);
  const categoryRoot = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.notEqual(categoryRoot.status, 0);
  assert.match(categoryRoot.stderr, /Symlinked upstream category/);
  fs.unlinkSync(linkedCategory);

  const linkedRepo = path.join(fork, 'skills', 'bob__linkpack');
  fs.symlinkSync(repo, linkedRepo);
  const repoRoot = spawnSync(process.execPath, [script, '--fork', fork, '--zips', zips, '--out', out], { encoding: 'utf8' });
  assert.notEqual(repoRoot.status, 0);
  assert.match(repoRoot.stderr, /Symlinked upstream root/);
});
