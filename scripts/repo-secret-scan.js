'use strict';

const { spawnSync } = require('node:child_process');

const PATCH_EXAMPLES = new Set([
  ['-placeholder filter passes obvious docs examples (e.g. `', 'AKIAIOSFODNN7', 'EXAMPLE', '`):'].join(''),
  ['-// keys like ', 'AKIAIOSFODNN7', 'EXAMPLE', ' are bare tokens, so the guard still catches them.'].join(''),
  ['-  /example/i, // ', 'AKIAIOSFODNN7', 'EXAMPLE', ' etc — AWS docs convention'].join(''),
  ['-    // The JSON-escaped form ("private_key": "-----BEGIN ', 'PRIVATE KEY-----', '\\n...)'].join(''),
]);
const CONTENT_RULES = [
  ['pem-private-key', /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/],
  ['putty-private-key', /PuTTY-User-Key-File-\d/],
  ['aws-access-key-id', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['aws-secret-access-key', /aws_secret_access_key\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}/i],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ['slack-token', /\bxox[baprse]-[A-Za-z0-9-]{10,}/],
  ['stripe-live-key', /\b[sr]k_live_[A-Za-z0-9]{16,}\b/],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}\b/],
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
  ['legacy-gate1-signer-artifact', /^project-dev-docs\/current\/gate1\.(sig|allowed-signers)$/],
];

function scanFiles(files) {
  const hits = [];
  for (const { path: rel, content } of files) {
    for (const [rule, re] of PATH_RULES) if (re.test(rel)) hits.push(`${rel}: ${rule}`);
    content.toString('utf8').split(/\r?\n/).forEach((line, i) => {
      if (rel === 'rig/corpus/upstream/patches/shelf-overlay.patch' && PATCH_EXAMPLES.has(line)) return;
      for (const [rule, re] of CONTENT_RULES) if (re.test(line)) hits.push(`${rel}:${i + 1}: ${rule}`);
    });
  }
  return hits.sort();
}

function scanStagedSnapshot(cwd) {
  const git = (args) => spawnSync('git', args, { cwd, encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 });
  const listed = git(['ls-files', '-z', '--cached']);
  if (listed.status !== 0) throw new Error('could not enumerate staged wiki files');
  const files = [];
  for (const rel of listed.stdout.toString('utf8').split('\0').filter(Boolean)) {
    const blob = git(['show', `:${rel}`]);
    if (blob.status !== 0) throw new Error('could not read staged wiki snapshot');
    files.push({ path: rel, content: blob.stdout });
  }
  return scanFiles(files);
}

module.exports = { scanFiles, scanStagedSnapshot, CONTENT_RULES, PATH_RULES };
