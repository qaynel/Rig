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
const { execFileSync } = require('node:child_process');

const repoRoot = path.join(__dirname, '..');

// Split at source so this file never contains a literal secret-shaped value.
const s = (...parts) => parts.join('');

const CONTENT_RULES = [
  ['pem-private-key', /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/],
  ['putty-private-key', /PuTTY-User-Key-File-\d/],
  ['aws-access-key-id', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['aws-secret-access-key', /aws_secret_access_key\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}/i],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ['slack-token', /\bxox[baprse]-[A-Za-z0-9-]{10,}/],
  ['stripe-live-key', /\b[sr]k_live_[A-Za-z0-9]{16,}\b/],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  // `sk-` followed by unbroken alphanumerics. Requiring no interior hyphen is
  // what keeps SSH FIDO key-type names — the `sk-` prefixed ECDSA and Ed25519
  // type strings, which contain hyphens — from reading as credentials. That
  // false positive has already turned this suite red once, from prose in a
  // roadmap that merely named the key type. Note the literal is deliberately
  // not written out here either: the product's own floor pattern is broader
  // than this one and would flag this file for quoting it.
  ['openai-style-key', /\bsk-[A-Za-z0-9]{20,}\b/],
  ['openai-project-key', /\bsk-proj-[A-Za-z0-9_-]{20,}\b/],
  ['npmrc-auth-token', /_authToken\s*=\s*\S+/],
];

const PATH_RULES = [
  ['ssh-private-key', /(^|\/)id_(rsa|dsa|ecdsa|ed25519)(_sk)?$/],
  ['key-container', /\.(pem|p12|pfx|jks|keystore|ppk)$/i],
  ['dotenv', /(^|\/)\.env(\.|$)(?!example|sample)/],
  ['netrc', /(^|\/)\.netrc$/],
  ['aws-credentials-file', /(^|\/)credentials$/],
  ['service-account-json', /service[-_]account[^/]*\.json$/i],
  [
    'legacy-gate1-signer-artifact',
    /^project-dev-docs\/current\/gate1\.(sig|allowed-signers)$/,
  ],
];

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
  const hits = [];
  for (const rel of files) {
    let body;
    try {
      body = fs.readFileSync(path.join(root, rel));
    } catch {
      continue; // deleted between listing and read
    }
    for (const [rule, re] of PATH_RULES) {
      if (re.test(rel)) hits.push(`${rel}: ${rule}`);
    }
    if (body.includes(0)) continue; // binary
    body.toString('utf8').split(/\r?\n/).forEach((line, i) => {
      for (const [rule, re] of CONTENT_RULES) {
        if (re.test(line)) hits.push(`${rel}:${i + 1}: ${rule}`);
      }
    });
  }
  return hits.sort();
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
