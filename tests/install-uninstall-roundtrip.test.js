#!/usr/bin/env node
'use strict';

require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { runPayload, journalWriter, upsertGraftSection } = require('../rig/lib/payload');
const { uninstall } = require('../rig/lib/lifecycle');
const { PROVIDERS, applyCiPlan, planCiIntegration, GITHUB_WORKFLOW_POINTER } = require('../rig/lib/ci-adapters');
const { writePlanApproval } = require('./helpers/advanced');

const root = path.join(__dirname, '..');
const materializer = path.join(root, 'rig', 'materialize.js');

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-install-uninstall-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
const appliedRecord = (seq, path, body, options = {}) => {
  const ownership = options.ownership || 'create_owned';
  const resultDigest = body === null ? null : digest(body);
  return {
    seq, path, ownership, operation: options.operation || ownership,
    transaction_kind: options.transaction_kind || 'install', state: 'applied',
    preimage_digest: options.preimage_digest ?? null,
    desired_digest: resultDigest, digest: resultDigest,
    ...options,
  };
};

test('public uninstall discloses absent installation evidence instead of certifying an empty record list', () => withTarget((target) => {
  const file = path.join(target, 'AGENTS.md');
  fs.writeFileSync(file, '# User instructions\n', { mode: 0o640 });
  const result = uninstall(target);
  assert.equal(result.status, 'removed', 'idempotent legacy teardown remains compatible');
  assert.equal(result.verification.status, 'best_effort');
  assert.ok(result.verification.files.includes('.rig/install-manifest.jsonl'));
  assert.equal(result.verification.differences[0].reason, 'manifest-unavailable');
  assert.equal(fs.readFileSync(file, 'utf8'), '# User instructions\n');
  assert.equal(fs.statSync(file).mode & 0o777, 0o640);
}));

test('public uninstall verifies real preimages while preserving later outside edits and mode', () => withTarget((target) => {
  const file = path.join(target, 'AGENTS.md');
  const original = '# User instructions\r\n';
  fs.writeFileSync(file, original, { mode: 0o640 });
  const writer = journalWriter(target);
  upsertGraftSection(target, { path: 'AGENTS.md', capability: 'review.code-and-pull-request', version: 1, content: 'Review changes.', expected_file_digest: digest(original) }, writer);
  writer.finish();
  fs.appendFileSync(file, 'Later user note.\r\n');
  const run = spawnSync(process.execPath, [materializer, 'uninstall', '--target', target], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(run.stdout);
  assert.equal(result.verification.status, 'verified_clean');
  assert.deepEqual(result.verification.files, []);
  const expected = Buffer.from(original + 'Later user note.\r\n');
  assert.deepEqual(fs.readFileSync(file), expected, 'preimage is evidence, never a restore source');
  assert.equal(fs.statSync(file).mode & 0o777, 0o640);
  assert.equal(fs.existsSync(path.join(target, '.rig/preimages')), false, 'graft removal does not orphan its own newly journaled snapshots');
  const difference = result.verification.differences.find(row => row.path === 'AGENTS.md');
  assert.equal(difference.preimage_digest, digest(original));
  assert.equal(difference.postimage_digest, digest(expected));
  assert.equal(difference.status, 'outside_changes');
  const report = JSON.parse(fs.readFileSync(path.join(target, 'reports/rig/last-uninstall.json')));
  assert.deepEqual(report.verification, result.verification);
}));

test('public uninstall names missing or corrupt preimage evidence without restoring user bytes', () => {
  for (const kind of ['missing', 'corrupt']) withTarget((target) => {
    const original = '# User instructions\n';
    const file = path.join(target, 'AGENTS.md');
    fs.writeFileSync(file, original, { mode: 0o640 });
    const writer = journalWriter(target);
    upsertGraftSection(target, { path: 'AGENTS.md', capability: 'review.code-and-pull-request', version: 1, content: 'Review changes.', expected_file_digest: digest(original) }, writer);
    writer.finish();
    fs.appendFileSync(file, 'Later user note.\n');
    const preimage = path.join(target, '.rig/preimages', digest(original));
    if (kind === 'missing') fs.rmSync(path.dirname(preimage), { recursive: true });
    else fs.writeFileSync(preimage, 'corrupt evidence\n');
    const result = uninstall(target);
    assert.equal(result.status, 'best_effort', kind);
    assert.equal(result.verification.status, 'best_effort', kind);
    assert.ok(result.verification.files.includes('AGENTS.md'), kind);
    const difference = result.verification.differences.find(row => row.path === 'AGENTS.md');
    assert.equal(difference.reason, `preimage-${kind}`, kind);
    assert.deepEqual(fs.readFileSync(file), Buffer.from(original + 'Later user note.\n'), kind);
    assert.equal(fs.statSync(file).mode & 0o777, 0o640, kind);
    assert.equal(fs.existsSync(path.join(target, '.rig/install-manifest.jsonl')), true, 'retain retry evidence');
  });
});

test('public uninstall verification refuses rewritten managed markers and names the untouched file', () => withTarget((target) => {
  const file = path.join(target, 'AGENTS.md');
  const original = '# User instructions\n';
  fs.writeFileSync(file, original, { mode: 0o640 });
  const writer = journalWriter(target);
  upsertGraftSection(target, { path: 'AGENTS.md', capability: 'review.code-and-pull-request', version: 1, content: 'Review changes.', expected_file_digest: digest(original) }, writer);
  writer.finish();
  const changed = fs.readFileSync(file, 'utf8').replace(/<!-- rig:graft[^\n]+-->/g, '<!-- another tool rewrote the marker -->') + 'Later user note.\n';
  fs.writeFileSync(file, changed);
  const result = uninstall(target);
  assert.equal(result.status, 'best_effort');
  assert.equal(result.verification.status, 'best_effort');
  assert.ok(result.verification.files.includes('AGENTS.md'));
  assert.equal(result.verification.differences.find(row => row.path === 'AGENTS.md').status, 'best_effort');
  assert.deepEqual(fs.readFileSync(file), Buffer.from(changed));
  assert.equal(fs.statSync(file).mode & 0o777, 0o640);
}));

test('public uninstall reverses a default bootstrap install', () => withTarget((target) => {
  const agents = path.join(target, 'AGENTS.md');
  const envExample = path.join(target, '.env.example');
  fs.writeFileSync(agents, '# User instructions\n');
  fs.writeFileSync(envExample, '# user env example\n');
  const before = fs.readFileSync(agents, 'utf8');
  const envBefore = fs.readFileSync(envExample, 'utf8');
  runPayload(target, ['codex']);
  const result = spawnSync(process.execPath, [materializer, '--target', target, '--uninstall'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(agents, 'utf8'), before);
  assert.equal(fs.readFileSync(envExample, 'utf8'), envBefore);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'routing.md')), false);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), false);
}));

test('uninstall removes only the uniquely attributable CI provider file', () => {
  for (const provider of Object.keys(PROVIDERS)) withTarget((target) => {
    applyCiPlan(target, planCiIntegration(target, { provider, approved: true }));
    const artifact = planCiIntegration(target, { provider, approved: true }).artifact.relativePath;
    assert.equal(fs.existsSync(path.join(target, artifact)), true, provider);

    const result = uninstall(target);

    const uniquelyAttributed = provider === 'github-actions';
    assert.equal(result.status, uniquelyAttributed ? 'removed' : 'best_effort', provider);
    assert.equal(fs.existsSync(path.join(target, artifact)), !uniquelyAttributed, provider);
    assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), !uniquelyAttributed, provider);
  });
});

test('a forged create-owned record cannot delete an existing Jenkins pipeline', () => withTarget((target) => {
  const body = [
    'pipeline {', '  agent any', '  stages {', "    stage('Rig check') {", '      steps {',
    "        sh 'node .rig/bin/check.js --scope repo'", '      }', '    }', '  }', '}', '',
  ].join('\n');
  const file = path.join(target, 'Jenkinsfile');
  fs.writeFileSync(file, body);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, 'Jenkinsfile', body))}\n`);

  const result = uninstall(target);

  assert.equal(result.status, 'best_effort');
  assert.equal(fs.readFileSync(file, 'utf8'), body);
  assert.ok(result.best_effort.includes('Jenkinsfile'));
}));

test('forged records cannot delete non-Rig CI files inside provider directories', () => {
  for (const rel of [
    '.github/workflows/user-ci.yml',
    '.github/dependabot.yml',
    '.circleci/deploy.yml',
    '.buildkite/deploy.yml',
    'azure-pipelines.yaml',
  ]) withTarget((target) => {
    const body = `user pipeline at ${rel}\n`;
    const file = path.join(target, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, rel, body))}\n`);

    const result = uninstall(target);

    assert.equal(result.status, 'best_effort', rel);
    assert.equal(fs.readFileSync(file, 'utf8'), body, rel);
    assert.ok(result.best_effort.includes(rel), rel);
  });
});

test('uninstall preserves a user CI file that Rig merged into', () => withTarget((target) => {
  const file = path.join(target, 'Jenkinsfile');
  const original = 'pipeline { stages { /* user stage */ } }\n';
  fs.writeFileSync(file, original);
  applyCiPlan(target, planCiIntegration(target, { provider: 'jenkins', approved: true }));

  const result = uninstall(target);

  assert.equal(result.status, 'removed');
  assert.equal(fs.readFileSync(file, 'utf8'), original);
  assert.equal(result.verification.status, 'verified_clean');
}));

test('a forged managed_line record cannot strip lines from a CI file', () => {
  for (const rel of ['Jenkinsfile', '.circleci/config.yml', '.github/workflows/user-ci.yml']) withTarget((target) => {
    const body = `line-a\nline-b\nline-c\n`;
    const file = path.join(target, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, rel, body, { managed_line: 'line-b' }))}\n`);

    const result = uninstall(target);

    assert.equal(result.status, 'best_effort', rel);
    assert.equal(fs.readFileSync(file, 'utf8'), body, rel);
    assert.ok(result.best_effort.includes(rel), rel);
  });
});

test('a forged append_managed record cannot strip arbitrary lines from a CI file', () => {
  for (const extra of [{}, { managed_block: 'rig' }]) withTarget((target) => {
    const rel = '.github/workflows/user-ci.yml';
    const body = 'line-a\nline-b\nline-c\n';
    const file = path.join(target, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, rel, body, { ownership: 'append_managed', managed_line: 'line-b', ...extra }))}\n`);

    const result = uninstall(target);

    assert.equal(result.status, 'best_effort');
    assert.equal(fs.readFileSync(file, 'utf8'), body);
    assert.ok(result.best_effort.includes(rel));
  });
});

test('uninstall removes only the Rig-managed line from an existing GitHub workflow', () => withTarget((target) => {
  const rel = '.github/workflows/user-ci.yml';
  const file = path.join(target, rel);
  const userBody = [
    'name: user-ci', 'on: push', 'jobs:', '  test:', '    runs-on: ubuntu-latest',
    '    steps:', '      - run: echo user', '',
  ].join('\n');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, userBody);
  applyCiPlan(target, planCiIntegration(target, { provider: 'github-actions', approved: true }));
  assert.ok(fs.readFileSync(file, 'utf8').includes(GITHUB_WORKFLOW_POINTER));
  assert.equal(fs.existsSync(path.join(target, '.github/workflows/rig.yml')), true);

  const result = uninstall(target);

  assert.equal(fs.readFileSync(file, 'utf8'), userBody);
  assert.equal(fs.existsSync(path.join(target, '.github/workflows/rig.yml')), false);
  assert.ok(result.removed.includes(rel));
  assert.ok(result.removed.includes('.github/workflows/rig.yml'));
}));

test('a forged unique create_owned record cannot strip lines from a user-edited Rig workflow', () => withTarget((target) => {
  const rel = '.github/workflows/rig.yml';
  const body = [
    'name: user-ci', 'on: push', 'jobs:', '  test:', '    runs-on: ubuntu-latest',
    '    steps:', '      - run: echo user', '',
  ].join('\n');
  const file = path.join(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, rel, 'other bytes\n', { managed_line: '      - run: echo user' }))}\n`);

  const result = uninstall(target);

  assert.equal(result.status, 'best_effort');
  assert.equal(fs.readFileSync(file, 'utf8'), body);
  assert.ok(result.best_effort.includes(rel));
}));

test('a lexical journal alias cannot delete a user CI file via an install-tree prefix', () => {
  for (const record of [
    { path: '.rig/../Jenkinsfile', ownership: 'create_owned', digest: true },
    {
      path: '.github/workflows/x/../../../Jenkinsfile',
      ownership: 'append_managed',
      managed_line: GITHUB_WORKFLOW_POINTER,
    },
  ]) withTarget((target) => {
    const body = 'pipeline { agent any }\n';
    const file = path.join(target, 'Jenkinsfile');
    fs.writeFileSync(file, body);
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, record.path, body, {
      ownership: record.ownership,
      ...(record.managed_line ? { managed_line: record.managed_line } : {}),
    }))}\n`);

    const result = uninstall(target);

    assert.equal(fs.readFileSync(file, 'utf8'), body, record.path);
    assert.equal(result.status, 'best_effort', record.path);
  });
});

test('an in-repo symlink at the unique CI path cannot rewrite a user pipeline', () => withTarget((target) => {
  const body = "pipeline { steps { echo 'user' } }\n";
  const jenkins = path.join(target, 'Jenkinsfile');
  fs.writeFileSync(jenkins, body);
  fs.mkdirSync(path.join(target, '.github/workflows'), { recursive: true });
  fs.symlinkSync(jenkins, path.join(target, '.github/workflows/rig.yml'));
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, '.github/workflows/rig.yml', body, { managed_line: "pipeline { steps { echo 'user' } }" }))}\n`);

  const result = uninstall(target);

  assert.equal(fs.readFileSync(jenkins, 'utf8'), body);
  assert.equal(result.status, 'best_effort');
}));

test('a forged pointer record cannot delete an empty GitHub workflow', () => withTarget((target) => {
  const rel = '.github/workflows/user-ci.yml';
  const file = path.join(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, rel, '', { ownership: 'append_managed', managed_line: GITHUB_WORKFLOW_POINTER }))}\n`);

  const result = uninstall(target);

  assert.equal(fs.readFileSync(file, 'utf8'), '');
  assert.equal(result.status, 'best_effort');
  assert.ok(result.best_effort.includes(rel));
}));

test('an install-tree directory symlink cannot retarget uninstall at a user CI file', () => withTarget((target) => {
  const body = 'pipeline { agent any }\n';
  const file = path.join(target, 'Jenkinsfile');
  fs.writeFileSync(file, body);
  fs.symlinkSync('.', path.join(target, '.pi'));
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, '.pi/Jenkinsfile', body))}\n`);

  const result = uninstall(target);

  assert.equal(fs.readFileSync(file, 'utf8'), body);
  assert.equal(result.status, 'best_effort');
}));

test('a hard link from an install tree cannot rewrite a user CI file', () => withTarget((target) => {
  const body = 'line-a\nline-b\nline-c\n';
  const file = path.join(target, 'Jenkinsfile');
  fs.writeFileSync(file, body);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.linkSync(file, path.join(target, '.rig', 'owned'));
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, '.rig/owned', body, { managed_line: 'line-b' }))}\n`);

  const result = uninstall(target);

  assert.equal(fs.readFileSync(file, 'utf8'), body);
  assert.equal(result.status, 'best_effort');
}));

test('a retained user-edited file keeps the journal for retry', () => withTarget((target) => {
  runPayload(target, []);
  const owned = path.join(target, '.rig', 'routing.md');
  fs.appendFileSync(owned, 'user edit\n');
  const first = uninstall(target);
  assert.equal(first.status, 'best_effort');
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), true);
  fs.rmSync(owned);
  const second = uninstall(target);
  assert.equal(second.status, 'removed');
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), false);
}));

test('purge removes the manifest only after a clean removal', () => withTarget((target) => {
  runPayload(target, []);
  fs.mkdirSync(path.join(target, 'reports', 'rig'), { recursive: true });
  const result = uninstall(target, { purge: true });
  assert.equal(result.status, 'removed');
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), false);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.json')), false);
}));

test('a corrupted middle journal record fails closed before removal', () => withTarget((target) => {
  const first = path.join(target, 'first.txt');
  const second = path.join(target, 'second.txt');
  fs.writeFileSync(first, 'first\n');
  fs.writeFileSync(second, 'second\n');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), [
    JSON.stringify(appliedRecord(1, 'first.txt', 'first\n')),
    '{ malformed',
    JSON.stringify(appliedRecord(2, 'second.txt', 'second\n')),
    '',
  ].join('\n'));
  assert.throws(() => uninstall(target), /manifest|record|JSON/i);
  assert.equal(fs.readFileSync(first, 'utf8'), 'first\n');
  assert.equal(fs.readFileSync(second, 'utf8'), 'second\n');
}));

test('uninstall removes preimages empty instruction files and empty Rig directories', () => withTarget((target) => {
  const savedPreimage = 'original user bytes\n';
  const preimage = path.join(target, '.rig', 'preimages', digest(savedPreimage));
  const agents = path.join(target, 'AGENTS.md');
  const skill = path.join(target, '.claude', 'skills', 'rig-example', 'SKILL.md');
  fs.mkdirSync(path.dirname(preimage), { recursive: true });
  fs.mkdirSync(path.dirname(skill), { recursive: true });
  fs.writeFileSync(preimage, savedPreimage);
  fs.writeFileSync(agents, 'Before acting, read `.rig/routing.md`.\n');
  fs.writeFileSync(skill, 'skill\n');
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), [
    JSON.stringify(appliedRecord(1, `.rig/preimages/${digest('original user bytes\n')}`, 'original user bytes\n')),
    JSON.stringify(appliedRecord(2, 'AGENTS.md', 'Before acting, read `.rig/routing.md`.\n', { ownership: 'append_managed', managed_line: 'Before acting, read `.rig/routing.md`.' })),
    JSON.stringify(appliedRecord(3, '.claude/skills/rig-example/SKILL.md', 'skill\n')),
    '',
  ].join('\n'));
  const result = uninstall(target);
  assert.equal(result.status, 'removed');
  assert.equal(fs.existsSync(preimage), false);
  assert.equal(fs.existsSync(agents), false);
  assert.equal(fs.existsSync(path.join(target, '.claude', 'skills')), false);
}));

test('missing OpenClaw tooling does not stop unrelated local removal', () => withTarget((target) => {
  const local = path.join(target, '.rig', 'local-rig-file');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(local, 'remove me\n');
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify(appliedRecord(1, '.rig/local-rig-file', 'remove me\n'))}\n`);
  fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), JSON.stringify({
    entries: [{ kind: 'openclaw-mcp', path: '~/.openclaw/config.json', install_id: 'fixture', runtime: '.rig/runtime' }],
  }) + '\n');
  const result = uninstall(target);
  assert.equal(result.status, 'best_effort');
  assert.equal(fs.existsSync(local), false);
  assert.ok(result.best_effort.some((entry) => entry.includes('openclaw')));
}));

test('linked-worktree uninstall restores the original pre-commit hook', () => withTarget((root) => {
  const main = path.join(root, 'main');
  const worktree = path.join(root, 'linked');
  fs.mkdirSync(main);
  execFileSync('git', ['init'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.email', 'rig-test@example.com'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.name', 'Rig Test'], { cwd: main, stdio: 'pipe' });
  fs.writeFileSync(path.join(main, 'package.json'), JSON.stringify({
    name: 'linked-worktree-fixture', private: true, scripts: { 'format:check': 'git diff --check' },
  }) + '\n');
  fs.writeFileSync(path.join(main, 'index.js'), 'module.exports = 1;\n');
  execFileSync('git', ['add', '.'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['worktree', 'add', '-b', 'linked-fixture', worktree], { cwd: main, stdio: 'pipe' });

  const hooks = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], { cwd: worktree, encoding: 'utf8' }).trim();
  const hook = path.resolve(worktree, hooks, 'pre-commit');
  const original = '#!/bin/sh\necho user-hook\n';
  fs.mkdirSync(path.dirname(hook), { recursive: true });
  fs.writeFileSync(hook, original, { mode: 0o755 });

  const review = path.join(worktree, 'review.json');
  const selection = path.join(worktree, 'rig.json');
  const plan = path.join(worktree, 'plan.json');
  fs.writeFileSync(review, JSON.stringify({
    schema_version: 1, host: 'codex', harness_digest: 'linked-worktree-fixture', verdict: 'ALLOW',
    findings: [], restrictions: [], unverifiable: [],
  }) + '\n');
  fs.writeFileSync(selection, JSON.stringify({
    schema_version: 1, services: { 'development.code-quality.lint-format': 'minimal' },
  }) + '\n');
  let result = spawnSync(process.execPath, [materializer, 'plan', '--target', worktree, '--manifest', selection, '--review', review, '--out', plan], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const approval = writePlanApproval(worktree, plan);
  result = spawnSync(process.execPath, [materializer, 'apply', '--target', worktree, '--manifest', selection, '--review', review, '--plan', plan, '--approval', approval], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(fs.readFileSync(hook, 'utf8'), /Rig secret guard shim/);
  assert.match(fs.readFileSync(path.join(worktree, '.rig', 'install-manifest.jsonl'), 'utf8'), /\.git\/hooks\/pre-commit/);

  result = spawnSync(process.execPath, [materializer, '--target', worktree, '--uninstall'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.readFileSync(hook, 'utf8'), original);
  assert.equal(fs.existsSync(path.join(path.dirname(hook), 'pre-commit.rig-chained')), false);
}));

test('public uninstall retains an edited pre-commit shim and its chained backup', () => withTarget((root) => {
  const main = path.join(root, 'main');
  const worktree = path.join(root, 'linked');
  fs.mkdirSync(main);
  execFileSync('git', ['init'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.email', 'rig-test@example.com'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.name', 'Rig Test'], { cwd: main, stdio: 'pipe' });
  fs.writeFileSync(path.join(main, 'package.json'), JSON.stringify({
    name: 'linked-worktree-fixture', private: true, scripts: { 'format:check': 'git diff --check' },
  }) + '\n');
  fs.writeFileSync(path.join(main, 'index.js'), 'module.exports = 1;\n');
  execFileSync('git', ['add', '.'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['worktree', 'add', '-b', 'linked-edited-hook', worktree], { cwd: main, stdio: 'pipe' });

  const hooks = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], { cwd: worktree, encoding: 'utf8' }).trim();
  const hook = path.resolve(worktree, hooks, 'pre-commit');
  const chained = path.join(path.dirname(hook), 'pre-commit.rig-chained');
  const original = '#!/bin/sh\necho user-hook\n';
  fs.mkdirSync(path.dirname(hook), { recursive: true });
  fs.writeFileSync(hook, original, { mode: 0o755 });

  const review = path.join(worktree, 'review.json');
  const selection = path.join(worktree, 'rig.json');
  const plan = path.join(worktree, 'plan.json');
  fs.writeFileSync(review, JSON.stringify({
    schema_version: 1, host: 'codex', harness_digest: 'linked-worktree-fixture', verdict: 'ALLOW',
    findings: [], restrictions: [], unverifiable: [],
  }) + '\n');
  fs.writeFileSync(selection, JSON.stringify({
    schema_version: 1, services: { 'development.code-quality.lint-format': 'minimal' },
  }) + '\n');
  let result = spawnSync(process.execPath, [materializer, 'plan', '--target', worktree, '--manifest', selection, '--review', review, '--out', plan], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const approval = writePlanApproval(worktree, plan);
  result = spawnSync(process.execPath, [materializer, 'apply', '--target', worktree, '--manifest', selection, '--review', review, '--plan', plan, '--approval', approval], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const shim = fs.readFileSync(hook, 'utf8');
  const edited = `${shim}# user edited shim\n`;
  fs.writeFileSync(hook, edited);
  result = spawnSync(process.execPath, [materializer, '--target', worktree, '--uninstall'], { encoding: 'utf8' });
  assert.equal(result.status, 1, result.stderr || result.stdout);
  assert.match(result.stderr, /\.git\/hooks\/pre-commit/);
  assert.equal(fs.readFileSync(hook, 'utf8'), edited);
  assert.equal(fs.readFileSync(chained, 'utf8'), original);
  assert.equal(fs.existsSync(path.join(worktree, '.rig', 'install-manifest.jsonl')), true);

  fs.writeFileSync(hook, shim);
  result = spawnSync(process.execPath, [materializer, '--target', worktree, '--uninstall'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.readFileSync(hook, 'utf8'), original);
  assert.equal(fs.existsSync(chained), false);
  assert.equal(fs.existsSync(path.join(worktree, '.rig', 'install-manifest.jsonl')), false);
}));

test('best-effort shim keeps the chained backup even when that record is processed first', () => withTarget((target) => {
  const hookDir = path.join(target, '.git', 'hooks');
  fs.mkdirSync(hookDir, { recursive: true });
  const original = '#!/bin/sh\necho user-hook\n';
  const shim = '#!/bin/sh\necho Rig secret guard shim\n';
  const edited = `${shim}# edited\n`;
  fs.writeFileSync(path.join(hookDir, 'pre-commit'), edited);
  fs.writeFileSync(path.join(hookDir, 'pre-commit.rig-chained'), original);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), [
    JSON.stringify(appliedRecord(1, '.git/hooks/pre-commit', shim)),
    JSON.stringify(appliedRecord(2, '.git/hooks/pre-commit.rig-chained', original)),
    '',
  ].join('\n'));
  const result = uninstall(target);
  assert.equal(result.status, 'best_effort');
  assert.equal(fs.readFileSync(path.join(hookDir, 'pre-commit'), 'utf8'), edited);
  assert.equal(fs.readFileSync(path.join(hookDir, 'pre-commit.rig-chained'), 'utf8'), original);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), true);
}));

test('missing shim restores the chained backup instead of orphaning it', () => withTarget((target) => {
  const hookDir = path.join(target, '.git', 'hooks');
  fs.mkdirSync(hookDir, { recursive: true });
  const original = '#!/bin/sh\necho user-hook\n';
  const shim = '#!/bin/sh\necho Rig secret guard shim\n';
  fs.writeFileSync(path.join(hookDir, 'pre-commit.rig-chained'), original);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), [
    JSON.stringify(appliedRecord(1, '.git/hooks/pre-commit', shim)),
    JSON.stringify(appliedRecord(2, '.git/hooks/pre-commit.rig-chained', original)),
    '',
  ].join('\n'));
  const result = uninstall(target);
  assert.equal(result.status, 'removed');
  assert.equal(fs.readFileSync(path.join(hookDir, 'pre-commit'), 'utf8'), original);
  assert.equal(fs.existsSync(path.join(hookDir, 'pre-commit.rig-chained')), false);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), false);
}));

test('RIG-127.11 uninstall leaves a corrupted global config byte-identical and reports it best-effort', () => withTarget((target) => {
  const globalFile = path.join(target, 'global-config.json');
  const corrupt = '{"rig": {"repo-a": {"enabled": true}, oops\n';
  fs.writeFileSync(globalFile, corrupt);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), `${JSON.stringify({
    entries: [{ kind: 'json-namespace', path: globalFile, install_id: 'repo-a' }],
  })}\n`);

  let result;
  assert.doesNotThrow(() => { result = uninstall(target); });

  assert.equal(result.status, 'best_effort');
  assert.ok(result.best_effort.includes(globalFile));
  assert.equal(fs.readFileSync(globalFile, 'utf8'), corrupt);
}));

test('uninstall preserves every valid-but-wrong-shaped global namespace as best effort', () => withTarget((target) => {
  for (const value of ['string', 7, true, [], null]) {
    const globalFile = path.join(target, `global-${String(value)}.json`);
    const body = `${JSON.stringify({ rig: value })}\n`;
    fs.writeFileSync(globalFile, body);
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), `${JSON.stringify({ entries: [{ kind: 'json-namespace', path: globalFile, install_id: 'repo-a' }] })}\n`);
    const result = uninstall(target);
    assert.ok(result.best_effort.includes(globalFile));
    assert.equal(fs.readFileSync(globalFile, 'utf8'), body);
    fs.rmSync(path.join(target, '.rig'), { recursive: true, force: true });
  }
}));

function writeLegacyNamelessRecord(target, rel, preimage, file) {
  fs.writeFileSync(path.join(target, rel), file);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify({
    seq: 1,
    path: rel,
    operation: 'append_managed',
    state: 'applied',
    transaction_kind: 'install',
    ownership: 'append_managed',
    desired_digest: digest(file),
    preimage_digest: digest(preimage),
    digest: digest(file),
  })}\n`);
}

test('RIG-127.12 a legacy nameless managed-block record strips only the block Rig appended', () => withTarget((target) => {
  const rel = 'AGENTS.md';
  const preimage = 'user text\n<!-- rig:other-tool:start -->\nsomeone else\n<!-- rig:other-tool:end -->\n';
  const owned = '<!-- rig:legacy-graft:start -->\nrig wrote this\n<!-- rig:legacy-graft:end -->\n';
  writeLegacyNamelessRecord(target, rel, preimage, `${preimage}${owned}`);

  const result = uninstall(target);

  assert.ok(result.removed.includes(rel));
  assert.equal(fs.readFileSync(path.join(target, rel), 'utf8'), preimage);
}));

test('RIG-127.12 a legacy nameless record that cannot attribute a block is best-effort and the file is untouched', () => withTarget((target) => {
  const rel = 'AGENTS.md';
  const preimage = 'user text\n';
  const body = `${preimage}<!-- rig:legacy-graft:start -->\nrig wrote this\n<!-- rig:legacy-graft:end -->\n`
    + '<!-- rig:other-tool:start -->\nadded later by someone else\n<!-- rig:other-tool:end -->\n';
  writeLegacyNamelessRecord(target, rel, preimage, body);

  const result = uninstall(target);

  assert.equal(result.status, 'best_effort');
  assert.ok(result.best_effort.includes(rel));
  assert.equal(fs.readFileSync(path.join(target, rel), 'utf8'), body);
}));
