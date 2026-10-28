#!/usr/bin/env node
// Repo-level guard: nothing that must stay private may become publishable.
//
// This repository is PUBLIC, so "tracked or untracked-but-not-ignored" is the
// same set as "world-readable once pushed". That set is what this file checks.
//
// Deliberately self-contained: it does NOT import rig/lib/guard's FLOOR_PATTERN.
// That constant is the *product's* detector and belongs to the product's own
// requirements; if it were ever narrowed, a guard borrowing it would weaken
// silently and nothing would say so. The patterns below are the repository's
// own floor and are allowed to be stricter.
//
// Every pattern is proved to fire by a positive control below. A guard whose
// matchers have quietly stopped matching passes vacuously, which is the exact
// failure mode this project has been bitten by before.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { scanFiles, scanStagedSnapshot, CONTENT_RULES, PATH_RULES } = require('../scripts/repo-secret-scan');

const repoRoot = path.join(__dirname, '..');

// Split at source so this file never contains a literal secret-shaped value.
const s = (...parts) => parts.join('');
// Paths whose ignore rules are load-bearing. If someone deletes these lines
// from .gitignore the files stop being ignored and start being pushable, which
// no content scan would notice until the value was already public.
const MUST_STAY_IGNORED = ['.env', '.env.local', '.env.production', '.env.test'];

function git(cwd, args) {
  return execFileSync('git', args, { cwd, stdio: 'pipe' }).toString('utf8');
}

/** Tracked plus untracked-and-not-ignored: everything a push would publish. */
function publishableFiles(root) {
  return git(root, ['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
    .split('\0')
    .filter(Boolean);
}

function findings(root, files = publishableFiles(root)) {
  return scanFiles(files.flatMap((rel) => {
    try { return [{ path: rel, content: fs.readFileSync(path.join(root, rel)) }]; }
    catch { return []; } // deleted between listing and read
  }));
}

function withTempRepo(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-secret-hygiene-'));
  try {
    git(target, ['init', '-q']);
    git(target, ['config', 'user.email', 'test@example.invalid']);
    git(target, ['config', 'user.name', 'Rig Test']);
    fn(target);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Positive controls: every rule must be shown to fire on something.
// ---------------------------------------------------------------------------

const CONTENT_SAMPLES = {
  'pem-private-key': s('-----BEGIN ', 'OPENSSH ', 'PRIVATE KEY-----'),
  'putty-private-key': s('PuTTY-User-Key', '-File-3: ssh-ed25519'),
  'aws-access-key-id': s('AKIA', 'ABCDEFGHIJKLMNOP'),
  'aws-secret-access-key': s('aws_secret_access_key = ', 'a'.repeat(40)),
  'github-token': s('ghp', '_', 'b'.repeat(36)),
  'slack-token': s('xoxb', '-123456789012-123456789012-abcdefghijklmnopqrstuvwx'),
  'stripe-live-key': s('sk', '_live_', 'c'.repeat(24)),
  'google-api-key': s('AIza', 'd'.repeat(35)),
  'openai-style-key': s('sk', '-', 'e'.repeat(48)),
  'openai-project-key': s('sk', '-proj-', 'f'.repeat(40)),
  'npmrc-auth-token': s('_authToken', '=npm_', 'g'.repeat(36)),
};

const PATH_SAMPLES = {
  'ssh-private-key': 'deploy/id_ed25519',
  'key-container': 'certs/server.pem',
  'dotenv': '.env.production',
  'netrc': '.netrc',
  'aws-credentials-file': '.aws/credentials',
  'service-account-json': 'gcp/service-account-prod.json',
  'legacy-gate1-signer-artifact': 'project-dev-docs/current/gate1.sig',
};

test('every content rule actually fires on a matching value', () => {
  for (const [rule] of CONTENT_RULES) {
    const sample = CONTENT_SAMPLES[rule];
    assert.ok(sample, `no positive control defined for content rule ${rule}`);
    withTempRepo((target) => {
      fs.writeFileSync(path.join(target, 'bait.txt'), `value = ${sample}\n`);
      const hits = findings(target);
      assert.ok(
        hits.some((h) => h.endsWith(`: ${rule}`)),
        `content rule ${rule} did not fire on its own sample; hits=${JSON.stringify(hits)}`,
      );
    });
  }
});

test('every path rule actually fires on a matching filename', () => {
  for (const [rule] of PATH_RULES) {
    const rel = PATH_SAMPLES[rule];
    assert.ok(rel, `no positive control defined for path rule ${rule}`);
    withTempRepo((target) => {
      fs.mkdirSync(path.join(target, path.dirname(rel)), { recursive: true });
      fs.writeFileSync(path.join(target, rel), 'x\n');
      const hits = findings(target);
      assert.ok(
        hits.some((h) => h === `${rel}: ${rule}`),
        `path rule ${rule} did not fire on ${rel}; hits=${JSON.stringify(hits)}`,
      );
    });
  }
});

test('an ignored secret file is not reported, because it cannot be pushed', () => {
  withTempRepo((target) => {
    fs.writeFileSync(path.join(target, '.gitignore'), '.env\n');
    fs.writeFileSync(path.join(target, '.env'), 'API_KEY=real-value\n');
    assert.deepEqual(findings(target), []);
  });
});

test('a force-added secret file IS reported, because ignoring it no longer helps', () => {
  withTempRepo((target) => {
    fs.writeFileSync(path.join(target, '.gitignore'), '.env\n');
    fs.writeFileSync(path.join(target, '.env'), 'API_KEY=real-value\n');
    git(target, ['add', '-f', '.env']);
    assert.deepEqual(findings(target), ['.env: dotenv']);
  });
});

test('a deleted tracked file is not reported from the stale index entry', () => {
  withTempRepo((target) => {
    fs.mkdirSync(path.join(target, 'project-dev-docs/current'), { recursive: true });
    fs.writeFileSync(path.join(target, 'project-dev-docs/current/gate1.sig'), 'x\n');
    git(target, ['add', 'project-dev-docs/current/gate1.sig']);
    fs.rmSync(path.join(target, 'project-dev-docs/current/gate1.sig'));
    assert.deepEqual(findings(target), []);
  });
});

test('.env.example is allowed; it is the documented template', () => {
  withTempRepo((target) => {
    fs.writeFileSync(path.join(target, '.env.example'), 'ANTHROPIC_API_KEY=\n');
    assert.deepEqual(findings(target), []);
  });
});

// ---------------------------------------------------------------------------
// The actual guard.
// ---------------------------------------------------------------------------

test('no credential or private-key material is tracked or publishable', () => {
  assert.deepEqual(findings(repoRoot), []);
});

test('the ignore rules protecting secrets are still in force', () => {
  for (const rel of MUST_STAY_IGNORED) {
    let ignored = true;
    try {
      execFileSync('git', ['check-ignore', '-q', '--', rel], {
        cwd: repoRoot,
        stdio: 'pipe',
      });
    } catch {
      ignored = false;
    }
    assert.ok(ignored, `${rel} is no longer gitignored; a real value there would be pushable`);
  }
});

test('the Gate 1 signer artifacts carry public material only', () => {
  const dir = path.join(repoRoot, 'wiki', 'gate1');
  for (const name of ['gate1.sig', 'gate1.allowed-signers']) {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) continue; // unarmed repositories are legitimate
    const body = fs.readFileSync(file, 'utf8');
    assert.ok(
      !/-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/.test(body),
      `${name} contains private key material and must never be committed`,
    );
  }
});

test('publishable patch files are scanned for secret-shaped additions', () => {
  withTempRepo((target) => {
    fs.writeFileSync(path.join(target, 'change.patch'), `+token=${s('AKIA', '0123456789ABCDEF')}\n`);
    assert.ok(findings(target).some((hit) => hit.endsWith(': aws-access-key-id')));
  });
});

test('wiki preflight scans staged bytes, including ignored files, without revealing values', () => {
  withTempRepo((target) => {
    fs.writeFileSync(path.join(target, '.gitignore'), 'wiki/\n');
    fs.mkdirSync(path.join(target, 'wiki'));
    const value = s('ghp_', '123456789012345678901234567890123456');
    fs.writeFileSync(path.join(target, 'wiki', 'private.md'), `credential ${value}\n`);
    git(target, ['add', '-f', 'wiki/private.md']);
    fs.writeFileSync(path.join(target, 'wiki', 'private.md'), 'clean worktree bytes\n');
    const findings = scanStagedSnapshot(target);
    assert.deepEqual(findings, ['wiki/private.md:1: github-token']);
    assert.doesNotMatch(JSON.stringify(findings), new RegExp(value));
  });
});

test('wiki preflight detects credential text inside NUL-containing bytes', () => {
  const value = s('ghp_', '123456789012345678901234567890123456');
  assert.deepEqual(scanFiles([{ path: 'binary.dat', content: Buffer.concat([
    Buffer.from('prefix\0'), Buffer.from(value), Buffer.from('\0suffix'),
  ]) }]), ['binary.dat:1: github-token']);
});

function publisherFixture(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-publish-test-'));
  try {
    const root = path.join(target, 'repo');
    const wiki = path.join(root, 'wiki');
    const scripts = path.join(root, 'scripts');
    const bare = path.join(target, 'origin.wiki.git');
    const seed = path.join(target, 'seed');
    fs.mkdirSync(wiki, { recursive: true });
    fs.mkdirSync(scripts, { recursive: true });
    fs.writeFileSync(path.join(wiki, 'agent-primer.md'), '# Primer\n');
    fs.copyFileSync(path.join(__dirname, '../scripts/publish-wiki.js'), path.join(scripts, 'publish-wiki.js'));
    fs.copyFileSync(path.join(__dirname, '../scripts/repo-secret-scan.js'), path.join(scripts, 'repo-secret-scan.js'));
    git(target, ['init', '--bare', '-q', bare]);
    fs.mkdirSync(seed);
    git(seed, ['init', '-q', '-b', 'main']);
    git(seed, ['config', 'core.hooksPath', '/dev/null']);
    git(seed, ['config', 'user.email', 'test@example.invalid']);
    git(seed, ['config', 'user.name', 'Rig Test']);
    fs.writeFileSync(path.join(seed, 'agent-primer.md'), '# Existing wiki\n');
    git(seed, ['add', 'agent-primer.md']);
    git(seed, ['commit', '-qm', 'initial wiki']);
    git(seed, ['remote', 'add', 'origin', bare]);
    git(seed, ['push', '-q', 'origin', 'HEAD:main']);
    git(target, ['--git-dir', bare, 'symbolic-ref', 'HEAD', 'refs/heads/main']);
    git(root, ['init', '-q']);
    git(root, ['remote', 'add', 'origin', path.join(target, 'origin.git')]);
    fn({ target, root, wiki, bare, publisher: path.join(scripts, 'publish-wiki.js') });
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

test('wiki publisher blocks a secret before commit and push, with redacted output', () => publisherFixture(({ root, wiki, bare, publisher }) => {
  const value = s('ghp_', '123456789012345678901234567890123456');
  fs.writeFileSync(path.join(wiki, 'page.md'), `credential ${value}\n`);
  const before = git(root, ['--git-dir', bare, 'rev-parse', 'refs/heads/main']).trim();
  const run = spawnSync(process.execPath, [publisher], { cwd: root, encoding: 'utf8' });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /mandatory secret preflight/);
  assert.doesNotMatch(run.stderr + run.stdout, new RegExp(value));
  assert.equal(git(root, ['--git-dir', bare, 'rev-parse', 'refs/heads/main']).trim(), before);
}));

test('wiki publisher fails closed if it cannot read the staged snapshot', () => publisherFixture(({ target, root, publisher }) => {
  const bin = path.join(target, 'bin');
  fs.mkdirSync(bin);
  const realGit = execFileSync('which', ['git'], { encoding: 'utf8' }).trim();
  fs.writeFileSync(path.join(bin, 'git'), `#!/bin/sh\nfor arg do [ "$arg" = show ] && exit 42; done\nexec "${realGit}" "$@"\n`, { mode: 0o755 });
  const run = spawnSync(process.execPath, [publisher], {
    cwd: root, encoding: 'utf8', env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` },
  });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /Wiki secret preflight failed/);
  assert.equal(git(root, ['--git-dir', path.join(target, 'origin.wiki.git'), 'rev-list', '--count', 'refs/heads/main']).trim(), '1');
}));
