#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { check, oracleMessage, parseManifest, sha256 } = require('./check-advanced-spec');
const { sshKeygenPath } = require('../rig/lib/ssh-keygen');
const traceability = require('./check-traceability');

const ENV_NAME = 'RIG_GATE1_SIGNING_KEY';
const PRINCIPAL = 'gate1-owner';
const NAMESPACE = 'rig-gate1';
const MANIFEST = path.join('wiki', 'gate1', 'testing-infrastructure.manifest');
const ALLOWED_SIGNERS = path.join('wiki', 'gate1', 'gate1.allowed-signers');

// A second programme signs under the same key, principal and namespace — one
// trust root (North star 13) — but over its own message prefix and manifest, so
// a signature for one programme never verifies for the other and signing the
// new contract cannot touch the already signed 6.0.0 oracle.
const PROGRAMMES = {
  'ai-sdlc': {
    prefix: 'rig-ai-sdlc-freeze-v1',
    manifest: path.join('wiki', 'gate1', 'ai-sdlc', 'contract.manifest'),
    signature: path.join('wiki', 'gate1', 'ai-sdlc', 'ai-sdlc.sig'),
    contract: path.join('wiki', 'specs', 'ai-sdlc-harness'),
    protected: [
      path.join('rig', 'catalog', 'baseline', 'check-traceability.js'),
      path.join('tests', 'ai-sdlc', '_harness.js'),
      path.join('tests', 'traceability-invariant.test.js'),
    ],
  },
};
// The public-key comment field is not verification data (ssh-keygen -Y verify
// never reads it) and local keys carry personal/device labels by default —
// pin it to a neutral constant so the committed file never leaks one.
const KEY_COMMENT = 'gate1-signing-key';

function neutralizeKeyComment(publicKey) {
  const [keyType, keyData] = publicKey.trim().split(/\s+/);
  return `${keyType} ${keyData} ${KEY_COMMENT}`;
}

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
  run(sshKeygenPath(), ['-lf', '-'], { input: `${publicKey.trim()}\n` });
}

function publicKeyForSigningKey(signingKey) {
  if (signingKey.endsWith('.pub')) {
    const publicKey = fs.readFileSync(signingKey, 'utf8').trim();
    validatePublicKey(publicKey);
    return publicKey;
  }
  const publicKey = run(sshKeygenPath(), ['-y', '-f', signingKey]).trim();
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

function programme(name) {
  const selected = PROGRAMMES[name];
  assert.ok(selected, `unknown programme "${name}" (known: ${Object.keys(PROGRAMMES).join(', ')})`);
  return selected;
}

function programmeMessage(root, name) {
  const spec = programme(name);
  return `${spec.prefix}\ncontract.manifest ${sha256(fs.readFileSync(path.join(root, spec.manifest)))}\n`;
}

// Refuse to sign an incomplete graph: implementation planning may not start
// while a requirement, criterion, test, journey or package mapping is missing.
function traceabilityPreflight(root, name) {
  const dir = path.join(root, programme(name).contract);
  const errors = traceability.validate(traceability.parse(dir));
  assert.equal(errors.length, 0, `traceability graph is incomplete; Gate 1 refused:\n  - ${errors.join('\n  - ')}`);
}

function programmeProtectedFiles(root = process.cwd(), name = 'ai-sdlc') {
  const spec = programme(name);
  const contractFiles = ['15-gate1-contract.md', '16-test-manifest.md', '17-customer-lifecycle.md']
    .map((file) => path.join(spec.contract, file));
  const testManifest = path.join(root, spec.contract, '16-test-manifest.md');
  assert.ok(fs.existsSync(testManifest), `missing protected file: ${path.relative(root, testManifest)}`);
  const testFiles = [...fs.readFileSync(testManifest, 'utf8').matchAll(/`(tests\/ai-sdlc\/[^`]+\.test\.js)`/g)]
    .map((match) => match[1]);
  for (const file of testFiles) {
    assert.match(file, /^tests\/ai-sdlc\/[A-Za-z0-9_.-]+\.test\.js$/, `invalid proving-test path: ${file}`);
  }
  assert.ok(testFiles.length, 'the AI-SDLC test manifest names no proving-test files');
  const files = [...new Set([...spec.protected, ...contractFiles, ...testFiles]
    .map((file) => file.split(path.sep).join('/')))].sort();
  for (const file of files) assert.ok(fs.existsSync(path.join(root, file)), `missing protected file: ${file}`);
  return files;
}

function refreshProgrammeManifest(root, name, confirmation) {
  const spec = programme(name);
  const manifestPath = path.join(root, spec.manifest);
  const before = fs.readFileSync(manifestPath, 'utf8');
  const lines = programmeProtectedFiles(root, name).map((file) => {
    const absolute = path.join(root, file);
    return `${sha256(fs.readFileSync(absolute))}  ${file}`;
  });
  const after = lines.length ? `${lines.join('\n')}\n` : '';
  const rearming = fs.existsSync(path.join(root, spec.signature));
  if (before !== after || rearming) {
    const expected = digest(`${spec.prefix}\ncontract.manifest ${sha256(Buffer.from(after))}\n`);
    assert.equal(
      confirmation,
      expected,
      `contract digest confirmation required\n${manifestDelta(before, after)}\nrerun with --confirm-digest-delta ${expected}`,
    );
  }
  if (before !== after) fs.writeFileSync(manifestPath, after);
  return lines.length;
}

function verifyProgramme(root = process.cwd(), name = 'ai-sdlc') {
  const spec = programme(name);
  traceabilityPreflight(root, name);
  const entries = parseManifest(fs.readFileSync(path.join(root, spec.manifest), 'utf8'));
  const listed = entries.map(({ file }) => file);
  const expected = programmeProtectedFiles(root, name);
  const missing = expected.filter((file) => !listed.includes(file));
  const unexpected = listed.filter((file, index) => expected.includes(file) ? listed.indexOf(file) !== index : true);
  assert.equal(
    missing.length + unexpected.length,
    0,
    `${name} contract manifest protected set mismatch; missing: ${missing.join(', ') || 'none'}; unexpected or duplicate: ${unexpected.join(', ') || 'none'}`,
  );
  const allowed = path.join(root, ALLOWED_SIGNERS);
  assert.ok(fs.existsSync(allowed), `${ALLOWED_SIGNERS} is missing: the one trust root is not established`);
  const signature = path.join(root, spec.signature);
  assert.ok(fs.existsSync(signature), `${name} contract is unsigned (${spec.signature} is missing)`);
  const result = spawnSync(sshKeygenPath(), [
    '-Y', 'verify', '-f', allowed, '-I', PRINCIPAL, '-n', NAMESPACE, '-s', signature,
  ], { input: programmeMessage(root, name), encoding: 'utf8' });
  assert.equal(result.status, 0, `${name} contract signature does not verify`);
  for (const { digest: want, file } of entries) {
    const absolute = path.join(root, file);
    assert.ok(fs.existsSync(absolute), `missing protected file: ${file}`);
    assert.equal(sha256(fs.readFileSync(absolute)), want, `changed protected file: ${file}`);
  }
  return { armed: true, principal: PRINCIPAL, programme: name };
}

function approveProgramme(root = process.cwd(), name = 'ai-sdlc', options = {}) {
  const spec = programme(name);
  const env = { ...process.env, ...(options.env || {}) };
  defaultSecretiveAgent(env);
  const configured = loadLocalEnv(root, env);
  assert.ok(configured, `set ${ENV_NAME} or copy .credentials/gate1.env.example to .context/gate1.env`);
  const signingKey = path.resolve(root, expandPath(configured));
  assert.ok(fs.existsSync(signingKey), `${ENV_NAME} does not exist: ${signingKey}`);
  const publicKey = neutralizeKeyComment(publicKeyForSigningKey(signingKey));

  traceabilityPreflight(root, name);

  // One trust root: the new programme never enrolls a key, it reuses the one
  // already trusted. A different key is a hard refusal, not a second signer.
  const allowed = path.join(root, ALLOWED_SIGNERS);
  if (fs.existsSync(allowed)) {
    const enrolled = fs.readFileSync(allowed, 'utf8').split('\n')
      .map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
    assert.equal(enrolled.length, 1, `${ALLOWED_SIGNERS} must hold exactly one principal`);
    const [principal] = enrolled[0].split(/\s+/);
    assert.equal(principal, PRINCIPAL, `unexpected principal ${principal} in ${ALLOWED_SIGNERS}`);
    assert.ok(
      enrolled[0].includes(publicKey.split(/\s+/)[1]),
      'the configured signing key is not the enrolled Gate 1 key; Rig has one trust root',
    );
  } else {
    fs.mkdirSync(path.dirname(allowed), { recursive: true });
    fs.writeFileSync(allowed, `${PRINCIPAL} namespaces="${NAMESPACE}" ${publicKey}\n`);
  }

  fs.mkdirSync(path.dirname(path.join(root, spec.manifest)), { recursive: true });
  if (options.refresh !== false) refreshProgrammeManifest(root, name, options.confirmDigestDelta);

  const context = path.join(root, '.context');
  fs.mkdirSync(context, { recursive: true });
  const messageFile = path.join(context, `${spec.prefix}.txt`);
  fs.writeFileSync(messageFile, programmeMessage(root, name));
  fs.rmSync(`${messageFile}.sig`, { force: true });
  run(sshKeygenPath(), ['-Y', 'sign', '-f', signingKey, '-n', NAMESPACE, messageFile], { env });
  fs.renameSync(`${messageFile}.sig`, path.join(root, spec.signature));

  if (options.check !== false) verifyProgramme(root, name);
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

  run(sshKeygenPath(), ['-Y', 'sign', '-f', signingKey, '-n', NAMESPACE, messageFile], { env });

  // Validate that the existing allowed-signers file has no non-owner principals
  const allowedSignersPath = path.join(root, 'wiki/gate1/gate1.allowed-signers');
  if (fs.existsSync(allowedSignersPath)) {
    const existingContent = fs.readFileSync(allowedSignersPath, 'utf8');
    for (const line of existingContent.split('\n')) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Extract the principal (first word) and reject if it's not the owner
      const parts = trimmed.split(/\s+/);
      if (parts.length > 0 && parts[0] !== PRINCIPAL) {
        throw new Error(`unexpected principal ${parts[0]} in gate1.allowed-signers (expected ${PRINCIPAL})`);
      }
    }
  }

  fs.writeFileSync(
    allowedSignersPath,
    `${PRINCIPAL} namespaces="${NAMESPACE}" ${neutralizeKeyComment(publicKey)}\n`,
  );
  fs.renameSync(`${messageFile}.sig`, path.join(root, 'wiki/gate1/gate1.sig'));

  if (options.check !== false) check(root);
}

function usage() {
  return [
    'usage: node scripts/approve-gate1.js [lock|status|unlock] [--programme <name>] [--confirm-digest-delta <sha256>]',
    '',
    '  lock       refresh manifested test digests and sign (default)',
    '  status     verify the current signature without changing files',
    '  unlock     not supported: an armed Gate 1 cannot be disarmed',
    '',
    `  --programme  sign a second contract under the same key (${Object.keys(PROGRAMMES).join(', ')});`,
    '               omit it for the 6.0.0 oracle, which the flag never modifies',
  ].join('\n');
}

function main(argv = process.argv.slice(2)) {
  const command = argv[0] || 'lock';
  if (command === '-h' || command === '--help') {
    process.stdout.write(`${usage()}\n`);
    return;
  }
  const programmeIndex = argv.indexOf('--programme');
  const programmeName = programmeIndex === -1 ? undefined : argv[programmeIndex + 1];
  if (programmeName) {
    const confirmIndex = argv.indexOf('--confirm-digest-delta');
    if (command === 'status') {
      const verified = verifyProgramme(process.cwd(), programmeName);
      process.stdout.write(`${programmeName} contract protected: principal=${verified.principal}\n`);
      return;
    }
    if (command !== 'lock' && command !== 'approve') throw new Error(usage());
    approveProgramme(process.cwd(), programmeName, {
      confirmDigestDelta: confirmIndex === -1 ? undefined : argv[confirmIndex + 1],
    });
    process.stdout.write(`${programmeName} contract signed; the 6.0.0 oracle is unchanged\n`);
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
  PROGRAMMES,
  approveGate1,
  approveProgramme,
  expandPath,
  loadLocalEnv,
  main,
  programmeMessage,
  programmeProtectedFiles,
  publicKeyForSigningKey,
  refreshManifest,
  refreshProgrammeManifest,
  traceabilityPreflight,
  verifyProgramme,
};
