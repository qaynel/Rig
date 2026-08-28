#!/usr/bin/env node
'use strict';

require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const {
  root,
  readJson,
  writeJson,
  withRepo,
  allowedReview,
  writeSelection,
  plan,
  apply,
  check,
} = require('./helpers/advanced');

const SERVICE_ID = 'development.code-quality.lint-format';
const catalogPath = path.join(root, 'rig', 'catalog.json');

function lintFormatEntry() {
  const catalog = readJson(catalogPath);
  return (catalog.services || catalog.entries || []).find(({ id }) => id === SERVICE_ID);
}

function seedLintFormatRepo(target) {
  fs.mkdirSync(path.join(target, '.github', 'workflows'), { recursive: true });
  fs.mkdirSync(path.join(target, 'tools'), { recursive: true });
  writeJson(path.join(target, 'package.json'), {
    name: 'lint-format-fixture',
    version: '1.0.0',
    private: true,
    scripts: {
      'format:check': 'git diff --check HEAD -- index.js',
      lint: 'node --check index.js',
      format: 'node tools/format.js',
    },
  });
  fs.writeFileSync(path.join(target, 'index.js'), "const answer = 42;\n");
  fs.writeFileSync(
    path.join(target, 'tools', 'format.js'),
    "const fs = require('node:fs');\nconst p = 'index.js';\nfs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/[ \\t]+$/gm, ''));\n",
  );
  fs.writeFileSync(path.join(target, '.github', 'workflows', '.keep'), '');
  execFileSync('git', ['add', '.'], { cwd: target, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: target, stdio: 'pipe' });
}

function installLintFormat(target, grade) {
  const { reviewPath } = allowedReview(target);
  writeSelection(target, { [SERVICE_ID]: grade });
  const planned = plan(target, { review: reviewPath });
  assert.equal(planned.status, 0, planned.stderr);
  const applied = apply(target, { review: reviewPath, plan: planned.outPath });
  assert.equal(applied.status, 0, applied.stderr);
  return readJson(path.join(target, '.rig', 'service-bindings.json'))[SERVICE_ID];
}

function runInstalledCheck(target) {
  return spawnSync(
    process.execPath,
    [path.join(target, '.rig', 'bin', 'check.js'), '--scope', 'repo', '--service', SERVICE_ID],
    { cwd: target, encoding: 'utf8', shell: false },
  );
}

test('lint-format is a fully authored executable component leaf', () => {
  const service = lintFormatEntry();
  assert.ok(service, `missing ${SERVICE_ID}`);
  assert.equal(service.delivery, undefined, 'legacy delivery field must be removed');
  assert.equal(service.disposition?.kind, 'executable');
  assert.deepEqual(service.owns, ['code-quality.lint-format']);
  for (const adjacent of [
    'code-quality.typecheck',
    'correctness-static-analysis',
    'complexity-static',
    'code-quality.code-review',
  ]) {
    assert.ok(service.excludes.includes(adjacent), `missing adjacent exclusion ${adjacent}`);
  }
  assert.deepEqual(service.applicability?.any, ['source-code']);
  assert.deepEqual(service.requires, { minimal: [], mid: [], maximal: [] });

  const checkIds = [
    ...(service.checks?.minimal || []),
    ...(service.checks?.mid || []),
    ...(service.checks?.maximal || []),
  ];
  assert.deepEqual(checkIds, [
    'lint-format-formatter-clean',
    'lint-format-linter-clean',
    'lint-format-ci-gate-and-explicit-fix',
  ]);
  assert.deepEqual(
    (service.acceptance_evidence || []).map(({ check_id }) => check_id),
    checkIds,
  );
  for (const evidence of service.acceptance_evidence || []) {
    assert.equal(evidence.target, 'tests/advanced-lint-format.test.js');
  }

  const refs = [
    ...Object.values(service.fragments || {}),
    ...new Set(Object.values(service.slices || {}).map(({ fragment }) => fragment)),
  ];
  for (const rel of refs) {
    const body = fs.readFileSync(path.join(root, 'rig', rel), 'utf8');
    assert.doesNotMatch(body, /TODO|TBD|Razor-scoped dependency slice|Concrete convention/i, rel);
    assert.match(body, /lint|format/i, `${rel} must be service-specific`);
  }
  assert.equal(
    service.slices['mutation-floor'].fragment,
    service.slices.floor.fragment,
    'mutation-floor deliberately reuses the identical formatter-only floor',
  );
});

test('minimal installs a real read-only formatter verifier', () => {
  withRepo((target) => {
    seedLintFormatRepo(target);
    const binding = installLintFormat(target, 'minimal');
    assert.equal(binding.engine, 'component-lint-format-v1');
    assert.deepEqual(binding.components.map((component) => component.root), ['.']);
    assert.deepEqual(Object.keys(binding.checks), ['lint-format-formatter-clean']);
    assert.equal(runInstalledCheck(target).status, 0);

    const sourcePath = path.join(target, 'index.js');
    fs.writeFileSync(sourcePath, 'const answer = 42;  \n');
    const before = fs.readFileSync(sourcePath, 'utf8');
    const broken = runInstalledCheck(target);
    assert.notEqual(broken.status, 0, 'broken formatting must fail');
    assert.match(broken.stderr + broken.stdout, /trailing whitespace|formatter/i);
    assert.equal(fs.readFileSync(sourcePath, 'utf8'), before, 'check must not autofix');
  });
});

test('mid cumulatively adds the repository linter', () => {
  withRepo((target) => {
    seedLintFormatRepo(target);
    const binding = installLintFormat(target, 'mid');
    assert.deepEqual(Object.keys(binding.checks), [
      'lint-format-formatter-clean',
      'lint-format-linter-clean',
    ]);
    const serviceBody = fs.readFileSync(path.join(target, '.rig', 'services', `${SERVICE_ID}.md`), 'utf8');
    assert.match(serviceBody, /Minimal — formatter cleanliness/);
    assert.match(serviceBody, /Mid addition — linter cleanliness/);

    fs.writeFileSync(path.join(target, 'index.js'), 'const = 42;\n');
    const broken = runInstalledCheck(target);
    assert.notEqual(broken.status, 0, 'invalid JavaScript must fail the real lint command');
    assert.match(broken.stderr + broken.stdout, /SyntaxError|Unexpected token|lint/i);
  });
});

test('maximal adds a CI gate and records autofix for explicit use only', () => {
  withRepo((target) => {
    seedLintFormatRepo(target);
    const binding = installLintFormat(target, 'maximal');
    assert.deepEqual(Object.keys(binding.checks), [
      'lint-format-formatter-clean',
      'lint-format-linter-clean',
      'lint-format-ci-gate-and-explicit-fix',
    ]);
    const maximal = binding.checks['lint-format-ci-gate-and-explicit-fix'];
    assert.ok(fs.existsSync(path.join(target, '.github', 'workflows', 'rig.yml')));
    assert.deepEqual(maximal.fix, ['npm', 'run', '--silent', 'format']);

    const sourcePath = path.join(target, 'index.js');
    fs.writeFileSync(sourcePath, 'const answer = 42;  \n');
    const before = fs.readFileSync(sourcePath, 'utf8');
    assert.notEqual(runInstalledCheck(target).status, 0);
    assert.equal(fs.readFileSync(sourcePath, 'utf8'), before, 'CI/check path must stay read-only');

    const fixed = spawnSync(maximal.fix[0], maximal.fix.slice(1), {
      cwd: target,
      encoding: 'utf8',
      shell: false,
    });
    assert.equal(fixed.status, 0, fixed.stderr);
    assert.equal(runInstalledCheck(target).status, 0, 'explicit fix must restore a clean check');
  });
});

test('missing repository formatter is a loud coverage gap', () => {
  withRepo((target) => {
    writeJson(path.join(target, 'package.json'), {
      name: 'no-formatter-fixture',
      version: '1.0.0',
      private: true,
    });
    fs.writeFileSync(path.join(target, 'index.js'), 'module.exports = {};\n');
    installLintFormat(target, 'minimal');

    const result = runInstalledCheck(target);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /coverage gap.*format:check|format:check.*missing/i);
  });
});

test('an interrupted apply resumes instead of rolling back (AT-INSTALL-1)', () => {
  withRepo((target) => {
    seedLintFormatRepo(target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { [SERVICE_ID]: 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);

    // Force a real write failure partway through apply: make the path apply
    // needs to write late in the sequence an existing directory, the same
    // shape of failure as a permission denial or full disk.
    fs.mkdirSync(path.join(target, '.rig', 'service-bindings.json'), { recursive: true });

    const interrupted = apply(target, { review: reviewPath, plan: planned.outPath });
    assert.notEqual(interrupted.status, 0, 'apply must fail when a write target is unwritable');

    const manifestFile = path.join(target, '.rig', 'install-manifest.jsonl');
    assert.ok(fs.existsSync(manifestFile), 'a failed apply must leave a manifest behind');
    const readManifest = () =>
      fs
        .readFileSync(manifestFile, 'utf8')
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line));
    assert.ok(
      readManifest().some((r) => r.state === 'applied' && r.path === '.rig/catalog-routing.md'),
      'writes before the failure point must be recorded as applied',
    );
    assert.ok(
      fs.existsSync(path.join(target, '.rig', 'catalog-routing.md')),
      'writes already applied must stay in place, not be rolled back',
    );
    assert.ok(
      !fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')),
      'an incomplete install must never produce a receipt or claim to be installed',
    );

    // Clear the obstruction, the way a user would after a real permission or
    // disk failure, and re-run: it must resume, not restart or duplicate.
    fs.rmdirSync(path.join(target, '.rig', 'service-bindings.json'));
    const resumed = apply(target, { review: reviewPath, plan: planned.outPath });
    assert.equal(resumed.status, 0, resumed.stderr);
    assert.ok(fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')));

    const routingApplied = readManifest().filter(
      (r) => r.path === '.rig/catalog-routing.md' && r.state === 'applied',
    );
    assert.equal(
      routingApplied.length,
      1,
      'a path already applied before the interruption must not be rewritten or duplicated on resume',
    );
  });
});

test('source check command dispatches the same real installed binding', () => {
  withRepo((target) => {
    seedLintFormatRepo(target);
    installLintFormat(target, 'minimal');
    fs.writeFileSync(path.join(target, 'index.js'), 'const answer = 42;  \n');

    const result = check(target, { scope: 'repo', service: SERVICE_ID });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /trailing whitespace|formatter/i);
  });
});
