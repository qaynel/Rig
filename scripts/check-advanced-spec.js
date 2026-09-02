#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const GATE_DIR = path.join('wiki', 'gate1');
const MANIFEST = path.join(GATE_DIR, 'testing-infrastructure.manifest');

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function read(root, rel) {
  return fs.readFileSync(path.join(root, rel));
}

function oracleMessage(root) {
  const business = sha256(read(root, path.join(GATE_DIR, 'business-spec.md')));
  const acceptance = sha256(read(root, path.join(GATE_DIR, 'acceptance.md')));
  const manifest = sha256(read(root, MANIFEST));
  return `rig-oracle-freeze-v2\nbusiness-spec.md ${business}\nacceptance.md ${acceptance}\ntesting-infrastructure.manifest ${manifest}\n`;
}

function parseManifest(text) {
  const entries = text.trimEnd().split('\n').filter(Boolean).map((line) => {
    const match = line.match(/^([0-9a-f]{64})  ([A-Za-z0-9._/-]+)$/);
    assert.ok(match, `invalid oracle manifest line: ${line}`);
    assert.ok(!path.isAbsolute(match[2]) && !match[2].split('/').includes('..'), `unsafe oracle path: ${match[2]}`);
    return { digest: match[1], file: match[2] };
  });
  const files = entries.map(({ file }) => file);
  assert.deepEqual(files, [...files].sort(), 'oracle manifest paths must be sorted');
  assert.equal(new Set(files).size, files.length, 'oracle manifest paths must be unique');
  return entries;
}

function verifyManifest(root) {
  const entries = parseManifest(read(root, MANIFEST).toString('utf8'));
  for (const { digest, file } of entries) {
    const absolute = path.join(root, file);
    assert.ok(fs.statSync(absolute).isFile(), `missing oracle file: ${file}`);
    assert.equal(sha256(fs.readFileSync(absolute)), digest, `changed oracle file: ${file}`);
  }
  return entries;
}

function signerPrincipals(text) {
  return text.split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .flatMap((line) => line.split(/\s+/, 1)[0].split(','));
}

function signerFingerprint(text, principal) {
  for (const line of text.split('\n').map((value) => value.trim()).filter(Boolean)) {
    if (line.startsWith('#') || !line.split(/\s+/, 1)[0].split(',').includes(principal)) continue;
    const fields = line.split(/\s+/);
    const keyIndex = fields.findIndex((field) => /^(?:ssh-|ecdsa-|sk-)/.test(field));
    assert.ok(keyIndex >= 0 && fields[keyIndex + 1], `allowed signer ${principal} has no public key`);
    const result = spawnSync('ssh-keygen', ['-lf', '-'], {
      input: `${fields[keyIndex]} ${fields[keyIndex + 1]}\n`,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, `cannot fingerprint allowed signer ${principal}`);
    const match = result.stdout.match(/\b(SHA256:[A-Za-z0-9+/]+)\b/);
    assert.ok(match, `cannot read fingerprint for allowed signer ${principal}`);
    return match[1];
  }
  throw new Error(`allowed signer principal not found: ${principal}`);
}

function verifySignature(root, message) {
  const allowed = path.join(root, GATE_DIR, 'gate1.allowed-signers');
  if (!fs.existsSync(allowed)) {
    process.stdout.write('Gate 1 unprotected\n');
    return { armed: false };
  }

  const signature = path.join(root, GATE_DIR, 'gate1.sig');
  assert.ok(fs.existsSync(signature), 'armed oracle is missing gate1.sig');
  const allowedText = fs.readFileSync(allowed, 'utf8');
  const principals = signerPrincipals(allowedText);
  assert.ok(principals.length > 0, 'gate1.allowed-signers has no principal');

  // Enforce exactly one principal
  assert.equal(principals.length, 1, `oracle requires exactly one principal, found ${principals.length}`);
  const principal = principals[0];

  // Verify against the single principal
  const result = spawnSync('ssh-keygen', [
    '-Y', 'verify', '-f', allowed, '-I', principal,
    '-n', 'rig-gate1', '-s', signature,
  ], { input: message, encoding: 'utf8' });
  if (result.status === 0) {
    const fingerprint = signerFingerprint(allowedText, principal);
    process.stdout.write(`Gate 1 protected: principal=${principal} fingerprint=${fingerprint}\n`);
    return { armed: true, principal, fingerprint };
  }
  throw new Error('oracle signature does not verify');
}

function acceptanceIds(text) {
  return [...new Set([...text.matchAll(/^- \*\*(AT-[A-Z]+-?\d+)/gm)].map((match) => match[1]))].sort();
}

function traceIds(text) {
  return [...new Set([...text.matchAll(/^\| (AT-[A-Z]+-?\d+) \|/gm)].map((match) => match[1]))].sort();
}

function testTitleIds(root, files) {
  const ids = [];
  for (const file of files.filter((name) => name.startsWith('tests/') && name.endsWith('.test.js'))) {
    const source = read(root, file).toString('utf8');
    for (const match of source.matchAll(/\btest\(\s*['"`](AT-[A-Z]+-?\d+)\b/g)) ids.push(match[1]);
  }
  return [...new Set(ids)].sort();
}

function traceTargets(text) {
  return [...text.matchAll(/^\| (AT-[A-Z]+-?\d+) \|[^|]*\| `([^`]+\.test\.js)` title `([^`]+)`:/gm)]
    .map((match) => ({ id: match[1], file: match[2], title: match[3] }));
}

function verifyCoverage(root, entries) {
  const accepted = acceptanceIds(read(root, path.join(GATE_DIR, 'acceptance.md')).toString('utf8'));
  const technicalSpec = read(root, path.join('wiki', 'gate2', 'technical-spec.md')).toString('utf8');
  const traced = traceIds(technicalSpec);
  const titled = testTitleIds(root, entries.map(({ file }) => file));
  const targets = traceTargets(technicalSpec);
  const manifested = new Set(entries.map(({ file }) => file));
  assert.equal(accepted.length, 83, 'Gate 1 must contain exactly 83 active acceptance IDs');
  assert.deepEqual(traced, accepted, 'technical-spec trace IDs must exactly match Gate 1');
  assert.deepEqual(titled, accepted, 'manifested test titles must exactly match Gate 1');
  assert.deepEqual(targets.map(({ id }) => id).sort(), accepted, 'every trace row must name one test target');
  for (const { id, file, title } of targets) {
    assert.ok(manifested.has(file), `trace target is not manifested: ${file}`);
    assert.ok(title.startsWith(`${id} `), `trace title does not start with ${id}`);
    const source = read(root, file).toString('utf8');
    assert.match(source, new RegExp(`\\btest\\(\\s*['\"\\x60]${title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}['\"\\x60]`));
  }
  return titled.length;
}

function verifyPackageScripts(root) {
  const expected = JSON.parse(read(root, path.join(GATE_DIR, 'package-scripts.json')));
  const actual = JSON.parse(read(root, 'package.json')).scripts;
  assert.deepEqual(actual, expected, 'package.json scripts differ from the signed oracle snapshot');
  assert.match(actual.test, /^node scripts\/check-advanced-spec\.js && npm run test:code$/, 'oracle verifier must run first');
}

function verifyTechnicalApproach(root) {
  const spec = path.join(root, 'wiki', 'gate2', 'technical-spec.md');
  assert.ok(fs.existsSync(spec), 'technical-spec.md is missing');
  assert.ok(fs.statSync(spec).isFile(), 'technical-spec.md is missing');
  assert.match(fs.readFileSync(spec, 'utf8'), /^# Tier 2 Advanced - Working Implementation Design v\d+\.\d+/);
}

function check(root = ROOT) {
  const message = oracleMessage(root);
  const signature = verifySignature(root, message);
  const entries = verifyManifest(root);
  verifyPackageScripts(root);
  verifyTechnicalApproach(root);
  const caseCount = verifyCoverage(root, entries);
  process.stdout.write(`Oracle verified: ${entries.length} files, ${caseCount} acceptance cases\n`);
  return signature;
}

if (require.main === module) {
  try {
    check();
  } catch (error) {
    process.stderr.write(`rig oracle: ${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  acceptanceIds,
  check,
  oracleMessage,
  parseManifest,
  sha256,
  signerPrincipals,
  signerFingerprint,
  testTitleIds,
  traceIds,
  traceTargets,
  verifyCoverage,
  verifyManifest,
  verifyPackageScripts,
  verifySignature,
  verifyTechnicalApproach,
};
