#!/usr/bin/env node
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { PAYLOAD_HOSTS, runPayload } = require('../rig/lib/payload');

const root = path.join(__dirname, '..');
const pointer = 'Before acting, read `.rig/routing.md` and route this task through its skill table.';

const sharedSkills = [
  ['grilling', 'rig/tier-1/skills/grilling/SKILL.md'],
  ['product-design', 'rig/tier-1/skills/product-design/SKILL.md'],
  ['implementation', 'skills/rig/SKILL.md'],
  ['execution', 'rig/tier-1/skills/execution/SKILL.md'],
  ['tdd', 'rig/tier-1/skills/tdd/SKILL.md'],
  ['debugging', 'rig/tier-1/skills/debugging/SKILL.md'],
  ['code-review', 'rig/tier-1/skills/code-review/SKILL.md'],
];

function read(target, relativePath) {
  return fs.readFileSync(path.join(target, relativePath), 'utf8');
}

function tree(target) {
  const files = {};
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else files[path.relative(target, file)] = fs.readFileSync(file, 'utf8');
    }
  };
  walk(target);
  return files;
}

function normalizedTree(target) {
  const files = tree(target);
  const manifest = files['.rig/install-manifest.jsonl'];
  if (manifest) {
    files['.rig/install-manifest.jsonl'] = manifest.trim().split('\n').map((line) => {
      const record = JSON.parse(line);
      delete record.install_id;
      return JSON.stringify(record);
    }).join('\n');
  }
  return files;
}

function backtickedRigPaths(text) {
  return [...text.matchAll(/`(\.rig\/[^`]+)`/g)]
    .map((match) => match[1])
    .filter((relativePath) => !/[<>{}*]/.test(relativePath));
}

function nativeSkillNames(host) {
  return sharedSkills.map(([skill]) => {
    const skillFile = `${host}/skills/rig-${skill}/SKILL.md`;
    const match = read(root, skillFile).match(/^name:\s*(\S+)\s*$/m);
    assert.ok(match, `${skillFile} should declare a name`);
    return match[1];
  }).sort();
}

test('committed Claude and Codex skills match their canonical Tier 1 sources', () => {
  for (const [skill, sourcePath] of sharedSkills) {
    const source = read(root, sourcePath);
    assert.equal(read(root, `.claude/skills/rig-${skill}/SKILL.md`), source, `Claude ${skill}`);
    assert.equal(read(root, `.agents/skills/rig-${skill}/SKILL.md`), source, `Codex ${skill}`);
  }
});

test('native skill names match the router index', () => {
  const routerNames = [...read(root, 'rig/tier-1/routing.md').matchAll(/^\| `([^`]+)` \|/gm)]
    .map((match) => match[1])
    .sort();

  assert.deepEqual(nativeSkillNames('.claude'), routerNames, 'Claude skill names');
  assert.deepEqual(nativeSkillNames('.agents'), routerNames, 'Codex skill names');
});

test('Tier 1 bootstrap configures every explicitly selected instruction host', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-tier-1-'));

  try {
    fs.mkdirSync(path.join(target, '.cursor', 'rules'), { recursive: true });
    fs.mkdirSync(path.join(target, '.github'), { recursive: true });
    fs.writeFileSync(path.join(target, 'CLAUDE.md'), '# Existing Claude guidance\n');
    fs.writeFileSync(path.join(target, 'AGENTS.md'), '# Existing agent guidance\n');
    fs.writeFileSync(path.join(target, 'GEMINI.md'), '# Existing Gemini guidance\n');
    fs.writeFileSync(path.join(target, '.github', 'copilot-instructions.md'), '# Existing Copilot guidance\n');
    fs.writeFileSync(path.join(target, '.cursor', 'rules', 'existing.mdc'), 'existing\n');

    execFileSync('sh', [
      path.join(root, 'rig', 'bootstrap.sh'),
      '--tier', '1',
      '--target', target,
      '--hosts', PAYLOAD_HOSTS.join(','),
    ]);

    assert.match(read(target, '.rig/routing.md'), /# Rig Router/);
    assert.match(read(target, '.rig/rules/rig.md'), /always active/i);
    for (const [skill] of sharedSkills) {
      const shared = read(target, `.rig/skills/${skill}/SKILL.md`);
      const claude = read(target, `.claude/skills/rig-${skill}/SKILL.md`);
      const codex = read(target, `.agents/skills/rig-${skill}/SKILL.md`);
      assert.equal(claude, shared, `Claude ${skill}`);
      assert.equal(codex, shared, `Codex ${skill}`);
    }

    for (const name of ['rig', 'rig-review', 'rig-audit', 'rig-debt', 'rig-gain', 'rig-help']) {
      assert.equal(
        read(target, `.agents/workflows/${name}.md`),
        read(root, `.agents/workflows/${name}.md`),
        `Antigravity workflow ${name}`,
      );
    }

    assert.match(read(target, 'CLAUDE.md'), /^# Existing Claude guidance$/m);
    const entrypoints = [
      'CLAUDE.md',
      'AGENTS.md',
      'GEMINI.md',
      '.github/copilot-instructions.md',
    ];
    for (const entrypoint of entrypoints) {
      assert.equal(
        read(target, entrypoint).split(pointer).length - 1,
        1,
        `${entrypoint} should contain the pointer exactly once`,
      );
    }

    // Re-install must not duplicate pointer lines (ensure_line idempotency).
    execFileSync('sh', [
      path.join(root, 'rig', 'bootstrap.sh'),
      '--tier', '1',
      '--target', target,
      '--hosts', PAYLOAD_HOSTS.join(','),
    ]);
    for (const entrypoint of entrypoints) {
      assert.equal(
        read(target, entrypoint).split(pointer).length - 1,
        1,
        `${entrypoint} should still contain the pointer exactly once after re-install`,
      );
    }

    assert.match(read(target, 'AGENTS.md'), /^# Existing agent guidance$/m);
    assert.match(read(target, 'GEMINI.md'), /^# Existing Gemini guidance$/m);
    assert.match(read(target, '.github/copilot-instructions.md'), /^# Existing Copilot guidance$/m);
    assert.equal(read(target, '.cursor/rules/existing.mdc'), 'existing\n');
    assert.match(read(target, '.cursor/rules/rig.mdc'), /alwaysApply: true/);
    assert.match(read(target, '.cursor/rules/rig.mdc'), /\.rig\/routing\.md/);
    assert.match(read(target, '.windsurf/rules/rig.md'), /trigger: always_on/);
    assert.doesNotMatch(read(target, '.clinerules/rig.md'), /^---\n/);
    for (const adapter of [
      '.windsurf/rules/rig.md',
      '.clinerules/rig.md',
      '.agents/rules/rig.md',
      '.kiro/steering/rig.md',
    ]) {
      assert.match(read(target, adapter), /\.rig\/routing\.md/);
    }
    assert.match(read(target, '.kiro/steering/rig.md'), /inclusion: always/);

    const installed = [];
    for (const top of ['.rig', '.claude', '.cursor', '.windsurf', '.clinerules', '.agents', '.kiro', '.github']) {
      const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const file = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(file);
          else installed.push(file);
        }
      };
      walk(path.join(target, top));
    }

    // A default install (no --with-runtime) is markdown-only end to end: the
    // vendored skill catalogue lands as instructions, and the plumbing/runtime
    // trees don't land at all. Only install bookkeeping and the vendored MIT
    // notice file are exempt.
    const noticeBasenames = new Set(['LICENSE.upstream', 'UPSTREAM.md', 'README.md']);
    const tier1RigFiles = installed
      .filter((file) => file.includes(`${path.sep}.rig${path.sep}`))
      .filter((file) => !file.endsWith(`${path.sep}.rig${path.sep}install-manifest.jsonl`))
      .filter((file) => !file.includes(`${path.sep}.rig${path.sep}preimages${path.sep}`))
      .filter((file) => !noticeBasenames.has(path.basename(file)));
    assert.ok(tier1RigFiles.every((file) => file.endsWith('.md')));
    assert.equal(fs.existsSync(path.join(target, '.rig', 'plumbing')), false, 'plumbing must not land on a default install');
    // Backticked `.rig/...` path references in Tier-1 files must resolve
    // against the installed tree; vendored skills reference run-time paths
    // that get created by their own scripts, so their bodies stay out of
    // this reachability check.
    const isVendoredFile = (file) => file.includes(`${path.sep}.rig${path.sep}plumbing${path.sep}`)
      || file.includes(`${path.sep}.rig${path.sep}runtime${path.sep}`)
      || file.includes(`${path.sep}.rig${path.sep}preimages${path.sep}`)
      || file.endsWith(`${path.sep}.rig${path.sep}install-manifest.jsonl`)
      || /[/\\]\.rig[/\\]skills[/\\][^/\\]+[/\\]/.test(file)
      || /[/\\]\.claude[/\\]skills[/\\]rig-[^/\\]+[/\\]/.test(file)
      || /[/\\]\.agents[/\\]skills[/\\]rig-[^/\\]+[/\\]/.test(file);
    const tier1Body = installed.filter((f) => !isVendoredFile(f)).map((file) => fs.readFileSync(file, 'utf8')).join('\n');
    for (const relativePath of backtickedRigPaths(tier1Body)) {
      assert.equal(fs.existsSync(path.join(target, relativePath)), true, `${relativePath} should exist after install`);
    }
    // Secret-shape scan runs against Tier-1 bodies. The vendored suite ships
    // README-style examples that neutralize credential shapes without
    // reproducing them; those live under the vendored subtree above and are
    // excluded from this check by the same isVendoredFile boundary.
    assert.doesNotMatch(tier1Body, /(?:API_KEY|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|(?<![a-z0-9])sk-[a-z0-9-]{10,})/i);
    assert.equal(fs.existsSync(path.join(target, '.env')), false);
    assert.equal(fs.existsSync(path.join(target, '.env.example')), false);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test('Tier 1 --with-runtime restores plumbing and per-skill code', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-tier-1-runtime-'));

  try {
    execFileSync('sh', [
      path.join(root, 'rig', 'bootstrap.sh'),
      '--tier', '1',
      '--target', target,
      '--hosts', 'claude',
      '--with-runtime',
    ]);

    assert.ok(fs.existsSync(path.join(target, '.rig', 'plumbing', 'bin')));
    assert.ok(fs.existsSync(path.join(target, '.claude', 'skills', 'rig-browse', 'src')));
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test('Tier 1 --with-runtime installs and surfaces a working catalogue entrypoint', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-tier-1-entrypoint-'));
  const rig = path.join(target, '.rig', 'bin', 'rig');
  const service = 'development.code-quality.lint-format';

  try {
    execFileSync('git', ['init'], { cwd: target, stdio: 'pipe' });
    fs.writeFileSync(path.join(target, 'package.json'), `${JSON.stringify({
      name: 'rig-entrypoint-fixture',
      version: '1.0.0',
      private: true,
      scripts: { 'format:check': 'git diff --check' },
    }, null, 2)}\n`);
    fs.writeFileSync(path.join(target, 'index.js'), 'const answer = 42;\n');

    const output = execFileSync('sh', [
      path.join(root, 'rig', 'bootstrap.sh'),
      '--tier', '1',
      '--target', target,
      '--hosts', 'codex',
      '--with-runtime',
    ], { encoding: 'utf8' });
    assert.ok(output.includes(`cd "${target}"`), 'onboarding must enter a non-current target before using the relative command');
    assert.match(output, /\.rig\/bin\/rig inspect[\s\S]*recommend[\s\S]*plan[\s\S]*apply[\s\S]*check/);
    assert.ok(fs.statSync(rig).mode & 0o111, 'installed entrypoint must be executable');

    const reviewPath = path.join(target, 'review.json');
    const selectionPath = path.join(target, 'rig.json');
    const planPath = path.join(target, 'plan.json');
    const approvalPath = path.join(target, 'approval.json');
    fs.writeFileSync(reviewPath, `${JSON.stringify({
      schema_version: 1,
      harness_digest: 'shipping-entrypoint-fixture',
      host: 'codex',
      verdict: 'ALLOW',
      findings: [],
      restrictions: [],
      unverifiable: [],
      reviewer: { kind: 'host-agent', host: 'codex' },
    }, null, 2)}\n`);
    fs.writeFileSync(selectionPath, `${JSON.stringify({
      schema_version: 1,
      services: { [service]: 'minimal' },
    }, null, 2)}\n`);

    execFileSync(rig, [
      'plan', '--target', target, '--manifest', selectionPath,
      '--review', reviewPath, '--out', planPath,
    ], { stdio: 'pipe' });
    const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
    fs.writeFileSync(approvalPath, `${JSON.stringify({
      schema_version: 1,
      kind: 'plan-approval',
      plan_digest: plan.plan_digest,
      approval: { method: 'external-sshsig', verified: true },
    }, null, 2)}\n`);
    execFileSync(rig, [
      'apply', '--target', target, '--manifest', selectionPath,
      '--review', reviewPath, '--plan', planPath, '--approval', approvalPath,
    ], { stdio: 'pipe' });
    execFileSync(rig, ['check', '--target', target, '--service', service], { stdio: 'pipe' });

    const bindings = JSON.parse(read(target, '.rig/service-bindings.json'));
    assert.equal(bindings[service].engine, 'component-lint-format-v1');
    assert.ok(fs.existsSync(path.join(target, '.rig', 'bin', 'check.js')));
    const journal = read(target, '.rig/install-manifest.jsonl');
    assert.match(journal, /"path":"\.rig\/bin\/rig"/);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test('Tier 1 default bootstrap stays in sync with the canonical payload manifest', () => {
  const viaShell = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-tier-1-shell-'));
  const viaPayload = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-tier-1-payload-'));

  try {
    execFileSync('sh', [path.join(root, 'rig', 'bootstrap.sh'), '--tier', '1', '--target', viaShell]);
    runPayload(viaPayload);

    assert.deepEqual(normalizedTree(viaShell), normalizedTree(viaPayload));
  } finally {
    fs.rmSync(viaShell, { recursive: true, force: true });
    fs.rmSync(viaPayload, { recursive: true, force: true });
  }
});

test('Tier 1 bootstrap --hosts antigravity installs the co-read tree via payload.js', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-tier-1-ag-'));

  try {
    execFileSync('sh', [
      path.join(root, 'rig', 'bootstrap.sh'),
      '--tier', '1',
      '--target', target,
      '--hosts', 'antigravity',
    ]);

    assert.ok(fs.existsSync(path.join(target, '.agents/skills/rig-implementation/SKILL.md')));
    assert.ok(fs.existsSync(path.join(target, '.agents/rules/rig.md')));
    assert.ok(fs.existsSync(path.join(target, '.agents/workflows/rig.md')));
    assert.ok(fs.existsSync(path.join(target, 'AGENTS.md')));
    assert.ok(fs.existsSync(path.join(target, 'GEMINI.md')));
    assert.ok(fs.existsSync(path.join(target, '.rig/skills/grilling/SKILL.md')));
    assert.equal(fs.existsSync(path.join(target, '.claude/skills/rig-implementation/SKILL.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.cursor/rules/rig.mdc')), false);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test('Tier 1 --hosts exits with a clear node message instead of stranding the user', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-tier-1-nonode-'));
  // Sandbox PATH holds only what the script needs before the node check (dirname);
  // node is deliberately absent so the preflight guard fires.
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-nonode-bin-'));
  const dirnameBin = execFileSync('sh', ['-c', 'command -v dirname']).toString().trim();
  fs.symlinkSync(dirnameBin, path.join(bin, 'dirname'));

  try {
    assert.throws(
      () => execFileSync('/bin/sh', [
        path.join(root, 'rig', 'bootstrap.sh'),
        '--tier', '1',
        '--target', target,
        '--hosts', 'claude',
      ], { env: { PATH: bin }, stdio: 'pipe' }),
      (err) => {
        assert.equal(err.status, 1);
        assert.match(String(err.stderr), /node/);
        return true;
      },
    );
    assert.equal(fs.existsSync(path.join(target, '.rig')), false, 'no partial install left behind');
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
    fs.rmSync(bin, { recursive: true, force: true });
  }
});
