#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { check, oracleMessage } = require('./check-advanced-spec');

const ENV_NAME = 'RIG_GATE1_SIGNING_KEY';
const PRINCIPAL = 'gate1-owner';
const NAMESPACE = 'rig-gate1';

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
  if (!env.SSH_AUTH_SOCK && fs.existsSync(socket)) env.SSH_AUTH_SOCK = socket;
}

function approveGate1(root = process.cwd(), options = {}) {
  const env = { ...process.env, ...(options.env || {}) };
  defaultSecretiveAgent(env);
  const configured = loadLocalEnv(root, env);
  assert.ok(configured, `set ${ENV_NAME} or create .context/gate1.env`);

  const signingKey = path.resolve(root, expandPath(configured));
  assert.ok(fs.existsSync(signingKey), `${ENV_NAME} does not exist: ${signingKey}`);

  const publicKey = publicKeyForSigningKey(signingKey);
  const context = path.join(root, '.context');
  fs.mkdirSync(context, { recursive: true });

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

if (require.main === module) {
  try {
    approveGate1();
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
  publicKeyForSigningKey,
};
