#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const bootstrap = path.join(root, 'rig', 'bootstrap.sh');
const manifestPath = '.rig/install-manifest.jsonl';

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-onboarding-'));
  try {
    return fn(target);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function install(target, hosts, env = {}) {
  const args = [bootstrap, '--tier', '1', '--target', target];
  if (hosts) args.push('--hosts', hosts);
  const result = spawnSync('sh', args, { encoding: 'utf8', env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout).trim());
  return result.stdout;
}

function filesUnder(target, relativePath = '') {
  const absolute = path.join(target, relativePath);
  if (!fs.existsSync(absolute)) return [];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else files.push(path.relative(target, file));
    }
  };
  walk(absolute);
  return files.sort();
}

function appliedManifest(target) {
  const records = fs.readFileSync(path.join(target, manifestPath), 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  const bySeq = new Map();
  for (const record of records) bySeq.set(record.seq, record);
  return { records, applied: [...bySeq.values()].filter((record) => record.state === 'applied') };
}

test('default onboarding installs only the mechanically detected Claude host', () => {
  withTarget((target) => {
    fs.mkdirSync(path.join(target, '.claude'));

    const output = install(target);

    assert.match(output, /claude.*detected.*\.claude/i);
    assert.ok(fs.existsSync(path.join(target, '.claude/skills/rig-implementation/SKILL.md')));
    assert.equal(fs.existsSync(path.join(target, '.agents')), false);
    assert.equal(fs.existsSync(path.join(target, '.github')), false);
    assert.equal(fs.existsSync(path.join(target, '.cursor')), false);
  });
});

test('bare repositories receive no implicit host tree and explicit hosts remain trimmable', () => {
  withTarget((target) => {
    install(target);

    for (const hostTree of ['.claude', '.agents', '.github', '.cursor', '.windsurf', '.kiro']) {
      assert.equal(fs.existsSync(path.join(target, hostTree)), false, `${hostTree} must not be inferred`);
    }
  });

  withTarget((target) => {
    const output = install(target, 'codex');

    assert.match(output, /codex.*explicit/i);
    assert.ok(fs.existsSync(path.join(target, '.agents/skills/rig-implementation/SKILL.md')));
    assert.equal(fs.existsSync(path.join(target, '.claude')), false);
    assert.equal(fs.existsSync(path.join(target, '.github')), false);
  });
});

test('the install journal records every payload write before and after mutation', () => {
  withTarget((target) => {
    fs.mkdirSync(path.join(target, '.claude'));
    install(target);

    const { records, applied } = appliedManifest(target);
    const pending = new Set(records.filter((record) => record.state === 'pending').map((record) => record.seq));
    assert.ok(applied.length > 0);
    assert.ok(applied.every((record) => pending.has(record.seq)), 'every applied write must have a pending record');

    const writtenFiles = filesUnder(target).filter((file) => file !== manifestPath);
    assert.deepEqual([...new Set(applied.map((record) => record.path))].sort(), writtenFiles);
    for (const record of applied) {
      const digest = crypto.createHash('sha256')
        .update(fs.readFileSync(path.join(target, record.path)))
        .digest('hex');
      assert.equal(record.digest, digest, record.path);
    }
  });
});

test('a named release install records its resolved tag through the journaled payload path', () => {
  withTarget((target) => {
    install(target, 'codex', { RIG_RELEASE_TAG: 'v5.0.0' });

    assert.deepEqual(
      JSON.parse(fs.readFileSync(path.join(target, '.rig/release.json'), 'utf8')),
      { tag: 'v5.0.0', hosts: ['codex'] },
    );
    const { applied } = appliedManifest(target);
    assert.ok(applied.some((record) => record.path === '.rig/release.json'));
  });
});

test('auto-detected host trees cannot redirect writes outside the repository', () => {
  withTarget((target) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-onboarding-outside-'));
    try {
      fs.symlinkSync(outside, path.join(target, '.claude'));
      assert.throws(() => install(target), /outside|escape|symlink/i);
      assert.deepEqual(filesUnder(outside), []);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});
