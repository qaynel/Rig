#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { remediate } = require('../rig/lib/apply');
const { resumeInstall, uninstall } = require('../rig/lib/lifecycle');
const { applyCoverage } = require('../rig/lib/lint-format');
const { runGrade: production_runGrade } = require('../rig/lib/lint-format');
const { runGrade } = require('./helpers/approved-lint');
const { projectForAgent } = require('../rig/lib/reports');
const { runPayload } = require('../rig/lib/payload');
const {
  activatePolicy, activationMessage, effectiveStatus, policyStatus, proposePolicy,
} = require('../rig/lib/policy');
const { actionDigest, consumeOneUseApproval } = require('../rig/lib/enforcement');
const { mergeGlobalConfig } = require('../rig/lib/global-writes');
const { registerOpenClawMcp } = require('../rig/lib/openclaw-mcp');

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-blocker-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-outside-'));
  try {
    return fn(target, outside);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
function appliedJournalRecord(seq, path, body, ownership = 'create_owned') {
  const digest = body === null ? null : sha256(body);
  return { seq, path, ownership, operation: ownership, transaction_kind: 'install', state: 'applied',
    preimage_digest: null, desired_digest: digest, digest };
}

test('effective policy status applies global and section switches and explains inactive leaves', () => {
  assert.deepEqual(effectiveStatus().reasons.policy, ['missing']);
  assert.equal(effectiveStatus({}).protected, false);

  const defaultPolicy = JSON.parse(fs.readFileSync(path.join(__dirname, '../rig/catalog/baseline/network-policy.json'), 'utf8'));
  assert.equal(effectiveStatus(defaultPolicy).protected, true);
  const incompleteDefault = { ...defaultPolicy, controls: { ...defaultPolicy.controls } };
  delete incompleteDefault.controls.drift;
  assert.equal(effectiveStatus(incompleteDefault).protected, false);
  assert.deepEqual(effectiveStatus(incompleteDefault).reasons['controls.drift'], ['missing']);

  const policy = {
    enabled: true,
    controls: {
      enabled: true,
      'sanitation.harness': true,
      'drift.exact_copy': true,
      'drift.semantic': true,
      'secrets.deterministic': true,
      'network.action_policy': true,
    },
    enforcement: {
      enabled: true,
      'host.shell': true,
      'host.web': true,
      'host.mcp': true,
      'git.pre_commit': true,
      'ci.repo': true,
    },
    network: {
      enabled: true,
      categories: {
        outbound_network: 'deny',
        remote_content_execution: 'deny',
        sensitive_environment_read: 'deny',
        guardrail_bypass: 'deny',
      },
    },
  };
  assert.equal(effectiveStatus(policy).protected, true);

  const networkOff = effectiveStatus({ ...policy, network: { ...policy.network, enabled: false } });
  assert.equal(networkOff.network.outbound_network, 'disabled');
  assert.deepEqual(networkOff.reasons['network.categories.outbound_network'], ['network.enabled=false']);
  assert.equal(networkOff.protected, false);

  const controlsOff = effectiveStatus({ ...policy, controls: { ...policy.controls, enabled: false } });
  assert.equal(controlsOff.controls['secrets.deterministic'], 'disabled');
  assert.deepEqual(controlsOff.reasons['controls.secrets.deterministic'], ['controls.enabled=false']);
  assert.equal(controlsOff.protected, false);

  const incompleteCurrent = { ...policy, controls: { ...policy.controls } };
  delete incompleteCurrent.controls['network.action_policy'];
  assert.equal(effectiveStatus(incompleteCurrent).protected, false);
  assert.deepEqual(effectiveStatus(incompleteCurrent).reasons['controls.network.action_policy'], ['missing']);

  const allOff = effectiveStatus({ ...policy, enabled: false });
  assert.equal(allOff.enforcement['host.shell'], 'disabled');
  assert.deepEqual(allOff.reasons['enforcement.host.shell'], ['enabled=false']);
  assert.equal(allOff.protected, false);
});

test('unknown host capabilities fail closed while registered hosts retain their disposition', () => {
  const { getCapabilities, materializeHostAdapters } = require('../rig/lib/host-capabilities');
  assert.equal(getCapabilities('generic').instruction, 'unsupported');
  const unknown = getCapabilities('nope-not-a-host');
  assert.equal(unknown.instruction, 'unsupported');
  assert.equal(unknown.native_skill, 'unsupported');
  assert.equal(unknown.mcp_config.scope, 'unsupported');
  assert.equal(getCapabilities('constructor').instruction, 'unsupported');

  const result = materializeHostAdapters('/tmp', 'nope-not-a-host', () => {});
  assert.deepEqual(result.emitted_axes, []);
  assert.deepEqual(result.pointers, []);
});

function runReviewReceipt(target, { verdict, authorContext, out, implementationRoot, extraArgs = [], env = {}, stub, reported: reportOverride }) {
  const root = path.join(__dirname, '..');
  implementationRoot = implementationRoot || root;
  const bin = path.join(target, 'bin');
  if (!fs.existsSync(bin)) fs.mkdirSync(bin);
  const invocations = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-review-invocations-'));
  const invocationMarker = path.join(invocations, 'called');
  const acceptance = fs.readFileSync(path.join(root, 'wiki/gate1/acceptance.md'), 'utf8');
  const ids = [...new Set([...acceptance.matchAll(/^- \*\*(AT-[A-Z]+-?\d+)/gm)].map((match) => match[1]))].sort();
  const reported = JSON.stringify(reportOverride || {
    verdict,
    verdicts: ids.map((id) => ({ id, verdict: verdict === 'fail' ? 'fail' : 'pass', note: 'stub' })),
    findings: verdict === 'fail' ? [{ severity: 'blocker', category: 'correctness', anchor: 'x', detail: 'stub failure' }] : [],
    unresolved: [],
  });
  const fake = path.join(bin, 'claude');
  const response = `${'```json'}\n${reported}\n${'```'}\n`;
  fs.writeFileSync(
    fake,
    stub || [
      '#!/usr/bin/env node',
      "'use strict';",
      'process.stdin.resume();',
      'let prompt = "";',
      'process.stdin.on(\'data\', (chunk) => { prompt += chunk; });',
      'process.stdin.on(\'end\', () => {',
      `  require('node:fs').appendFileSync(${JSON.stringify(invocationMarker)}, 'x');`,
      '  if (process.env.RIG_CAPTURE_REVIEW_PROMPT) require("node:fs").writeFileSync(process.env.RIG_CAPTURE_REVIEW_PROMPT, prompt);',
      '  if (process.env.RIG_MUTATE_IMPLEMENTATION) require("node:fs").appendFileSync(process.env.RIG_MUTATE_IMPLEMENTATION, "// changed during review\\n");',
      '  if (process.env.RIG_CAPTURE_REVIEW_ARGV) require("node:fs").writeFileSync(process.env.RIG_CAPTURE_REVIEW_ARGV, JSON.stringify(process.argv.slice(2)));',
      `  process.stdout.write(${JSON.stringify(response)});`,
      '});',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
  const run = spawnSync(process.execPath, [
    path.join(root, 'scripts/review-receipt.js'),
    '--target', path.join(root, 'wiki/gate2/technical-spec.md'),
    '--catalogue', path.join(root, 'rig/corpus/catalogue.json'),
    '--implementation-root', implementationRoot,
    '--base', 'origin/implement-advanced-a-la-carte-catalogue',
    '--gate1', path.join(root, 'wiki/gate1/business-spec.md') + ',' + path.join(root, 'wiki/gate1/acceptance.md'),
    '--author-context', authorContext,
    '--model', 'fake-reviewer',
    '--out', out,
    ...extraArgs,
  ], { encoding: 'utf8', env: { ...process.env, ...env, PATH: `${bin}${path.delimiter}${process.env.PATH}` } });
  const invocationCount = fs.existsSync(invocationMarker) ? fs.readFileSync(invocationMarker, 'utf8').length : 0;
  fs.rmSync(invocations, { recursive: true, force: true });
  return { run, invocationCount };
}

test('Claude review is read-only even when permission prompts are disabled', () => withTarget((target) => {
  const argvFile = path.join(target, 'reviewer-argv.json');
  const out = path.join(target, 'receipt.json');
  const result = runReviewReceipt(target, {
    verdict: 'pass', authorContext: 'readonly-review', out,
    env: { RIG_CAPTURE_REVIEW_ARGV: argvFile },
  });
  assert.equal(result.run.status, 0, result.run.stderr);
  const argv = JSON.parse(fs.readFileSync(argvFile, 'utf8'));
  const toolsIndex = argv.indexOf('--tools');
  assert.notEqual(toolsIndex, -1);
  assert.equal(argv[toolsIndex + 1], 'Read,Grep,Glob');
  assert.doesNotMatch(argv[toolsIndex + 1], /Bash|Write|Edit/);
}));

function signPolicyProposal(target, proposal) {
  const key = path.join(target, 'policy-test-key');
  const message = path.join(target, 'policy-approval-message');
  fs.mkdirSync(path.join(target, '.rig/policy'), { recursive: true });
  fs.mkdirSync(path.join(target, '.rig/trust'), { recursive: true });
  const generated = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key], { encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim();
  fs.writeFileSync(path.join(target, '.rig/trust/gate1.allowed-signers'), `owner ${publicKey}\n`);
  fs.writeFileSync(message, activationMessage(proposal));
  const signed = spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', 'rig-policy-activation', message], { encoding: 'utf8' });
  assert.equal(signed.status, 0, signed.stderr);
  return {
    schema_version: 1,
    kind: 'policy-approval',
    proposal_digest: proposal.digest,
    approval: {
      method: 'external-sshsig',
      identity: 'owner',
      signature: fs.readFileSync(`${message}.sig`, 'utf8'),
    },
    confirmed_disclosures: [],
  };
}

test('one-use approvals mutate their durable state and reject replay', () => {
  const action = { surface: 'shell', category: 'credential_read', argv: ['printenv', 'TOKEN'] };
  const approval = { action_digest: actionDigest(action), used: false };
  assert.equal(consumeOneUseApproval(approval, action).consumed, true);
  assert.equal(approval.used, true);
  assert.throws(() => consumeOneUseApproval(approval, action), /used|replay/i);
});

test('lint grade evidence comes from spawned argv but missing higher-grade work cannot be claimed', () => {
  withTarget((target) => {
    require('node:child_process').execFileSync('git', ['init', '-q'], { cwd: target });
    fs.writeFileSync(path.join(target, 'a.js'), 'const value = 1;\n');
    fs.writeFileSync(path.join(target, 'rules.json'), '{"lint":"fixture"}\n');
    const result = runGrade({
      target,
      grade: 'maximal',
      changed: ['a.js'],
      commands: [{ role: 'lint', argv: [process.execPath, '-e', 'process.stdout.write("real-output")'], source: 'rules.json', network: true, result: { exit_code: 99 } }],
      context: { findings: [] },
    });
    assert.equal(result.verdict, 'fail');
    assert.equal(result.status, 'coverage_gap');
    assert.deepEqual(result.completed_grades, ['Policy']);
    assert.equal(result.commands[0].result.source, undefined);
    assert.equal(result.commands[0].result.exit_code, 0);
    assert.equal(result.commands[0].result.output_digest, sha256('real-output\n'));
  });
});

test('all repository mutation paths refuse ancestor symlinks that leave the target', () => {
  for (const exercise of [
    (target) => resumeInstall(target, { operations: [{ path: 'escape/victim', content: 'changed' }] }),
    (target) => {
      fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
      fs.writeFileSync(path.join(target, '.rig/install-manifest.json'), JSON.stringify({
        records: [appliedJournalRecord(1, 'escape/victim', 'changed')],
      }));
      return uninstall(target);
    },
    (target) => require('./helpers/approved-lint').applyCoverage(target, { writes: [{ path: 'escape/victim', content: 'changed' }] }, {}),
    (target) => {
      const proposal = { actions: [{ op: 'rewrite', path: 'escape/victim', content: 'changed' }] };
      return remediate(target, proposal, sha256(JSON.stringify(proposal)));
    },
  ]) {
    withTarget((target, outside) => {
      fs.writeFileSync(path.join(outside, 'victim'), 'outside\n');
      fs.symlinkSync(outside, path.join(target, 'escape'));
      assert.throws(() => exercise(target), /outside|escape|symlink|unsafe/i);
      assert.equal(fs.readFileSync(path.join(outside, 'victim'), 'utf8'), 'outside\n');
    });
  }
});

test('OpenClaw runtime preservation cannot bypass journal path containment', () => {
  withTarget((target, outside) => {
    const runtime = 'escape/runtime';
    const victim = path.join(outside, 'runtime', 'victim');
    fs.mkdirSync(path.dirname(victim), { recursive: true });
    fs.writeFileSync(victim, 'outside\n');
    fs.symlinkSync(outside, path.join(target, 'escape'));
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), `${JSON.stringify({
      ...appliedJournalRecord(1, `${runtime}/victim`, 'outside\n'),
    })}\n`);
    fs.writeFileSync(path.join(target, '.rig/global-writes.json'), `${JSON.stringify({ entries: [{
      kind: 'openclaw-mcp',
      path: path.join(outside, 'openclaw.json'),
      server_key: 'rig-forged',
      install_id: 'forged',
      runtime,
      value: { command: 'node', args: [victim] },
    }] })}\n`);
    const bin = path.join(outside, 'bin');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'openclaw'), '#!/bin/sh\nexit 2\n', { mode: 0o755 });

    const oldPath = process.env.PATH;
    process.env.PATH = bin;
    try {
      assert.throws(() => uninstall(target), /outside|escape|symlink|unsafe/i);
      assert.equal(fs.readFileSync(victim, 'utf8'), 'outside\n');
    } finally {
      process.env.PATH = oldPath;
    }
  });
});

test('the lifecycle uninstaller consumes the shipping JSONL journal', () => {
  withTarget((target) => {
    runPayload(target, []);
    assert.ok(fs.existsSync(path.join(target, '.rig/routing.md')));

    const result = uninstall(target);

    assert.equal(result.status, 'removed');
    assert.equal(fs.existsSync(path.join(target, '.rig/routing.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/install-manifest.jsonl')), false);
  });
});

test('uninstall does not crash when `.git` is a file, as in a linked worktree', () => {
  withTarget((target) => {
    // A linked worktree's `.git` is a file (pointing at the shared common
    // dir), not a directory. A manifest record under `.git/hooks/...` — left
    // over from before this target became a worktree, or from any install
    // path that once wrote one — used to make `containedPath` throw ENOTDIR
    // walking through that file as if it were a directory.
    fs.writeFileSync(path.join(target, '.git'), 'gitdir: /elsewhere/.git/worktrees/example\n');
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), [
      appliedJournalRecord(1, '.git/hooks/pre-commit', 'shim'),
    ].map(JSON.stringify).join('\n') + '\n');

    const result = uninstall(target);
    assert.equal(result.status, 'removed');
    assert.equal(
      result.removed.includes('.git/hooks/pre-commit'),
      false,
      'a path that cannot exist under a file-shaped .git has nothing to remove',
    );
  });
});

test('the shipping CLI restores chained hooks and removes only attributed global entries', () => {
  withTarget((target, outside) => {
    const originalHook = '#!/bin/sh\necho user-hook\n';
    const shim = '#!/bin/sh\necho rig-hook\n';
    fs.mkdirSync(path.join(target, '.git/hooks'), { recursive: true });
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.git/hooks/pre-commit'), shim);
    fs.writeFileSync(path.join(target, '.git/hooks/pre-commit.rig-chained'), originalHook);
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), [
      appliedJournalRecord(1, '.git/hooks/pre-commit.rig-chained', originalHook),
      appliedJournalRecord(2, '.git/hooks/pre-commit', shim),
    ].map(JSON.stringify).join('\n') + '\n');
    const global = path.join(outside, 'host.json');
    fs.writeFileSync(global, '{"user":true}\n');
    mergeGlobalConfig(global, { install_id: 'repo-a', value: { enabled: true } });
    mergeGlobalConfig(global, { install_id: 'repo-b', value: { enabled: true } });
    fs.writeFileSync(path.join(target, '.rig/global-writes.json'), `${JSON.stringify({
      entries: [{ path: global, install_id: 'repo-a' }],
    })}\n`);

    const run = spawnSync(process.execPath, [
      path.join(__dirname, '..', 'rig/materialize.js'), 'uninstall', '--target', target,
    ], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    assert.equal(fs.readFileSync(path.join(target, '.git/hooks/pre-commit'), 'utf8'), originalHook);
    const remaining = JSON.parse(fs.readFileSync(global, 'utf8'));
    assert.equal(remaining.user, true);
    assert.equal(remaining.rig['repo-a'], undefined);
    assert.deepEqual(remaining.rig['repo-b'], { enabled: true });
  });
});

test('forged journal record cannot delete unrelated in-repository file with matching digest', () => {
  withTarget((target) => {
    const victim = path.join(target, 'package.json');
    const content = '{"name":"victim-repo","private":true}\n';
    fs.writeFileSync(victim, content);
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify({
      ...appliedJournalRecord(1, 'package.json', content),
    })}\n`);
    const result = uninstall(target);
    assert.equal(fs.readFileSync(victim, 'utf8'), content);
    assert.ok(result.best_effort.includes('package.json'));
  });
});

test('forged OpenClaw ledger entry cannot unregister unrelated user-global MCP server', () => {
  withTarget((target, outside) => {
    const bin = path.join(outside, 'bin');
    const config = path.join(outside, 'openclaw.json');
    const installId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
    const victimValue = { command: 'node', args: ['/tmp/victim.js'] };
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/install-id'), `${installId}\n`);
    fs.writeFileSync(config, `${JSON.stringify({ 'user-owned-server': victimValue })}\n`);
    fs.writeFileSync(path.join(target, '.rig/global-writes.json'), `${JSON.stringify({ entries: [{
      kind: 'openclaw-mcp',
      path: config,
      server_key: 'user-owned-server',
      install_id: installId,
      value: victimValue,
      state: 'applied',
    }] })}\n`);
    const unsetLog = path.join(outside, 'unset.log');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/bin/sh',
      'if [ "$1" = "mcp" ] && [ "$2" = "show" ]; then',
      '  printf \'{"user-owned-server":{"command":"node","args":["/tmp/victim.js"]}}\';',
      '  exit 0',
      'fi',
      `if [ "$1" = "mcp" ] && [ "$2" = "unset" ]; then echo "$3" >> "${unsetLog}"; exit 0; fi`,
      'exit 2',
      '',
    ].join('\n'), { mode: 0o755 });

    const oldPath = process.env.PATH;
    process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
    try {
      const result = uninstall(target);
      assert.equal(result.status, 'best_effort');
      assert.match(fs.readFileSync(config, 'utf8'), /user-owned-server/);
      assert.equal(fs.existsSync(unsetLog), false, 'must not call openclaw mcp unset on an unrelated server name');
    } finally {
      process.env.PATH = oldPath;
    }
  });
});

test('OpenClaw removal does not create an install identity when one is missing', () => {
  withTarget((target, outside) => {
    const bin = path.join(outside, 'bin');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'openclaw'), '#!/bin/sh\nexit 2\n', { mode: 0o755 });
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/global-writes.json'), `${JSON.stringify({ entries: [{
      kind: 'openclaw-mcp',
      path: path.join(outside, 'openclaw.json'),
      server_key: 'rig-forged',
      install_id: 'forged',
      value: { command: 'node', args: ['/tmp/forged.js'] },
    }] })}\n`);

    const oldPath = process.env.PATH;
    process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
    try {
      uninstall(target);
      assert.equal(fs.existsSync(path.join(target, '.rig/install-id')), false);
    } finally {
      process.env.PATH = oldPath;
    }
  });
});

test('OpenClaw global unregister failure preserves retry state through the shipping CLI', () => {
  withTarget((target, outside) => {
    const runtime = path.join(target, '.rig/runtime/rig-mcp');
    const server = path.join(runtime, 'index.js');
    const bin = path.join(outside, 'bin');
    fs.mkdirSync(runtime, { recursive: true });
    fs.mkdirSync(bin);
    fs.writeFileSync(server, 'server\n');
    fs.writeFileSync(path.join(target, '.rig/routing.md'), 'routing\n');
    fs.writeFileSync(path.join(bin, 'openclaw'), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), [
      appliedJournalRecord(1, '.rig/runtime/rig-mcp/index.js', 'server\n'),
      appliedJournalRecord(2, '.rig/routing.md', 'routing\n'),
    ].map(JSON.stringify).join('\n') + '\n');
    fs.writeFileSync(path.join(target, '.rig/global-writes.json'), `${JSON.stringify({
      entries: [{
        kind: 'openclaw-mcp',
        path: path.join(outside, 'openclaw.json'),
        server_key: 'rig-test',
        install_id: 'rig-test',
        runtime: '.rig/runtime/rig-mcp',
        state: 'applied',
      }],
    })}\n`);

    const run = spawnSync(process.execPath, [
      path.join(__dirname, '..', 'rig/materialize.js'), 'uninstall', '--target', target,
    ], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` },
    });
    assert.equal(run.status, 1, run.stderr || run.stdout);
    assert.ok(fs.existsSync(server), 'runtime remains while a global OpenClaw entry still points at it');
    assert.ok(fs.existsSync(path.join(target, '.rig/routing.md')), 'teardown stops before removing other installed files');
    assert.ok(fs.existsSync(path.join(target, '.rig/global-writes.json')), 'global write ledger remains for retry');
    assert.ok(fs.existsSync(path.join(target, '.rig/install-manifest.jsonl')), 'install journal remains for retry');
    const ledger = JSON.parse(fs.readFileSync(path.join(target, '.rig/global-writes.json'), 'utf8'));
    assert.equal(ledger.entries[0].state, 'applied');
    assert.match(run.stdout, /best_effort/);
  });
});

test('failed OpenClaw npm install leaves no partial runtime node_modules and no complete journal', () => {
  withTarget((target, outside) => {
    const bin = path.join(outside, 'bin');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/bin/sh',
      'if [ "$1" = "mcp" ] && [ "$2" = "show" ]; then printf "{}"; exit 0; fi',
      'exit 0',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'npm'), [
      '#!/bin/sh',
      'prefix=',
      'while [ "$#" -gt 0 ]; do',
      '  if [ "$1" = "--prefix" ]; then prefix=$2; shift 2; continue; fi',
      '  shift',
      'done',
      'mkdir -p "$prefix/node_modules"',
      'printf partial > "$prefix/node_modules/partial.txt"',
      'exit 1',
      '',
    ].join('\n'), { mode: 0o755 });

    const oldPath = process.env.PATH;
    const oldConfig = process.env.OPENCLAW_CONFIG_PATH;
    process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
    process.env.OPENCLAW_CONFIG_PATH = path.join(outside, 'openclaw.json');
    try {
      assert.throws(() => runPayload(target, [], {
        activeDelivery: true,
        afterPayload: ({ writeFile }) => registerOpenClawMcp(target, { writeFile }),
      }), /npm ci failed/);
    } finally {
      process.env.PATH = oldPath;
      if (oldConfig === undefined) delete process.env.OPENCLAW_CONFIG_PATH;
      else process.env.OPENCLAW_CONFIG_PATH = oldConfig;
    }

    assert.equal(fs.existsSync(path.join(target, '.rig/runtime/rig-mcp/node_modules')), false);
    assert.equal(fs.existsSync(path.join(outside, 'openclaw.json')), false);
    const states = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8')
      .trim().split('\n').map((line) => JSON.parse(line))
      .filter((record) => record.kind === 'install_state');
    assert.equal(states.at(-1).complete, false);
    assert.equal(states.some((record) => record.complete === true), false);

    const ledger = JSON.parse(fs.readFileSync(path.join(target, '.rig/global-writes.json'), 'utf8'));
    assert.equal(ledger.entries.length, 0, 'a failed npm ci must not leave a dangling pending ledger entry');

    const uninstallResult = uninstall(target);
    assert.equal(uninstallResult.status, 'removed', 'a failed OpenClaw npm install must not brick uninstall');
  });
});

test('OpenClaw install is retryable after a failed npm install', () => {
  withTarget((target, outside) => {
    const bin = path.join(outside, 'bin');
    const config = path.join(outside, 'openclaw.json');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/bin/sh',
      'if [ "$1" = "mcp" ] && [ "$2" = "show" ]; then if [ -e "$OPENCLAW_CONFIG_PATH" ]; then cat "$OPENCLAW_CONFIG_PATH"; else printf "{}"; fi; exit 0; fi',
      'if [ "$1" = "mcp" ] && [ "$2" = "set" ]; then printf \'{"%s":%s}\' "$3" "$4" > "$OPENCLAW_CONFIG_PATH"; exit 0; fi',
      'exit 2',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'npm-fail'), [
      '#!/bin/sh',
      'exit 1',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'npm-ok'), [
      '#!/bin/sh',
      'prefix=',
      'while [ "$#" -gt 0 ]; do',
      '  if [ "$1" = "--prefix" ]; then prefix=$2; shift 2; continue; fi',
      '  shift',
      'done',
      'mkdir -p "$prefix/node_modules"',
      'exit 0',
      '',
    ].join('\n'), { mode: 0o755 });

    const oldPath = process.env.PATH;
    const oldConfig = process.env.OPENCLAW_CONFIG_PATH;
    process.env.OPENCLAW_CONFIG_PATH = config;
    try {
      fs.symlinkSync(path.join(bin, 'npm-fail'), path.join(bin, 'npm'));
      process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
      assert.throws(() => runPayload(target, [], {
        activeDelivery: true,
        afterPayload: ({ writeFile }) => registerOpenClawMcp(target, { writeFile }),
      }), /npm ci failed/);

      fs.rmSync(path.join(bin, 'npm'));
      fs.symlinkSync(path.join(bin, 'npm-ok'), path.join(bin, 'npm'));
      const result = registerOpenClawMcp(target);
      assert.match(result.name, /^rig-/);
      assert.ok(fs.existsSync(config));
    } finally {
      process.env.PATH = oldPath;
      if (oldConfig === undefined) delete process.env.OPENCLAW_CONFIG_PATH;
      else process.env.OPENCLAW_CONFIG_PATH = oldConfig;
    }
  });
});

test('OpenClaw probe failure stops before dependency or global-config changes', () => {
  withTarget((target, outside) => {
    const bin = path.join(outside, 'bin');
    const config = path.join(outside, 'openclaw.json');
    const npmLog = path.join(outside, 'npm.log');
    fs.mkdirSync(bin);
    fs.mkdirSync(path.join(target, '.rig/runtime/rig-mcp'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/runtime/rig-mcp/package-lock.json'), '{}\n');
    fs.writeFileSync(config, 'unchanged\n');
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/bin/sh',
      'if [ "$1" = "mcp" ] && [ "$2" = "show" ]; then echo broken >&2; exit 2; fi',
      'printf changed > "$OPENCLAW_CONFIG_PATH"',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'npm'), `#!/bin/sh\nprintf npm > "${npmLog}"\n`, { mode: 0o755 });

    const oldPath = process.env.PATH;
    const oldConfig = process.env.OPENCLAW_CONFIG_PATH;
    process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
    process.env.OPENCLAW_CONFIG_PATH = config;
    try {
      assert.throws(() => registerOpenClawMcp(target), /mcp show failed/);
    } finally {
      process.env.PATH = oldPath;
      if (oldConfig === undefined) delete process.env.OPENCLAW_CONFIG_PATH;
      else process.env.OPENCLAW_CONFIG_PATH = oldConfig;
    }

    assert.equal(fs.readFileSync(config, 'utf8'), 'unchanged\n');
    assert.equal(fs.existsSync(npmLog), false);
  });
});

test('a partial OpenClaw set remains removable through the pending ledger', () => {
  withTarget((target, outside) => {
    const bin = path.join(outside, 'bin');
    const config = path.join(outside, 'openclaw.json');
    const runtime = path.join(target, '.rig/runtime/rig-mcp');
    const server = path.join(runtime, 'index.js');
    const log = path.join(outside, 'openclaw.log');
    fs.mkdirSync(bin);
    fs.mkdirSync(runtime, { recursive: true });
    fs.writeFileSync(path.join(runtime, 'package.json'), '{}\n');
    fs.writeFileSync(path.join(runtime, 'package-lock.json'), '{}\n');
    fs.writeFileSync(server, 'server\n');
    fs.writeFileSync(path.join(bin, 'npm'), '#!/bin/sh\nmkdir -p node_modules\n', { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/bin/sh',
      'if [ "$1" = "mcp" ] && [ "$2" = "show" ]; then if [ -e "$OPENCLAW_CONFIG_PATH" ]; then cat "$OPENCLAW_CONFIG_PATH"; else printf "{}"; fi; exit 0; fi',
      'if [ "$1" = "mcp" ] && [ "$2" = "set" ]; then printf \'{"%s":%s}\' "$3" "$4" > "$OPENCLAW_CONFIG_PATH"; exit 1; fi',
      'if [ "$1" = "mcp" ] && [ "$2" = "unset" ]; then if [ ! -e "$RIG_TEST_OPENCLAW_LOG" ]; then : > "$RIG_TEST_OPENCLAW_LOG"; exit 1; fi; rm -f "$OPENCLAW_CONFIG_PATH"; printf unset >> "$RIG_TEST_OPENCLAW_LOG"; exit 0; fi',
      'exit 2',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), `${JSON.stringify(appliedJournalRecord(1, '.rig/runtime/rig-mcp/index.js', 'server\n'))}\n`);

    const oldPath = process.env.PATH;
    const oldConfig = process.env.OPENCLAW_CONFIG_PATH;
    const oldLog = process.env.RIG_TEST_OPENCLAW_LOG;
    process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
    process.env.OPENCLAW_CONFIG_PATH = config;
    process.env.RIG_TEST_OPENCLAW_LOG = log;
    try {
      assert.throws(() => registerOpenClawMcp(target), /mcp set failed/);
      assert.ok(fs.existsSync(config), 'the failed set may already have changed global configuration');
      const result = uninstall(target);
      assert.equal(result.status, 'removed');
    } finally {
      process.env.PATH = oldPath;
      if (oldConfig === undefined) delete process.env.OPENCLAW_CONFIG_PATH;
      else process.env.OPENCLAW_CONFIG_PATH = oldConfig;
      if (oldLog === undefined) delete process.env.RIG_TEST_OPENCLAW_LOG;
      else process.env.RIG_TEST_OPENCLAW_LOG = oldLog;
    }

    assert.equal(fs.existsSync(config), false);
    assert.equal(fs.readFileSync(log, 'utf8'), 'unset');
    assert.equal(fs.existsSync(server), false);
  });
});

test('OpenClaw reinstall refuses a user-replaced named server', () => {
  withTarget((target, outside) => {
    const bin = path.join(outside, 'bin');
    const runtime = path.join(target, '.rig/runtime/rig-mcp');
    const npmLog = path.join(outside, 'npm.log');
    const setLog = path.join(outside, 'set.log');
    const config = path.join(outside, 'openclaw.json');
    fs.mkdirSync(bin);
    fs.mkdirSync(runtime, { recursive: true });
    fs.writeFileSync(path.join(runtime, 'package.json'), '{}\n');
    fs.writeFileSync(path.join(runtime, 'package-lock.json'), '{}\n');
    fs.writeFileSync(path.join(target, '.rig/install-id'), 'known\n');
    fs.writeFileSync(path.join(target, '.rig/global-writes.json'), `${JSON.stringify({ entries: [{
      kind: 'openclaw-mcp', path: config, server_key: 'rig-known', install_id: 'known', runtime: '.rig/runtime/rig-mcp',
      value: { command: 'node', args: [path.join(target, '.rig/runtime/rig-mcp/index.js')] }, state: 'applied',
    }] })}\n`);
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/bin/sh',
      'if [ "$1" = "mcp" ] && [ "$2" = "show" ]; then printf \'{"rig-known":{"command":"user"}}\'; exit 0; fi',
      `if [ "$1" = "mcp" ] && [ "$2" = "set" ]; then : > "${setLog}"; exit 0; fi`,
      'exit 2',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'npm'), `#!/bin/sh\n: > "${npmLog}"\n`, { mode: 0o755 });

    const oldPath = process.env.PATH;
    const oldConfig = process.env.OPENCLAW_CONFIG_PATH;
    process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
    process.env.OPENCLAW_CONFIG_PATH = config;
    try {
      assert.throws(() => registerOpenClawMcp(target), /changed|refusing/i);
    } finally {
      process.env.PATH = oldPath;
      if (oldConfig === undefined) delete process.env.OPENCLAW_CONFIG_PATH;
      else process.env.OPENCLAW_CONFIG_PATH = oldConfig;
    }

    assert.equal(fs.existsSync(npmLog), false);
    assert.equal(fs.existsSync(setLog), false);
  });
});

test('OpenClaw uninstall preserves a user-replaced named server and runtime', () => {
  withTarget((target, outside) => {
    const bin = path.join(outside, 'bin');
    const runtime = path.join(target, '.rig/runtime/rig-mcp');
    const server = path.join(runtime, 'index.js');
    const unsetLog = path.join(outside, 'unset.log');
    const config = path.join(outside, 'openclaw.json');
    fs.mkdirSync(bin);
    fs.mkdirSync(runtime, { recursive: true });
    fs.writeFileSync(server, 'server\n');
    fs.writeFileSync(path.join(target, '.rig/global-writes.json'), `${JSON.stringify({ entries: [{
      kind: 'openclaw-mcp', path: config, server_key: 'rig-known', install_id: 'known', runtime: '.rig/runtime/rig-mcp',
      value: { command: 'node', args: [server] }, state: 'applied',
    }] })}\n`);
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), `${JSON.stringify(appliedJournalRecord(1, '.rig/runtime/rig-mcp/index.js', 'server\n'))}\n`);
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/bin/sh',
      'if [ "$1" = "mcp" ] && [ "$2" = "show" ]; then printf \'{"rig-known":{"command":"user"}}\'; exit 0; fi',
      `if [ "$1" = "mcp" ] && [ "$2" = "unset" ]; then : > "${unsetLog}"; exit 0; fi`,
      'exit 2',
      '',
    ].join('\n'), { mode: 0o755 });

    const oldPath = process.env.PATH;
    process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
    try {
      const result = uninstall(target);
      assert.equal(result.status, 'best_effort');
    } finally {
      process.env.PATH = oldPath;
    }

    assert.ok(fs.existsSync(server));
    assert.equal(fs.existsSync(unsetLog), false);
  });
});

test('shipping OpenClaw bootstrap discloses the configured path before registration', () => {
  withTarget((target, outside) => {
    const root = path.join(__dirname, '..');
    const bin = path.join(outside, 'bin');
    const config = path.join(outside, 'configured-openclaw.json');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'openclaw'), [
      '#!/bin/sh',
      'if [ "$1" = "mcp" ] && [ "$2" = "show" ]; then printf "{}"; exit 0; fi',
      'if [ "$1" = "mcp" ] && [ "$2" = "set" ]; then exit 0; fi',
      'exit 2',
      '',
    ].join('\n'), { mode: 0o755 });
    fs.writeFileSync(path.join(bin, 'npm'), '#!/bin/sh\nmkdir -p node_modules\n', { mode: 0o755 });

    const run = spawnSync('/bin/dash', [path.join(root, 'rig/bootstrap.sh'), '--target', target, '--with-runtime', '--openclaw-mcp'], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, OPENCLAW_CONFIG_PATH: config },
    });
    assert.equal(run.status, 0, run.stderr);
    assert.match(run.stdout, new RegExp(`WARNING:.*${config.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    assert.ok(run.stdout.indexOf(config) < run.stdout.indexOf('openclaw: registered'));
  });
});

test('payload post-step failures keep the install journal incomplete', () => {
  withTarget((target) => {
    assert.throws(() => runPayload(target, [], {
      activeDelivery: true,
      afterPayload() { throw new Error('post-step failed'); },
    }), /post-step failed/);

    const states = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8')
      .trim().split('\n').map((line) => JSON.parse(line))
      .filter((record) => record.kind === 'install_state');
    assert.equal(states.at(-1).complete, false);
  });
});

test('purge drops the report scope and preserves user-owned data outside it', () => {
  withTarget((target) => {
    fs.mkdirSync(path.join(target, '.rig/run-history'), { recursive: true });
    fs.mkdirSync(path.join(target, 'reports/rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/network-policy.json'), '{"user":true}\n');
    fs.writeFileSync(path.join(target, '.rig/run-history/a'), 'history\n');
    fs.writeFileSync(path.join(target, 'reports/rig/a'), 'report\n');
    const observed = [];
    const result = uninstall(target, {
      purge: true,
      beforePurge: (paths) => observed.push({ paths, policy: fs.existsSync(path.join(target, '.rig/network-policy.json')) }),
    });
    assert.deepEqual(observed, [{ paths: ['reports/rig', 'journal-owned runtime evidence'], policy: true }]);
    assert.deepEqual(result.purge_list, ['reports/rig', 'journal-owned runtime evidence']);
    assert.equal(fs.readFileSync(path.join(target, '.rig/network-policy.json'), 'utf8'), '{"user":true}\n');
    // AT-UNINSTALL-3: an explicit purge drops the whole report scope.
    assert.equal(fs.existsSync(path.join(target, 'reports/rig')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/run-history/a')), true);
  });
});

test('resume reconciles a write that landed after its pending journal record', () => {
  withTarget((target) => {
    const contents = 'landed-before-crash\n';
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/recovered'), contents);
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), `${JSON.stringify({
      seq: 1,
      path: '.rig/recovered',
      ownership: 'create_owned',
      operation: 'create_owned',
      transaction_kind: 'install',
      state: 'pending',
      preimage_digest: null,
      desired_digest: sha256(contents),
    })}\n`);

    const result = resumeInstall(target, {
      operations: [{ path: '.rig/recovered', content: contents }],
    });

    assert.equal(result.complete, true);
    const records = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8')
      .trim().split('\n').map((line) => JSON.parse(line));
    assert.ok(records.some((record) => record.seq === 1 && record.state === 'applied'));
    assert.ok(records.some((record) => record.kind === 'install_state' && record.complete === true));
  });
});

test('a bare repository receives the neutral skills, catalogue, and safety runtime', () => {
  withTarget((target) => {
    const result = runPayload(target, undefined, { activeDelivery: true });

    assert.deepEqual(result.hosts, []);
    for (const skill of ['onboarding']) {
      assert.ok(fs.existsSync(path.join(target, '.rig/skills', skill, 'SKILL.md')), skill);
    }
    assert.equal(fs.existsSync(path.join(target, '.rig/skills/setup-browser-cookies')), false);
    for (const rel of [
      '.rig/bin/rig',
      '.rig/runtime/rig/materialize.js',
      '.rig/runtime/rig/catalog/baseline/check.js',
      '.rig/runtime/rig/corpus/services/development/code-quality/lint-format/minimal.md',
      '.rig/runtime/rig/lib/policy.js',
      '.rig/runtime/rig/lib/enforcement.js',
      '.rig/runtime/rig/lib/lifecycle.js',
    ]) {
      assert.ok(fs.existsSync(path.join(target, rel)), rel);
    }
  });
});

test('the active MCP runtime reads its packaged canonical Rig instructions', () => {
  withTarget((target) => {
    runPayload(target, [], { activeDelivery: true });

    const installedSkill = path.join(target, '.rig/runtime/skills/rig/SKILL.md');
    assert.equal(
      fs.readFileSync(installedSkill, 'utf8'),
      fs.readFileSync(path.join(__dirname, '..', 'skills/rig/SKILL.md'), 'utf8'),
    );

    const { getRigInstructions } = require(path.join(target, '.rig/runtime/hooks/rig-instructions.js'));
    assert.match(getRigInstructions('full'), /Hardware is never the ideal on paper/);
  });
});

test('catalogue packs contain service-specific policy and check contracts', () => {
  const root = path.join(__dirname, '..');
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'rig/corpus/catalogue.json'), 'utf8'));
  const bodiesSeen = new Map();

  for (const service of catalog.services) {
    if (service.id !== 'development.code-quality.lint-format') {
      assert.ok(service.acceptance_evidence, `${service.id} acceptance evidence`);
      for (const grade of ['minimal', 'mid', 'maximal']) {
        assert.match(service.acceptance_evidence[grade].target, new RegExp(service.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        assert.ok(service.acceptance_evidence[grade].given && service.acceptance_evidence[grade].pass && service.acceptance_evidence[grade].fail);
      }
    }
    const bodies = Object.entries(service.fragments).map(([part, rel]) => {
      const body = fs.readFileSync(path.join(root, 'rig', rel), 'utf8');
      if (part === 'identity') {
        for (const scope of service.owns) assert.match(body, new RegExp(scope.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${service.id} owns ${scope}`);
        for (const signal of service.applicability.any || []) assert.match(body, new RegExp(signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${service.id} applicability ${signal}`);
        assert.match(body, /Disposition:/, `${service.id} disposition`);
      } else {
        for (const checkId of service.checks[part] || []) {
          assert.doesNotMatch(checkId, /-(?:core|extended|thorough)$/);
          assert.match(body, new RegExp(checkId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${service.id} ${part} check ${checkId}`);
        }
      }
      assert.doesNotMatch(body, /describes the .* service\. This authoring|enforces the Policy-grade checks declared in the catalogue|carries the shared invariant the parent service depends on/i);
      return [part, body];
    });

    for (const [part, body] of bodies) {
      const key = `${part}:${body.replace(/\s+/g, ' ').trim()}`;
      const duplicate = bodiesSeen.get(key);
      assert.equal(duplicate, undefined, `${service.id} repeats ${part} content from ${duplicate}`);
      bodiesSeen.set(key, service.id);
    }
  }
});

test('all six CI providers render and apply a working additive adapter', () => {
  const { PROVIDERS, planCiIntegration, applyCiPlan, renderPipeline } = require('../rig/lib/ci-adapters');
  const fixtures = {
    'github-actions': ['.github/workflows/ci.yml', 'name: user-ci\njobs:\n  user:\n    runs-on: ubuntu-latest\n'],
    gitlab_ci: ['.gitlab-ci.yml', 'stages:\n  - test\n# user-ci\n'],
    circleci: ['.circleci/config.yml', 'version: 2.1\n# user-ci\n'],
    jenkins: ['Jenkinsfile', "// user-ci\npipeline { agent any; stages { stage('Build') { steps { sh 'make' } } } }\n"],
    buildkite: ['.buildkite/pipeline.yml', '# user-ci\nsteps:\n'],
    azure_pipelines: ['azure-pipelines.yml', '# user-ci\njobs:\n'],
  };

  assert.equal(Object.keys(PROVIDERS).length, 6);
  for (const [provider, [rel, initial]] of Object.entries(fixtures)) {
    withTarget((target) => {
      const file = path.join(target, rel);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, initial);

      const plan = planCiIntegration(target, { provider, approved: true });
      assert.equal(plan.status, 'integrated', provider);
      assert.equal(plan.evidence, 'unverified', provider);
      assert.ok(plan.artifact, provider);
      applyCiPlan(target, plan);
      const first = fs.readFileSync(file, 'utf8');
      applyCiPlan(target, planCiIntegration(target, { provider, approved: true }));
      assert.equal(fs.readFileSync(file, 'utf8'), first, `${provider} must be idempotent`);
      assert.match(first, /user-ci/, `${provider} must preserve existing config`);

      const installed = [first];
      if (provider === 'github-actions') installed.push(fs.readFileSync(path.join(target, '.github/workflows/rig.yml'), 'utf8'));
      assert.match(installed.join('\n'), /\.rig\/bin\/check\.js --scope repo/, provider);
      assert.match(renderPipeline(provider, { services: [], controls: [] }), /\.rig\/bin\/check\.js --scope repo/, provider);
    });
  }
});

test('release review validation rejects unresolved, failing, and incomplete case coverage', () => {
  const { validateReviewReceipt } = require('../rig/lib/release-evidence');
  const expected = {
    technical_spec_digest: 'a'.repeat(64),
    catalogue_digest: 'b'.repeat(64),
    implementation_digest: 'c'.repeat(64),
    implementation_base: 'origin/implement-advanced-a-la-carte-catalogue',
    acceptance_ids: ['AT-A-1', 'AT-A-2'],
  };
  const receipt = {
    schema_version: 1,
    kind: 'report-only',
    author_context: 'implementation-1',
    reviewer_context: 'review-1',
    technical_spec_digest: expected.technical_spec_digest,
    catalogue_digest: expected.catalogue_digest,
    implementation_digest: expected.implementation_digest,
    implementation_base: expected.implementation_base,
    verdict: 'pass',
    verdicts: expected.acceptance_ids.map((id) => ({ id, verdict: 'pass' })),
    findings: [],
    unresolved: [],
  };

  assert.equal(validateReviewReceipt(receipt, expected), true);
  assert.throws(() => validateReviewReceipt({ ...receipt, unresolved: ['AT-A-2'] }, expected), /unresolved/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdict: 'fail' }, expected), /verdict/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, findings: [{ severity: 'blocker' }] }, expected), /block/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, findings: [{ severity: 'major' }] }, expected), /blocking/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdicts: receipt.verdicts.slice(0, 1) }, expected), /missing|coverage/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdicts: [...receipt.verdicts, { id: 'AT-X-1', verdict: 'pass' }] }, expected), /extra|coverage/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdicts: [{ id: 'AT-A-1', verdict: 'pass' }, { id: 'AT-A-1', verdict: 'pass' }] }, expected), /duplicate|coverage/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdicts: [{ id: 'AT-A-1', verdict: 'pass' }, { id: 'AT-A-2', verdict: 'fail' }] }, expected), /case verdict/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, implementation_digest: 'd'.repeat(64) }, expected), /implementation_digest/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, implementation_base: 'origin/qa-prod' }, expected), /implementation_base/i);
});

test('model-assisted secret triage requires disclosure-bound plan approval', () => {
  withTarget((target) => {
    const candidate = {
      schema_version: 1,
      controls: {},
      enforcement: {},
      allow: [],
      secrets: { model_assisted_triage: true },
    };
    const proposal = proposePolicy(target, candidate, { explicit_request: true, session: 'author-context' });
    assert.equal(proposal.disclosures.length, 1);
    assert.match(proposal.disclosures[0].text, /third.party/i);
    assert.match(proposal.disclosures[0].text, /cannot be unsent/i);

    const approval = signPolicyProposal(target, proposal);
    assert.throws(() => activatePolicy(target, proposal, { approval }), /disclosure/i);

    approval.confirmed_disclosures = [proposal.disclosures[0].digest];
    activatePolicy(target, proposal, { approval });
    const status = policyStatus(target);
    assert.equal(status.model_assisted_triage.enabled, true);
    assert.equal(status.model_assisted_triage.disclosure, proposal.disclosures[0].text);
  });
});

test('policy activation signs and preserves exact validated candidate bytes', () => {
  withTarget((target) => {
    const bytes = Buffer.from('{\n  "schema_version": 1, "controls": {}, "enforcement": {}, "allow": []\n}\n');
    const proposal = proposePolicy(target, bytes, { explicit_request: true });
    const approval = signPolicyProposal(target, proposal);
    activatePolicy(target, proposal, { approval });
    assert.deepEqual(fs.readFileSync(path.join(target, '.rig/policy/active.json')), bytes);
    assert.equal(proposal.candidate_digest, sha256(bytes));
    assert.throws(() => proposePolicy(target, '{"schema_version":1,"allow":[],"allow":[]} ', { explicit_request: true }), /duplicate/i);
  });
});

test('matched content reaches the agent only through the active signed triage policy', () => {
  withTarget((target) => {
    const matched = ['ghp_', 'fixtureValue12345678901234567890'].join('');
    const report = { findings: [{ rule: 'credential', path: 'a.txt', matched }] };
    assert.doesNotMatch(JSON.stringify(projectForAgent(report, { model_assisted_triage: true })), new RegExp(matched));
    const proposal = proposePolicy(target, Buffer.from(JSON.stringify({
      schema_version: 1, controls: {}, enforcement: {}, allow: [],
      secrets: { model_assisted_triage: true },
    })), { explicit_request: true });
    const approval = signPolicyProposal(target, proposal);
    approval.confirmed_disclosures = [proposal.disclosures[0].digest];
    activatePolicy(target, proposal, { approval });
    assert.match(JSON.stringify(projectForAgent(report, { target })), new RegExp(matched));
    fs.appendFileSync(path.join(target, '.rig/policy/active.json'), ' ');
    assert.doesNotMatch(JSON.stringify(projectForAgent(report, { target })), new RegExp(matched));
  });
});

test('rewriting active.json and patching the receipt candidate_digest to match does not pass verification', () => {
  withTarget((target) => {
    const activePath = path.join(target, '.rig/policy/active.json');
    const receiptPath = path.join(target, '.rig/policy/activation-receipt.json');
    const proposal = proposePolicy(target, Buffer.from(JSON.stringify({
      schema_version: 1, controls: {}, enforcement: {}, allow: [],
      secrets: { model_assisted_triage: true },
    })), { explicit_request: true });
    const approval = signPolicyProposal(target, proposal);
    approval.confirmed_disclosures = [proposal.disclosures[0].digest];
    activatePolicy(target, proposal, { approval });
    assert.equal(policyStatus(target).model_assisted_triage.authorized, true, 'sanity: a real activation verifies');

    // An attacker who can write `.rig/policy/` (but does not hold the signing
    // key) rewrites the active policy and patches the receipt's bare
    // `candidate_digest` field to match the new bytes. The signature itself
    // — over `proposal_digest` — is untouched and still verifies fine, so
    // this must fail only because `candidate_digest` is bound inside the
    // signed proposal rather than trusted as a loose field.
    const malicious = Buffer.from(`${JSON.stringify({
      schema_version: 1, controls: {}, enforcement: {}, allow: [],
      secrets: { model_assisted_triage: true },
    })} `);
    fs.writeFileSync(activePath, malicious);
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    receipt.candidate_digest = sha256(malicious);
    fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

    assert.equal(
      policyStatus(target).model_assisted_triage.authorized,
      false,
      'a spoofed candidate_digest without a new signature must not authorize triage',
    );
  });
});

test('policy CLI shows disclosure before activating model-assisted triage', () => {
  withTarget((target) => {
    const root = path.join(__dirname, '..');
    const materializer = path.join(root, 'rig/materialize.js');
    const policy = path.join(target, 'policy.json');
    const proposal = path.join(target, 'proposal.json');
    const approval = path.join(target, 'approval.json');
    fs.writeFileSync(policy, `${JSON.stringify({
      schema_version: 1,
      controls: {},
      enforcement: {},
      allow: [],
      secrets: { model_assisted_triage: true },
    }, null, 2)}\n`);

    const proposed = spawnSync(process.execPath, [
      materializer, 'policy', 'propose', '--target', target, '--policy', policy, '--out', proposal,
    ], { encoding: 'utf8' });
    assert.equal(proposed.status, 0, proposed.stderr);
    const planned = JSON.parse(fs.readFileSync(proposal, 'utf8'));
    assert.match(planned.disclosures[0].text, /cannot be unsent/i);

    const signedApproval = signPolicyProposal(target, planned);
    signedApproval.confirmed_disclosures = [planned.disclosures[0].digest];
    fs.writeFileSync(approval, `${JSON.stringify(signedApproval, null, 2)}\n`);
    const activated = spawnSync(process.execPath, [
      materializer, 'policy', 'activate', '--target', target, '--proposal', proposal, '--approval', approval,
    ], { encoding: 'utf8' });
    assert.equal(activated.status, 0, activated.stderr);

    const status = spawnSync(process.execPath, [
      materializer, 'policy', 'status', '--target', target,
    ], { encoding: 'utf8' });
    assert.equal(status.status, 0, status.stderr);
    assert.equal(JSON.parse(status.stdout).model_assisted_triage.enabled, true);
  });
});

test('implementation digest covers publishable worktree bytes but excludes review receipts', () => {
  const { implementationDigest } = require('../rig/lib/release-evidence');
  withTarget((target) => {
    spawnSync('git', ['init', '-q'], { cwd: target });
    fs.writeFileSync(path.join(target, 'tracked.txt'), 'one\n');
    spawnSync('git', ['add', 'tracked.txt'], { cwd: target });
    fs.writeFileSync(path.join(target, 'untracked.txt'), 'two\n');
    const first = implementationDigest(target);

    fs.writeFileSync(path.join(target, 'untracked.txt'), 'changed\n');
    const changed = implementationDigest(target);
    assert.notEqual(changed.digest, first.digest);

    const reviews = path.join(target, 'wiki/sources/reviews');
    fs.mkdirSync(reviews, { recursive: true });
    fs.writeFileSync(path.join(reviews, 'current.review.json'), '{}\n');
    assert.equal(implementationDigest(target).digest, changed.digest);
  });
});

test('review wrapper output validates without schema translation', () => {
  withTarget((target) => {
    const root = path.join(__dirname, '..');
    const bin = path.join(target, 'bin');
    const out = path.join(target, 'receipt.json');
    fs.mkdirSync(bin);
    const acceptance = fs.readFileSync(path.join(root, 'wiki/gate1/acceptance.md'), 'utf8');
    const ids = [...new Set([...acceptance.matchAll(/^- \*\*(AT-[A-Z]+-?\d+)/gm)].map((match) => match[1]))].sort();
    const reported = JSON.stringify({
      verdict: 'pass',
      verdicts: ids.map((id) => ({ id, verdict: 'pass', note: 'covered' })),
      findings: [],
      unresolved: [],
    });
    const fake = path.join(bin, 'claude');
    const response = `${'```json'}\n${reported}\n${'```'}\n`;
    fs.writeFileSync(fake, [
      '#!/usr/bin/env node',
      "'use strict';",
      'process.stdin.resume();',
      'process.stdin.on(\'end\', () => {',
      `  process.stdout.write(${JSON.stringify(response)});`,
      '});',
      '',
    ].join('\n'), { mode: 0o755 });

    const run = spawnSync(process.execPath, [
      path.join(root, 'scripts/review-receipt.js'),
      '--target', path.join(root, 'wiki/gate2/technical-spec.md'),
      '--catalogue', path.join(root, 'rig/corpus/catalogue.json'),
      '--implementation-root', root,
      '--base', 'origin/implement-advanced-a-la-carte-catalogue',
      '--gate1', path.join(root, 'wiki/gate1/business-spec.md') + ',' + path.join(root, 'wiki/gate1/acceptance.md'),
      '--author-context', 'implementation-1',
      '--model', 'fake-reviewer',
      '--out', out,
    ], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` } });
    assert.equal(run.status, 0, run.stderr);

    const receipt = JSON.parse(fs.readFileSync(out, 'utf8'));
    const { catalogueDigest, implementationDigest, validateReviewReceipt } = require('../rig/lib/release-evidence');
    assert.equal(validateReviewReceipt(receipt, {
      technical_spec_digest: sha256(fs.readFileSync(path.join(root, 'wiki/gate2/technical-spec.md'))),
      catalogue_digest: catalogueDigest(path.join(root, 'rig/corpus/catalogue.json')),
      implementation_digest: implementationDigest(root).digest,
      implementation_base: 'origin/implement-advanced-a-la-carte-catalogue',
      acceptance_ids: ids,
    }), true);
  });
});

test('review-receipt persists the complete batch and runs one explicit targeted re-review on changed bytes', () => {
  withTarget((target) => {
    const root = path.join(__dirname, '..');
    const candidate = path.join(target, 'candidate');
    const out = path.join(target, 'receipt.json');
    const promptPath = path.join(target, 'remediation-prompt.txt');
    const authorContext = 'review-convergence';
    fs.mkdirSync(candidate);
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: candidate }).status, 0);
    fs.writeFileSync(path.join(candidate, 'candidate.js'), 'module.exports = 1;\n');
    spawnSync('git', ['add', 'candidate.js'], { cwd: candidate });

    const first = runReviewReceipt(target, { verdict: 'fail', authorContext, out, implementationRoot: candidate });
    assert.notEqual(first.run.status, 0);
    const outcomesPath = `${out}.reviews.jsonl`;
    const original = JSON.parse(fs.readFileSync(outcomesPath, 'utf8').trim());
    assert.equal(original.review_phase, 'comprehensive');
    assert.equal(original.verdict, 'fail');
    assert.equal(original.finding_batch.length, 1);
    const priorFinding = original.finding_batch[0];

    const unchanged = runReviewReceipt(target, {
      verdict: 'pass', authorContext, out, implementationRoot: candidate, extraArgs: ['--remediate'],
    });
    assert.notEqual(unchanged.run.status, 0);
    assert.match(unchanged.run.stderr, /requires a changed candidate/);
    assert.equal(unchanged.invocationCount, 0);

    fs.writeFileSync(path.join(candidate, 'candidate.js'), 'module.exports = 2;\n');
    const acceptance = fs.readFileSync(path.join(root, 'wiki/gate1/acceptance.md'), 'utf8');
    const ids = [...new Set([...acceptance.matchAll(/^- \*\*(AT-[A-Z]+-?\d+)/gm)].map((match) => match[1]))].sort();
    const remediationReport = {
      verdict: 'pass',
      verdicts: ids.map((id) => ({ id, verdict: 'pass', note: 'reviewed changed candidate' })),
      findings: [],
      finding_dispositions: [{
        id: priorFinding.id,
        status: 'resolved',
        evidence: {
          path: 'candidate.js',
          digest: sha256(fs.readFileSync(path.join(candidate, 'candidate.js'))),
          check: { command: 'node --test candidate.test.js', result: 'pass' },
        },
      }],
      unresolved: [],
    };
    const rerun = runReviewReceipt(target, {
      verdict: 'pass', authorContext, out, implementationRoot: candidate,
      extraArgs: ['--remediate'],
      env: { RIG_CAPTURE_REVIEW_PROMPT: promptPath },
      reported: remediationReport,
    });
    assert.equal(rerun.run.status, 0, rerun.run.stderr);
    const prompt = fs.readFileSync(promptPath, 'utf8');
    assert.match(prompt, /REMEDIATION RE-REVIEW/);
    assert.match(prompt, /Prior finding batch/);
    assert.match(prompt, new RegExp(priorFinding.id));
    assert.match(prompt, /serious new defects/);
    assert.match(prompt, /Return every acceptance verdict as usual/);

    const records = fs.readFileSync(outcomesPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.equal(records.length, 2, 'both full review outcomes remain available');
    assert.equal(records[1].review_phase, 'remediation');
    assert.equal(records[1].remediates_review_id, original.review_id);
    assert.equal(JSON.parse(fs.readFileSync(out, 'utf8')).review_phase, 'remediation');
    const attempts = JSON.parse(fs.readFileSync(`${out}.attempts.json`, 'utf8'));
    assert.equal(attempts.failures, 1, 'the pass does not clear the completed failure count');
    assert.equal(attempts.attempts.length, 2, 'attempt history is retained after pass');

    fs.writeFileSync(path.join(candidate, 'candidate.js'), 'module.exports = 3;\n');
    const staleBatch = runReviewReceipt(target, {
      verdict: 'pass', authorContext, out, implementationRoot: candidate, extraArgs: ['--remediate'],
    });
    assert.notEqual(staleBatch.run.status, 0);
    assert.match(staleBatch.run.stderr, /latest completed binding review to be a failure/);
    assert.equal(staleBatch.invocationCount, 0, 'a prior failed batch cannot be replayed after a passing remediation');
  });
});

test('review-receipt does not charge incomplete acceptance coverage as a finding batch', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const incomplete = runReviewReceipt(target, {
      verdict: 'fail', authorContext: 'incomplete-review', out,
      reported: { verdict: 'fail', verdicts: [], findings: [], unresolved: [] },
    });
    assert.notEqual(incomplete.run.status, 0);
    assert.match(incomplete.run.stderr, /reviewer returned an incomplete review: review verdict coverage mismatch/);
    assert.equal(JSON.parse(fs.readFileSync(`${out}.attempts.json`, 'utf8')).failures, 0);
    assert.equal(fs.existsSync(`${out}.reviews.jsonl`), false, 'an incomplete review cannot become a remediation batch');
  });
});

test('review-receipt rejects a candidate that changes while the independent reviewer runs', () => {
  withTarget((target) => {
    const root = path.join(__dirname, '..');
    const candidate = path.join(target, 'candidate');
    const out = path.join(target, 'receipt.json');
    fs.mkdirSync(candidate);
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: candidate }).status, 0);
    const source = path.join(candidate, 'candidate.js');
    fs.writeFileSync(source, 'module.exports = 1;\n');
    spawnSync('git', ['add', 'candidate.js'], { cwd: candidate });

    const acceptance = fs.readFileSync(path.join(root, 'wiki/gate1/acceptance.md'), 'utf8');
    const ids = [...new Set([...acceptance.matchAll(/^- \*\*(AT-[A-Z]+-?\d+)/gm)].map((match) => match[1]))].sort();
    const result = runReviewReceipt(target, {
      verdict: 'pass', authorContext: 'moving-candidate', out, implementationRoot: candidate,
      env: { RIG_MUTATE_IMPLEMENTATION: source },
      reported: { verdict: 'pass', verdicts: ids.map((id) => ({ id, verdict: 'pass', note: 'covered' })), findings: [], unresolved: [] },
    });
    assert.notEqual(result.run.status, 0);
    assert.match(result.run.stderr, /candidate changed during review/);
    assert.ok(!fs.existsSync(out), 'a report on moving bytes never produces a receipt');
    assert.equal(JSON.parse(fs.readFileSync(`${out}.attempts.json`, 'utf8')).failures, 0);
  });
});

test('the POSIX installer downloads and executes a named tagged archive', { timeout: 30000 }, () => {
  withTarget((target) => {
    const root = path.join(__dirname, '..');
    const source = fs.readFileSync(path.join(root, 'install.sh'), 'utf8');
    assert.match(source, /^#!\/bin\/sh\n/);
    assert.doesNotMatch(source, /pipefail|\$\{[^}]+:[0-9]+(?::[0-9]+)?\}|^\s*\[\[/m);

    const staging = path.join(target, 'staging', 'Rig-v6.0.0');
    fs.mkdirSync(staging, { recursive: true });
    for (const rel of ['rig', '.agents', '.claude', 'skills']) {
      fs.cpSync(path.join(root, rel), path.join(staging, rel), { recursive: true, filter: (src) => !src.split(path.sep).includes('node_modules') });
    }
    const archive = path.join(target, 'rig-v6.0.0.tar.gz');
    const packed = spawnSync('tar', ['-czf', archive, '-C', path.dirname(staging), path.basename(staging)], { encoding: 'utf8' });
    assert.equal(packed.status, 0, packed.stderr);

    const bin = path.join(target, 'bin');
    const downloadLog = path.join(target, 'download.log');
    const installTarget = path.join(target, 'repository');
    fs.mkdirSync(bin);
    fs.mkdirSync(installTarget);
    fs.writeFileSync(path.join(bin, 'curl'), [
      '#!/bin/sh',
      'printf "%s\\n" "$*" >> "$RIG_TEST_DOWNLOAD_LOG"',
      'while [ "$#" -gt 0 ]; do',
      '  if [ "$1" = "-o" ]; then cp "$RIG_TEST_ARCHIVE" "$2"; exit 0; fi',
      '  shift',
      'done',
      'exit 1',
      '',
    ].join('\n'), { mode: 0o755 });

    // Network downloads belong to clean-install E2E; this unit isolates tag
    // resolution/extraction and supplies an empty dependency staging tree.
    fs.writeFileSync(path.join(bin, 'npm'), '#!/bin/sh\nmkdir -p node_modules\n', { mode: 0o755 });

    const installed = spawnSync('/bin/dash', [
      path.join(root, 'install.sh'), '--version', 'v6.0.0', '--target', installTarget,
    ], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}${path.delimiter}${process.env.PATH}`,
        RIG_TEST_ARCHIVE: archive,
        RIG_TEST_DOWNLOAD_LOG: downloadLog,
      },
    });
    assert.equal(installed.status, 0, installed.stderr);
    assert.match(fs.readFileSync(downloadLog, 'utf8'), /refs\/tags\/v6\.0\.0\.tar\.gz/);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(installTarget, '.rig/release.json'), 'utf8')), { tag: 'v6.0.0', hosts: [] });
    const neutralSkills = fs.readdirSync(path.join(installTarget, '.rig/skills'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(installTarget, '.rig/skills', entry.name, 'SKILL.md')))
      .map((entry) => entry.name);
    assert.deepEqual(neutralSkills, ['onboarding']);
    assert.ok(fs.existsSync(path.join(installTarget, '.rig/runtime/rig/corpus/services')));
    assert.ok(fs.existsSync(path.join(installTarget, '.rig/runtime/rig/lib/policy.js')));
    const inspection = path.join(installTarget, 'inspection.json');
    const runtime = spawnSync(path.join(installTarget, '.rig/bin/rig'), [
      'inspect', '--target', installTarget, '--host', 'generic', '--out', inspection,
    ], { encoding: 'utf8' });
    assert.equal(runtime.status, 0, runtime.stderr);
    assert.ok(fs.existsSync(inspection));
  });
});

test('review-receipt caps re-review after one retry for the same author-context (RIG-124)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const authorContext = 'release-attempt-1';

    const first = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.notEqual(first.run.status, 0);
    assert.equal(first.invocationCount, 1);

    const second = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.notEqual(second.run.status, 0);
    assert.equal(second.invocationCount, 1, 'the allowed one re-review still spawns a reviewer');

    const third = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.notEqual(third.run.status, 0);
    assert.match(third.run.stderr, /re-review cap reached/);
    assert.equal(third.invocationCount, 0, 'the capped attempt must not spawn another reviewer');

    const forcedInterim = runReviewReceipt(target, {
      verdict: 'pass', authorContext, out, extraArgs: ['--force-rereview', '--interim'],
    });
    assert.equal(forcedInterim.run.status, 0, forcedInterim.run.stderr);
    assert.equal(JSON.parse(fs.readFileSync(`${out}.attempts.json`, 'utf8')).extra_review_used, false,
      'an interim pass does not consume the extra binding authorization');

    const forced = runReviewReceipt(target, { verdict: 'fail', authorContext, out, extraArgs: ['--force-rereview'] });
    assert.equal(forced.invocationCount, 1, '--force-rereview grants one explicit additional binding attempt');
    const repeatedForce = runReviewReceipt(target, { verdict: 'fail', authorContext, out, extraArgs: ['--force-rereview'] });
    assert.equal(repeatedForce.invocationCount, 0, 'the one extra binding authorization cannot be replayed');
    assert.match(repeatedForce.run.stderr, /already been consumed/);
  });
});

test('review-receipt cap is scoped per author-context and a pass does not reset failures (RIG-124)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');

    // Cap out 'release-attempt-a': two fails, then a third that must be blocked.
    runReviewReceipt(target, { verdict: 'fail', authorContext: 'release-attempt-a', out });
    runReviewReceipt(target, { verdict: 'fail', authorContext: 'release-attempt-a', out });
    const capped = runReviewReceipt(target, { verdict: 'fail', authorContext: 'release-attempt-a', out });
    assert.equal(capped.invocationCount, 0, 'release-attempt-a is now capped');

    const otherContext = runReviewReceipt(target, { verdict: 'fail', authorContext: 'release-attempt-b', out });
    assert.equal(otherContext.invocationCount, 1, 'a different author-context is not capped by another attempt\'s failures');

    const fixed = runReviewReceipt(target, { verdict: 'pass', authorContext: 'release-attempt-b', out });
    assert.equal(fixed.run.status, 0, fixed.run.stderr);
    assert.ok(fs.existsSync(out));

    const again = runReviewReceipt(target, { verdict: 'fail', authorContext: 'release-attempt-b', out });
    assert.equal(again.invocationCount, 1, 'the pass did not clear the one remaining completed-review authorization');

    const switchedBack = runReviewReceipt(target, { verdict: 'fail', authorContext: 'release-attempt-a', out });
    assert.equal(switchedBack.invocationCount, 0, 'switching contexts cannot erase the earlier context cap');
    assert.match(switchedBack.run.stderr, /re-review cap reached/);
  });
});

test('review-receipt fails closed on corrupt attempt state and outcome journals before spawning', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const authorContext = 'review-corrupt-history';
    fs.writeFileSync(`${out}.attempts.json`, '{ truncated');
    const badState = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.equal(badState.invocationCount, 0);
    assert.match(badState.run.stderr, /attempt history is corrupt/);

    fs.unlinkSync(`${out}.attempts.json`);
    fs.writeFileSync(`${out}.reviews.jsonl`, '{ truncated\n');
    const badJournal = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.equal(badJournal.invocationCount, 0);
    assert.match(badJournal.run.stderr, /review outcome journal is corrupt/);
  });
});

test('a pass report that fails receipt validation is an execution failure, not a spent authorization (RIG-124.3)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const attemptsPath = `${out}.attempts.json`;
    const authorContext = 'release-attempt-invalid-pass';
    const malformedPass = { verdict: 'pass', verdicts: [], findings: [], unresolved: [] };

    runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.equal(JSON.parse(fs.readFileSync(attemptsPath, 'utf8')).failures, 1);

    // A pass that cannot be bound to the acceptance ids is a self-contradictory
    // report. It must not be able to buy a completed-review authorization by
    // being malformed, and it must not be able to burn one either.
    const invalidPass = runReviewReceipt(target, { verdict: 'pass', authorContext, out, reported: malformedPass });
    assert.notEqual(invalidPass.run.status, 0);
    assert.match(invalidPass.run.stderr, /coverage mismatch/);
    assert.match(invalidPass.run.stderr, /authorization not spent/);
    const afterInvalid = JSON.parse(fs.readFileSync(attemptsPath, 'utf8'));
    assert.equal(afterInvalid.failures, 1, 'a malformed pass is not a completed review');
    assert.equal(afterInvalid.infra_streak, 1);
    assert.equal(afterInvalid.in_flight, null, 'the attempt is closed, not left in flight');
    assert.equal(afterInvalid.attempts.at(-1).state, 'failed');

    // There is no internal retry loop; every provider/execution retry must be
    // an explicit caller action and these failures never spend review auth.
    runReviewReceipt(target, { verdict: 'pass', authorContext, out, reported: malformedPass });
    runReviewReceipt(target, { verdict: 'pass', authorContext, out, reported: malformedPass });
    const retried = runReviewReceipt(target, { verdict: 'pass', authorContext, out, reported: malformedPass });
    assert.notEqual(retried.run.status, 0);
    assert.equal(retried.invocationCount, 1, 'provider failures do not consume review authorization');
    assert.equal(JSON.parse(fs.readFileSync(attemptsPath, 'utf8')).failures, 1);
  });
});

test('a killed/timed-out reviewer spawn is recorded but spends no authorization (RIG-124.3)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const attemptsPath = `${out}.attempts.json`;
    const authorContext = 'release-attempt-timeout';
    const hangingStub = '#!/bin/sh\ncat >/dev/null\nsleep 3600\n';

    const first = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.notEqual(first.run.status, 0);

    const timedOut = runReviewReceipt(target, {
      verdict: 'fail',
      authorContext,
      out,
      stub: hangingStub,
      env: { RIG_REVIEW_RECEIPT_TIMEOUT_MS: '300' },
    });
    assert.notEqual(timedOut.run.status, 0, 'a hung reviewer spawn must still end the process with a failure');

    // RIG-124.1 required that the attempt never be silently dropped; RIG-124.3
    // keeps that guarantee by persisting it, while refusing to call a reviewer
    // that produced no verdict a completed review of these bytes.
    const state = JSON.parse(fs.readFileSync(attemptsPath, 'utf8'));
    assert.equal(state.failures, 1, 'the timeout said nothing about the reviewed bytes');
    assert.equal(state.infra_streak, 1);
    assert.equal(state.in_flight, null);
    assert.equal(state.attempts.at(-1).state, 'failed');
    assert.match(state.attempts.at(-1).reason, /timed out/);

    const third = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.equal(third.invocationCount, 1, 'the one genuine re-review is still available');
  });
});

test('killing a hung reviewer spawn leaves no descendant process still running (RIG-124.1)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const authorContext = 'release-attempt-orphan';
    const childMarker = path.join(target, 'child-alive');
    // Backgrounds a grandchild before blocking on its own long sleep, so the
    // grandchild is still alive and unreaped at the moment the timeout fires.
    const hangingWithChildStub =
      `#!/bin/sh\ncat >/dev/null\n( sleep 1; printf 'x' >> '${childMarker}' ) &\nsleep 3600\n`;

    runReviewReceipt(target, {
      verdict: 'fail',
      authorContext,
      out,
      stub: hangingWithChildStub,
      env: { RIG_REVIEW_RECEIPT_TIMEOUT_MS: '300' },
    });

    // Give the backgrounded grandchild time to run if it survived the kill.
    spawnSync('sleep', ['1.5']);
    assert.ok(!fs.existsSync(childMarker), 'a process the hung reviewer forked must not survive the kill');
  });
});

test('review-receipt --interim never writes the binding receipt (RIG-124)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');

    const passing = runReviewReceipt(target, { verdict: 'pass', authorContext: 'release-attempt-1', out, extraArgs: ['--interim'] });
    assert.equal(passing.run.status, 0, passing.run.stderr);
    assert.match(passing.run.stdout, /interim pass — no receipt written/);
    assert.ok(!fs.existsSync(out), 'an interim pass must never produce the release-evidence receipt');

    const failing = runReviewReceipt(target, { verdict: 'fail', authorContext: 'release-attempt-2', out, extraArgs: ['--interim'] });
    assert.notEqual(failing.run.status, 0);
    assert.ok(!fs.existsSync(out));
  });
});

test('review-receipt does not spend an authorization on a provider failure (RIG-124.2)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const attemptsPath = `${out}.attempts.json`;
    const authorContext = 'release-attempt-provider';
    // Exactly the shape of the three recorded losses: the reviewer announces an
    // exhausted usage window and exits non-zero without reviewing anything.
    const limitStub = '#!/bin/sh\ncat >/dev/null\necho "You have hit your weekly limit, resets at Oct 23 9:30am" >&2\nexit 1\n';

    const providerFail = runReviewReceipt(target, { verdict: 'fail', authorContext, out, stub: limitStub });
    assert.notEqual(providerFail.run.status, 0, 'the run still fails loudly');
    assert.match(providerFail.run.stderr, /authorization not spent/);
    assert.equal(
      JSON.parse(fs.readFileSync(attemptsPath, 'utf8')).failures,
      0,
      'a reviewer that never reviewed must leave the cap untouched',
    );

    // Two genuine failing reviews are still available afterwards.
    const real1 = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.equal(real1.invocationCount, 1);
    const real2 = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.equal(real2.invocationCount, 1, 'the provider failure did not eat the allowed re-review');
    const capped = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.equal(capped.invocationCount, 0, 'two genuine failures still cap');
    assert.match(capped.run.stderr, /re-review cap reached/);
  });
});

test('classification uses process and output evidence, never vendor error text (RIG-124.3)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const attemptsPath = `${out}.attempts.json`;
    const authorContext = 'release-attempt-plain-exit';
    // No provider signature anywhere in the output: under the old regex rules
    // this was charged as review signal. A non-zero exit still means no verdict
    // was produced, so there is nothing to charge.
    const brokenStub = '#!/bin/sh\ncat >/dev/null\necho "assertion failed in reviewer" >&2\nexit 2\n';

    const broken = runReviewReceipt(target, { verdict: 'fail', authorContext, out, stub: brokenStub });
    assert.notEqual(broken.run.status, 0);
    assert.match(broken.run.stderr, /authorization not spent/);
    assert.equal(JSON.parse(fs.readFileSync(attemptsPath, 'utf8')).failures, 0);

    // Exit 0 with no parseable verdict is equally not a review.
    const emptyStub = '#!/bin/sh\ncat >/dev/null\nexit 0\n';
    const empty = runReviewReceipt(target, { verdict: 'fail', authorContext, out, stub: emptyStub });
    assert.notEqual(empty.run.status, 0);
    assert.match(empty.run.stderr, /no json report/);
    const afterEmpty = JSON.parse(fs.readFileSync(attemptsPath, 'utf8'));
    assert.equal(afterEmpty.failures, 0);
    assert.equal(afterEmpty.infra_streak, 2, 'consecutive infrastructure failures accumulate');

    // Exit 0 with a report whose verdict is not pass/fail is not a review either.
    const nonsense = runReviewReceipt(target, {
      verdict: 'fail',
      authorContext,
      out,
      reported: { verdict: 'maybe', verdicts: [], findings: [], unresolved: [] },
    });
    assert.match(nonsense.run.stderr, /no valid verdict/);
    assert.equal(JSON.parse(fs.readFileSync(attemptsPath, 'utf8')).failures, 0);
  });
});

test('review-receipt carries finding classes into the next round and flags graduation (RIG-124.2)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const historyPath = `${out}.history.json`;
    const authorContext = 'release-attempt-history';

    const first = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.notEqual(first.run.status, 0);
    const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    const key = 'correctness|x';
    assert.deepEqual(history[authorContext].items[key].rounds, [1], 'the finding fired in round 1');
    assert.equal(history[authorContext].items[key].anchor, 'x');
    assert.equal(history[authorContext].categories.correctness, 1, 'category tally is a secondary hint');

    // Second round: the prompt the reviewer receives must name the prior class.
    const promptLog = path.join(target, 'prompt.txt');
    const capturePromptStub = [
      '#!/usr/bin/env node',
      "'use strict';",
      'const fs = require("node:fs");',
      'let buf = "";',
      'process.stdin.on("data", (d) => { buf += d; });',
      'process.stdin.on("end", () => {',
      `  fs.writeFileSync(${JSON.stringify(promptLog)}, buf);`,
      '  process.stdout.write("no report\\n");',
      '});',
      '',
    ].join('\n');
    runReviewReceipt(target, { verdict: 'fail', authorContext, out, stub: capturePromptStub });
    const prompt = fs.readFileSync(promptLog, 'utf8');
    assert.doesNotMatch(prompt, /PRIOR ROUNDS/, 'a fresh review is independent of prior finding history');

    // A real second finding of the same class reaches the graduation threshold.
    // No --force-rereview needed: the prompt-probe round produced no verdict, so
    // it was an infrastructure failure and spent no authorization.
    const second = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.match(second.run.stdout, /due to graduate into an automated check/);
    // Rounds 1 and 2, not 1 and 3: the prompt-probe run above produced no
    // parseable report, so it never reached the recording step.
    assert.match(second.run.stdout, /correctness ×2 \(rounds 1, 2\)/);
    assert.deepEqual(
      JSON.parse(fs.readFileSync(historyPath, 'utf8'))[authorContext].items['correctness|x'].rounds,
      [1, 2],
      'the same finding is tracked per round, not as a bare count',
    );
  });
});

test('an interrupted in-flight attempt is recovered exactly once (RIG-124.3)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const attemptsPath = `${out}.attempts.json`;
    const authorContext = 'release-attempt-interrupted';

    // What a process killed mid-spawn leaves behind: a marker and no outcome.
    fs.writeFileSync(attemptsPath, JSON.stringify({
      authorContext,
      failures: 0,
      infra_streak: 0,
      in_flight: { nonce: 'stale-nonce-1', started_at: '2026-10-23T00:00:00.000Z' },
      attempts: [{ nonce: 'stale-nonce-1', state: 'running', at: '2026-10-23T00:00:00.000Z' }],
    }));

    const recovered = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.match(recovered.run.stderr, /recovered an interrupted attempt \(stale-nonce-1/);
    const state = JSON.parse(fs.readFileSync(attemptsPath, 'utf8'));
    const interrupted = state.attempts.filter((entry) => entry.nonce === 'stale-nonce-1');
    assert.equal(interrupted.length, 1, 'the interrupted attempt is accounted for exactly once');
    assert.equal(interrupted[0].state, 'interrupted');
    assert.equal(state.in_flight, null, 'the marker is cleared in the same write');
    assert.equal(state.failures, 1, 'the real review that followed is what was charged');

    // Re-running must not rediscover the same interruption.
    const again = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.doesNotMatch(again.run.stderr, /recovered an interrupted attempt/);
    assert.equal(
      JSON.parse(fs.readFileSync(attemptsPath, 'utf8')).attempts
        .filter((entry) => entry.state === 'interrupted').length,
      1,
      'no duplicate accounting after recovery',
    );
  });
});

test('review-receipt --interim reports findings and leaves no authorization spent (RIG-124.3)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const attemptsPath = `${out}.attempts.json`;
    const historyPath = `${out}.history.json`;
    const authorContext = 'release-attempt-interim';

    // A failing interim run is still a completed review: it is charged, its
    // findings are recorded, and it writes no receipt.
    const failing = runReviewReceipt(target, { verdict: 'fail', authorContext, out, extraArgs: ['--interim'] });
    assert.notEqual(failing.run.status, 0);
    assert.ok(!fs.existsSync(out));
    assert.equal(JSON.parse(fs.readFileSync(attemptsPath, 'utf8')).failures, 1);
    assert.deepEqual(JSON.parse(fs.readFileSync(historyPath, 'utf8'))[authorContext].items['correctness|x'].rounds, [1]);

    const passing = runReviewReceipt(target, { verdict: 'pass', authorContext, out, extraArgs: ['--interim'] });
    assert.equal(passing.run.status, 0, passing.run.stderr);
    assert.match(passing.run.stdout, /interim pass — no receipt written/);
    assert.match(passing.run.stdout, /verdict  pass — 0 finding\(s\), 0 blocker\(s\), 0 unresolved/);
    assert.ok(!fs.existsSync(out), 'an interim pass never writes the binding receipt');
    assert.ok(fs.existsSync(attemptsPath), 'an interim pass preserves the attempt history');
    assert.equal(JSON.parse(fs.readFileSync(attemptsPath, 'utf8')).failures, 1, 'an interim pass does not refund a failure');
    assert.deepEqual(
      JSON.parse(fs.readFileSync(historyPath, 'utf8'))[authorContext].items['correctness|x'].rounds,
      [1],
      'the interim pass does not erase what the interim fail found',
    );
  });
});

test('--ingest reconciles a supplied report without making it authoritative (RIG-124.3)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const attemptsPath = `${out}.attempts.json`;
    const historyPath = `${out}.history.json`;
    const authorContext = 'release-attempt-ingest';
    const supplied = path.join(target, 'supplied-review.md');

    // Cap the context out first: a hand-supplied report is exactly what arrives
    // after automatic reviewing has stopped, so --ingest must stay reachable.
    runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    const capped = runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    assert.match(capped.run.stderr, /re-review cap reached/);
    const historyBefore = fs.readFileSync(historyPath, 'utf8');
    const stateBefore = fs.readFileSync(attemptsPath, 'utf8');

    fs.writeFileSync(supplied, [
      'Here is what the reviewer said:',
      '```json',
      JSON.stringify({
        verdict: 'fail',
        verdicts: [{ id: 'AT-GATE-3', verdict: 'fail', note: 'n' }],
        findings: [
          { severity: 'blocker', category: 'correctness', anchor: 'x', detail: 'same class as round 1' },
          { severity: 'major', category: 'coverage', anchor: 'y', detail: 'never seen before' },
        ],
        unresolved: [],
      }),
      '```',
    ].join('\n'));

    const ingested = runReviewReceipt(target, { verdict: 'fail', authorContext, out, extraArgs: ['--ingest', supplied] });
    assert.equal(ingested.run.status, 0, ingested.run.stderr);
    assert.equal(ingested.invocationCount, 0, 'ingestion never spawns a reviewer');
    assert.match(ingested.run.stdout, /read-only, history and authorization unchanged/);
    assert.match(ingested.run.stdout, /already seen 1\n {4}correctness\|x/);
    assert.match(ingested.run.stdout, /new to me {4}1\n {4}coverage\|y/);
    assert.equal(fs.readFileSync(historyPath, 'utf8'), historyBefore, 'protected history is not overwritten');
    assert.equal(fs.readFileSync(attemptsPath, 'utf8'), stateBefore, 'no authorization is spent or refunded');
    assert.ok(!fs.existsSync(out), 'ingestion never produces a receipt');

    // A report that cannot be interpreted is reported as such, not accepted.
    fs.writeFileSync(supplied, JSON.stringify({ verdict: 'probably', findings: [{ severity: 'blocker' }] }));
    const bad = runReviewReceipt(target, { verdict: 'fail', authorContext, out, extraArgs: ['--ingest', supplied] });
    assert.notEqual(bad.run.status, 0);
    assert.match(bad.run.stderr, /not a valid completed review/);
    assert.match(bad.run.stderr, /verdict is "probably"/);
    assert.match(bad.run.stderr, /verdicts is not an array/);
    assert.match(bad.run.stderr, /1 finding\(s\) carried no evidence, anchor or detail/);
    assert.equal(fs.readFileSync(historyPath, 'utf8'), historyBefore);

    fs.writeFileSync(supplied, 'no json here at all');
    const unparseable = runReviewReceipt(target, { verdict: 'fail', authorContext, out, extraArgs: ['--ingest', supplied] });
    assert.notEqual(unparseable.run.status, 0);
    assert.match(unparseable.run.stderr, /no parseable reviewer json/);
  });
});

test('review-receipt finding-class history survives a passing verdict (RIG-124.2)', () => {
  withTarget((target) => {
    const out = path.join(target, 'receipt.json');
    const historyPath = `${out}.history.json`;
    const authorContext = 'release-attempt-history-pass';

    runReviewReceipt(target, { verdict: 'fail', authorContext, out });
    const passing = runReviewReceipt(target, { verdict: 'pass', authorContext, out });
    assert.equal(passing.run.status, 0, passing.run.stderr);
    assert.ok(fs.existsSync(`${out}.attempts.json`), 'a pass preserves the attempt history');
    assert.equal(JSON.parse(fs.readFileSync(`${out}.attempts.json`, 'utf8')).failures, 1, 'a pass does not refund a failure');
    assert.deepEqual(
      JSON.parse(fs.readFileSync(historyPath, 'utf8'))[authorContext].items['correctness|x'].rounds,
      [1],
      'a pass does not erase what earlier rounds found',
    );
  });
});
