'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { withRepo, writeJson } = require('./helpers/advanced');
const { runBinding, renderDiagnostic } = require('../rig/lib/check-runner');
const { runChecks } = require('../rig/lib/checks');

const ok = [process.execPath, '-e', ''];
const fail = [process.execPath, '-e', 'process.exit(7)'];

test('Review Received F4: successful named and component checks retain one compatibility diagnostic', () => {
  withRepo((target) => {
    const named = runBinding('service', { checks: {
      first: { repo: ok },
      second: { repo: ok },
    } }, 'repo', target);
    assert.equal(named.status, 0);
    assert.deepEqual(named.executed_checks, ['first', 'second']);
    assert.deepEqual(named.diagnostics, [
      'network capability undeclared; running under temporary compatibility mode',
    ]);

    const component = runBinding('service', { checks: {
      components: { commands: [{ argv: ok }, { argv: ok }] },
    } }, 'repo', target);
    assert.equal(component.status, 0);
    assert.deepEqual(component.executed_checks, ['components', 'components']);
    assert.deepEqual(component.diagnostics, named.diagnostics);
  });
});

test('Review Received F4: a later failing named sub-check retains prior diagnostics and accurate execution counts', () => {
  withRepo((target) => {
    const result = runBinding('service', { checks: {
      passing: { repo: ok },
      failing: { repo: fail },
    } }, 'repo', target);
    assert.equal(result.status, 7);
    assert.equal(result.checkId, 'failing');
    assert.deepEqual(result.executed_checks, ['passing', 'failing']);
    assert.equal(result.executed_count, 2);
    assert.deepEqual(result.diagnostics, [
      'network capability undeclared; running under temporary compatibility mode',
    ]);
  });
});

test('Review Received F4: a later coverage gap retains earlier diagnostics and check identity', () => {
  withRepo((target) => {
    const result = runBinding('service', { checks: {
      passing: { repo: ok },
      unavailable: { coverage_gap: 'adapter is unavailable' },
    } }, 'repo', target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'coverage_gap');
    assert.equal(result.checkId, 'unavailable');
    assert.equal(result.executed_count, 1);
    assert.deepEqual(result.executed_checks, ['passing']);
    assert.deepEqual(result.diagnostics, [
      'network capability undeclared; running under temporary compatibility mode',
    ]);
  });
});

function installedCheckRun(binding, env = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-review-diagnostic-'));
  try {
    const root = path.join(__dirname, '..');
    fs.mkdirSync(path.join(dir, '.rig', 'bin'), { recursive: true });
    fs.mkdirSync(path.join(dir, '.rig', 'lib'), { recursive: true });
    for (const [from, to] of [
      ['rig/catalog/baseline/check.js', '.rig/bin/check.js'],
      ['rig/catalog/baseline/check-copies.js', '.rig/bin/check-copies.js'],
      ['rig/lib/spawn-guarded.js', '.rig/lib/spawn-guarded.js'],
      ['rig/lib/path-safety.js', '.rig/lib/path-safety.js'],
      ['rig/lib/check-runner.js', '.rig/lib/check-runner.js'],
      ['rig/lib/memory-guarded-exec.js', '.rig/lib/memory-guarded-exec.js'],
    ]) fs.copyFileSync(path.join(root, from), path.join(dir, to));
    writeJson(path.join(dir, '.rig', 'service-bindings.json'), { service: binding });
    const cleanEnv = { ...process.env };
    delete cleanEnv.GITHUB_ACTIONS;
    return spawnSync(process.execPath, [path.join(dir, '.rig', 'bin', 'check.js'), '--scope', 'repo', '--service', 'service'], {
      cwd: dir, encoding: 'utf8', env: { ...cleanEnv, ...env },
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('Review Received F4: normal CLI and GitHub output render named and component diagnostics once', () => {
  const binding = { checks: {
    named: { repo: ok },
    components: { commands: [{ argv: ok }, { argv: ok }] },
  } };
  const cli = installedCheckRun(binding);
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal((cli.stderr.match(/network capability undeclared/g) || []).length, 1, cli.stderr);

  const ci = installedCheckRun(binding, { GITHUB_ACTIONS: 'true' });
  assert.equal(ci.status, 0, ci.stderr);
  const annotations = `${ci.stdout}${ci.stderr}`.split('\n').filter((line) => line.startsWith('::warning'));
  assert.equal(annotations.length, 1, `${ci.stdout}${ci.stderr}`);
  assert.match(annotations[0], /network capability undeclared/);
  assert.doesNotMatch(annotations[0], /%0A|%0D/);
  assert.equal(
    renderDiagnostic('service%name', 'first line\nsecond line', { GITHUB_ACTIONS: 'true' }),
    '::warning title=Rig check::service%25name: first line%0Asecond line\n',
  );

  const mixed = installedCheckRun({ checks: {
    passing: { repo: ok },
    failing: { repo: fail },
  } });
  assert.equal(mixed.status, 7);
  assert.equal((mixed.stderr.match(/network capability undeclared/g) || []).length, 1, mixed.stderr);
  assert.match(mixed.stderr, /failing/);

  const invalid = installedCheckRun({ checks: {
    passing: { repo: ok },
    unavailable: { coverage_gap: 'adapter is unavailable' },
  } });
  assert.equal(invalid.status, 1);
  assert.equal((invalid.stderr.match(/network capability undeclared/g) || []).length, 1, invalid.stderr);
  assert.match(invalid.stderr, /adapter is unavailable/);
});

test('Review Received F4: declared network denial does not emit compatibility diagnostics', () => {
  withRepo((target) => {
    const denied = runBinding('service', {
      checks: { denied: { repo: ok, network: 'none' } }, network: 'none',
    }, 'repo', target);
    assert.ok(denied.status === 0 || denied.kind === 'network_isolation_unavailable');
    assert.equal(denied.diagnostic, undefined);
    assert.deepEqual(denied.diagnostics, []);
  });
});

test('Review Received F4: runChecks retains an earlier warning after a later missing service binding', () => {
  withRepo((target) => {
    const first = 'development.documentation.api-reference';
    const missing = 'development.documentation.docstrings';
    writeJson(path.join(target, '.rig', 'service-bindings.json'), {
      [first]: { checks: { verify: { repo: ok } } },
    });
    writeJson(path.join(target, '.rig', 'catalog-receipt.json'), {
      order: [first, missing],
      services: { [first]: {}, [missing]: {} },
    });
    const result = runChecks(target, { scope: 'repo' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /coverage gap: binding is missing/);
    assert.equal((result.stderr.match(/network capability undeclared/g) || []).length, 1, result.stderr);
  });
});
