#!/usr/bin/env node
// Repo-level guard: fake secret fixtures must be split at source so GitHub Push
// Protection is not the first place we learn about a literal secret-shaped value.
require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { FLOOR_PATTERN } = require('../rig/lib/guard');
const { scanFiles, maskSourcePlaceholders, SOURCE_PLACEHOLDERS } = require('../scripts/repo-secret-scan');

const repoRoot = path.join(__dirname, '..');
const floor = new RegExp(FLOOR_PATTERN);
const secret = (...parts) => parts.join('');
const PATCH_EXAMPLES = new Set([
  secret('-placeholder filter passes obvious docs examples (e.g. `', 'AKIAIOSFODNN7', 'EXAMPLE', '`):'),
  secret('-// keys like ', 'AKIAIOSFODNN7', 'EXAMPLE', ' are bare tokens, so the guard still catches them.'),
  secret('-  /example/i, // ', 'AKIAIOSFODNN7', 'EXAMPLE', ' etc — AWS docs convention'),
  secret('-    // The JSON-escaped form ("private_key": "-----BEGIN ', 'PRIVATE KEY-----', '\\n...)'),
]);

function knownPatchExample(rel, line) {
  return rel === 'rig/corpus/upstream/patches/shelf-overlay.patch' && PATCH_EXAMPLES.has(line);
}

function git(cwd, args) {
  return execFileSync('git', args, { cwd, stdio: 'pipe' });
}

function publishableFiles(root) {
  return git(root, ['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
    .toString('utf8')
    .split('\0')
    .filter(Boolean);
}

function secretShapedLines(root, files = publishableFiles(root)) {
  const hits = [];
  for (const rel of files) {
    let body;
    try {
      body = fs.readFileSync(path.join(root, rel));
    } catch {
      continue;
    }
    if (body.includes(0)) continue;
    body.toString('utf8').split(/\r?\n/).forEach((line, index) => {
      if (knownPatchExample(rel, line)) return;
      if (floor.test(maskSourcePlaceholders(rel, body, line))) hits.push(`${rel}:${index + 1}`);
    });
  }
  return hits;
}

function withTempRepo(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-secret-fixtures-'));
  try {
    git(target, ['init', '-q']);
    git(target, ['config', 'user.email', 'test@example.com']);
    git(target, ['config', 'user.name', 'Rig Test']);
    fn(target);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

test('literal Slack/GitHub/AWS/private-key-shaped fixtures fail the publishable-file scan', () => {
  withTempRepo((target) => {
    const literals = {
      'slack.txt': secret('xox', 'b-123456789012-123456789012-abcdefghijklmnopqrstuvwx'),
      'github.txt': secret('ghp', '_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
      'aws.txt': secret('AKIA', '0123456789ABCDEF'),
      'private-key.txt': secret('-----BEGIN ', 'PRIVATE KEY-----'),
    };
    for (const [rel, value] of Object.entries(literals)) {
      fs.writeFileSync(path.join(target, rel), `fixture=${value}\n`);
    }
    git(target, ['add', '.']);
    git(target, ['commit', '-m', 'add literal fixtures']);

    assert.deepEqual(secretShapedLines(target).map((hit) => hit.split(':')[0]).sort(), Object.keys(literals).sort());
  });
});

test('split-string runtime fixture construction passes the tracked-file scan', () => {
  withTempRepo((target) => {
    fs.writeFileSync(path.join(target, 'fixture.test.js'), [
      "const secret = (...parts) => parts.join('');",
      "const slack = secret('xox', 'b-123456789012-123456789012-abcdefghijklmnopqrstuvwx');",
      "const github = secret('ghp', '_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');",
      "const aws = secret('AKIA', '0123456789ABCDEF');",
      "const pem = secret('-----BEGIN ', 'PRIVATE KEY-----');",
      'console.log(slack, github, aws, pem);',
      '',
    ].join('\n'));
    git(target, ['add', '.']);
    git(target, ['commit', '-m', 'add split fixtures']);

    assert.deepEqual(secretShapedLines(target), []);
  });
});

test('untracked publishable fixtures are scanned before commit', () => {
  withTempRepo((target) => {
    fs.writeFileSync(path.join(target, 'new-fixture.txt'), `fixture=${secret('xox', 'b-123456789012-123456789012-abcdefghijklmnopqrstuvwx')}\n`);

    assert.deepEqual(secretShapedLines(target), ['new-fixture.txt:1']);
  });
});

test('publishable patch files are scanned for secret-shaped values', () => {
  withTempRepo((target) => {
    fs.writeFileSync(path.join(target, 'change.patch'), `+token=${secret('AKIA', '0123456789ABCDEF')}\n`);
    assert.deepEqual(secretShapedLines(target), ['change.patch:1']);
  });
});

test('exact pinned upstream template placeholders pass while neighboring credentials still fail', () => {
  for (const [path, [, placeholders]] of SOURCE_PLACEHOLDERS) {
    const content = fs.readFileSync(path);
    assert.deepEqual(scanFiles([{ path, content }]), [], path);
    const credential = secret('AKIA', '0123456789ABCDEF');
    assert.ok(scanFiles([{ path, content: Buffer.concat([content, Buffer.from(`\nadjacent=${credential}\n`)]) }]).length > 0, path);
    if (path.endsWith('/CLAUDE.md')) {
      const changed = Buffer.from(content.toString('utf8').replace(placeholders[0], `${placeholders[0]} ${secret('_auth', 'Token=')}still-detected`));
      assert.ok(scanFiles([{ path, content: changed }]).includes(`${path}:1081: npmrc-auth-token`));
    }
  }
});

test('installed baseline masks only hash-pinned source placeholders and rejects a neighboring credential', () => {
  const { repositorySecretFindings } = require('../rig/lib/policy-baseline');
  for (const [path, [, placeholders]] of SOURCE_PLACEHOLDERS) {
    const bytes = fs.readFileSync(path);
    const installedPath = `.rig/kit/${path}`;
    assert.deepEqual(repositorySecretFindings([{ path: installedPath, bytes }]), [], installedPath);
    const changed = Buffer.from(bytes.toString('utf8').replace(placeholders[0], `${placeholders[0]} ${secret('AKIA', '0123456789ABCDEF')}`));
    assert.deepEqual(repositorySecretFindings([{ path: installedPath, bytes: changed }]), [{ path: installedPath, kind: 'repository_secret' }], installedPath);
  }
});

test('repository files do not contain literal secret-shaped fixtures', () => {
  assert.deepEqual(secretShapedLines(repoRoot), []);
});
