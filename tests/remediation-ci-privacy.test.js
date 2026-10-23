'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const h = require('./helpers/advanced');
const ci = require('../rig/lib/ci-adapters');
const { writeReport } = require('../rig/lib/reports');

test('explicit CI provider cannot bypass malformed or incompatible existing shape', () => {
  for (const [provider, rel, body] of [
    ['gitlab_ci', '.gitlab-ci.yml', 'build: [unterminated\n'],
    ['gitlab_ci', '.gitlab-ci.yml', 'rig_check:\n  script: custom\n'],
    ['jenkins', 'Jenkinsfile', 'node { echo "existing scripted pipeline" }\n'],
    ['jenkins', 'Jenkinsfile', 'pipeline { stages {\n'],
    ['circleci', '.circleci/config.yml', 'version: 2.1\njobs: []\n'],
  ]) h.withRepo(target => {
    fs.mkdirSync(path.dirname(path.join(target, rel)), { recursive: true });
    fs.writeFileSync(path.join(target, rel), body);
    assert.throws(() => ci.planCiIntegration(target, { provider, approved: true }), /unsupported|malformed|collision|invalid/);
    assert.equal(fs.readFileSync(path.join(target, rel), 'utf8'), body);
  });
});

test('CI emissions are unverified and GitLab custom stages remain valid', () => h.withRepo(target => {
  fs.writeFileSync(path.join(target, '.gitlab-ci.yml'), 'stages:\n  - build\nbuild:\n  stage: build\n  script: make\n');
  const plan = ci.planCiIntegration(target, { provider: 'gitlab_ci', approved: true });
  assert.equal(plan.status, 'integrated');
  assert.equal(plan.evidence, 'unverified');
  assert.match(plan.artifact.contents, /stage: \.pre/);
}));

test('all abnormal report endings preserve their taxonomy and redact exact values', () => h.withRepo(target => {
  for (const status of ['timeout','cancelled','missing_dependency','partial_output','signalled','memory_exceeded','memory_ceiling_unavailable','mutated','not_authorized','filesystem_isolation_unavailable']) {
    const file = writeReport(target, { status, service_id: 'fixture', summary: 'sample@example.test', reason: 'failure' });
    const report = JSON.parse(fs.readFileSync(file));
    assert.equal(report.status, status);
    assert.doesNotMatch(JSON.stringify(report), /sample@example/);
  }
}));


test('agent and CI projections cannot republish secrets through metadata or abnormal success', () => {
  const { projectForAgent, projectCiResult } = require('../rig/lib/reports');
  const token = ['sk-', 'privacyFixture123456789012345'].join('');
  const report = { status: 'cancelled', findings: [{ rule: token, path: '/Users/private-owner/source.txt', matched: token }] };
  assert.doesNotMatch(JSON.stringify(projectForAgent(report)), new RegExp(token + '|private-owner'));
  const projected = projectCiResult(report);
  assert.equal(projected.verdict, 'fail');
  assert.deepEqual(projectCiResult({ status: 'timeout' }), { verdict: 'fail', counts: {}, rules: [] });
  assert.doesNotMatch(JSON.stringify(projected), new RegExp(token + '|private-owner'));
});

test('source, command CLI and installed CI publish only safe aggregate output', () => h.withRepo(target => {
  const { spawnSync } = require('node:child_process');
  const { runChecks } = require('../rig/lib/checks');
  const token = ['sk-', 'privacyFixture123456789012345'].join('');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, 'fail.js'), `process.stdout.write('sk-' + 'privacyFixture123456789012345' + ' sample@example.test /Users/private-owner/source.txt'); process.stderr.write('private finding detail'); process.exit(2);`);
  fs.writeFileSync(path.join(target, '.rig/service-bindings.json'), JSON.stringify({ fixture: { repo: [process.execPath, 'fail.js'], diff: [process.execPath, 'fail.js'] } }));
  const local = runChecks(target, { service: 'fixture', scope: 'repo' });
  assert.equal(local.status, 1);
  assert.doesNotMatch(JSON.stringify(local), new RegExp(token + '|sample@example|private-owner'));
  const oldCi = process.env.CI;
  try {
    process.env.CI = 'true';
    const result = runChecks(target, { service: 'fixture', scope: 'repo' });
    assert.equal(result.status, 1);
    assert.equal(result.stderr, '');
    assert.deepEqual(Object.keys(JSON.parse(result.stdout)).sort(), ['counts', 'rules', 'verdict']);
    assert.doesNotMatch(JSON.stringify(result), /private finding detail|private-owner|sample@example/);
  } finally { if (oldCi === undefined) delete process.env.CI; else process.env.CI = oldCi; }
  for (const entry of require('../rig/lib/baseline-payload').entries) {
    const dest = path.join(target, entry.to);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(__dirname, '../rig', entry.from), dest);
  }
  for (const name of fs.readdirSync(path.join(__dirname, '../rig/lib')).filter(name => name.endsWith('.js'))) {
    fs.copyFileSync(path.join(__dirname, '../rig/lib', name), path.join(target, '.rig/lib', name));
  }
  for (const argv of [
    [path.join(__dirname, '../rig/materialize.js'), 'check', '--target', target, '--service', 'fixture'],
    [path.join(target, '.rig/bin/check.js'), '--service', 'fixture'],
  ]) {
    const child = spawnSync(process.execPath, argv, { cwd: target, encoding: 'utf8', env: { ...process.env, CI: 'true' } });
    assert.equal(child.status, 1, child.stderr);
    assert.equal(child.stderr, '');
    assert.deepEqual(Object.keys(JSON.parse(child.stdout)).sort(), ['counts', 'rules', 'verdict']);
    assert.doesNotMatch(child.stdout, new RegExp(token + '|private finding detail|private-owner|sample@example'));
  }
  fs.writeFileSync(path.join(target, 'fail.js'), 'process.exit(0);');
  const clean = spawnSync(process.execPath, [path.join(__dirname, '../rig/materialize.js'), 'check', '--target', target, '--service', 'fixture'], { cwd: target, encoding: 'utf8', env: { ...process.env, CI: 'true' } });
  assert.equal(clean.status, 0, clean.stderr);
  assert.deepEqual(JSON.parse(clean.stdout), { verdict: 'pass', counts: {}, rules: [] });
}));

test('Slack credentials in failing task output and report metadata stay private through local and CI routes', () => h.withRepo(target => {
  const { spawnSync } = require('node:child_process');
  const { runChecks } = require('../rig/lib/checks');
  const { redact } = require('../rig/lib/redaction');
  const token = ['xoxb-', '123456789012-123456789012-abcdefghijklmnop'].join('');
  assert.doesNotMatch(redact(token), /xoxb|abcdefghijklmnop/);

  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, 'fail.js'), `process.stdout.write('xoxb-' + '123456789012-123456789012-abcdefghijklmnop'); process.stderr.write('xoxb-' + '123456789012-123456789012-abcdefghijklmnop'); process.exit(2);`);
  const metadata = { service_id: token, summary: token, reason: token, evidence: [{ provider: token }], fix_context: [token] };
  fs.writeFileSync(path.join(target, '.rig/service-bindings.json'), JSON.stringify({ fixture: { repo: [process.execPath, 'fail.js'], diff: [process.execPath, 'fail.js'] } }));
  const local = runChecks(target, { service: 'fixture', scope: 'repo' });
  assert.equal(local.status, 1);
  assert.doesNotMatch(JSON.stringify(local), /xoxb|abcdefghijklmnop/);
  const reports = fs.readdirSync(path.join(target, 'reports/rig')).map(file => fs.readFileSync(path.join(target, 'reports/rig', file), 'utf8'));
  assert.ok(reports.length);
  assert.ok(reports.every(report => !/xoxb|abcdefghijklmnop/.test(report)));
  assert.doesNotMatch(JSON.stringify(require('../rig/lib/reports').projectForAgent(metadata)), /xoxb|abcdefghijklmnop/);
  assert.doesNotMatch(JSON.stringify(require('../rig/lib/reports').projectCiResult(metadata)), /xoxb|abcdefghijklmnop/);

  for (const entry of require('../rig/lib/baseline-payload').entries) {
    const dest = path.join(target, entry.to);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(__dirname, '../rig', entry.from), dest);
  }
  for (const name of fs.readdirSync(path.join(__dirname, '../rig/lib')).filter(name => name.endsWith('.js'))) {
    fs.copyFileSync(path.join(__dirname, '../rig/lib', name), path.join(target, '.rig/lib', name));
  }
  const oldCi = process.env.CI;
  try {
    process.env.CI = 'true';
    const child = spawnSync(process.execPath, [path.join(target, '.rig/bin/check.js'), '--service', 'fixture', '--scope', 'repo'], { cwd: target, encoding: 'utf8' });
    assert.equal(child.status, 1, child.stderr);
    assert.equal(child.stderr, '');
    assert.doesNotMatch(child.stdout, /xoxb|abcdefghijklmnop/);
  } finally { if (oldCi === undefined) delete process.env.CI; else process.env.CI = oldCi; }
}));

test('root and installed MCP keep harness finding sentinels outside returned context', async () => {
  const pb = require('./helpers/path-b');
  await pb.withRepo(async target => {
    const token = ['ghp_', 'privacyFixture123456789012345'].join('');
    const dir = path.join(target, '.agents/skills/privacy-fixture');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${token}\ndescription: sample@example.test\n---\n${token}\n`);
    const request = { schema_version: 1, action: 'prepare', target };
    for (const server of [path.join(pb.root, 'rig-mcp/index.js'), path.join(target, '.rig/runtime/rig-mcp/index.js')]) {
      if (server.includes('/runtime/')) fs.symlinkSync(path.join(pb.root, 'rig-mcp/node_modules'), path.join(target, '.rig/runtime/rig-mcp/node_modules'), 'dir');
      const result = await pb.withMcpClient(server, client => client.callTool({ name: 'rig_onboarding', arguments: request }));
      assert.doesNotMatch(JSON.stringify(result), new RegExp(token + '|sample@example'));
    }
  }, { install: true });
});

test('all six actual task endings remain nonpassing in persisted reports and CI projections', () => h.withRepo(target => {
  const { runCommand } = require('./helpers/approved-lint');
  const { projectCiResult } = require('../rig/lib/reports');
  const cases = [
    ['timeout', [process.execPath, '-e', 'setTimeout(() => {}, 2000)'], { timeoutMs: 25 }],
    ['signalled', [process.execPath, '-e', 'process.kill(process.pid, "SIGTERM")'], {}],
    ['command_not_found', ['rig-privacy-missing-command-614'], {}],
    ['cancelled', [process.execPath, '-e', ''], { cancelled: true }],
    ['missing_dependency', [process.execPath, '-e', ''], { dependencies: ['rig-privacy-missing-dependency-614'] }],
    ['partial_output', [process.execPath, '-e', 'process.stdout.write("output truncated")'], { maxOutputBytes: 1 }],
  ];
  assert.equal(runCommand([process.execPath, '-e', ''], { cwd: target, memoryLimitMb: null, maxOutputBytes: 1 }).status, 'completed');
  for (const [expected, argv, options] of cases) {
    const ending = runCommand(argv, { cwd: target, memoryLimitMb: null, ...options });
    assert.equal(ending.status, expected);
    const file = writeReport(target, { status: ending.status, service_id: 'fixture', reason: ending.reason });
    const report = JSON.parse(fs.readFileSync(file));
    assert.equal(report.status, expected);
    assert.equal(projectCiResult(report).verdict, 'fail');
  }
}));


test('local report metadata and rerun hints receive the same privacy scrub as finding text', () => h.withRepo(target => {
  const token = ['sk-', 'privacyMetadata123456789012345'].join('');
  const file = writeReport(target, { status: 'failed', service_id: token, summary: 'C:\\Users\\private-owner\\source.txt',
    grade: 'sample@example.test', effective_slices: [token], rerun: ['node', '/home/private-owner/secret.js', token] });
  assert.doesNotMatch(fs.readFileSync(file, 'utf8'), new RegExp(token + '|sample@example|private-owner'));
}));

test('configured source checks preserve real timeout, signal and missing-tool kinds through public result and local report', () => h.withRepo(target => {
  const { runChecks } = require('../rig/lib/checks');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  const cases = [
    ['timeout', [process.execPath, '-e', 'setTimeout(() => {}, 2000)'], { timeout_ms: 25 }],
    ['signalled', [process.execPath, '-e', 'process.kill(process.pid, "SIGTERM")'], {}],
    ['missing_tool', ['rig-privacy-configured-missing-614'], {}],
  ];
  for (const [expected, repo, options] of cases) {
    const service = `fixture.${expected}`;
    fs.writeFileSync(path.join(target, '.rig/service-bindings.json'), JSON.stringify({ [service]: { repo, network: 'none', ...options } }));
    const result = runChecks(target, { scope: 'repo', service });
    assert.equal(result.status, 1);
    assert.equal(result.kind, expected);
    const reports = fs.readdirSync(path.join(target, 'reports/rig')).map(file => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', file))));
    assert.equal(reports.find(report => report.service_id === service).status, expected);
  }
}));

test('redaction removes private-key material together with its matching block header', () => {
  const { redact } = require('../rig/lib/redaction');
  const block = [
    ['-----BEGIN ', 'OPENSSH PRIVATE KEY-----'].join(''),
    'harmlessPrivateKeyBodySentinel614',
    ['-----END ', 'OPENSSH PRIVATE KEY-----'].join(''),
  ].join('\n');
  assert.doesNotMatch(redact(block), /harmlessPrivateKeyBodySentinel614|PRIVATE KEY/);
  assert.doesNotMatch(redact(block.split('-----END')[0]), /harmlessPrivateKeyBodySentinel614|PRIVATE KEY/);
});

test('invalid active triage policy immediately falls back to redacted agent projection', () => h.withRepo(target => {
  const { projectForAgent } = require('../rig/lib/reports');
  const token = ['ghp_', 'privacyInactive123456789012345'].join('');
  fs.mkdirSync(path.join(target, '.rig/policy'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/policy/active.json'), JSON.stringify({ schema_version: 1, enabled: true, secrets: { model_assisted_triage: true } }));
  assert.doesNotMatch(JSON.stringify(projectForAgent({ findings: [{ rule: 'secret', path: 'a.txt', matched: token }] }, { target })), new RegExp(token));
}));
