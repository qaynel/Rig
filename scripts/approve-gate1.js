#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
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

function loadLocalEnv(root, env = process.env) {
  const local = path.join(root, '.context', 'gate1.env');
  if (!fs.existsSync(local) || env[ENV_NAME]) return env[ENV_NAME];
  for (const line of fs.readFileSync(local, 'utf8').split('\n')) {
    const match = line.match(/^(?:export\s+)?RIG_GATE1_SIGNING_KEY=(.*)$/);
    if (match) return unquote(match[1]);
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

function refreshManifest(root) {
  const manifestPath = path.join(root, MANIFEST);
  const entries = parseManifest(fs.readFileSync(manifestPath, 'utf8'));
  const lines = entries.map(({ file }) => {
    const absolute = path.join(root, file);
    assert.ok(fs.existsSync(absolute), `missing oracle file: ${file}`);
    return `${sha256(fs.readFileSync(absolute))}  ${file}`;
  });
  fs.writeFileSync(manifestPath, lines.length ? `${lines.join('\n')}\n` : '');
  return entries.length;
}

function approveGate1(root = process.cwd(), options = {}) {
  const env = { ...process.env, ...(options.env || {}) };
  defaultSecretiveAgent(env);
  const configured = loadLocalEnv(root, env);
  assert.ok(configured, `set ${ENV_NAME} or copy scripts/gate1.env.example to .context/gate1.env`);

  const signingKey = path.resolve(root, expandPath(configured));
  assert.ok(fs.existsSync(signingKey), `${ENV_NAME} does not exist: ${signingKey}`);

  const publicKey = publicKeyForSigningKey(signingKey);
  const context = path.join(root, '.context');
  fs.mkdirSync(context, { recursive: true });

  if (options.refresh !== false) refreshManifest(root);

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
    'usage: node scripts/approve-gate1.js [lock|status|unlock]',
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
  approveGate1();
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
