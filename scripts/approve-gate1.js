#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { check, oracleMessage, parseManifest, sha256 } = require('./check-advanced-spec');

const ENV_NAME = 'RIG_GATE1_SIGNING_KEY';
const PRINCIPAL = 'gate1-owner';
const NAMESPACE = 'rig-gate1';
const MANIFEST = path.join('wiki', 'gate1', 'testing-infrastructure.manifest');

function expandPath(value) {
  return value
    .replace(/^~(?=\/|$)/, os.homedir())
    .replace(/^\$HOME(?=\/|$)/, os.homedir());
}

function unquote(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function readSigningKeyFromFile(file) {
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^(?:export\s+)?RIG_GATE1_SIGNING_KEY=(.*)$/);
    if (match) return unquote(match[1]);
  }
  return undefined;
}

function loadLocalEnv(root, env = process.env) {
  if (env[ENV_NAME]) return env[ENV_NAME];
  // .context/ is in .git/info/exclude (not .gitignore) so gate1.env survives branch switches.
  const candidates = [
    path.join(root, '.context', 'gate1.env'),
    path.join(root, '.credentials', 'gate1.env'),
  ];
  for (const local of candidates) {
    if (!fs.existsSync(local)) continue;
    const key = readSigningKeyFromFile(local);
    if (key) return key;
  }
  return undefined;
}

function run(command, args, options) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function validatePublicKey(publicKey) {
  run('ssh-keygen', ['-lf', '-'], { input: `${publicKey.trim()}\n` });
}

function publicKeyForSigningKey(signingKey) {
  if (signingKey.endsWith('.pub')) {
    const publicKey = fs.readFileSync(signingKey, 'utf8').trim();
    validatePublicKey(publicKey);
    return publicKey;
  }
  const publicKey = run('ssh-keygen', ['-y', '-f', signingKey]).trim();
  validatePublicKey(publicKey);
  return publicKey;
}

function defaultSecretiveAgent(env = process.env) {
  const socket = path.join(os.homedir(), 'Library/Containers/com.maxgoedjen.Secretive.SecretAgent/Data/socket.ssh');
  // macOS always exports a launchd SSH_AUTH_SOCK that has no Secretive keys.
  // Prefer Secretive when its agent socket exists so `*.pub` signing works.
  if (fs.existsSync(socket)) env.SSH_AUTH_SOCK = socket;
}

function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

function manifestDelta(before, after) {
  if (before === after) return '  testing-infrastructure.manifest unchanged';
  const oldLines = before.trimEnd().split('\n').filter(Boolean).map((line) => `- ${line}`);
  const newLines = after.trimEnd().split('\n').filter(Boolean).map((line) => `+ ${line}`);
  return [...oldLines, ...newLines].join('\n');
}

function proposedOracleMessage(root, manifest) {
  const gateDir = path.join(root, 'wiki', 'gate1');
  const business = sha256(fs.readFileSync(path.join(gateDir, 'business-spec.md')));
  const acceptance = sha256(fs.readFileSync(path.join(gateDir, 'acceptance.md')));
  return `rig-oracle-freeze-v2\nbusiness-spec.md ${business}\nacceptance.md ${acceptance}\ntesting-infrastructure.manifest ${sha256(Buffer.from(manifest))}\n`;
}

function refreshManifest(root, confirmation) {
  const manifestPath = path.join(root, MANIFEST);
  const before = fs.readFileSync(manifestPath, 'utf8');
  const entries = parseManifest(fs.readFileSync(manifestPath, 'utf8'));
  const lines = entries.map(({ file }) => {
    const absolute = path.join(root, file);
    assert.ok(fs.existsSync(absolute), `missing oracle file: ${file}`);
    return `${sha256(fs.readFileSync(absolute))}  ${file}`;
  });
  const after = lines.length ? `${lines.join('\n')}\n` : '';
  const rearming = fs.existsSync(path.join(root, 'wiki', 'gate1', 'gate1.sig'));
  if (before !== after || rearming) {
    const expected = digest(proposedOracleMessage(root, after));
    assert.equal(
      confirmation,
      expected,
      `oracle digest confirmation required\n${manifestDelta(before, after)}\nrerun with --confirm-digest-delta ${expected}`,
    );
  }
  if (before !== after) fs.writeFileSync(manifestPath, after);
  return entries.length;
}

function approveGate1(root = process.cwd(), options = {}) {
  const env = { ...process.env, ...(options.env || {}) };
  defaultSecretiveAgent(env);
  const configured = loadLocalEnv(root, env);
  assert.ok(configured, `set ${ENV_NAME} or copy .credentials/gate1.env.example to .context/gate1.env`);

  const signingKey = path.resolve(root, expandPath(configured));
  assert.ok(fs.existsSync(signingKey), `${ENV_NAME} does not exist: ${signingKey}`);

  const publicKey = publicKeyForSigningKey(signingKey);
  const context = path.join(root, '.context');
  fs.mkdirSync(context, { recursive: true });

  if (options.refresh !== false) refreshManifest(root, options.confirmDigestDelta);

  const messageFile = path.join(context, 'rig-oracle-freeze-v2.txt');
  fs.writeFileSync(messageFile, oracleMessage(root));
  fs.rmSync(`${messageFile}.sig`, { force: true });

  run('ssh-keygen', ['-Y', 'sign', '-f', signingKey, '-n', NAMESPACE, messageFile], { env });

  fs.writeFileSync(
    path.join(root, 'wiki/gate1/gate1.allowed-signers'),
    `${PRINCIPAL} namespaces="${NAMESPACE}" ${publicKey}\n`,
  );
  fs.renameSync(`${messageFile}.sig`, path.join(root, 'wiki/gate1/gate1.sig'));

  if (options.check !== false) check(root);
}

function usage() {
  return [
    'usage: node scripts/approve-gate1.js [lock|status|unlock] [--confirm-digest-delta <sha256>]',
    '',
    '  lock     refresh manifested test digests and sign (default)',
    '  status   verify the current signature without changing files',
    '  unlock   not supported: an armed Gate 1 cannot be disarmed',
  ].join('\n');
}

function main(argv = process.argv.slice(2)) {
  const command = argv[0] || 'lock';
  if (command === '-h' || command === '--help') {
    process.stdout.write(`${usage()}\n`);
    return;
  }
  if (command === 'status') {
    check();
    return;
  }
  if (command === 'unlock') {
    throw new Error('Gate 1 has no unlock. Edit the oracle files, then: node scripts/approve-gate1.js');
  }
  if (command !== 'lock' && command !== 'approve') {
    throw new Error(usage());
  }
  const confirmationIndex = argv.indexOf('--confirm-digest-delta');
  const confirmDigestDelta = confirmationIndex === -1 ? undefined : argv[confirmationIndex + 1];
  if (confirmationIndex !== -1 && !/^[0-9a-f]{64}$/.test(confirmDigestDelta || '')) {
    throw new Error('--confirm-digest-delta requires the exact 64-character digest printed by the refused ceremony');
  }
  approveGate1(process.cwd(), { confirmDigestDelta });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`rig gate1 approval: ${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  ENV_NAME,
  approveGate1,
  expandPath,
  loadLocalEnv,
  main,
  publicKeyForSigningKey,
  refreshManifest,
};
