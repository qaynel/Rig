'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { runPayload } = require('../rig/lib/payload');
const root = path.join(__dirname, '..');

function withInstalledTarget(run) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-check-closure-'));
  try {
    execFileSync('git', ['init', '-q'], { cwd: target });
    runPayload(target, ['codex'], { activeDelivery: true, releaseTag: 'v6.0.0' });
    require('./helpers/semantic-review').writeFixtureSemanticReview(target, {
      reason: 'The installed fixture instructions agree on the repository test workflow.',
    });
    return run(target);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function writeJson(target, rel, value) {
  const file = path.join(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function run(target, script, args = [], env = process.env) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: target, encoding: 'utf8', env, timeout: 15000,
  });
}

function bindingFiles(target, order, bindings) {
  writeJson(target, '.rig/service-bindings.json', bindings);
  writeJson(target, '.rig/catalog-receipt.json', { order, services: {} });
}

test('installed and source check commands execute explicit UI service bindings without a UI heuristic', () => withInstalledTarget(target => {
  const service = 'testing.e2e.user-journeys';
  const input = 'rig-services/testing.e2e.user-journeys.json';
  fs.mkdirSync(path.dirname(path.join(target, input)), { recursive: true });
  fs.writeFileSync(path.join(target, input), JSON.stringify({ journeys: [] }));
  bindingFiles(target, [service], {
    [service]: { grade: 'minimal', checks: { 'user-journeys-source-code-boundary': {
      native_service: { input, format: 'json', rule: { field: 'journeys', op: 'nonempty', reason: 'List journeys.' } },
    } } },
  });

  const installed = run(target, path.join(target, '.rig/bin/check.js'), ['--scope', 'repo', '--surface', 'local']);
  assert.equal(installed.status, 1, installed.stderr);
  assert.match(installed.stderr, /List journeys\./);
  assert.doesNotMatch(installed.stderr, /MODULE_NOT_FOUND/);

  const source = run(target, path.join(root, 'rig/materialize.js'), ['check', '--target', target, '--scope', 'repo']);
  assert.equal(source.status, 1, source.stdout + source.stderr);
  assert.match(source.stderr, /List journeys\./);
}));

test('installed and source check commands can pass a valid native service binding', () => withInstalledTarget(target => {
  const service = 'testing.e2e.user-journeys';
  const input = 'rig-services/testing.e2e.user-journeys.json';
  fs.mkdirSync(path.dirname(path.join(target, input)), { recursive: true });
  fs.writeFileSync(path.join(target, input), JSON.stringify({ journeys: ['sign in'] }));
  bindingFiles(target, [service], {
    [service]: { grade: 'minimal', checks: { 'user-journeys-source-code-boundary': {
      native_service: { input, format: 'json', rule: { field: 'journeys', op: 'nonempty', reason: 'List journeys.' } },
    } } },
  });

  const installed = run(target, path.join(target, '.rig/bin/check.js'), ['--scope', 'repo', '--surface', 'local']);
  assert.equal(installed.status, 0, installed.stderr);
  const source = run(target, path.join(root, 'rig/materialize.js'), ['check', '--target', target, '--scope', 'repo']);
  assert.equal(source.status, 0, source.stdout + source.stderr);
  assert.match(source.stdout, /check passed/);
}));

test('source check CLI fails closed when an ordered dependency binding is missing', () => withInstalledTarget(target => {
  const dependency = 'testing.unit.test-case-generation';
  bindingFiles(target, [dependency], {});

  const result = run(target, path.join(root, 'rig/materialize.js'), ['check', '--target', target, '--scope', 'repo']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /binding is missing/);
  const reports = fs.readdirSync(path.join(target, 'reports/rig')).map(file => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', file), 'utf8')));
  assert.ok(reports.some(row => row.service_id === dependency && row.status === 'coverage_gap'));
}));

test('source check CLI persists redacted changed-path evidence and blocks the next service after mutation', () => withInstalledTarget(target => {
  const mutator = 'fixture.mutator';
  const later = 'fixture.after-mutator';
  const mutation = path.join(target, 'mutated.txt');
  const second = path.join(target, 'second-ran.txt');
  fs.writeFileSync(path.join(target, 'mutate.js'), "require('fs').writeFileSync('mutated.txt', 'after');\n");
  fs.writeFileSync(path.join(target, 'second.js'), "require('fs').writeFileSync('second-ran.txt', 'ran');\n");
  bindingFiles(target, [mutator, later], {
    [mutator]: { read_only: true, repo: [process.execPath, 'mutate.js'], diff: [process.execPath, 'mutate.js'] },
    [later]: { repo: [process.execPath, 'second.js'], diff: [process.execPath, 'second.js'] },
  });

  const result = run(target, path.join(root, 'rig/materialize.js'), ['check', '--target', target, '--scope', 'repo']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.equal(fs.existsSync(second), false, 'later service ran after the read-only command mutated the repository');
  const reports = fs.readdirSync(path.join(target, 'reports/rig')).map(file => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', file), 'utf8')));
  const report = reports.find(row => row.service_id === mutator && row.status === 'mutated');
  assert.ok(report, 'the local mutation failure report is missing');
  assert.match(report.evidence.join('\n'), /mutated\.txt/);
  assert.match(report.evidence.join('\n'), /before/);
  assert.match(report.evidence.join('\n'), /after/);
  assert.ok(reports.some(row => row.service_id === later && row.status === 'not_run_due_to_dependency'));
  assert.ok(fs.existsSync(mutation));
}));

test('installed check CLI persists mutation evidence and blocks the next service', () => withInstalledTarget(target => {
  const mutator = 'fixture.mutator';
  const later = 'fixture.after-mutator';
  const second = path.join(target, 'second-ran.txt');
  fs.writeFileSync(path.join(target, 'mutate.js'), "require('fs').writeFileSync('mutated.txt', 'after');\n");
  fs.writeFileSync(path.join(target, 'second.js'), "require('fs').writeFileSync('second-ran.txt', 'ran');\n");
  bindingFiles(target, [mutator, later], {
    [mutator]: { read_only: true, repo: [process.execPath, 'mutate.js'], diff: [process.execPath, 'mutate.js'] },
    [later]: { repo: [process.execPath, 'second.js'], diff: [process.execPath, 'second.js'] },
  });

  const result = run(target, path.join(target, '.rig/bin/check.js'), ['--scope', 'repo', '--surface', 'local']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.equal(fs.existsSync(second), false, 'installed runner launched a later service after mutation');
  const reports = fs.readdirSync(path.join(target, 'reports/rig')).map(file => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', file), 'utf8')));
  const report = reports.find(row => row.service_id === mutator && row.status === 'mutated');
  assert.ok(report, 'the installed runner did not persist its local mutation report');
  assert.match(report.evidence.join('\n'), /mutated\.txt/);
  assert.match(report.evidence.join('\n'), /before/);
  assert.match(report.evidence.join('\n'), /after/);
}));

test('installed check CLI reports timeout and does not launch a later service', () => withInstalledTarget(target => {
  const timed = 'fixture.timeout';
  const later = 'fixture.after-timeout';
  const second = path.join(target, 'second-ran.txt');
  fs.writeFileSync(path.join(target, 'wait.js'), 'setTimeout(() => {}, 1000);\n');
  fs.writeFileSync(path.join(target, 'second.js'), "require('fs').writeFileSync('second-ran.txt', 'ran');\n");
  bindingFiles(target, [timed, later], {
    [timed]: { timeout_ms: 50, repo: [process.execPath, 'wait.js'], diff: [process.execPath, 'wait.js'] },
    [later]: { repo: [process.execPath, 'second.js'], diff: [process.execPath, 'second.js'] },
  });

  const result = run(target, path.join(target, '.rig/bin/check.js'), ['--scope', 'repo', '--surface', 'local']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /timeout/);
  assert.match(result.stderr, /not_run_due_to_dependency/);
  assert.equal(fs.existsSync(second), false, 'later service ran after an earlier service timed out');
  const reports = fs.readdirSync(path.join(target, 'reports/rig')).map(file => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', file), 'utf8')));
  assert.ok(reports.some(row => row.service_id === timed && row.status === 'timeout'), 'the installed runner did not persist its timeout report');
}));


test('real installed CI retains timeout mutation evidence locally while publishing only safe aggregates', () => withInstalledTarget(target => {
  const service = 'fixture.ci-mutator';
  const later = 'fixture.after-ci-mutator';
  fs.writeFileSync(path.join(target, 'index.txt'), 'before');
  fs.writeFileSync(path.join(target, 'mutate-wait.js'), "require('fs').writeFileSync('index.txt', 'after');setInterval(() => {}, 1000);\n");
  fs.writeFileSync(path.join(target, 'second.js'), "require('fs').writeFileSync('second-ran.txt', 'ran');\n");
  bindingFiles(target, [service, later], {
    [service]: { read_only: true, timeout_ms: 500, repo: [process.execPath, 'mutate-wait.js'] },
    [later]: { repo: [process.execPath, 'second.js'] },
  });
  const result = run(target, path.join(target, '.rig/bin/check.js'), ['--scope', 'repo', '--surface', 'ci.repo'], { ...process.env, CI: 'true' });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.equal(result.stderr, '');
  const output = JSON.parse(result.stdout);
  assert.equal(output.verdict, 'fail');
  assert.deepEqual(Object.keys(output).sort(), ['counts', 'rules', 'verdict']);
  assert.doesNotMatch(result.stdout, /index\.txt|before|after/);
  const reports = fs.readdirSync(path.join(target, 'reports/rig')).map(file => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', file), 'utf8')));
  assert.ok(reports.some(row => row.service_id === later && row.status === 'not_run_due_to_dependency'),
    'the actual installed command must persist the dependent service outcome');
  const failure = reports.find(row => row.service_id === service);
  assert.equal(failure.status, 'timeout');
  const evidence = JSON.parse(failure.evidence[0]);
  assert.ok(evidence.changed_paths.includes('index.txt'));
  assert.ok(evidence.changes.some(change => change.path === 'index.txt' && change.before && change.after));
  assert.equal(fs.readFileSync(path.join(target, 'index.txt'), 'utf8'), 'after');
  assert.equal(fs.existsSync(path.join(target, 'second-ran.txt')), false);
}));
