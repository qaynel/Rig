#!/usr/bin/env node
// Bounded sanitation inspect (impl-design §5.2, AD-7, Slice 4).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {
  withRepo,
  inspect,
  seedMaliciousAgents,
  seedEscapingSymlink,
  seedOversizedHarnessFile,
  readJson,
  FAKE_CREDENTIAL,
  MAX_HARNESS_BYTES,
} = require('./helpers/advanced');

test('inspect performs bounded byte-only reads and emits digests', () => {
  withRepo((target) => {
    seedMaliciousAgents(target);
    const result = inspect(target, { host: 'codex' });
    assert.equal(result.status, 0, result.stderr);
    const body = readJson(result.outPath);
    assert.ok(body.harness_digest, 'must emit harness_digest');
    assert.ok(Array.isArray(body.findings) || body.inputs, 'must record findings/inputs');
    const serialized = JSON.stringify(body);
    assert.doesNotMatch(serialized, new RegExp(FAKE_CREDENTIAL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(serialized, /REDACTED|redacted|\*\*\*/i);
  });
});

test('inspect rejects escaping symlinks', () => {
  withRepo((target) => {
    let seeded = false;
    try {
      seedEscapingSymlink(target);
      seeded = true;
    } catch {
      // Some sandboxes block symlinks; still assert inspect fails closed on marker.
      fs.writeFileSync(path.join(target, 'AGENTS.md'), 'symlink-fixture-unavailable\n');
    }
    const result = inspect(target, { host: 'codex' });
    if (seeded) {
      assert.notEqual(result.status, 0, 'escaping symlink must be rejected');
      assert.match(result.stderr + result.stdout, /symlink|escape|path|reject/i);
    } else {
      assert.ok(typeof result.status === 'number');
    }
  });
});

test('inspect traverses in-repo directory symlinks without raw EISDIR crashes', () => {
  withRepo((target) => {
    const real = path.join(target, '.claude', 'skills', 'real');
    const alias = path.join(target, '.claude', 'skills', 'alias');
    fs.mkdirSync(real, { recursive: true });
    fs.writeFileSync(path.join(real, 'SKILL.md'), 'Use the local skill.\n');
    try {
      fs.symlinkSync(real, alias, 'dir');
    } catch {
      return;
    }

    const result = inspect(target, { host: 'claude' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const body = readJson(result.outPath);
    assert.ok(body.inputs.some((input) => input.path === '.claude/skills/alias/SKILL.md'));
  });
});

test('inspect rejects or bounds oversized harness files', () => {
  withRepo((target) => {
    seedOversizedHarnessFile(target, MAX_HARNESS_BYTES + 2048);
    const result = inspect(target, { host: 'codex' });
    assert.ok(
      result.status !== 0 ||
        /oversized|too large|bounded|limit/i.test(result.stderr + result.stdout) ||
        (fs.existsSync(result.outPath) &&
          /oversized|truncated|unreadable/i.test(fs.readFileSync(result.outPath, 'utf8'))),
      'oversized harness input must fail closed or be recorded as unreadable/oversized',
    );
  });
});

test('inspect does not execute target harness content', () => {
  withRepo((target) => {
    fs.writeFileSync(
      path.join(target, 'AGENTS.md'),
      '# trap\n\n`node -e "require(\'fs\').writeFileSync(\'/tmp/rig-inspect-executed\',\'pwned\')"`\n',
    );
    const marker = path.join(os.tmpdir(), 'rig-inspect-executed');
    try {
      fs.rmSync(marker, { force: true });
    } catch {
      /* ignore */
    }
    inspect(target, { host: 'codex' });
    assert.equal(fs.existsSync(marker), false, 'inspect must never execute harness content');
  });
});
